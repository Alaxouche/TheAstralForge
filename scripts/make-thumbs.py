# Usage: python scripts/make-thumbs.py        (run from the project root, needs Pillow)
"""Smaller copies of the screenshots, used by the build for grids and srcset.

For every image under assets/Images (except _thumbs/ and guides/), writes
assets/Images/_thumbs/<same path>-480.webp and -960.webp when the original is wider,
and records sizes in assets/Images/_thumbs/manifest.json:
  { "/assets/Images/Skyrim/x.webp": {"w": 2560, "h": 1440, "t": {"480": "/assets/...-480.webp", ...}} }
Up-to-date thumbnails are skipped, so it is cheap to run on every deploy.
The build falls back to the original image when an entry or a file is missing.
"""
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'assets' / 'Images'
OUT = SRC / '_thumbs'
WIDTHS = (480, 960)
SKIP = {'_thumbs', 'guides'}

manifest, made = {}, 0
for f in sorted(SRC.rglob('*')):
    rel = f.relative_to(SRC)
    if not f.is_file() or rel.parts[0] in SKIP or f.suffix.lower() not in ('.webp', '.jpg', '.jpeg', '.png'):
        continue
    with Image.open(f) as im:
        w, h = im.size
        entry = {'w': w, 'h': h, 't': {}}
        for tw in WIDTHS:
            if w <= tw * 1.25:
                continue
            dest = OUT / rel.parent / f'{f.stem}-{tw}.webp'
            if not dest.exists() or dest.stat().st_mtime < f.stat().st_mtime:
                dest.parent.mkdir(parents=True, exist_ok=True)
                t = im.convert('RGB').resize((tw, round(h * tw / w)), Image.LANCZOS)
                t.save(dest, 'WEBP', quality=78, method=6)
                made += 1
            entry['t'][str(tw)] = '/' + dest.relative_to(ROOT).as_posix()
    manifest['/' + f.relative_to(ROOT).as_posix()] = entry

OUT.mkdir(parents=True, exist_ok=True)
(OUT / 'manifest.json').write_text(json.dumps(manifest, indent=1, ensure_ascii=False), encoding='utf8')
print(f'{len(manifest)} images, {made} thumbnails written')
