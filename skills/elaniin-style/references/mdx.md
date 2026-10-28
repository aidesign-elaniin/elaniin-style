# Colecciones MDX / MDX collections

> Contenido editorial (artículos, casos, noticias, docs) escrito en archivos `.mdx`, uno por entrada, dentro del mismo sitio estático. **El CMS es Claude Code**: crea y edita los archivos (`references/maintenance.md`); no hay panel ni CMS externo.
> Template probado (build + `check` + `browser-check` en verde): `templates/mdx-collection/`.

## 1 · Cuándo (Claude lo detecta y lo propone)

El criterio es la **forma del contenido**, no el número de páginas.

| Señal | Decisión |
|---|---|
| Piden blog, artículos, noticias, casos de estudio, docs, changelog, recursos | Colección MDX desde el inicio |
| El diagrama o el insumo trae páginas repetidas con texto largo | Colección MDX |
| Una colección `.ts` tiene cuerpos con imágenes, citas, tablas o listas dentro del texto | **Proponer** migrarla a MDX (razón en una línea) y esperar OK |
| Servicios, equipo, legales, fichas cortas (resumen + 2 párrafos) | Se quedan en `.ts` (`src/content/<colección>.ts`) |

- **Fase A:** la colección MDX aparece en la tabla del mapa del sitio (columna Colección: `articulos (MDX)`). El OK del mapa cubre crearla.
- **Migrar una colección existente** siempre se propone antes.
- No hay umbral de páginas: con 3 artículos largos ya conviene MDX; con 40 fichas cortas, no.

## 2 · Cómo está hecho

```
src/content/articles/*.mdx        un archivo por entrada (frontmatter + cuerpo)
scripts/build-content.mjs         lee el frontmatter -> src/content/articles.generated.ts (se regenera solo en predev/prebuild)
src/mdx-components.tsx            cómo se ve cada elemento (tokens) + <Callout>
src/app/articulos/page.tsx        listado
src/app/articulos/[slug]/page.tsx detalle (importa el .mdx)
src/lib/site-map.ts               importa `items` del archivo generado: menú, migas y sitemap salen solos
```

El `.generated.ts` no se edita ni se commitea (`.gitignore`). `site-map.ts` solo lee el índice generado; el cuerpo se carga únicamente en la página de detalle.

### Frontmatter

```yaml
---
title: "Título"                   # obligatorio
summary: "Una o dos frases"       # opcional; no se inventa si no hay
date: 2026-10-28                  # obligatorio, YYYY-MM-DD; el listado va de más nuevo a más viejo
author: "Nombre"                  # opcional
placeholder: false                # obligatorio; true mientras el texto sea de relleno
image:                            # opcional; sin ella, placeholder local
  src: /images/articulos/portada.jpg
  alt: "Descripción de la imagen"
slug: otro-nombre                 # opcional; por defecto, el nombre del archivo
---
```

**Los valores que contienen `:` van entre comillas**; si no, el YAML falla (el script lo dice con el archivo).

### En el cuerpo
Markdown normal más `<Callout>…</Callout>`. Un `#` se pinta como `h2` (la página ya tiene su único `h1`). Imágenes: `![alt](/images/…)` con archivo local en `public/images/`; nunca remotas ni `data:`.

## 3 · Instalar en un sitio

Desde la raíz del sitio, con `<plugin>` = carpeta de la skill:

1. Copiar el template (no pisa nada del starter):
   ```bash
   cp -R <plugin>/templates/mdx-collection/. .
   ```
2. Dependencias:
   ```bash
   npm i @next/mdx @mdx-js/loader @mdx-js/react remark-frontmatter
   npm i -D @types/mdx gray-matter
   ```
3. `next.config.ts`:
   ```ts
   import createMDX from "@next/mdx";
   // …config igual que antes…
   const withMDX = createMDX({ options: { remarkPlugins: ["remark-frontmatter"] } }); // plugins por nombre: Turbopack
   export default withMDX(config);
   ```
4. `package.json` scripts: `"content": "node scripts/build-content.mjs"`, `"predev": "npm run content"`, `"prebuild": "npm run content"`.
5. `site-map.ts`: `import { items as articles } from "../content/articles.generated";` y en `collections`: `articles: { base: "/articulos/", label: "Artículos", items: articles, nav: true }`.
6. `.gitignore`: `*.generated.ts`.
7. `npm run build && npm run check` en verde. Reemplazar los 2 artículos de ejemplo por los reales o borrarlos.

**Otro nombre de colección** (p. ej. `casos`): renombrar `src/content/articles/` → `casos/`, `src/app/articulos/` → `casos/`, y ajustar `collections.articles` → `collections.casos`, `base` y `label` en los dos `page.tsx` y en `site-map.ts`. Varias colecciones MDX: una carpeta por cada una; el script las recorre todas.

## 4 · Mantenimiento de una colección MDX

| Pedido | Qué hace Claude |
|---|---|
| Agregar un artículo | Crea `src/content/<colección>/<slug>.mdx` con frontmatter completo (`placeholder: false` si el texto es final); `npm run build && npm run check` |
| Editar un artículo | Edita el `.mdx` |
| Cambiar la fecha o el orden | Cambia `date` |
| Quitar un artículo | Borra el `.mdx` (se revierte con `git revert`) |
| Imagen del artículo | Pone el archivo en `public/images/…` y la ruta + `alt` en `image` |
| Hay que reiniciar `npm run dev` | Solo al crear o borrar archivos; si no ve el cambio, `npm run content` |

## 5 · Migrar una colección `.ts` a MDX

1. Proponer y esperar OK.
2. Por cada ítem de `src/content/<c>.ts`: un `.mdx` con su frontmatter (`title`, `summary`, `image`, `placeholder`, `date` real o la de hoy marcada para revisar) y `body` como párrafos.
3. Instalar (§3), sustituir las plantillas de listado y detalle por las del template, borrar el `.ts`, cambiar el import de `site-map.ts`.
4. Las rutas no deben cambiar: comparar `out/sitemap.xml` antes y después.
5. `npm run build && npm run check`.

## 6 · Trampas

- **`:` sin comillas en el frontmatter** (`summary: Hola: mundo`) rompe el YAML.
- **`placeholder` falta o no es booleano:** el script falla; es a propósito, `check` lo compara con lo que se ve.
- **`# Título` dentro del cuerpo:** se degrada a `h2`; el `h1` único es el de la cabecera.
- **Imagen sin `alt`:** el script lo rechaza.
- **Plugins de remark/rehype en `next.config.ts`:** siempre por nombre (string), no importados, o Turbopack no los carga.
- **Tablas anchas:** ya van envueltas con scroll horizontal; no meter anchos fijos.

## 7 · Escala

MDX en git con Claude Code como editor no tiene tope de páginas: el costo de una entrada nueva es un archivo. No se propone un CMS externo; si el contenido necesitara datos en vivo (no solo archivos), eso es subir de escalón (`site-architect.md` §1) y se justifica por escrito.
