import html, pathlib, re

# drift guards: the templates are standalone files, so shared pieces are copied; fail the build if copies diverge
def _theme(path):
    h = open(path).read()
    return h[h.index("@theme static {"):].split("\n}\n", 1)[0]
_TD = str(pathlib.Path(__file__).resolve().parent.parent / "skills/elaniin-style/templates") + "/"
for _n in ("landing", "deck", "dashboard"):
    assert _theme(_TD + _n + ".html") == _theme(_TD + "tokens.css"), _n + ".html: @theme static differs from tokens.css"
assert open(_TD + "tokens.css").read() == open(_TD + "site-starter/src/styles/tokens.css").read(), "site-starter/src/styles/tokens.css differs from tokens.css"
assert open(_TD + "iso-stack.js").read().strip() in open(_TD + "landing.html").read(), "landing.html: inline iso-stack differs from iso-stack.js"

ROOT = pathlib.Path(__file__).resolve().parent.parent  # repo root
src = (ROOT / "skills/elaniin-style/templates/landing.html").read_text().split("\n")
b_i = src.index("<body>")
e_i = next(i for i in range(b_i, len(src)) if src[i].strip() == "</svg>")
head = "\n".join(src[: e_i + 1])  # through the logo <symbol> sprite
MF_JS = (ROOT / "skills/elaniin-style/templates/module-field.js").read_text()
ISO_JS = (ROOT / "skills/elaniin-style/templates/iso-stack.js").read_text()
SITES_JS = r"""
/* "Complete sites": the steps light up in turn while on screen, and the isometric scene shows pages going
   from placeholder (grey) to real (blue) one by one. Both rest on their finished state with reduced motion. */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var steps = document.querySelector('[data-sites-steps]');
  if (steps && !reduce) {
    var items = Array.prototype.slice.call(steps.children), cur = -1, timer = null;
    var tick = function () { cur = (cur + 1) % items.length; items.forEach(function (li, i) { li.dataset.on = String(i === cur); }); };
    new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting && timer === null) { tick(); timer = setInterval(tick, 2400); }
        else if (!en.isIntersecting && timer !== null) { clearInterval(timer); timer = null; }
      });
    }, { threshold: 0.3 }).observe(steps);
  }

  var host = document.querySelector('[data-sites-iso]');
  var K = window.ElaniinIso;
  if (!host || !K) return;
  var NS = 'http://www.w3.org/2000/svg', O = { x: 290, y: 130 };
  var PLATE = { x: -130, y: -90, z: 0, w: 350, d: 290, h: 10 };
  var MASTER = { x: -30, y: -70, z: 10, w: 170, d: 80, h: 50 };
  var TILES = [{ x: -105, label: 'Services' }, { x: -5, label: 'Cases' }, { x: 95, label: 'Blog' }].map(function (t) {
    return { x: t.x, y: 90, z: 10, w: 80, d: 70, h: 22, label: t.label };
  });
  var PERIOD = 9600;

  function pill(z, cx, cy, text) {
    var w = 22 + text.length * 8, h = 26;
    var plane = K.planeTransform(O, z) + ' matrix(0 -1 1 0 ' + (cx - h / 2) + ' ' + (cy + w / 2) + ')';
    return '<g transform="' + plane + '"><rect width="' + w + '" height="' + h + '" rx="7" style="fill:var(--color-white);stroke:var(--color-excellence-blue);stroke-opacity:.9"/>' +
      '<text x="' + (w / 2) + '" y="17" text-anchor="middle" style="fill:var(--color-text-primary);font-family:var(--font-display);font-size:13px;font-weight:500">' + text + '</text></g>';
  }
  function line3(pts, z) {
    return '<polyline points="' + K.pointsAttr(pts.map(function (p) { return { x: p[0], y: p[1], z: z }; }), O) +
      '" style="fill:none;stroke:var(--color-excellence-blue);stroke-width:1;stroke-opacity:.35;stroke-linejoin:round"/>';
  }
  var MX = MASTER.x + MASTER.w / 2, MY = MASTER.y + MASTER.d, BY = 60;
  var base = K.floorSvg(O, PLATE.x + 20, PLATE.y + 20, PLATE.w - 40, PLATE.d - 40, -34) +
    K.slabSvg('plate', PLATE, O) + K.slabSvg('software', MASTER, O) +
    line3([[MX, MY], [MX, BY]], 10.5) +
    line3([[TILES[0].x + 40, BY], [TILES[2].x + 40, BY]], 10.5) +
    TILES.map(function (t) { return line3([[t.x + 40, BY], [t.x + 40, t.y]], 10.5); }).join('');
  var tiles = TILES.map(function (t, i) {
    return '<g data-grey="' + i + '">' + K.slabSvg('cloud', t, O) + '</g><g data-blue="' + i + '" style="opacity:0">' + K.slabSvg('software', t, O) + '</g>';
  }).join('');
  var pills = pill(MASTER.z + MASTER.h, MX, MASTER.y + MASTER.d / 2, 'Site map') +
    TILES.map(function (t) { return pill(t.z + t.h, t.x + t.w / 2, t.y + t.d / 2, t.label); }).join('');
  var pulse = '<g data-pulse style="opacity:0"><circle r="11" style="fill:var(--color-blue-400);opacity:.4"/><circle r="4" style="fill:var(--color-elevate-blue)"/><circle r="1.5" style="fill:var(--color-white)"/></g>';
  host.innerHTML = '<svg viewBox="0 0 580 385" class="block w-full" focusable="false" aria-hidden="true"><g class="iso-levitate">' + base + tiles + pills + pulse + '</g></svg>';
  host.setAttribute('aria-hidden', 'true');

  var greys = host.querySelectorAll('[data-grey]'), blues = host.querySelectorAll('[data-blue]');
  var pulseEl = host.querySelector('[data-pulse]');
  function path(i) {
    var cx = TILES[i].x + 40, pts = [[MX, MY], [MX, BY], [cx, BY], [cx, TILES[i].y]].map(function (p) { return K.project({ x: p[0], y: p[1], z: 10.5 }, O); });
    return pts;
  }
  var paths = TILES.map(function (_, i) { return path(i); });
  function render(t) {
    for (var i = 0; i < 3; i++) {
      var start = 400 + i * 2400, trav = K.clamp01((t - start) / 1100);
      var on = K.clamp01((t - (start + 1100)) / 400) * (1 - K.clamp01((t - 8800) / 600));
      blues[i].style.opacity = on;
      if (i === activeLeg(t)) {
        var p = K.pointAt(paths[i], K.easeInOut(trav));
        pulseEl.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ')');
        pulseEl.style.opacity = trav > 0 && trav < 1 ? 1 : 0;
      }
    }
  }
  function activeLeg(t) { return Math.max(0, Math.min(2, Math.floor((t - 400) / 2400))); }
  if (reduce) { for (var k = 0; k < 3; k++) blues[k].style.opacity = 1; return; }
  render(0);
  var raf = null, t0 = 0;
  new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (en.isIntersecting && raf === null) {
        t0 = performance.now();
        raf = requestAnimationFrame(function loop(now) { render((now - t0) % PERIOD); raf = requestAnimationFrame(loop); });
      } else if (!en.isIntersecting && raf !== null) { cancelAnimationFrame(raf); raf = null; }
    });
  }, { threshold: 0.3 }).observe(host);
})();
"""
head = head.replace('<html lang="en">', '<html lang="en">')
head = head.replace("<title>Elaniin — Landing template</title>", "<title>Elaniin Style — Install and docs</title>")
URL = "https://aidesign-elaniin.github.io/elaniin-style/"
META = """<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="description" content="Install Elaniin Style as a Claude plugin: a guide for the team and documentation for developers." />
<link rel="canonical" href="%(u)s" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Elaniin Style" />
<meta property="og:locale" content="en_US" />
<meta property="og:title" content="Elaniin Style — the Elaniin style, inside Claude" />
<meta property="og:description" content="A Claude plugin to create decks, dashboards and landings with the Elaniin 2027 design system. A guide for the team and docs for devs." />
<meta property="og:url" content="%(u)s" />
<meta property="og:image" content="%(u)sog.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Elaniin Style: the Elaniin style, inside Claude, with the brand blue square texture." />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Elaniin Style — the Elaniin style, inside Claude" />
<meta name="twitter:description" content="A Claude plugin for decks, dashboards and landings with the Elaniin 2027 design system." />
<meta name="twitter:image" content="%(u)sog.png" />""" % {"u": URL}
EXTRA_CSS = r'''
/* ---------- docs-only: developer table of contents ---------- */
@utility toc-link {
  display: flex;
  align-items: center;
  min-height: 2.75rem;
  padding-inline: 0.75rem;
  border-radius: var(--radius-button);
  font-size: var(--text-body-sm);
  color: var(--color-text-secondary);
  transition: background-color var(--dur-base) var(--ease-standard), color var(--dur-base) var(--ease-standard);
  @variant lg {
    min-height: 2.25rem;
  }
  &:hover {
    background: var(--color-surface-subtle);
    color: var(--color-text-primary);
  }
  &[aria-current="true"] {
    background: var(--color-blue-tint-50);
    color: var(--color-text-primary);
    font-weight: 500;
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

/* ---------- docs-only: step mockups (driven by the state machine in the page script) ---------- */
@theme {
  --animate-caret: caret 1s steps(1) infinite;
  @keyframes caret {
    50% { opacity: 0; }
  }
}
@utility mock-stage {
  position: relative;
  height: 9rem;
  overflow: hidden;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-menu);
  background: var(--color-surface-subtle);
}
@utility mock-fade {
  opacity: 0;
  transform: translateY(4px);
  transition: opacity var(--dur-base) var(--ease-standard), transform var(--dur-base) var(--ease-standard);
  &.is-on { opacity: 1; transform: none; }
  @media (prefers-reduced-motion: reduce) { transition: none; }
}
@utility mock-hide {
  transition: opacity var(--dur-base) var(--ease-standard);
  &.is-on { opacity: 0; }
  @media (prefers-reduced-motion: reduce) { transition: none; }
}
@utility mock-active {
  transition: background-color var(--dur-base) var(--ease-standard), color var(--dur-base) var(--ease-standard);
  &.is-on { background: var(--color-blue-tint-50); color: var(--color-text-primary); }
  @media (prefers-reduced-motion: reduce) { transition: none; }
}
@utility mock-tab {
  transition: color var(--dur-base) var(--ease-standard);
  &.is-on {
    color: var(--color-text-primary);
    text-decoration: underline;
    text-decoration-color: var(--color-elevate-blue);
    text-decoration-thickness: 2px;
    text-underline-offset: 6px;
  }
  @media (prefers-reduced-motion: reduce) { transition: none; }
}
@utility mock-press {
  transition: transform var(--dur-fast) var(--ease-standard), background-color var(--dur-fast) var(--ease-standard);
  &.is-on { transform: scale(0.92); }
  @media (prefers-reduced-motion: reduce) { transition: none; }
}
@utility mock-switch {
  position: relative;
  flex-shrink: 0;
  width: 1.75rem;
  height: 1rem;
  border-radius: var(--radius-full);
  background: var(--color-border-input);
  transition: background-color var(--dur-base) var(--ease-standard);
  & > i {
    position: absolute;
    top: 0.125rem;
    left: 0.125rem;
    width: 0.75rem;
    height: 0.75rem;
    border-radius: var(--radius-full);
    background: var(--color-white);
    transition: transform var(--dur-base) var(--ease-standard);
  }
  &.is-on { background: var(--color-excellence-blue); }
  &.is-on > i { transform: translateX(0.75rem); }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    & > i { transition: none; }
  }
}
@utility mock-cursor {
  position: absolute;
  z-index: 5;
  left: 95%;
  top: 92%;
  pointer-events: none;
  transition: left var(--dur-reveal) var(--ease-emphasized), top var(--dur-reveal) var(--ease-emphasized);
  @media (prefers-reduced-motion: reduce) { display: none; }
}
@utility mock-caret {
  &.is-typing::after {
    content: "";
    display: inline-block;
    width: 1px;
    height: 0.9em;
    margin-left: 1px;
    vertical-align: -0.1em;
    background: currentColor;
    animation: var(--animate-caret);
  }
}
'''
head = head.replace('</style>\n</head>', EXTRA_CSS + '</style>\n</head>', 1)
head = head.replace('<meta name="viewport" content="width=device-width, initial-scale=1.0" />', META)

