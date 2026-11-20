# Usage: python scripts/make-modlist-emblems.py        (no dependency)
"""One emblem per modlist, in the language of the site emblem (assets/logos/emblem.webp):
a thick ring broken where the motif crosses it, solid white shapes, no glow.

Writes assets/logos/emblems/<modlist id>.svg (viewBox 0 0 100 100, transparent).
  wunduniik                        a snowy mountain, three pines standing on the ring, the North Star
  krentoraan                       a crenellated tower with its gate
  ghost-of-the-grid                a broken grid, the ring glitched sideways
  no-mans-sky-explorer             a planet inside its orbit, a star
  extrasolar-containment-protocol  a hexagonal field held by two clamps, the site star inside
The home panels show them (build.mjs: modlist.emblem).
"""
import math
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / 'assets' / 'logos' / 'emblems'
INK = '#ffffff'
R, RW = 41, 6.5          # ring radius and width, matched to the site emblem


def svg(body, defs=''):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="640" height="640">'
            f'<defs>{defs}</defs>{body}</svg>\n')


def ring(mask_id=None, extra=''):
    m = f' mask="url(#{mask_id})"' if mask_id else ''
    return f'<circle cx="50" cy="50" r="{R}" fill="none" stroke="{INK}" stroke-width="{RW}"{m}{extra}/>'


def gap_mask(mid, cutters):
    """White everywhere, black around the motif: the ring is hidden where the motif crosses it."""
    return f'<mask id="{mid}" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><rect width="100" height="100" fill="#fff"/>{cutters}</mask>'


def taper(p0, c, p1, w0, w1, n=28):
    """Filled quadratic stroke whose width goes from w0 to w1."""
    left, right = [], []
    for i in range(n + 1):
        t = i / n
        x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * c[0] + t * t * p1[0]
        y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * c[1] + t * t * p1[1]
        dx = 2 * (1 - t) * (c[0] - p0[0]) + 2 * t * (p1[0] - c[0])
        dy = 2 * (1 - t) * (c[1] - p0[1]) + 2 * t * (p1[1] - c[1])
        L = math.hypot(dx, dy) or 1
        nx, ny = -dy / L, dx / L
        w = (w0 + (w1 - w0) * t) / 2
        left.append((x + nx * w, y + ny * w))
        right.append((x - nx * w, y - ny * w))
    pts = left + right[::-1]
    return 'M' + ' L'.join(f'{x:.2f} {y:.2f}' for x, y in pts) + 'Z'


def star(cx, cy, r, inner=0.2):
    pts = []
    for i in range(8):
        a = -math.pi / 2 + i * math.pi / 4
        rr = r if i % 2 == 0 else r * inner * 1.41
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    return 'M' + ' L'.join(f'{x:.2f} {y:.2f}' for x, y in pts) + 'Z'


def slash(p0, c, p1, wmax, n=36):
    """Claw scratch: pointed at both ends, widest a little past the middle."""
    left, right = [], []
    for i in range(n + 1):
        t = i / n
        x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * c[0] + t * t * p1[0]
        y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * c[1] + t * t * p1[1]
        dx = 2 * (1 - t) * (c[0] - p0[0]) + 2 * t * (p1[0] - c[0])
        dy = 2 * (1 - t) * (c[1] - p0[1]) + 2 * t * (p1[1] - c[1])
        L = math.hypot(dx, dy) or 1
        nx, ny = -dy / L, dx / L
        w = wmax * math.sin(math.pi * t ** 0.85) ** 0.8 / 2
        left.append((x + nx * w, y + ny * w))
        right.append((x - nx * w, y - ny * w))
    pts = left + right[::-1]
    return 'M' + ' L'.join(f'{x:.2f} {y:.2f}' for x, y in pts) + 'Z'


def pine(cx, top, base, half, tiers=3, trunk_to=None, trunk_w=3.2):
    """Pine silhouette: stacked tiers that widen downwards, a short trunk."""
    pts_r = [(cx, top)]
    h = (base - top) / tiers
    for i in range(tiers):
        y = top + h * (i + 1)
        w = half * (0.55 + 0.45 * (i + 1) / tiers)
        pts_r.append((cx + w, y))
        if i < tiers - 1:
            pts_r.append((cx + w * 0.42, y - h * 0.08))
    pts_r += [(cx + trunk_w / 2, base), (cx + trunk_w / 2, trunk_to or base + 5)]
    pts_l = [(2 * cx - x, y) for x, y in reversed(pts_r)]
    return 'M' + ' L'.join(f'{x:.2f} {y:.2f}' for x, y in pts_r[:] + pts_l[:-1]) + 'Z'


