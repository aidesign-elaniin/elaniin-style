# Arquitecto de sitio web / Website Architect

> Modo `site`: construir un **sitio completo** (muchas páginas) con el design system. Dos fases:
> **A. proyecto maestro** (arquitectura, cimientos y texto de relleno a partir de un diagrama o `.md`) y
> **B. página por página** (el diseño real de cada página cuando llega su contenido).
> Un solo camino técnico: **Next.js 16 (App Router) + Tailwind v4**, para que devs y no-devs trabajen igual.
> Starter listo para copiar: `templates/site-starter/`.

## 0 · Cuándo usarlo

| Pedido | Modo |
|---|---|
| Una landing o una página suelta, entregable rápido | `website` (`templates/landing.html`) |
| Un sitio con varias páginas / secciones / subsitios | **`site`** (este archivo) |
| Cambiar el código del sitio Elaniin 2027 ya existente | `site-dev` |

## 1 · Escalera de complejidad

Elige **el escalón más simple que cubra el insumo** y justifícalo en UNA línea (va al informe).

1. **Next.js estático** (`output: "export"`, `trailingSlash: true`) — punto de partida. Sin formularios con API, ni idiomas, es este. HTML puro en `out/`.
2. **+ API**: formularios que envían datos, webhooks. Quita `output: "export"` y usa route handlers.
3. **+ i18n**: ruteo por idioma (`/es`, `/en`). `references/site-dev.md` y DESIGN.md §13.
4. **+ contenido dinámico**: datos en vivo que no caben en archivos. El contenido editorial NO sube de escalón: va en MDX (`references/mdx.md`) y **el CMS es Claude Code**.

Subir un escalón se justifica por escrito. **Criterio de parada:** si una decisión no cambia lo que se ve ni el mantenimiento, no se documenta ni se implementa.

**Next.js 16:** `params` es una **Promise** (`await params` antes de usarlo). Si dudas de una API, lee `node_modules/next/dist/docs/`. `sitemap.ts`, `robots.ts` y cualquier route handler llevan `export const dynamic = "force-static"`.

## 2 · Fase A — Proyecto maestro

Entrada: diagrama o flujo en cualquier formato (imagen, outline, Mermaid/Markdown, enlace a FigJam/Figma) y, a veces, contenido. **Sin contenido, se usa relleno.**

1. **Mostrar PRIMERO el mapa del sitio y esperar tu OK antes de generar nada.** Tabla:

   | Página | Ruta | Tipo | Colección | Contenido (real / mixto / relleno) |
   |---|---|---|---|---|

   Cada página recibe un **tipo** (§3). Las que se repiten se agrupan en una **colección** con una sola ruta `[slug]`. Lo que el insumo no dice NO se pregunta; solo se pregunta lo que cambia la arquitectura (¿login?, ¿varios idiomas?).
2. **Escalón** (§1), en una línea.
3. **Crear el proyecto** copiando `templates/site-starter/` y adaptándolo (§4).
4. **Compuerta** (§7). Se entrega con todas las rutas del mapa funcionando, aunque todo sea relleno.
5. **Entrega:** `README.md` y `INFORME.md` (§8), `git init` y un primer commit.

## 3 · Tipos de página y colecciones (así escala a 100+ páginas)

Casi ningún sitio grande tiene 100 diseños distintos: tiene 5 a 8 **tipos** repetidos. Se diseña la plantilla una vez.

| Tipo | Qué es | En el starter |
|---|---|---|
| `home` | hero + secciones + CTA | `src/app/page.tsx` |
| `listing` | listado de una colección | `src/app/servicios/page.tsx` |
| `detail` | un ítem, ruta `[slug]` con `generateStaticParams` y `dynamicParams = false` | `src/app/servicios/[slug]/page.tsx` |
| `about` | texto + equipo | `src/app/nosotros/page.tsx` |
| `contact` | contacto sin formulario (con formulario = escalón 2) | `src/app/contacto/page.tsx` |
| `legal` | texto largo; `/legal/` redirige a su primera hija | `src/app/legal/` |

- **Una colección por grupo repetido**, nunca páginas sueltas: `src/content/<colección>.ts` + plantilla de listado + plantilla de detalle.
- **Contenido editorial repetido (blog, casos, noticias, docs): colección MDX desde el inicio**, sin esperar a cierto número de páginas; Claude lo detecta y lo pone en el mapa. Detección, instalación y mantenimiento: `references/mdx.md`. El CMS es Claude Code: no se agrega ni se propone otro.
- Generar por lotes: plantillas primero con 1 o 2 ítems por tipo, aprobarlas, luego el resto desde los datos.

## 4 · Arquitectura (obligatoria)

