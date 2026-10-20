# Methodology / Metodología

> Pipeline de diseño heredado del skill `style-architect`, adaptado al sistema Elaniin.
> Objetivo: decisiones en orden correcto, no azar estético.

## Principios

1. **Brief antes que píxeles.** Sin audiencia y objetivo claros, no se diseña.
2. **Referencias transpuestas, nunca copiadas.** Una referencia aporta layout/estructura; colores y tipografía se transponen a tokens Elaniin (DESIGN.md §11).
3. **Una idea visual por pieza.** Elegir el gesto dominante (hairline grid, banda oscura, tipografía display) y construir alrededor; no mezclar cinco tendencias.
4. **Restricción como firma.** El azul brillante es detalle. El peso lo lleva el navy. La página respira en blanco y gris.
5. **Entregable autocontenido.** Un HTML, sin dependencias externas salvo Tailwind CDN + Google Fonts (y `motion` vía esm.sh solo si es imprescindible).

## Pipeline

### Fase 0 — Brief & referencias
- Audiencia, objetivo, tono.
- ¿Hay referencias visuales (imágenes adjuntas o links)? Preguntar siempre.
- Si no hay: proponer 2–3 direcciones con keywords de `search-keywords.md`.

### Fase 1 — Estructura
- Esqueleto de secciones / slides / widgets, en orden de lectura.
- Jerarquía: qué domina la pantalla, qué es soporte.
- Ritmo de superficies (blanco → grey → banda oscura) y de hairlines.

### Fase 2 — Diseño visual
- Tokens estrictos (`tokens.md`).
- Composición: grid hairline, measure correcto, sombras mínimas.
- Estados de componentes (rest/hover/active/disabled/focus) desde el inicio, no al final.

### Fase 3 — Motion
- Escalera: CSS (`rise`) → `motion` para coreografía interacción.
- Nunca bloquear contenido en la animación.
- `prefers-reduced-motion` siempre.

### Fase 4 — Delivery & QA
- Checklist de salida del `SKILL.md`.
- Probar mobile, foco de teclado, contraste.

## Árboles de decisión

**¿Bandas oscuras?**
- Reporte/pitch con datos densos → sí, excellence-blue para secciones de peso.
- Landing de producto → una banda CTA al final; el resto blanco/grey.
- Dashboard → no; las bandas rompen la densidad de datos. Usar dark-cards.

**¿Dónde va elevate-blue?**
- ¿Hay un CTA primario? → su fill.
- ¿Hay links en texto? → su color.
- ¿Hay estado activo (tab, nav, fila)? → su indicador.
- ¿Ya cubre >5% del área? → quitar acentos no esenciales.

**¿Sombra o hairline?**
- Estructura (grid, divisores de sección, tablas) → hairline `border-default`.
- Tarjetas flotantes, menús, tooltips → sombra `menu` / `card-rest`.
- Product shots / mockups elevados → `product`.
- Nunca sombras grandes difusas ni neumorfismo.

**¿Cuánto motion?**
- Presentación de datos → mínimo (reveal de filas, contadores).
- Landing hero → un reveal escalonado; nada más.
- Deck → transiciones de slide cortas (200–300ms), sin efectos.