def wunduniik():
    """Nature: a snow-capped mountain range, three pines in front standing on the ring
    (it is the ground), and the site star as the North Star."""
    mountain = 'M14 73 L35 38 L42 47 L57 23 L86 73 Z'
    # snow line: a zigzag cut across both peaks
    snow = 'M29.5 47.5 L33 51 L36.5 46.5 L39.5 49.5 M48 36.5 L51.5 41 L55 37 L58.5 42 L62 37.5 L65.5 41.5'
    pines = ' '.join([
        pine(50, 42, 82, 13.5, tiers=4, trunk_to=90, trunk_w=4.4),     # trunks run into the ring: it is the ground
        pine(33.5, 56, 79, 9, tiers=3, trunk_to=86, trunk_w=3.4),
        pine(66.5, 56, 79, 9, tiers=3, trunk_to=86, trunk_w=3.4),
    ])
    north = star(29, 25, 5.5)
    defs = (
        '<mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><rect width="100" height="100" fill="#fff"/>'
        f'<path d="{pines}" fill="#000" stroke="#000" stroke-width="5" stroke-linejoin="round"/>'
        f'<path d="{snow}" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></mask>'
    )
    body = (f'<path d="{mountain}" fill="{INK}" mask="url(#m)"/>'
            f'<path d="{pines}" fill="{INK}"/>'
            f'<path d="{north}" fill="{INK}"/>')
    return svg(ring() + body, defs)


def krentoraan():
    # tower with merlons, an arrow slit and a gate cut out (even-odd)
    body = ('M36 31 H40 V23 H46 V31 H54 V23 H60 V31 H64 V84 L68 95 H32 L36 84 Z'
            ' M48.4 41 Q50 38 51.6 41 V55 H48.4 Z'
            ' M44 84 V72 Q50 64 56 72 V84 Z')
    defs = gap_mask('g', f'<path d="{body}" fill="#000" stroke="#000" stroke-width="7" stroke-linejoin="round"/>')
    flag = '<path d="M50 23 V9 M50 9 L60 12.5 L50 16" fill="none" stroke="#fff" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>'
    return svg(ring('g') + f'<path d="{body}" fill="{INK}" fill-rule="evenodd"/>' + flag.replace('#fff', INK), defs)


def ghost_grid():
    s, gap = 10, 3.2
    cells = []
    x0 = 50 - (3 * s + 2 * gap) / 2
    for r in range(3):
        for c in range(3):
            if (r, c) == (1, 2):
                continue                                   # the missing cell
            x, y = x0 + c * (s + gap), x0 + r * (s + gap)
            if (r, c) == (0, 0):
                x -= 4                                     # glitched cell, shifted out of line
            cells.append(f'<rect x="{x:.2f}" y="{y:.2f}" width="{s}" height="{s}" fill="{INK}"/>')
    ghost = f'<rect x="{x0 + 2 * (s + gap) + 9:.2f}" y="{x0 + s + gap:.2f}" width="{s}" height="{s}" fill="none" stroke="{INK}" stroke-width="1.6" stroke-dasharray="2.2 1.8"/>'
    defs = ('<clipPath id="a"><rect x="0" y="0" width="100" height="44"/><rect x="0" y="54" width="100" height="46"/></clipPath>'
            '<clipPath id="b"><rect x="0" y="45.5" width="100" height="7"/></clipPath>')
    rings = ring(extra=' clip-path="url(#a)"') + f'<g transform="translate(7 0)">{ring(extra=" clip-path=" + chr(34) + "url(#b)" + chr(34))}</g>'
    return svg(rings + ''.join(cells) + ghost, defs)


def nms():
    a = -18
    orbit = f'<ellipse cx="50" cy="50" rx="46" ry="12.5" fill="none" stroke="{INK}" stroke-width="4.6" transform="rotate({a} 50 50)"/>'
    # the back half of the orbit passes behind the planet
    behind = ('<mask id="o" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><rect width="100" height="100" fill="#fff"/>'
              f'<g transform="rotate({a} 50 50)"><path d="M28 50 A22 22 0 0 1 72 50 Z" fill="#000"/></g></mask>')
    cut = gap_mask('g', f'<ellipse cx="50" cy="50" rx="46" ry="12.5" fill="none" stroke="#000" stroke-width="11" transform="rotate({a} 50 50)"/>')
    planet = f'<circle cx="50" cy="50" r="16.5" fill="{INK}"/>'
    return svg(ring('g') + planet + f'<g mask="url(#o)">{orbit}</g>' + f'<path d="{star(27, 27, 6.5)}" fill="{INK}"/>', cut + behind)


def ecp():
    hexr = 22
    pts = [(50 + hexr * math.cos(math.radians(60 * i)), 50 + hexr * math.sin(math.radians(60 * i))) for i in range(6)]
    hexd = 'M' + ' L'.join(f'{x:.2f} {y:.2f}' for x, y in pts) + 'Z'
    clamps = 'M2 46.6 H24 V53.4 H2 Z M76 46.6 H98 V53.4 H76 Z'
    defs = gap_mask('g', f'<path d="{clamps}" fill="#000" stroke="#000" stroke-width="7"/>')
    body = (f'<path d="{hexd}" fill="none" stroke="{INK}" stroke-width="5.5" stroke-linejoin="round"/>'
            f'<path d="{clamps}" fill="{INK}"/>'
            f'<path d="{star(50, 50, 11.5)}" fill="{INK}"/>')
    return svg(ring('g') + body, defs)


EMBLEMS = {
    'wunduniik': wunduniik,
    'krentoraan': krentoraan,
    'ghost-of-the-grid': ghost_grid,
    'no-mans-sky-explorer': nms,
    'extrasolar-containment-protocol': ecp,
}

if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    for name, fn in EMBLEMS.items():
        (OUT / f'{name}.svg').write_text(fn(), encoding='utf-8')
        print(OUT / f'{name}.svg')
