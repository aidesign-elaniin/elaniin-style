# Fuente de verdad: DESIGN.md / Source of truth

El design system vive en el `DESIGN.md` del repositorio del sitio Elaniin 2027, **no en este plugin**.
La skill replica sus tokens, componentes y reglas; si algo aquí contradice a ese archivo, gana ese archivo.

| | |
|---|---|
| Repositorio | `https://github.com/roger-elaniin/elaniin-2027-website` |
| Archivo | `DESIGN.md` (y `src/app/globals.css`, `src/components/ui/iso/`) |
| Versión implementada por el plugin | **v1.87.2** |
| Commit contra el que se sincronizó | `5fa8a6c` (28 oct 2026) |

## Adoptado en v1.87

Los **tres íconos oficiales de Elaniin** (software, AI y cloud) sustituyen a los de Lucide en las losas del recurso isométrico del
hero. Son los íconos de las **soluciones de Elaniin** y del detalle de AI; todo lo demás (flechas, cerrar, personas, etc.) sigue en Lucide.
Los SVG fuente están en `assets/icons/` (activos de marca, bajo su licencia reservada). Se dibujan al 90 % alrededor del centro de la
celda de 24 con el trazo dividido por 0.9, para conservar el peso de línea del sistema (React: `templates/iso/elaniin-icons.tsx`; HTML:
el mapa `ICONS` de `templates/iso-stack.js`). El `DESIGN.md` de la referencia aún los marca "to be validated applied": si la validación
cambia algo, se ajusta aquí.

## Adoptado en v1.87.2 (auditoría completa contra el DESIGN.md)

Auditoría línea por línea del frontmatter y de las secciones 1 a 13 (28 oct 2026). **Las contradicciones se resolvieron a favor del DESIGN.md** ("si se contradice es porque cambió"): hover sin lift, scale ni glow
(se retiran `spotlight`, `lift` y el `card-glow` que seguía al puntero); gradientes solo los de §2 regla 6 (vuelven `blue-steps`, `glow-stripes`, `section-glow`, `card-glow` en cards oscuras); targets ≥ 40 px (inputs 44); sin
`translateY` al presionar un botón; botones `dark`, `tertiary`, `on-dark` y `on-dark-secondary`.

| DESIGN.md | Dónde vive en el plugin |
|---|---|
| `colors.*`, `elevate-blue-usage`, `typography.*`, `spacing`, `layout`, `radius`, `shadow`, `motion` | `templates/tokens.css` (única fuente), `references/tokens.md`, SKILL reglas 20 y 21 |
| `components.button`, `link`, `input`, `tag`, `status-badge`, `card`, `bento`, `product-frame`, `code-block`, `tab`, `control-on-state`, `metric`, `menu`, `tooltip`, `dark-band` | utilidades de `tokens.css`; `references/components.md` §0; `site-starter/src/components/ui/` |
| `components.nav`, `mega-menu` (+ `visual-column`, `solution-cards`), idioma | `nav-bar`/`nav-item`/`nav-toggle`; `site-starter/src/components/layout/{nav,mega-menu}.tsx`; `components.md` §1 |
| `components.hero` (variantes, flow, 100dvh, 2 CTA, propuestas) | `sections/hero.tsx`, `accent-flow`, `hero-fill`; `iso/scenes/hero-{stack-plus,modernization}.tsx`; `components.md` §2 |
| `components.logo-strip` (rotación, regiones, tamaños) | `sections/logo-strip.tsx`; `templates/i18n/region.ts`; `components.md` §3 |
| `components.engagement-models`, `motifs.engagement-scenes` | `sections/engagement.tsx`, `engage-row`/`engage-card`; `iso/scenes/{staff,team,project}-scene.tsx`; `components.md` §4 |
| `components.blue-engine` | solo registro de diseño (sin código desde v1.84 en la referencia): `components.md` §5 |
| `components.faq` | `sections/faq.tsx` + `faq-accordion.tsx`, `accordion-panel`; `components.md` §6 |
| `components.audience-routes` (toggle, panel de casos, 6 isométricos) | `sections/audience-routes.tsx`, `section-glow`, `glass`; `iso/scenes/*-visual.tsx`; `components.md` §7 |
| `components.solutions-grid`, `solution-card`, `visual-panel`, `solution-dialog`, `mega-menu.solution-cards` | `sections/solutions.tsx` + `solution-dialog.tsx`, `solution-software|ai|cloud`; `iso/scenes/{delivery,product,cloud}-visual.tsx`; `components.md` §8 |
| `components.cases-grid`, `case-card`, `case-media` | `sections/cases.tsx`, `glow-stripes`; `components.md` §9 (las escenas de clientes reales son contenido del sitio) |
| `components.research-grid`, `research-row`, `research-card` | `sections/research.tsx`; `components.md` §10 |
| `components.cta`, `not-found`, `footer` (+ `credentials`, `ai-summary`) | `sections/cta-band.tsx`, `app/not-found.tsx`, `layout/footer.tsx`, `sections/ai-summary.tsx`; `components.md` §11–13 |
| `motifs.blue-steps`, `module-field`, `glow`, `card-glow`, `section-glow`, `isometric` | utilidades `blue-steps`, `module-field*`, `glow-stripes`, `card-glow*`, `section-glow`; `references/motion.md` §2; `references/isometric.md` |
| §3 reglas tipográficas (mono opt-in, sin eyebrows, sin numeración), §4, §5, §6 (fotografía, íconos), §9 Do and Don't | SKILL reglas 13, 21–24; `components.md` |
| §8 accesibilidad (tabla de contraste, foco devuelto, targets) | `scripts/check-system.py` (34 pares), `focus-ring[data-focus-returned]`, SKILL reglas 7 y 25 |
| §12 implementación, §13 i18n | `references/i18n.md`, `templates/i18n/` (rutas, proxy, metadata, formato, pruebas), `site-starter/src/lib/tokens.ts` (generado) |
| `docs/TRANSFERENCIA-CLAUDE.md` (método de trabajo, riesgos) | SKILL regla 28 |

**Fuera del plugin a propósito (contenido u operación del sitio, no del sistema):** los clientes reales, sus logotipos y sus escenas de producto (Procesar, Jostens, TSE, Credicomer) y la ventana de navegador de la propuesta 3 del hero
(basada en la consola de Procesar); las respuestas de la FAQ, los títulos de investigación y las cifras de ejemplo; los archivos de certificaciones; la URL de revisión y el despliegue en Vercel; el cerebro de marketing. El plugin usa marcadores y exige
autorización antes de publicar un cliente.

**Pendiente de decisión de marca (igual que en la referencia):** isotipo y tagline sin aprobar (el plugin usa solo el logotipo); favicon provisional; el partner de Webflow del último badge del footer.

## Cómo actualizar

1. Clona o actualiza el repositorio del sitio. **No compares solo el change log: repite la auditoría de frontmatter y de las secciones 1 a 13 contra la tabla de arriba** (así se quedó el plugin atrás antes: solo se adoptaba lo que cambiaba desde el último commit).
2. Aplica lo que sea genérico (tokens, utilities, reglas) a `templates/tokens.css` y a las referencias; `python3 scripts/build-docs.py` regenera las copias.
3. Cambia la versión y el commit de esta tabla, y el encabezado de `SKILL.md`, `README.md` y `tokens.css`.
4. `python3 scripts/check-design-source.py` dice si la referencia se movió desde el commit fijado (informativo; `--strict` sale con código 1).
