# Websites & Landings / Sitios y Landings

> Template base: `templates/landing.html` (Tailwind CDN v4 + `@theme` inline, autocontenido).
> Arquetipos de sección y ritmo editorial Elaniin.

## Arquetipo de landing Elaniin

Ritmo de superficies (blanco → grey → navy), hairlines como estructura, un solo gesto
dominante por pieza.

```
1. Nav              — 64px, hairline inferior, logo a la izq, links, hasta DOS CTA a la derecha: `Blog` (secundario md, oculto bajo 1024px)
                      y el CTA de conversación (primario md, siempre visible). El sitio de Elaniin tiene CUATRO entradas (3 menús + About), selector EN | ES
                      y mega-menús (`components.md` §1); un sitio genérico puede usar links simples. En móvil (<lg) la hamburguesa de 40px abre una **hoja** de
                      alto completo bajo la barra (`sheet` + `templates/drawer.js`, sin scrim; acordeones en el sitio de Elaniin), no un drawer lateral;
                      el drawer lateral queda para la sidebar de un dashboard. Nunca dejar links inaccesibles.
2. Hero             — dos variantes oficiales. SPLIT: texto a la izquierda y recurso isométrico a la
                      derecha desde 1024 px; por debajo todo centrado (lead máx. 40ch, h1 máx. 15ch);
                      ver `references/isometric.md`. CENTRADO: todo centrado, sin recurso visual.
                      Blanco. Display-xl 64px (máx. 4 líneas en cualquier ancho; split: 15ch), lead (56ch, máx. 2 líneas).
                      **CTAs (v1.77):** primario corto de ventas (`Let's talk`, con flecha, lleva a contacto) +
                      secundario blanco con borde (`How we deliver`, lleva a cómo se entregan los proyectos); en fila con gap 12px, apilados y a ancho
                      completo bajo 768px. Acento del titular: `accent-flow` (1–2 palabras, degradado azul
                      que fluye; en reduced-motion queda en elevate-blue plano).
                      Fondo: **module field** (`module-field`, textura firma, obligatoria).
                      Opcional: producto/UI shot con sombra `product`. Nada de fondo azul.
3. Social proof     — grey o blanco, hairline top. Logos en mono/gris, no multicolor.
4. Features / value — grid hairline 2–3 columnas. Cada celda: h3 + body (sin eyebrow).
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

- **Logotipo oficial siempre, solo el logotipo:** nav y footer con `logotipo-elaniin.svg` en
  superficies claras y `white-logotipo-elaniin.svg` en oscuras, a 28px de alto; sin símbolo ni
  tagline. Nunca el wordmark escrito como texto. El `<svg>` consumidor lleva
  `viewBox="0 0 281.45 75.91"` (si no, el logo aparenta indentado; ver SKILL.md §7a).
  Favicon: `assets/favicon.svg` oficial (provisional, sin símbolo).
- **Vivo sin glow:** `module-field` con rastro en el hero y en el CTA final, reveal, count-up (una vez), flecha de links que se desliza 4px. Sin spotlight, sin lift, sin glow en hover (DESIGN.md §7).
  Ver `motion.md`. Obligatorio en toda landing.
- **Living loop:** ≥1 mockup en loop por landing (pipeline CI con la utility `pipeline`,
  reloj pausable por IntersectionObserver) — `motion.md` §Living mockups. Todo el CSS sale
  del API `@theme`/`@utility` (ver `references/tailwind-api.md`).
- **Sin eyebrows.** Ningún label mono/uppercase encima de un heading (ni "01 — Discover" ni
  "Plugin para Claude"): el heading va solo. `mono-label` es solo para labels de dato.
- **Anclas:** el `id` va en la `<section>`; con `[id] { scroll-margin-top: var(--nav-height) }`
  (base de `tokens.css`) el enlace `#sección` deja el inicio de la sección justo bajo el nav.
- **Grids:** `grid-page` / `grid-auto` / `grid-hairline` + `gap-grid`, mobile first y `min-w-0`
  en hijos (recetas en `references/grids.md`). Nada de `-mx-*` ni gaps arbitrarios.
- **CTA del nav = `button.primary md`** (fondo elevate-blue, texto blanco, hover `blue-600`, active `blue-700`); el outline gris no es el CTA del nav. **Nav y pie = los de la referencia principal (DESIGN.md components.nav / components.footer):**
  barra `nav-bar` de 64px (blanco 80 % + blur 8px) que adopta el color de la sección bajo ella (las secciones con fondo
  oscuro propio declaran `data-nav-theme="blue|black"`; el CTA final y el pie son blue); links `nav-item` (pill de 40px,
  `surface-subtle` al hover); CTA primary md a la derecha; hamburguesa de 40px bajo `lg` (1024px). Pie en **Excellence Blue**
  (nunca Elaniin Black): logotipo blanco, lema (lead blanco + resto secundario), columnas con título display y enlaces
  `footer-link`, fila legal sobre hairline. `nav-link` (underline) queda solo como opción para enlaces dentro de texto.
- **Superficies con hover = cards con padding.** Toda celda que use `card-hover`
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
- **Gradientes:** solo los de la lista de SKILL.md regla 16 (`blue-steps`, `glow-stripes`, `section-glow`+`glass`, `card-glow` en cards oscuras, `accent-flow`). Ningún otro.
- **Sombras:** solo `card-rest`, `menu`, `product`. Nunca sombras grandes difusas.
- **Tipografía display:** Instrument Sans 500, tracking negativo en headings grandes.

## Sección por defecto (copy bilingüe)

Cuando el usuario no provea copy, escribe en su idioma (EN o ES):
- H2: beneficio concreto, no "Our features".
- Body: una idea, ≤2 líneas.
- CTA: verbo + objeto ("Start free trial" / "Prueba gratis"), no "Submit".

## Checklist específico de landing

- [ ] Logo oficial en nav y footer (variante según superficie), nunca texto.
- [ ] Sin eyebrows sobre headings; cada enlace `#id` cae al inicio de su `<section>` bajo el nav.
- [ ] Hero legible en <3s: qué es, para quién, qué hacer.
- [ ] **Module field** en el fondo del hero (y del CTA final) con su script de rastro.
- [ ] Spotlight reactivo + card glow + microinteracciones activos (y off con reduced-motion).
- [ ] ≥1 living loop activo (pipeline CI u otro mockup en loop): pausa fuera de pantalla,
      estado final estático con reduced-motion.
- [ ] Nav móvil: los links hidden <lg están en una hoja bajo la barra que abre (hamburguesa 40px, Esc, foco atrapado).
- [ ] Un solo CTA primario visible por viewport.
- [ ] Ritmo de fondos alternado, no 10 secciones blancas seguidas.
- [ ] Cero overflow: mobile sin recortes, CTAs full-width, grid colapsa a 1 col.
- [ ] Cada celda con `card-hover` tiene `pad-card`, radio y borde (texto nunca pegado al hover).
- [ ] Footer completo (no placeholder).