REPO = "https://github.com/aidesign-elaniin/elaniin-style"
GITHUB = '<svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>'
ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14m0 0l-6-6m6 6l-6 6"/></svg>'


def code(text, label="bash"):
    t = html.escape(text.strip("\n"))
    return f'''<div class="min-w-0 rounded-code border border-border-on-dark bg-surface-code">
  <div class="flex items-center justify-between border-b border-border-on-dark px-4 py-1">
    <span class="mono-label text-caption text-text-on-dark-muted">{label}</span>
    <button type="button" data-copy class="mono-label inline-flex h-11 min-w-11 items-center justify-center rounded-button px-3 text-caption text-text-on-dark-secondary transition-colors duration-fast hover:bg-surface-dark-card hover:text-white active:scale-95 focus-ring-on-dark">Copy</button>
  </div>
  <pre class="px-4 py-4 font-mono text-code text-text-on-dark whitespace-pre-wrap break-words"><code>{t}</code></pre>
</div>'''


def step(n, title, body, extra="", mock=""):
    return f'''<li class="card-glow lift min-w-0 rounded-card border border-border-default bg-surface-card pad-card">
  {mock}
  <h3 class="font-display font-medium text-h4 text-text-primary"><span class="mr-2 font-mono text-code text-elevate-blue">{n}</span>{title}</h3>
  <p class="mt-2 max-w-[56ch] break-words text-body text-text-secondary">{body}</p>{extra}
</li>'''


def eyebrow_h2(eyebrow, h2, lead=None, dark=False):
    c1 = "text-text-on-dark-accent" if dark else "text-text-muted"
    c2 = "text-white" if dark else "text-text-primary"
    c3 = "text-text-on-dark-secondary" if dark else "text-text-secondary"
    out = f'<h2 class="max-w-[20ch] break-words font-display font-medium text-h2 {c2}">{h2}</h2>'
    if lead:
        out += f'\n<p class="mt-4 max-w-[56ch] break-words text-lead {c3}">{lead}</p>'
    return out


def row(a, b, c):
    return f'''<div class="grid gap-2 border-t border-border-default py-4 md:grid-cols-3">
  <p class="min-w-0 break-words font-mono text-code text-text-primary">{a}</p>
  <p class="min-w-0 break-words text-body-sm text-text-secondary">{b}</p>
  <p class="min-w-0 break-words text-body-sm text-text-muted">{c}</p>
</div>'''


BLOCKS = {}


def block(i, title, body_html):
    BLOCKS[i] = (title, body_html)
    return ""


def p(t):
    return f'<p class="max-w-[68ch] break-words text-body text-text-secondary">{t}</p>'


def ic(t):
    return f'<code class="break-words rounded-tag bg-surface-subtle px-1 font-mono text-code text-text-primary">{t}</code>'


# ------------------------------------------------------------------ team panel
SRC_URL = "https://github.com/aidesign-elaniin/elaniin-style"
SRC_GIT = SRC_URL + ".git"


CURSOR = '<svg class="mock-cursor" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 1l11 5-4.5 1.5L7 12z" class="fill-elaniin-black stroke-white" stroke-width="1.2" stroke-linejoin="round"/></svg>'
BARS = '<div class="space-y-2"><div class="h-2 w-3/4 rounded-full bg-border-default"></div><div class="h-2 w-1/2 rounded-full bg-border-default"></div></div>'

def stage(path, inner):
    return '<div class="mock-stage mb-5" data-mock data-path="' + path + '" aria-hidden="true">' + inner + CURSOR + '</div>'

MOCK_1 = stage("95%,92%|17%,84%|17%,84%|23%,33%|23%,33%|23%,33%|25%,85%|25%,85%|25%,85%", """
  <div class="mock-hide absolute inset-0" data-on="6">
    <div class="flex h-full">
      <div class="relative w-1/3 shrink-0 border-r border-border-default bg-white p-2">
        <div class="h-6 rounded-button px-2 text-[10px] leading-6 text-text-secondary">Chats</div>
        <div class="h-6 rounded-button px-2 text-[10px] leading-6 text-text-secondary">Projects</div>
        <div class="mock-active absolute inset-x-2 bottom-2 flex items-center gap-1.5 rounded-button px-1.5 py-1.5 text-[9px] leading-none text-text-secondary" data-on="2"><span class="h-4 w-4 shrink-0 rounded-full bg-blue-100"></span><span class="truncate">you@company.com</span></div>
      </div>
      <div class="min-w-0 flex-1 p-3">""" + BARS + """</div>
    </div>
    <div class="mock-fade absolute bottom-10 left-2 w-32 rounded-menu border border-border-default bg-white p-1 shadow-menu" data-on="2">
      <div class="mock-active flex items-center justify-between rounded-button px-2 py-1.5 text-[10px] leading-none text-text-secondary" data-on="4"><span>Settings</span><span class="text-text-muted">⌘ ,</span></div>
      <div class="rounded-button px-2 py-1.5 text-[10px] leading-none text-text-secondary">Usage</div>
      <div class="rounded-button px-2 py-1.5 text-[10px] leading-none text-text-secondary">Language</div>
    </div>
  </div>
  <div class="mock-fade absolute inset-0 flex bg-white" data-on="6">
    <div class="w-1/2 shrink-0 space-y-0.5 border-r border-border-default p-2">
      <div class="px-2 py-1 text-[10px] leading-none text-text-secondary">General</div>
      <div class="px-2 py-1 text-[10px] leading-none text-text-secondary">Account</div>
      <p class="px-2 pb-0.5 pt-2 text-[8px] leading-none text-text-muted">Customize</p>
      <div class="px-2 py-1 text-[10px] leading-none text-text-secondary">Skills</div>
      <div class="px-2 py-1 text-[10px] leading-none text-text-secondary">Connectors</div>
      <div class="mock-active rounded-button px-2 py-1 text-[10px] leading-none text-text-secondary" data-on="7">Plugins</div>
    </div>
    <div class="min-w-0 flex-1 p-3">""" + BARS + """</div>
  </div>""")

MOCK_2 = stage("95%,92%|89%,13%|89%,13%|73%,45%|73%,45%|73%,45%", """
  <div class="flex items-center justify-between border-b border-border-default bg-white px-3 py-2">
    <span class="text-[10px] font-medium leading-none text-text-primary">Plugins</span>
    <div class="mock-press rounded-button border border-border-ink px-3 py-1 text-[10px] leading-none text-text-primary" data-on="2" data-off="3">Add</div>
  </div>
  <div class="p-3">""" + BARS + """</div>
  <div class="mock-fade absolute right-3 top-11 w-36 rounded-menu border border-border-default bg-white p-1 shadow-menu" data-on="2">
    <div class="mock-active rounded-button px-2 py-1.5 text-[10px] leading-none text-text-secondary" data-on="4">Add marketplace</div>
    <div class="rounded-button px-2 py-1.5 text-[10px] leading-none text-text-secondary">Upload plugin</div>
  </div>""")

MOCK_3 = stage("95%,95%|50%,73%|50%,73%|50%,73%|50%,64%|50%,64%|83%,80%|83%,80%|83%,80%", """
  <div class="mock-hide absolute inset-x-4 inset-y-3 rounded-menu border border-border-default bg-white p-3 shadow-menu" data-on="4">
    <span class="text-[10px] font-medium leading-none text-text-primary">Add marketplace</span>
    <div class="mt-2 rounded-input border border-border-default px-2 py-2 text-[9px] leading-none text-text-secondary">Browse Anthropic sources</div>
    <div class="mock-active mt-1.5 rounded-input border border-border-default px-2 py-2 text-[9px] leading-none text-text-secondary" data-on="3">Add from a repository</div>
  </div>
  <div class="mock-fade absolute inset-x-4 inset-y-3 rounded-menu border border-border-default bg-white p-3 shadow-menu" data-on="4">
    <span class="text-[10px] font-medium leading-none text-text-primary">Add marketplace</span>
    <div class="mt-1.5 rounded-input bg-surface-subtle px-2 py-1 text-[8px] leading-snug text-text-muted">Standard notice for any marketplace</div>
    <div class="mt-1.5 break-all rounded-input border border-border-input px-2 py-1.5 font-mono text-[7px] leading-snug text-text-primary mock-caret" data-on="5" data-type="https://github.com/aidesign-elaniin/elaniin-style"></div>
    <div class="mock-press ml-auto mt-1.5 w-fit rounded-button bg-elevate-blue px-3 py-1 text-[10px] leading-none text-white" data-on="7" data-off="8">Sync</div>
  </div>""")

