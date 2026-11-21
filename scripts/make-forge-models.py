"""Turns the generated GLB models of the home forge (anvil, hammer) into small web files.

    py scripts/make-forge-models.py <anvil.glb> <hammer.glb> [out dir, default theme/assets/forge]

The sources came from Artlist / Higgsfield (Tripo H3.1, Nov 2026) and are too big to commit
(the anvil is 44 MB, 1.4 M triangles). For each model this writes:
  <name>.bin          mesh: header + int16 positions, int8 normals, uint16 UVs, uint16/uint32 indices
  <name>-color.webp   base colour
  <name>-normal.webp  tangent-space normal map
  <name>-mr.webp      metal (B) / roughness (G), as in glTF
Read by theme/assets/forge/forge.js (the home page). Needs numpy, Pillow, fast-simplification.

The source textures are atlases cut into many small charts. Simplifying a mesh merges vertices across
chart borders, which scrambles the UVs, so a simplified model (the anvil) gets no textures: each kept
vertex carries the average colour / roughness / metal of the original vertices merged into it.
A model kept at full detail (the hammer) keeps its UVs and textures.

.bin layout (little endian):
  char[4] 'TAFM', uint32 vertexCount, uint32 indexCount, uint32 indexBytes (2 or 4), uint32 flags (1 = vertex colours),
  float32[3] boxMin, float32[3] boxMax,
  int16[3*V] positions (normalised to the box, -32767..32767),
  int8[4*V] normals (xyz, pad),
  flags 0: uint16[2*V] uvs (0..65535)    flags 1: uint8[4*V] colour (sRGB rgb, roughness)
  uint16|uint32[I] indices
"""
import io, json, struct, sys
from pathlib import Path
import numpy as np
from PIL import Image
import fast_simplification

TARGET = {'anvil': 24000, 'hammer': None}       # triangles kept (None: full detail, textured)
TEX = {'anvil': 1024, 'hammer': 1024}


def read_glb(path):
    b = Path(path).read_bytes()
    jl = struct.unpack_from('<I', b, 12)[0]
    j = json.loads(b[20:20 + jl])
    bin_off = 20 + jl + 8
    def view(i):
        bv = j['bufferViews'][i]
        o = bin_off + bv.get('byteOffset', 0)
        return b[o:o + bv['byteLength']]
    def acc(i):
        a = j['accessors'][i]
        dt = {5126: np.float32, 5125: np.uint32, 5123: np.uint16}[a['componentType']]
        n = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4}[a['type']]
        bv = j['bufferViews'][a['bufferView']]
        o = bin_off + bv.get('byteOffset', 0) + a.get('byteOffset', 0)
        return np.frombuffer(b, dtype=dt, count=a['count'] * n, offset=o).reshape(a['count'], n) if n > 1 else \
            np.frombuffer(b, dtype=dt, count=a['count'], offset=o)
    p = j['meshes'][0]['primitives'][0]
    mat = j['materials'][p['material']]
    tex = lambda t: Image.open(io.BytesIO(view(j['images'][j['textures'][t['index']]['source']]['bufferView'])))
    return dict(
        pos=acc(p['attributes']['POSITION']).astype(np.float64),
        uv=acc(p['attributes']['TEXCOORD_0']).astype(np.float64),
        idx=acc(p['indices']).reshape(-1, 3).astype(np.int64),
        color=tex(mat['pbrMetallicRoughness']['baseColorTexture']),
        mr=tex(mat['pbrMetallicRoughness']['metallicRoughnessTexture']),
        normal=tex(mat['normalTexture']),
    )


def sample(img, uv):
    a = np.asarray(img.convert('RGB'), dtype=np.float64)
    h, w = a.shape[:2]
    x = np.clip((uv[:, 0] * (w - 1)).round().astype(int), 0, w - 1)
    y = np.clip((uv[:, 1] * (h - 1)).round().astype(int), 0, h - 1)   # glTF UV origin is top-left
    return a[y, x]


def simplify(m, target):
    # weld the vertices the source splits along UV seams, or simplification opens cracks there
    col = sample(m['color'], m['uv']); mr = sample(m['mr'], m['uv'])
    feat0 = np.c_[col, mr[:, 1], mr[:, 2]]                # r g b roughness metal (0..255)
    _, first, weld = np.unique(np.round(m['pos'] * 1e5).astype(np.int64), axis=0, return_index=True, return_inverse=True)
    weld = weld.ravel(); pos = m['pos'][first]; idx = weld[m['idx']]
    idx = idx[(idx[:, 0] != idx[:, 1]) & (idx[:, 1] != idx[:, 2]) & (idx[:, 0] != idx[:, 2])]
    p2, f2, coll = fast_simplification.simplify(pos.astype(np.float32), idx.astype(np.int32), 1 - target / len(idx), return_collapses=True)
    _, _, mapping = fast_simplification.replay_simplification(pos.astype(np.float32), idx.astype(np.int32), coll)
    # average the original vertices' texture samples into the vertex they ended up in
    dest = mapping[weld]
    acc = np.zeros((len(p2), 5)); cnt = np.zeros(len(p2))
    np.add.at(acc, dest, feat0); np.add.at(cnt, dest, 1)
    feat = acc / np.maximum(cnt, 1)[:, None]
    return p2.astype(np.float64), feat, f2.astype(np.int64)


