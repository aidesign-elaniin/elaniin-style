---
name: elaniin-style
description: >
  Elaniin design system skill. Produces pitch decks, dashboards & reports, and websites
  & landings in the Elaniin 2027 style (white/grey base, Excellence Blue dark bands,
  Elevate Blue detail-only accent, hairline grids, restrained motion). Also develops
  the Elaniin 2027 Next.js site. Bilingüe: sigue instrucciones en EN o ES.
  Use when the user asks for an "Elaniin" deck, dashboard, report, landing, website,
  or to build/change the Elaniin site — or invokes /elaniin-style:elaniin-style.
license: MIT
compatibility:
  requires_any_of:
    - Claude Code
    - Claude Artifacts (via HTML templates)
metadata:
  author: Elaniin
  language: en,es
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch, WebSearch
---

# Elaniin Style

> **EN** — This skill encodes the Elaniin 2027 design system (DESIGN.md v1.51.2).
> Use it to design and build decks, dashboards & reports, websites & landings, and to
> develop the Elaniin 2027 site. Always work in the user's language (EN or ES).
>
> **ES** — Esta skill codifica el design system Elaniin 2027 (DESIGN.md v1.51.2).
> Úsala para diseñar y construir decks, dashboards & reports, websites & landings, y
> para desarrollar el sitio Elaniin 2027. Trabaja siempre en el idioma del usuario (EN o ES).

---

## 0 · Mode routing / Enrutamiento de modo

Detect the deliverable from the request and load only what you need:

| Mode | Trigger (user asks for…) | Load |
|---|---|---|
| **deck** | pitch deck, presentation, slides, informe presentado | `references/decks.md` + `templates/deck.html` |
| **dashboard** | dashboard, admin, analytics, report, panel | `references/dashboards.md` + `templates/dashboard.html` |
| **website** | landing, website, homepage, web page, sitio web | `references/websites.md` + `templates/landing.html` |
| **site-dev** | build/change the Elaniin 2027 site (Next.js) | `references/site-dev.md` |

For every mode you also need:
- `references/tokens.md` (or `templates/tokens.css`) — the color/type/motion vocabulary.
- `references/motion.md` — the animation language.
- `references/ux-a11y.md` — states, focus, contrast, reduced-motion.
- `references/grids.md` — `grid-page` / `grid-auto` / `grid-hairline` (website & dashboard layouts).

If ambiguous, ask one short clarifying question, then proceed.

---

## 1 · Pipeline (5 phases) / Pipeline (5 fases)

Run the phases in order. Do not skip Phase 0.

### Phase 0 — Brief & references / Brief y referencias
**EN** — Before designing anything, ask:
1. What is the deliverable and its audience? (funding round, client pitch, internal report…)
2. Do you have visual references attached (images) or links (Dribbble, Behance, a site)?
3. What content must appear (sections, data, slides)?

**ES** — Antes de diseñar, pregunta:
1. ¿Cuál es el entregable y su audiencia? (ronda de inversión, pitch a cliente, reporte interno…)
2. ¿Tienes referencias visuales adjuntas (imágenes) o links (Dribbble, Behance, un sitio)?
3. ¿Qué contenido debe aparecer (secciones, datos, diapositivas)?

**References rule (DESIGN.md §11):** A reference may inspire layout and structure, never
colors or fonts. Transpose it to Elaniin tokens. If the user has no references, propose
2–3 directions using the keywords in `references/search-keywords.md`.

**Regla de referencias:** Una referencia puede inspirar layout y estructura, nunca colores
ni tipografías. Transpónela a tokens Elaniin.

### Phase 1 — Structure / Estructura
Define the skeleton: sections, hierarchy, reading rhythm. Hairline grids divide; they do not
decorate. Alternating surfaces (white ⇄ inspire-grey ⇄ excellence-blue bands) create cadence.

### Phase 2 — Visual design / Diseño visual
Apply tokens strictly. See `references/tokens.md`. Rules that break most often:
- **elevate-blue `#1054FF` is DETAIL only** — links, focus, active, one primary button per
  group, small dots. Under 5% of visible area. Never a section or card background.
- **excellence-blue `#01172E` carries weight** — dark bands, CTA, footer, code.
- White and grey carry the page. The page breathes.
- Type: Instrument Sans (display), DM Sans (text), Geist Mono (labels/code).
- Measure: body 68ch, lead 56ch, headings 20ch.

