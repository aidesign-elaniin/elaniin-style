---
name: elaniin-style
description: >
  Elaniin design system skill. Produces pitch decks, dashboards & reports, and websites
  & landings in the Elaniin 2027 style (white/grey base, Excellence Blue dark bands,
  Elevate Blue detail-only accent, hairline grids, restrained motion). Also develops
  the Elaniin 2027 Next.js site. Bilingüe: sigue instrucciones en EN o ES.
  Use when the user asks for an "Elaniin" deck, dashboard, report, landing, website,
  or to build/change the Elaniin site — or invokes /elaniin-style.
license: MIT
compatibility:
  requires_any_of:
    - Claude Code
    - Claude Artifacts (via HTML templates)
    - Codex / other coding agents (via install.sh --codex)
metadata:
  author: Elaniin
  version: "1.0.0"
  language: en,es
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch, WebSearch
---

# Elaniin Style

> **EN** — This skill encodes the Elaniin 2027 design system (DESIGN.md v1.45).
> Use it to design and build decks, dashboards & reports, websites & landings, and to
> develop the Elaniin 2027 site. Always work in the user's language (EN or ES).
>
> **ES** — Esta skill codifica el design system Elaniin 2027 (DESIGN.md v1.45).
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
See `references/motion.md`.

### Phase 4 — Delivery / Entrega
- **Deck / dashboard / landing (standalone):** one self-contained HTML file, Tailwind CDN
  v4 + `@theme` inline from `templates/tokens.css`. No external files except Google Fonts
  and the Tailwind CDN.
- **Elaniin site:** follow `references/site-dev.md` (Next.js 16, motion 14).
- Always include: focus rings, hover/active/disabled states, mobile layout, reduced-motion.

---

## 2 · UX core / Núcleo UX

Non-negotiables (full detail in `references/ux-a11y.md`):

1. **Focus is always visible.** `focus-ring` utility; white inner + elevate-blue outer on
   light, excellence-blue + `#7B9BFF` on dark.
2. **Every interactive element has 4 states:** rest, hover, active, disabled. Buttons carry
   a loading state that preserves width.
3. **Contrast:** body text ≥ 4.5:1; borders-for-inputs use `--color-border-input` (3.22:1).
4. **Reduced motion:** `prefers-reduced-motion: reduce` disables `rise`, glow, and all
   `motion` transforms. Content must be fully readable with zero animation.
5. **Touch targets:** ≥ 44×44px.
6. **Language:** produce all UI copy in the user's language (EN or ES). Never mix.

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
| ease-standard | `cubic-bezier(0.4,0,0.2,1)` | UI micro-interactions |
| ease-emphasized | `cubic-bezier(0.25,1,0.5,1)` | Entrances, reveals |
| reveal | 500ms / 16px up | Standard entrance |

Full map in `references/tokens.md`; copy-paste source in `templates/tokens.css`.

---

## 4 · Auto-install motion (silent) / Instalación automática de motion (silenciosa)

**EN** — Never ask the user to install `motion`. Run `scripts/ensure-motion.sh` from the
project root. It detects the lockfile and installs silently; if there is no `package.json`
it leaves the CSS-only ladder in place.

**ES** — Nunca pidas al usuario instalar `motion`. Ejecuta `scripts/ensure-motion.sh` desde
la raíz del proyecto. Detecta el lockfile e instala en silencio; si no hay `package.json`,
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

- [ ] Only Elaniin tokens used (no stray Tailwind default colors).
- [ ] elevate-blue appears only in allowed detail roles, <5% area.
- [ ] Alternating surfaces give the page rhythm.
- [ ] Type scale, measure, and families correct.
- [ ] Hairline borders for structure; shadows only on cards/menus/product shots.
- [ ] Motion: CSS ladder first; reduced-motion respected; content never blocked.
- [ ] Focus rings, hover/active/disabled states present.
- [ ] Mobile layout considered; targets ≥44px.
- [ ] All copy in the user's language.
- [ ] Standalone deliverables are one self-contained HTML file.
