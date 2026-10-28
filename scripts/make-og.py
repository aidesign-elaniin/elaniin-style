import math, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent  # repo root
logo = (ROOT / "skills/elaniin-style/assets/logotipo-elaniin.svg").as_uri()
import tempfile
OUT = pathlib.Path(tempfile.mkdtemp())

W, H, P = 1200, 630, 16
COLS, ROWS = W // P, H // P  # 75 x 39

# pointer trail: a swoosh across the right side; squares lit by distance (same ramp as module-field.js)
path = [(700 + t * 440, 470 - 300 * math.sin(t * 2.6) - t * 20) for t in [i / 40 for i in range(41)]]
lit = {}
R = 6
for (px, py) in path:
    cx, cy = px / P, py / P
    for dy in range(-R, R + 1):
        for dx in range(-R, R + 1):
            col, row = int(cx) + dx, int(cy) + dy
            if not (0 <= col < COLS and 0 <= row < ROWS):
                continue
            d = math.hypot(col + .5 - cx, row + .5 - cy)
            if d > R:
                continue
            v = (1 - d / R) ** 1.4
            lit[(col, row)] = max(lit.get((col, row), 0), v)
# fade trail with distance from the path start so it reads as a motion trail
colors = ["#1054ff", "#4d75fd", "#6a9aff"]
sizes = [3, 3, 2]
squares = []
for (col, row), v in lit.items():
    # attenuate toward left/bottom so it never competes with the text
    fx = max(0.0, min(1.0, (col * P - 560) / 220))
    v = min(1.0, v * fx * 1.25)
    if v < 0.04:
        continue
    step = 0 if v >= .66 else 1 if v >= .33 else 2
    s = sizes[step]
    x = col * P + P / 2 - s / 2
    y = row * P + P / 2 - s / 2
    squares.append(f'<i style="left:{x}px;top:{y}px;width:{s}px;height:{s}px;background:{colors[step]}"></i>')

html = f'''<!doctype html><html><head><meta charset="utf-8"><style>
@import url("https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=DM+Sans:wght@400;500&family=Geist+Mono:wght@400;500&display=swap");
*{{box-sizing:border-box;margin:0;padding:0}}
body{{width:{W}px;height:{H}px;background:#fff;position:relative;overflow:hidden;font-family:"DM Sans",sans-serif;color:#141414}}
.grid{{position:absolute;inset:0;opacity:.45;
  background-image:conic-gradient(from 270deg at 2px 2px,#d3d4dc 0 90deg,transparent 0);
  background-size:{P}px {P}px;background-position:7px 7px;
  -webkit-mask-image:linear-gradient(to right,transparent 22%,#000 70%);mask-image:linear-gradient(to right,transparent 22%,#000 70%)}}
.lit{{position:absolute;inset:0}}
.lit i{{position:absolute;display:block}}
.logo{{position:absolute;left:72px;top:68px;height:40px}}
.eyebrow{{position:absolute;left:72px;top:176px;font-family:"Geist Mono",monospace;font-size:20px;letter-spacing:.05em;text-transform:uppercase;color:#656873}}
h1{{position:absolute;left:72px;top:196px;width:700px;font-family:"Instrument Sans",sans-serif;font-weight:500;font-size:84px;line-height:1;letter-spacing:-.035em}}
p.lead{{position:absolute;left:72px;top:420px;width:640px;font-size:26px;line-height:1.4;color:#4a4d57}}
.band{{position:absolute;left:0;right:0;bottom:0;height:72px;background:#01172e;display:flex;align-items:center;justify-content:space-between;padding:0 72px}}
.band span{{white-space:nowrap;font-family:"Geist Mono",monospace;font-size:18px;letter-spacing:.05em;text-transform:uppercase;color:#a9b8cc}}
.band b{{font-weight:500;color:#fff}}
</style></head><body>
<div class="grid"></div>
<div class="lit">{''.join(squares)}</div>
<img class="logo" src="{logo}" alt="">
<h1>The Elaniin style, inside Claude</h1>
<p class="lead">Decks, dashboards and landings with the Elaniin 2027 design system.</p>
<div class="band"><span><b>Elaniin Style</b> · Deck · Dashboard · Landing</span><span>aidesign-elaniin.github.io/elaniin-style</span></div>
</body></html>'''
(OUT / "og.html").write_text(html)
print(len(squares), "lit squares")

# render with headless Chrome -> docs/og.png (set CHROME=/path/to/chrome to override)
import subprocess
import os, shutil
CHROME = (
    os.environ.get("CHROME")
    or shutil.which("google-chrome")
    or shutil.which("chromium")
    or "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
)
subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files",
                "--force-device-scale-factor=1", f"--window-size={W},{H}", "--virtual-time-budget=8000",
                f"--screenshot={ROOT / 'docs/og.png'}", (OUT / "og.html").as_uri()], check=True, capture_output=True)
print("wrote docs/og.png")
