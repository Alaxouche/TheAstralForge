/**
 * hash-assets.mjs
 * Replaces every `?v=<assets_version>` in the built HTML with a hash of the
 * file it points at. Runs last, after minification, so the hash matches the
 * bytes visitors actually receive.
 *
 * Why: assets_version in _config.yml was bumped by hand. Forget it and every
 * returning visitor keeps the old CSS — and because sw.js caches static assets
 * by URL, they can keep it for a long time. A content hash makes the URL change
 * exactly when the content does, and stay put when it does not.
 *
 *   node scripts/hash-assets.mjs [--dir _site]
 */
import { createHash } from 'node:crypto';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const dirArg = args.indexOf('--dir');
const ROOT = dirArg !== -1 ? args[dirArg + 1] : '_site';

// href="/assets/…​.css?v=anything" / src="/assets/…​.js?v=anything"
const REF = /(href|src)="([^"?]+\.(?:css|js))\?v=[^"]*"/g;

const hashes = new Map();

async function hashOf(urlPath) {
  if (hashes.has(urlPath)) return hashes.get(urlPath);
  let digest = null;
  try {
    const file = path.join(ROOT, decodeURIComponent(urlPath));
    const buf = await readFile(file);
    digest = createHash('sha256').update(buf).digest('hex').slice(0, 10);
  } catch {
    digest = null; // Not a local file (or missing) — leave that reference alone.
  }
  hashes.set(urlPath, digest);
  return digest;
}

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

let pages = 0;
let rewritten = 0;
const unresolved = new Set();

for await (const file of walk(ROOT)) {
  if (path.extname(file) !== '.html') continue;

  const html = await readFile(file, 'utf8');
  const matches = [...html.matchAll(REF)];
  if (!matches.length) continue;

  let out = html;
  let changed = false;

  for (const [full, attr, urlPath] of matches) {
    const digest = await hashOf(urlPath);
    if (!digest) {
      unresolved.add(urlPath);
      continue;
    }
    out = out.split(full).join(`${attr}="${urlPath}?v=${digest}"`);
    changed = true;
    rewritten += 1;
  }

  if (changed) {
    await writeFile(file, out, 'utf8');
    pages += 1;
  }
}

if (unresolved.size) {
  console.warn('hash-assets: could not resolve, left untouched —');
  unresolved.forEach((u) => console.warn('  ' + u));
}

console.log(
  `hash-assets: ${rewritten} references across ${pages} pages, ${hashes.size} distinct assets`
);