1. **`src/lib/site-map.ts` es la ÚNICA lista de rutas.** Menú, pie, migas y `sitemap.xml` salen de ahí. **Imports relativos, sin alias `@/`.**
2. **Cada ruta lleva `content: "real" | "mixed" | "placeholder"`** (real = todo texto real; mixed = parte real y parte relleno; placeholder = todo relleno). Cada ítem de colección declara `placeholder: boolean`; la ruta de un ítem se deriva de él.
3. **Relleno realista en el idioma del usuario, SIEMPRE visible:** chip "Texto de relleno" junto al título (`PlaceholderChip`, con atributo `data-placeholder`). Cifras de clientes siempre "ilustrativas" y dichas en pantalla. Sin logos de marcas reales: cajas "Logo cliente 01". Personas "Persona 01…". Imágenes: placeholder SVG local con la proporción final (`ImagePlaceholder`), sin degradados.
4. **Contenido real SOLO donde el insumo lo da.** Si un paso no trae descripción, se muestra sin descripción: no se inventa (`summary` es opcional en `Item`).
5. **`/legal` sin página propia:** `redirect()` a la primera hija. En export estático lo hace el navegador con JS (no un servidor): **avísalo en el informe**.
6. **Estructura:**
   ```
   src/app/            layout, páginas, sitemap.ts, robots.ts, site-manifest.json/route.ts, icon.svg
   src/components/     layout/ (nav, footer, logo, fx), sections/ (una pieza por archivo), ui/ (button, reveal, placeholder…)
   src/content/        site.ts, <página>.ts, <colección>.ts (textos y rutas de imagen con su alt)
   src/lib/site-map.ts
   src/styles/tokens.css   (copia exacta de templates/tokens.css; no se edita a mano)
   public/brand, public/images/…       scripts/check.mjs, scripts/overflow.html
   ```
7. **Design system:** `tokens.css` completo + `globals.css` (`@import "tailwindcss"; @import "../styles/tokens.css"` y las fuentes de `next/font` apuntando a los tokens). Logotipo oficial como `<symbol>` + `<use>` definido UNA vez en el layout (`LogoSprite`), **sin clases, color por `fill` del `<g>`**, solo el logotipo (sin símbolo ni tagline). Favicon de la skill (`assets/favicon.svg` → `src/app/icon.svg`). Sin gradientes ni eyebrows. **Nav y pie de la referencia** (`nav-bar`, `nav-item`, `nav-toggle`, `footer-link`; pie en Excellence Blue; secciones oscuras con `data-nav-theme`): `references/websites.md` y regla 19 de `SKILL.md`.

## 5 · Assets

- **Logos:** `<symbol>` en el layout (§4.7); los SVG oficiales viven además en `public/brand/` (og, usos externos).
- **Imágenes:** archivos locales con `next/image` (ancho/alto, `alt` desde `content/`). **Nunca** base64, `data:` ni enlaces remotos. Las que el insumo solo enlaza se descargan a `public/images/…` **con OK del usuario** (origen y tamaño). Imagen faltante: placeholder local en la ruta definitiva; se reemplaza el archivo sin tocar código.
- **Íconos:** `lucide-react` o SVG propios en `public/icons/`. **Fuentes:** `next/font`. Escenas isométricas y `module-field` son componentes, no assets.
- Un asset, un lugar. Nombres en minúsculas con guiones.

## 6 · Vida y UX (mínimos)

- **Module field** en el hero y en el CTA final; spotlight global y `card-glow` que sigue al puntero (`Fx`); **count-up** en cifras (`CountUp`); `Reveal` con IntersectionObserver (`<html class="js">`); **≥1 loop vivo** que pausa fuera de pantalla y queda estático con reduced-motion (`Pipeline`).
- **Nav sticky 64 px** con drawer móvil real: targets ≥ 44 px, `aria-expanded`, foco dentro, Esc / scrim / enlace cierran y devuelven el foco, Tab atrapado, scroll bloqueado, cierra al crecer el viewport. Skip-link. Anclas con `id` en `<section>`.

## 7 · Compuerta de calidad (obligatoria antes de entregar)

1. `src/app/site-manifest.json/route.ts` (force-static) emite `{ routes }` desde `site-map.ts` a `out/site-manifest.json`.
2. `scripts/check.mjs` lee ese manifest (**ninguna lista ni número de páginas escrito a mano**) y falla si: `site-map` ≠ `sitemap.xml` ≠ páginas exportadas; falta o sobra un `<h1>`; hay `href="#"`; falta el logotipo o el `lang`; hay enlaces internos rotos; `content` no coincide con las marcas `data-placeholder` en pantalla; hay `-mx-`, cualquier valor arbitrario (`max-w-[18ch]`, `gap-[…]`, `grid-cols-[…]`; solo se admiten las variantes `data-[…]`/`aria-[…]`), un `--section-y` en línea, `lift`/`card-glow` junto a `grid-hairline`, gradientes o imports con `@/`. Las medidas de línea son tokens: `max-w-body` 68ch, `max-w-lead` 56ch, `max-w-narrow` 40ch, `max-w-heading` 20ch, `max-w-hero` 18ch, `max-w-cta` 34ch.
3. `npm run build` y `npm run check` en verde.
4. **Prueba negativa:** cambia un `content` en `out/site-manifest.json` y confirma que `check` falla (exit 1); restaura y confirma que pasa.
5. **Overflow en TODAS las páginas** a 375 y 768 px: `cp scripts/overflow.html out/`, sirve `out/` y abre `/overflow.html` (mide con iframes todas las rutas del manifest; título `OVERFLOW OK n`). Alternativa sin navegador manual: `python3 <plugin>/scripts/browser-check.py out` (overflow a 375/768/1280, anillo de foco y animaciones infinitas con reduced-motion).
6. Revisión visual por tipo de página a 1280 / 768 / 375 y checklist de `SKILL.md` §6.

