#!/usr/bin/env sh
# Start a new report from the template: copies template/ to DIR and vendors the extension under
# DIR/_extensions/yipihey/quadrant (the layout `quarto add yipihey/quadrant` uses, so `quarto update` works later).
#   sh scripts/new-report.sh ../my-report
set -e
DIR="${1:?usage: new-report.sh DIR}"
HERE="$(cd "$(dirname "$0")/.." && pwd)"
[ -e "$DIR" ] && { echo "refusing to overwrite existing $DIR" >&2; exit 1; }
cp -R "$HERE/template" "$DIR"
mkdir -p "$DIR/_extensions/yipihey"
cp -R "$HERE/_extensions/quadrant" "$DIR/_extensions/yipihey/quadrant"
cd "$DIR" && git init -q && echo "new report in $DIR  (next: edit _quarto.yml, then make wasm api site)"