MOCK_4 = stage("95%,95%|85%,47%|85%,47%|85%,47%|60%,12%|60%,12%|50%,59%|50%,59%|50%,59%", """
  <div class="flex h-full flex-col bg-white">
    <div class="flex items-center gap-3 border-b border-border-default px-3 py-2">
      <span class="text-[10px] font-medium leading-none text-text-primary">Plugins</span>
      <div class="ml-auto flex items-center gap-3">
        <span class="mock-tab text-[10px] leading-none text-text-secondary" data-on="5">Yours</span>
        <span class="mock-tab text-[10px] leading-none text-text-secondary" data-on="0" data-off="5">Discover</span>
        <span class="flex items-center gap-0.5 rounded-button bg-elaniin-black px-1.5 py-1 text-[8px] font-medium leading-none text-white"><svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>Add</span>
      </div>
    </div>
    <div class="relative min-h-0 flex-1">
      <div class="mock-hide absolute inset-0 p-3" data-on="5">
        <div class="flex items-center gap-2 rounded-button border border-border-default bg-white p-2">
          <span class="h-6 w-6 shrink-0 rounded-button border border-border-default bg-surface-subtle"></span>
          <div class="min-w-0 flex-1">
            <p class="text-[10px] font-medium leading-none text-text-primary">Elaniin style</p>
            <div class="mt-1.5 h-1.5 w-20 rounded-full bg-border-default"></div>
          </div>
          <div class="relative h-5 w-12 shrink-0">
            <span class="mock-hide mock-press absolute inset-0 flex items-center justify-center rounded-button bg-elevate-blue text-[8px] font-medium leading-none text-white" data-on="2" data-off="3">Add</span>
            <span class="mock-fade absolute inset-0 flex items-center justify-center gap-0.5 rounded-button border border-success-border bg-success-bg text-[8px] leading-none text-success-text" data-on="3"><svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>Added</span>
          </div>
        </div>
      </div>
      <div class="mock-fade absolute inset-0 p-3" data-on="5">
        <p class="flex items-center gap-1.5 text-[9px] font-medium leading-none text-text-primary">From marketplaces you added <span class="rounded-full bg-surface-subtle px-1.5 py-0.5 text-[7px] font-normal leading-none text-text-muted">6</span></p>
        <div class="mock-press mt-2" data-on="7">
          <div class="mock-active flex items-center justify-between rounded-button border border-border-default bg-white p-2" data-on="7">
            <div class="min-w-0">
              <p class="font-mono text-[10px] font-medium leading-none text-text-primary">Elaniin Style</p>
              <div class="mt-1.5 h-1.5 w-24 rounded-full bg-border-default"></div>
            </div>
            <span class="text-[12px] leading-none text-text-muted" aria-hidden="true">›</span>
          </div>
        </div>
      </div>
    </div>
  </div>""")

MOCK_5 = stage("95%,95%|88%,38%|88%,38%|88%,38%|88%,38%", """
  <div class="h-full bg-white p-3">
    <p class="truncate font-mono text-[10px] font-medium leading-none text-text-primary">elaniin-style-marketplace</p>
    <div class="mt-3 flex items-center justify-between gap-3 rounded-button border border-border-default p-2.5">
      <div class="min-w-0">
        <p class="text-[10px] leading-none text-text-secondary">Update</p>
        <p class="mt-1 text-[8px] leading-none text-text-muted">Always keep the plugin current</p>
      </div>
      <div class="mock-switch" data-on="2"><i></i></div>
    </div>
  </div>""")

MOCK_6 = stage("95%,35%|45%,79%|45%,79%|27%,45%|45%,79%|45%,79%|90%,79%|90%,79%|90%,79%", """
  <div class="mock-fade absolute left-3 top-3 w-28 rounded-button border border-border-default bg-white p-1.5" data-on="8">
    <div class="aspect-video rounded-tag bg-excellence-blue p-2"><div class="h-1.5 w-3/4 rounded-full bg-white"></div><div class="mt-1.5 h-1 w-1/2 rounded-full bg-text-on-dark-secondary"></div></div>
    <div class="mt-1.5 h-1.5 w-2/3 rounded-full bg-border-default"></div>
  </div>
  <div class="mock-fade absolute inset-x-3 bottom-11 w-36 rounded-menu border border-border-default bg-white p-1 shadow-menu" data-on="2" data-off="4">
    <div class="mock-active rounded-button px-2 py-1.5 font-mono text-[10px] leading-none text-text-secondary" data-on="3">elaniin-style</div>
    <div class="rounded-button px-2 py-1.5 font-mono text-[10px] leading-none text-text-muted">other-skill</div>
  </div>
  <div class="absolute inset-x-3 bottom-3 flex items-center gap-1.5 rounded-menu border border-border-input bg-white px-2 py-1.5">
    <span class="mock-fade text-[10px] leading-none text-text-muted" data-on="2" data-off="4">/</span>
    <span class="mock-fade rounded-tag bg-blue-tint-50 px-1.5 py-1 font-mono text-[9px] leading-none text-text-primary" data-on="4">elaniin-style</span>
    <span class="mock-caret min-w-0 flex-1 truncate text-[9px] leading-none text-text-primary" data-on="5" data-type="Create a pitch deck in the Elaniin style"></span>
    <span class="mock-press flex h-5 w-5 shrink-0 items-center justify-center rounded-button bg-excellence-blue" data-on="7" data-off="8"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14m0 0l-6-6m6 6l-6 6"/></svg></span>
  </div>""")

team_steps = "\n".join([
    step("01", "Open Settings, then Plugins", "In the Claude desktop app click your name or email at the bottom of the left sidebar and choose <strong>Settings</strong> (on Mac you can press <kbd class=\"rounded-tag bg-surface-subtle px-1 font-mono text-code\">⌘ ,</kbd>). In the Settings list, under the <strong>Customize</strong> group, click <strong>Plugins</strong>. You must be signed in to your Claude account.",
         '<p class="mt-3 text-body-sm text-text-secondary">On claude.ai you can also go straight to <a href="https://claude.ai/customize/plugins" target="_blank" rel="noopener" class="font-medium text-elevate-blue underline underline-offset-4 hover:text-text-link-hover focus-ring">claude.ai/customize/plugins</a></p>', mock=MOCK_1),
    step("02", "Choose Add, then Add marketplace", "On the Plugins page click <strong>Add</strong>, then choose <strong>Add marketplace</strong>. A small window opens with two options.", mock=MOCK_2),
    step("03", "Paste the Elaniin address", "A window with a few small moves. Use <strong>this exact address</strong> every time.",
         '<ol class="mt-3 list-decimal space-y-1 pl-5 text-body-sm text-text-secondary"><li>Choose <strong>Add from a repository</strong>.</li><li>Paste the address in the <strong>URL</strong> box.</li><li>Click <strong>Sync</strong>.</li></ol>'
         '<p class="mt-3 rounded-card bg-surface-subtle p-4 text-body-sm text-text-secondary"><strong>A red notice will appear. Relax, it is normal.</strong> Claude shows it for every marketplace that is not from Anthropic. This repository is Elaniin\'s and public, so you can go ahead.</p>'
         f'<div class="mt-4">{code(SRC_URL, "address")}</div>', mock=MOCK_3),
    step("04", "Install elaniin-style", "In <strong>Discover</strong> the marketplace shows an <strong>Elaniin style</strong> card: click <strong>Add</strong> and it changes to <strong>Added</strong>. Then open the <strong>Yours</strong> tab and click the <strong>Elaniin Style</strong> card. It is saved to your account, so it is also available in chat, Cowork and Claude Code.", mock=MOCK_4),
    step("05", "Check that updates are on", "In the same <strong>Yours</strong> tab, open the Elaniin marketplace you added. Check that the <strong>Update</strong> switch is on. If it is off, turn it on so the plugin always stays up to date.", mock=MOCK_5),
    step("06", "Use it", "In any chat type " + ic("/") + " in the message box, type <strong>elaniin</strong> and pick <strong>Elaniin Style</strong>, then write what you want, for example “Create a pitch deck in the Elaniin style”. You can also just describe the task: Claude loads the skill when it matches.", mock=MOCK_6),
])

team_check = """<div class="mt-8 max-w-[68ch] rounded-card border border-border-default bg-surface-subtle p-6">
  <h3 class="font-display font-medium text-h4">How to know it worked</h3>
  <p class="mt-2 text-body text-text-secondary">Open <strong>Settings → Plugins</strong>: <strong>Elaniin Style</strong> is listed and its <strong>Disable plugin</strong> toggle is on. If you type <code class=\"break-words rounded-tag bg-white px-1 font-mono text-code text-text-primary\">/elaniin</code> in a chat, the skill shows up in the menu.</p>
</div>

<details class="group mt-4 max-w-[68ch] rounded-card border border-border-default py-1">
  <summary class="flex min-h-11 cursor-pointer items-center justify-between gap-4 px-6 font-display font-medium text-h4 focus-ring">Using the Code tab of the desktop app<span class="mono-label shrink-0 text-caption text-elevate-blue transition-transform duration-base group-open:rotate-45" aria-hidden="true">+</span></summary>
  <div class="space-y-3 px-6 pb-5 text-body text-text-secondary">
    <p>A plugin you add from <strong>Settings → Plugins</strong> is downloaded to the Code tab the next time you start a session signed in to the same account.</p>
    <p>If it is not there yet, type <code class=\"break-words rounded-tag bg-surface-subtle px-1 font-mono text-code text-text-primary\">/reload-plugins</code> in the session, or start a new one. You can also click <strong>+</strong> next to the prompt box and choose <strong>Add plugins</strong> or <strong>Manage plugins</strong>.</p>
    <p>In the Code tab invoke it by typing <code class=\"break-words rounded-tag bg-surface-subtle px-1 font-mono text-code text-text-primary\">/elaniin:elaniin-style</code>. Plugins are available in local and SSH sessions, not in cloud sessions.</p>
  </div>
</details>"""

team_prompts = "\n".join(
    f'''<div class="card-glow lift min-w-0 rounded-card border border-border-default bg-surface-card p-6">
  <p class="break-words font-display font-medium text-h4 text-text-primary">{txt}</p>
  <button type="button" data-copy-text="{html.escape(txt, quote=True)}" class="btn-arrow mono-label mt-5 inline-flex h-11 items-center gap-2 rounded-button border border-border-ink px-4 text-caption text-text-primary transition-colors duration-base hover:bg-surface-subtle focus-ring">Copy request {ARROW}</button>
</div>'''
    for lab, txt in [
        ("Presentación", "Create an 8-slide pitch deck in the Elaniin style to present our digital product service."),
        ("Reporte", "Design a dashboard in the Elaniin style with last quarter's metrics that I'm about to paste."),
        ("Página", "Build a landing page in the Elaniin style to present our new service."),
        ("Textura", "Add the interactive module field texture to this page's hero, like on the Elaniin site."),
    ])