### Phase 3 — Motion / Movimiento
Use the ladder: CSS `rise` keyframes first; `motion` only for interaction choreography.
Never block content on animation. Always respect `prefers-reduced-motion`.
Every deliverable ships **≥1 living loop** (pipeline CI on landings, live KPI on
dashboards, phone screens swiping on decks) — see `references/motion.md` §Living mockups.
See `references/motion.md`.

### Phase 4 — Delivery / Entrega
- **Deck / dashboard / landing (standalone):** one self-contained HTML file,
  `@tailwindcss/browser@4.3.3` (pinned) + `@theme` inline from `templates/tokens.css`. No
  external files except Google Fonts and that script. The browser CDN is a deliberate
  exception for standalone artifacts; any real project (Next/Vite) uses the build plugin,
  never the CDN.
- **All CSS goes through the Tailwind-first API** of `templates/tokens.css`: values in
  `@theme`/`:root`, every named resource an `@utility`, animations as `--animate-*` +
  keyframes in `@theme`, durations via `duration-*` (never `duration-200`). Raw class
  selectors are forbidden. Class → token inventory: `references/tailwind-api.md`.
- **Elaniin site:** follow `references/site-dev.md` (Next.js 16, motion 14).
- Always include: focus rings, hover/active/disabled states, mobile layout, reduced-motion.

---

## 2 · UX core / Núcleo UX

Non-negotiables (full detail in `references/ux-a11y.md`):

1. **Official logotipo always, and only the logotipo.** Never render the brand as plain
   text. Use the official wordmark SVGs in `assets/`: `logotipo-elaniin.svg` on light
   surfaces and `white-logotipo-elaniin.svg` on dark ones, inlined as `<symbol>` + `<use>`,
   never a text fallback. **No symbol (isotipo) and no tagline anywhere**: they are not
   approved, so the isologo lockups no longer ship. Never recolor the name blue except the
   one approved case (`logotipo-elaniin-blue.svg`, see §7a).
2. **No overflow, ever.** Content must never spill the viewport, a slide, or a card.
   Enforce in Tailwind: `overflow-hidden` on fixed canvases, `min-w-0` on grid/flex
   children, `break-words` on long strings, explicit height budgets. See §7.
3. **Focus is always visible.** `focus-ring` utility; white inner + elevate-blue outer on
   light, excellence-blue + `#7B9BFF` on dark.
4. **Every interactive element has 4 states:** rest, hover, active, disabled. Buttons carry
   a loading state that preserves width.
5. **Contrast:** body text ≥ 4.5:1; borders-for-inputs use `--color-border-input` (3.22:1).
6. **Reduced motion:** `prefers-reduced-motion: reduce` disables `rise`, glow, spotlight
   textures, and all `motion` transforms. Content must be fully readable with zero animation.
7. **Touch targets:** ≥ 44×44px.
8. **Language:** produce all UI copy in the user's language (EN or ES). Never mix.
9. **Alive by default.** Every deliverable includes (a) a mouse-reactive texture/spotlight
   and (b) microinteractions — see §7. Static, lifeless compositions are not Elaniin.
10. **Hover surfaces always have padding (non-negotiable).** Any element that shows a
   surface on hover — `lift`, `card-glow`, hover borders/shadows — is a real card: it MUST
   carry `rounded-card border border-border-default bg-surface-card pad-card` (or `p-6`/`p-8`
   at least). Never leave text flush against the edge of a box that appears on hover, and
   never fake the padding with negative margins (`-mx-*`). Hairline cells without a hover
   surface may stay padding-free; the moment they lift or glow they become cards.
11. **Mobile navigation is never lost, and it works (non-negotiable).** Any nav that
   disappears below its breakpoint (sidebar, links) MUST have a menu button — ≥44×44px,
   `aria-label`, `aria-controls`, `aria-expanded` — that opens a drawer: `drawer` + `scrim`
   utilities and `templates/drawer.js` (focus moves in, Esc / scrim / link / close button
   dismiss and return focus, Tab trapped, scroll locked, closes on resize). A dead
   hamburger button is a bug. Topbar at 375px: page title keeps priority (truncates last),
   max 3 actions, secondary actions are icon-only below `md` with `aria-label`, the brand
   logo lives in the drawer header. Every tap target ≥44px (`h-11`), page padding `p-4`
   mobile → `p-6` md. Test 375 / 768 / 1280 before delivering.