## 8 · Entrega

- **`README.md`:** comandos, dónde vive cada cosa, cómo agregar una página a una colección, y cómo personalizar UNA sola página (una ruta fija `app/<colección>/<slug>/page.tsx` gana sobre `[slug]`; dejar el ítem en `content/` para que `site-map` lo siga listando; actualizar `placeholder` cuando pase a texto real).
- **`INFORME.md`:** qué es real y qué es relleno, decisiones a revisar, qué se revisó visualmente (1280/768/375) y qué **NO** se revisó (reduced-motion, foco con Tab, contraste, páginas no vistas una por una), y el aviso del redirect de `/legal`.
- **`MAINTENANCE.md` y `CLAUDE.md`** (vienen en el starter): cómo se mantiene el sitio con Claude Code y la skill, quién, flujo y cómo revertir. Se llenan con `references/maintenance.md` §1; lo desconocido (hosting, dominio, personas) queda como `PENDIENTE:`.
- **`git init` y un primer commit** al terminar.

## 9 · Tabla de enlaces: decisión → regla exacta

| Decisión | Dónde está |
|---|---|
| Colores, tipografía, radios, motion, tokens | `templates/tokens.css` · `references/tokens.md` |
| Clases y utilities (Tailwind-first) | `references/tailwind-api.md` |
| Layout: 12 columnas, auto, hairline | `references/grids.md` |
| Landing, hero, secciones | `references/websites.md` |
| Botones, hero, nav CTA | `references/tokens.md` (Botones) · `websites.md` |
| Movimiento, module field, reduced motion | `references/motion.md` |
| Foco, contraste, estados, a11y | `references/ux-a11y.md` |
| Recursos isométricos | `references/isometric.md` · `templates/iso/` |
| Dashboards dentro del sitio | `references/dashboards.md` |
| Stack Next.js, i18n, deploy | `references/site-dev.md` |
| Logo, favicon, overflow | `SKILL.md` §7a, §7c · reglas UX 10–18 |
| Blog, casos, docs en MDX: detectar, instalar, mantener | `references/mdx.md` · `templates/mdx-collection/` |
| Mantenimiento, recetario, revertir, traspaso | `references/maintenance.md` · `MAINTENANCE.md` y `CLAUDE.md` del starter |

## 10 · Trampas conocidas (ya dieron problemas)

- **Loop vivo:** etiquetas de máximo 8 letras ("Guardar", no "Almacenar"); en 375 px se parten.
- **Equipo o listas de 6:** `grid-page` con `col-span-6 md:col-span-4 xl:col-span-2`, no `grid-auto` (queda 4 + 2).
- **Títulos de CTA:** `max-w` ≥ 34ch en sm+, o caen en 3 líneas.
- **Pie en móvil:** separación vertical entre columnas (`mb-6 lg:mb-0`).
- **Card clicable:** enlace en el `h3` con `after:absolute after:inset-0`, no un `<a>` absoluto que contenga el texto.
- **Cards con `lift`/`card-glow`:** `rounded-card` + `border` + `pad-card` siempre; el wrapper de `Reveal` lleva `h-full min-w-0`.
- **Chip dentro de un título:** hereda el `letter-spacing` negativo del heading y el texto se ve amontonado. Todo chip, tag o pastilla que pueda vivir dentro de un h1–h4 lleva `tracking-normal` (o su propio tracking, como `mono-label`).
- **Escenas isométricas en páginas internas:** son decorativas (`aria-hidden`), usan el kit de `templates/iso/` y comparten un mismo lienzo; las etiquetas de las pills van fijas a 6–7 letras con `length` explícito para que no se salgan del slab.
- **`trailingSlash`:** los `href` internos terminan en "/"; no busques `a[href="/casos"]`.
- **Qué NO hacer:** un archivo de contenido por página cuando es una colección; navegación escrita a mano; rutas fuera de `site-map.ts`; subir de escalón "por si acaso"; abstracciones sin segundo uso.
