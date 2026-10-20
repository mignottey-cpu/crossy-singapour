#!/usr/bin/env bash
# Builds the web version so it works from any folder (GitHub Pages,
# claude.ai artifact, local file): relative paths and the bundle in js/game.js.
# Usage: scripts/build-web.sh <output-folder>
set -euo pipefail
OUT="${1:?usage: scripts/build-web.sh <output-folder>}"
rm -rf "$OUT"
npx expo export -p web --output-dir "$OUT"
BUNDLE=$(ls "$OUT"/_expo/static/js/web/*.js)
sed -i 's#"/assets/#"./assets/#g' "$BUNDLE"
mkdir -p "$OUT/js"
mv "$BUNDLE" "$OUT/js/game.js"
rm -rf "$OUT/_expo" "$OUT/metadata.json"
# folders starting with "_" are reserved on some hosts: point to js/game.js
sed -i 's#src="/_expo/static/js/web/entry-[a-f0-9]*\.js"#src="./js/game.js"#; s#href="/#href="./#g' "$OUT/index.html"
touch "$OUT/.nojekyll"
echo "Web build ready in $OUT"
