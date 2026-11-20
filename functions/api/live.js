/* GET /api/live: the live data of every page in one same-site request.
   Cloudflare Pages Function. Fetches the lists' modlist.json (GitHub) and the Discord widget,
   keeps the combined answer 2 minutes in Cloudflare's cache, and returns only what the pages use:
     { modlists: [{ title, version, dateUpdated, download_metadata: { TotalSize, NumberOfArchives } }],
       discord: { online } }
   Visitors no longer call GitHub and Discord themselves. site.js falls back to those two
   addresses when this endpoint is missing (local dev server) or fails. No secret needed. */

const MODLIST_JSON = 'https://raw.githubusercontent.com/Alaxouche/Wunduniik/main/modlist.json';
const DISCORD_WIDGET = 'https://discord.com/api/guilds/750268919201398805/widget.json';
const TTL = 120; // seconds

async function getJson(url) {
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'theastralforge.com live data' } });
    return r.ok ? await r.json() : null;
  } catch {
    return null;
  }
}

export async function onRequestGet({ request, waitUntil }) {
  const cache = caches.default;
  const key = new Request(new URL('/api/live', request.url).toString(), { method: 'GET' });
  const hit = await cache.match(key);
  if (hit) return hit;

  const [lists, widget] = await Promise.all([getJson(MODLIST_JSON), getJson(DISCORD_WIDGET)]);
  if (!Array.isArray(lists) && !widget) {
    return new Response(JSON.stringify({ error: 'upstream' }), { status: 502, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
  }
  const body = {
    modlists: Array.isArray(lists) ? lists.map((e) => ({
      title: e.title,
      version: e.version,
      dateUpdated: e.dateUpdated,
      download_metadata: e.download_metadata
        ? { TotalSize: e.download_metadata.TotalSize, NumberOfArchives: e.download_metadata.NumberOfArchives }
        : undefined,
    })) : null,
    discord: widget && widget.presence_count ? { online: widget.presence_count } : null,
  };
  const res = new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': `public, max-age=${TTL}` },
  });
  waitUntil(cache.put(key, res.clone()));
  return res;
}