faq = [
    ("Do I have to install anything on my computer?", "No. It installs inside Claude, from the Plugins screen. No terminal needed."),
    ("I do not see “Add marketplace”", "On company Claude plans an administrator decides whether people can add their own marketplaces. Ask the person who manages your Claude workspace to allow it or to add Elaniin Style for you."),
    ("It does not show up when I type /", "Open <strong>Settings → Plugins</strong> and check that <strong>Elaniin Style</strong> is on. Then start a new conversation. In the Code tab type /reload-plugins or start a new session."),
    ("When do improvements arrive?", "On their own while the <strong>Update</strong> switch is on in the Elaniin marketplace. If it is off, open <strong>Plugins → Yours</strong> and turn it on."),
    ("I get an error saying “network source differs”", "You had already added Elaniin Style with a different form of address. In Plugins open the Elaniin marketplace, click <strong>Remove</strong>, and add it again pasting the full address from step 03."),
    ("Claude asks me to connect GitHub", "The Elaniin repository is public, so this is not normally needed. If it still asks, check that you pasted the full address starting with <strong>https://github.com/</strong>, and if it persists send the message to a developer."),
    ("My deck or page needs a fine tweak", "Ask Claude in the same conversation. If you need manual editing, hand the HTML file to a developer: it is built with Tailwind for exactly that."),
]
faq_html = "\n".join(
    f'''<details class="group border-t border-border-default py-4">
  <summary class="flex min-h-11 cursor-pointer items-center justify-between gap-4 font-display font-medium text-h4 text-text-primary focus-ring">{q}<span class="mono-label shrink-0 text-caption text-elevate-blue transition-transform duration-base group-open:rotate-45" aria-hidden="true">+</span></summary>
  <p class="mt-3 max-w-[68ch] break-words text-body text-text-secondary">{a}</p>
</details>'''
    for q, a in faq)

panel_team = f'''<div data-panel="team" id="panel-team" role="tabpanel" aria-labelledby="tab-team" class="rise">
  <div class="container-site section-y-compact">
    {eyebrow_h2("For the team", "Install it in 6 steps, no terminal", "Everything happens inside Claude, in the Plugins page. It takes a couple of minutes and you only do it once.")}
    <ol class="mt-10 grid-auto" style="--card-min:22rem">
      {team_steps}
    </ol>
    {team_check}
  </div>
  <div class="container-site pb-16">
    <h3 class="max-w-[28ch] break-words font-display font-medium text-h3 text-text-primary">Four requests to get started</h3>
    <div class="mt-8 grid gap-6 md:grid-cols-2">{team_prompts}</div>
  </div>
  <div class="container-site pb-24">
    <div class="mt-6 border-b border-border-default">{faq_html}</div>
  </div>
</div>'''

# ------------------------------------------------------------------ dev panel
INSTALL = f'''# 1) add the marketplace
claude plugin marketplace add https://github.com/aidesign-elaniin/elaniin-style

# 2) install (user scope by default)
claude plugin install elaniin@elaniin-style-marketplace

# 3) verify
claude plugin list'''
INSIDE = '''/plugin marketplace add https://github.com/aidesign-elaniin/elaniin-style
/plugin install elaniin@elaniin-style-marketplace
/reload-plugins'''
PROJECT_JSON = '''{
  "extraKnownMarketplaces": {
    "elaniin-style-marketplace": {
      "source": { "source": "git", "url": "https://github.com/aidesign-elaniin/elaniin-style.git" },
      "autoUpdate": true
    }
  },
  "enabledPlugins": {
    "elaniin@elaniin-style-marketplace": true
  }
}'''
UPDATE = '''# update manually
claude plugin update elaniin@elaniin-style-marketplace
# or from a session
/plugin marketplace update elaniin-style-marketplace
/reload-plugins

# uninstall / remove the marketplace
claude plugin uninstall elaniin@elaniin-style-marketplace
claude plugin marketplace remove elaniin-style-marketplace'''
PRIVATE = '''# HTTPS
gh auth login
gh auth setup-git

# or SSH: key in ssh-agent without passphrase and github.com in known_hosts
# force HTTPS if you do not want it to try SSH first:
export CLAUDE_CODE_PLUGIN_PREFER_HTTPS=1'''
VITE = '''npm install tailwindcss @tailwindcss/vite'''
VITE_CFG = '''// vite.config.ts
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({ plugins: [tailwindcss()] })'''
CSS_ENTRY = '''/* src/index.css — @import goes FIRST */
@import "tailwindcss";

/* …and below paste the full contents of tokens.css
   (@theme, :root, @utility, @layer base) */'''
NEXT = '''npm install tailwindcss @tailwindcss/postcss postcss'''
NEXT_CFG = '''// postcss.config.mjs
const config = { plugins: { "@tailwindcss/postcss": {} } };
export default config;'''
HTML_USE = '''<a class="inline-flex h-12 items-center rounded-button bg-elevate-blue px-6
          font-display font-medium text-white hover:bg-blue-600 active:bg-blue-700
          transition-colors duration-base focus-ring">
  Get started
</a>'''
MANAGED = PROJECT_JSON
TS = '''# Error "network source differs from the one declared in settings":
# the marketplace already existed with a different form of address. Remove it and add it again:
claude plugin marketplace remove elaniin-style-marketplace
claude plugin marketplace add https://github.com/aidesign-elaniin/elaniin-style

claude plugin list              # is it installed and enabled?
claude plugin details elaniin
/status                         # which settings apply?'''


MF_MARKUP = """<section class="relative isolate overflow-hidden section-y">
  <div class="module-field" data-module-field aria-hidden="true"></div>
  <div class="container-site relative">…content…</div>
</section>

<!-- on a dark background, fading out to the left -->
<section class="relative isolate overflow-hidden section-y bg-excellence-blue text-white">
  <div class="module-field module-field-dark module-field-mask-left"
       data-module-field aria-hidden="true"></div>
  <div class="container-site relative">…content…</div>
</section>"""
MF_LOAD = """<script src="module-field.js"></script>
<!-- or paste the contents of templates/module-field.js inside a <script> at the end of body -->"""
MF_REACT = """// Next.js / React: copy templates/module-field.tsx to src/components/
import { ModuleField } from "@/components/module-field";

<section className="relative isolate overflow-hidden section-y">
  <ModuleField />                       {/* fade="bottom" tone="light" */}
  <div className="container-site relative">…</div>
</section>

<ModuleField fade="left" tone="dark" /> {/* for excellence-blue bands */}"""


def cell(label, cls=""):
    return f'<div class="min-w-0 rounded-tag bg-surface-subtle p-4 {cls}"><p class="mono-label break-words text-caption text-text-muted">{label}</p></div>'

DEMO_PAGE = '<div class="grid-page">' + "".join(cell(f"col-span-4", "col-span-12 md:col-span-4") for _ in range(3)) + "</div>"
DEMO_AUTO = '<div class="grid-auto" style="--card-min:10rem">' + "".join(cell(f"card {i}") for i in range(1, 7)) + "</div>"
DEMO_HAIR = '<div class="grid-hairline grid-cols-2 md:grid-cols-4">' + "".join(f'<div class="pad-card"><p class="font-display text-h3 font-medium text-text-primary">{v}</p><p class="mono-label text-caption text-text-muted">{l}</p></div>' for v, l in [("120+", "Projects"), ("4.9", "Rating"), ("38%", "Lift"), ("6 wks", "Launch")]) + "</div>"
G_PAGE = """<section class="grid-page">
  <article class="col-span-12 min-w-0 xl:col-span-8">…</article>
  <aside class="col-span-12 min-w-0 xl:col-span-4">…</aside>
</section>"""
G_AUTO = """<ul class="grid-auto" style="--card-min: 14rem">
  <li class="min-w-0 rounded-card border border-border-default bg-surface-card pad-card">…</li>
</ul>"""
G_HAIR = """<div class="grid-hairline grid-cols-2 md:grid-cols-4">
  <div class="pad-card">…</div>
</div>"""
G_AUDIT = r"""grep -n -E '\-mx-|gap-\[|grid-cols-\[' file.html            # must print nothing"""

tokens_rows = "\n".join([
    row("Color", "bg-elevate-blue · bg-excellence-blue · bg-inspire-grey · text-text-primary · text-text-secondary · text-text-muted", "elevate-blue only as a detail (&lt;5% of the area)."),
    row("Typography", "font-display · font-text · font-mono · text-display-xl · text-h1…h4 · text-lead · text-body · text-caption", "Fluid scale; do not use loose sizes."),
    row("Shape and shadow", "rounded-button · rounded-card · rounded-input · shadow-card-rest · shadow-menu · shadow-product", "Radii and shadows come from @theme."),
    row("Layout", "container-site · section-y · section-y-statement · section-y-compact · pad-card", "Responsive gutter and vertical rhythm."),
    row("Motion", "duration-fast · duration-base · duration-slow · duration-reveal · rise · reveal · card-glow · lift · btn-arrow", "Named durations: never duration-200."),
    row("Focus", "focus-ring · focus-ring-on-dark", "Visible double ring on :focus-visible."),
    row("Hover cards", "lift · card-glow + rounded-card border bg-surface-card pad-card", "Always padded: never text touching the edge."),
    row("Grids", "gap-grid · grid-page · grid-auto · grid-hairline", "Section 11. No negative margins."),
    row("Mobile navigation", "drawer · scrim + drawer.js", "A 44px menu button that opens a real drawer."),
    row("Signature texture", "module-field · module-field-dark · module-field-mask-left", "Section 10. Hero and final CTA."),
    row("Breakpoints", "sm 640 · md 768 · lg 1024 · xl 1280", "Tailwind defaults are reset on purpose."),
])

rules = "\n".join(
    f'<li class="flex min-w-0 items-start gap-3"><span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-elevate-blue" aria-hidden="true"></span><span class="min-w-0 break-words text-body text-text-secondary">{t}</span></li>'
    for t in [
        "No hex or loose values: use the token (<code class=\"font-mono text-code text-text-primary\">bg-elevate-blue</code>, not <code class=\"font-mono text-code text-text-primary\">bg-[#1054ff]</code>).",
        "Tailwind's default colors and scales do not exist: <code class=\"font-mono text-code text-text-primary\">bg-red-500</code> does not compile.",
        "No loose class selectors in <code class=\"font-mono text-code text-text-primary\">&lt;style&gt;</code>: every new resource is a <code class=\"font-mono text-code text-text-primary\">@utility</code>.",
        "The deck has no responsive classes: its canvas is always 1280×720. Use <code class=\"font-mono text-code text-text-primary\">grid-cols-3</code>, not <code class=\"font-mono text-code text-text-primary\">md:grid-cols-3</code>.",
        "Keep <code class=\"font-mono text-code text-text-primary\">min-w-0</code> on grid/flex children and <code class=\"font-mono text-code text-text-primary\">overflow-hidden</code> on cards: zero overflow.",
        "Any element with <code class=\"font-mono text-code text-text-primary\">lift</code> or <code class=\"font-mono text-code text-text-primary\">card-glow</code> is a card: it gets <code class=\"font-mono text-code text-text-primary\">rounded-card border bg-surface-card pad-card</code>. Never text touching the hover edge, never negative margins.",
        "Mobile navigation: if a nav is hidden below its breakpoint it needs a 44px menu button that opens a real drawer (<code class=\"font-mono text-code text-text-primary\">drawer</code> + <code class=\"font-mono text-code text-text-primary\">scrim</code> + <code class=\"font-mono text-code text-text-primary\">drawer.js</code>). A hamburger with no action is a bug; test at 375, 768 and 1280 px.",
        "Respect reduced motion: every new animation must switch off with <code class=\"font-mono text-code text-text-primary\">prefers-reduced-motion</code>.",
    ])


