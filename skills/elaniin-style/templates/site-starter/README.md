# Sitio Elaniin (starter)

Next.js (export estático) + Tailwind v4 con el design system de Elaniin.

## Para quien no programa
- **Textos:** están en la carpeta `content/`. Edita ahí (o pídele el cambio a Claude).
- **Páginas repetidas** (servicios, artículos…): un archivo `.json` por página en `content/<colección>/`.
- **Imágenes:** van en `public/images/<colección>/`. Cambia el archivo placeholder por el real sin renombrarlo.
- **Logos:** `public/brand/`. No se tocan.

## Comandos
```bash
npm install
npm run dev        # ver el sitio en http://localhost:3000
npm run build      # genera el sitio estático en out/
npm run check      # comprueba enlaces rotos, assets faltantes y alt
```

## Mapa
- `lib/site-map.ts` es la única lista de rutas; de ahí salen el menú, el pie y el sitemap.
- `components/` está por responsabilidad: `layout/`, `sections/`, `ui/`.
- Metodología completa: `references/site-architect.md` del plugin.
