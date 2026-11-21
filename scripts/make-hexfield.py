# Usage: python scripts/make-hexfield.py [out_dir] [name ...]     (needs Pillow + numpy)
"""Honeycomb backgrounds of the site, all from one procedural wall seen in slight perspective.

  forge-hex-dark / forge-hex-lit     home "The Forge" panel, dark theme: at rest / panel open
  forge-hex-light / forge-hex-light-lit   the same for the light theme
  forge-hex-pulse                    home "The Forge" section: every tile lit, shown in rings that pulse out from the seal
                                     (same framing as forge-hex-dark, saved at 1920 px: it is only ever seen blurred and faint)
  hex-hero        wide header (hub, CTA strip): hot clusters on the right, the left stays calm for text
  hex-void        404 header: a few tiles are missing and their rims glow
  hex-hero-light / hex-void-light   the same two for the light theme

Images sharing a geometry can be cross-faded. Edges fade into the page background
(#0d0a08 dark, #f2ece3 light: the "Struck metal" palette). Deterministic: same output on every run.
With names after out_dir, only those images are written.
"""
import math
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

S3 = np.sqrt(3.0)
BG_D = np.array([13, 10, 8], np.float32) / 255
BG_L = np.array([242, 236, 227], np.float32) / 255
GOLD = np.array([214, 162, 78], np.float32) / 255
HOT = np.array([246, 207, 122], np.float32) / 255
GOLD_DEEP = np.array([138, 98, 34], np.float32) / 255


def smooth(a, b, x):
    k = np.clip((x - a) / (b - a), 0, 1)
    return k * k * (3 - 2 * k)


