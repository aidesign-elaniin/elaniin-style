# Tailwind API / API de Tailwind

Inventario completo **clase → token → valor → uso** del sistema Elaniin en Tailwind v4.
Fuente de verdad: `templates/tokens.css` (copiado inline en los 3 templates — mantener
sincronizados al editar).

## Contrato (3 reglas, sin excepciones)

1. **Todo valor de diseño vive en `@theme`** — o en `:root` cuando es una variable de
   layout/duración consumida por una utility (las theme keys solas **no** generan
   `duration-*`).
2. **Todo recurso con nombre es `@utility`.** Selectores de clase "pelados" dentro de
   `<style>` plano están prohibidos: son invisibles para la API de utilities.
3. **Las animaciones son tokens:** `--animate-*` + `@keyframes` **dentro de `@theme`**
   (así nacen las `animate-*`); cada utility de motion lleva su propio override
   `prefers-reduced-motion`. Duraciones **nombradas**: `duration-instant|fast|base|slow|reveal`
   — nunca `duration-200`.

> ⚠️ **Gotcha `@tailwindcss/browser`:** nunca aparezca el literal del directive de import
> dentro del bloque `text/tailwindcss` (ni siquiera en comentarios) — rompe el compile del
> CDN y solo se emiten las variables de `:root`.

**Verificación (CLI):**
```bash
{ echo '@import "tailwindcss";'; echo '@source "./archivo.html";'; cat bloque.css; } > in.css
npx @tailwindcss/cli -i in.css -o out.css && grep -c '.rise{' out.css
```
El CLI solo compila lo que detecta en el `@source`; el browser CDN escanea el DOM.

---

## Theme tokens → utilities generadas

### Colores
| Token | Valor | Uso |
|---|---|---|
| `elevate-blue` | `#1054ff` | Acento de detalle <5% (botones, links, focus, activo) |
| `inspire-grey` | `#f0f0f3` | Superficie alterna |
| `excellence-blue` | `#01172e` | Bandas oscuras, CTA, footer, code |
| `elaniin-black` | `#141414` | Wordmark, texto primario |
| `dynamic-blue` | `#4d75fd` | Solo acentos no-texto |
| `blue-100…900` | ramp `#d7e2f8 → #01172e` | Escala azul (steps, hover/active states) |
| `blue-tint-50` | `#e7eeff` | Fondo tinte azul (burbujas de chat, info-bg) |
| `text-primary/secondary/muted` | `#141414 / #4a4d57 / #656873` | Jerarquía de texto en claro |
| `text-link` / `text-link-hover` | `#1054ff / #0848cc` | Links |
| `text-on-dark(-secondary/-muted/-accent)` | `#fff / #a9b8cc / #8ea0b8 / #7b9bff` | Texto sobre navy |
| `text-disabled` | `#8c8f9b` | Disabled |
| `surface-page/card/subtle` | `#fff / #fff / #f0f0f3` | Fondos |
| `surface-dark/dark-alt/code` | `#01172e / #141414 / #01172e` | Fondos oscuros |
| `surface-dark-card` | `rgba(255,255,255,.04)` | Cards sobre navy |
| `border-default/strong/input/ink` | `#e4e4ea / #d3d4dc / #8c8f9b / #141414` | Hairlines |
| `border-on-dark(-strong)` | `rgba(255,255,255,.12 / .24)` | Hairlines en navy |
| `success-* / warning-* / error-* / info-* / neutral-*` | text·bg·border·dot | Estados (solo estado, nunca decoración) |

Classes: `bg-elevate-blue`, `text-text-muted`, `border-border-default`,
`hover:bg-blue-600`, `text-success-text`, `bg-success-bg`, `border-success-border`, etc.

