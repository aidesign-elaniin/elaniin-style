#!/usr/bin/env python3
"""Compares the commit of the reference site that the plugin was synced against with the current one.

  python3 scripts/check-design-source.py            informational: prints whether the reference moved (exit 0)
  python3 scripts/check-design-source.py --strict   exit 1 when it moved
The pinned commit lives in skills/elaniin-style/references/source-of-truth.md. Needs network and read access to the repo.
"""
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
doc = (ROOT / "skills/elaniin-style/references/source-of-truth.md").read_text()
pinned = re.search(r"Commit contra el que se sincronizó \| `([0-9a-f]{7,40})`", doc).group(1)
version = re.search(r"Versión implementada por el plugin \| \*\*(v[\d.]+)\*\*", doc).group(1)
repo = re.search(r"Repositorio \| `(https://[^`]+)`", doc).group(1)

try:
    out = subprocess.run(["git", "ls-remote", repo + ".git", "HEAD"], capture_output=True, text=True, timeout=60)
    head = out.stdout.split()[0] if out.returncode == 0 and out.stdout.strip() else None
except Exception:
    head = None

if head is None:
    print(f"check-design-source: could not reach {repo} (offline or no access). Pinned: {pinned} ({version}).")
    sys.exit(0)
if head.startswith(pinned):
    print(f"check-design-source: up to date with the reference ({version}, {pinned}).")
    sys.exit(0)
print(f"check-design-source: the reference moved. Pinned {pinned} ({version}), now {head[:7]}. See references/source-of-truth.md for how to update.")
sys.exit(1 if "--strict" in sys.argv else 0)
