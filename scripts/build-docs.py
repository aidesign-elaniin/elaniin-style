import html, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent  # repo root
src = (ROOT / "skills/elaniin-style/templates/landing.html").read_text().split("\n")
b_i = src.index("<body>")
e_i = next(i for i in range(b_i, len(src)) if src[i].strip() == "</svg>")
head = "\n".join(src[: e_i + 1])  # through the logo <symbol> sprite
MF_JS = (ROOT / "skills/elaniin-style/templates/module-field.js").read_text()
head = head.replace('<html lang="en">', '<html lang="es">')
head = head.replace("<title>Elaniin — Landing template</title>", "<title>Elaniin Style — Instalación y documentación</title>")
URL = "https://aidesign-elaniin.github.io/elaniin-style/"
META = """<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="description" content="Instala Elaniin Style como plugin de Claude: guía para el equipo y documentación para desarrolladores." />
<link rel="canonical" href="%(u)s" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Elaniin Style" />
<meta property="og:locale" content="es_ES" />
<meta property="og:title" content="Elaniin Style — el estilo Elaniin, dentro de Claude" />
<meta property="og:description" content="Plugin de Claude para crear decks, dashboards y landings con el sistema de diseño Elaniin 2027. Guía para el equipo y documentación para devs." />
<meta property="og:url" content="%(u)s" />
<meta property="og:image" content="%(u)sog.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Elaniin Style: el estilo Elaniin, dentro de Claude, con la textura de cuadritos azules de la marca." />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Elaniin Style — el estilo Elaniin, dentro de Claude" />
<meta name="twitter:description" content="Plugin de Claude para decks, dashboards y landings con el sistema de diseño Elaniin 2027." />
<meta name="twitter:image" content="%(u)sog.png" />""" % {"u": URL}
head = head.replace('<meta name="viewport" content="width=device-width, initial-scale=1.0" />', META)

REPO = "https://github.com/aidesign-elaniin/elaniin-style"
ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14m0 0l-6-6m6 6l-6 6"/></svg>'


def code(text, label="bash"):
    t = html.escape(text.strip("\n"))
    return f'''<div class="min-w-0 rounded-code border border-border-on-dark bg-surface-code">
  <div class="flex items-center justify-between border-b border-border-on-dark px-4 py-1">
    <span class="mono-label text-caption text-text-on-dark-muted">{label}</span>
    <button type="button" data-copy class="mono-label inline-flex h-11 min-w-11 items-center justify-center rounded-button px-3 text-caption text-text-on-dark-secondary transition-colors duration-fast hover:bg-surface-dark-card hover:text-white active:scale-95 focus-ring-on-dark">Copiar</button>
  </div>
  <pre class="px-4 py-4 font-mono text-code text-text-on-dark whitespace-pre-wrap break-words"><code>{t}</code></pre>
</div>'''


def step(n, title, body, extra=""):
    return f'''<li class="card-glow lift min-w-0 rounded-card border border-border-default bg-surface-card pad-card">
  <p class="mono-label text-caption text-elevate-blue">{n}</p>
  <h3 class="mt-3 font-display font-medium text-h4 text-text-primary">{title}</h3>
  <p class="mt-2 max-w-[56ch] break-words text-body text-text-secondary">{body}</p>{extra}
</li>'''


def eyebrow_h2(eyebrow, h2, lead=None, dark=False):
    c1 = "text-text-on-dark-accent" if dark else "text-text-muted"
    c2 = "text-white" if dark else "text-text-primary"
    c3 = "text-text-on-dark-secondary" if dark else "text-text-secondary"
    out = f'<p class="mono-label text-caption {c1}">{eyebrow}</p>\n<h2 class="mt-3 max-w-[20ch] break-words font-display font-medium text-h2 {c2}">{h2}</h2>'
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
  <p class="mono-label text-caption text-elevate-blue">{i:02d}</p>
  <h3 class="mt-3 max-w-[28ch] break-words font-display font-medium text-h3 text-text-primary">{title}</h3>
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
    step("01", "Abre Claude y entra a Plugins", "En la app de Claude (o en claude.ai) abre el menú <strong>Customize</strong> y luego <strong>Plugins</strong>."),
    step("02", "Agrega el marketplace de Elaniin", "Pulsa <strong>Add → Add marketplace</strong> y pega esta dirección completa. El repositorio es público: no necesitas tu propia cuenta de GitHub.",
         f'<div class="mt-4">{code(SRC_URL, "dirección")}</div>'),
    step("03", "Instala Elaniin Style", "Entra a <strong>Discover</strong>, elige <strong>elaniin-style</strong> y pulsa <strong>Add</strong>. Queda guardado en tu cuenta."),
    step("04", "Actívalo la primera vez", "Escribe <code class=\"break-words rounded-tag bg-surface-subtle px-1 font-mono text-code text-text-primary\">/</code> en el chat y elige <strong>elaniin-style</strong>. Después Claude lo usa solo cuando pides algo Elaniin."),
    step("05", "Deja que se actualice solo", "En la entrada del marketplace activa <strong>Sync automatically</strong>. Así recibes las mejoras sin hacer nada más."),
])