### Tipografía
| Token | Valor (movil→desktop) | Utility |
|---|---|---|
| `font-display` | Instrument Sans | `font-display` |
| `font-text` | DM Sans (body default) | `font-text` |
| `font-mono` | Geist Mono | `font-mono` / `mono-label` |
| `text-display-xl` | `clamp(38px, 6.25vw - 16px, 64px)` ls -0.035em | `text-display-xl` |
| `text-tag-sm` | 11px, lh 1 (tag pequeño oficial, con `mono-label`) | `text-tag-sm` |
| `text-display-lg` | `clamp(36px, 3.906vw + 6px, 56px)` ls -0.03em | `text-display-lg` |
| `text-h1 … text-h4` | clamp 32→48 · 28→36 · 22→28 · 20→22 | `text-h1` … `text-h4` |
| `text-lead` | 18→20 | `text-lead` |
| `text-body-lg / body / body-sm` | 17→18 / 16 / 14 | `text-body-lg`, `text-body`, `text-body-sm` |
| `text-caption / code / button / button-lg` | 13 / 13 / 14 / 16 | `text-caption` … |

> Fuera de escala: los tamaños arbitrarios solo se permiten donde el diseño de referencia
> lo exige (`text-[32px]`, `text-[40px]` en cifras de KPI del dashboard, deck y report). `28px` ya es `text-h3`: úsalo.

### Layout (`:root`, responsive en 1023/767)
| Token | valor · tablet · móvil | Utility |
|---|---|---|
| `--container-max` | 1280px | `container-site` (max + gutter + center) |
| `--gutter` | 48 · 32 · 20 | (dentro de `container-site`) |
| `--grid-gap` | 24 · — · 16 | (gap-* de proyecto) |
| `--section-y` / `-statement` / `-compact` | 96/128/64 · 72/96/48 · 56/72/40 | `section-y`, `section-y-statement`, `section-y-compact` |
| `--card-padding` | 32 · — · 24 | `pad-card` |
| `--nav-height` | 64 | — |

### Radios · Sombras
| Token | Valor | Utility |
|---|---|---|
| `radius-button/input/tag/tooltip` | 6px | `rounded-button`, `rounded-input`, … |
| `radius-card/media/code` | 12px | `rounded-card` |
| `radius-menu / modal / device / full / module` | 8 / 16 / 32 / 9999 / 2 | `rounded-menu` … |
| `shadow-card-rest / menu / product` | hairline / flotante / elevación | `shadow-card-rest`, `shadow-menu`, `shadow-product` |
| `shadow-focus / focus-on-dark` | doble anillo | (vía `focus-ring`) |

### Motion
| Token | Valor |
|---|---|
| `ease-standard` | `cubic-bezier(.4,0,.2,1)` |
| `ease-emphasized` | `cubic-bezier(.25,1,.5,1)` |
| `--dur-instant/fast/base/slow/reveal` | 100 · 150 · 200 · 300 · 500 ms (`:root`) |
| `--reveal-distance` / `--reveal-stagger` | 16px / 60ms |
| `animate-rise` | `rise 500ms ease-emphasized both` |
| `animate-draw-line` | `draw-line 1.6s ease-emphasized .25s both` |
| `animate-float-chip` | `float-chip 4s ease-in-out infinite` |
| `animate-typing-dot` | `typing-dot .9s ease-in-out infinite` |
| `animate-spin-slow` | `spin-slow .9s linear infinite` |
| `animate-ping-soft` | `ping-soft 1.8s cubic-bezier(0,0,.2,1) infinite` |
| `animate-sheen` | `sheen 5s linear infinite` |

---

## Utilities (`@utility`)

### Layout & tipo
| Clase | Qué hace |
|---|---|
| `mono-label` | mono + uppercase + ls .05em (labels de dato, statuses; **nunca** sobre un heading) |
| `container-site` | max 1280 + gutter + center |
| `section-y` / `-statement` / `-compact` | padding-block de sección |
| `pad-card` | padding de card (responsive) |

### Focus & duraciones
| Clase | Qué hace |
|---|---|
| `focus-ring` / `focus-ring-on-dark` | anillo doble en `:focus-visible` |
| `duration-instant/fast/base/slow/reveal` | `transition-duration` nombrada |

### Entrada (stagger con `style="--i: n"`)
| Clase | Qué hace | Reduce |
|---|---|---|
| `rise` | animación time-based (sin esperar JS) | `animation: none` |
| `reveal` | scroll: oculto solo si `html.js`; IO añade `.is-visible` | forzado visible + `transition: none` |
| `draw-line` | SVG `stroke-dashoffset` con `style="--len: N"` | offset 0 estático |