12. **Grids come from the Elaniin utilities (non-negotiable).** Layouts use `grid-page`
   (12 cols, fixed counts), `grid-auto` (unknown counts) or `grid-hairline` (shared 1px lines),
   plus Tailwind's native `col-span-*` / `grid-cols-*`, and `gap-grid` for any other gap.
   Mobile first (`col-span-12` then `md:` / `xl:`), `min-w-0` on every child, no negative
   margins, no `gap-[…]`, no `lift`/`card-glow` inside `grid-hairline`. Deck keeps explicit
   columns. Recipes: `references/grids.md`.
13. **No eyebrows (non-negotiable).** Never put a small mono/uppercase label above a heading
   ("Plugin para Claude", "01 — Discover", "The platform"): it is the tell-tale of generic
   AI-made pages. A heading stands alone; context goes in the heading or the lead text.
   `mono-label` is only for data labels (KPI captions, statuses, table headers, chart
   legends, footer column titles), never as a pre-heading. Step numbers live inline in the
   heading ("1. Abre Claude"), not above it.
14. **Anchors land at the section start (non-negotiable).** In-page links (`#features`) must
   put the top edge of the section right under the sticky nav, not its text or a heading.
   Put the `id` on the `<section>` (never on an inner heading or a "#" marker) and keep the
   base rule `[id] { scroll-margin-top: var(--nav-height) }` from `tokens.css`. Test every
   nav link at 375 and 1280.
15. **Dashboards are functional, not mockups (non-negotiable).** Every nav item opens a real
   view (hash router), every control works (search, filters, sort, range, create/download,
   settings that persist), Export is real and disabled where there is no data, and there is
   no SaaS user block: the sidebar is pinned to the viewport (`sticky`, `100dvh`) and only the content scrolls, with a thin one-line legal strip (Privacy · Terms · ©) in its bottom corner. A dashboard is not a
   SaaS. Details and minimum views: `references/dashboards.md`.
16. **No decorative gradients or color bars (non-negotiable).** No stepped/segmented blue
   bars, ramp strips, gradient backgrounds, blobs or glass. Structure comes from hairlines,
   flat surfaces and the `module-field` texture. The only soft glows allowed are the pointer
   `spotlight` and `card-glow`. The blue ramp tokens exist for states, never as a decorative strip.
17. **Decks end with a closing slide and device frames hide their seams (non-negotiable).**
   Every deck finishes with a closing slide: official logo, one closing line, contact. Device
   mockups (`phone-frame`) draw the bezel ABOVE the screens (overlay `::after`, higher z-index);
   screens run edge to edge underneath, so the joins of swiping screens are never visible.

---

## 3 · Tokens quick reference / Referencia rápida de tokens

| Token | Value | Use |
|---|---|---|
| elevate-blue | `#1054FF` | Detail accent only (<5% area) |
| inspire-grey | `#F0F0F3` | Alternate surface |
| excellence-blue | `#01172E` | Dark bands, CTA, footer, code |
| elaniin-black | `#141414` | Wordmark, primary text |
| dynamic-blue | `#4D75FD` | Non-text accents, chart series |
| border-default | `#E4E4EA` | Hairlines on white/grey |
| module-field | 2px squares / 16px pitch, grey 45% | Hero + CTA texture (utility `module-field`) |
| grid-gap · card-min | 24px (16 mobile) · 16rem | `gap-grid`, `grid-page`, `grid-auto`, `grid-hairline` — see `references/grids.md` |
| ease-standard | `cubic-bezier(0.4,0,0.2,1)` | UI micro-interactions |
| ease-emphasized | `cubic-bezier(0.25,1,0.5,1)` | Entrances, reveals |
| reveal | 500ms / 16px up | Standard entrance |

Full map in `references/tokens.md`; copy-paste source in `templates/tokens.css`;
**class → token → value inventory (Tailwind API) in `references/tailwind-api.md`**.

---

## 4 · Auto-install motion (silent) / Instalación automática de motion (silenciosa)

**EN** — Never ask the user to install `motion`. Run the skill's own `scripts/ensure-motion.sh`
(`${CLAUDE_SKILL_DIR}` = this skill folder) passing the project root as argument:
`bash "${CLAUDE_SKILL_DIR}/scripts/ensure-motion.sh" "$PWD"`. It detects the lockfile and installs silently; if there is no `package.json`
it leaves the CSS-only ladder in place.

**ES** — Nunca pidas al usuario instalar `motion`. Ejecuta el `scripts/ensure-motion.sh` de esta skill
(`${CLAUDE_SKILL_DIR}` = carpeta de la skill) pasando la raíz del proyecto como argumento:
`bash "${CLAUDE_SKILL_DIR}/scripts/ensure-motion.sh" "$PWD"`. Detecta el lockfile e instala en silencio; si no hay `package.json`,
deja la escalera CSS-only.

