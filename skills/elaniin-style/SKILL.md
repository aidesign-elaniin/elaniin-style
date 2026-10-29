---
name: elaniin-style
description: >
  Elaniin design system skill. Produces pitch decks, dashboards & reports, and websites
  & landings in the Elaniin 2027 style (white/grey base, Excellence Blue dark bands,
  Elevate Blue detail-only accent, hairline grids, restrained motion). Also builds
  COMPLETE multi-page websites from a sitemap, diagram or .md (Website Architect mode:
  Next.js static + Tailwind, master project with placeholder content, then page by page)
  and develops the Elaniin 2027 Next.js site. Bilingüe: sigue instrucciones en EN o ES.
  Use when the user asks for an "Elaniin" deck, dashboard, report, landing, website,
  a complete site / "sitio completo" / all its pages / sitemap / site architecture,
  or to build/change the Elaniin site — or invokes /elaniin:elaniin-style.
license: SEE LICENSE IN LICENSE
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

> **EN** — This skill encodes the Elaniin 2027 design system (DESIGN.md v1.87.3).
> Use it to design and build decks, dashboards & reports, websites & landings, and to
> develop the Elaniin 2027 site. Always work in the user's language (EN or ES).
>
> **ES** — Esta skill codifica el design system Elaniin 2027 (DESIGN.md v1.87.3).
> Úsala para diseñar y construir decks, dashboards & reports, websites & landings, y
> para desarrollar el sitio Elaniin 2027. Trabaja siempre en el idioma del usuario (EN o ES).

---

## 0 · Mode routing / Enrutamiento de modo

Detect the deliverable from the request and load only what you need:

| Mode | Trigger (user asks for…) | Load |
|---|---|---|
| **deck** | pitch deck, presentation, slides, informe presentado | `references/decks.md` + `templates/deck.html` |
| **dashboard** | dashboard, admin, analytics, report, panel | `references/dashboards.md` + `templates/dashboard.html` |
| **website** | single landing, one web page, quick landing | `references/websites.md` + `templates/landing.html` (+ `references/isometric.md` when a hero or section must explain how pieces fit) |
| **site** (Website Architect) | complete website, many pages, sitemap/diagram, subsites, "sitio completo", "todas sus páginas" | `references/site-architect.md` + `templates/site-starter/` (Next.js static + Tailwind). Phase A: master project from a diagram with placeholder content; phase B: design page by page when real content arrives |
| **site-dev** | build/change the Elaniin 2027 site (Next.js) | `references/site-dev.md` |

For every mode you also need:
- `references/components.md` — the specified components (mega-menu, hero, logo strip, solutions, cases, research, FAQ, CTA, 404, footer…) and primitives.
- `references/i18n.md` — only when the site is bilingual or Spanish (routes, dictionaries, SEO, formats).
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

**Source of truth:** DESIGN.md lives in the Elaniin 2027 site repository (`roger-elaniin/elaniin-2027-website`), not in this plugin; this skill tracks the version stated above. If a rule here disagrees with that file, the file wins.

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
- **Complete websites (many pages):** follow `references/site-architect.md`: one technical path (Next.js static + Tailwind v4), a complexity ladder justified in writing, page types + collections, real asset folders (no inlined logos/images), and a mandatory gate (`npm run build && npm run check`) before delivering. Every site ships with `MAINTENANCE.md` + `CLAUDE.md` (maintenance by 1–2 people with Claude Code and this skill, Claude Code is the CMS: no panel or external CMS): `references/maintenance.md`. Editorial collections (blog, cases, docs) are MDX files from the start, detected and proposed by Claude: `references/mdx.md`.
- Always include: focus rings, hover/active/disabled states, mobile layout, reduced-motion.

---

## 2 · UX core / Núcleo UX

Non-negotiables (full detail in `references/ux-a11y.md`):