mf_rules = "\n".join(
    f'<li class="flex min-w-0 items-start gap-3"><span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-elevate-blue" aria-hidden="true"></span><span class="min-w-0 break-words text-body text-text-secondary">{t}</span></li>'
    for t in [
        "Only in the hero and the final CTA, one per section. Never as card filler or behind long blocks of text.",
        "It is texture, not the star: 45% resting opacity and no glows or gradients on top.",
        "The squares are decorative: <code class=\"font-mono text-code text-text-primary\">aria-hidden=\"true\"</code> and no pointer events of their own.",
        "On touch screens and with <code class=\"font-mono text-code text-text-primary\">prefers-reduced-motion</code> there is no trail: only the static grid remains.",
        "You also need the script if you add the texture to an already generated HTML: without it you only see the resting grid.",
    ])


g_rules = "\n".join(
    f'<li class="flex min-w-0 items-start gap-3"><span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-elevate-blue" aria-hidden="true"></span><span class="min-w-0 break-words text-body text-text-secondary">{x}</span></li>'
    for x in [
        "Mobile first: every child of <code class=\"font-mono text-code text-text-primary\">grid-page</code> gets <code class=\"font-mono text-code text-text-primary\">col-span-12</code> and then scales up with <code class=\"font-mono text-code text-text-primary\">md:</code> or <code class=\"font-mono text-code text-text-primary\">xl:</code>.",
        "<code class=\"font-mono text-code text-text-primary\">min-w-0</code> on every grid or flex child with text, media or tables.",
        "No negative margins (<code class=\"font-mono text-code text-text-primary\">-mx-*</code>) and no arbitrary gaps (<code class=\"font-mono text-code text-text-primary\">gap-[18px]</code>).",
        "Do not use <code class=\"font-mono text-code text-text-primary\">lift</code> or <code class=\"font-mono text-code text-text-primary\">card-glow</code> inside <code class=\"font-mono text-code text-text-primary\">grid-hairline</code>: the clipping hides the shadow. For hover cards use <code class=\"font-mono text-code text-text-primary\">grid-page</code> or <code class=\"font-mono text-code text-text-primary\">grid-auto</code>.",
        "The deck keeps explicit columns (<code class=\"font-mono text-code text-text-primary\">grid-cols-3</code>): its canvas is always 1280 px.",
    ])


ISO_HTML = """<div data-iso-stack data-software="Software" data-ai="AI" data-cloud="Cloud"></div>

<!-- the page needs <symbol id="elaniin-logo-blue"> (landing.html has it), tokens.css and: -->
<script src="iso-stack.js"></script>"""
ISO_REACT = """// copy templates/iso/ to src/components/iso/ (needs lucide-react and logotipo-elaniin-blue.svg in public/assets)
import { HeroStack } from "@/components/iso/hero-stack";

<HeroStack labels={{ software: "Software", ai: "AI", cloud: "Cloud" }} />"""
iso_rules = "\n".join(
    f'<li class="flex min-w-0 items-start gap-3"><span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-elevate-blue" aria-hidden="true"></span><span class="min-w-0 break-words text-body text-text-secondary">{x}</span></li>'
    for x in [
        "Only for structures (a stack, a flow, an architecture): in a hero or a section whose content is complex. Never decoration, never inside cards or lists.",
        "Colors only from tokens, written inline on the SVG with <code class=\"font-mono text-code text-text-primary\">var(--color-*)</code>. Strokes are 1px, glass faces are 78% opaque, no gradients and no box-shadow.",
        "Frosted glass is a <code class=\"font-mono text-code text-text-primary\">backdrop-filter: blur(14px)</code> clipped to each slab&rsquo;s silhouette. Blur exists only inside the resource.",
        "Each entity keeps its defined color. The blue logotipo appears only on the software slab. Labels use generic lucide icons, never third-party brand logos.",
        "Projection, matrices and the 12s clock are JavaScript (not CSS). Only <code class=\"font-mono text-code text-text-primary\">rise</code>, <code class=\"font-mono text-code text-text-primary\">iso-levitate</code> and <code class=\"font-mono text-code text-text-primary\">iso-float</code> are CSS. With reduced motion the scene rests assembled.",
    ])

dev_blocks = "\n".join([
    block(1, "Install with the CLI", p("Requires Claude Code. The plugin lives in the <code class=\"font-mono text-code text-text-primary\">elaniin-style-marketplace</code> marketplace of this repository.") + code(INSTALL) +
          p("<strong>Always use the same address</strong> (the full URL) in the app, the CLI and the settings. If you mix <code class=\"font-mono text-code text-text-primary\">owner/repo</code> with the URL, Claude Code rejects the marketplace with “network source differs”.") +
          p("Inside a Claude Code session the same steps are:") + code(INSIDE, "claude code")),
    block(2, "Choose the scope", p("Add <code class=\"font-mono text-code text-text-primary\">--scope</code> to the <code class=\"font-mono text-code text-text-primary\">install</code> command. Local wins over project, and project wins over user.") +
          '<div class="border-b border-border-default">' + row("user", "~/.claude/settings.json", "Default. For all your projects.") +
          row("project", ".claude/settings.json", "Committed. Each collaborator runs install once.") +
          row("local", ".claude/settings.local.json", "Only you, only this repo.") + "</div>"),
    block(3, "Enable it in a shared repo", p("Commit this in <code class=\"font-mono text-code text-text-primary\">.claude/settings.json</code> so the whole team sees the marketplace. It applies after accepting the folder trust prompt, and each person still runs <code class=\"font-mono text-code text-text-primary\">claude plugin install … --scope project</code> once.") + code(PROJECT_JSON, "json")),
    block(4, "Repository access", p("The repository is <strong>public</strong>: no GitHub account, token or permissions are needed to install or update. If it ever becomes private, Claude Code will use the user's git credentials (<code class=\"font-mono text-code text-text-primary\">gh auth login</code> and <code class=\"font-mono text-code text-text-primary\">gh auth setup-git</code> over HTTPS, or an SSH key in ssh-agent).")),
    block(5, "Update and uninstall", p("The plugin does not define <code class=\"font-mono text-code text-text-primary\">version</code>: every commit in the repo counts as a new version. With <code class=\"font-mono text-code text-text-primary\">autoUpdate</code> on it downloads by itself a few minutes after opening a session; the running session keeps the loaded version until <code class=\"font-mono text-code text-text-primary\">/reload-plugins</code> or a restart.") + code(UPDATE)),
    block(6, "Use the skill", p("Claude loads it on its own when the request fits. You can also invoke it by its namespaced name:") +
          code("/elaniin:elaniin-style", "claude code") +
          p("Four modes: <strong>deck</strong>, <strong>dashboard</strong>, <strong>website</strong> and <strong>site-dev</strong> (the Elaniin 2027 site in Next.js). Ask in Spanish or English; the skill answers in your language. The script that installs <code class=\"font-mono text-code text-text-primary\">motion</code> runs silently only if the project has a <code class=\"font-mono text-code text-text-primary\">package.json</code>.")),
    block(7, "Edit a generated deck or page", p("Deliverables are <strong>a single self-contained HTML file</strong>: they carry Tailwind v4 (<code class=\"font-mono text-code text-text-primary\">@tailwindcss/browser</code> pinned to 4.3.3) and the token block embedded. They do not depend on the plugin staying installed and do not update on their own: they belong to the project. Edit them with Tailwind classes like any HTML.") +
          '<div class="border-b border-border-default">' + tokens_rows + "</div>" +
          '<h4 class="pt-4 font-display font-medium text-h4 text-text-primary">Rules when editing</h4><ul class="space-y-3">' + rules + "</ul>" +
          '<h4 class="pt-4 font-display font-medium text-h4 text-text-primary">Example</h4>' + code(HTML_USE, "html") +
          p("The browser script needs internet to compile. To move the piece into a real project, switch to the build plugin and paste <code class=\"font-mono text-code text-text-primary\">tokens.css</code> (it lives in <code class=\"font-mono text-code text-text-primary\">skills/elaniin-style/templates/</code>) into your entry CSS.") +
          '<h4 id="dev-9-build" class="pt-4 font-display font-medium text-h4 text-text-primary">Vite</h4>' + code(VITE) + code(VITE_CFG, "ts") + code(CSS_ENTRY, "css") +
          '<h4 class="pt-4 font-display font-medium text-h4 text-text-primary">Next.js</h4>' + code(NEXT) + code(NEXT_CFG, "js") +
          p("Full class → token → value inventory: <code class=\"font-mono text-code text-text-primary\">references/tailwind-api.md</code> inside the plugin.")),
    block(8, "Interactive texture: module field", p("It is the signature texture of the Elaniin site: a grid of 2 px squares every 16 px (grey at 45%) that, as the mouse moves, lights up cell by cell climbing the <strong>blue-300 → blue-400 → blue-500</strong> ramp and fades out in ~260 ms. It goes in the background of the hero and the final CTA. It is the same one as on the <code class=\"font-mono text-code text-text-primary\">elaniin-2027-website-main</code> site, ported as a skill resource.") +
          '<div class="border-b border-border-default">' +
          row("module-field", "Resting grid, CSS only. First child of the host.", "Required base.") +
          row("module-field-dark", "Faint white squares for dark bands.", "On excellence-blue.") +
          row("module-field-mask-left / -none", "Fades to the left, or no fade.", "By default it fades downward.") +
          row("--module-size · --module-pitch", "2px · 16px on :root. The trail reads them from CSS.", "Change them only in tokens.") +
          "</div>" +
          p("HTML (the host must have <code class=\"font-mono text-code text-text-primary\">relative isolate overflow-hidden</code> and the content <code class=\"font-mono text-code text-text-primary\">relative</code>):") + code(MF_MARKUP, "html") +
          p("The mouse trail is a ~90-line script with no dependencies. The templates already include it inline; in other projects:") + code(MF_LOAD, "html") +
          '<h4 class="pt-4 font-display font-medium text-h4 text-text-primary">React / Next.js</h4>' + code(MF_REACT, "tsx") +
          '<h4 class="pt-4 font-display font-medium text-h4 text-text-primary">Rules</h4><ul class="space-y-3">' + mf_rules + "</ul>"),
    block(9, "Organization-wide rollout", p("To make auto-update mandatory so nobody can switch it off, put it in <em>managed settings</em> (Organization settings → Claude Code → Managed settings, MDM or <code class=\"font-mono text-code text-text-primary\">managed-settings.json</code>). With <code class=\"font-mono text-code text-text-primary\">autoUpdate</code> defined there, the <code class=\"font-mono text-code text-text-primary\">/plugin</code> toggle is locked.") + code(MANAGED, "json") +
          p("If you use <code class=\"font-mono text-code text-text-primary\">DISABLE_AUTOUPDATER=1</code>, add <code class=\"font-mono text-code text-text-primary\">FORCE_AUTOUPDATE_PLUGINS=1</code> to keep plugin updates running.")),
    block(10, "Troubleshooting", code(TS) +
          p("Clone fails? Check your git credentials (block 04). Command missing? Run <code class=\"font-mono text-code text-text-primary\">/reload-plugins</code> or open a new session. Still on the old version? <code class=\"font-mono text-code text-text-primary\">claude plugin update</code> and reload.")),
    block(11, "Grids", p("Tailwind already ships <code class=\"font-mono text-code text-text-primary\">grid-cols-*</code> and <code class=\"font-mono text-code text-text-primary\">col-span-*</code>. The plugin adds four utilities that connect them to the Elaniin tokens: always use them instead of building grids with loose values.") +
          '<div class="border-b border-border-default">' +
          row("gap-grid", "Token gap: 24px, 16px on mobile.", "For any grid or flex.") +
          row("grid-page", "12 columns. Children with col-span-12 md:col-span-N.", "Fixed count: KPIs, features, aside.") +
          row("grid-auto", "auto-fit with --card-min (16rem).", "Unknown count: cards, logos.") +
          row("grid-hairline", "cells with 1px lines, no negative margins.", "Stats and comparisons. With grid-cols-N and pad-card.") +
          "</div>" +
          '<h4 class="pt-4 font-display font-medium text-h4 text-text-primary">grid-page</h4>' + DEMO_PAGE + code(G_PAGE, "html") +
          '<h4 class="pt-4 font-display font-medium text-h4 text-text-primary">grid-auto</h4>' + DEMO_AUTO + code(G_AUTO, "html") +
          '<h4 class="pt-4 font-display font-medium text-h4 text-text-primary">grid-hairline</h4>' + DEMO_HAIR + code(G_HAIR, "html") +
          '<h4 class="pt-4 font-display font-medium text-h4 text-text-primary">Rules</h4><ul class="space-y-3">' + g_rules + "</ul>" +
          code(G_AUDIT) +
          p("Full recipes (bento, aside, container queries) in <code class=\"font-mono text-code text-text-primary\">references/grids.md</code> inside the plugin.")),
    block(13, "Isometric resource", p("The approved way to explain how pieces fit: three frosted-glass slabs on a base plate, a riser that feeds each slab through its own arm, a pulse of light that travels the structure, and the slab that receives it sliding forward. It is the hero of this very page: <strong>Marketplace → Plugin → Claude</strong>.") +
          '<div class="border-b border-border-default">' +
          row("iso-levitate", "The whole piece floats 6px, 3s.", "Utility in tokens.css.") +
          row("iso-float", "A label floats 4px, 2s, staggered with --d.", "Utility in tokens.css.") +
          row("iso-stack.js", "Vanilla build for self-contained HTML. Exposes window.ElaniinIso (project, slabSvg, floorSvg, mountStack…).", "templates/iso-stack.js") +
          row("iso/", "React / Next build: HeroStack, Slab, Floor, iso.ts, use-clock.ts.", "templates/iso/") +
          "</div>" +
          '<h4 class="pt-4 font-display font-medium text-h4 text-text-primary">HTML</h4>' + code(ISO_HTML, "html") +
          '<h4 class="pt-4 font-display font-medium text-h4 text-text-primary">React / Next.js</h4>' + code(ISO_REACT, "tsx") +
          '<h4 class="pt-4 font-display font-medium text-h4 text-text-primary">Rules</h4><ul class="space-y-3">' + iso_rules + "</ul>" +
          p("Exact geometry, the 15 rules, the timeline and the recipe for a new resource are in <code class=\"font-mono text-code text-text-primary\">references/isometric.md</code> inside the plugin.")),
    block(12, "What the repository ships", code('''.claude-plugin/        marketplace.json + plugin.json
docs/                  this landing and the sample templates
scripts/build-docs.py  regenerates docs/ (landing + template copies)
scripts/make-og.py     regenerates docs/og.png (share image)
skills/elaniin-style/
├── SKILL.md           5-phase pipeline and rules
├── assets/            official logos and favicon
├── references/        tokens, tailwind-api, grids, motion, ux-a11y, websites, decks, dashboards
├── scripts/           ensure-motion.sh
└── templates/         tokens.css, landing.html, dashboard.html, deck.html,
                       module-field.js / .tsx, drawer.js,
                       iso-stack.js + iso/ (isometric resource)''', "tree")),
])


