#!/usr/bin/env bash
# verify.sh — everything that can be checked automatically, in one command.
#   scripts/verify.sh                 static checks
#   scripts/verify.sh <built-folder>  + browser check (overflow, focus ring, reduced motion) on that folder, e.g. docs/templates or a site's out/
set -euo pipefail
cd "$(dirname "$0")/.."

echo "== tokens: every copy matches templates/tokens.css"
python3 scripts/sync-tokens.py --check

echo "== system: contrast pairs, reduced motion, nav parity"
python3 scripts/check-system.py | tail -4

echo "== reference: did DESIGN.md move since the pinned commit? (informational)"
python3 scripts/check-design-source.py || true

echo "== docs: docs/ is what build-docs.py generates"
before=$(cat docs/index.html docs/templates/*.html | shasum)
python3 scripts/build-docs.py >/dev/null
after=$(cat docs/index.html docs/templates/*.html | shasum)
if [ "$before" != "$after" ]; then
  echo "docs/ was stale: build-docs.py regenerated it. Review and commit the result." >&2
  exit 1
fi
echo "ok"

if command -v claude >/dev/null 2>&1; then
  echo "== plugin: claude plugin validate"
  claude plugin validate . 2>&1 | tail -1
fi

if [ "${1:-}" != "" ]; then
  echo "== browser: $1"
  python3 scripts/browser-check.py "$1"
fi
echo "verify: ok"