1. **Official logotipo always, and only the logotipo.** Never render the brand as plain
   text. Use the official wordmark SVGs in `assets/`: `logotipo-elaniin.svg` on light
   surfaces and `white-logotipo-elaniin.svg` on dark ones, inlined as `<symbol>` + `<use>`,
   never a text fallback. **No symbol (isotipo) and no tagline anywhere**: they are not
   approved, so the isologo lockups no longer ship. Never recolor the name blue except the
   one approved case (`logotipo-elaniin-blue.svg`, only on the software slab of an isometric resource, see §7a and `references/isometric.md`).
2. **No overflow, ever.** Content must never spill the viewport, a slide, or a card.
   Enforce in Tailwind: `overflow-hidden` on fixed canvases, `min-w-0` on grid/flex
   children, `break-words` on long strings, explicit height budgets. See §7.
3. **Focus is always visible.** `focus-ring` utility; white inner + elevate-blue outer on
   light, excellence-blue + `#7B9BFF` on dark.
4. **Every interactive element has 4 states:** rest, hover, active, disabled. Buttons carry
   a loading state that preserves width.
5. **Contrast:** body text ≥ 4.5:1; borders-for-inputs use `--color-border-input` (3.22:1).
6. **Reduced motion:** `prefers-reduced-motion: reduce` disables transforms and parallax
   (`rise`, `glow-stripes`, `section-glow` drift, the module-field trail, count-ups, every `motion`
   transform); opacity fades stay, ≤150ms. Content must be fully readable with zero animation.
7. **Touch targets:** interactive elements ≥ 40px high (inputs 44px) with ≥ 8px between targets (DESIGN.md §8).
8. **Language:** produce all UI copy in the user's language (EN or ES). Never mix. The templates ship with English demo copy and `<html lang="en">`: when the user writes in Spanish, translate every string AND set `lang="es"`.
9. **Hover changes color, background or border only (DESIGN.md §7, non-negotiable).** 150ms,
   standard easing. **No lift, no scale, no glow, no pointer spotlight, no `translateY` on press.** The ONLY named exception is the expand icon of the solution card, which scales to 110% on hover (`icon-grow`); the 4px arrow slides of links are a translate.
   A card's only hover is `card-hover` (border-default → border-strong). Motion shows structure
   (a grid assembling, a module placing) and never decorates. Liveliness comes from: the
   `module-field` pointer trail (hero and closing CTA of landings), scroll `reveal`/`rise`,
   `count-up` (once), `draw-line` on charts, the arrow of a link or tertiary button that slides
   4px, and at least one living loop (§7b).
10. **Hover surfaces always have padding (non-negotiable).** Any element that shows a
   surface on hover (`card-hover`, a hover background or border) is a real card: it MUST
   carry `rounded-card border border-border-default bg-surface-card pad-card` (or `p-6`/`p-8`
   at least). Never leave text flush against the edge of a box that appears on hover, and
   never fake the padding with negative margins (`-mx-*`). Hairline cells without a hover
   surface may stay padding-free; the moment they get a hover surface they become cards.
11. **Mobile navigation is never lost, and it works (non-negotiable).** Any nav that
   disappears below its breakpoint (sidebar, links) MUST have a menu button — ≥40×40px,
   `aria-label`, `aria-controls`, `aria-expanded` — that opens a drawer: `drawer` + `scrim`
   utilities and `templates/drawer.js` (focus moves in, Esc / scrim / link / close button
   dismiss and return focus, Tab trapped, scroll locked, closes on resize). A dead
   hamburger button is a bug. Topbar at 375px: page title keeps priority (truncates last),
   max 3 actions, secondary actions are icon-only below `md` with `aria-label`, the brand
   logo lives in the drawer header. Every tap target ≥40px (`h-10`), page padding `p-4`
   mobile → `p-6` md. Test 375 / 768 / 1280 before delivering.
