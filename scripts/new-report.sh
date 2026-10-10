#!/usr/bin/env sh
# Start a new report from the template: copies template/ to DIR, vendors the extension under
# DIR/_extensions/yipihey/quadrant (the layout `quarto add yipihey/quadrant` uses, so `quarto update` works later),
# and, when OWNER/REPO is given, fills in the repository everywhere the template says OWNER/REPO
# (repo-url, site-url, edit links, status page, CITATION.cff).
#   sh scripts/new-report.sh ../my-report yourname/my-report
set -e
DIR="${1:?usage: new-report.sh DIR [OWNER/REPO]}"
REPO="$2"
HERE="$(cd "$(dirname "$0")/.." && pwd)"
[ -e "$DIR" ] && { echo "refusing to overwrite existing $DIR" >&2; exit 1; }
cp -R "$HERE/template" "$DIR"
mkdir -p "$DIR/_extensions/yipihey"
cp -R "$HERE/_extensions/quadrant" "$DIR/_extensions/yipihey/quadrant"
if [ -n "$REPO" ]; then
  owner="${REPO%%/*}"; name="${REPO#*/}"
  lower_owner="$(printf '%s' "$owner" | tr '[:upper:]' '[:lower:]')"
  for f in "$DIR/_quarto.yml" "$DIR/chapters/status.qmd" "$DIR/CITATION.cff" "$DIR/README.md"; do
    sed -i.bak "s|OWNER\.github\.io/REPO|$lower_owner.github.io/$name|g; s|OWNER/REPO|$REPO|g" "$f" && rm -f "$f.bak"
  done
fi
cd "$DIR" && git init -q && echo "new report in $DIR${REPO:+ for $REPO}  (next: edit _quarto.yml, then make wasm api site)"
