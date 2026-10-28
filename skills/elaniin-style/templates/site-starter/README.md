# Sitio Elaniin (starter)

Next.js (export estático) + Tailwind v4 con el design system de Elaniin.

## Comandos
```bash
npm ci              # versiones exactas del package-lock.json (usa `npm install` solo para añadir dependencias)
npm run dev        # http://localhost:3000
npm run build      # genera el sitio estático en out/
npm run check      # compuerta: sitemap, páginas, h1, enlaces, marcas de relleno, reglas
```
Antes de entregar: `npm run build && npm run check` en verde.

Mantenimiento (quién, flujo, cómo revertir): `MAINTENANCE.md`. Reglas para Claude Code: `CLAUDE.md`.

## Dónde vive cada cosa
| Qué | Dónde |
|---|---|
| Todas las rutas (menú, pie, migas, sitemap salen de aquí) | `src/lib/site-map.ts` |
| Textos de una página | `src/content/<página>.ts` |
| Grupos de páginas repetidas (colecciones) | `src/content/<colección>.ts` |
| Plantillas de página | `src/app/<ruta>/page.tsx` |
| Piezas | `src/components/{layout,sections,ui}/` |
| Logotipo (símbolos) | `src/components/layout/logo-sprite.tsx`; archivos oficiales en `public/brand/` |
| Imágenes | `public/images/` (el placeholder se reemplaza sin renombrar) |
| Tokens del design system | `src/styles/tokens.css` (no tocar a mano) |

Importes relativos, sin alias `@/`. El texto de relleno se marca en pantalla con el chip "Texto de relleno".

## Agregar una página a una colección
1. Añade el ítem a `src/content/<colección>.ts` (`placeholder: true` mientras sea relleno).
2. Listo: la ruta `[slug]` ya existe y `site-map.ts` la incluye en menú, pie, migas y sitemap.

## Personalizar UNA sola página
1. Crea `src/app/<colección>/<slug>/page.tsx`: una ruta fija gana sobre `[slug]`.
2. Deja el ítem en `src/content/<colección>.ts` para que `site-map.ts` lo siga listando.
3. Cuando su texto pase a real, pon `placeholder: false`.

## Agregar una colección nueva
Declara la colección en `site-map.ts`, crea `src/content/<colección>.ts`, copia `app/servicios/` (listado + `[slug]`) y cambia la plantilla.

## Revisar overflow en todas las páginas
```bash
cp scripts/overflow.html out/ && npx serve out   # abre /overflow.html: mide 375 y 768 px con iframes
```

Metodología completa: `references/site-architect.md` del plugin.
