# Usage: python scripts/make-og.py        (run from the project root after a build; needs Pillow, numpy, PyYAML)
"""Social preview images (og:image), one per page: what Discord, Reddit or X show when a link is pasted.

Reads the page list from _site/search.json (so run `npm run build` first), writes
assets/og/<slug>.jpg (1200 x 630) and assets/og/manifest.json. The build points og:image
at the picture when it exists, and falls back to the emblem card otherwise.

Modlist pages: the list's own screenshot, darkened, with the site gold.
Other pages: the honeycomb header (assets/Images/hex-hero.webp).
Unchanged pages are skipped (hash of their text and of this script's STYLE), stale pictures removed.
"""
import hashlib
import json
import re
import sys
from pathlib import Path

import numpy as np
import yaml
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'assets' / 'og'
W, H = 1200, 630
STYLE = '4'                      # bump to redraw every picture after a design change
# Struck metal: Cormorant Garamond titles, brass serif italic kicker; the wordmark keeps Jost (the logo does not change)
FONTS = ROOT / 'theme' / 'assets' / 'fonts'
FONT = FONTS / 'jost-latin.woff2'
SERIF = FONTS / 'cormorant-latin.woff2'
SERIF_I = FONTS / 'cormorant-italic-latin.woff2'
SANS = FONTS / 'alegreya-sans-500-latin.woff2'
GOLD = (214, 162, 78)
BRASS = (240, 201, 119)
HI = (244, 236, 224)
MUTED = (168, 153, 138)
BG = (13, 10, 8)
HEAT = [(90, 26, 8), (184, 68, 26), (233, 134, 46), (246, 207, 122)]


def font(size, weight, path=FONT):
    f = ImageFont.truetype(str(path), size)
    try:
        f.set_variation_by_axes([weight])
    except Exception:
        pass
    return f


def tracked(draw, xy, text, f, fill, track):
    """Draw text with letter spacing (Pillow has none), return the end x."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=f, fill=fill)
        x += f.getlength(ch) + track
    return x


def tracked_len(text, f, track):
    return sum(f.getlength(c) for c in text) + track * max(len(text) - 1, 0)


def wrap(text, f, track, width):
    words, lines, cur = text.split(), [], ''
    for w in words:
        t = (cur + ' ' + w).strip()
        if tracked_len(t, f, track) <= width or not cur:
            cur = t
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def cover(path, w, h):
    im = Image.open(path).convert('RGB')
    s = max(w / im.width, h / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    x, y = (im.width - w) // 2, (im.height - h) // 2
    return im.crop((x, y, x + w, y + h))


def shade(im, strength):
    """Darken towards the left (where the text sits) and the bottom."""
    a = np.asarray(im, np.float32)
    xs = np.linspace(0, 1, W, dtype=np.float32)[None, :, None]
    ys = np.linspace(0, 1, H, dtype=np.float32)[:, None, None]
    left = (1 - strength * np.clip(1.2 - xs * 1.25, 0, 1)) * (1 - 0.25 * strength)
    bottom = 1 - 0.35 * np.clip((ys - 0.55) / 0.45, 0, 1)
    bg = np.array(BG, np.float32)
    a = bg + (a - bg) * left * bottom
    return Image.fromarray(a.clip(0, 255).astype(np.uint8))


def hex_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def modlists():
    out = {}
    for idx in ROOT.glob('_*/index.md'):
        txt = idx.read_text(encoding='utf-8')
        m = re.match(r'^---\s*\n(.*?)\n---', txt, re.S)
        if not m:
            continue
        fm = yaml.safe_load(m.group(1)) or {}
        if 'project_banner' not in fm:
            continue
        pb = fm['project_banner']
        out[fm.get('title')] = {
            'game': fm.get('game', ''),
            'accent': pb.get('accent', '#d6a24e'),
            'image': (pb.get('image') or fm.get('image') or '').lstrip('/'),
        }
    return out


def slug(url):
    s = url.strip('/').replace('/', '--')
    return s or 'home'


def card(page, ml, emblem, hexbg, cache):
    title = page['t'] if page['u'] != '/' else 'The Astral Forge'
    if ml:
        key = ml['image']
        if key not in cache:
            cache[key] = shade(cover(ROOT / key, W, H).filter(ImageFilter.GaussianBlur(1.6)), 0.86) if key and (ROOT / key).exists() else hexbg
        im = cache[key].copy()
        accent = GOLD                       # one colour for every list
        kicker = f"{page['s']}  ·  {ml['game']}" if ml['game'] else page['s']
    else:
        im = hexbg.copy()
        accent = GOLD
        kicker = 'Wabbajack modlists' if page['u'] == '/' else ''
    d = ImageDraw.Draw(im)
    pad = 72
    # brand row
    im.paste(emblem, (pad, 58), emblem)
    tracked(d, (pad + 70, 70), 'THE ASTRAL FORGE', font(22, 500), HI, 7)
    # kicker
    if kicker:
        d.text((pad, 236), kicker, font=font(36, 500, SERIF_I), fill=BRASS)
    # title: Cormorant in normal case, the largest size that fits in three lines
    for size in (112, 100, 90, 80, 72, 64, 56):
        f = font(size, 600, SERIF)
        lines = wrap(title, f, 0, W - pad * 2 - 40)
        if len(lines) <= 3:
            break
    y = 286
    for ln in lines:
        d.text((pad, y), ln, font=f, fill=HI)
        y += int(size * 0.98)
    # footer
    d.text((pad, H - 76), 'theastralforge.com', font=font(22, 500, SANS), fill=MUTED)
    # molten bar: the heat gradient along the bottom edge
    xs = np.linspace(0, 1, W)
    stops = np.linspace(0, 1, len(HEAT))
    bar = np.stack([np.interp(xs, stops, [c[i] for c in HEAT]) for i in range(3)], -1)
    im.paste(Image.fromarray(np.repeat(bar[None], 6, 0).astype(np.uint8)), (0, H - 6))
    return im


def main():
    idx = ROOT / '_site' / 'search.json'
    if not idx.exists():
        sys.exit('No _site/search.json: run "npm run build" first.')
    pages = json.loads(idx.read_text(encoding='utf-8'))
    OUT.mkdir(parents=True, exist_ok=True)
    man_path = OUT / 'manifest.json'
    manifest = json.loads(man_path.read_text(encoding='utf-8')) if man_path.exists() else {}
    mls = modlists()
    em = Image.open(ROOT / 'assets' / 'logos' / 'emblem.webp').convert('RGBA')
    em.thumbnail((52, 52), Image.LANCZOS)
    hexbg = shade(cover(ROOT / 'assets' / 'Images' / 'hex-hero.webp', W, H), 0.55)
    cache, keep, made = {}, {}, 0
    for p in pages:
        s = slug(p['u'])
        ml = mls.get(p['s']) if p['s'] else None
        h = hashlib.sha1(json.dumps([STYLE, p['t'], p['s'], p['u'], ml], sort_keys=True).encode()).hexdigest()[:12]
        keep[s] = h
        dest = OUT / f'{s}.jpg'
        if manifest.get(s) == h and dest.exists():
            continue
        card(p, ml, em, hexbg, cache).save(dest, 'JPEG', quality=80, optimize=True, progressive=True)
        made += 1
    for f in OUT.glob('*.jpg'):
        if f.stem not in keep:
            f.unlink()
    man_path.write_text(json.dumps(keep, indent=1, sort_keys=True), encoding='utf-8')
    print(f'{len(keep)} pages, {made} pictures written to assets/og/')


if __name__ == '__main__':
    main()
