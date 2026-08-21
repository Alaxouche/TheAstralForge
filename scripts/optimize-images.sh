#!/usr/bin/env bash
#
# Optimize raster images under assets/Images into WebP, and generate the
# small responsive derivatives the galleries actually display.
#
#   scripts/optimize-images.sh           # convert to WebP + build derivatives
#   scripts/optimize-images.sh --check   # CI mode: exit 1 if a conversion or a
#                                        # derivative is missing, or an image
#                                        # exceeds its budget
#
# Why derivatives: the modlist galleries render every screenshot of a folder in
# a ~220px grid. Serving the 2560px source there costs megabytes for pixels
# nobody sees. Grids load assets/thumbs/**, the lightbox still opens the
# full-size original on demand.
#
# Requires `cwebp` (libwebp) or `ffmpeg` on PATH. Logos in assets/logos are
# intentionally skipped: they are referenced as PNG by SEO/OG/favicon tags.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="$ROOT/assets/Images"
THUMB_DIR="$ROOT/assets/thumbs"
QUALITY=82
THUMB_QUALITY=78
# 400/800 feed the ~220px grid tiles (800 covers 2x DPR); 1600 is what the
# lightbox opens. The 2560px masters stay in the repo as archival originals
# and are no longer linked from any page.
WIDTHS=(400 800 1600)

# Folders whose images are rendered through a srcset by components/gallery.html
# (they are the values used as `gallery_path:` in the modlist front matter).
# Only these have to be wide enough to honour the advertised descriptors.
SRCSET_DIRS=(Skyrim Cyberpunk Starfield no-mans-sky)

# Size budgets (WebP, in KB). The derivatives are what browsers actually
# download in bulk, so that is where the tight budget belongs. The masters are
# no longer shipped to visitors, so they keep a loose one — re-encoding them
# to fit a tight budget would only cost image quality for no bandwidth gain.
BUDGET_THUMB_KB=300       # applies to assets/thumbs/** (largest is the 1600w)
BUDGET_KB=1024            # applies to the masters under assets/Images

CHECK=0
[[ "${1:-}" == "--check" ]] && CHECK=1

have() { command -v "$1" >/dev/null 2>&1; }

to_webp() { # $1 src  $2 dest
  if have cwebp; then
    cwebp -quiet -q "$QUALITY" "$1" -o "$2"
  elif have ffmpeg; then
    ffmpeg -y -loglevel error -i "$1" -c:v libwebp -quality "$QUALITY" "$2"
  else
    echo "error: need cwebp or ffmpeg on PATH" >&2
    exit 2
  fi
}

in_srcset_dir() { # $1 path relative to assets/Images
  local d
  for d in "${SRCSET_DIRS[@]}"; do
    [[ "$1" == "$d/"* ]] && return 0
  done
  return 1
}

src_width() { # $1 src -> intrinsic width, or 0 if it cannot be read
  if have ffprobe; then
    ffprobe -v error -select_streams v:0 -show_entries stream=width \
      -of csv=p=0 "$1" 2>/dev/null || echo 0
  else
    echo 0
  fi
}

to_thumb() { # $1 src  $2 dest  $3 width
  # Never upscale: a portrait community shot is already narrower than 1600,
  # and enlarging it would cost bytes without adding a single real pixel.
  if have cwebp; then
    cwebp -quiet -q "$THUMB_QUALITY" -resize "$3" 0 "$1" -o "$2"
  elif have ffmpeg; then
    ffmpeg -y -loglevel error -i "$1" -vf "scale='min($3,iw)':-2" \
      -c:v libwebp -quality "$THUMB_QUALITY" "$2"
  else
    echo "error: need cwebp or ffmpeg on PATH" >&2
    exit 2
  fi
}

status=0

# ── 1. PNG/JPG -> WebP ──────────────────────────────────────────────────
while IFS= read -r -d '' src; do
  dest="${src%.*}.webp"
  if [[ ! -f "$dest" ]]; then
    if [[ $CHECK -eq 1 ]]; then
      echo "::warning::missing WebP for ${src#"$ROOT"/}"
      status=1
    else
      echo "convert: ${src#"$ROOT"/} -> ${dest#"$ROOT"/}"
      to_webp "$src" "$dest"
    fi
  fi
done < <(find "$SRC_DIR" -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' \) -print0)

# ── 2. Responsive derivatives under assets/thumbs ───────────────────────
# Mirrors the assets/Images tree so a source maps to its thumbs by a plain
# path substitution — the same one the Liquid includes do.
while IFS= read -r -d '' img; do
  rel="${img#"$SRC_DIR"/}"
  base="${rel%.webp}"

  # The width in a derivative's name is a slot, not a promise: a source that is
  # already narrower is copied at its own size rather than blown up. srcset
  # only advertises the 400/800 slots, so warn if a source cannot honour those.
  if [[ $CHECK -eq 1 ]] && in_srcset_dir "$rel"; then
    w0="$(src_width "$img")"
    if [[ "$w0" =~ ^[0-9]+$ ]] && (( w0 > 0 && w0 < 800 )); then
      echo "::warning::assets/Images/$rel is only ${w0}px wide; srcset advertises 800w"
      status=1
    fi
  fi

  for w in "${WIDTHS[@]}"; do
    out="$THUMB_DIR/${base}-${w}.webp"
    if [[ ! -f "$out" ]]; then
      if [[ $CHECK -eq 1 ]]; then
        echo "::warning::missing ${w}w derivative for assets/Images/$rel"
        status=1
      else
        mkdir -p "$(dirname "$out")"
        echo "thumb:   assets/Images/$rel -> ${w}w"
        to_thumb "$img" "$out" "$w"
      fi
    fi
  done
done < <(find "$SRC_DIR" -type f -iname '*.webp' -print0)

# ── 3. Prune orphaned derivatives ───────────────────────────────────────
# A thumb whose source is gone would otherwise linger in the repo forever.
if [[ -d "$THUMB_DIR" ]]; then
  # Built from WIDTHS so adding a size never leaves the pruner behind.
  width_re="$(IFS='|'; echo "${WIDTHS[*]}")"
  while IFS= read -r -d '' thumb; do
    rel="${thumb#"$THUMB_DIR"/}"
    src_rel="$(echo "$rel" | sed -E "s/-(${width_re})\.webp$/.webp/")"
    if [[ ! -f "$SRC_DIR/$src_rel" ]]; then
      if [[ $CHECK -eq 1 ]]; then
        echo "::warning::orphaned derivative assets/thumbs/$rel (source removed)"
        status=1
      else
        echo "prune:   assets/thumbs/$rel"
        rm -f "$thumb"
      fi
    fi
  done < <(find "$THUMB_DIR" -type f -iname '*.webp' -print0)
fi

# ── 4. Size budget guards ───────────────────────────────────────────────
check_budget() { # $1 dir  $2 budget-KB
  [[ -d "$1" ]] || return 0
  while IFS= read -r -d '' img; do
    local rel kb
    rel="${img#"$ROOT"/}"
    kb=$(( $(wc -c < "$img") / 1024 ))
    if (( kb > $2 )); then
      echo "::warning::${rel} is ${kb}KB (budget ${2}KB)"
      status=1
    fi
  done < <(find "$1" -type f -iname '*.webp' -print0)
}

check_budget "$THUMB_DIR" "$BUDGET_THUMB_KB"
check_budget "$SRC_DIR"   "$BUDGET_KB"

exit $status
