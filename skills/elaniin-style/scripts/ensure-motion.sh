#!/usr/bin/env bash
# ensure-motion.sh — add `motion` to a project that already has a package.json (npm, pnpm, yarn or bun).
#
# - Never prompts. No package.json: exit 0 and leave the CSS-only ladder in place.
# - Says what it is about to do (one line on stderr): it changes package.json and the lockfile.
# - Does nothing when `motion` is already a dependency.
# - Failure is NOT fatal by default (the CSS ladder still works) but it is reported on stderr.
#   ENSURE_MOTION_STRICT=1   exit 1 when the install fails (use it in CI)
#   ENSURE_MOTION_DRY_RUN=1  only print the command, install nothing
set -euo pipefail

root="${1:-.}"
cd "$root"

if [ ! -f package.json ]; then
  exit 0
fi

if grep -Eq '"motion"[[:space:]]*:' package.json; then
  exit 0
fi

if [ -f pnpm-lock.yaml ] || grep -q '"packageManager": *"pnpm' package.json 2>/dev/null; then
  cmd=(pnpm add motion)
elif [ -f yarn.lock ]; then
  cmd=(yarn add motion)
elif [ -f bun.lockb ] || [ -f bun.lock ]; then
  cmd=(bun add motion)
else
  cmd=(npm install motion --no-fund --no-audit)
fi

echo "ensure-motion: ${cmd[*]}  (in $(pwd); updates package.json and the lockfile)" >&2

if [ -n "${ENSURE_MOTION_DRY_RUN:-}" ]; then
  exit 0
fi

if ! "${cmd[@]}" >/dev/null 2>&1; then
  echo "ensure-motion: could not install motion (continuing with the CSS-only ladder; run the command above by hand to see the error)" >&2
  if [ -n "${ENSURE_MOTION_STRICT:-}" ]; then
    exit 1
  fi
fi
exit 0
