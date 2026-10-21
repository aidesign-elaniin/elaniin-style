# Decks & Presentations / Decks y Presentaciones

> Template base: `templates/deck.html` — deck HTML autocontenido, navegable con teclado
> y swipe, 16:9, exportable a PDF desde el navegador.

## Formato

- **16:9 full-screen siempre.** Lienzo fijo `1280×720` escalado con `transform: scale()`
  al viewport (`Math.min(vw/1280, vh/720) × 0.94`). El deck ocupa la pantalla completa;
  el navegador en modo presentación es el caso base.
- Un slide por `<section class="slide">`. Navegación: ←/→, swipe, dots, `hash #3`.
- Autocontenido: Tailwind CDN + `@theme` inline (`tokens.css`) + Google Fonts + logos
  oficiales incrustados como `<symbol>` (`assets/`).
- Motion: spotlight reactivo por slide + `rise` stagger al activar; transición 200–300ms;
  `prefers-reduced-motion` → crossfade instantáneo sin transforms.

## Anti-overflow (obligatorio — el bug más común)

Un slide que recorta contenido es un slide roto. Reglas duras:

1. **`.slide { overflow: hidden; }`** — red de seguridad; nada sale del canvas.
2. **Cero clases responsive dentro del deck.** El canvas siempre mide 1280px de ancho:
   usar `grid-cols-3` (NO `md:grid-cols-3`), tamaños fijos, `w-[…]`. Los breakpoints de
   Tailwind miran el viewport, no el canvas, y rompen el layout al escalar.
3. **Presupuesto de contenido por slide:** alto útil = `720 − 2×padding(80) = 560px`.
   Título (hasta ~120) + cuerpo/grid (hasta ~400) deben caber. Sin eyebrows.
   Si no cabe: reducir copy, bajar un step tipográfico, o partir en dos slides.
4. **Grid/flex children:** `min-w-0` + `min-h-0`; cards con `overflow-hidden` y
   altura igualitaria (`items-stretch` / `h-full`).
5. **Texto:** `break-words`; sin `whitespace-nowrap` en frases; headings `max-w-[…ch]`.
6. **Verificación:** abrir el deck a pantalla completa y revisar slide por slide antes
   de entregar. Ningún elemento cortado, ningún scroll interno.

## Estructura narrativa (pitch estándar)

| # | Slide | Layout |
|---|---|---|
| 1 | **Cover** | Blanco. Logo mono, display-xl (empresa + tagline), fecha caption. Sin decoración de color: la textura `module-field` o nada. |
| 2 | **Problem** | Grey. H2 + 2–3 bullets con iconos lineales. O full-bleed tipográfico. |
| 3 | **Solution** | Blanco. H2 + product shot (`shadow-product`) + 3 value props en hairline grid. |
| 4 | **How it works** | 3 pasos hairline con número en el título, conectores hairline. |
| 5 | **Market** | Datos: 3 números display + fuentes caption. Chart simple (barras blue-ramp). |
| 6 | **Product / demo** | Navy excellence-blue. Screenshot centrado, on-dark copy. Un solo gesto. |
| 7 | **Traction** | Blanco. Chart de línea/área elevate-blue + KPIs. `tabular-nums`. |
| 8 | **Business model** | Grey. Tabla hairline de pricing/units o bento con 1 card navy destacada. |
| 9 | **Competition** | Matriz hairline (✓ / — / ✕ con iconos, no solo color). |
| 10 | **Team** | Blanco. B/W portraits en grid hairline, nombre h4, rol caption. |
| 11 | **The ask** | Navy. Número display blanco (monto / ronda), uso de fondos en 3 bullets, contacto. |
| 12 | **Closing** | Blanco. Logo + tagline + contacto. |

Para **reportes internos**: cover → executive summary (navy) → secciones de datos →
hallazgos → recomendaciones → next steps. Mismos tokens.

## Reglas de slide

- **Logo oficial siempre:** cover y closing con `main-isologo` (claro) o `white-isologo`
  (oscuro). Nunca el nombre escrito como texto. El `<svg>` consumidor lleva
  `viewBox="0 0 364.43 81.38"` o el logo queda centrado en una caja de 300px y aparenta
  estar indentado (ver SKILL.md §7a). Favicon: `assets/favicon.svg` oficial.
- **Una idea por slide.** Si necesita más de ~40 palabras, son dos slides.
- **Tipografía:** título h2/display-lg; cuerpo lead o body-lg; labels mono-label uppercase.
- **Hairlines** para tablas y grid; nunca cajas con sombra pesada.
- **elevate-blue:** datos principales, subrayados, un acento por slide como máximo.
- **Navy:** slides de peso (problema fuerte, demo, ask). Alternar ritmo claro/oscuro.
- **Números:** grandes, `tabular-nums`, con unidad y período.
- **Vivo:** spotlight reactivo por slide + microinteracciones (ver `motion.md` §Living
  surfaces). Los charts se dibujan al activar el slide; los números hacen count-up.
- **Living loop:** ≥1 mockup en loop por deck (phone de pantallas swiping con la utility
  `phone-track`, chip ETA flotante, spinner/typing — CSS puro, estático bajo
  reduced-motion) — `motion.md` §Living mockups. CSS: `references/tailwind-api.md`.
- **Imágenes:** producto real o abstracto neutro; nunca stock sonriente.
- **Sin:** clip-art, emojis como iconos, word-art, transiciones con zoom/rotación.

## Navegación & entrega

- Teclado: ←/→/space, Home/End. `aria-live` para "Slide 3 de 12".
- Dots o contador inferior discreto (mono-label).
- Exportar PDF: `@media print` una slide por página, fondos impresos
  (`-webkit-print-color-adjust: exact`).
- Presentar en browser a pantalla completa; funciona sin servidor.

## Checklist de deck

- [ ] Full-screen 16:9; revisado slide por slide sin ningún elemento cortado.
- [ ] Cero clases responsive dentro del deck; `.slide { overflow: hidden }`.
- [ ] Logo oficial en cover y closing (variante según superficie).
- [ ] Spotlight reactivo + microinteracciones (chart draw, count-up, stagger).
- [ ] 10–14 slides; ritmo claro/oscuro alternado.
- [ ] Cada slide, una sola idea, copy en el idioma del usuario.
- [ ] Números con unidad, período y fuente cuando aplique.
- [ ] Ask claro (monto, uso, contacto) en slide destacada.
- [ ] Navegación por teclado y print/PDF funcionando.
- [ ] reduced-motion respetado.
- [ ] ≥1 mockup en loop (phone swipe, chip flotante o spinner): CSS puro, `aria-hidden`,
      estático con reduced-motion.
