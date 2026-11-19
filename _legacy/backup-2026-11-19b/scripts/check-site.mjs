// Checks the built site in _site/ (run `npm run build` first):
//   - every internal link, image, srcset candidate and asset points to a file that exists
//   - every <img> has an alt attribute (alt="" is fine for decorative images)
//   - no <img> is loaded from another site (guide screenshots live in assets/Images/guides)
// Exits with code 1 when something is wrong. No dependencies.
//
//   node scripts/check-site.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, '_site');
if (!fs.existsSync(OUT)) { console.error('_site/ not found: run npm run build first'); process.exit(2); }

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const pages = walk(OUT).filter((f) => f.endsWith('.html'));

function resolves(url) {
  let p = url.split('#')[0].split('?')[0];
  if (!p) return true;
  try { p = decodeURI(p); } catch { return false; }
  const f = path.join(OUT, p);
  if (!f.startsWith(OUT)) return false;
  return fs.existsSync(f) && fs.statSync(f).isFile()
    || fs.existsSync(path.join(f, 'index.html'))
    || fs.existsSync(f + '.html');
}

const problems = [];
let checked = 0;
for (const file of pages) {
  const rel = '/' + path.relative(OUT, file).replace(/\\/g, '/');
  const html = fs.readFileSync(file, 'utf8')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')       // inline JS builds URLs at runtime
    .replace(/<pre\b[\s\S]*?<\/pre>|<code\b[\s\S]*?<\/code>/g, '');
  const report = (msg) => problems.push(`${rel}: ${msg}`);

  for (const m of html.matchAll(/\s(?:href|src|data-zoom)="(\/(?!\/)[^"]*)"/g)) {
    checked++;
    if (!resolves(m[1])) report(`broken link ${m[1]}`);
  }
  for (const m of html.matchAll(/\ssrcset="([^"]*)"/g)) {
    for (const cand of m[1].split(',').map((s) => s.trim().split(/\s+/)[0]).filter(Boolean)) {
      checked++;
      if (cand.startsWith('/') && !resolves(cand)) report(`broken srcset candidate ${cand}`);
    }
  }
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    if (!/\salt=/.test(tag)) report(`image without alt: ${tag.slice(0, 120)}`);
    const src = (tag.match(/\ssrc="([^"]*)"/) || [])[1] || '';
    if (/^(https?:)?\/\//.test(src)) report(`external image ${src.slice(0, 120)}`);
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n✗ ${problems.length} problem(s) in ${pages.length} pages (${checked} internal URLs checked)`);
  process.exit(1);
}
console.log(`✓ ${pages.length} pages, ${checked} internal URLs, all images have alt and are local`);
