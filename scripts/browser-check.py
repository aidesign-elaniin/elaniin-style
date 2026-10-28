#!/usr/bin/env python3
"""Browser checks without Playwright: headless Chrome loads every page in an iframe and measures.

  python3 scripts/browser-check.py <folder>                 pages from <folder>/site-manifest.json, or every .html in it
  python3 scripts/browser-check.py <folder> --widths 375,768,1280 --only /servicios/ /contacto/

What it checks (the things the static checks cannot see):
  0. The design tokens are present on the page (otherwise every result below would be meaningless).
  1. Horizontal overflow of each page at each width (document wider than the viewport).
  2. Keyboard focus: every visible link/button/input shows a ring when focused (outline or box-shadow changes).
  3. Reduced motion: with the browser asking for reduced motion, no infinite animation keeps running.
What it does NOT check: tab order, contrast of rendered pixels (see check-system.py for the token pairs), real-device behavior.
Chrome: set CHROME=/path/to/chrome, or it looks for google-chrome / chromium / the macOS app.
"""
import argparse
import functools
import http.server
import json
import os
import pathlib
import re
import shutil
import socketserver
import subprocess
import sys
import threading

DRIVER = """<!doctype html><meta charset="utf-8"><title>running</title>
<body>
<style>iframe{position:absolute;left:-99999px;top:0;height:900px;border:0}</style>
<script>
const PATHS = __PATHS__, WIDTHS = __WIDTHS__;
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';
const visible = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
const ring = (s) => (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0 ? s.outlineColor + s.outlineWidth : '') + '|' + s.boxShadow;
(async function () {
  const out = [];
  for (const width of WIDTHS) {
    for (const path of PATHS) {
      const f = document.createElement('iframe');
      f.style.width = width + 'px';
      f.src = path;
      document.body.appendChild(f);
      await new Promise((ok) => (f.onload = ok));
      await new Promise((ok) => setTimeout(ok, 500));
      const d = f.contentDocument, w = f.contentWindow, root = d.documentElement;
      const rec = { path, width, overflow: Math.max(0, root.scrollWidth - width), styled: !!w.getComputedStyle(root).getPropertyValue('--color-elevate-blue').trim(), noFocusRing: [], infinite: [] };
      for (const el of Array.from(d.querySelectorAll(FOCUSABLE)).filter(visible).slice(0, 80)) {
        const before = ring(w.getComputedStyle(el));
        el.focus();
        const after = ring(w.getComputedStyle(el));
        el.blur();
        if (before === after) rec.noFocusRing.push((el.tagName.toLowerCase() + ' ' + (el.getAttribute('aria-label') || el.textContent || el.getAttribute('href') || '').trim().slice(0, 40)).trim());
      }
      for (const a of d.getAnimations()) {
        const t = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming() : null;
        if (a.playState === 'running' && t && t.iterations === Infinity) rec.infinite.push((a.animationName || a.transitionProperty || 'animation'));
      }
      out.push(rec);
      f.remove();
    }
  }
  const s = document.createElement('script');
  s.type = 'application/json'; s.id = 'result'; s.textContent = JSON.stringify(out);
  document.head.appendChild(s);
  document.title = 'done';
})();
</script>
</body>"""


def find_chrome():
    for c in (os.environ.get("CHROME"), shutil.which("google-chrome"), shutil.which("chromium"), shutil.which("chromium-browser"),
              "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"):
        if c and os.path.exists(c):
            return c
    sys.exit("browser-check: Chrome not found (set CHROME=/path/to/chrome)")


def pages(folder, only):
    manifest = folder / "site-manifest.json"
    if manifest.exists():
        paths = [r["path"] for r in json.loads(manifest.read_text())["routes"]]
    else:
        paths = ["/" + str(p.relative_to(folder)) for p in sorted(folder.rglob("*.html")) if "__check" not in p.name]
    return [p for p in paths if not only or p in only]


def serve(folder, driver_html):
    class Handler(http.server.SimpleHTTPRequestHandler):
        def do_GET(self):
            if self.path.split("?")[0] == "/__check.html":
                body = driver_html.encode()
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return
            return super().do_GET()

        def log_message(self, *a):
            pass

    socketserver.TCPServer.allow_reuse_address = True
    srv = socketserver.TCPServer(("127.0.0.1", 0), functools.partial(Handler, directory=str(folder)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


def run_chrome(chrome, url, reduced):
    args = [chrome, "--headless=new", "--disable-gpu", "--no-sandbox", "--hide-scrollbars", "--window-size=1400,900",
            "--virtual-time-budget=240000", "--dump-dom"]
    if reduced:
        args.append("--force-prefers-reduced-motion")
    dom = subprocess.run(args + [url], capture_output=True, text=True, timeout=600).stdout
    m = re.search(r'<script type="application/json" id="result">(.*?)</script>', dom, re.S)
    if not m:
        sys.exit("browser-check: the page produced no result (Chrome blocked or timed out)")
    return json.loads(m.group(1).replace("&lt;", "<").replace("&gt;", ">").replace("&amp;", "&"))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("folder")
    ap.add_argument("--widths", default="375,768,1280")
    ap.add_argument("--only", nargs="*", default=[])
    ns = ap.parse_args()
    folder = pathlib.Path(ns.folder).resolve()
    paths = pages(folder, ns.only)
    widths = [int(w) for w in ns.widths.split(",")]
    driver = DRIVER.replace("__PATHS__", json.dumps(paths)).replace("__WIDTHS__", json.dumps(widths))
    srv = serve(folder, driver)
    url = f"http://127.0.0.1:{srv.server_address[1]}/__check.html"
    chrome = find_chrome()
    normal = run_chrome(chrome, url, reduced=False)
    reduced = run_chrome(chrome, url, reduced=True)
    srv.shutdown()

    problems = []
    for r in normal:
        if not r["styled"]:
            problems.append(f"styles did not load (no design tokens)  {r['path']} @ {r['width']}px (offline? the standalone HTML needs the Tailwind CDN)")
        if r["overflow"]:
            problems.append(f"overflow +{r['overflow']}px  {r['path']} @ {r['width']}px")
    seen = set()
    for r in normal:
        for el in r["noFocusRing"]:
            key = (r["path"], el)
            if key not in seen:
                seen.add(key)
                problems.append(f"no focus ring  {r['path']}  [{el}]")
    for r in reduced:
        for a in sorted(set(r["infinite"])):
            problems.append(f"infinite animation with reduced motion  {r['path']} @ {r['width']}px  [{a}]")
    print(f"{len(paths)} pages x {len(widths)} widths, normal and reduced-motion runs")
    if problems:
        print("\n".join("  - " + p for p in problems[:60]))
        if len(problems) > 60:
            print(f"  ... and {len(problems) - 60} more")
        sys.exit(1)
    print("OK: no overflow, every focusable element shows a ring, no infinite animation with reduced motion")


if __name__ == "__main__":
    main()
