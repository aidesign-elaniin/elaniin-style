#!/usr/bin/env bash
# uninstall.sh — remove the Elaniin Style skill from installed locations.
# Flags: --project <dir>  --codex  --all  -h|--help
set -euo pipefail

SKILL_NAME="elaniin-style"

if [[ "${LANG:-}${LC_ALL:-}${LC_MESSAGES:-}" == *es* ]]; then
  MSG_REMOVED="✓ Eliminada:"
  MSG_NONE="No se encontró nada que eliminar en:"
  MSG_HELP="Uso: uninstall.sh [--project <dir>] [--codex] [--all]"
  MSG_DONE="Listo."
else
  MSG_REMOVED="✓ Removed:"
  MSG_NONE="Nothing found to remove in:"
  MSG_HELP="Usage: uninstall.sh [--project <dir>] [--codex] [--all]"
  MSG_DONE="Done."
fi

PROJECT_DIR=""
FLAG_CODEX=0
FLAG_ALL=0
while [ $# -gt 0 ]; do
  case "$1" in
    --project) PROJECT_DIR="${2:-}"; shift 2 ;;
    --codex) FLAG_CODEX=1; shift ;;
    --all) FLAG_ALL=1; shift ;;
    -h|--help) printf '%s\n' "$MSG_HELP"; exit 0 ;;
    *) printf '%s\n' "$MSG_HELP"; exit 1 ;;
  esac
done

remove_from() {
  local target_root="$1"
  if [ -d "${target_root}/skills/${SKILL_NAME}" ]; then
    rm -rf "${target_root}/skills/${SKILL_NAME}"
    printf '%s %s\n' "$MSG_REMOVED" "${target_root}/skills/${SKILL_NAME}"
  else
    printf '%s %s\n' "$MSG_NONE" "${target_root}"
  fi
}

if [ -n "$PROJECT_DIR" ]; then
  remove_from "${PROJECT_DIR}/.claude"
else
  remove_from "./.claude"
  if [ "$FLAG_ALL" -eq 1 ] || [ "$FLAG_CODEX" -eq 1 ]; then
    remove_from "${HOME}/.codex"
  fi
  if [ "$FLAG_ALL" -eq 1 ]; then
    remove_from "${HOME}/.claude"
  fi
fi

printf '%s\n' "$MSG_DONE"
