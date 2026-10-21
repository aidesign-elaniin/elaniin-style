import html, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent  # repo root
src = (ROOT / "skills/elaniin-style/templates/landing.html").read_text().split("\n")
b_i = src.index("<body>")
e_i = next(i for i in range(b_i, len(src)) if src[i].strip() == "</svg>")
head = "\n".join(src[: e_i + 1])  # through the logo <symbol> sprite
MF_JS = (ROOT / "skills/elaniin-style/templates/module-field.js").read_text()
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


def step(n, title, body, extra=""):
    return f'''<li class="card-glow lift min-w-0 rounded-card border border-border-default bg-surface-card pad-card">
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


def block(i, title, body_html):
    return f'''<section id="dev-{i}" class="border-t border-border-default py-12">
  <h3 class="max-w-[28ch] break-words font-display font-medium text-h3 text-text-primary"><span class="mr-3 font-mono text-code text-elevate-blue">{i:02d}</span>{title}</h3>
  <div class="mt-6 min-w-0 space-y-5">{body_html}</div>
</section>'''


def p(t):
    return f'<p class="max-w-[68ch] break-words text-body text-text-secondary">{t}</p>'


def ic(t):
    return f'<code class="break-words rounded-tag bg-surface-subtle px-1 font-mono text-code text-text-primary">{t}</code>'


# ------------------------------------------------------------------ team panel
SRC_URL = "https://github.com/aidesign-elaniin/elaniin-style"
SRC_GIT = SRC_URL + ".git"

team_steps = "\n".join([
    step("01", "Open Claude and go to Plugins", "In the Claude app (or on claude.ai) open the <strong>Customize</strong> menu, then <strong>Plugins</strong>."),
    step("02", "Add the Elaniin marketplace", "Click <strong>Add → Add marketplace</strong> and paste this full address. The repository is public: you don't need your own GitHub account.",
         f'<div class="mt-4">{code(SRC_URL, "address")}</div>'),
    step("03", "Install Elaniin Style", "Go to <strong>Discover</strong>, pick <strong>elaniin-style</strong> and click <strong>Add</strong>. It is saved to your account."),
    step("04", "Activate it the first time", "Type <code class=\"break-words rounded-tag bg-surface-subtle px-1 font-mono text-code text-text-primary\">/</code> in the chat and pick <strong>elaniin-style</strong>. After that Claude uses it on its own whenever you ask for something Elaniin."),
    step("05", "Let it update itself", "On the marketplace entry turn on <strong>Sync automatically</strong>. You get improvements without doing anything else."),
])

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
    ("How do I know it is active?", "Ask Claude for a deck or a page “in the Elaniin style”. It should use the official logo, white and grey with dark blue bands, and soft animations."),
    ("When do improvements arrive?", "On their own if you turned on <strong>Sync automatically</strong>. If not, open Plugins and click <strong>Check for updates</strong>."),
    ("I get an error saying “network source differs”", "You had already added Elaniin Style with a different form of address. In Plugins remove the <strong>elaniin-style-marketplace</strong> marketplace (Remove) and add it again pasting the full address from step 02."),
    ("I can't find the marketplace or it won't add", "Check that you pasted the full address, starting with <strong>https://github.com/</strong>. If it still fails, send the error message to a developer."),
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
    {eyebrow_h2("For the team", "Install it in 5 steps, no terminal", "Everything happens inside Claude. It takes under two minutes and you only do it once.")}
    <ol class="mt-10 grid-auto" style="--card-min:22rem">
      {team_steps}
    </ol>
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
claude plugin install elaniin-style@elaniin-style-marketplace

# 3) verify
claude plugin list'''
INSIDE = '''/plugin marketplace add https://github.com/aidesign-elaniin/elaniin-style
/plugin install elaniin-style@elaniin-style-marketplace
/reload-plugins'''
PROJECT_JSON = '''{
  "extraKnownMarketplaces": {
    "elaniin-style-marketplace": {
      "source": { "source": "git", "url": "https://github.com/aidesign-elaniin/elaniin-style.git" },
      "autoUpdate": true
    }
  },
  "enabledPlugins": {
    "elaniin-style@elaniin-style-marketplace": true
  }
}'''
UPDATE = '''# update manually
claude plugin update elaniin-style@elaniin-style-marketplace
# or from a session
/plugin marketplace update elaniin-style-marketplace
/reload-plugins

# uninstall / remove the marketplace
claude plugin uninstall elaniin-style@elaniin-style-marketplace
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
claude plugin details elaniin-style
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
    row("Signature texture", "module-field · module-field-dark · module-field-mask-left", "Section 08. Hero and final CTA."),
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
          code("/elaniin-style:elaniin-style", "claude code") +
          p("Four modes: <strong>deck</strong>, <strong>dashboard</strong>, <strong>website</strong> and <strong>site-dev</strong> (the Elaniin 2027 site in Next.js). Ask in Spanish or English; the skill answers in your language. The script that installs <code class=\"font-mono text-code text-text-primary\">motion</code> runs silently only if the project has a <code class=\"font-mono text-code text-text-primary\">package.json</code>.")),
    block(7, "Edit a generated deck or page", p("Deliverables are <strong>a single self-contained HTML file</strong>: they carry Tailwind v4 (<code class=\"font-mono text-code text-text-primary\">@tailwindcss/browser</code> pinned to 4.3.3) and the token block embedded. They do not depend on the plugin staying installed and do not update on their own: they belong to the project. Edit them with Tailwind classes like any HTML.") +
          '<div class="border-b border-border-default">' + tokens_rows + "</div>" +
          '<h4 class="pt-4 font-display font-medium text-h4 text-text-primary">Rules when editing</h4><ul class="space-y-3">' + rules + "</ul>" +
          '<h4 class="pt-4 font-display font-medium text-h4 text-text-primary">Example</h4>' + code(HTML_USE, "html") +
          p("The browser script needs internet to compile. To move the piece into a real project, switch to the build plugin and paste <code class=\"font-mono text-code text-text-primary\">tokens.css</code> (it lives in <code class=\"font-mono text-code text-text-primary\">skills/elaniin-style/templates/</code>) into your entry CSS.") +
          '<h4 class="pt-4 font-display font-medium text-h4 text-text-primary">Vite</h4>' + code(VITE) + code(VITE_CFG, "ts") + code(CSS_ENTRY, "css") +
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
                       module-field.js / .tsx, drawer.js''', "tree")),
])


