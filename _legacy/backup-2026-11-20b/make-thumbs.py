# Usage: python scripts/make-thumbs.py        (run from the project root, needs Pillow with AVIF support)
"""Smaller copies of the screenshots, used by the build for grids and srcset.

For every image under assets/Images (except _thumbs/ and guides/), writes
  assets/Images/_thumbs/<same path>-480.webp, -960.webp, -1600.webp when the original is wider,
  and an AVIF twin of each of them plus one of the original (<name>.avif), about 45 % lighter,
and records them in assets/Images/_thumbs/manifest.json:
  { "/assets/Images/Skyrim/x.webp": {"w": 2560, "h": 1440,
      "t": {"480": "/assets/...-480.webp", ...},
      "a": {"480": "/assets/...-480.avif", ..., "2560": "/assets/.../x.avif"}} }
The build serves the AVIF through <picture> with the WebP as the fallback.
Up-to-date files are skipped, so it is cheap to run on every deploy.
The build falls back to the original image when an entry or a file is missing.
"""
import json
from pathlib import Path
from PIL import Image, features

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'assets' / 'Images'
OUT = SRC / '_thumbs'
WIDTHS = (480, 960, 1600)
SKIP = {'_thumbs', 'guides'}
AVIF = features.check('avif')
AVIF_Q = 52          # visually close to WebP q78 on these screenshots, about 45 % smaller


def stale(dest, src):
    return not dest.exists() or dest.stat().st_mtime < src.stat().st_mtime


manifest, made = {}, 0
for f in sorted(SRC.rglob('*')):
    rel = f.relative_to(SRC)
    if not f.is_file() or rel.parts[0] in SKIP or f.suffix.lower() not in ('.webp', '.jpg', '.jpeg', '.png'):
        continue
    with Image.open(f) as im:
        w, h = im.size
        entry = {'w': w, 'h': h, 't': {}}
        if AVIF:
            entry['a'] = {}
        rgb = None
        for tw in WIDTHS + (w,):
            full = tw == w
            if not full and w <= tw * 1.25:
                continue
            base = OUT / rel.parent / (f.stem if full else f'{f.stem}-{tw}')
            webp, avif = base.with_suffix('.webp'), base.with_suffix('.avif')
            need_webp = not full and stale(webp, f)
            need_avif = AVIF and stale(avif, f)
            if need_webp or need_avif:
                base.parent.mkdir(parents=True, exist_ok=True)
                rgb = rgb or im.convert('RGB')
                t = rgb if full else rgb.resize((tw, round(h * tw / w)), Image.LANCZOS)
                if need_webp:
                    t.save(webp, 'WEBP', quality=78, method=6)
                    made += 1
                if need_avif:
                    t.save(avif, 'AVIF', quality=AVIF_Q, speed=6)
                    made += 1
            if not full:
                entry['t'][str(tw)] = '/' + webp.relative_to(ROOT).as_posix()
            if AVIF:
                entry['a'][str(tw)] = '/' + avif.relative_to(ROOT).as_posix()
    manifest['/' + f.relative_to(ROOT).as_posix()] = entry

OUT.mkdir(parents=True, exist_ok=True)
(OUT / 'manifest.json').write_text(json.dumps(manifest, indent=1, ensure_ascii=False), encoding='utf8')
print(f'{len(manifest)} images, {made} files written' + ('' if AVIF else ' (no AVIF: this Pillow lacks it)'))
