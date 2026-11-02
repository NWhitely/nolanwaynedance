#!/usr/bin/env bash
# Publish the current branch to testing.nolanwaynedance.com (a separate GitHub Pages repo).
# The live site (nolanwaynedance.com) deploys from `main` of the main repo and is never touched here.
# Staging-only changes applied on the copy: its own CNAME, robots.txt that blocks crawlers,
# a noindex meta tag on every page, and a small "TESTING" ribbon.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPO="https://github.com/NWhitely/nolanwaynedance-testing.git"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

cd "$ROOT"
SHA="$(git rev-parse --short HEAD)"
git archive HEAD | tar -x -C "$TMP"

cd "$TMP"
printf 'testing.nolanwaynedance.com' > CNAME
printf 'User-agent: *\nDisallow: /\n' > robots.txt
for f in *.html; do
  perl -0pi -e 's#<head>#<head>\n    <meta name="robots" content="noindex, nofollow">#' "$f"
  perl -0pi -e 's#</body>#<div style="position:fixed;left:12px;bottom:12px;z-index:99999;font:600 10px/1 system-ui,sans-serif;letter-spacing:.12em;padding:6px 9px;border-radius:3px;background:\#b8955e;color:\#0b0b0b;pointer-events:none;opacity:.85">TESTING '"$SHA"'</div>\n</body>#' "$f"
done

git init -q -b main
git add -A
git -c user.name="$(git -C "$ROOT" config user.name)" -c user.email="$(git -C "$ROOT" config user.email)" \
  commit -q -m "Testing build of $SHA"
git push -q -f "$REPO" main
echo "Pushed $SHA to testing. Live at https://testing.nolanwaynedance.com in about a minute."
