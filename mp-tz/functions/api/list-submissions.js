export const onRequestGet = async ({ request, env }) => {
  const auth = request.headers.get("authorization") ?? "";
  const token = (env.MODERATOR_TOKEN ?? "").trim();
  if (!token || auth !== `Bearer ${token}`)
    return new Response("unauthorized", { status: 401 });

  const { results } = await env.DB.prepare(
    "SELECT id, payload, triage, suggestions, created_at FROM submissions WHERE status='pending' ORDER BY id"
  ).all();
  return Response.json({ submissions: results });
};
