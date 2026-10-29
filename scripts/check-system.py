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
    ("text-muted", "inspire-grey", 4.5, "muted text on the grey surface"),
    ("text-link", "inspire-grey", 4.5, "links on the grey surface"),
    ("text-link-hover", "white", 4.5, "link hover on white"),
    ("white", "blue-600", 4.5, "primary button hover"),
    ("white", "blue-800", 4.5, "dark button hover"),
    ("white", "blue-active-dark", 4.5, "dark button active"),
    ("excellence-blue", "white", 4.5, "secondary button text on white"),
    ("excellence-blue", "inspire-grey", 4.5, "secondary button text on the grey surface"),
    ("blue-600", "blue-tint-50", 4.5, "brand tag text"),
    ("text-on-dark-secondary", "surface-dark-alt", 4.5, "secondary text on elaniin-black"),
    ("text-on-dark-muted", "surface-dark-alt", 4.5, "muted text on elaniin-black (research dates)"),
    ("text-on-dark-accent", "surface-dark-alt", 4.5, "accent text on elaniin-black"),
    ("success-text", "success-bg", 4.5, "status success"),
    ("warning-text", "warning-bg", 4.5, "status warning"),
    ("error-text", "error-bg", 4.5, "status error"),
    ("info-text", "info-bg", 4.5, "status info"),
    ("neutral-text", "neutral-bg", 4.5, "status neutral"),
    ("success-dot", "white", 3.0, "status dot success (graphic)"),
    ("warning-dot", "white", 3.0, "status dot warning (graphic)"),
    ("error-dot", "white", 3.0, "status dot error (graphic)"),
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


# the nav-bar theme exists twice (vanilla for standalone HTML, React for the starter): both must keep the same algorithm
print()
vanilla = (ROOT / "skills/elaniin-style/templates/nav-theme.js").read_text()
react = (ROOT / "skills/elaniin-style/templates/site-starter/src/components/layout/nav.tsx").read_text()
MARKERS = [
    (r"\[data-nav-theme\]", "selects the sections that declare a theme"),
    (r"navTheme\s*===\s*['\"]black['\"]", "black tone for data-nav-theme=black"),
    (r"offsetHeight\s*(\?\?[^)]*\))?\s*/\s*2", "uses the middle of the bar"),
    (r"r\.top\s*<=\s*mid\s*&&\s*r\.bottom\s*>\s*mid", "the section crossing the middle wins"),
    (r"requestAnimationFrame", "rAF-throttled"),
    (r"['\"]scroll['\"]", "listens to scroll"),
    (r"['\"]resize['\"]", "listens to resize"),
]
parity_bad = []
for pat, what in MARKERS:
    for name, src in (("nav-theme.js", vanilla), ("nav.tsx", react)):
        if not re.search(pat, src):
            parity_bad.append(f"{name}: {what}")
print("nav parity:", "ok, vanilla and React share the same algorithm markers" if not parity_bad else "MISSING " + "; ".join(parity_bad))

if bad or motion_bad or parity_bad:
    sys.exit(1)
print("\ncheck-system: ok")