team_prompts = "\n".join(
    f'''<div class="card-glow lift min-w-0 rounded-card border border-border-default bg-surface-card p-6">
  <p class="mono-label text-caption text-text-muted">{lab}</p>
  <p class="mt-3 break-words font-display font-medium text-h4 text-text-primary">{txt}</p>
  <button type="button" data-copy-text="{html.escape(txt, quote=True)}" class="btn-arrow mono-label mt-5 inline-flex h-11 items-center gap-2 rounded-button border border-border-ink px-4 text-caption text-text-primary transition-colors duration-base hover:bg-surface-subtle focus-ring">Copiar pedido {ARROW}</button>
</div>'''
    for lab, txt in [
        ("Presentación", "Crea un pitch deck de 8 slides con el estilo Elaniin para presentar nuestro servicio de producto digital."),
        ("Reporte", "Diseña un dashboard con el estilo Elaniin con las métricas del último trimestre que te voy a pegar."),
        ("Página", "Construye una landing con el estilo Elaniin para presentar nuestro nuevo servicio."),
        ("Textura", "Agrega la textura interactiva module field al hero de esta página, como en el sitio de Elaniin."),
    ])

faq = [
    ("¿Tengo que instalar algo en mi computadora?", "No. Se instala dentro de Claude, desde la pantalla de Plugins. No usas terminal."),
    ("¿Cómo sé que está activo?", "Pídele a Claude un deck o una página “con el estilo Elaniin”. Debe usar el logo oficial, blanco y gris con bandas azul oscuro, y animaciones suaves."),
    ("¿Cuándo llegan las mejoras?", "Si activaste <strong>Sync automatically</strong>, solas. Si no, abre Plugins y pulsa <strong>Check for updates</strong>."),
    ("Me sale un error que dice “network source differs”", "Ya habías agregado Elaniin Style con otra forma de dirección. En Plugins quita el marketplace <strong>elaniin-style-marketplace</strong> (Remove) y vuelve a agregarlo pegando la dirección completa del paso 02."),
    ("No encuentro el marketplace o no se agrega", "Revisa que pegaste la dirección completa, empezando por <strong>https://github.com/</strong>. Si sigue igual, pasa el mensaje de error a una persona de desarrollo."),
    ("Mi deck o página necesita un cambio fino", "Pídeselo a Claude en la misma conversación. Si necesitas edición manual, pasa el archivo HTML a una persona de desarrollo: está hecho con Tailwind para eso."),
]
faq_html = "\n".join(
    f'''<details class="group border-t border-border-default py-4">
  <summary class="flex min-h-11 cursor-pointer items-center justify-between gap-4 font-display font-medium text-h4 text-text-primary focus-ring">{q}<span class="mono-label shrink-0 text-caption text-elevate-blue transition-transform duration-base group-open:rotate-45" aria-hidden="true">+</span></summary>
  <p class="mt-3 max-w-[68ch] break-words text-body text-text-secondary">{a}</p>
</details>'''
    for q, a in faq)

panel_team = f'''<div data-panel="team" id="panel-team" role="tabpanel" aria-labelledby="tab-team" class="rise">
  <div class="container-site section-y-compact">
    {eyebrow_h2("Para el equipo", "Instálalo en 5 pasos, sin terminal", "Todo ocurre dentro de Claude. Toma menos de dos minutos y solo se hace una vez.")}
    <ol class="mt-10 grid-auto" style="--card-min:22rem">
      {team_steps}
    </ol>
  </div>
  <div class="container-site pb-16">
    <p class="mono-label text-caption text-text-muted">Pruébalo</p>
    <h3 class="mt-3 max-w-[28ch] break-words font-display font-medium text-h3 text-text-primary">Cuatro pedidos para empezar</h3>
    <div class="mt-8 grid gap-6 md:grid-cols-2">{team_prompts}</div>
  </div>
  <div class="container-site pb-24">
    <p class="mono-label text-caption text-text-muted">Preguntas frecuentes</p>
    <div class="mt-6 border-b border-border-default">{faq_html}</div>
  </div>
</div>'''

# ------------------------------------------------------------------ dev panel
INSTALL = f'''# 1) agregar el marketplace
claude plugin marketplace add https://github.com/aidesign-elaniin/elaniin-style

# 2) instalar (scope user por defecto)
claude plugin install elaniin-style@elaniin-style-marketplace

# 3) verificar
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
UPDATE = '''# actualizar a mano
claude plugin update elaniin-style@elaniin-style-marketplace
# o desde una sesión
/plugin marketplace update elaniin-style-marketplace
/reload-plugins

# desinstalar / quitar el marketplace
claude plugin uninstall elaniin-style@elaniin-style-marketplace
claude plugin marketplace remove elaniin-style-marketplace'''
PRIVATE = '''# HTTPS
gh auth login
gh auth setup-git

# o SSH: llave en ssh-agent sin passphrase y github.com en known_hosts
# fuerza HTTPS si no quieres que pruebe SSH primero:
export CLAUDE_CODE_PLUGIN_PREFER_HTTPS=1'''
VITE = '''npm install tailwindcss @tailwindcss/vite'''
VITE_CFG = '''// vite.config.ts
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({ plugins: [tailwindcss()] })'''
CSS_ENTRY = '''/* src/index.css — @import va PRIMERO */
@import "tailwindcss";

