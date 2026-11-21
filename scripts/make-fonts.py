# Builds the site's self-hosted fonts (theme/assets/fonts/*.woff2) and prints the fallback metrics for site.css.
#
#   py scripts/make-fonts.py <folder with the source .ttf files> theme/assets/fonts
#
# Sources (SIL Open Font License), from https://github.com/google/fonts/tree/main/ofl :
#   cormorantgaramond/CormorantGaramond[wght].ttf          saved as CormorantGaramond.ttf
#   cormorantgaramond/CormorantGaramond-Italic[wght].ttf   saved as CormorantGaramond-Italic.ttf
#   alegreyasans/AlegreyaSans-Regular.ttf, AlegreyaSans-Medium.ttf, AlegreyaSans-Italic.ttf
# Needs fonttools and brotli (pip install fonttools brotli). Fallback metrics are measured against
# C:/Windows/Fonts/georgia.ttf and arial.ttf. Jost (wordmark only) is not rebuilt here.
import os, sys
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

SRC = sys.argv[1]
OUT = sys.argv[2]
LATIN = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
EXT = "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C4,U+2113,U+2C60-2C7F,U+A720-A7FF"
FEATURES = "kern,liga,clig,calt,onum,lnum,tnum,pnum,case,ccmp,locl,mark,mkmk"

def ranges(s):
    out = []
    for part in s.split(','):
        a = part.strip()[2:]
        if '-' in a:
            lo, hi = a.split('-'); out.extend(range(int(lo, 16), int(hi, 16) + 1))
        else:
            out.append(int(a, 16))
    return out

def build(src, name, axes=None):
    for tag, rng in (('latin', LATIN), ('latin-ext', EXT)):
        f = TTFont(os.path.join(SRC, src))
        if axes:
            import io; b = io.BytesIO(); instancer.instantiateVariableFont(f, axes).save(b); b.seek(0); f = TTFont(b)
        opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = FEATURES.split(','); opts.name_IDs = ['*']; opts.notdef_outline = True
        s = subset.Subsetter(opts); s.populate(unicodes=ranges(rng)); s.subset(f)
        p = os.path.join(OUT, f'{name}-{tag}.woff2'); f.flavor = 'woff2'; f.save(p)
        print(p, os.path.getsize(p) // 1024, 'KB')

os.makedirs(OUT, exist_ok=True)
build('CormorantGaramond.ttf', 'cormorant', {'wght': 600})          # static: the site only uses 600 upright
build('CormorantGaramond-Italic.ttf', 'cormorant-italic', {'wght': 500})   # static: 500 italic only
build('AlegreyaSans-Regular.ttf', 'alegreya-sans-400')
build('AlegreyaSans-Medium.ttf', 'alegreya-sans-500')
build('AlegreyaSans-Italic.ttf', 'alegreya-sans-400i')

# Fallback metrics: scale the local font so its average glyph width matches, then override the vertical metrics.
def avgw(font, text="The quick brown fox jumps over the lazy dog 0123456789 Wabbajack modlist"):
    cmap = font.getBestCmap(); hm = font['hmtx']
    return sum(hm[cmap[ord(c)]][0] for c in text if ord(c) in cmap) / font['head'].unitsPerEm / len(text)
def fallback(src, local, label, wght=None):
    f = TTFont(os.path.join(SRC, src))
    if wght: f = instancer.instantiateVariableFont(f, {'wght': wght})
    l = TTFont(local)
    size = avgw(f) / avgw(l)
    upm = f['head'].unitsPerEm; hh = f['hhea']
    print(f'{label}: size-adjust: {size*100:.2f}%; ascent-override: {hh.ascent/upm/size*100:.2f}%; descent-override: {abs(hh.descent)/upm/size*100:.2f}%; line-gap-override: {hh.lineGap/upm/size*100:.2f}%;')
fallback('CormorantGaramond.ttf', 'C:/Windows/Fonts/georgia.ttf', 'Cormorant vs Georgia (600)', 600)
fallback('AlegreyaSans-Regular.ttf', 'C:/Windows/Fonts/arial.ttf', 'Alegreya Sans vs Arial')
