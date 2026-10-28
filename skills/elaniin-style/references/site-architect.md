# Arquitecto de sitio web / Website Architect

> Modo `site`: construir un **sitio completo** (muchas páginas) con el design system. Dos fases:
> **A. proyecto maestro** (arquitectura, cimientos y texto de relleno a partir de un diagrama) y
> **B. página por página** (el diseño real de cada página cuando llega su contenido).
> Un solo camino técnico: **Next.js (App Router) + Tailwind v4**, para que devs y no-devs trabajen igual.

## 0 · Cuándo usarlo

| Pedido | Modo |
|---|---|
| Una landing o una página suelta, entregable rápido | `website` (`templates/landing.html`) |
| Un sitio con varias páginas / secciones / subsitios | **`site`** (este archivo) |
| Cambiar el código del sitio Elaniin 2027 ya existente | `site-dev` |

## 1 · Escalera de complejidad (justificar por escrito cada subida)

1. **Next.js estático** (`output: "export"`, sin servidor) — el punto de partida SIEMPRE. HTML puro en `out/`, se aloja en cualquier lado. El starter ya es este escalón.
2. **+ API**: formularios que envían datos, webhooks. Quita `output: "export"` y usa route handlers. Solo si el contenido de la entrada lo pide.
3. **+ i18n**: ruteo por idioma (`/es`, `/en`). Sigue `references/site-dev.md` (sección i18n) y el DESIGN.md §13.
4. **+ CMS / contenido dinámico**: cuando hay muchos autores o cambios frecuentes. MDX primero; CMS después.

Cada subida deja UNA línea en el informe final: qué la exige y qué se ganó. **Criterio de parada:** si una decisión no cambia lo que se ve ni el mantenimiento, no se documenta ni se implementa.

## 2 · Fase A — Proyecto maestro

Entrada: diagrama o flujo del sitio en cualquier formato (imagen, outline de texto, Mermaid/Markdown, enlace a FigJam/Figma) y, a veces, contenido. **Sin contenido, se usa relleno.**

1. **Leer y construir el mapa del sitio.** Una tabla antes de escribir código:

   | Página | Ruta | Tipo | Colección | Secciones | Contenido |
   |---|---|---|---|---|---|

   - Cada página recibe un **tipo** del catálogo (§3). Las páginas que se repiten se agrupan en una **colección** con una sola ruta dinámica.
   - Lo que el insumo no dice NO se pregunta: relleno realista en el idioma del usuario, marcado `PLACEHOLDER`. Solo se pregunta lo que cambia la arquitectura (¿login?, ¿los textos vienen de un CMS?, ¿varios idiomas?).
   - **Mostrar el mapa y esperar el OK** antes de generar las páginas.
2. **Elegir el escalón** (§1) y escribirlo en una línea.
3. **Crear el proyecto** copiando `templates/site-starter/` y adaptándolo:
   - `lib/site-map.ts`: rutas, colecciones, CTA del nav (único lugar de rutas).
   - `content/`: un archivo por página (`home.ts`, `contact.ts`…) y una carpeta por colección (`content/<colección>/<slug>.json`).
   - `app/<ruta>/page.tsx`: una por tipo de página, con ruta dinámica para las colecciones.
   - Assets en `public/` (§5). Correr `scripts/ensure-motion.sh` si el sitio usa `motion`.
4. **Compuerta** (§7). El proyecto maestro se entrega con todas las rutas del mapa funcionando, aunque todo sea relleno.

## 3 · Tipos de página y colecciones (así escala a 100+ páginas)

Casi ningún sitio grande tiene 100 diseños distintos: tiene 5 a 8 **tipos** repetidos. Se diseña la plantilla una vez.

| Tipo | Qué es | En el starter |
|---|---|---|
| `home` | hero + secciones + CTA | `app/page.tsx` |
| `listing` | listado de una colección | `app/servicios/page.tsx` |
| `detail` | un ítem de la colección, ruta `[slug]` | `app/servicios/[slug]/page.tsx` |
| `contact` | contacto sin formulario (con formulario = escalón 2) | `app/contacto/page.tsx` |
| `legal` / `article` | texto largo; a partir de ~30 páginas editoriales, MDX | se añade al necesitarlo |

**Agregar un tipo o una colección:** (1) declarar la colección en `lib/site-map.ts`, (2) crear `content/<colección>/`, (3) copiar `listing` + `[slug]` y cambiar la plantilla, (4) añadir el tipo de dato en `lib/content.ts`. Nunca crear un archivo de contenido por página cuando la página es de una colección.

