# UX & Accessibility / UX y Accesibilidad

> Insumos: `ux_ui_a11y_skill.md`, `Revisor_Estados_Botones.md`. Aplica a todos los modos.

## Estados de interacción (todo elemento interactivo)

| Estado | Regla |
|---|---|
| **rest** | Token base. Nunca "casi invisible". |
| **hover** | Cambio real (fill, border, o color de texto). Botón primario: elevate-blue → blue-600. |
| **active / pressed** | blue-700 en primario; translateY(1px) o sombra reducida. |
| **focus** | `focus-ring` siempre visible con teclado. Nunca `outline: none` sin reemplazo. |
| **disabled** | Text `disabled #8C8F9B`, sin hover, `cursor: not-allowed`, contraste ≥ 3:1. |
| **loading** (botones) | Spinner o texto "…", **mismo ancho** que el estado rest (sin layout shift). Bloquea re-click. |

### Focus ring
- Claro: `box-shadow: 0 0 0 2px #FFF, 0 0 0 4px #1054FF`.
- Oscuro: `0 0 0 2px #01172E, 0 0 0 4px #7B9BFF`.
- Utilidades listas: `focus-ring`, `focus-ring-on-dark` en `tokens.css`.

## Contraste (WCAG 2.2 AA)

| Elemento | Mínimo |
|---|---|
| Texto cuerpo | 4.5:1 |
| Texto grande (≥24px o 19px bold) | 3:1 |
| Controles UI y bordes de input | 3:1 → usar `--color-border-input #8C8F9B` (3.22:1) |
| Iconos informativos | 3:1 |

- `text-on-dark-accent #7B9BFF` es el único azul permitido como texto sobre oscuro.
- Nunca uses `text-muted` sobre `inspire-grey` para copy importante.

## Teclado y semántica

- Tab order = orden visual. Sin tabindex positivos.
- Landmarks: `header/nav/main/footer`, un `h1` por página, headings sin saltos.
- Controles custom (tabs, menus, dialogs): roles ARIA + `aria-selected`/`aria-expanded` +
  flechas cuando aplique. Cierra con `Esc`; devuelve foco al trigger.
- Skip-link "Skip to content / Saltar al contenido" en páginas largas.

## Reduced motion

- `<MotionConfig reducedMotion="user">` en el raíz del sitio.
- CSS: `@media (prefers-reduced-motion: reduce)` anula `rise`, `glow-scroll`, y cualquier
  transform/transition no esencial. El contenido queda completo y estático.
- Nunca relies en animación para comunicar estado (usar color + icono + texto).

## Touch & responsive

- Targets táctiles ≥ 44×44px.
- Inputs ≥ 16px de font-size en mobile (evita zoom automático iOS).
- Nada depende solo de hover en mobile: estados activos/selected visibles.
- Imágenes con `alt` descriptivo; SVG decorativo con `aria-hidden`.

## Datos y charts (dashboard / deck)

- Color nunca es el único canal: añadir forma, patrón o etiqueta.
- Primera serie de chart: elevate-blue; series siguientes: rampa blue y greys.
- Números tabulares (`font-variant-numeric: tabular-nums`) para alinear columnas.
- Tooltips alcanzables con foco de teclado, no solo hover.

## Errores de formulario

- Mensaje junto al campo, en `error-text`, con `aria-describedby` y `aria-invalid`.
- Resumen de errores arriba con links al campo, `role="alert"` al enviar.
- Nunca solo color rojo: icono + texto.
