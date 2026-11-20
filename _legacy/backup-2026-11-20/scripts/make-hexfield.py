# Usage: python scripts/make-hexfield.py [out_dir]     (needs Pillow + numpy)
"""Background of the home "The Forge" panel: a honeycomb wall seen in slight perspective.

Writes two images with the same geometry, so they can be cross-faded:
  forge-hex-dark.webp  panel at rest: dark tiles, faint gold seams
  forge-hex-lit.webp   panel open: the seams heat up in clusters, gold bloom
Edges fade into the site background (#07080a). Deterministic (fixed seed).
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

W, H = 2560, 1440
R = 58.0                      # hex circumradius in plane units
BG = np.array([7, 8, 10], np.float32) / 255
GOLD = np.array([201, 169, 110], np.float32) / 255
HOT = np.array([255, 214, 150], np.float32) / 255
S3 = np.sqrt(3.0)

out = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent / 'assets' / 'Images'

ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
# Mild perspective: the wall leans back, tiles get smaller towards the top.
t = ys / H
depth = 0.62 + 0.38 * t                       # 0.62 at the top, 1 at the bottom
u = (xs - W * 0.56) / depth
v = (np.cumsum(1 / depth[:, :1], axis=0) - 1).repeat(W, 1)   # integrated vertical scale
v = v - v[H // 2, 0]

# Pointy-top hex grid: fractional axial coords, cube rounding
q = (S3 / 3 * u - v / 3) / R
r = (2 / 3 * v) / R
x3, z3 = q, r
y3 = -x3 - z3
rx, ry, rz = np.round(x3), np.round(y3), np.round(z3)
dx, dy, dz = np.abs(rx - x3), np.abs(ry - y3), np.abs(rz - z3)
fix_x = (dx > dy) & (dx > dz)
fix_y = ~fix_x & (dy > dz)
rx = np.where(fix_x, -ry - rz, rx)
ry = np.where(fix_y, -rx - rz, ry)
rz = np.where(~fix_x & ~fix_y, -rx - ry, rz)
cu = R * S3 * (rx + rz / 2)
cv = R * 1.5 * rz
lx, ly = u - cu, v - cv
apo = R * S3 / 2
hn = np.maximum.reduce([np.abs(lx), np.abs(lx * 0.5 + ly * S3 / 2), np.abs(lx * 0.5 - ly * S3 / 2)])
edge = (apo - hn) * depth                      # distance to the tile edge, in pixels

def smooth(a, b, x):
    k = np.clip((x - a) / (b - a), 0, 1)
    return k * k * (3 - 2 * k)

GAP = 2.2
seam = 1 - smooth(GAP * 0.5, GAP * 0.5 + 1.4, edge)          # 1 in the gap between tiles
face = 1 - seam

# Per-tile random value (stable hash of the tile coords)
hsh = np.sin(rx * 127.1 + rz * 311.7) * 43758.5453
rnd = hsh - np.floor(hsh)

# Bevel: light from the top left catches the upper-left rim of each tile
rim = 1 - smooth(0, 9, edge - GAP * 0.5)
nl = np.sqrt(lx * lx + ly * ly) + 1e-3
lit_dir = (-lx * 0.6 - ly * 0.8) / nl
bevel = rim * lit_dir

# Heat: a few hot spots on the right and centre, the left stays cool for the text
def blob(cx, cy, s):
    return np.exp(-(((xs - cx) / s) ** 2 + ((ys - cy) / (s * 0.8)) ** 2))
heat = (0.95 * blob(W * 0.62, H * 0.40, 300) + 0.75 * blob(W * 0.80, H * 0.66, 260)
        + 0.55 * blob(W * 0.47, H * 0.70, 200) + 0.45 * blob(W * 0.90, H * 0.22, 220))
heat = np.clip(heat, 0, 1)
tile_on = smooth(0.35, 0.75, heat * (0.45 + 0.9 * rnd))       # whole tiles that light up

# Fade into the page: vignette plus darker top and bottom
cxn, cyn = (xs / W - 0.56) / 0.62, (ys / H - 0.48) / 0.62
vign = 1 - smooth(0.55, 1.15, np.sqrt(cxn ** 2 + cyn ** 2))
vign *= smooth(0.0, 0.22, t) * (1 - 0.55 * smooth(0.7, 1.0, t))

def render(level):
    base = 0.035 + 0.025 * rnd + 0.09 * np.clip(bevel, -0.4, 1)    # tile faces, slightly uneven
    col = BG[None, None, :] + (base * face)[..., None] * np.array([0.92, 0.96, 1.05], np.float32)
    # glowing seams
    glow_seam = seam * (0.06 + level * (0.55 * heat + 0.9 * tile_on))
    # lit tiles: faint warm fill and a brighter inner rim
    fill = face * tile_on * level * (0.015 + 0.26 * (1 - smooth(0, 22, edge - GAP)))
    emis = np.clip(glow_seam + fill, 0, 2)
    # bloom
    e8 = (emis * 255).clip(0, 255).astype(np.uint8)
    img = Image.fromarray(e8, 'L')
    b1 = np.asarray(img.filter(ImageFilter.GaussianBlur(6)), np.float32) / 255
    b2 = np.asarray(img.filter(ImageFilter.GaussianBlur(40)), np.float32) / 255
    emis_total = emis + 0.9 * b1 + 1.6 * b2 * level
    hot = np.clip((emis_total - 1.1) * 0.8, 0, 1)[..., None]
    tint = GOLD[None, None, :] * (1 - hot) + HOT[None, None, :] * hot
    col = col + emis_total[..., None] * tint * 0.8
    col = BG[None, None, :] + (col - BG[None, None, :]) * vign[..., None]
    # tiny noise against banding in the dark gradients
    rng = np.random.default_rng(7)
    col = col + (rng.random((H, W, 1), np.float32) - 0.5) / 255
    return Image.fromarray((np.clip(col, 0, 1) * 255 + 0.5).astype(np.uint8), 'RGB')

for name, level in (('forge-hex-dark', 0.16), ('forge-hex-lit', 1.0)):
    p = out / f'{name}.webp'
    render(level).save(p, 'WEBP', quality=82, method=6)
    print(p, p.stat().st_size // 1024, 'KB')
