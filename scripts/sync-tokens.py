#!/usr/bin/env python3
"""Single source of the design tokens: skills/elaniin-style/templates/tokens.css.

Everything that copies it is derived from it:
  - site-starter/src/styles/tokens.css           exact copy
  - landing.html, deck.html, dashboard.html      the @theme static block and every @utility they share with tokens.css
  - landing.html also inlines nav-theme.js and iso-stack.js (checked, not regenerated)

  python3 scripts/sync-tokens.py            rewrite the copies that drifted (build-docs.py does this on every run)
  python3 scripts/sync-tokens.py --check    change nothing; exit 1 and list what drifted (use it in review or CI)
"""
import pathlib
import re
import sys

TD = pathlib.Path(__file__).resolve().parent.parent / "skills/elaniin-style/templates"


def blocks(text, kind="utility"):
    """Top-level `@utility name { ... }` blocks (they end with a closing brace at column 0)."""
    return {m.group(1): m.group(0) for m in re.finditer(r"^@" + kind + r" ([\w-]+) \{\n.*?^\}\n", text, re.S | re.M)}


def theme(text):
    i = text.index("@theme static {")
    return text[i:].split("\n}\n", 1)[0] + "\n}\n"


def run(write):
    src = (TD / "tokens.css").read_text()
    src_utils, src_theme = blocks(src), theme(src)
    drift = []

    starter = TD / "site-starter/src/styles/tokens.css"
    if starter.read_text() != src:
        drift.append("site-starter/src/styles/tokens.css")
        if write:
            starter.write_text(src)

    for name in ("landing", "deck", "dashboard"):
        path = TD / f"{name}.html"
        text = path.read_text()
        new = text.replace(theme(text), src_theme, 1)
        for uname, block in blocks(new).items():
            if uname in src_utils and block != src_utils[uname]:
                new = new.replace(block, src_utils[uname], 1)
        if new != text:
            drift.append(f"{name}.html")
            if write:
                path.write_text(new)

    landing = (TD / "landing.html").read_text()
    for js in ("nav-theme.js", "iso-stack.js"):
        if (TD / js).read_text().strip() not in landing:
            drift.append(f"landing.html (inline {js} differs from templates/{js}: paste the file again)")
    return drift


if __name__ == "__main__":
    check = "--check" in sys.argv
    drift = run(write=not check)
    inline = [d for d in drift if "inline" in d]
    if check:
        if drift:
            print("drift from tokens.css:\n  - " + "\n  - ".join(drift))
            sys.exit(1)
        print("sync-tokens: ok, every copy matches tokens.css")
    else:
        fixed = [d for d in drift if "inline" not in d]
        if fixed:
            print("synced from tokens.css:", ", ".join(fixed))
        if inline:
            print("NOT regenerated (fix by hand):\n  - " + "\n  - ".join(inline))
            sys.exit(1)