> Requiere `<script>document.documentElement.classList.add('js')</script>` en el head
> (landing/dashboard). Sin JS el contenido **siempre** es visible.

### Superficies de card
| Clase | Qué hace |
|---|---|
| `card-hover` | único hover de una card: `border-default` → `border-strong` (150 ms) |
| `card-glow` | resplandor azul estático para cards sobre Excellence Blue (3 manchas) |
| `card-glow-quiet` | el mismo, más oscuro, para cards sobre Elaniin Black |

> **`@theme static`:** el bloque principal de tokens es *static*: todas las variables se emiten aunque
> ninguna utilidad las use, para que estilos en línea y JS puedan usar `var(--color-*)`. Sin `static`,
> Tailwind v4 las poda y un `var()` ausente se renderiza negro (pasó con el isométrico).

### Recursos isométricos
| Clase | Qué hace |
|---|---|
| `iso-levitate` | toda la pieza flota 6px, 3s (alternate); la sombra se queda en el suelo |
| `iso-float` | una etiqueta flota 4px, 2s, desfasada con `style="--d: n"` (delay = `--d × 400ms`) |

Ambas con `animation: none` bajo reduced-motion. Reglas, geometría y receta: `references/isometric.md`.

### Textura firma — module field (hero / CTA)
| Clase | Qué hace |
|---|---|
| `module-field` | cuadrícula 2px/16px (`--module-size`, `--module-pitch`), gris 45%, máscara hacia abajo; el rastro (canvas) lo pinta `templates/module-field.js` |
| `module-field-dark` | cuadritos `border-on-dark-strong` para bandas oscuras |
| `module-field-mask-left` / `-mask-none` | desvanece a la izquierda / sin máscara |

Host: `relative isolate overflow-hidden`; contenido `relative`. Marcar con `data-module-field`
y `aria-hidden="true"`. Rastro apagado en táctil y con reduced-motion.

> **Regla de padding:** `card-hover` crea una superficie al hacer hover. El elemento
> **siempre** lleva `rounded-card border border-border-default bg-surface-card pad-card`
> (mínimo `p-6`). Nunca texto pegado al borde ni márgenes negativos para compensar.
> Auditoría rápida: `grep -n -E 'class="[^"]*card-hover' archivo.html | grep -v -E 'pad-card|p-[68]'` debe salir vacío.

### Grids
| Clase | Qué hace |
|---|---|
| `gap-grid` | `gap: var(--grid-gap)` (24px; 16px en móvil) |
| `grid-page` | 12 columnas + gap; hijos `col-span-12 md:col-span-N` |
| `grid-auto` | `auto-fit` con `--card-min` (16rem, override con `style="--card-min:14rem"`) |
| `grid-hairline` | celdas con líneas de 1px compartidas + borde/radio; usar con `grid-cols-N` y `pad-card` |

Recetas y reglas: `references/grids.md`.

### Navegación móvil — drawer
| Clase | Qué hace |
|---|---|
| `drawer` | Panel off-canvas `<lg` (ancho `--drawer-width`, 85vw máx.; cerrado = `visibility:hidden`); a `lg+` queda **fijo** (`sticky`, `100dvh`) con `--sidebar-width`; solo el contenido scrollea. Se abre con `data-open="true"` |
| `scrim` | Telón oscuro 48% bajo el drawer; oculto a `lg+`. `data-open="true"` lo muestra |

Para un menú móvil de landing: `drawer md:hidden` + `scrim md:hidden` + `data-drawer-from="md"`.
Comportamiento en `templates/drawer.js` (marcadores `data-menu-button`, `data-drawer`,
`data-scrim`, `data-menu-close`).

