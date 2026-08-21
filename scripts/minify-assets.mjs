/**
 * minify-assets.mjs
 * Minifies the built CSS and JS in _site, in place, after `jekyll build`.
 *
 * Why a post-build step: the site bundles (assets/skyground/site.css and
 * site.js) are plain .css/.js files concatenated by Liquid, so Jekyll's
 * `sass: style: compressed` never touches them — it only applies to .scss.
 * They were shipping to every page with their comments intact.
 *
 * Identifier renaming is off by default. The JS bundle is a concatenation of
 * classic scripts that share globals across file boundaries (features.js
 * defines showToast, other files call it), and renaming top-level names in
 * that setting is the one transform that could quietly break them. Whitespace
 * and syntax compression carry nearly all of the win without that risk.
 *
 *   node scripts/minify-assets.mjs [--identifiers] [--dir _site]
 */
import { transform } from 'esbuild';
import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const minifyIdentifiers = args.includes('--identifiers');
const dirArg = args.indexOf('--dir');
const ROOT = dirArg !== -1 ? args[dirArg + 1] : '_site';

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

const KB = (n) => (n / 1024).toFixed(1);

let before = 0;
let after = 0;
let count = 0;
const failures = [];

// Pagefind ships its own already-minified runtime plus a WebAssembly loader.
// Running it through a second minifier gains nothing and risks breaking search.
const SKIP = [path.join(ROOT, 'pagefind') + path.sep];

for await (const file of walk(ROOT)) {
  const ext = path.extname(file);
  if (ext !== '.css' && ext !== '.js') continue;
  if (SKIP.some((prefix) => file.startsWith(prefix))) continue;

  const source = await readFile(file, 'utf8');
  const originalSize = Buffer.byteLength(source);
  if (originalSize === 0) continue;

  try {
    const result = await transform(source, {
      loader: ext === '.css' ? 'css' : 'js',
      minifyWhitespace: true,
      minifySyntax: true,
      minifyIdentifiers,
      legalComments: 'none',
      // Classic <script> files, not modules — keep top-level semantics.
      format: undefined,
      // es2020 keeps dynamic import() intact — search-system.js uses it to
      // load Pagefind, and an older target would try to lower it.
      target: ext === '.css' ? 'chrome90' : 'es2020',
    });

    const outSize = Buffer.byteLength(result.code);
    // A "minified" file that grew is a sign something went sideways; keep the
    // original rather than shipping it.
    if (outSize >= originalSize) continue;

    await writeFile(file, result.code, 'utf8');
    before += originalSize;
    after += outSize;
    count += 1;
  } catch (err) {
    failures.push(`${file}: ${err.message}`);
  }
}

if (failures.length) {
  console.error('minify: failed on these files —');
  failures.forEach((f) => console.error('  ' + f));
  process.exit(1);
}

const saved = before - after;
const pct = before ? ((saved / before) * 100).toFixed(1) : '0';
console.log(
  `minify: ${count} files, ${KB(before)} KB -> ${KB(after)} KB (-${KB(saved)} KB, -${pct}%)`
);
