# Visual references / Referencias visuales

> DESIGN.md §11: la inspiración puede ser de layout/patrón; colores y tipografía se
> transponen a tokens Elaniin. Esta guía define cómo pedir, leer y transponer referencias.

## Fase 0 — Preguntar siempre

Antes de diseñar, pregunta al usuario (en su idioma):

1. ¿Tienes **imágenes de referencia** adjuntas (screenshots, mockups, moodboards)?
2. ¿Tienes **links** (Dribbble, Behance, un sitio en vivo, Pinterest)?
3. ¿Qué te gusta de esa referencia: el layout, la tipografía, el color, el motion…?

Si dice que no tiene nada: no improvises a ciegas. Propón 2–3 direcciones concretes
usando `search-keywords.md` (p. ej. "bento grid SaaS" vs "editorial big-type" vs
"dark navy fintech") y deja que elija.

## Leer una referencia

- **Imágenes adjuntas:** describir lo que ves (layout, jerarquía, densidad, gesto
  dominante, ritmo de fondos). Identificar el patrón reutilizable.
- **Links Dribbble/Behance:** hacer WebFetch de la página. Si expone `og:image` o la
  imagen principal, tratarla como referencia visual.
- **Sitios en vivo:** hacer fetch del HTML; leer estructura de secciones y clases de
  layout (grid, flex, gap), no copiar CSS ajeno.

## Transponer (siempre)

| De la referencia | Acción Elaniin |
|---|---|
| Layout / grid / ritmo de secciones | Reproducir la estructura |
| Paleta de colores | **Descartar**; mapear roles → tokens Elaniin (bg claro→white/grey, acento→elevate-blue detalle, oscuro→excellence-blue) |
| Tipografía | **Descartar**; Instrument Sans / DM Sans / Geist Mono |
| Sombras / bordes | Simplificar a hairlines + sombras mínimas del sistema |
| Motion | Reducir a ladder CSS/`motion` con presets Elaniin; respetar reduced-motion |
| Decoración (gradientes, barras de color, blobs, glass) | Eliminar, salvo los motivos de la lista de SKILL.md regla 16 |

## Ejemplo de transposición

Referencia: landing SaaS oscura con gradiente púrpura, glassmorphism, tipografía condensada.

Transposición Elaniin:
- Estructura: hero + logos + features grid + CTA (se mantiene).
- Fondo: blanco/grey con una banda excellence-blue al CTA (no todo oscuro).
- Acento púrpura → elevate-blue solo en CTA primario y links.
- Glass → cards blancas con hairline + `shadow-card-rest`.
- Tipografía condensada → Instrument Sans 500 con tracking negativo normal del sistema.

## Cuando la referencia es de otro producto Elaniin

Si el usuario referencia el sitio Elaniin 2027 o su DESIGN.md, usar los tokens exactos
de `tokens.md`; ahí no hay transposición, hay fidelidad.