example_cards = "\n".join(
    f'''<a href="{href}" target="_blank" rel="noopener" class="card-glow lift btn-arrow group flex min-w-0 flex-col rounded-card border border-border-default bg-surface-card pad-card focus-ring">
  <h3 class="font-display font-medium text-h3 text-text-primary">{title}</h3>
  <p class="mt-2 max-w-[40ch] break-words text-body text-text-secondary">{desc}</p>
  <span class="mt-6 inline-flex items-center gap-2 font-display text-body font-medium text-elevate-blue">Open example {ARROW}</span>
</a>'''
    for lab, title, desc, href in [
        ("Landing", "Product landing", "Hero with module field, features, looping pipeline, stats and mobile menu.", "templates/landing.html"),
        ("Dashboard", "Metrics dashboard", "Sidebar that turns into a drawer, live KPIs, chart and table.", "templates/dashboard.html"),
        ("Deck", "16:9 presentation deck", "Fixed 1280×720 canvas with keyboard navigation and living slides.", "templates/deck.html"),
    ])

dev_nav = "\n".join(
    f'<a href="#dev-{i}" class="nav-link inline-flex min-h-11 items-center text-body-sm text-text-secondary transition-colors duration-base hover:text-text-primary focus-ring">{i:02d} · {t}</a>'
    for i, t in [(1, "Install"), (2, "Scopes"), (3, "Shared repo"), (4, "Access"), (5, "Update"), (6, "Use"), (7, "Edit pieces"), (8, "Texture"), (9, "Organization"), (10, "Issues"), (11, "Grids"), (12, "Repo")]
)

panel_devs = f'''<div data-panel="devs" id="panel-devs" role="tabpanel" aria-labelledby="tab-devs" class="rise">
  <div class="container-site section-y-compact">
    {eyebrow_h2("For developers", "Install, use and edit pieces", "Claude Code, scopes, shared repos, auto-update and how to hand-edit a deck or a page with the Tailwind API.")}
    <nav aria-label="Developer sections" class="mt-8 flex flex-wrap gap-x-6">{dev_nav}</nav>
  </div>
  <div class="container-site pb-24">{dev_blocks}</div>
</div>'''