12. **Grids come from the Elaniin utilities (non-negotiable).** Layouts use `grid-page`
   (12 cols, fixed counts), `grid-auto` (unknown counts) or `grid-hairline` (shared 1px lines),
   plus Tailwind's native `col-span-*` / `grid-cols-*`, and `gap-grid` for any other gap.
   Mobile first (`col-span-12` then `md:` / `xl:`), `min-w-0` on every child, no negative
   margins, no `gap-[…]`, no `card-hover`/`card-glow` inside `grid-hairline`. Deck keeps explicit
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
16. **Gradients: only the ones DESIGN.md §2 rule 6 lists (non-negotiable).** The system is flat: hairlines,
   flat surfaces, the `module-field` texture. The ONLY gradients and glows allowed, each in its place:
   (a) `blue-steps`, the stepped blue motif (hard stops, ≤240px tall, one per page, aligned to the module grid,
   never behind text); (b) `glow-stripes` (`glow-media` on the media stage of a case card, `glow-cta` on the
   closing CTA, and the Blue Engine canvas) — animated blue stripes, never elsewhere; (c) `section-glow` behind a
   `glass` panel (white 55% + blur) in the audience-routes section; (d) `card-glow` / `card-glow-quiet` INSIDE dark
   cards (Excellence Blue / Elaniin Black) only; (e) the flow of the hero accent words (`accent-flow`, the only
   gradient on text; lightest stop blue-400); (f) a soft blue glow behind the glass browser window of a hero
   proposal; (g) the soft radial glows and masked radial fades of the solution looks (nav menu and solution cards); (h) inside an isometric resource: the 14px frost and the 3-unit halo of a pulse. Anything else
   (gradient backgrounds, blobs, neon, circuit lines, particles, a blue-violet gradient on dark) is a violation.
   The sticky top bar may use white 80% + `backdrop-blur` (8px). Nothing else.
17. **Decks end with a closing slide and device frames hide their seams (non-negotiable).**
   Every deck finishes with a closing slide: official logo, one closing line, contact. Device
   mockups (`phone-frame`) draw the bezel ABOVE the screens (overlay `::after`, higher z-index);
   screens run edge to edge underneath, so the joins of swiping screens are never visible.
   The deck controls (counter, dots, "Full") sit in a bottom bar of their own, outside the canvas, so they stay readable on white slides.
18. **Isometric resources follow the approved bar (non-negotiable).** A hero or section whose content
   is a structure (a stack, a flow, an architecture) may use an animated isometric resource, never as
   decoration; their main use is INSIDE cards (the solution cards, the route cells and the engagement cards, besides the hero stack) (v1.86: it may also be drawn in the `dark` look on a dark surface, still no frost there). Use the kit (`templates/iso-stack.js` for HTML,
   `templates/iso/` for React/Next): true isometric at 30°, inline SVG, frosted-glass slabs (14px frost),
   the defined color of each entity, fine textures, labels with the official Elaniin icons for software, AI and cloud (`assets/icons/`) and generic Lucide icons for anything else (never third-party
   brand logos), one 12s clock that runs only on screen, `iso-levitate` over a small shadow, reduced
   motion = assembled state. The blue logotipo appears only on the software slab. Full rules, exact
   geometry and the recipe for a new resource: `references/isometric.md`. Wait for approval before
   reusing a new resource elsewhere.
19. **Nav bar and footer are the reference site's (non-negotiable).** Never improvise them. Nav: `nav-bar`
   (64px, white 80% + 8px blur) that adopts the color of the section under it (sections with their own
   dark background declare `data-nav-theme="blue|black"`; `templates/nav-theme.js` or the hook of the
   site-starter sets `data-theme`/`data-tone`), links as `nav-item` (40px pill, subtle surface on hover),
   one primary md CTA, a 40px `nav-toggle` below `lg`. Footer: Excellence Blue (never Elaniin Black), white
   logotipo only, tagline, columns with display-font headings and plain `footer-link`s, a legal row on a
   hairline. Details: `references/websites.md`; spec: DESIGN.md components.nav / components.footer.
