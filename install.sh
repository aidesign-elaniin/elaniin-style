#!/usr/bin/env bash
# install.sh — Elaniin Style installer.
#
# Two modes:
#   1) Local:  run from a cloned repo (or with SOURCE_DIR set) — copies files directly.
#   2) Piped:  curl -fsSL https://elaniin-style.netlify.app/install.sh | bash
#              — downloads the release ZIP for TAG from GitHub, then copies.
#
# Flags:
#   --project <dir>   install into <dir>/ (default: current directory)
#   --codex           also install for Codex / OpenAI Codex CLI (~/.codex)
#   --all             install for every detected agent (claude + codex)
#   -h | --help       show help
#
# Bilingüe: los mensajes salen en el idioma detectado (ES si LANG/LC_ALL contiene "es").
set -euo pipefail

REPO="danielpineda-elaniin/elaniin-style"
TAG="${ELANIN_TAG:-v1.0.3}"
SKILL_NAME="elaniin-style"

# ---------- i18n ----------
if [[ "${LANG:-}${LC_ALL:-}${LC_MESSAGES:-}" == *es* ]]; then
  MSG_INSTALLED="✓ Skill instalada en:"
  MSG_DONE="Listo. Reinicia tu sesión de Claude Code (o abre un proyecto nuevo) para que la skill esté disponible."
  MSG_NO_NET="✗ No se pudo descargar el paquete. Verifica tu conexión o clona el repo manualmente:"
  MSG_OLD="Se encontró la skill anterior 'elaniin-brand'. Se puede desactivar con: /plugin uninstall elaniin-brand (si estaba como plugin) o eliminando ~/.claude/skills/elaniin-brand."
  MSG_HELP="Uso: install.sh [--project <dir>] [--codex] [--all]"
  MSG_DETECT="Detectando agentes…"
else
  MSG_INSTALLED="✓ Skill installed to:"
  MSG_DONE="Done. Restart your Claude Code session (or open a new project) so the skill is available."
  MSG_NO_NET="✗ Could not download the package. Check your connection or clone the repo manually:"
  MSG_OLD="Found previous skill 'elaniin-brand'. You can disable it with: /plugin uninstall elaniin-brand (if installed as a plugin) or by removing ~/.claude/skills/elaniin-brand."
  MSG_HELP="Usage: install.sh [--project <dir>] [--codex] [--all]"
  MSG_DETECT="Detecting agents…"
fi

log()  { printf '%s\n' "$*"; }
info() { printf '→ %s\n' "$*"; }

# ---------- args ----------
PROJECT_DIR=""
FLAG_CODEX=0
FLAG_ALL=0
while [ $# -gt 0 ]; do
  case "$1" in
    --project) PROJECT_DIR="${2:-}"; shift 2 ;;
    --codex) FLAG_CODEX=1; shift ;;
    --all) FLAG_ALL=1; shift ;;
    -h|--help) log "$MSG_HELP"; exit 0 ;;
    *) log "$MSG_HELP"; exit 1 ;;
  esac
done

# ---------- locate source ----------
SOURCE_DIR="${ELANIN_SOURCE:-}"
cleanup_tmp=0
tmpdir=""

if [ -z "$SOURCE_DIR" ] && [ -f "skills/${SKILL_NAME}/SKILL.md" ]; then
  SOURCE_DIR="."
fi

if [ -z "$SOURCE_DIR" ]; then
  info "Downloading ${REPO} @ ${TAG}…"
  tmpdir="$(mktemp -d)"
  cleanup_tmp=1
  zip_path="${tmpdir}/pkg.zip"
  if ! curl -fsSL "https://codeload.github.com/${REPO}/zip/refs/tags/${TAG}" -o "$zip_path" 2>/dev/null; then
    log "$MSG_NO_NET"
    log "  https://github.com/${REPO}"
    rm -rf "$tmpdir"
    exit 1
  fi
  unzip -q "$zip_path" -d "$tmpdir"
  # codeload has used both `repo-tag` and `repo_tag` folder names — locate by content
  skill_dir="$(find "$tmpdir" -maxdepth 3 -type d -path "*/skills/${SKILL_NAME}" | head -n1)"
  SOURCE_DIR="$(dirname "$(dirname "$skill_dir")")"
  if [ -z "$SOURCE_DIR" ] || [ ! -f "${SOURCE_DIR}/skills/${SKILL_NAME}/SKILL.md" ]; then
    log "$MSG_NO_NET"
    rm -rf "$tmpdir"
    exit 1
  fi
fi

# ---------- copy into a target root ----------
install_into() {
  local target_root="$1"
  local agent_label="$2"
  mkdir -p "${target_root}/skills"
  rm -rf "${target_root}/skills/${SKILL_NAME}"
  cp -R "${SOURCE_DIR}/skills/${SKILL_NAME}" "${target_root}/skills/${SKILL_NAME}"
  # scripts useful to the skill
  if [ -d "${SOURCE_DIR}/scripts" ]; then
    mkdir -p "${target_root}/skills/${SKILL_NAME}/scripts"
    cp -R "${SOURCE_DIR}/scripts/." "${target_root}/skills/${SKILL_NAME}/scripts/"
    chmod +x "${target_root}/skills/${SKILL_NAME}/scripts/"*.sh 2>/dev/null || true
  fi
  log "${MSG_INSTALLED} ${target_root}/skills/${SKILL_NAME}  [${agent_label}]"
}

# ---------- targets ----------
log "$MSG_DETECT"

# Claude Code (project-level)
if [ -n "$PROJECT_DIR" ]; then
  mkdir -p "$PROJECT_DIR"
  install_into "$PROJECT_DIR/.claude" "Claude Code · project"
elif [ "$FLAG_ALL" -eq 0 ] && [ "$FLAG_CODEX" -eq 0 ]; then
  # default: current dir as project
  install_into "./.claude" "Claude Code · project"
fi

# Claude Code (user-level) when --all
if [ "$FLAG_ALL" -eq 1 ]; then
  install_into "${HOME}/.claude" "Claude Code · user"
fi

# Codex
if [ "$FLAG_CODEX" -eq 1 ] || [ "$FLAG_ALL" -eq 1 ]; then
  install_into "${HOME}/.codex" "Codex"
fi

# ---------- legacy skill hint ----------
if [ -d "${HOME}/.claude/skills/elaniin-brand" ]; then
  log "$MSG_OLD"
fi

rm -rf "$tmpdir" 2>/dev/null || true
log ""
log "$MSG_DONE"
