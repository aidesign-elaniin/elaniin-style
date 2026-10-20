# Decks & Presentations / Decks y Presentaciones

> Template base: `templates/deck.html` — deck HTML autocontenido, navegable con teclado
> y swipe, 16:9, exportable a PDF desde el navegador.

## Formato

- **16:9**, lienzo `1280×720` escalado con `transform: scale()` al viewport.
- Un slide por `<section class="slide">`. Navegación: ←/→, swipe, dots, `hash #3`.
- Autocontenido: Tailwind CDN + `@theme` inline (`tokens.css`) + Google Fonts.
- Motion: revelar contenido del slide activo con `rise` + stagger; transición de slide
  200–300ms; `prefers-reduced-motion` → crossfade instantáneo.

## Estructura narrativa (pitch estándar)

| # | Slide | Layout |
|---|---|---|
| 1 | **Cover** | Blanco. Logo mono, display-xl (empresa + tagline), fecha caption. Opcional: stepped blue motif en esquina. |
| 2 | **Problem** | Grey. H2 + 2–3 bullets con iconos lineales. O full-bleed tipográfico. |
| 3 | **Solution** | Blanco. H2 + product shot (`shadow-product`) + 3 value props en hairline grid. |
| 4 | **How it works** | 3 pasos hairline, eyebrow mono-labels, conectores hairline. |
| 5 | **Market** | Datos: 3 números display + fuentes caption. Chart simple (barras blue-ramp). |
| 6 | **Product / demo** | Navy excellence-blue. Screenshot centrado, on-dark copy. Un solo gesto. |
| 7 | **Traction** | Blanco. Chart de línea/área elevate-blue + KPIs. `tabular-nums`. |
| 8 | **Business model** | Grey. Tabla hairline de pricing/units o bento con 1 card navy destacada. |
| 9 | **Competition** | Matriz hairline (✓ / — / ✕ con iconos, no solo color). |
| 10 | **Team** | Blanco. B/W portraits en grid hairline, nombre h4, rol caption. |
| 11 | **The ask** | Navy. Número display blanco (monto / ronda), uso de fondos en 3 bullets, contacto. |
| 12 | **Closing** | Blanco. Logo + tagline + contacto. stepped blue motif. |

Para **reportes internos**: cover → executive summary (navy) → secciones de datos →
hallazgos → recomendaciones → next steps. Mismos tokens.

## Reglas de slide

- **Una idea por slide.** Si necesita más de ~40 palabras, son dos slides.
- **Tipografía:** título h2/display-lg; cuerpo lead o body-lg; labels mono-label uppercase.
- **Hairlines** para tablas y grid; nunca cajas con sombra pesada.
- **elevate-blue:** datos principales, subrayados, un acento por slide como máximo.
- **Navy:** slides de peso (problema fuerte, demo, ask). Alternar ritmo claro/oscuro.
- **Números:** grandes, `tabular-nums`, con unidad y período.
- **Imágenes:** producto real o abstracto neutro; nunca stock sonriente.
- **Sin:** clip-art, emojis como iconos, word-art, transiciones con zoom/rotación.

## Navegación & entrega

- Teclado: ←/→/space, Home/End. `aria-live` para "Slide 3 de 12".
- Dots o contador inferior discreto (mono-label).
- Exportar PDF: `@media print` una slide por página, fondos impresos
  (`-webkit-print-color-adjust: exact`).
- Presentar en browser a pantalla completa; funciona sin servidor.

## Checklist de deck

- [ ] 10–14 slides; ritmo claro/oscuro alternado.
- [ ] Cada slide, una sola idea, copy en el idioma del usuario.
- [ ] Números con unidad, período y fuente cuando aplique.
- [ ] Ask claro (monto, uso, contacto) en slide destacada.
- [ ] Navegación por teclado y print/PDF funcionando.
- [ ] reduced-motion respetado.
