# Motion / Movimiento

> Idioma de movimiento de Elaniin: contenido primero, motion como acento.
> Presets listos: `templates/motion-presets.ts`. CSS ladder: `templates/tokens.css`.

## Escalera de motion (obligatoria)

1. **CSS first.** Keyframes `rise` (16px up + fade, 500ms, `ease-emphasized`). Stagger con
   `style={{ "--i": n }}` → delay `calc(var(--i) * 60ms)`. Corre sin esperar hidratación.
2. **`motion` (v14) solo para coreografía interactiva:** whileInView con stagger de
   contenedores, page transitions, gestos, layout animations.
3. **Nunca** pidas instalar `motion` al usuario. Ejecuta `scripts/ensure-motion.sh`
   (silencioso, detecta lockfile) o quédate en la escalera CSS.

## Presets

| Nombre | Uso |
|---|---|
| `reveal` | Entrada estándar: opacity 0→1, y 16→0, 500ms emphasized, once. |
| `revealStaggerParent` / `revealStaggerChild` | Padre que apila hijos cada 60ms. |
| `hoverLift` | Cards: y −4px, 200ms standard. |
| `pageTransition` | in/out de rutas: ±8px + fade, 300ms standard. |
| `ease.standard` | `cubic-bezier(0.4,0,0.2,1)` — micro-interacciones UI. |
| `ease.emphasized` | `cubic-bezier(0.25,1,0.5,1)` — entradas, reveals. |

Duraciones: `instant 100 · fast 150 · base 200 · slow 300 · reveal 500` ms.

## Reglas

- **Contenido nunca bloqueado:** el texto y los datos deben ser legibles con animation off.
- **`prefers-reduced-motion: reduce`:** desactiva `rise`, glow, y todos los transforms de
  `motion` (en el sitio: `<MotionConfig reducedMotion="user">`). El contenido queda estático y completo.
- **Movimiento con propósito:** reveal (entrada), stagger ( jerarquía de datos), hoverLift
  (respuesta a pointer). Nada de parallax decorativo infinito (excepto el glow motif, que
  es transform-only y se detiene con reduced-motion).
- **Glow motif (`glow-scroll`, recurso del sitio, no incluido en los templates):** solo diagonales azules que scrollean horizontalmente en el
  CTA final; `transform: translate3d` puro (compositor); estático con reduced-motion.
- **Rendimiento del glow (v1.69.4):** el desenfoque (`blur`) del grupo de franjas solo se aplica desde
  1024px (en teléfonos, blur sobre capas en movimiento hacía tartamudear); bajo 768px se omite la
  tercera tesela de cada capa. Solo anima `transform`, timing lineal.
- **Deck:** transiciones de slide 200–300ms, sin ken-burns ni partículas.
- **Dashboard:** contadores animados bien; gráficos animan entrada una vez, no en loop.

## Living surfaces — texturas reactivas + microinteractions (obligatorio)

**Toda propuesta Elaniin debe estar viva.** Una pieza estática no entrega. Mínimo
obligatorio en cada landing, dashboard, deck y reporte:

### 0 · Module field — la textura firma (hero y CTA)
Cuadrícula de cuadritos (2px sobre 16px de pitch, `border-strong` al 45%) que se desvanece
hacia abajo; cerca del puntero los cuadritos se encienden **celda por celda** subiendo la
rampa `blue-300 (2px) → blue-400 (3px) → blue-500 (3px)` y se apagan en ~260ms. Portada de
`elaniin-2027-website-main/src/components/sections/hero/module-field.tsx`.

- **Reposo = CSS puro** (`@utility module-field`, conic-gradient; sin JS ni imagen).
- **Rastro = canvas** (`templates/module-field.js` vanilla, o `templates/module-field.tsx`).
  Apagado en táctil (`pointer: coarse`) y con `prefers-reduced-motion` (queda la cuadrícula).
- **Dónde:** fondo del hero y del CTA final; una por sección; nunca tras texto largo ni
  dentro de cards. Sin glows ni degradados encima (el hero es de cuadrados).