**Escala:** `lib/site-map.ts` es la fuente única; de ahí salen nav, pie, breadcrumbs, `sitemap.xml` y la comprobación. Generar por lotes: plantillas primero con 1 o 2 ítems por tipo, aprobarlas, y luego el resto desde los datos.

## 4 · Fase B — Página por página (diseño real)

Cuando llega el contenido real de una página o subsitio:
1. Leer el contenido y proponer la composición de secciones de esa página (un tipo del catálogo o uno nuevo justificado).
2. Reemplazar el relleno en `content/…`; crear/ajustar secciones en `components/sections/` (un componente por pieza, props desde `content/`).
3. Aplicar las reglas del design system con la tabla de §6.
4. Pasar la compuerta de esa página (§7) y mostrarla en el navegador a 375 y 1280 px.
5. Si la sección pide un recurso isométrico o una variante nueva, solo con el bar de `references/isometric.md`.

## 5 · Assets: estructura y reglas

```
public/brand/            logotipos (dark, white, blue), og.png      app/icon.svg   favicon oficial
public/images/<colección o página>/    hero.webp, <slug>.webp
public/icons/            SVG propios (lucide-react por defecto)      public/docs/   PDFs
components/{layout,sections,ui,iso}/   por responsabilidad          content/       textos y rutas de imagen + alt
```
- Logos: archivos oficiales vía `<Logo variant>`. Nunca `<symbol>` incrustado ni texto.
- Imágenes: archivos locales con `next/image` (ancho/alto, `alt` desde `content/`). **Nunca** base64, `data:` ni enlaces remotos. Las que el insumo solo enlaza se descargan a `public/images/…` **con OK del usuario** (origen y tamaño).
- Imagen faltante: placeholder local en la ruta definitiva; se reemplaza el archivo sin tocar código.
- Escenas isométricas y `module-field` son componentes, no assets. Fuentes con `next/font`.
- Un asset, un lugar: si se usa en dos páginas, se referencia, no se duplica. Nombres en minúsculas con guiones.

## 6 · Tabla de enlaces: decisión → regla exacta

| Decisión | Dónde está |
|---|---|
| Colores, tipografía, radios, motion, tokens | `templates/tokens.css` · `references/tokens.md` |
| Clases y utilities (Tailwind-first) | `references/tailwind-api.md` |
| Layout: 12 columnas, auto, hairline | `references/grids.md` |
| Estructura de una landing/hero/secciones | `references/websites.md` |
| Botones, hero, nav CTA | `references/tokens.md` (Botones) · `websites.md` |
| Movimiento, module field, reduced motion | `references/motion.md` |
| Foco, contraste, estados, a11y | `references/ux-a11y.md` |
| Recursos isométricos | `references/isometric.md` · `templates/iso/` |
| Dashboards / paneles dentro del sitio | `references/dashboards.md` |
| Stack Next.js, i18n, deploy | `references/site-dev.md` |
| Logo, favicon | `SKILL.md` §7a |
| Overflow y anti-bugs | `SKILL.md` §7c · reglas UX 10–18 |

## 7 · Compuerta obligatoria antes de entregar

1. `npm run build` sin errores y `npm run check` en verde (enlaces internos, assets, `alt`, sin `data:`/imágenes remotas).
2. **Cada tipo de página** abierto a 375 y 1280 px (más las páginas que el comprobador marque): sin overflow horizontal, anclas con el nav sticky, drawer funcional, foco visible.
3. Checklist del `SKILL.md` §6: logo oficial, `module-field` en el hero, `lift`/`card-glow` con padding, un solo idioma y `lang` correcto, solo tokens.
4. **Informe corto:** qué se construyó, qué es relleno, qué escalón se eligió y por qué, y qué NO se revisó visualmente (en sitios grandes se revisa por muestra y por reglas automáticas).

## 8 · Qué evitar (sobreingeniería)

- Un archivo de contenido por página cuando es una colección. Navegación escrita a mano. Rutas fuera de `site-map.ts`.
- Subir de escalón "por si acaso" (API, i18n, CMS) sin que el insumo lo pida.
- Componentes para algo que usa una sola página; abstracciones sin segundo uso.
- Documentar o implementar lo que no cambia el resultado visible ni el mantenimiento.
