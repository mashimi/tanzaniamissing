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

  if (body.action === "purge_imported") {
    const days = String(Math.max(1, Number(body.older_than_days ?? 30)));
    const res = await env.DB.prepare(
      "DELETE FROM submissions WHERE status='imported' AND created_at < datetime('now', ?)"
    ).bind(`-${days} days`).run();
    return Response.json({ ok: true, deleted: res.meta?.changes ?? 0 });
  }

  return new Response("unknown action", { status: 400 });
};