def geometry(W, H, R, cx_frac, tilt):
    ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
    t = ys / H
    depth = (1 - tilt) + tilt * t                       # tiles shrink towards the top
    u = (xs - W * cx_frac) / depth
    v = (np.cumsum(1 / depth[:, :1], axis=0) - 1).repeat(W, 1)
    v = v - v[H // 2, 0]
    q = (S3 / 3 * u - v / 3) / R
    r = (2 / 3 * v) / R
    x3, z3 = q, r
    y3 = -x3 - z3
    rx, ry, rz = np.round(x3), np.round(y3), np.round(z3)
    dx, dy, dz = np.abs(rx - x3), np.abs(ry - y3), np.abs(rz - z3)
    fx = (dx > dy) & (dx > dz)
    fy = ~fx & (dy > dz)
    rx = np.where(fx, -ry - rz, rx)
    rz = np.where(~fx & ~fy, -rx - ry, rz)
    lx, ly = u - R * S3 * (rx + rz / 2), v - R * 1.5 * rz
    apo = R * S3 / 2
    hn = np.maximum.reduce([np.abs(lx), np.abs(lx * 0.5 + ly * S3 / 2), np.abs(lx * 0.5 - ly * S3 / 2)])
    g = dict(xs=xs, ys=ys, t=t, rx=rx, rz=rz, lx=lx, ly=ly, edge=(apo - hn) * depth)
    # tile centre on the wall plane: per-tile effects use it, so they never cut through a tile
    g['cu'], g['cv'] = u - lx, v - ly
    g['vrow'], g['drow'] = v[:, 0], depth[:, 0]
    g['to_plane'] = lambda fx, fy: ((W * fx - W * cx_frac) / depth[int(H * fy), 0], v[int(H * fy), 0], depth[int(H * fy), 0])
    h = np.sin(rx * 127.1 + rz * 311.7) * 43758.5453
    g['rnd'] = h - np.floor(h)
    return g


def blobs(x, y, W, H, spots):
    heat = np.zeros_like(x)
    for fx, fy, s, w in spots:
        heat += w * np.exp(-(((x - W * fx) / s) ** 2 + ((y - H * fy) / (s * 0.8)) ** 2))
    return np.clip(heat, 0, 1)


def bloom(emis, radii):
    img = Image.fromarray((np.clip(emis, 0, 1) * 255).astype(np.uint8), 'L')
    return [np.asarray(img.filter(ImageFilter.GaussianBlur(r)), np.float32) / 255 for r in radii]


def render(W, H, theme, level, spots, R=58.0, cx=0.56, tilt=0.38, void=None, vig=(0.56, 0.48, 0.62)):
    g = geometry(W, H, R, cx, tilt)
    edge, rnd, t = g['edge'], g['rnd'], g['t']
    GAP = 2.2
    seam = 1 - smooth(GAP * 0.5, GAP * 0.5 + 1.4, edge)
    face = 1 - seam
    rim = 1 - smooth(0, 9, edge - GAP * 0.5)
    nl = np.sqrt(g['lx'] ** 2 + g['ly'] ** 2) + 1e-3
    bevel = rim * (-g['lx'] * 0.6 - g['ly'] * 0.8) / nl
    heat = blobs(g['xs'], g['ys'], W, H, spots)
    tile_heat = np.zeros_like(edge)
    for fx, fy, s, w in spots:
        u0, v0, d0 = g['to_plane'](fx, fy)
        tile_heat += w * np.exp(-(((g['cu'] - u0) * d0 / s) ** 2 + ((g['cv'] - v0) * d0 / (s * 0.8)) ** 2))
    tile_heat = np.clip(tile_heat, 0, 1)
    tile_on = smooth(0.35, 0.75, tile_heat * (0.45 + 0.9 * rnd))
    inner = 1 - smooth(0, 22, edge - GAP)
    hole = np.zeros_like(edge)
    if void:
        vx, vy, vr = void
        u0, v0, d0 = g['to_plane'](vx, vy)
        d = np.sqrt(((g['cu'] - u0) * d0) ** 2 + ((g['cv'] - v0) * d0 * 1.15) ** 2)
        hole = (((d < vr) & (rnd > 0.18)) | (d < vr * 0.55)).astype(np.float32)
    cxn, cyn = (g['xs'] / W - vig[0]) / vig[2], (g['ys'] / H - vig[1]) / vig[2]
    vign = 1 - smooth(0.55, 1.15, np.sqrt(cxn ** 2 + cyn ** 2))
    vign *= smooth(0.0, 0.22, t) * (1 - 0.55 * smooth(0.7, 1.0, t))
    noise = (np.random.default_rng(7).random((H, W, 1), np.float32) - 0.5) / 255

    if theme == 'dark':
        bg = BG_D
        base = 0.035 + 0.025 * rnd + 0.09 * np.clip(bevel, -0.4, 1)
        col = bg + (base * face)[..., None] * np.array([1.06, 0.97, 0.86], np.float32)   # warm iron faces
        col = col * (1 - hole[..., None] * face[..., None])
        glow_seam = seam * (0.06 + level * (0.55 * heat + 0.9 * tile_on))
        fill = face * tile_on * (1 - hole) * level * (0.015 + 0.26 * inner)
        # missing tiles: a black pit with a thin glowing lip
        hole_rim = face * hole * (1 - smooth(0, 5, edge - GAP)) * (0.45 + 0.6 * level)
        emis = np.clip(glow_seam + fill + hole_rim, 0, 2)
        b1, b2 = bloom(emis, (6, 40))
        total = emis + 0.9 * b1 + 1.6 * b2 * max(level, 0.3 if void else 0)
        hot = np.clip((total - 1.1) * 0.8, 0, 1)[..., None]
        tint = GOLD * (1 - hot) + HOT * hot
        col = col + total[..., None] * tint * 0.8
        pit = (hole * face * smooth(2, 14, edge - GAP))[..., None]   # keep the inside of the pits dark
        col = col * (1 - pit * 0.85)
    else:
        bg = BG_L
        shade = 0.035 * np.clip(bevel, -0.6, 1) - 0.018 * rnd
        col = bg + (shade * face)[..., None]
        col = col - (seam * 0.16)[..., None] * np.array([1.0, 1.05, 1.2], np.float32)   # warm grey grout
        gold_seam = seam * np.clip(0.1 + level * (0.7 * heat + 1.0 * tile_on), 0, 1)
        col = col * (1 - gold_seam[..., None]) + GOLD_DEEP * gold_seam[..., None]
        fill = face * tile_on * level * (0.05 + 0.3 * inner)
        b1, b2 = bloom(gold_seam * level + fill, (5, 36))
        warm = np.clip(fill + 0.5 * b1 + 0.7 * b2 * level, 0, 1)[..., None]
        col = col * (1 - warm * 0.35) + (GOLD * 1.08) * warm * 0.35
        if void:
            # missing tiles: a shadowed pit, darker at the top edge, with a gold lip
            lip = face * hole * (1 - smooth(0, 4, edge - GAP))
            pit = (face * hole * smooth(1, 10, edge - GAP))[..., None]
            depth_shade = (0.2 + 0.32 * (1 - smooth(2, 26, edge - GAP)))[..., None] * np.array([1.0, 0.96, 0.9], np.float32)
            col = col * (1 - pit) + (col * depth_shade) * pit
            col = col * (1 - lip[..., None]) + GOLD_DEEP * lip[..., None]
    col = bg + (col - bg) * vign[..., None] + noise
    return Image.fromarray((np.clip(col, 0, 1) * 255 + 0.5).astype(np.uint8), 'RGB')


PANEL = [(0.62, 0.40, 300, 0.95), (0.80, 0.66, 260, 0.75), (0.47, 0.70, 200, 0.55), (0.90, 0.22, 220, 0.45)]
HERO = [(0.66, 0.52, 260, 0.95), (0.84, 0.36, 220, 0.8), (0.93, 0.70, 200, 0.5), (0.52, 0.30, 160, 0.35)]

VARIANTS = {
    'forge-hex-dark': dict(W=2560, H=1440, theme='dark', level=0.16, spots=PANEL),
    'forge-hex-lit': dict(W=2560, H=1440, theme='dark', level=1.0, spots=PANEL),
    'forge-hex-light': dict(W=2560, H=1440, theme='light', level=0.12, spots=PANEL),
    'forge-hex-light-lit': dict(W=2560, H=1440, theme='light', level=1.0, spots=PANEL),
    'forge-hex-pulse': dict(W=2560, H=1440, theme='dark', level=0.5, spots=[(0.5, 0.5, 6000, 1.0)], size=(1920, 1080)),
    'hex-hero': dict(W=2560, H=1000, theme='dark', level=0.85, spots=HERO, R=50.0, cx=0.6, tilt=0.3, vig=(0.62, 0.5, 0.7)),
    'hex-hero-light': dict(W=2560, H=1000, theme='light', level=1.0, spots=HERO, R=50.0, cx=0.6, tilt=0.3, vig=(0.62, 0.5, 0.7)),
    'hex-void': dict(W=2560, H=1000, theme='dark', level=0.3, spots=[(0.86, 0.5, 220, 0.6)], R=50.0, cx=0.6, tilt=0.3,
                     void=(0.86, 0.5, 150), vig=(0.66, 0.5, 0.7)),
    'hex-void-light': dict(W=2560, H=1000, theme='light', level=0.6, spots=[(0.86, 0.5, 220, 0.6)], R=50.0, cx=0.6, tilt=0.3,
                           void=(0.86, 0.5, 150), vig=(0.66, 0.5, 0.7)),
}

def void_tiles(name='hex-void', shrink=0.955):
    """Outlines of the missing tiles of a 'void' variant, in the image's pixel coordinates.
    404.html draws them in an SVG with the image's viewBox and preserveAspectRatio slice (the same
    framing as object-fit: cover), so they sit exactly over the holes and can fall away."""
    v = VARIANTS[name]
    W, H, R, cxf, tilt = v['W'], v['H'], v.get('R', 58.0), v.get('cx', 0.56), v.get('tilt', 0.38)
    g = geometry(W, H, R, cxf, tilt)
    vx, vy, vr = v['void']
    u0, v0, d0 = g['to_plane'](vx, vy)
    d = np.sqrt(((g['cu'] - u0) * d0) ** 2 + ((g['cv'] - v0) * d0 * 1.15) ** 2)
    hole = ((d < vr) & (g['rnd'] > 0.18)) | (d < vr * 0.55)
    keys = sorted({(int(a), int(b)) for a, b in zip(g['rx'][hole].ravel(), g['rz'][hole].ravel())})
    vrow = g['vrow']
    ys = np.arange(H, dtype=np.float32)
    tiles = []
    for rx, rz in keys:
        cu, cv = R * S3 * (rx + rz / 2), R * 1.5 * rz
        pts = []
        for k in range(6):
            a = math.radians(30 + 60 * k)
            pu, pv = cu + R * shrink * math.cos(a), cv + R * shrink * math.sin(a)
            y = float(np.interp(pv, vrow, ys))
            depth = (1 - tilt) + tilt * y / H
            pts.append((pu * depth + W * cxf, y))
        cx_, cy_ = sum(p[0] for p in pts) / 6, sum(p[1] for p in pts) / 6
        tiles.append({'p': ' '.join(f'{x:.1f},{y:.1f}' for x, y in pts), 'x': round(cx_, 1), 'y': round(cy_, 1)})
    # fall order: from the centre of the hole outwards
    cx0, cy0 = W * vx, H * vy
    tiles.sort(key=lambda t: (t['x'] - cx0) ** 2 + (t['y'] - cy0) ** 2)
    return {'w': W, 'h': H, 'tiles': tiles}


if __name__ == '__main__' and sys.argv[1:2] == ['--void-tiles']:
    import json
    out = Path(__file__).resolve().parent.parent / '_data' / 'hex_void_tiles.json'
    data = void_tiles()
    out.write_text(json.dumps(data, indent=1), encoding='utf-8')
    print(out, len(data['tiles']), 'tiles')
    sys.exit(0)

if __name__ == '__main__':
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent / 'assets' / 'Images'
    names = sys.argv[2:] or list(VARIANTS)
    for name in names:
        p = out / f'{name}.webp'
        v = dict(VARIANTS[name]); size = v.pop('size', None)
        im = render(**v)
        if size: im = im.resize(size, Image.LANCZOS)
        im.save(p, 'WEBP', quality=80 if size else 82, method=6)
        print(p, p.stat().st_size // 1024, 'KB')