example_cards = "\n".join(
    f'''<a href="{href}" target="_blank" rel="noopener" class="card-glow lift btn-arrow group flex min-w-0 flex-col rounded-card border border-border-default bg-surface-card pad-card focus-ring">
  <h3 class="font-display font-medium text-h3 text-text-primary">{title}</h3>
  <p class="mt-2 max-w-[40ch] break-words text-body text-text-secondary">{desc}</p>
  <span class="mt-6 inline-flex items-center gap-2 font-display text-body font-medium text-elevate-blue">Open example {ARROW}</span>
</a>'''
    for lab, title, desc, href in [
        ("Landing", "Product landing", "Hero with module field, features, looping pipeline, stats and mobile menu.", "templates/landing.html"),
        ("Dashboard", "Metrics dashboard", "Six working views plus legal pages: revenue range, customers search and sort, products, reports you can create and download, persistent settings.", "templates/dashboard.html"),
        ("Deck", "16:9 presentation deck", "Fixed 1280×720 canvas with keyboard navigation and living slides.", "templates/deck.html"),
    ])

GROUPS = [
    ("Install", [1, 2, 3, 4, 5, 9, 10]),
    ("Use & edit", [6, 7]),
    ("Resources", [8, 11, 13, 12]),
]
ORDER = [k for _, ks in GROUPS for k in ks]
NUM = {k: n for n, k in enumerate(ORDER, 1)}
SHORT = {1: "Install with the CLI", 2: "Scopes", 3: "Shared repo", 4: "Access", 5: "Update", 9: "Organization", 10: "Troubleshooting",
         6: "Use the skill", 7: "Edit pieces", 8: "Module field", 11: "Grids", 12: "Repository", 13: "Isometric resource"}


def accordion(k):
    title, body = BLOCKS[k]
    n = NUM[k]
    opened = " open" if k == 1 else ""
    return f'''<details id="dev-{n}" data-dev-section class="group scroll-mt-28 border-t border-border-default lg:scroll-mt-17"{opened}>
  <summary class="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-4 focus-ring">
    <h3 class="min-w-0 break-words font-display font-medium text-h3 text-text-primary"><span class="mr-3 font-mono text-code text-elevate-blue">{n:02d}</span>{title}</h3>
    <span class="mono-label shrink-0 text-caption text-elevate-blue transition-transform duration-base group-open:rotate-45" aria-hidden="true">+</span>
  </summary>
  <div class="min-w-0 space-y-5 pb-10 pt-2">{body}</div>
</details>'''


def toc_list(extra=""):
    out = ""
    for gname, ks in GROUPS:
        out += f'<p class="mono-label px-3 pb-1 pt-4 text-caption text-text-muted">{gname}</p>'
        for k in ks:
            out += f'<a href="#dev-{NUM[k]}" data-toc-link="dev-{NUM[k]}" class="toc-link focus-ring"><span class="mr-2 font-mono text-code text-text-muted">{NUM[k]:02d}</span>{SHORT[k]}</a>'
    return out


accordions = "\n".join(accordion(k) for k in ORDER)

QUICK = """claude plugin marketplace add https://github.com/aidesign-elaniin/elaniin-style
claude plugin install elaniin@elaniin-style-marketplace"""

TASKS = [
    ("Install", "Two commands and you are done.", "dev-1"),
    ("Share with my team", "Commit it in settings.json.", "dev-3"),
    ("Edit a piece", "Change a deck or page with the tokens.", "dev-9"),
    ("Move it to Next", "Vite or PostCSS in a real project.", "dev-9-build"),
    ("Fix an error", "Find the fix by symptom.", "dev-7"),
    ("Org rollout", "Managed settings and auto-update.", "dev-6"),
]
task_cards = "\n".join(
    f'''<a href="#{target}" data-jump class="card-glow lift btn-arrow flex min-w-0 flex-col rounded-card border border-border-default bg-surface-card p-6 focus-ring">
  <h3 class="font-display font-medium text-h4 text-text-primary">{name}</h3>
  <p class="mt-1 text-body-sm text-text-secondary">{desc}</p>
  <span class="mt-4 inline-flex items-center gap-2 font-display text-body-sm font-medium text-elevate-blue">Go to section {ARROW}</span>
</a>'''
    for name, desc, target in TASKS)

panel_devs = f'''<div data-panel="devs" id="panel-devs" role="tabpanel" aria-labelledby="tab-devs" class="rise">
  <div class="container-site section-y-compact">
    {eyebrow_h2("For developers", "Install, use and edit pieces", "Claude Code, scopes, shared repos, auto-update and how to hand-edit a deck or a page with the Tailwind API.")}
    <div class="mt-10 max-w-[860px]">
      <h3 class="font-display font-medium text-h4 text-text-primary">Install in 30 seconds</h3>
      <div class="mt-3">{code(QUICK)}</div>
    </div>
    <h3 class="mt-12 font-display font-medium text-h3 text-text-primary">What do you want to do?</h3>
    <div class="grid-auto mt-6" style="--card-min:15rem">{task_cards}</div>
  </div>

  <div class="container-site pb-24">
    <details data-toc-mobile class="sticky top-16 z-20 border-y border-border-default bg-white/95 backdrop-blur lg:hidden">
      <summary class="flex min-h-12 cursor-pointer items-center justify-between gap-3 text-body-sm font-medium text-text-primary focus-ring">
        <span class="min-w-0 truncate">On this page <span class="text-text-muted" data-toc-now></span></span>
        <span class="mono-label shrink-0 text-caption text-elevate-blue" aria-hidden="true">+</span>
      </summary>
      <nav aria-label="On this page" class="max-h-[60dvh] overflow-y-auto pb-3">{toc_list()}</nav>
    </details>
    <div class="grid-page mt-6 lg:mt-10">
      <aside class="col-span-3 hidden min-w-0 lg:block">
        <nav aria-label="On this page" class="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto">{toc_list()}</nav>
      </aside>
      <div class="col-span-12 min-w-0 lg:col-span-9">
        <div class="flex justify-end pb-2">
          <button type="button" data-expand-all data-state="closed" class="inline-flex min-h-11 items-center rounded-button px-3 text-body-sm font-medium text-elevate-blue transition-colors duration-base hover:bg-surface-subtle focus-ring">Expand all</button>
        </div>
        {accordions}
      </div>
    </div>
  </div>
</div>'''