### Interacciones
| Clase | Qué hace |
|---|---|
| `nav-link` | opción A: underline 2px `scaleX` desde la izquierda al hover/focus (por defecto en landing y footer) |
| `max-w-body` · `max-w-lead` · `max-w-narrow` · `max-w-heading` · `max-w-hero` · `max-w-cta` | medidas de línea como tokens: 68 · 56 · 40 · 20 · 18 · 34 ch (`--container-*` en `@theme`). Sustituyen a `max-w-[68ch]` y similares |
| `nav-bar` | barra sticky de `--nav-height`: blanco al 80 % bajo blur 8px; con `data-theme="dark"` (+ `data-tone="black"`) adopta el color de la sección (Excellence Blue u Elaniin Black al 80 %). Script: `templates/nav-theme.js` |
| `nav-item` | enlace o disparador de la barra, el de la referencia principal: pill 40px, `body-sm` 500 en fuente display, `surface-subtle` al hover (blanco 10 % sobre oscuro) |
| `nav-toggle` | botón hamburguesa de 40px bajo `lg` (borde `border-strong`) |
| `nav-logo-light` / `nav-logo-dark` | dos logotipos en la barra: oscuro sobre claro, blanco sobre los temas oscuros |
| `footer-link` | enlace del pie: `body-sm`, `on-dark-secondary`, blanco al hover, sin subrayado |
| `footer-social` | botón de red social de 40px con borde `border-on-dark` y blanco 8 % al hover |
| `btn-arrow` | `svg` `translateX(4px)` al hover (sin scale al active) |
| `row-hover` | respuesta de fila en tablas |

### Living loops (mockups vivos — ver `motion.md` §Living mockups)
| Clase | Qué hace | Reduce |
|---|---|---|
| `typing-dots` | 3 puntos rebotando (`<span><i></i><i></i><i></i></span>`) | estático |
| `float-chip` | badge con flotación ±4px | estático |
| `spinner` | arco girando 0.9s | estático |
| `live-dot` | punto + ping (`--animate-ping-soft`) | sin ping |

### `@layer base` (declarado una vez en tokens)
`html`: scroll-behavior smooth · `body`: fondo `surface-page`, texto `text-primary`,
font `font-text` 16/1.5, `overflow-x: clip` · `::selection` azul · `:focus-visible`
anillo global · reduce → scroll auto. (Dashboard añade `body { background: surface-subtle }`.)

---

## Extras por template (inline, tras el bloque de tokens)

| Template | Utility | Nota |
|---|---|---|
| `landing.html` | `pipeline` | grid 4 col; `li::before` nodo, `li::after` conector; estados `data-state="idle|active|done"` (idle = base, sin regla) |
| `dashboard.html` | `side-link`, `field`, `switch` | `side-link` (nav con `aria-current="page"`), `field` (input/select 44px), `switch` (checkbox `role="switch"`); router por hash + vistas, ver `dashboards.md` |
| `site-starter/` (Next.js) | mismos tokens (`styles/tokens.css`), `LinkButton`, `Nav`/drawer, `Hero`, `FeatureGrid`, `CtaBand`; metodología en `site-architect.md` |
| `deck.html` | `stage`, `deck`, `slide` (+`.active/.dark/.grey`), `slide-spot`, `nav-dots`, `hud`, `phone-frame` (bisel como overlay `::after`), `phone-sheen`, `phone-track` (padding de pantallas) | + `@theme` extra: `--animate-phone-swipe` (9s infinite); overrides base: `html,body height:100%`, `body` navy + `overflow:hidden` |

---

## Migración desde CSS crudo (cheat sheet)

| CSS crudo (prohibido) | Utility |
|---|---|
| `font-[family-name:var(--font-display)]` | `font-display` |
| `text-[13px] / [14px] / [15px] / [16px] / [18px]` | `text-caption / body-sm / body-sm / body / body-lg` |
| `text-[20px] tracking-[-0.02em]` (report) | `text-h4` |
| `duration-200` | `duration-base` |
| `rounded-[6px] / rounded-[12px]` | `rounded-button / rounded-card` |
| `shadow-[var(--shadow-menu)]` | `shadow-menu` |
| `text-[#4a4d57] / #656873 / #141414 / #8c8f9b` | `text-text-secondary / muted / primary / disabled` |
| `text-[#a9b8cc] / #8ea0b8 / #7b9bff` | `text-text-on-dark(-secondary/-muted/-accent)` |
| `border-[#e4e4ea] / #d3d4dc / #8c8f9b / [rgba(255,255,255,.12)]` | `border-border-default / strong / input / on-dark` |
| `bg-[#1054ff]` + `hover:bg-[#0848cc]` + `active:bg-[#023ca0]` | `bg-elevate-blue` + `hover:bg-blue-600` + `active:bg-blue-700` |
| `bg-[#f0f0f3] / #d7e2f8 / #e7eeff` | `bg-surface-subtle / bg-blue-100 / bg-blue-tint-50` |
| status `text/bg/border-[#…]` | `text-success-text`, `bg-success-bg`, `border-success-border` (igual warning/error/info) |
| `tabular` | `tabular-nums` (core) |


