# Websites & Landings / Sitios y Landings

> Template base: `templates/landing.html` (Tailwind CDN v4 + `@theme` inline, autocontenido).
> Arquetipos de sección y ritmo editorial Elaniin.

## Arquetipo de landing Elaniin

Ritmo de superficies (blanco → grey → navy), hairlines como estructura, un solo gesto
dominante por pieza.

```
1. Nav              — 64px, hairline inferior, logo a la izq, links, CTA secundario.
                      En móvil (<md) los links van en un **drawer** (`drawer md:hidden` +
                      `scrim` + `templates/drawer.js`, `data-drawer-from="md"`) abierto por una
                      hamburguesa de 44px junto al CTA; nunca dejar links inaccesibles.
2. Hero             — blanco. Display-xl (max ~20ch), lead (56ch), 1 CTA primario + 1 secundario.
                      Fondo: **module field** (`module-field`, textura firma, obligatoria).
                      Opcional: producto/UI shot con sombra `product`. Nada de fondo azul.
3. Social proof     — grey o blanco, hairline top. Logos en mono/gris, no multicolor.
4. Features / value — grid hairline 2–3 columnas. Cada celda: label mono (eyebrow), h3, body.
                      O bento grid con 1 celda destacada en excellence-blue.
5. Product / case   — banda oscura excellence-blue opcional con texto on-dark + screenshot.
6. Data / stats     — 3–4 números grandes (display), captions mono-label.
7. Testimonial      — grey. Cita lead, nombre caption, sin estrellas.
8. Pricing (si hay) — hairline cards, la recomendada con borde ink o tag "Most popular".
9. CTA final        — banda excellence-blue. H2 + botón primario (elevate-blue) + glow motif
                      opcional (diagonal stripes, solo transform).
10. Footer          — excellence-blue o elaniin-black. Columnas, mono-labels, hairlines on-dark.
```

## Reglas de composición

- **Logo oficial siempre:** nav y footer con `main-isologo-elaniin.svg` en superficies
  claras y `white-isologo-elaniin.svg` en oscuras. Nunca el wordmark escrito como texto.
  El `<svg>` consumidor lleva `viewBox="0 0 364.43 81.38"` (si no, el logo aparenta
  indentado; ver SKILL.md §7a). Favicon: `assets/favicon.svg` oficial.
- **Vivo por defecto:** spotlight reactivo al mouse en el hero (+ textura sutil),
  card glow que sigue al cursor, microinteracciones en botones y links.
  Ver `motion.md` §Living surfaces. Obligatorio en toda landing.
- **Living loop:** ≥1 mockup en loop por landing (pipeline CI con la utility `pipeline`,
  reloj pausable por IntersectionObserver) — `motion.md` §Living mockups. Todo el CSS sale
  del API `@theme`/`@utility` (ver `references/tailwind-api.md`).
- **Grids:** `grid-page` / `grid-auto` / `grid-hairline` + `gap-grid`, mobile first y `min-w-0`
  en hijos (recetas en `references/grids.md`). Nada de `-mx-*` ni gaps arbitrarios.
- **Superficies con hover = cards con padding.** Toda celda que use `lift` o `card-glow`
  lleva `rounded-card border bg-surface-card pad-card`. Sin padding el hover se ve como una
  caja con el texto pegado al borde: prohibido. Nada de `-mx-*` para disimularlo.
- **Hairlines dividen, no decoran.** `border-default #E4E4EA` en blanco/grey;
  `border-on-dark rgba(255,255,255,0.12)` en navy.
- **Measure:** body 68ch, lead 56ch, headings 20ch. Nunca texto full-width.
- **elevate-blue:** un CTA primario por grupo de acción; links en texto; focus; un estado
  activo. Si la página "se ve azul", sobra azul.
- **Anti-overflow:** grid/flex children con `min-w-0`; `break-words` en títulos largos;
  `overflow-hidden` en cards con media; verificar mobile sin recortes.
- **Imágenes:** product shots con `shadow-product`; iconos lineales 1.5px stroke, no emojis.
- **Gradientes:** prohibidos salvo el stepped blue motif (`--blue-steps`) y el spotlight.
- **Sombras:** solo `card-rest`, `menu`, `product`. Nunca sombras grandes difusas.
- **Tipografía display:** Instrument Sans 500, tracking negativo en headings grandes.

## Sección por defecto (copy bilingüe)

Cuando el usuario no provea copy, escribe en su idioma (EN o ES):
- Eyebrow (mono-label uppercase): categoría.
- H2: beneficio concreto, no "Our features".
- Body: una idea, ≤2 líneas.
- CTA: verbo + objeto ("Start free trial" / "Prueba gratis"), no "Submit".

## Checklist específico de landing

- [ ] Logo oficial en nav y footer (variante según superficie), nunca texto.
- [ ] Hero legible en <3s: qué es, para quién, qué hacer.
- [ ] **Module field** en el fondo del hero (y del CTA final) con su script de rastro.
- [ ] Spotlight reactivo + card glow + microinteracciones activos (y off con reduced-motion).
- [ ] ≥1 living loop activo (pipeline CI u otro mockup en loop): pausa fuera de pantalla,
      estado final estático con reduced-motion.
- [ ] Nav móvil: los links hidden <md están en un drawer que abre (hamburguesa 44px, Esc, scrim).
- [ ] Un solo CTA primario visible por viewport.
- [ ] Ritmo de fondos alternado, no 10 secciones blancas seguidas.
- [ ] Cero overflow: mobile sin recortes, CTAs full-width, grid colapsa a 1 col.
- [ ] Cada celda con `lift`/`card-glow` tiene `pad-card`, radio y borde (texto nunca pegado al hover).
- [ ] Footer completo (no placeholder).
