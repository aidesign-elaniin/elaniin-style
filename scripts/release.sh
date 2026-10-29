#!/usr/bin/env bash
# release.sh <x.y.z> — cuts a release: stamps CHANGELOG.md ("## [Unreleased]" becomes the version),
# bumps plugin.json, regenerates docs/ (the public landing), commits, tags and pushes.
# The tag push triggers .github/workflows/release.yml, which publishes the GitHub Release from the CHANGELOG.
# Day to day: add bullets under "## [Unreleased]" in CHANGELOG.md as you work; run this when you ship.
set -euo pipefail
cd "$(dirname "$0")/.."
v="${1:?usage: scripts/release.sh x.y.z}"
[[ "$v" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo "version must be x.y.z" >&2; exit 1; }
[ -z "$(git status --porcelain --untracked-files=no)" ] || { echo "commit or stash tracked changes first" >&2; exit 1; }
git rev-parse "v$v" >/dev/null 2>&1 && { echo "tag v$v already exists" >&2; exit 1; }
grep -q '^## \[Unreleased\]' CHANGELOG.md || { echo 'CHANGELOG.md needs a "## [Unreleased]" section with the changes' >&2; exit 1; }

python3 - "$v" <<'PY'
import json, re, sys, datetime
v = sys.argv[1]
c = open("CHANGELOG.md").read()
body = c.split("## [Unreleased]", 1)[1]
assert re.search(r"^- ", body.split("\n## [", 1)[0], re.M), "[Unreleased] has no bullets"
c = c.replace("## [Unreleased]", f"## [Unreleased]\n\n## [{v}] - {datetime.date.today()}", 1)
open("CHANGELOG.md", "w").write(c)
p = ".claude-plugin/plugin.json"
d = json.load(open(p)); d["version"] = v
open(p, "w").write(json.dumps(d, indent=2, ensure_ascii=False) + "\n")
PY
python3 scripts/build-docs.py >/dev/null
git add CHANGELOG.md .claude-plugin/plugin.json docs
git commit -m "release: v$v"
git tag -a "v$v" -m "v$v"
git push origin HEAD "v$v"
echo "released v$v"
