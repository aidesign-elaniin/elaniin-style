#!/usr/bin/env bash
# ensure-motion.sh — install `motion` silently if the project uses npm/pnpm/yarn/bun.
# Never prompts. If there is no package.json, exit 0 and leave the CSS-only ladder in place.
set -euo pipefail

root="${1:-.}"
cd "$root"

if [ ! -f package.json ]; then
  exit 0
fi

failed=0
run() {
  if [ -n "${DEBUG:-}" ]; then printf '+ %s\n' "$*"; fi
  "$@" >/dev/null 2>&1 || failed=1
}

if [ -f pnpm-lock.yaml ] || grep -q '"packageManager": *"pnpm' package.json 2>/dev/null; then
  run pnpm add motion
elif [ -f yarn.lock ]; then
  run yarn add motion
elif [ -f bun.lockb ] || [ -f bun.lock ]; then
  run bun add motion
elif [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then
  run npm install motion --no-fund --no-audit
else
  run npm install motion --no-fund --no-audit
fi

if [ "$failed" -ne 0 ]; then
  echo "ensure-motion: could not install motion (continuing with the CSS-only ladder; run it by hand to see the error)" >&2
fi
exit 0
