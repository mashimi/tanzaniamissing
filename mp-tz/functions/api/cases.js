export const onRequestGet = async ({ env }) => {
  const { results } = await env.DB.prepare(
    "SELECT data FROM cases ORDER BY published_at DESC"
  ).all();
  return Response.json(
    { cases: results.map(r => JSON.parse(r.data)) },
    { headers: { "cache-control": "public, max-age=60" } },
  );
};