# ------------------------------------------------------------------ page
body = f'''
<div class="spotlight" aria-hidden="true"></div>
<div class="relative z-10">
<a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-3 focus:left-3 focus:bg-white focus:px-4 focus:py-2 focus:rounded-button focus:border focus:border-border-default focus:shadow-menu">Skip to content</a>

<header class="sticky top-0 z-40 border-b border-border-default bg-white/90 backdrop-blur">
  <div class="container-site flex h-16 items-center justify-between">
    <a href="#" class="flex items-center focus-ring" aria-label="Elaniin Style, home">
      <svg class="h-7 w-auto" role="img" aria-label="Elaniin" viewBox="0 0 281.45 75.91"><use href="#elaniin-logo"/></svg>
    </a>
    <nav class="hidden items-center gap-8 text-body-sm text-text-secondary md:flex" aria-label="Primary">
      <a href="#install" class="nav-link transition-colors duration-base hover:text-text-primary focus-ring">Install</a>
      <a href="#how" class="nav-link transition-colors duration-base hover:text-text-primary focus-ring">How it works</a>
      <a href="#examples" class="nav-link transition-colors duration-base hover:text-text-primary focus-ring">Examples</a>
      <a href="#sites" class="nav-link transition-colors duration-base hover:text-text-primary focus-ring">Complete sites</a>
      <a href="{REPO}" class="ml-2 inline-flex h-11 items-center gap-2 rounded-button border border-border-ink px-4 font-display text-body-sm font-medium text-text-primary transition-colors duration-base hover:bg-surface-subtle focus-ring">{GITHUB}GitHub</a>
    </nav>
    <div class="flex items-center gap-2 md:hidden">
      <a href="{REPO}" class="inline-flex h-11 w-11 items-center justify-center rounded-button border border-border-ink text-text-primary transition-colors duration-base hover:bg-surface-subtle focus-ring" aria-label="GitHub">{GITHUB}</a>
      <a href="#install" class="inline-flex h-11 items-center rounded-button bg-elevate-blue px-4 font-display text-body-sm font-medium text-white transition-colors duration-base hover:bg-blue-600 active:bg-blue-700 focus-ring">Install</a>
    </div>
  </div>
</header>

<main id="main">
  <section class="relative isolate overflow-hidden section-y" style="--section-y:104px">
    <div class="module-field" data-module-field aria-hidden="true"></div>
    <div class="container-site relative grid-page items-center">
      <div class="col-span-12 flex min-w-0 flex-col items-center text-center lg:col-span-6 lg:items-start lg:text-left">
        <h1 class="max-w-[12ch] break-words text-balance font-display font-medium text-display-xl text-text-primary rise" style="--i:1">The Elaniin style, inside Claude</h1>
        <p class="mt-6 max-w-[56ch] text-lead text-text-secondary rise max-lg:max-w-[40ch] max-lg:text-balance" style="--i:2">Ask for a deck, a dashboard or a landing and Claude builds it with the Elaniin 2027 design system. Install it once and it updates itself.</p>
        <div class="mt-10 flex flex-wrap items-center justify-center gap-4 rise max-md:w-full max-md:flex-col lg:justify-start" style="--i:3">
          <a href="#install" class="btn-arrow inline-flex h-12 items-center gap-2 rounded-button bg-elevate-blue px-6 font-display text-body font-medium text-white transition-colors duration-base hover:bg-blue-600 active:bg-blue-700 focus-ring">Install now {ARROW}</a>
        <a href="#how" class="btn-arrow inline-flex h-12 items-center gap-2 rounded-button px-2 font-display text-body font-medium text-elevate-blue transition-colors duration-base hover:text-text-link-hover focus-ring">How it works {ARROW}</a>
        </div>
      </div>
      <div class="col-span-12 mx-auto w-full min-w-0 max-w-[560px] lg:col-span-6 lg:mx-0 lg:max-w-none">
        <div data-iso-stack data-software="Plugin" data-ai="Claude" data-cloud="Marketplace"></div>
      </div>
    </div>
  </section>

  <section id="how" class="section-y-compact border-y border-border-default bg-surface-subtle">
    <div class="container-site">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div class="min-w-0">
          <h2 class="font-display font-medium text-h3 text-text-primary">One install, always up to date</h2>
        </div>
        <p class="mono-label text-caption text-elevate-blue" data-pipeline-status aria-live="off">Done ✓</p>
      </div>
      <ol class="pipeline mt-8" data-pipeline>
        <li data-state="done">Install</li>
        <li data-state="done">Activate</li>
        <li data-state="done">Create</li>
        <li data-state="done">Update</li>
      </ol>
    </div>
  </section>

  <section id="install" class="section-y-compact">
    <div class="container-site text-center">
      <h2 class="mx-auto max-w-[20ch] break-words font-display font-medium text-h2 text-text-primary">Who is installing it?</h2>
      <div role="tablist" aria-label="User type" class="mt-8 inline-flex rounded-button border border-border-ink p-1">
        <button type="button" role="tab" id="tab-team" data-tab="team" aria-controls="panel-team" aria-selected="true" class="inline-flex h-11 min-w-36 items-center justify-center rounded-button px-5 font-display text-body font-medium text-text-primary transition-colors duration-base hover:bg-surface-subtle aria-selected:bg-excellence-blue aria-selected:text-white aria-selected:hover:bg-excellence-blue focus-ring">I'm not a dev</button>
        <button type="button" role="tab" id="tab-devs" data-tab="devs" aria-controls="panel-devs" aria-selected="false" tabindex="-1" class="inline-flex h-11 min-w-36 items-center justify-center rounded-button px-5 font-display text-body font-medium text-text-primary transition-colors duration-base hover:bg-surface-subtle aria-selected:bg-excellence-blue aria-selected:text-white aria-selected:hover:bg-excellence-blue focus-ring">I'm a dev</button>
      </div>
      <p class="mx-auto mt-4 max-w-[56ch] text-body-sm text-text-muted">Not a dev: install from the Claude app, no terminal. Dev: CLI, scopes, auto-update and editing pieces.</p>
    </div>
  </section>

  <section class="border-t border-border-default" aria-label="Installation guide">
{panel_team}
{panel_devs}
  </section>

  <section id="examples" class="section-y-compact border-t border-border-default">
    <div class="container-site">
      {eyebrow_h2("Examples", "See it working", "Three sample pieces made with the skill. Open them, resize the window and move the mouse.")}
      <div class="grid-auto mt-10" style="--card-min:18rem">
        {example_cards}
      </div>
    </div>
  </section>


  <section id="sites" class="section-y-compact border-t border-border-default bg-surface-subtle">
    <div class="container-site">
      <div class="grid-page items-stretch">
        <div class="col-span-12 min-w-0 lg:col-span-5">
          <h2 class="max-w-[16ch] break-words font-display font-medium text-h2 text-text-primary">A whole site, one stage at a time</h2>
          <p class="mt-4 max-w-[44ch] break-words text-body text-text-secondary">Give the plugin a sitemap, a diagram or a .md file. It builds the master project with every page and the architecture, using placeholder text. That is the starting point: each page then gets its own iteration, with its real content, one at a time.</p>
          <ol class="mt-8 space-y-2" data-sites-steps>
            <li data-on="false" class="group flex gap-4 rounded-card border border-transparent p-3 transition-colors duration-base data-[on=true]:border-border-default data-[on=true]:bg-white">
              <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-button border border-border-default bg-white text-text-secondary transition-colors duration-base group-data-[on=true]:border-elevate-blue group-data-[on=true]:text-elevate-blue"><svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/></svg></span>
              <div class="min-w-0"><h3 class="font-display font-medium text-h4 text-text-primary">You bring the map</h3><p class="mt-1 text-body-sm text-text-secondary">A sitemap as an image, a Mermaid diagram, an outline or a .md. You do not need the content of every page.</p></div>
            </li>
            <li data-on="false" class="group flex gap-4 rounded-card border border-transparent p-3 transition-colors duration-base data-[on=true]:border-border-default data-[on=true]:bg-white">
              <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-button border border-border-default bg-white text-text-secondary transition-colors duration-base group-data-[on=true]:border-elevate-blue group-data-[on=true]:text-elevate-blue"><svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg></span>
              <div class="min-w-0"><h3 class="font-display font-medium text-h4 text-text-primary">You approve the site map</h3><p class="mt-1 text-body-sm text-text-secondary">First a table with each page, its route, its type and whether its text is real or placeholder. Nothing is generated until you say OK.</p></div>
            </li>
            <li data-on="false" class="group flex gap-4 rounded-card border border-transparent p-3 transition-colors duration-base data-[on=true]:border-border-default data-[on=true]:bg-white">
              <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-button border border-border-default bg-white text-text-secondary transition-colors duration-base group-data-[on=true]:border-elevate-blue group-data-[on=true]:text-elevate-blue"><svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg></span>
              <div class="min-w-0"><h3 class="font-display font-medium text-h4 text-text-primary">The master project appears</h3><p class="mt-1 text-body-sm text-text-secondary">Next.js static with Tailwind and the design system. Every route works, repeated pages share one template, and placeholder text is marked on screen.</p></div>
            </li>
            <li data-on="false" class="group flex gap-4 rounded-card border border-transparent p-3 transition-colors duration-base data-[on=true]:border-border-default data-[on=true]:bg-white">
              <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-button border border-border-default bg-white text-text-secondary transition-colors duration-base group-data-[on=true]:border-elevate-blue group-data-[on=true]:text-elevate-blue"><svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg></span>
              <div class="min-w-0"><h3 class="font-display font-medium text-h4 text-text-primary">Then you iterate page by page</h3><p class="mt-1 text-body-sm text-text-secondary">When a page's real content arrives, that page is designed on its own, without touching the rest. A quality check runs before every delivery.</p></div>
            </li>
          </ol>
        </div>
        <div class="col-span-12 flex min-w-0 lg:col-span-7">
          <div class="flex w-full flex-col overflow-hidden rounded-card border border-border-default bg-white">
            <div class="relative isolate flex flex-1 items-center overflow-hidden border-b border-border-default bg-white">
              <div class="module-field" data-module-field aria-hidden="true"></div>
              <div class="relative mx-auto w-full max-w-[560px] px-4 py-4" data-sites-iso></div>
            </div>
            <div class="p-6 md:p-8">
              <h3 class="font-display font-medium text-h3 text-text-primary">Nova Logística: a demo master project</h3>
              <ul class="mt-4 flex flex-wrap gap-x-6 gap-y-2"><li class="flex items-center gap-2 text-body-sm text-text-secondary"><span class="text-elevate-blue"><svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 7h-3a2 2 0 0 1-2-2V2"/><path d="M21 6v6.5c0 .8-.7 1.5-1.5 1.5h-7c-.8 0-1.5-.7-1.5-1.5v-9c0-.8.7-1.5 1.5-1.5H17Z"/><path d="M7 8v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H15"/><path d="M3 12v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H11"/></svg></span><span><strong class="font-medium text-text-primary">30</strong> pages</span></li><li class="flex items-center gap-2 text-body-sm text-text-secondary"><span class="text-elevate-blue"><svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg></span><span><strong class="font-medium text-text-primary">4</strong> collections</span></li><li class="flex items-center gap-2 text-body-sm text-text-secondary"><span class="text-elevate-blue"><svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/></svg></span><span><strong class="font-medium text-text-primary">1</strong> site map file</span></li></ul>
              <p class="mt-4 max-w-[56ch] text-body-sm text-text-secondary">Only the home page and one service have real text; everything else is placeholder and says so. It is the first stage, not a finished site: each page is meant to be iterated on from here.</p>
              <a href="ejemplos/nova-logistica/" target="_blank" rel="noopener" class="btn-arrow mt-6 inline-flex h-12 items-center gap-2 rounded-button bg-elevate-blue px-6 font-display text-body font-medium text-white transition-colors duration-base hover:bg-blue-600 active:bg-blue-700 focus-ring">Open the live demo {ARROW}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="relative isolate overflow-hidden section-y bg-excellence-blue text-white">
    <div class="module-field module-field-dark module-field-mask-left" data-module-field aria-hidden="true"></div>
    <div class="container-site relative text-center">
      <h2 class="mx-auto max-w-[20ch] break-words font-display font-medium text-h2 text-white">Something not working?</h2>
      <p class="mx-auto mt-5 max-w-[56ch] text-lead text-text-on-dark-secondary">Open an issue on the repository with the step where you got stuck and the message you saw.</p>
      <a href="{REPO}/issues" target="_blank" rel="noopener" class="btn-arrow mt-10 inline-flex h-12 items-center gap-2 rounded-button bg-elevate-blue px-8 font-display text-body font-medium text-white transition-colors duration-base hover:bg-blue-600 active:bg-blue-700 focus-ring-on-dark">Open an issue {ARROW}</a>
    </div>
  </section>
</main>

<footer class="bg-elaniin-black text-white">
  <div class="container-site py-12">
    <div class="flex flex-wrap items-center justify-between gap-6 border-b border-border-on-dark pb-8">
      <svg class="h-7 w-auto" role="img" aria-label="Elaniin" viewBox="0 0 281.45 75.91"><use href="#elaniin-logo-white"/></svg>
      <a href="{REPO}" class="nav-link inline-flex min-h-11 items-center text-body-sm text-text-on-dark-secondary transition-colors duration-base hover:text-white focus-ring-on-dark">Repository on GitHub</a>
    </div>
    <p class="mono-label mt-8 text-caption text-text-on-dark-muted">© 2026 Elaniin · Elaniin Style</p>
  </div>
</footer>
</div>
'''

