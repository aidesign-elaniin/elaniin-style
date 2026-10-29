#!/usr/bin/env bash
# add-assets.sh — copy the brand assets a project needs from the plugin into the project's public/ folder (never inline them) and install the
# packages the glyphs need.
#
#   add-assets.sh [project-root] [group ...]
#
# Groups:   brand          logotipos (public/brand/)
#           certification  credential badges of the footer (public/certification/)
#           glyphs         LinkedIn + ChatGPT glyph files (public/icons/) and the `simple-icons` dependency (Instagram, Claude, Gemini, Perplexity)
#           solutions      the three official Elaniin icons (public/assets/icons/)
#           all            every group
# With NO group it reads src/content/site.ts and picks what the site uses: credentials: [...] not empty -> ONLY those badges of certification; social: [...] not empty or
# aiSummary: true -> glyphs; always brand. The assets are marks of their owners: only show a badge the company really holds.
#
# - Never prompts. Says what it copies (one line per group on stderr). Existing files are overwritten with the plugin's master copy.
# - Needs the plugin folder: it is the parent of this script (skills/elaniin-style/).
#   ADD_ASSETS_DRY_RUN=1  only print what it would do
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
root="${1:-.}"
[ -d "$root" ] || { echo "add-assets: $root is not a folder" >&2; exit 1; }
shift || true
cd "$root"
groups=("$@")
cred_ids=""

if [ ${#groups[@]} -eq 0 ]; then
  groups=(brand)
  site=src/content/site.ts
  if [ -f "$site" ]; then
    if grep -Eq 'credentials: *\[ *"' "$site"; then
      groups+=(certification)
      # only the badges the site lists (a site must not carry badges its company does not hold)
      cred_ids="$(grep -E 'credentials: *\[' "$site" | head -1 | sed -E 's/.*credentials: *\[([^]]*)\].*/\1/' | tr -d '" ')"
    fi
    if grep -Eq 'social: *\[ *\{' "$site" || grep -Eq 'aiSummary: *true' "$site"; then groups+=(glyphs); fi
  fi
fi
[ "${groups[0]}" = "all" ] && groups=(brand certification glyphs solutions)

copy() { # <source dir relative to the plugin> <destination in the project> [file pattern]
  local src="$here/$1" dst="$2" pat="${3:-*.svg}"
  echo "add-assets: $1 -> $dst" >&2
  [ -n "${ADD_ASSETS_DRY_RUN:-}" ] && return 0
  mkdir -p "$dst"
  find "$src" -maxdepth 1 -name "$pat" -type f -exec cp {} "$dst/" \;
}

for g in "${groups[@]}"; do
  case "$g" in
    brand)
      echo "add-assets: assets/logotipo-elaniin.svg + white + favicon -> public/brand/" >&2
      if [ -z "${ADD_ASSETS_DRY_RUN:-}" ]; then
        mkdir -p public/brand
        cp "$here/assets/logotipo-elaniin.svg" "$here/assets/white-logotipo-elaniin.svg" public/brand/
        [ -d src/app ] && cp "$here/assets/favicon.svg" src/app/icon.svg
      fi ;;
    certification)
      if [ -n "$cred_ids" ]; then
        echo "add-assets: assets/certification (only: $cred_ids) -> public/certification" >&2
        if [ -z "${ADD_ASSETS_DRY_RUN:-}" ]; then
          mkdir -p public/certification
          for id in ${cred_ids//,/ }; do
            case "$id" in
              aws) f=badge-clutch-aws.svg ;; google) f=gcp.svg ;; clutchGlobal) f=badge-clutch-global.svg ;;
              clutchSoftware) f=badge-clutch-top-software-developers.svg ;; clutchStaff) f=badge-clutch-top-staff.svg ;;
              gptw) f=gptw.svg ;; claude) f=claude.svg ;; webflow) f=webflow.svg ;; *) echo "add-assets: unknown credential '$id'" >&2; continue ;;
            esac
            cp "$here/assets/certification/$f" public/certification/
          done
        fi
      else
        copy assets/certification public/certification
      fi ;;
    glyphs)
      copy assets/icons/brand public/icons
      if [ -f package.json ] && ! grep -Eq '"simple-icons"[[:space:]]*:' package.json; then
        if [ -f pnpm-lock.yaml ]; then cmd=(pnpm add simple-icons)
        elif [ -f yarn.lock ]; then cmd=(yarn add simple-icons)
        elif [ -f bun.lockb ] || [ -f bun.lock ]; then cmd=(bun add simple-icons)
        else cmd=(npm install simple-icons --no-fund --no-audit); fi
        echo "add-assets: ${cmd[*]}  (in $(pwd); updates package.json and the lockfile)" >&2
        [ -n "${ADD_ASSETS_DRY_RUN:-}" ] || "${cmd[@]}" >/dev/null 2>&1 || echo "add-assets: could not install simple-icons; run the command above by hand" >&2
      fi ;;
    solutions) copy assets/icons public/assets/icons ;;
    *) echo "add-assets: unknown group '$g' (brand, certification, glyphs, solutions, all)" >&2; exit 1 ;;
  esac
done
exit 0