/* …y debajo pega el contenido completo de tokens.css
   (@theme, :root, @utility, @layer base) */'''
NEXT = '''npm install tailwindcss @tailwindcss/postcss postcss'''
NEXT_CFG = '''// postcss.config.mjs
const config = { plugins: { "@tailwindcss/postcss": {} } };
export default config;'''
HTML_USE = '''<a class="inline-flex h-12 items-center rounded-button bg-elevate-blue px-6
          font-display font-medium text-white hover:bg-blue-600 active:bg-blue-700
          transition-colors duration-base focus-ring">
  Empezar
</a>'''
MANAGED = PROJECT_JSON
TS = '''# Error "network source differs from the one declared in settings":
# el marketplace ya existía con otra forma de dirección. Quítalo y agrégalo otra vez:
claude plugin marketplace remove elaniin-style-marketplace
claude plugin marketplace add https://github.com/aidesign-elaniin/elaniin-style

claude plugin list              # ¿está instalado y habilitado?
claude plugin details elaniin-style
/status                         # ¿qué settings se aplican?'''


MF_MARKUP = """<section class="relative isolate overflow-hidden section-y">
  <div class="module-field" data-module-field aria-hidden="true"></div>
  <div class="container-site relative">…contenido…</div>
</section>

<!-- sobre fondo oscuro, desvanecida a la izquierda -->
<section class="relative isolate overflow-hidden section-y bg-excellence-blue text-white">
  <div class="module-field module-field-dark module-field-mask-left"
       data-module-field aria-hidden="true"></div>
  <div class="container-site relative">…contenido…</div>
</section>"""
MF_LOAD = """<script src="module-field.js"></script>
<!-- o pega el contenido de templates/module-field.js dentro de un <script> al final del body -->"""
MF_REACT = """// Next.js / React: copia templates/module-field.tsx a src/components/
import { ModuleField } from "@/components/module-field";

<section className="relative isolate overflow-hidden section-y">
  <ModuleField />                       {/* fade="bottom" tone="light" */}
  <div className="container-site relative">…</div>
</section>

<ModuleField fade="left" tone="dark" /> {/* para bandas excellence-blue */}"""


def cell(label, cls=""):
    return f'<div class="min-w-0 rounded-tag bg-surface-subtle p-4 {cls}"><p class="mono-label break-words text-caption text-text-muted">{label}</p></div>'

DEMO_PAGE = '<div class="grid-page">' + "".join(cell(f"col-span-4", "col-span-12 md:col-span-4") for _ in range(3)) + "</div>"
DEMO_AUTO = '<div class="grid-auto" style="--card-min:10rem">' + "".join(cell(f"card {i}") for i in range(1, 7)) + "</div>"
DEMO_HAIR = '<div class="grid-hairline grid-cols-2 md:grid-cols-4">' + "".join(f'<div class="pad-card"><p class="font-display text-h3 font-medium text-text-primary">{v}</p><p class="mono-label text-caption text-text-muted">{l}</p></div>' for v, l in [("120+", "Proyectos"), ("4.9", "Rating"), ("38%", "Mejora"), ("6 sem", "Lanzamiento")]) + "</div>"
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
G_AUDIT = r"""grep -n -E '\-mx-|gap-\[|grid-cols-\[' archivo.html            # debe salir vacío"""

tokens_rows = "\n".join([
    row("Color", "bg-elevate-blue · bg-excellence-blue · bg-inspire-grey · text-text-primary · text-text-secondary · text-text-muted", "elevate-blue solo como detalle (&lt;5% del área)."),
    row("Tipografía", "font-display · font-text · font-mono · text-display-xl · text-h1…h4 · text-lead · text-body · text-caption", "Escala fluida; no uses tamaños sueltos."),
    row("Forma y sombra", "rounded-button · rounded-card · rounded-input · shadow-card-rest · shadow-menu · shadow-product", "Radios y sombras vienen de @theme."),
    row("Layout", "container-site · section-y · section-y-statement · section-y-compact · pad-card", "Gutter y ritmo vertical responsive."),
    row("Movimiento", "duration-fast · duration-base · duration-slow · duration-reveal · rise · reveal · card-glow · lift · btn-arrow", "Duraciones con nombre: nunca duration-200."),
    row("Foco", "focus-ring · focus-ring-on-dark", "Anillo doble visible en :focus-visible."),
    row("Cards con hover", "lift · card-glow + rounded-card border bg-surface-card pad-card", "Siempre con padding: nunca texto pegado al borde."),
    row("Grids", "gap-grid · grid-page · grid-auto · grid-hairline", "Sección 11. Sin márgenes negativos."),
    row("Navegación móvil", "drawer · scrim + drawer.js", "Botón de menú de 44px que abre un drawer real."),
    row("Textura firma", "module-field · module-field-dark · module-field-mask-left", "Sección 08. Hero y CTA final."),
    row("Breakpoints", "sm 640 · md 768 · lg 1024 · xl 1280", "Los defaults de Tailwind se resetean a propósito."),
])