script = r'''
<script>
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* switch: Not a dev / Dev (hash-synced, arrow keys) */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-tab]'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-panel]'));
  function select(name, focus, push) {
    tabs.forEach(function (t) {
      var on = t.dataset.tab === name;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    panels.forEach(function (p) { p.hidden = p.dataset.panel !== name; });
    if (push) { try { history.replaceState(null, '', '#' + name); } catch (e) {} }
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t.dataset.tab, false, true); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowRight' || k === 'ArrowDown') n = tabs[(i + 1) % tabs.length];
      else if (k === 'ArrowLeft' || k === 'ArrowUp') n = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (k === 'Home') n = tabs[0];
      else if (k === 'End') n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); select(n.dataset.tab, true, true); }
    });
  });
  var DEV_HASH = /^dev-\d+(-build)?$/;
  var h = (location.hash || '').replace('#', '');
  select(h === 'devs' || DEV_HASH.test(h) ? 'devs' : 'team', false, false);
  addEventListener('hashchange', function () {
    var x = location.hash.replace('#', '');
    if (x === 'devs' || x === 'team') select(x, false, false);
  });

  /* developer panel: deep links open their accordion, scroll-spy table of contents, expand all */
  var DEV_ID = /^dev-\d+(-build)?$/;
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('[data-toc-link]'));
  var devSections = Array.prototype.slice.call(document.querySelectorAll('[data-dev-section]'));
  var mobileToc = document.querySelector('[data-toc-mobile]');
  function openTarget(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var d = el.closest('details');
    if (d) d.open = true;
    el.scrollIntoView({ behavior: 'auto' });
  }
  function goTo(id) {
    select('devs', false, false);
    try { history.replaceState(null, '', '#' + id); } catch (e) {}
    openTarget(id);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#dev-"]');
    if (!a) return;
    e.preventDefault();
    if (mobileToc) mobileToc.open = false;
    goTo(a.getAttribute('href').slice(1));
  });
  if (DEV_ID.test(h)) goTo(h);
  addEventListener('hashchange', function () {
    var x = location.hash.replace('#', '');
    if (DEV_ID.test(x)) goTo(x);
  });
  addEventListener('load', function () { var x = location.hash.replace('#', ''); if (DEV_ID.test(x)) openTarget(x); });
  if (devSections.length) {
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        tocLinks.forEach(function (a) {
          if (a.dataset.tocLink === en.target.id) {
            a.setAttribute('aria-current', 'true');
            var now = document.querySelector('[data-toc-now]');
            if (now) now.textContent = '· ' + a.lastChild.textContent.trim();
          } else { a.removeAttribute('aria-current'); }
        });
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    devSections.forEach(function (s) { spy.observe(s); });
  }
  var expandBtn = document.querySelector('[data-expand-all]');
  if (expandBtn) expandBtn.addEventListener('click', function () {
    var openAll = expandBtn.dataset.state !== 'open';
    devSections.forEach(function (s) { s.open = openAll; });
    expandBtn.dataset.state = openAll ? 'open' : 'closed';
    expandBtn.textContent = openAll ? 'Collapse all' : 'Expand all';
  });

  /* copy buttons */
  function copy(text, ok, fail) {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fail);
    else fail();
  }
  function flashText(node, label) {
    var old = node.nodeValue;
    node.nodeValue = label;
    setTimeout(function () { node.nodeValue = old; }, 1600);
  }
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var pre = b.closest('.rounded-code').querySelector('pre');
      copy(pre.innerText, function () { flashText(b.firstChild, 'Copied'); }, function () { flashText(b.firstChild, 'Select and copy'); });
    });
  });
  document.querySelectorAll('[data-copy-text]').forEach(function (b) {
    b.addEventListener('click', function () {
      copy(b.dataset.copyText, function () { flashText(b.firstChild, 'Copied '); }, function () { flashText(b.firstChild, 'Select and copy '); });
    });
  });

  /* living loop: install pipeline, paused off-screen */
  var pipeline = document.querySelector('[data-pipeline]');
  var statusEl = document.querySelector('[data-pipeline-status]');
  if (pipeline) {
    var steps = Array.prototype.slice.call(pipeline.children);
    var names = ['Installing…', 'Activating…', 'Creating…', 'Updating…', 'Done ✓'];
    if (reduce) {
      steps.forEach(function (li) { li.setAttribute('data-state', 'done'); });
      if (statusEl) statusEl.textContent = names[4];
    } else {
      var PERIOD = 7000, STEP = 1400, last = -1, raf = null, t0 = 0;
      var setPhase = function (ph) {
        if (ph === last) return;
        last = ph;
        for (var i = 0; i < steps.length; i++) steps[i].setAttribute('data-state', i < ph ? 'done' : i === ph ? 'active' : 'idle');
        if (statusEl) statusEl.textContent = names[Math.min(ph, 4)];
      };
      new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (en.isIntersecting && raf === null) {
            t0 = performance.now(); last = -1;
            raf = requestAnimationFrame(function loop(now) {
              setPhase(Math.min(Math.floor(((now - t0) % PERIOD) / STEP), 4));
              raf = requestAnimationFrame(loop);
            });
          } else if (!en.isIntersecting && raf !== null) { cancelAnimationFrame(raf); raf = null; }
        });
      }, { threshold: 0.3 }).observe(pipeline);
    }
  }

  /* step mockups: a tiny state machine (1 step per second). It runs only while the card is on
     screen and, with reduced motion, renders the final state once and never starts. */
  var MOCK_STEP_MS = 1000;
  document.querySelectorAll('[data-mock]').forEach(function (stage) {
    var path = (stage.dataset.path || '').split('|').map(function (p) { return p.split(','); });
    var last = path.length - 1, step = 0, timer = null;
    var cursor = stage.querySelector('.mock-cursor');
    var els = Array.prototype.slice.call(stage.querySelectorAll('[data-on]'));

    function typeInto(el, on) {
      var full = el.dataset.type;
      if (!full) return;
      if (reduce) { el.textContent = full; return; }
      if (on && !el._typing) {
        el._typing = true; el.classList.add('is-typing'); var i = 0;
        el._t = setInterval(function () {
          i++; el.textContent = full.slice(0, i);
          if (i >= full.length) { clearInterval(el._t); }
        }, 32);
      } else if (!on) {
        clearInterval(el._t); el._typing = false; el.classList.remove('is-typing'); el.textContent = '';
      }
    }
    function render() {
      els.forEach(function (el) {
        var on = step >= +el.dataset.on && (el.dataset.off === undefined || step < +el.dataset.off);
        el.classList.toggle('is-on', on);
        typeInto(el, on);
      });
      if (cursor) { var p = path[Math.min(step, last)]; cursor.style.left = p[0]; cursor.style.top = p[1]; }
    }
    function start() { if (timer === null) timer = setInterval(function () { step = (step + 1) % (last + 3); render(); }, MOCK_STEP_MS); }
    function stop() { if (timer !== null) { clearInterval(timer); timer = null; } }

    if (reduce) { step = last; render(); return; }
    render();
    new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) start(); else stop(); });
    }, { threshold: 0.3 }).observe(stage);
  });

  /* mouse-reactive spotlight + card glow */
  if (!reduce) {
    addEventListener('mousemove', function (e) {
      document.documentElement.style.setProperty('--mx', e.clientX + 'px');
      document.documentElement.style.setProperty('--my', e.clientY + 'px');
    }, { passive: true });
    document.addEventListener('pointermove', function (e) {
      var c = e.target.closest && e.target.closest('.card-glow');
      if (!c) return;
      var r = c.getBoundingClientRect();
      c.style.setProperty('--cx', (e.clientX - r.left) + 'px');
      c.style.setProperty('--cy', (e.clientY - r.top) + 'px');
    });
  }
})();
</script>
<script>
''' + MF_JS + '''</script>
<script>
''' + ISO_JS + '''</script>
<script>
''' + SITES_JS + '''</script>
</body>
</html>
'''

out = ROOT / "docs"
out.mkdir(exist_ok=True)
(out / "index.html").write_text(head + "\n" + body + script)
import shutil
# guard: the logotipo variants share one class name, so a <style> inside a <symbol> turns a logo blank
assert not re.search(r"<symbol[^>]*>(?:(?!</symbol>).)*<style", head, re.S), "logo <symbol> must not carry <style>"
(out / "templates").mkdir(exist_ok=True)
for name in ("deck", "landing", "dashboard"):
    shutil.copy(ROOT / f"skills/elaniin-style/templates/{name}.html", out / "templates" / f"{name}.html")
print("ok", (out / "index.html").stat().st_size)