In Claude Artifacts (no npm): use the CSS ladder (`rise` + keyframes from `tokens.css`);
`motion` via `esm.sh` only if the interaction truly needs it.

---

## 5 · Search keywords for references / Palabras clave de búsqueda

When you need inspiration and the user has none, search with the bilingual keyword list in
`references/search-keywords.md` (Dribbble `/search/` and `/tags/`, Behance, Pinterest ES,
Awwwards, Godly, Land-book, Lapa Ninja, Siteinspire, Muzli, Mobbin).

Cuando necesites inspiración y el usuario no tenga referencias, busca con el listado
bilingüe de `references/search-keywords.md`.

---

## 6 · Output checklist / Checklist de salida

Before delivering, verify:

- [ ] **Official logotipo only** (dark on light, white on dark), 28px tall in nav/footer; no symbol, no tagline, no isologo, no text fallback; favicon = `assets/favicon.svg`.
- [ ] **Zero overflow:** nothing clipped in viewport, slides, or cards; decks full-screen fixed canvas.
- [ ] **Mouse-reactive texture/spotlight present** and disabled under reduced-motion.
- [ ] **Landings/websites: `module-field` in the hero background (and final CTA)** with its pointer-trail script.
- [ ] **Microinteractions present** (button arrow/press, card glow, counters, chart draw).
- [ ] Only Elaniin tokens used (no stray Tailwind default colors).
- [ ] elevate-blue appears only in allowed detail roles, <5% area.
- [ ] Alternating surfaces give the page rhythm.
- [ ] Type scale, measure, and families correct.
- [ ] Hairline borders for structure; shadows only on cards/menus/product shots.
- [ ] Motion: CSS ladder first; reduced-motion respected; content never blocked.
- [ ] **≥1 living loop running** (pipeline / live KPI / phone swipe): pauses off-screen,
      static end-state under reduced-motion. `motion.md` §Living mockups.
- [ ] **No raw CSS:** all styling via `@theme`/`@utility` tokens — check against
      `references/tailwind-api.md` (no stray arbitrary values that exist as tokens).
- [ ] **Every `lift` / `card-glow` element has `pad-card` (or p-6/p-8), radius and border** — text never touches the hover edge; no negative margins.
- [ ] **Decks:** last slide is a closing slide (logo + line + contact); device bezels sit above the screens, no visible seams; counter and dots match the slide count.
- [ ] **No gradients or color bars:** no stepped blue strip, gradient backgrounds, blobs or glass.
- [ ] **Dashboards:** every nav item opens a real view; controls, Export and New report work; no user block, legal footer; no `href="#"`.
- [ ] **No eyebrows:** no small mono/uppercase label above any heading.
- [ ] **Anchors:** every `href="#id"` points at a `<section id>`; it lands with the section top under the sticky nav (`scroll-margin-top` via `[id]` base rule).
- [ ] **Grids** use `grid-page` / `grid-auto` / `grid-hairline` + `gap-grid`; children `min-w-0`; no `-mx-*`, no arbitrary gaps (see `references/grids.md`).
- [ ] **Mobile nav works:** hamburger opens a real drawer (aria-expanded, Esc, scrim, focus return); topbar fits at 375px with the title readable; tap targets ≥44px; checked at 375 / 768 / 1280.
- [ ] Focus rings, hover/active/disabled states present.
- [ ] Mobile layout considered; targets ≥44px.
- [ ] All copy in the user's language.
- [ ] Standalone deliverables are one self-contained HTML file.

---

## 7 · Mandatory liveliness & overflow rules / Reglas obligatorias de vitalidad y overflow

### 7a · Logotipo oficial / Official logotipo
Regla del sitio (DESIGN.md §logo, v1.50.3): **solo el logotipo** (el lettering). Sin símbolo
(isotipo) y sin tagline, en nav, footer, deck, dashboard o cualquier uso, hasta que el equipo
los apruebe. Los lockups con símbolo (isologo) se quitaron: no se publican ni se usan.

| Archivo en `assets/` | Estado | Uso |
|---|---|---|
| `logotipo-elaniin.svg` | En uso | Wordmark `#141414`. Superficies claras (blanco, Inspire Grey) |
| `white-logotipo-elaniin.svg` | En uso | El mismo wordmark en blanco. Excellence Blue, Elaniin Black y footer |
| `logotipo-elaniin-blue.svg` | **Solo un caso** | El mismo wordmark en Elevate Blue `#1054FF`, únicamente sobre la losa de software del recurso isométrico del hero (3.96:1). Prohibido en cualquier otro uso |
| `favicon.svg` | **Provisional** | Cuadrado redondeado Elevate Blue con un círculo Inspire Grey: marca neutra **sin símbolo**. Se reemplaza cuando se apruebe el isotipo |