rules = "\n".join(
    f'<li class="flex min-w-0 items-start gap-3"><span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-elevate-blue" aria-hidden="true"></span><span class="min-w-0 break-words text-body text-text-secondary">{t}</span></li>'
    for t in [
        "Sin hex ni valores sueltos: usa el token (<code class=\"font-mono text-code text-text-primary\">bg-elevate-blue</code>, no <code class=\"font-mono text-code text-text-primary\">bg-[#1054ff]</code>).",
        "Colores y escalas por defecto de Tailwind no existen: <code class=\"font-mono text-code text-text-primary\">bg-red-500</code> no compila.",
        "Nada de selectores de clase sueltos en <code class=\"font-mono text-code text-text-primary\">&lt;style&gt;</code>: cada recurso nuevo es un <code class=\"font-mono text-code text-text-primary\">@utility</code>.",
        "El deck no lleva clases responsive: su canvas siempre mide 1280×720. Usa <code class=\"font-mono text-code text-text-primary\">grid-cols-3</code>, no <code class=\"font-mono text-code text-text-primary\">md:grid-cols-3</code>.",
        "Mantén <code class=\"font-mono text-code text-text-primary\">min-w-0</code> en hijos de grid/flex y <code class=\"font-mono text-code text-text-primary\">overflow-hidden</code> en cards: cero overflow.",
        "Todo elemento con <code class=\"font-mono text-code text-text-primary\">lift</code> o <code class=\"font-mono text-code text-text-primary\">card-glow</code> es una card: lleva <code class=\"font-mono text-code text-text-primary\">rounded-card border bg-surface-card pad-card</code>. Nunca texto pegado al borde del hover ni márgenes negativos.",
        "Navegación móvil: si una nav se oculta bajo su breakpoint, necesita un botón de menú de 44px que abra un drawer real (<code class=\"font-mono text-code text-text-primary\">drawer</code> + <code class=\"font-mono text-code text-text-primary\">scrim</code> + <code class=\"font-mono text-code text-text-primary\">drawer.js</code>). Un hamburguesa sin acción es un bug; prueba a 375, 768 y 1280 px.",
        "Respeta reduced-motion: toda animación nueva debe apagarse con <code class=\"font-mono text-code text-text-primary\">prefers-reduced-motion</code>.",
    ])


mf_rules = "\n".join(
    f'<li class="flex min-w-0 items-start gap-3"><span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-elevate-blue" aria-hidden="true"></span><span class="min-w-0 break-words text-body text-text-secondary">{t}</span></li>'
    for t in [
        "Solo en hero y CTA final, una por sección. Nunca como relleno de cards ni detrás de bloques de texto largo.",
        "Es textura, no protagonista: opacidad en reposo 45% y sin glows ni degradados encima.",
        "Los cuadritos son decorativos: <code class=\"font-mono text-code text-text-primary\">aria-hidden=\"true\"</code> y sin eventos de puntero propios.",
        "En pantallas táctiles y con <code class=\"font-mono text-code text-text-primary\">prefers-reduced-motion</code> no hay rastro: queda solo la cuadrícula estática.",
        "El script también se necesita si agregas la textura a un HTML ya generado: sin él solo verás la cuadrícula en reposo.",
    ])


g_rules = "\n".join(
    f'<li class="flex min-w-0 items-start gap-3"><span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-elevate-blue" aria-hidden="true"></span><span class="min-w-0 break-words text-body text-text-secondary">{x}</span></li>'
    for x in [
        "Móvil primero: cada hijo de <code class=\"font-mono text-code text-text-primary\">grid-page</code> lleva <code class=\"font-mono text-code text-text-primary\">col-span-12</code> y luego sube con <code class=\"font-mono text-code text-text-primary\">md:</code> o <code class=\"font-mono text-code text-text-primary\">xl:</code>.",
        "<code class=\"font-mono text-code text-text-primary\">min-w-0</code> en todo hijo de grid o flex con texto, media o tablas.",
        "Nada de márgenes negativos (<code class=\"font-mono text-code text-text-primary\">-mx-*</code>) ni gaps arbitrarios (<code class=\"font-mono text-code text-text-primary\">gap-[18px]</code>).",
        "No uses <code class=\"font-mono text-code text-text-primary\">lift</code> ni <code class=\"font-mono text-code text-text-primary\">card-glow</code> dentro de <code class=\"font-mono text-code text-text-primary\">grid-hairline</code>: el recorte oculta la sombra. Para cards con hover usa <code class=\"font-mono text-code text-text-primary\">grid-page</code> o <code class=\"font-mono text-code text-text-primary\">grid-auto</code>.",
        "El deck mantiene columnas explícitas (<code class=\"font-mono text-code text-text-primary\">grid-cols-3</code>): su canvas siempre mide 1280 px.",
    ])

