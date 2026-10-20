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