def smooth_normals(pos, idx):
    # weld by position first, so split UV seams do not show as hard edges
    key = np.round(pos * 1e5).astype(np.int64)
    _, weld = np.unique(key, axis=0, return_inverse=True)
    weld = weld.ravel()
    a, b, c = pos[idx[:, 0]], pos[idx[:, 1]], pos[idx[:, 2]]
    fn = np.cross(b - a, c - a)                       # area weighted
    acc = np.zeros((weld.max() + 1, 3))
    for k in range(3):
        np.add.at(acc, weld[idx[:, k]], fn)
    n = acc[weld]
    return n / np.maximum(np.linalg.norm(n, axis=1, keepdims=True), 1e-12)


def match_iron(h, anvil):
    """Repaint the hammer's head in the anvil's dark iron, with the anvil's metal finish.
    The head is found by position (the model's head end, z > .29), not by the metal map: the source marks only
    the striking faces as metal. Each pixel keeps its brightness relative to the head's average, so wear and
    edges stay; the wooden handle is untouched."""
    from PIL import ImageDraw, ImageFilter
    c = np.asarray(h['color'].convert('RGB'), dtype=np.float64)
    mr = np.asarray(h['mr'].convert('RGB'), dtype=np.float64)
    H, W = c.shape[:2]
    mask = Image.new('L', (W, H), 0); d = ImageDraw.Draw(mask)
    uv = h['uv'] * [W - 1, H - 1]
    for t in h['idx'][(h['pos'][h['idx']][:, :, 2] > .29).all(1)]:
        d.polygon([tuple(uv[k]) for k in t], fill=255)
    w = np.asarray(mask.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(2)), dtype=np.float64)[..., None] / 255
    ac = np.asarray(anvil['color'].convert('RGB'), dtype=np.float64).reshape(-1, 3)
    amr = np.asarray(anvil['mr'].convert('RGB'), dtype=np.float64).reshape(-1, 3)
    lum = c @ [.299, .587, .114]
    ref = lum[w[..., 0] > .5].mean()
    iron = ac.mean(0)[None, None, :] * np.clip(lum / ref, 0, 3)[..., None]
    h['color'] = Image.fromarray(np.clip(c * (1 - w) + iron * w, 0, 255).astype(np.uint8))
    mr2 = mr * (1 - w) + amr.mean(0)[None, None, :] * w
    h['mr'] = Image.fromarray(np.clip(mr2, 0, 255).astype(np.uint8))
    print(f'  hammer head: {int((w > .5).sum())} texels repainted in iron')
    return h


def write(out, name, m):
    flat = TARGET[name] is not None
    if flat:
        pos, feat, idx = simplify(m, TARGET[name])
        print(f'  {name}: mean metal {feat[:, 4].mean() / 255:.2f}')
    else:
        pos, uv, idx = m['pos'], m['uv'], m['idx']
    nrm = smooth_normals(pos, idx)
    lo, hi = pos.min(0), pos.max(0)
    q = np.round((pos - (lo + hi) / 2) / ((hi - lo) / 2) * 32767).astype(np.int16)
    n8 = np.zeros((len(pos), 4), np.int8); n8[:, :3] = np.round(nrm * 127)
    if flat:
        attr = np.round(np.clip(feat[:, :4], 0, 255)).astype(np.uint8)
    else:
        attr = np.round(np.clip(uv, 0, 1) * 65535).astype(np.uint16)
    ib = 2 if len(pos) < 65536 else 4
    ind = idx.astype(np.uint16 if ib == 2 else np.uint32).ravel()
    head = b'TAFM' + struct.pack('<IIII6f', len(pos), len(ind), ib, int(flat), *lo, *hi)
    data = head + q.tobytes() + n8.tobytes() + attr.tobytes() + ind.tobytes()
    for f in [*out.glob(f'{name}.bin'), *out.glob(f'{name}-*.webp')]:
        f.unlink()
    (out / f'{name}.bin').write_bytes(data)
    if flat:
        print(f'{name}: {len(m["idx"])} -> {len(idx)} triangles, {len(pos)} vertices, vertex colours, {len(data) // 1024} KB')
        return
    s = TEX[name]
    m['color'].convert('RGB').resize((s, s), Image.LANCZOS).save(out / f'{name}-color.webp', quality=82, method=6)
    # the normal and metal / roughness maps carry broad shapes only: half and quarter size are enough
    m['normal'].convert('RGB').resize((s // 2, s // 2), Image.LANCZOS).save(out / f'{name}-normal.webp', quality=88, method=6)
    m['mr'].convert('RGB').resize((s // 4, s // 4), Image.LANCZOS).save(out / f'{name}-mr.webp', quality=85, method=6)
    sizes = {f.name: f.stat().st_size // 1024 for f in out.glob(f'{name}*')}
    print(f'{name}: {len(m["idx"])} -> {len(idx)} triangles, {len(pos)} vertices, box {lo.round(3)} {hi.round(3)}, KB {sizes}')


if __name__ == '__main__':
    anvil, hammer = sys.argv[1], sys.argv[2]
    out = Path(sys.argv[3] if len(sys.argv) > 3 else 'theme/assets/forge')
    out.mkdir(parents=True, exist_ok=True)
    a = read_glb(anvil)
    write(out, 'anvil', a)
    write(out, 'hammer', match_iron(read_glb(hammer), a))