- En HTML autocontenido: incrustar una vez como `<symbol id="elaniin-logo">` /
  `<symbol id="elaniin-logo-white">` (viewBox `0 0 281.45 75.91`) y usar
  `<svg><use href="#elaniin-logo"/></svg>`.
- **Alineación (obligatorio):** el `<svg>` consumidor DEBE llevar el `viewBox` del asset
  (`0 0 281.45 75.91`). Sin `viewBox`, el browser usa 300px de ancho por defecto y el logo
  queda **centrado** en esa caja (aparenta indentado respecto al contenido de la izquierda).
  Correcto: `<svg class="h-7 w-auto" viewBox="0 0 281.45 75.91" aria-label="Elaniin"><use href="#elaniin-logo"/></svg>`
- **Tamaño:** nav y footer a 28px de alto (`h-7`, ≈104px de ancho); mínimo 96px de ancho en
  pantalla. Espacio libre: al menos la altura del punto de la "i" (≈16% del alto) por todos lados.
- **Color:** negro Elaniin en superficies claras y blanco en oscuras. Nunca recolorear el nombre
  de azul salvo el caso aprobado de la tabla.
- **Favicon:** usar siempre `assets/favicon.svg` oficial. Nunca un cuadrado genérico distinto ni
  un favicon con símbolo.
- **Prohibido** escribir "elaniin" como texto en lugar del logotipo, y usar el isotipo/isologo.

### 7b · Texturas reactivas al mouse + microanimaciones (siempre)
Toda propuesta (landing, dashboard, deck, reporte) DEBE incluir:
0. **Module field (textura firma de Elaniin) — landings y websites, siempre:** cuadrícula
   de cuadritos 2px/16px al fondo del **hero** y del **CTA final** que se enciende celda por
   celda siguiendo el mouse (rampa blue-300→400→500, ~260ms). Es la misma textura del sitio
   Elaniin 2027 (`elaniin-2027-website-main`). Recurso listo: utilities `module-field`,
   `module-field-dark`, `module-field-mask-left|none` en `templates/tokens.css` + rastro en
   `templates/module-field.js` (vanilla) o `templates/module-field.tsx` (React/Next). Si el
   usuario dice "textura", "textura interactiva", "module field" o "como el sitio", es esto.
   Detalle: `references/motion.md` §Module field.
1. **Spotlight / textura reactiva al mouse:** radial-gradient sutil que sigue al cursor
   mediante CSS vars (`--mx`, `--my`) actualizadas en `mousemove`. Opacidad 4–8%,
   tinte `blue-tint-50` o `dynamic-blue`. Estático bajo `prefers-reduced-motion`.
2. **Microinteracciones como mínimo:**
   - Botones: flecha que se desplaza al hover, `scale(0.98)` al press.
   - Cards: glow/spotlight que sigue al mouse dentro de la card + lift sutil.
   - Números/KPIs: count-up al entrar en viewport.
   - Charts: trazo que se dibuja (`stroke-dashoffset`) al entrar en viewport.
   - Links de nav: underline que entra desde la izquierda.
   - Slides de deck: spotlight por slide + stagger de contenido.
Referencia de implementación: `references/motion.md` §"Living surfaces".
Esto no es decoración opcional: una pieza estática no es una propuesta Elaniin.

### 7c · Anti-overflow (Tailwind + UX)
- **Deck:** canvas fijo 1280×720 con `transform: scale()`; `.slide { overflow: hidden; }`;
  **cero clases responsive dentro del deck** (el canvas siempre mide 1280);
  grid explícito (`grid-cols-3`, nunca `md:grid-cols-3`);
  presupuesto de contenido por slide: título + cuerpo deben caber en
  720 − 2×padding. Si no cabe, reducir copy o dividir el slide.
- **Grid/flex children:** `min-w-0` + `min-h-0` siempre que contengan texto o media.
- **Texto largo:** `break-words` / `line-clamp-*` donde aplique.
- **Cards:** `overflow-hidden` + altura controlada; el contenido interno no puede crecer
  más que la card.
- **Antes de entregar:** verificar visualmente cada slide/viewport; ningún elemento
  cortado, ningún scroll interno no deseado.
