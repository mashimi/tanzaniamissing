export const onRequestPost = async ({ request, env }) => {
  const auth = request.headers.get("authorization") ?? "";
  const token = (env.MODERATOR_TOKEN ?? "").trim();
  if (!token || auth !== `Bearer ${token}`)
    return new Response("unauthorized", { status: 401 });

  let body;
  try { body = await request.json(); } catch { return new Response("bad json", { status: 400 }); }

  if (body.action === "mark_imported" && Array.isArray(body.ids) && body.ids.length) {
    const placeholders = body.ids.map(() => "?").join(",");
    await env.DB.prepare(
      `UPDATE submissions SET status='imported' WHERE id IN (${placeholders})`
    ).bind(...body.ids).run();
    return Response.json({ ok: true, marked: body.ids.length });
  }

  if (body.action === "reject" && Array.isArray(body.ids) && body.ids.length) {
    const placeholders = body.ids.map(() => "?").join(",");
    await env.DB.prepare(
      `UPDATE submissions SET status='rejected' WHERE id IN (${placeholders})`
    ).bind(...body.ids).run();
    return Response.json({ ok: true, rejected: body.ids.length });
  }

  if (body.action === "publish" && Array.isArray(body.ids) && body.ids.length) {
    const placeholders = body.ids.map(() => "?").join(",");
    const { results } = await env.DB.prepare(
      `SELECT id, payload, suggestions, created_at FROM submissions WHERE id IN (${placeholders}) AND status='pending'`
    ).bind(...body.ids).all();

    const stmts = [];
    const published = [];
    for (const s of results) {
      const b = JSON.parse(s.payload);
      const sug = s.suggestions ? JSON.parse(s.suggestions) : {};
      if (!b.full_name || !b.last_seen_date || !b.location_region) continue;

      const slug = b.full_name.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
      const id = `SUB-${String(s.id).padStart(4, "0")}-${slug || "unnamed"}`;
      const age = Number(b.age ?? sug.age);
      const lat = Math.round(parseFloat(b.location_lat ?? "-6.8") * 100) / 100;
      const lng = Math.round(parseFloat(b.location_lng ?? "39.3") * 100) / 100;

      // Same shape as records/*.json — same privacy rules as build-data.mjs
      const record = {
        id,
        full_name: String(b.full_name).trim(),
        age: Number.isFinite(age) && age > 0 ? age : null,
        gender: ["male", "female", "other"].includes(b.gender) ? b.gender : "unknown",
        photo_path: /^https:\/\//.test(b.photo_path ?? "") ? b.photo_path : "",
        last_seen_date: b.last_seen_date,
        location: {
          name: b.location_name ?? "",
          latitude: Number.isFinite(lat) ? lat : -6.8,
          longitude: Number.isFinite(lng) ? lng : 39.3,
          region: b.location_region,
          district: b.location_district ?? sug.district ?? "",
        },
        status: "missing",
        circumstances: b.circumstances ?? "",
        tags: [],
        verified: false, // only a human sets this, after 2-source verification
        sources: [],
        is_public: true,
        created_at: s.created_at,
      };
      stmts.push(env.DB.prepare("INSERT OR REPLACE INTO cases (id, data) VALUES (?, ?)").bind(id, JSON.stringify(record)));
      published.push(id);
    }

    if (stmts.length) await env.DB.batch(stmts);
    if (results.length) {
      await env.DB.prepare(
        `UPDATE submissions SET status='imported' WHERE id IN (${placeholders})`
      ).bind(...results.map(s => s.id)).run();
    }
    return Response.json({ ok: true, published });
  }

  if (body.action === "archive" && typeof body.case_id === "string") {
    if (!env.GITHUB_TOKEN) return Response.json({ error: "GITHUB_TOKEN not configured" }, { status: 500 });

    const sources = Array.isArray(body.sources)
      ? body.sources.map(s => String(s).trim()).filter(Boolean)
      : [];
    if (sources.length < 2)
      return Response.json({ error: "at least 2 sources are required for a verified archive" }, { status: 400 });

    const row = await env.DB.prepare("SELECT data FROM cases WHERE id = ?").bind(body.case_id).first();
    if (!row) return Response.json({ error: "case not found" }, { status: 404 });
    const c = JSON.parse(row.data);

    const status = ["missing", "found_alive", "found_deceased", "unknown"].includes(body.status)
      ? body.status : "missing";
    const age = Number(body.age);
    const district = typeof body.district === "string" && body.district.trim()
      ? body.district.trim() : c.location.district;

    const record = {
      id: c.id,
      full_name: c.full_name,
      age: Number.isFinite(age) && age > 0 ? age : (c.age ?? null),
      gender: c.gender ?? "unknown",
      photo_path: c.photo_path ?? "",
      last_seen_date: c.last_seen_date,
      location: { ...c.location, district },
      status,
      circumstances: c.circumstances ?? "",
      tags: c.tags ?? [],
      verified: true,
      sources,
      is_public: true,
      created_at: c.created_at,
    };

    const repo = env.GITHUB_REPO ?? "mashimi/tanzaniamissing";
    const branch = env.GITHUB_BRANCH ?? "main";
    const file = `mp-tz/records/${c.id}.json`;
    const api = `https://api.github.com/repos/${repo}/contents/${file}`;
    const ghHeaders = {
      authorization: `Bearer ${env.GITHUB_TOKEN}`,
      "user-agent": "mp-tz-moderation",
      accept: "application/vnd.github+json",
      "content-type": "application/json",
    };

    // base64 that survives unicode
    const contentStr = JSON.stringify(record, null, 2) + "\n";
    const bytes = new TextEncoder().encode(contentStr);
    let bin = "";
    bytes.forEach(b => { bin += String.fromCharCode(b); });

    try {
      // Update if the file already exists, create otherwise
      let sha;
      const get = await fetch(`${api}?ref=${branch}`, { headers: ghHeaders });
      if (get.ok) sha = (await get.json()).sha;

      const put = await fetch(api, {
        method: "PUT",
        headers: ghHeaders,
        body: JSON.stringify({
          message: `Add verified record ${c.id} (via moderation dashboard)`,
          content: btoa(bin),
          branch,
          ...(sha ? { sha } : {}),
        }),
      });
      if (!put.ok) {
        const t = await put.text();
        return Response.json({ error: `GitHub API ${put.status}: ${t.slice(0, 200)}` }, { status: 502 });
      }
      var html_url = (await put.json()).content?.html_url ?? null;
    } catch (e) {
      return Response.json({ error: `GitHub request failed: ${e.message}` }, { status: 502 });
    }

    // Keep the D1 copy in sync (same verified data) so /api/cases agrees with the static record
    const synced = { ...record, archived: true };
    await env.DB.prepare("UPDATE cases SET data = ? WHERE id = ?").bind(JSON.stringify(synced), c.id).run();

    return Response.json({ ok: true, file, html_url });
  }

  if (body.action === "unpublish" && typeof body.case_id === "string") {
    await env.DB.prepare("DELETE FROM cases WHERE id = ?").bind(body.case_id).run();
    return Response.json({ ok: true });
  }

  if (body.action === "purge_imported") {
    const days = String(Math.max(1, Number(body.older_than_days ?? 30)));
    const res = await env.DB.prepare(
      "DELETE FROM submissions WHERE status='imported' AND created_at < datetime('now', ?)"
    ).bind(`-${days} days`).run();
    return Response.json({ ok: true, deleted: res.meta?.changes ?? 0 });
  }

  return new Response("unknown action", { status: 400 });
};
