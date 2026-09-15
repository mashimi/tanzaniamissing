export const onRequestGet = async ({ env }) => {
  const url = env.SIGNAL_CONTACT_URL;
  if (!url) return new Response("Not configured", { status: 404 });
  return new Response(null, {
    status: 302,
    headers: { location: url, "cache-control": "no-store" },
  });
};
