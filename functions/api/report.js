/* POST /api/report: the "Report a bug" form sends its report straight to a Discord channel.
   Cloudflare Pages Function (deployed with the site by `wrangler pages deploy`, which uploads
   this functions/ folder). Needs one secret in the Pages project:
     DISCORD_WEBHOOK_URL  the channel's webhook (Discord: channel settings > Integrations > Webhooks)
   Without it the endpoint answers 503 and the page falls back to "copy the preview".
   Spam guards: same-origin check, hidden honeypot field, minimum fill time, size limits, and no
   mention can ping anyone (allowed_mentions). */

const LIMITS = { title: 200, type: 40, project: 80, contact: 80, details: 3500, links: 1000 };
const TYPES = ['Bug report', 'Crash', 'Install issue', 'Load order issue'];

const json = (status, body) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
});
const clean = (v, max) => String(v ?? '').replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim().slice(0, max);

export async function onRequestPost({ request, env }) {
  if (!env.DISCORD_WEBHOOK_URL) return json(503, { ok: false, error: 'not-configured' });

  // Same-origin only: the form lives on this site
  const origin = request.headers.get('Origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) return json(403, { ok: false, error: 'origin' });

  let body;
  try { body = await request.json(); } catch { return json(400, { ok: false, error: 'bad-json' }); }
  if (!body || typeof body !== 'object') return json(400, { ok: false, error: 'bad-json' });

  // Bots fill every field and post at once; people leave the hidden one empty and take a few seconds
  if (body.website) return json(200, { ok: true });
  if (typeof body.elapsed === 'number' && body.elapsed < 4000) return json(429, { ok: false, error: 'too-fast' });

  const r = {};
  for (const [k, max] of Object.entries(LIMITS)) r[k] = clean(body[k], max);
  if (!TYPES.includes(r.type)) r.type = 'Bug report';
  if (r.title.length < 5 || r.details.length < 20) return json(422, { ok: false, error: 'too-short' });

  const links = r.links.split('\n').map((l) => l.trim()).filter((l) => /^https?:\/\/\S+$/i.test(l)).slice(0, 8);
  const fields = [];
  if (r.project) fields.push({ name: 'Modlist', value: r.project, inline: true });
  fields.push({ name: 'Type', value: r.type, inline: true });
  if (r.contact) fields.push({ name: 'Contact', value: r.contact, inline: true });
  if (links.length) fields.push({ name: 'Links', value: links.join('\n').slice(0, 1024) });

  const payload = {
    username: 'The Astral Forge',
    allowed_mentions: { parse: [] },
    embeds: [{
      title: r.title.slice(0, 256),
      description: r.details.slice(0, 4096),
      color: r.type === 'Crash' ? 0xd4574e : 0xc9a96e,
      fields,
      footer: { text: 'theastralforge.com/report-a-bug' },
      timestamp: new Date().toISOString(),
    }],
  };

  const res = await fetch(env.DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (res.status === 429) return json(429, { ok: false, error: 'busy' });
  if (!res.ok) return json(502, { ok: false, error: 'discord' });
  return json(200, { ok: true });
}

export function onRequest() {
  return json(405, { ok: false, error: 'method' });
}
