#!/usr/bin/env python3
"""Automatic checks of the design system that do not need a browser.

1. Contrast: the documented text/background pairs of tokens.css meet WCAG (4.5:1 text, 3:1 large text and UI parts).
2. Reduced motion: every @utility that animates or transitions honors prefers-reduced-motion.
Run:  python3 scripts/check-system.py     (build-docs.py runs it too and stops on failure)
What it does NOT cover: keyboard focus order, real focus rings on a page, motion that is not in tokens.css.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
CSS = (ROOT / "skills/elaniin-style/templates/tokens.css").read_text()


def color(name):
    m = re.search(r"--color-" + re.escape(name) + r":\s*(#[0-9a-fA-F]{6}|rgba?\([^)]*\))\s*;", CSS)
    if not m:
        raise SystemExit(f"check-system: token --color-{name} not found")
    v = m.group(1)
    if v.startswith("#"):
        return tuple(int(v[i:i + 2], 16) for i in (1, 3, 5)), 1.0
    nums = [float(x) for x in re.findall(r"[\d.]+", v)]
    return tuple(int(n) for n in nums[:3]), (nums[3] if len(nums) > 3 else 1.0)


def blend(fg, bg):
    (c, a), (b, _) = fg, bg
    return tuple(round(c[i] * a + b[i] * (1 - a)) for i in range(3))


def lum(rgb):
    def ch(v):
        v /= 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = (ch(v) for v in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(fg_name, bg_name):
    bg = color(bg_name)
    fg = color(fg_name)
    f = blend(fg, bg) if fg[1] < 1 else fg[0]
    l1, l2 = sorted((lum(f), lum(bg[0])), reverse=True)
    return (l1 + 0.05) / (l2 + 0.05)


# (foreground token, background token, minimum ratio, what it is)
PAIRS = [
    ("text-primary", "white", 4.5, "body text on white"),
    ("text-primary", "inspire-grey", 4.5, "body text on the grey surface"),
    ("text-secondary", "white", 4.5, "secondary text on white"),
    ("text-secondary", "inspire-grey", 4.5, "secondary text on the grey surface"),
    ("text-muted", "white", 4.5, "muted text on white"),
    ("text-link", "white", 4.5, "links on white"),
    ("white", "elevate-blue", 4.5, "button label on elevate-blue"),
    ("text-on-dark", "surface-dark", 4.5, "white text on excellence-blue"),
    ("text-on-dark-secondary", "surface-dark", 4.5, "secondary text on excellence-blue"),
    ("text-on-dark-muted", "surface-dark", 4.5, "muted text on excellence-blue"),
    ("text-on-dark-accent", "surface-dark", 4.5, "accent text on excellence-blue"),
    ("text-on-dark", "surface-dark-alt", 4.5, "white text on elaniin-black"),
    ("border-input", "white", 3.0, "input border on white (UI part)"),
    ("elevate-blue", "white", 3.0, "focus ring / accent on white (UI part)"),
]

bad = []
for fg, bg, need, what in PAIRS:
    r = ratio(fg, bg)
    flag = "ok " if r >= need else "FAIL"
    print(f"{flag} {r:5.2f}:1 (min {need})  {what}  [{fg} on {bg}]")
    if r < need:
        bad.append(what)

# reduced motion: every utility block that animates or transitions must carry its own override
print()
motion_bad = []
for m in re.finditer(r"^@utility ([\w-]+) \{\n(.*?)^\}\n", CSS, re.S | re.M):
    name, body = m.group(1), m.group(2)
    if re.search(r"\banimation\s*:|\btransition\s*:", body) and "prefers-reduced-motion" not in body:
        motion_bad.append(name)
print("reduced motion:", "ok, every animated utility has an override" if not motion_bad else "MISSING in " + ", ".join(motion_bad))

if bad or motion_bad:
    sys.exit(1)
print("\ncheck-system: ok")