20. **Elevate Blue `#1054FF` has a closed list of uses (non-negotiable).** Allowed: primary button fill (one per
   action group; `dark` is the equal-weight alternative, never both together), running-text links and tertiary
   buttons, focus ring, active/selected indicators (tab underline 2px, current nav item, selected row marker),
   on-state of controls (checkbox, radio, switch, slider), small icons and 6–8px dots, the brand tag and info
   status, the first chart series and progress bars ≤4px, ONE highlighted word per headline (the Elaniin home has ONE today: the hero accent; a second, BLUE ENGINE©, returns with its dedicated page), the `blue-steps` motif, and the logotipo on the software slab of
   the isometric hero. Forbidden: section or card backgrounds, whole headlines or paragraphs, any single element
   larger than ~120×120px (except buttons and `blue-steps`). Budget: well under 5% of the visible area at any scroll
   position. Never blue text on Excellence Blue (use `text-on-dark-accent #7B9BFF`); Dynamic Blue is never text.
21. **Typography discipline.** Geist Mono has three default uses: tags/badges (`tag`, `status-badge`), eyebrows only
   when they carry information the heading does not, and code. Small descriptive text in mono (`mono-detail`,
   dates, sources, legal lines) is OPT-IN, only when the team asks, case by case. Never mono for headlines,
   paragraphs, navigation, buttons, form fields, figures, or the interface drawn inside case scenes. Never use DM
   Sans for headlines. **No decorative numbering** (`01 · Software`, `Step 02`, section counters): a number appears
   only when it is content (a metric, a price, a date, a sequence the user must follow).
22. **Compose, do not scatter (DESIGN.md §9).** The pieces of one visual (a phone and its data card, a window and
   its chips) form ONE composition centered as a group: they overlap or touch, instead of sitting at opposite
   edges. Keep the safe margin, never fill free space on purpose, and give the overlapping piece `shadow-menu`.
23. **Shape and content don'ts.** Buttons and cards are not pills and not sharp (radii only from the table in
   `references/tokens.md`); never three identical cards in a row (a bento varies span and content); no emoji, no
   filled or multi-color icons, no abstract illustrations of people; photography is real people, real places,
   natural light, radius 12px; icons are stroke-based, `currentColor`, 1.5px, 24px grid. Large soft shadows only on
   product mockups (`product-frame`); `menu-panel` on dropdowns.
24. **Section rhythm.** Alternate surfaces (white → subtle → white → dark band → white → … → footer). There is no fixed number of dark bands: avoid two in a row, with ONE approved exception on the home (the black research band is followed directly by the blue closing CTA; the engagement models and the research band are separated by the cases). The Elaniin home order is: Nav, Hero, Clients, AudienceRoutes, Solutions, Engagement, Cases, Research, Cta, Footer (nothing else; the FAQ and Blue Engine are kept for other pages). Composition is
   asymmetric (headline left, support offset); full-bleed sections, boxed content; uneven spacing on purpose
   (96–128px between sections, 12–16px inside a block).
25. **Animated mocks and counters.** Every loop runs only while on screen (`IntersectionObserver` / `useInView`),
   renders its final meaningful state under reduced motion, has a deterministic first render, holds the finished
   state ~2.5s before restarting, advances in discrete steps up the blue ramp (never smooth color), never animates
   a hairline cell background on reveal, and is `aria-hidden` (the meaning lives in the card text). `CountUp`
   counts once. `body` uses `overflow-x: clip`, never `hidden` (it breaks the sticky nav when the page scroll is
   locked). Focus returned by the page after closing a dialog may skip the ring (`data-focus-returned`) until the
   next key press; Tab always shows it.
26. **Components come from the spec, not from improvisation.** Mega-menu, hero (split/centered), logo strip,
   engagement models, FAQ, audience routes, solutions grid/card/dialog, cases, research, closing CTA, 404, footer
   (credentials, AI summary) and the primitives (`tag`, `status-badge`, `field`, `product-frame`, `code-block`,
   `icon-box`, `dark-band`, `metric-*`, `menu-*`, `tooltip`, `tab`) are specified in `references/components.md`;
   the React versions live in `templates/site-starter/src/components/`. Use them; do not invent a variant.
27. **Bilingual sites are built bilingual from the first line.** English primary (no prefix), Spanish under `/es`
   with translated slugs from ONE route table, `hreflang`/canonical per page, typed dictionaries (no visible string
   in a component), numbers/dates through `Intl`, a language switch that links to the same page in the other
   language. Spec and starter: `references/i18n.md`.