```html
<section class="relative isolate overflow-hidden section-y">
  <div class="module-field" data-module-field aria-hidden="true"></div>
  <div class="container-site relative">…</div>
</section>
<!-- banda oscura -->
<div class="module-field module-field-dark module-field-mask-left" data-module-field aria-hidden="true"></div>
```
Variantes: `module-field-dark` (cuadritos blancos), `module-field-mask-left` (desvanece a la
izquierda), `module-field-mask-none`. Tokens: `--module-size` 2px · `--module-pitch` 16px.

### 1 · Sin spotlight ni glow en hover (DESIGN.md §7)
Hover y focus cambian **solo color, fondo y borde**, 150ms, easing estándar. No hay spotlight que siga
al puntero, ni glow que siga al puntero dentro de la card, ni lift, ni scale. (v1.87 retira `spotlight` y
`lift`; `card-glow` ahora es el resplandor ESTÁTICO de las cards oscuras.) La única textura reactiva
al puntero es el `module-field`.

### 2 · Resplandores permitidos (todos estáticos o de deriva lenta, solo `transform`)
| Utilidad | Dónde | Detalle |
|---|---|---|
| `card-glow` | card sobre Excellence Blue | 3 manchas: blue-700 80 % arriba-derecha, blue-600 60 % a la izquierda, blue-700 100 % abajo-derecha. Dentro de la card, detrás del contenido |
| `card-glow-quiet` | card sobre Elaniin Black | blue-800 70 % abajo-derecha + blue-700 25 % arriba-izquierda; el texto conserva >9:1 |
| `section-glow` + `glass` | sección *audience routes* | 3 manchas radiales que suben desde abajo y derivan 17–25 s (`glow-drift`); solo se leen a través de `glass` (blanco 55 % + blur) |
| `glow-stripes` (`glow-media`, `glow-cta`) | etapa de la card de caso, CTA de cierre, canvas de Blue Engine | franjas de 115° que se desplazan un repeat (706.16 px) en bucle sin costura; capa azul 16 s, capa de superficie 6 s; blur 12 px solo desde 1024 px |
| `blue-steps` | un motivo por página | barra escalonada, ≤240 px de alto, alineada al módulo, nunca detrás de texto |
| `accent-flow` | las palabras destacadas del titular del hero | único gradiente sobre texto; tono más claro blue-400 |

### 3 · Microinteracciones mínimas
| Elemento | Microinteraction |
|---|---|
| Link / botón terciario con flecha | `→` se desplaza +4px en X al hover (`btn-arrow`); sin `scale` al `:active` |
| Card | `card-hover`: el borde pasa de `border-default` a `border-strong`; sin lift |
| KPI / número grande | Count-up al entrar en viewport (`IntersectionObserver`), **una sola vez** (60 % visible) |
| Chart (SVG) | Línea se dibuja con `stroke-dashoffset` al entrar en viewport |
| Nav | `nav-item`: superficie `surface-subtle` al hover |
| Slide de deck | stagger `rise` del contenido |
| Input | Border elevate-blue + focus-ring al focus |

### 4 · Reglas
- **Superficie al hover = card con padding.** `pad-card` + `rounded-card` + borde.
- Todo lo anterior se desactiva con `prefers-reduced-motion: reduce` (queda el estado final; los fades de opacidad ≤150 ms se conservan).
- Performance: solo `transform`, `opacity`, `background-position` (compositor);
  nunca animar `top/left/width/height`.
- Reveal: fade + 16 px de subida, 500 ms, easing emphasized, stagger 60 ms, una vez (15 % en viewport). Paneles y menús: 200–300 ms emphasized.
- En Artifacts: la escalera CSS + JS inline basta; `motion` solo si hay coreografía compleja.

## Living mockups (loops) / Mockups vivos (loops)

**Obligatorio: cada template lleva ≥1 mockup en loop** — un fragmento de UI que corre
solo, da la impresión de producto vivo y se detiene cuando nadie lo mira.

### Técnica A · CSS loop infinito (preferida)
- `@keyframes` + `--animate-*` **dentro de `@theme`** (así nace la utility `animate-*`);
  la utility que consume la animación declara su **propio** override
  `@media (prefers-reduced-motion: reduce) { animation: none }`.
- Solo `transform`/`opacity`; el loop nunca compite con el texto (esquina, fondo,
  `aria-hidden="true"`).