dev_blocks = "\n".join([
    block(1, "Instalar con la CLI", p("Requiere Claude Code. El plugin vive en el marketplace <code class=\"font-mono text-code text-text-primary\">elaniin-style-marketplace</code> de este repositorio.") + code(INSTALL) +
          p("<strong>Usa siempre la misma dirección</strong> (la URL completa) en la app, la CLI y los settings. Si mezclas <code class=\"font-mono text-code text-text-primary\">owner/repo</code> con la URL, Claude Code rechaza el marketplace con “network source differs”.") +
          p("Dentro de una sesión de Claude Code, los mismos pasos son:") + code(INSIDE, "claude code")),
    block(2, "Elegir el scope", p("Agrega <code class=\"font-mono text-code text-text-primary\">--scope</code> al comando <code class=\"font-mono text-code text-text-primary\">install</code>. Local gana sobre proyecto, y proyecto sobre usuario.") +
          '<div class="border-b border-border-default">' + row("user", "~/.claude/settings.json", "Predeterminado. Para todos tus proyectos.") +
          row("project", ".claude/settings.json", "Se commitea. Cada colaborador corre una vez el install.") +
          row("local", ".claude/settings.local.json", "Solo tú, solo este repo.") + "</div>"),
    block(3, "Habilitarlo en un repo compartido", p("Commitea esto en <code class=\"font-mono text-code text-text-primary\">.claude/settings.json</code> para que todo el equipo vea el marketplace. Se aplica después de aceptar la confianza del folder, y cada persona aún corre <code class=\"font-mono text-code text-text-primary\">claude plugin install … --scope project</code> una vez.") + code(PROJECT_JSON, "json")),
    block(4, "Acceso al repositorio", p("El repositorio es <strong>público</strong>: no hace falta cuenta de GitHub, token ni permisos para instalar o actualizar. Si algún día pasa a privado, Claude Code usará las credenciales de git del usuario (<code class=\"font-mono text-code text-text-primary\">gh auth login</code> y <code class=\"font-mono text-code text-text-primary\">gh auth setup-git</code> por HTTPS, o una llave SSH en ssh-agent).")),
    block(5, "Actualizar y desinstalar", p("El plugin no define <code class=\"font-mono text-code text-text-primary\">version</code>: cada commit del repo cuenta como versión nueva. Con <code class=\"font-mono text-code text-text-primary\">autoUpdate</code> activo se descarga solo unos minutos después de abrir una sesión; la sesión en curso conserva la versión cargada hasta <code class=\"font-mono text-code text-text-primary\">/reload-plugins</code> o reiniciar.") + code(UPDATE)),
    block(6, "Usar el skill", p("Claude lo carga solo cuando el pedido encaja. También puedes invocarlo con su nombre con namespace:") +
          code("/elaniin-style:elaniin-style", "claude code") +
          p("Cuatro modos: <strong>deck</strong>, <strong>dashboard</strong>, <strong>website</strong> y <strong>site-dev</strong> (el sitio Elaniin 2027 en Next.js). Pide en español o inglés; el skill responde en tu idioma. El script que instala <code class=\"font-mono text-code text-text-primary\">motion</code> corre en silencio solo si el proyecto tiene <code class=\"font-mono text-code text-text-primary\">package.json</code>.")),
    block(7, "Editar un deck o una página generada", p("Los entregables son <strong>un solo archivo HTML autocontenido</strong>: llevan Tailwind v4 (<code class=\"font-mono text-code text-text-primary\">@tailwindcss/browser</code> fijado en 4.3.3) y el bloque de tokens embebido. No dependen de que el plugin siga instalado ni se actualizan solos: son del proyecto. Se editan con clases de Tailwind como cualquier HTML.") +
          '<div class="border-b border-border-default">' + tokens_rows + "</div>" +
          '<h4 class="pt-4 font-display font-medium text-h4 text-text-primary">Reglas al editar</h4><ul class="space-y-3">' + rules + "</ul>" +
          '<h4 class="pt-4 font-display font-medium text-h4 text-text-primary">Ejemplo</h4>' + code(HTML_USE, "html") +
          p("El script de navegador necesita internet para compilar. Para llevar la pieza a un proyecto real, cambia al plugin de build y pega <code class=\"font-mono text-code text-text-primary\">tokens.css</code> (está en <code class=\"font-mono text-code text-text-primary\">skills/elaniin-style/templates/</code>) en tu CSS de entrada.") +
          '<h4 class="pt-4 font-display font-medium text-h4 text-text-primary">Vite</h4>' + code(VITE) + code(VITE_CFG, "ts") + code(CSS_ENTRY, "css") +
          '<h4 class="pt-4 font-display font-medium text-h4 text-text-primary">Next.js</h4>' + code(NEXT) + code(NEXT_CFG, "js") +
          p("Inventario completo clase → token → valor: <code class=\"font-mono text-code text-text-primary\">references/tailwind-api.md</code> dentro del plugin.")),
    block(8, "Textura interactiva: module field", p("Es la textura firma del sitio Elaniin: una cuadrícula de cuadritos de 2 px cada 16 px (gris al 45%) que, al mover el mouse, se enciende celda por celda subiendo la rampa <strong>blue-300 → blue-400 → blue-500</strong> y se apaga en ~260 ms. Va en el fondo del hero y del CTA final. Es la misma del sitio <code class=\"font-mono text-code text-text-primary\">elaniin-2027-website-main</code>, portada como recurso del skill.") +
          '<div class="border-b border-border-default">' +
          row("module-field", "Cuadrícula en reposo, solo CSS. Primer hijo del host.", "Base obligatoria.") +
          row("module-field-dark", "Cuadritos blancos tenues para bandas oscuras.", "Sobre excellence-blue.") +
          row("module-field-mask-left / -none", "Desvanece hacia la izquierda, o sin desvanecer.", "Por defecto se desvanece hacia abajo.") +
          row("--module-size · --module-pitch", "2px · 16px en :root. El rastro lo lee del CSS.", "Cámbialos solo en tokens.") +
          "</div>" +
          p("HTML (el host debe llevar <code class=\"font-mono text-code text-text-primary\">relative isolate overflow-hidden</code> y el contenido <code class=\"font-mono text-code text-text-primary\">relative</code>):") + code(MF_MARKUP, "html") +
          p("El rastro del mouse es un script de ~90 líneas sin dependencias. Los templates ya lo traen inline; en otros proyectos:") + code(MF_LOAD, "html") +
          '<h4 class="pt-4 font-display font-medium text-h4 text-text-primary">React / Next.js</h4>' + code(MF_REACT, "tsx") +
          '<h4 class="pt-4 font-display font-medium text-h4 text-text-primary">Reglas</h4><ul class="space-y-3">' + mf_rules + "</ul>"),
    block(9, "Despliegue para toda la organización", p("Para que el auto-update sea obligatorio y nadie pueda apagarlo, ponlo en <em>managed settings</em> (Organization settings → Claude Code → Managed settings, MDM o <code class=\"font-mono text-code text-text-primary\">managed-settings.json</code>). Con <code class=\"font-mono text-code text-text-primary\">autoUpdate</code> definido ahí, el toggle de <code class=\"font-mono text-code text-text-primary\">/plugin</code> queda bloqueado.") + code(MANAGED, "json") +
          p("Si usan <code class=\"font-mono text-code text-text-primary\">DISABLE_AUTOUPDATER=1</code>, agreguen <code class=\"font-mono text-code text-text-primary\">FORCE_AUTOUPDATE_PLUGINS=1</code> para mantener las actualizaciones del plugin.")),
    block(10, "Solución de problemas", code(TS) +
          p("¿Falla el clone? Revisa las credenciales de git (bloque 04). ¿No aparece el comando? Corre <code class=\"font-mono text-code text-text-primary\">/reload-plugins</code> o abre una sesión nueva. ¿Sigue la versión vieja? <code class=\"font-mono text-code text-text-primary\">claude plugin update</code> y recarga.")),
    block(11, "Grids", p("Tailwind ya trae <code class=\"font-mono text-code text-text-primary\">grid-cols-*</code> y <code class=\"font-mono text-code text-text-primary\">col-span-*</code>. El plugin añade cuatro utilities que los conectan con los tokens de Elaniin: úsalas siempre en vez de armar grids con valores sueltos.") +
          '<div class="border-b border-border-default">' +
          row("gap-grid", "gap del token: 24px, 16px en móvil.", "Para cualquier grid o flex.") +
          row("grid-page", "12 columnas. Hijos con col-span-12 md:col-span-N.", "Conteo fijo: KPIs, features, aside.") +
          row("grid-auto", "auto-fit con --card-min (16rem).", "Conteo desconocido: cards, logos.") +
          row("grid-hairline", "celdas con líneas de 1px, sin márgenes negativos.", "Stats y comparativas. Con grid-cols-N y pad-card.") +
          "</div>" +
          '<h4 class="pt-4 font-display font-medium text-h4 text-text-primary">grid-page</h4>' + DEMO_PAGE + code(G_PAGE, "html") +
          '<h4 class="pt-4 font-display font-medium text-h4 text-text-primary">grid-auto</h4>' + DEMO_AUTO + code(G_AUTO, "html") +
          '<h4 class="pt-4 font-display font-medium text-h4 text-text-primary">grid-hairline</h4>' + DEMO_HAIR + code(G_HAIR, "html") +
          '<h4 class="pt-4 font-display font-medium text-h4 text-text-primary">Reglas</h4><ul class="space-y-3">' + g_rules + "</ul>" +
          code(G_AUDIT) +
          p("Recetas completas (bento, aside, container queries) en <code class=\"font-mono text-code text-text-primary\">references/grids.md</code> dentro del plugin.")),
    block(12, "Qué trae el repositorio", code('''.claude-plugin/        marketplace.json + plugin.json
docs/                  este landing y los templates de muestra
scripts/build-docs.py  regenera docs/ (landing + copia de templates)
skills/elaniin-style/
├── SKILL.md           pipeline de 5 fases y reglas
├── assets/            logos oficiales y favicon
├── references/        tokens, tailwind-api, grids, motion, ux-a11y, websites, decks, dashboards
├── scripts/           ensure-motion.sh
└── templates/         tokens.css, landing.html, dashboard.html, deck.html,
                       module-field.js / .tsx, drawer.js''', "árbol")),
])


