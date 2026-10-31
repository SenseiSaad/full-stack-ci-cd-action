#!/usr/bin/env bash
# Render the project-screen artwork (SVG sources in ./src) to PNG with
# headless Chrome, using the site's self-hosted fonts (IBM Plex Mono, Syne).
# Outputs land in ../public/art and are referenced by components/Works.tsx.
#
# Usage:  cd frontend/artwork && ./build.sh [name ...]
#         (no args = render every svg in src/)
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
SRC="$HERE/src"
OUT="$HERE/../public/art"
WORK="${TMPDIR:-/tmp}/artwork-build"
mkdir -p "$WORK"

MONO="$HERE/../node_modules/@fontsource/ibm-plex-mono/files"
SYNE="$HERE/../node_modules/@fontsource/syne/files"

CSS=$(cat <<EOF
@font-face{font-family:"IBM Plex Mono";font-weight:400;src:url(file://$MONO/ibm-plex-mono-latin-400-normal.woff2) format("woff2")}
@font-face{font-family:"IBM Plex Mono";font-weight:500;src:url(file://$MONO/ibm-plex-mono-latin-500-normal.woff2) format("woff2")}
@font-face{font-family:"IBM Plex Mono";font-weight:600;src:url(file://$MONO/ibm-plex-mono-latin-600-normal.woff2) format("woff2")}
@font-face{font-family:"Syne";font-weight:700;src:url(file://$SYNE/syne-latin-700-normal.woff2) format("woff2")}
@font-face{font-family:"Syne";font-weight:800;src:url(file://$SYNE/syne-latin-800-normal.woff2) format("woff2")}
html,body{margin:0;padding:0;background:#0a0a0b;overflow:hidden}
svg{width:100vw;height:100vh;display:block}
EOF
)

wrap() { # $1 = svg file, $2 = html out
  {
    printf '<!doctype html><html><head><meta charset="utf-8"><style>%s</style></head><body>' "$CSS"
    cat "$1"
    printf '</body></html>'
  } > "$2"
}

inject() { # $1 = placeholder, $2 = png file, $3 = src svg, $4 = tmp svg out
  local b64
  b64=$(base64 -w0 "$2")
  sed "s|$1|$b64|" "$3" > "$4"
}

# the OpenVault artwork embeds the real app screenshots as data URIs
inject __OV_B64__  "$OUT/Project_1.png"        "$SRC/openvault-desktop.svg" "$WORK/openvault-desktop.svg"
inject __OVM_B64__ "$OUT/project_1_mobile.png" "$SRC/openvault-mobile.svg"  "$WORK/openvault-mobile.svg"

NAMES=("$@")
if [ ${#NAMES[@]} -eq 0 ]; then
  NAMES=()
  for f in "$SRC"/*.svg; do NAMES+=("$(basename "$f" .svg)"); done
fi

for name in "${NAMES[@]}"; do
  svg="$WORK/$name.svg"
  [ -f "$svg" ] || cp "$SRC/$name.svg" "$svg"
  wrap "$svg" "$WORK/$name.html"
  # desktop art is 16:10 (1600x1000), mobile cards are 750x520; render at 2x-ish
  case "$name" in
    *-mobile) W=1500; H=1040 ;;
    *)        W=2560; H=1600 ;;
  esac
  google-chrome --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
    --window-size=$W,$H --screenshot="$OUT/$name.png" "file://$WORK/$name.html" 2>/dev/null
  echo "built $OUT/$name.png ($W x $H)"
done