# ------------------------------------------------------------------ page
body = f'''
<div class="spotlight" aria-hidden="true"></div>
<div class="relative z-10">
<a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-3 focus:left-3 focus:bg-white focus:px-4 focus:py-2 focus:rounded-button focus:border focus:border-border-default focus:shadow-menu">Skip to content</a>

<header class="sticky top-0 z-40 border-b border-border-default bg-white/90 backdrop-blur">
  <div class="container-site flex h-16 items-center justify-between">
    <a href="#" class="flex items-center focus-ring" aria-label="Elaniin Style, home">
      <svg class="h-7 w-auto" role="img" aria-label="Elaniin" viewBox="0 0 364.43 81.38"><use href="#elaniin-logo"/></svg>
    </a>
    <nav class="hidden items-center gap-8 text-body-sm text-text-secondary md:flex" aria-label="Primary">
      <a href="#install" class="nav-link transition-colors duration-base hover:text-text-primary focus-ring">Install</a>
      <a href="#how" class="nav-link transition-colors duration-base hover:text-text-primary focus-ring">How it works</a>
      <a href="#examples" class="nav-link transition-colors duration-base hover:text-text-primary focus-ring">Examples</a>
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
    <div class="container-site relative">
      <h1 class="max-w-[16ch] break-words font-display font-medium text-display-xl text-text-primary rise" style="--i:1">The Elaniin style, inside Claude</h1>
      <p class="mt-6 max-w-[56ch] text-lead text-text-secondary rise" style="--i:2">Ask for a deck, a dashboard or a landing and Claude builds it with the Elaniin 2027 design system. Install it once and it updates itself.</p>
      <div class="mt-10 flex flex-wrap items-center gap-4 rise" style="--i:3">
        <a href="#install" class="btn-arrow inline-flex h-12 items-center gap-2 rounded-button bg-elevate-blue px-6 font-display text-body font-medium text-white transition-colors duration-base hover:bg-blue-600 active:bg-blue-700 focus-ring">Install now {ARROW}</a>
        <a href="#how" class="btn-arrow inline-flex h-12 items-center gap-2 rounded-button px-2 font-display text-body font-medium text-elevate-blue transition-colors duration-base hover:text-text-link-hover focus-ring">How it works {ARROW}</a>
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

  <section class="relative isolate overflow-hidden section-y bg-excellence-blue text-white">
    <div class="module-field module-field-dark module-field-mask-left" data-module-field aria-hidden="true"></div>
    <div class="container-site relative text-center">
      <h2 class="mx-auto max-w-[20ch] break-words font-display font-medium text-h2 text-white">Something not working?</h2>
      <p class="mx-auto mt-5 max-w-[56ch] text-lead text-text-on-dark-secondary">Open an issue on the repository with the step where you got stuck and the message you saw.</p>
      <a href="{REPO}/issues" class="btn-arrow mt-10 inline-flex h-12 items-center gap-2 rounded-button bg-elevate-blue px-8 font-display text-body font-medium text-white transition-colors duration-base hover:bg-blue-600 active:bg-blue-700 focus-ring-on-dark">Open an issue {ARROW}</a>
    </div>
  </section>
</main>

<footer class="bg-elaniin-black text-white">
  <div class="container-site py-12">
    <div class="flex flex-wrap items-center justify-between gap-6 border-b border-border-on-dark pb-8">
      <svg class="h-7 w-auto" role="img" aria-label="Elaniin" viewBox="0 0 364.43 81.38"><use href="#elaniin-logo-white"/></svg>
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
  var h = (location.hash || '').replace('#', '');
  select(h === 'devs' ? 'devs' : 'team', false, false);
  addEventListener('hashchange', function () {
    var x = location.hash.replace('#', '');
    if (x === 'devs' || x === 'team') select(x, false, false);
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
</body>
</html>
'''

out = ROOT / "docs"
out.mkdir(exist_ok=True)
(out / "index.html").write_text(head + "\n" + body + script)
import shutil
(out / "templates").mkdir(exist_ok=True)
for name in ("deck", "landing", "dashboard"):
    shutil.copy(ROOT / f"skills/elaniin-style/templates/{name}.html", out / "templates" / f"{name}.html")
print("ok", (out / "index.html").stat().st_size)