example_cards = "\n".join(
    f'''<a href="{href}" target="_blank" rel="noopener" class="card-glow lift btn-arrow group flex min-w-0 flex-col rounded-card border border-border-default bg-surface-card pad-card focus-ring">
  <p class="mono-label text-caption text-elevate-blue">{lab}</p>
  <h3 class="mt-3 font-display font-medium text-h3 text-text-primary">{title}</h3>
  <p class="mt-2 max-w-[40ch] break-words text-body text-text-secondary">{desc}</p>
  <span class="mt-6 inline-flex items-center gap-2 font-display text-body font-medium text-elevate-blue">Abrir ejemplo {ARROW}</span>
</a>'''
    for lab, title, desc, href in [
        ("Landing", "Página de producto", "Hero con module field, features, pipeline en loop, stats y menú móvil.", "templates/landing.html"),
        ("Dashboard", "Panel de métricas", "Sidebar que se vuelve drawer, KPIs en vivo, chart y tabla.", "templates/dashboard.html"),
        ("Deck", "Presentación 16:9", "Canvas fijo de 1280×720 con navegación por teclado y slides vivos.", "templates/deck.html"),
    ])

dev_nav = "\n".join(
    f'<a href="#dev-{i}" class="nav-link inline-flex min-h-11 items-center text-body-sm text-text-secondary transition-colors duration-base hover:text-text-primary focus-ring">{i:02d} · {t}</a>'
    for i, t in [(1, "Instalar"), (2, "Scopes"), (3, "Repo compartido"), (4, "Acceso"), (5, "Actualizar"), (6, "Usar"), (7, "Editar piezas"), (8, "Textura"), (9, "Organización"), (10, "Problemas"), (11, "Grids"), (12, "Repo")]
)

