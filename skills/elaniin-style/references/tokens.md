# Tokens / Tokens

> Fuente única de verdad: `DESIGN.md` v1.45 del sitio Elaniin 2027.
> Copia para proyectos: `templates/tokens.css`.

## Color

### Brand
| Token | Hex | Rol |
|---|---|---|
| elevate-blue | `#1054FF` | **DETAIL only**: links, focus, active, primary button (uno por grupo), dots 6–8px, primer serie de gráfico, una palabra destacada por página. Nunca fondos de sección o card. Presupuesto: **<5% del área visible**. |
| excellence-blue | `#01172E` | El color con peso: botón primario oscuro, bandas oscuras, CTA, footer, superficies de código. |
| inspire-grey | `#F0F0F3` | Superficie alterna (secciones alternas, wells internos). |
| elaniin-black | `#141414` | Wordmark, texto primario, borde de botón secundario. |
| dynamic-blue | `#4D75FD` | Solo acentos NO-texto (gráficos, tintes, series de chart). |
| white | `#FFFFFF` | — |

### Blue ramp
`100 #D7E2F8` · `200 #B9CEFB` · `300 #6A9AFF` · `400 #4D75FD` · `500 #1054FF` · `600 #0848CC` (hover) · `700 #023CA0` (active) · `800 #022B63` · `900 #01172E` · `tint-50 #E7EEFF` (info bg) · `active-dark #010F20`

### Text
`primary #141414` · `secondary #4A4D57` · `muted #656873` · `link #1054FF` · `link-hover #0848CC` · `on-dark-primary #FFFFFF` · `on-dark-secondary #A9B8CC` · `on-dark-muted #8EA0B8` · `on-dark-accent #7B9BFF` (único azul permitido como texto sobre oscuro) · `disabled #8C8F9B`

### Surface
`page #FFFFFF` · `subtle #F0F0F3` · `card #FFFFFF` · `dark #01172E` · `dark-alt #141414` · `dark-card rgba(255,255,255,0.04)` · `code #01172E`

**No existe superficie elevate-blue a propósito.**

### Border
`default #E4E4EA` (hairlines) · `strong #D3D4DC` · `input #8C8F9B` (3.22:1, obligatorio en inputs) · `ink #141414` · `on-dark rgba(255,255,255,0.12)` · `on-dark-strong rgba(255,255,255,0.24)`

### Status (solo estado, nunca decoración)
| | text | bg | border | dot |
|---|---|---|---|---|
| success | `#136C42` | `#E3F4EA` | `#B6E0C8` | `#1F9D61` |
| warning | `#8A5300` | `#FFF3D9` | `#F2D58F` | `#B87700` |
| error | `#A3201F` | `#FDE7E7` | `#F1B5B5` | `#D6322F` |
| info | `#0848CC` | `#E7EEFF` | `#B9CEFB` | `#1054FF` |
| neutral | `#4A4D57` | `#F0F0F3` | `#E4E4EA` | `#8C8F9B` |

## Typography

| Familia | Uso | Fuentes |
|---|---|---|
| display | headings, display, buttons | Instrument Sans (500) |
| text | párrafos, UI, forms | DM Sans (400) |
| mono | tags, labels de dato, code | Geist Mono (400), feature `zero` 1 |

Escala fluida (desktop → mobile): `display-xl 72→40` · `display-lg 56→36` · `h1 48→32` · `h2 36→28` · `h3 28→22` · `h4 22→20` · `lead 20→18` · `body-lg 18→17` · `body 16` · `body-sm 14` · `caption 13` · `label 13 mono uppercase +0.05em` · `code 13`.

Measure: **body 68ch · lead 56ch · heading 20ch**.

## Layout
`container-max 1280px` · `gutter 48/32/20` · `grid-gap 24/16` · `nav-height 64` · `section-y 96/72/56` · `section-y-statement 128/96/72` · `section-y-compact 64/48/40` · `card-padding 32/24`.

## Radius
`button/input/tag 6` · `card/media/code 12` · `menu 8` · `modal 16` · `tooltip 6` · `device 32` · `module 2` · `full 9999`.

## Shadow
`card-rest` (hairline + 2px) · `menu` · `product` (elevado, para product shots) · `focus` (2px blanco + 4px elevate-blue) · `focus-on-dark` (2px excellence-blue + 4px `#7B9BFF`).

## Motion
`ease-standard cubic-bezier(0.4,0,0.2,1)` · `ease-emphasized cubic-bezier(0.25,1,0.5,1)` · durations `instant 100 · fast 150 · base 200 · slow 300 · reveal 500` ms · `reveal-distance 16px` · `reveal-stagger 60ms`.

## Sin gradientes
**No hay gradientes decorativos.** Ni barras escalonadas de azul (el antiguo “stepped blue ramp” se eliminó), ni fondos degradados, ni blobs. Solo se permiten los resplandores radiales sutiles del puntero (`spotlight`, `card-glow`).
