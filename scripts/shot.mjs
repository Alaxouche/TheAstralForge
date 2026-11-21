// Screenshot a page of the local site in a given state. Needs the dev server (npm run dev).
//
//   node scripts/shot.mjs <path or url> [out.png] [options]
//
//   --w 1440 --h 900     viewport (default 1440x900)
//   --mobile             390x844 at 2x with touch (real phone width, no iframe trick needed)
//   --theme light|dark   sets localStorage['taf-theme'] before the page loads
//   --lang fr|en         sets localStorage['sg-lang'] before the page loads (default en)
//   --full               whole page instead of the viewport
//   --panel N            home page: strike forge section N in (0 = The Forge, 1-5 the lists); add --wait 2500
//                        so the 3D scene, the strike and the text effects have finished
//   --at "selector"      scroll this element to the top before the capture
//   --js "code"          run this in the page before the capture
//   --still              prefers-reduced-motion: reduce (entrance animations settle at once)
//   --wait 1500          ms to wait after load (default 1500)
//   --matrix             dark+light x desktop+mobile: four files in one run
//
// With no out.png the file goes to <tmp>/taf-shots/ and its path is printed.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { launch, sleep } from './browser.mjs';

const argv = process.argv.slice(2);
const flags = {}; const rest = [];
const BOOL = new Set(['mobile', 'full', 'still', 'matrix']);
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a.startsWith('--')) { const k = a.slice(2); flags[k] = BOOL.has(k) ? true : argv[++i]; }
  else rest.push(a);
}
if (!rest[0]) { console.error('Usage: node scripts/shot.mjs <path or url> [out.png] [--mobile] [--theme light] [--lang fr] [--full] [--panel N] [--matrix]'); process.exit(1); }
// Git Bash rewrites an argument like /hub/ into C:/Program Files/Git/hub/: undo that, and accept "hub/" or "home".
let page = rest[0];
if (/^[A-Za-z]:[\\/]/.test(page)) page = page.replace(/\\/g, '/').replace(/^.*?\/Git\//i, '/');
if (page === 'home' || page === '.') page = '/';
const url = /^(https?|file):/.test(page) ? page : 'http://localhost:4000' + (page.startsWith('/') ? '' : '/') + page;
const slug = new URL(url).pathname.replace(/^\/|\/$/g, '').replace(/[^\w-]+/g, '-') || 'home';
const outDir = path.join(os.tmpdir(), 'taf-shots');

async function shot({ mobile, theme, lang, out }) {
  const w = mobile ? 390 : +(flags.w || 1440), h = mobile ? 844 : +(flags.h || 900);
  const b = await launch({ width: w, height: h });
  try {
    await b.send('Page.enable');
    await b.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: mobile ? 2 : 1, mobile: !!mobile });
    if (mobile) await b.send('Emulation.setTouchEmulationEnabled', { enabled: true });
    if (flags.still) await b.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await b.send('Page.addScriptToEvaluateOnNewDocument', { source:
      `try { localStorage.setItem('sg-lang', ${JSON.stringify(lang)}); localStorage.setItem('taf-theme', ${JSON.stringify(theme)}); } catch (e) {}` });
    await b.send('Page.navigate', { url });
    for (let i = 0; i < 100; i++) { if (await b.evalJs('document.readyState') === 'complete') break; await sleep(100); }
    await b.evalJs('document.fonts.ready.then(() => 1)');
    if (flags.panel != null) await b.evalJs(`(() => { const a = document.querySelectorAll('.forge__rail a')[${+flags.panel}]; if (a) a.click(); })()`);
    if (flags.at) await b.evalJs(`document.querySelector(${JSON.stringify(flags.at)})?.scrollIntoView({ block: 'start', behavior: 'instant' })`);
    if (flags.js) await b.evalJs(flags.js);
    await sleep(+(flags.wait || 1500));
    const params = { format: 'png' };
    if (flags.full) {
      // Lazy images only load near the viewport: walk the page once, then capture beyond it.
      const height = await b.evalJs(`(async () => { const H = () => document.documentElement.scrollHeight;
        for (let y = 0; y < H(); y += innerHeight) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
        scrollTo(0, 0); await new Promise((r) => setTimeout(r, 300)); return H(); })()`);
      params.captureBeyondViewport = true;
      params.clip = { x: 0, y: 0, width: w, height: Math.min(height, 16000), scale: 1 };
    }
    const res = await b.send('Page.captureScreenshot', params);
    if (!res.result?.data) throw new Error('Capture failed: ' + JSON.stringify(res.error || res));
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, Buffer.from(res.result.data, 'base64'));
    console.log(out);
  } finally { await b.close(); }
}

const lang = flags.lang || 'en';
if (flags.matrix) {
  const base = rest[1] ? rest[1].replace(/\.png$/i, '') : path.join(outDir, slug);
  for (const theme of ['dark', 'light']) for (const mobile of [false, true])
    await shot({ mobile, theme, lang, out: `${base}-${mobile ? 'mobile' : 'desktop'}-${theme}.png` });
} else {
  const theme = flags.theme || 'dark', mobile = !!flags.mobile;
  await shot({ mobile, theme, lang, out: rest[1] || path.join(outDir, `${slug}-${mobile ? 'mobile' : 'desktop'}-${theme}-${lang}.png`) });
}
process.exit(0);
