# Usage: python scripts/make-emblem.py assets/source/emblem-source.png assets/logos
"""Build the site logo files from the emblem source (white emblem rendered with a glow
on a dark background).

Only the solid white strokes are kept: alpha comes from a tight luminance threshold,
so the glow and the dark background are dropped. No glow is added back.
Transparent files are saved lossless (lossy WebP darkens semi-transparent pixels).
"""
import sys
from pathlib import Path
from PIL import Image, ImageOps, ImageFilter

src = Path(sys.argv[1])
out = Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)

lum = ImageOps.grayscale(Image.open(src).convert("RGB"))
# Strokes are 252-255; the glow right next to them (and inside the ring's gaps) is 240-251.
STROKE = 252
alpha = lum.point(lambda v: 255 if v >= STROKE else 0)
alpha = alpha.filter(ImageFilter.MedianFilter(5))          # drop specks of glow
alpha = alpha.filter(ImageFilter.GaussianBlur(0.8))        # anti-aliased edges
# Trim to the emblem and pad it to a square with a small margin
box = alpha.getbbox()
alpha = alpha.crop(box)
side = round(max(alpha.size) * 1.04)
sq = Image.new("L", (side, side), 0)
sq.paste(alpha, ((side - alpha.width) // 2, (side - alpha.height) // 2))
emblem = Image.new("RGBA", sq.size, (255, 255, 255, 0))
emblem.putalpha(sq)


def sized(s):
    return emblem.resize((s, s), Image.LANCZOS)


sized(640).save(out / "emblem.webp", "WEBP", lossless=True, method=6)
sized(128).save(out / "emblem-mark.webp", "WEBP", lossless=True, method=6)

# Opaque versions (favicon, app icons, social card): white emblem on the site background
BG = (7, 8, 10, 255)
for s, pad in ((180, .14), (192, .16), (512, .16)):
    c = Image.new("RGBA", (s, s), BG)
    inner = round(s * (1 - 2 * pad))
    c.alpha_composite(sized(inner), ((s - inner) // 2, (s - inner) // 2))
    c.convert("RGB").save(out / f"emblem-{s}.png", optimize=True)
# Browser tab icon: transparent, the emblem fills the whole square.
# favicon.svg wraps a 96 px PNG and turns it dark when the browser uses a light theme
# (a white emblem would vanish on a light tab); favicon-32.png is the fallback (Safari).
import base64, io
tight = emblem.crop(emblem.getbbox())
tsq = Image.new("RGBA", (max(tight.size),) * 2, (255, 255, 255, 0))
tsq.paste(tight, ((tsq.width - tight.width) // 2, (tsq.height - tight.height) // 2))
tsq.resize((32, 32), Image.LANCZOS).save(out / "favicon-32.png", optimize=True)
buf = io.BytesIO()
tsq.resize((96, 96), Image.LANCZOS).save(buf, "PNG", optimize=True)
b64 = base64.b64encode(buf.getvalue()).decode()
(out / "favicon.svg").write_text(
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 96 96">'
    '<style>@media (prefers-color-scheme: light) { image { filter: brightness(0) opacity(.85); } }</style>'
    f'<image width="96" height="96" href="data:image/png;base64,{b64}" xlink:href="data:image/png;base64,{b64}"/></svg>\n',
    encoding="utf-8")
og = Image.new("RGBA", (1200, 630), BG)
og.alpha_composite(sized(420), (390, 105))
og.convert("RGB").save(out / "emblem-og.jpg", "JPEG", quality=90, optimize=True, progressive=True)
print("ok", box)
