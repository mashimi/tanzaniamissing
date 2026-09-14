const MAX_BYTES = 5 * 1024 * 1024;

function text(status, msg) {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export const onRequestGet = async ({ request, env }) => {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("url") ?? "";
  if (!target) return text(400, "missing url");
  if (target.length > 2048) return text(400, "url too long");

  let parsed;
  try { parsed = new URL(target); } catch { return text(400, "bad url"); }

  if (parsed.protocol !== "https:") return text(400, "https only");
  if (
    parsed.hostname === "localhost" ||
    parsed.hostname.endsWith(".local") ||
    /^(\d{1,3}\.){3}\d{1,3}$/.test(parsed.hostname) ||
    parsed.hostname.endsWith(".internal")
  ) return text(400, "host not allowed");

  // Optional strict mode: set IMG_ALLOW_HOSTS="host1,host2" as a Pages secret
  const allow = (env.IMG_ALLOW_HOSTS ?? "")
    .split(",").map(s => s.trim()).filter(Boolean);
  if (allow.length && !allow.includes(parsed.hostname))
    return text(403, "host not in allowlist");

  let upstream;
  try {
    upstream = await fetch(target, {
      headers: { "user-agent": "mp-tz-image-proxy/1.0", accept: "image/*" },
      redirect: "follow",
      cf: { cacheTtl: 86400, cacheEverything: true },
    });
  } catch { return text(502, "upstream unreachable"); }

  if (!upstream.ok) return text(502, "upstream error");

  const ct = (upstream.headers.get("content-type") ?? "").split(";")[0].trim();
  if (!ct.startsWith("image/") || ct === "image/svg+xml")
    return text(415, "not a raster image");

  const len = Number(upstream.headers.get("content-length") ?? "0");
  if (len > MAX_BYTES) return text(413, "too large");
  const buf = await upstream.arrayBuffer();
  if (buf.byteLength > MAX_BYTES) return text(413, "too large");

  return new Response(buf, {
    headers: {
      "content-type": ct,
      "cache-control": "public, max-age=86400",
      "content-security-policy": "default-src 'none'; sandbox",
      "x-content-type-options": "nosniff",
    },
  });
};