28. **Work method (from the reference site's hand-off).** One section at a time, verified at 375 / 768 / 1024 /
   1280 with the contrast of any new pair checked, then wait for approval. Read the design source before UI work;
   if a token is missing, propose it, update the design source and its change log, then the CSS, then the code.
   Never invent clients, figures, awards or facts; the isotipo and the tagline stay pending. Server Components by
   default, `"use client"` only on the leaf that needs it.
29. **Assets are copied, never embedded (non-negotiable for sites).** In a Next.js / multi-page project, brand files and glyphs are FILES under `public/` and packages in
   `package.json`, not SVG paths pasted into code. Identify the need from the brief or `src/content/site.ts` and run
   `bash "<skill folder>/scripts/add-assets.sh" "$PWD"` (no group = auto-detect): `brand` (logotipos → `public/brand/`, favicon → `src/app/icon.svg`), `certification`
   (ONLY the badges the site lists in `credentials`, → `public/certification/`), `glyphs` (LinkedIn and ChatGPT SVG files → `public/icons/` and `npm install simple-icons`
   for Instagram, Claude, Gemini and Perplexity), `solutions` (the three official icons → `public/assets/icons/`). Triggers: the brief mentions certifications, partners,
   awards or badges (`credentials`), social networks (`social`), or "get an AI summary" (`aiSummary: true`). The badges are marks of their owners: a client site shows only
   what its company really holds; Elaniin's own badges are for Elaniin sites. Never draw a third-party mark by hand and never paste its path into a component. Single-file
   HTML deliverables (deck, dashboard, landing) are the only place where the logotipo is embedded as `<symbol>`, because they must be one file.

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
`bash "${CLAUDE_SKILL_DIR}/scripts/ensure-motion.sh" "$PWD"`. It detects the lockfile, says in one line what it will run (it edits `package.json` and the lockfile), skips if `motion` is already there, never prompts and reports a failure on stderr (`ENSURE_MOTION_STRICT=1` makes it exit 1); if there is no `package.json`
it leaves the CSS-only ladder in place.

**ES** — Nunca pidas al usuario instalar `motion`. Ejecuta el `scripts/ensure-motion.sh` de esta skill
(`${CLAUDE_SKILL_DIR}` = carpeta de la skill) pasando la raíz del proyecto como argumento:
`bash "${CLAUDE_SKILL_DIR}/scripts/ensure-motion.sh" "$PWD"`. Detecta el lockfile, avisa en una línea qué va a ejecutar (edita `package.json` y el lockfile), no hace nada si `motion` ya está, nunca pregunta y reporta el fallo por stderr (`ENSURE_MOTION_STRICT=1` sale con código 1); si no hay `package.json`,
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
- [ ] **No hover lift, scale or glow, no pointer spotlight** (hover = color/background/border, 150ms).
- [ ] **Landings/websites: `module-field` in the hero background (and final CTA)** with its pointer-trail script.
- [ ] **Microinteractions present** (link/button arrow slides 4px, counters count once, chart draw, reveal).
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
- [ ] **Every `card-hover` element has `pad-card` (or p-6/p-8), radius and border** — text never touches the hover edge; no negative margins.
- [ ] **Decks:** last slide is a closing slide (logo + line + contact); device bezels sit above the screens, no visible seams; counter and dots match the slide count; counter, dots and the "Full" hint live in their own bottom bar (`hud`), never on top of a slide.
- [ ] **Isometric resource (if used):** built with the kit and the 15 rules of `references/isometric.md`; frost only inside it; blue logotipo only on the software slab; checked on a phone and at 375/768/1024/1280.
- [ ] **Gradients only from the list of rule 16** (`blue-steps`, `glow-stripes`, `section-glow`+`glass`, `card-glow` on dark cards, `accent-flow`, iso frost); none anywhere else.
- [ ] **Dashboards:** every nav item opens a real view; controls, Export and New report work; no user block, legal footer; no `href="#"`.
- [ ] **No eyebrows:** no small mono/uppercase label above any heading.
- [ ] **Anchors:** every `href="#id"` points at a `<section id>`; it lands with the section top under the sticky nav (`scroll-margin-top` via `[id]` base rule).
- [ ] **Grids** use `grid-page` / `grid-auto` / `grid-hairline` + `gap-grid`; children `min-w-0`; no `-mx-*`, no arbitrary gaps (see `references/grids.md`).
- [ ] **Mobile nav works:** hamburger opens a real drawer (aria-expanded, Esc, scrim, focus return); topbar fits at 375px with the title readable; tap targets ≥40px; checked at 375 / 768 / 1280.
- [ ] Focus rings, hover/active/disabled states present.
- [ ] Mobile layout considered; targets ≥40px (inputs 44px), ≥8px between them.
- [ ] All copy in the user's language.
- [ ] Standalone deliverables are one self-contained HTML file.

---

## 7 · Mandatory motion & overflow rules / Reglas obligatorias de movimiento y overflow

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
- **Trampa al incrustar (causa de logos en blanco):** los tres SVG (`logotipo`, `white-` y
  `-blue`) usan **el mismo nombre de clase** con distinto `fill`. Si pegas sus `<style>` en la
  misma página, gana la última regla y el logo oscuro sale blanco sobre blanco. Al hacer el
  `<symbol>` **quita el `<defs><style>` y las `class`** y pon el color como `fill` en un `<g>`:
  `<symbol id="elaniin-logo" viewBox="0 0 281.45 75.91"><g fill="#141414">…paths…</g></symbol>`.
  Verifica siempre en pantalla que el logo se ve (claro y oscuro).
- **Color:** negro Elaniin en superficies claras y blanco en oscuras. Nunca recolorear el nombre
  de azul salvo el caso aprobado de la tabla.
- **Favicon:** usar siempre `assets/favicon.svg` oficial. Nunca un cuadrado genérico distinto ni
  un favicon con símbolo.
- **Prohibido** escribir "elaniin" como texto en lugar del logotipo, y usar el isotipo/isologo.

### 7b · Module field + microanimaciones (siempre)
Toda propuesta (landing, dashboard, deck, reporte) DEBE incluir:
0. **Module field (textura firma de Elaniin) — landings y websites, siempre:** cuadrícula
   de cuadritos 2px/16px al fondo del **hero** y del **CTA final** que se enciende celda por
   celda siguiendo el mouse (rampa blue-300→400→500, ~260ms). Es la misma textura del sitio
   Elaniin 2027 (`elaniin-2027-website-main`). Recurso listo: utilities `module-field`,
   `module-field-dark`, `module-field-mask-left|none` en `templates/tokens.css` + rastro en
   `templates/module-field.js` (vanilla) o `templates/module-field.tsx` (React/Next). Si el
   usuario dice "textura", "textura interactiva", "module field" o "como el sitio", es esto.
   Detalle: `references/motion.md` §Module field.
1. **Sin spotlight del puntero** (DESIGN.md §7: hover = color/fondo/borde, sin glow). La única textura
   reactiva al mouse es el `module-field` (punto 0), solo en hero y CTA final de landings y websites.
2. **Microinteracciones como mínimo:**
   - Links y botones terciarios: la flecha se desplaza 4px al hover (`btn-arrow`); sin `scale` al presionar.
   - Cards: solo `card-hover` (borde `border-default` → `border-strong`), sin lift ni glow.
   - Números/KPIs: count-up al entrar en viewport, **una sola vez** (60 % visible); nunca reinicia.
   - Charts: trazo que se dibuja (`stroke-dashoffset`) al entrar en viewport.
   - Links de nav: `nav-item` con superficie sutil al hover.
   - Slides de deck: stagger de contenido (`rise`).
Referencia de implementación: `references/motion.md` §"Living surfaces".
Una pieza sin movimiento que muestre estructura (reveal, count-up, un loop vivo) no es una propuesta Elaniin; pero el movimiento nunca decora.

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