- Inventario: `typing-dots` (burbujas de chat), `float-chip` (badge ETA flotante),
  `spinner`, `live-dot` (ping de dato en vivo), `sheen` (brillo sobre el bisel del phone-frame, utility `phone-sheen`),
  `phone-track` (swipe de pantallas en el deck).

### Técnica B · JS clock gated por IntersectionObserver
- rAF o `setInterval` que **solo corre** cuando el bloque está en viewport
  (threshold ≥ 0.3) y se **pausa al salir** (cancelAnimationFrame / clearInterval);
  así ninguna demo consume CPU en segundo plano.
- Bajo `reduce`: **no se crea el clock** — se pinta el estado final
  (`data-state="done"`, status `Deployed ✓`, valor KPI ya formateado).
- Dedupe de renders: solo aplicar cambios cuando cambia la fase/valor (nada de
  re-escribir el DOM en cada tick).
- Uso actual: **landing** → reloj de pipeline CI (Build→Test→Review→Deploy,
  `PERIOD 7000ms / STEP 1400ms`, rAF, pausable); **dashboard** → KPI vivo
  (drift `+0.1…0.7k` cada 7s con tween + re-trigger de `draw-line` en el chart).

### Técnica D · Escena isométrica con reloj
Un reloj de 12 s (JS, cada 50 ms, solo en pantalla) deriva todo el movimiento de una escena isométrica
(pulsos, brazos, deslizamientos, opacidades) y lo escribe en atributos SVG; solo `rise`, `iso-levitate` e
`iso-float` son CSS. Bajo reduced-motion el reloj queda en el estado ensamblado. Ver `references/isometric.md`.

### Técnica C · Mockup de pasos (tutoriales de instalación o de uso)
Cuando una card explica una acción de interfaz, lleva arriba un **mockup ilustrado en loop**
de esa acción (cursor que se mueve, clic, resultado). Se hace con una pequeña máquina de estados:
cada elemento declara `data-on="N"` (y opcional `data-off="M"`) y el escenario `data-mock` avanza
1 paso por segundo; el cursor sigue `data-path="x%,y%|x%,y%|…"` y el texto que se “escribe” usa
`data-type`. Utilities: `mock-stage`, `mock-fade`, `mock-active`, `mock-press`, `mock-switch`,
`mock-cursor`, `mock-caret`. Reglas: `aria-hidden="true"`; solo corre mientras está en pantalla
(IntersectionObserver); con `prefers-reduced-motion` se pinta el **estado final** una vez, sin cursor;
UI genérica en tokens Elaniin, nunca una copia de la marca ajena. Ejemplo vivo: los 6 pasos del
landing de instalación (`scripts/build-docs.py`).

### Reduce → estado final
| Técnica | Bajo `prefers-reduced-motion: reduce` |
|---|---|
| A · CSS loop | `animation: none` → último estado estático |
| B · JS clock | sin interval; dibujar estado final (done / valor exacto) |

### Por template
| Template | Loop vivo | Técnica |
|---|---|---|
| `templates/landing.html` | Sección *How we ship*: pipeline CI con nodos y status | B (utility `pipeline`) |
| `templates/dashboard.html` | `live-dot` + Revenue en deriva + redibujado del chart | B + A (el punto) |
| `templates/deck.html` | Phone de 4 pantallas swiping + chip ETA + spinner/typing | A (utility `phone-track`) |

Ver también: `references/tailwind-api.md` (inventario de clases) y el contrato
"todo recurso = `@theme`/`@utility`" del encabezado de `templates/tokens.css`.

## Ejemplo CSS (Artifacts / standalone)

```css
@keyframes rise {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: none; }
}
.rise {
  animation: rise 500ms cubic-bezier(0.25,1,0.5,1) both;
  animation-delay: calc(var(--i, 0) * 60ms);
}
@media (prefers-reduced-motion: reduce) {
  .rise { animation: none; }
}
```

## Ejemplo motion (proyecto con npm)

```tsx
"use client";
import { motion } from "motion/react";
import { reveal, revealStaggerParent, revealStaggerChild } from "./motion-presets";

<motion.div {...reveal}>
  <h2>…</h2>
</motion.div>

<motion.div {...revealStaggerParent}>
  {items.map((it, i) => (
    <motion.div key={it.id} {...revealStaggerChild}>{it.label}</motion.div>
  ))}
</motion.div>
```
