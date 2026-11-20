/* taf-rebuild: rebuilds theastralforge.com when a modlist is updated, without a git push.
   Every hour it compares the lists' modlist.json on GitHub with /build-info.json, which the site's
   build publishes (the versions and dates it was built with). When a list changed, it calls the
   Workers Builds deploy hook of the site, so the pages show the new version, size and date.
   Secret: DEPLOY_HOOK_URL (setup steps in README.md next to this file).
   Visiting the Worker's own URL shows what it would do, without triggering anything. */

const MODLIST_JSON = 'https://raw.githubusercontent.com/Alaxouche/Wunduniik/main/modlist.json';
const BUILD_INFO = 'https://theastralforge.com/build-info.json';

const sig = (lists) => lists
  .map((e) => `${e.title}|${e.version}|${e.dateUpdated}`)
  .sort()
  .join('\n');

async function check() {
  const [gh, built] = await Promise.all([
    fetch(MODLIST_JSON, { headers: { 'User-Agent': 'taf-rebuild' }, cf: { cacheTtl: 0 } }).then((r) => (r.ok ? r.json() : null)),
    fetch(BUILD_INFO, { cf: { cacheTtl: 0 } }).then((r) => (r.ok ? r.json() : null)),
  ]);
  if (!Array.isArray(gh)) return { rebuild: false, reason: 'modlist.json unreachable' };
  if (!built || !Array.isArray(built.lists)) return { rebuild: true, reason: 'build-info.json missing' };
  const now = sig(gh), was = sig(built.lists);
  return now === was
    ? { rebuild: false, reason: 'up to date', builtAt: built.builtAt }
    : { rebuild: true, reason: 'a modlist changed', builtAt: built.builtAt };
}

export default {
  async scheduled(event, env, ctx) {
    const r = await check();
    if (!r.rebuild) return;
    if (!env.DEPLOY_HOOK_URL) throw new Error('DEPLOY_HOOK_URL is not set');
    const res = await fetch(env.DEPLOY_HOOK_URL, { method: 'POST' });
    if (!res.ok) throw new Error(`deploy hook answered ${res.status}`);
  },

  async fetch() {
    const r = await check().catch((e) => ({ error: String(e) }));
    return new Response(JSON.stringify(r, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
  },
};