panel_devs = f'''<div data-panel="devs" id="panel-devs" role="tabpanel" aria-labelledby="tab-devs" class="rise">
  <div class="container-site section-y-compact">
    {eyebrow_h2("Para desarrollo", "Instalación, uso y edición de piezas", "Claude Code, scopes, repos compartidos, auto-update y cómo editar a mano un deck o una página con la API de Tailwind.")}
    <nav aria-label="Secciones para desarrollo" class="mt-8 flex flex-wrap gap-x-6">{dev_nav}</nav>
  </div>
  <div class="container-site pb-24">{dev_blocks}</div>
</div>'''

# ------------------------------------------------------------------ page
body = f'''
<div class="spotlight" aria-hidden="true"></div>
<div class="relative z-10">
<a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-3 focus:left-3 focus:bg-white focus:px-4 focus:py-2 focus:rounded-button focus:border focus:border-border-default focus:shadow-menu">Saltar al contenido</a>

<header class="sticky top-0 z-40 border-b border-border-default bg-white/90 backdrop-blur">
  <div class="container-site flex h-16 items-center justify-between">
    <a href="#" class="flex items-center focus-ring" aria-label="Elaniin Style, inicio">
      <svg class="h-7 w-auto" role="img" aria-label="Elaniin" viewBox="0 0 364.43 81.38"><use href="#elaniin-logo"/></svg>
    </a>
    <nav class="hidden items-center gap-8 text-body-sm text-text-secondary md:flex" aria-label="Principal">
      <a href="#install" class="nav-link transition-colors duration-base hover:text-text-primary focus-ring">Instalar</a>
      <a href="#how" class="nav-link transition-colors duration-base hover:text-text-primary focus-ring">Cómo funciona</a>
      <a href="#examples" class="nav-link transition-colors duration-base hover:text-text-primary focus-ring">Ejemplos</a>
      <a href="{REPO}" class="btn-arrow ml-2 inline-flex h-10 items-center gap-2 rounded-button border border-border-ink px-4 font-display text-body-sm font-medium text-text-primary transition-colors duration-base hover:bg-surface-subtle focus-ring">GitHub {ARROW}</a>
    </nav>
    <a href="#install" class="inline-flex h-11 items-center rounded-button bg-elevate-blue px-4 font-display text-body-sm font-medium text-white md:hidden focus-ring">Instalar</a>
  </div>
</header>

<main id="main">
  <section class="relative isolate overflow-hidden section-y" style="--section-y:104px">
    <div class="module-field" data-module-field aria-hidden="true"></div>
    <div class="container-site relative">
      <p class="mono-label text-caption text-text-muted rise" style="--i:0">Plugin para Claude</p>
      <h1 class="mt-4 max-w-[16ch] break-words font-display font-medium text-display-xl text-text-primary rise" style="--i:1">El estilo Elaniin, dentro de Claude</h1>
      <p class="mt-6 max-w-[56ch] text-lead text-text-secondary rise" style="--i:2">Pide un deck, un dashboard o una landing y Claude los arma con el sistema de diseño Elaniin 2027. Se instala una vez y se actualiza solo.</p>
      <div class="mt-10 flex flex-wrap items-center gap-4 rise" style="--i:3">
        <a href="#install" class="btn-arrow inline-flex h-12 items-center gap-2 rounded-button bg-elevate-blue px-6 font-display text-body font-medium text-white transition-colors duration-base hover:bg-blue-600 active:bg-blue-700 focus-ring">Instalar ahora {ARROW}</a>
        <a href="#how" class="btn-arrow inline-flex h-12 items-center gap-2 rounded-button px-2 font-display text-body font-medium text-elevate-blue transition-colors duration-base hover:text-text-link-hover focus-ring">Cómo funciona {ARROW}</a>
      </div>
    </div>
  </section>

  <section id="how" class="section-y-compact border-y border-border-default bg-surface-subtle">
    <div class="container-site">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div class="min-w-0">
          <p class="mono-label text-caption text-text-muted">Cómo funciona</p>
          <h2 class="mt-3 font-display font-medium text-h3 text-text-primary">Una instalación, siempre al día</h2>
        </div>
        <p class="mono-label text-caption text-elevate-blue" data-pipeline-status aria-live="off">Listo ✓</p>
      </div>
      <ol class="pipeline mt-8" data-pipeline>
        <li data-state="done">Instalar</li>
        <li data-state="done">Activar</li>
        <li data-state="done">Crear</li>
        <li data-state="done">Actualizar</li>
      </ol>
    </div>
  </section>

  <section id="install" class="section-y-compact">
    <div class="container-site text-center">
      <p class="mono-label text-caption text-text-muted">Elige tu camino</p>
      <h2 class="mx-auto mt-3 max-w-[20ch] break-words font-display font-medium text-h2 text-text-primary">¿Quién va a instalarlo?</h2>
      <div role="tablist" aria-label="Tipo de usuario" class="mt-8 inline-flex rounded-button border border-border-ink p-1">
        <button type="button" role="tab" id="tab-team" data-tab="team" aria-controls="panel-team" aria-selected="true" class="inline-flex h-11 min-w-36 items-center justify-center rounded-button px-5 font-display text-body font-medium text-text-primary transition-colors duration-base hover:bg-surface-subtle aria-selected:bg-excellence-blue aria-selected:text-white aria-selected:hover:bg-excellence-blue focus-ring">Soy del equipo</button>
        <button type="button" role="tab" id="tab-devs" data-tab="devs" aria-controls="panel-devs" aria-selected="false" tabindex="-1" class="inline-flex h-11 min-w-36 items-center justify-center rounded-button px-5 font-display text-body font-medium text-text-primary transition-colors duration-base hover:bg-surface-subtle aria-selected:bg-excellence-blue aria-selected:text-white aria-selected:hover:bg-excellence-blue focus-ring">Soy dev</button>
      </div>
      <p class="mx-auto mt-4 max-w-[56ch] text-body-sm text-text-muted">Equipo: se instala desde la app de Claude, sin terminal. Dev: CLI, scopes, auto-update y edición de piezas.</p>
    </div>
  </section>

  <section class="border-t border-border-default" aria-label="Guía de instalación">
{panel_team}
{panel_devs}
  </section>

  <section id="examples" class="section-y-compact border-t border-border-default">
    <div class="container-site">
      {eyebrow_h2("Ejemplos", "Míralo funcionando", "Tres piezas de muestra hechas con el skill. Ábrelas, redimensiona la ventana y mueve el mouse.")}
      <div class="grid-auto mt-10" style="--card-min:18rem">
        {example_cards}
      </div>
    </div>
  </section>

  <section class="relative isolate overflow-hidden section-y bg-excellence-blue text-white">
    <div class="module-field module-field-dark module-field-mask-left" data-module-field aria-hidden="true"></div>
    <div class="container-site relative text-center">
      <h2 class="mx-auto max-w-[20ch] break-words font-display font-medium text-h2 text-white">¿Algo no funciona?</h2>
      <p class="mx-auto mt-5 max-w-[56ch] text-lead text-text-on-dark-secondary">Abre un issue en el repositorio con el paso donde te quedaste y el mensaje que viste.</p>
      <a href="{REPO}/issues" class="btn-arrow mt-10 inline-flex h-12 items-center gap-2 rounded-button bg-elevate-blue px-8 font-display text-body font-medium text-white transition-colors duration-base hover:bg-blue-600 active:bg-blue-700 focus-ring-on-dark">Abrir un issue {ARROW}</a>
    </div>
  </section>
</main>

<footer class="bg-elaniin-black text-white">
  <div class="container-site py-12">
    <div class="flex flex-wrap items-center justify-between gap-6 border-b border-border-on-dark pb-8">
      <svg class="h-7 w-auto" role="img" aria-label="Elaniin" viewBox="0 0 364.43 81.38"><use href="#elaniin-logo-white"/></svg>
      <a href="{REPO}" class="nav-link inline-flex min-h-11 items-center text-body-sm text-text-on-dark-secondary transition-colors duration-base hover:text-white focus-ring-on-dark">Repositorio en GitHub</a>
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

  /* switch: Equipo / Dev (hash-synced, arrow keys) */
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
      copy(pre.innerText, function () { flashText(b.firstChild, 'Copiado'); }, function () { flashText(b.firstChild, 'Selecciona y copia'); });
    });
  });
  document.querySelectorAll('[data-copy-text]').forEach(function (b) {
    b.addEventListener('click', function () {
      copy(b.dataset.copyText, function () { flashText(b.firstChild, 'Copiado '); }, function () { flashText(b.firstChild, 'Selecciona y copia '); });
    });
  });

  /* living loop: install pipeline, paused off-screen */
  var pipeline = document.querySelector('[data-pipeline]');
  var statusEl = document.querySelector('[data-pipeline-status]');
  if (pipeline) {
    var steps = Array.prototype.slice.call(pipeline.children);
    var names = ['Instalando…', 'Activando…', 'Creando…', 'Actualizando…', 'Listo ✓'];
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