## Primitivas y motivos añadidos en v1.87 (DESIGN.md `components.*` y `motifs.*`)

| Utilidad | Qué hace | Referencia |
|---|---|---|
| `card-hover` | borde `border-default` → `border-strong` al hover (el único hover de una card) | `components.md` §0 |
| `card-glow` / `card-glow-quiet` | resplandor azul ESTÁTICO dentro de cards oscuras (Excellence Blue / Elaniin Black) | `motion.md` §2 |
| `card-featured` | borde 2 px excellence-blue (una por grupo como máximo) | §0 |
| `tag`, `tag-brand`, `tag-on-dark`, `tag-sm` | tag mono UPPERCASE 24 px (variantes por `--tag-*`); `tag-sm` = 20 px / 11 px (oficial) | §0 |
| `status-badge` + `badge-success|warning|error|info|neutral` | badge con punto de 6 px; solo estado | §0 |
| `link-text` | enlace en texto corrido: Elevate Blue, subrayado 1 px / offset 3 px | §0 |
| `field`, `field-on-dark` | input / select / textarea de 44 px con `border-input` y foco azul (`aria-invalid="true"` = error) | §0 |
| `product-frame` | marco de producto: radio 12, borde, `shadow-product` | §0 |
| `code-block`, `code-comment`, `code-accent` | superficie de código y sus spans | §0 |
| `icon-box`, `icon-box-dark` | cuadro de 40 px para un ícono | §0 |
| `dark-band`, `dark-band-black` | banda a ancho completo, Excellence Blue / Elaniin Black | §0 |
| `metric-value`, `metric-label` | cifra display 36 px tabular + etiqueta | §0 |
| `menu-panel`, `menu-item` | dropdown (radio 8, `shadow-menu`) y su ítem de 36 px | §0 |
| `tooltip` | Elaniin Black, caption blanco, radio 6 | §0 |
| `tab` | pestaña con indicador de 2 px Elevate Blue (`aria-selected="true"` o `data-active`) | §0 |
| `accordion-panel` | respuesta de FAQ: filas 0fr → 1fr en 300 ms; cerrada = `visibility: hidden`; `data-open` la abre | §6 |
| `mono-detail` | mono 13 px normal case, **opt-in** | `tokens.md` |
| `hero-fill` | desde 1280 px el hero mide al menos la altura de pantalla bajo la barra, contenido centrado | §2 |
| `solution-software`, `solution-ai`, `solution-cloud` | las tres superficies de solución (patrón + glow) compartidas por nav, grid y diálogo | §8 |
| `engage-row`, `engage-card` | cards expandibles de engagement (flex-grow 1 → 2.4 en 300 ms; apiladas bajo 1024 px) | §4 |
| `blue-steps` | el motivo azul escalonado (único gradiente de tope duro; ≤240 px, uno por página) | `motion.md` §2 |
| `glow-stripes` + `glow-media` / `glow-cta` | glow azul animado (franjas de 115°, 706.16 px por repetición); solo CTA, etapa de casos y canvas de Blue Engine | `motion.md` §2 |
| `section-glow` + `glass` | manchas azules que derivan tras un panel `glass` (audience routes) | `motion.md` §2 |
| `module-field-mask-center` | el module field con el centro despejado (CTA de cierre) | §11 |
| variante `touch:` | `@custom-variant touch (@media (hover: none))` para dispositivos sin hover | §7 |
| tokens de medida | `max-w-narrow` 40ch · `max-w-hero` 18ch · `max-w-cta` 34ch · `max-w-statement` 22ch · `max-w-title` 14ch | `tokens.md` |
| radios | `rounded-bento-outer` 12 · `rounded-app-icon` 18.5 % | `tokens.md` |

**Retiradas (v1.87):** `spotlight`, `lift` y el `card-glow` que seguía al puntero. Hover = color, fondo o borde, 150 ms; sin lift, sin scale, sin glow (DESIGN.md §7).
