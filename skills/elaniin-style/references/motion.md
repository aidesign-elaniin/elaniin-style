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
- **Glow motif (`glow-scroll`):** solo diagonales azules que scrollean horizontalmente en el
  CTA final; `transform: translate3d` puro (compositor); estático con reduced-motion.
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

### 1 · Spotlight reactivo al mouse
Radial-gradient sutil que sigue al cursor vía CSS vars.

```css
.spotlight {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background: radial-gradient(560px circle at var(--mx, 50%) var(--my, 40%),
    rgba(77, 117, 253, 0.07), transparent 65%);
}
@media (prefers-reduced-motion: reduce) { .spotlight { display: none; } }
```

```js
addEventListener('mousemove', (e) => {
  document.documentElement.style.setProperty('--mx', e.clientX + 'px');
  document.documentElement.style.setProperty('--my', e.clientY + 'px');
}, { passive: true });
```

### 2 · Card glow que sigue al mouse
```js
card.addEventListener('pointermove', (e) => {
  const r = card.getBoundingClientRect();
  card.style.setProperty('--cx', (e.clientX - r.left) + 'px');
  card.style.setProperty('--cy', (e.clientY - r.top) + 'px');
});
```
```css
.card-glow { position: relative; overflow: hidden; }
.card-glow::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(240px circle at var(--cx, 50%) var(--cy, 50%),
    rgba(16, 84, 255, 0.06), transparent 70%);
  opacity: 0; transition: opacity 200ms var(--ease-standard);
}
.card-glow:hover::after { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .card-glow::after { display: none; } }
```

### 3 · Microinteractions mínimas
| Elemento | Microinteraction |
|---|---|
| Botón con flecha | `→` se desplaza +4px en X al hover; `scale(0.98)` al `:active` |
| Card | `translateY(-4px)` al hover + card glow |
| KPI / número grande | Count-up al entrar en viewport (`IntersectionObserver`) |
| Chart (SVG) | Línea se dibuja con `stroke-dashoffset` al entrar en viewport |
| Link de nav | Underline 2px que entra desde la izquierda (`scaleX` + origin-left) |
| Slide de deck | Spotlight por slide + stagger `rise` del contenido |
| Input | Border elevate-blue + focus-ring al focus |

### 4 · Reglas
- Todo lo anterior se desactiva con `prefers-reduced-motion: reduce`.
- Performance: solo `transform`, `opacity`, `background-position` (compositor);
  nunca animar `top/left/width/height`.
- El spotlight no compite con el contenido: opacidad ≤ 8%, detrás del texto (`z-index` bajo).
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
  `spinner`, `live-dot` (ping de dato en vivo), `sheen` (brillo del phone-frame),
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
