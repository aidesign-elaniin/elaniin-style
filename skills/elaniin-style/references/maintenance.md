# Mantenimiento del sitio / Site maintenance

> Un sitio hecho con el modo `site` lo mantienen **1 o 2 personas con Claude Code y esta skill**. **El CMS es Claude Code**: él edita el contenido, git es el historial y `npm run check` es el control de calidad. No se construye ni se recomienda otro CMS ni panel.
> Este archivo es la guía de **Claude** para dejar el mantenimiento resuelto al entregar y para ejecutarlo después. Plantillas: `templates/site-starter/MAINTENANCE.md` y `templates/site-starter/CLAUDE.md`.

## 1 · Al entregar un sitio (obligatorio)

1. Copiar `MAINTENANCE.md` y `CLAUDE.md` del starter a la raíz del sitio (ya vienen con el starter; no borrarlos).
2. Llenar en `MAINTENANCE.md` solo lo que se sabe: nombre del sitio, escalón y stack, mantenedores (si el usuario los dio). **Lo que no se sabe queda como `PENDIENTE:`** (hosting, dominio, personas). No se inventa.
3. Enumerar en `MAINTENANCE.md` las colecciones reales del sitio (leer `src/lib/site-map.ts`).
4. Mencionar `MAINTENANCE.md` en el informe de entrega.

## 2 · Principios

- **Todo cambio pasa por la skill.** Se carga `elaniin:elaniin-style` antes de tocar el sitio: sin CSS suelto, sin valores arbitrarios, sin colores crudos.
- **Contenido separado del código.** Textos en `src/content/`, rutas en `src/lib/site-map.ts`, piezas en `src/components/`. Un cambio de texto no toca componentes.
- **Una rama por cambio, un commit por cambio.** El historial de git es el registro de cambios.
- **Compuerta antes de dar por terminado:** `npm run build && npm run check` en verde. Si falla, se corrige; no se desactiva la regla.
- **Nada se publica sin que la persona responsable lo apruebe** (revisión visual o vista previa).

## 3 · Flujo de un cambio

1. `git switch -c cambio/<qué>` desde la rama principal actualizada.
2. Pedir el cambio a Claude Code en lenguaje natural.
3. Claude edita usando el recetario (§4) y la skill.
4. `npm run build && npm run check`. Verde o se corrige.
5. Si el cambio es visual: revisar 1280 / 768 / 375 px; opcional `python3 <plugin>/scripts/browser-check.py out`.
6. Commit con mensaje claro (`contenido: precio plan Pro`, `página: nueva /casos/`).
7. Publicar: **PENDIENTE: depende del hosting** (vista previa, merge, deploy). Hasta definirlo, el cambio queda en la rama principal y se publica con el proceso que el equipo defina.

Revertir: `git revert <commit>` (deshace ese cambio y conserva el historial). Nunca `reset --hard` ni `push --force` sobre la rama principal.

## 4 · Recetario (qué pedir y qué hace Claude)

| Pedido | Qué hace Claude | Dónde |
|---|---|---|
| Cambiar un texto o precio | Edita el valor | `src/content/<página>.ts` |
| Agregar un ítem a una colección (servicio, caso, artículo) | Añade el ítem; la ruta `[slug]`, el menú y el sitemap salen solos | `src/content/<colección>.ts` |
| Pasar relleno a texto real | Reemplaza el texto y pone `placeholder: false` | `src/content/…` |
| Agregar una página nueva | Muestra primero la fila nueva del mapa del sitio y espera OK; después la agrega con su tipo (§3 de `site-architect.md`) | `site-map.ts` + `src/app/` |
| Personalizar UNA página | Ruta fija `app/<colección>/<slug>/page.tsx`; deja el ítem en `content/` | ver README |
| Agregar una sección a una página | Usa una pieza existente de `components/sections/`; si no hay, crea una con tokens | `src/components/sections/` |
| Cambiar una imagen | Reemplaza el archivo en la misma ruta, o cambia `src` y `alt` | `public/images/` |
| Agregar una colección nueva | Copia `app/servicios/` (listado + `[slug]`) y declara la colección | `site-map.ts` |
| Cambiar colores o tipografía | **No se edita a mano.** Se regenera desde la fuente de verdad (`references/source-of-truth.md`) | `tokens.css` |
| Agregar formulario o idioma | Sube de escalón: se justifica por escrito antes de hacerlo | `site-architect.md` §1 |
| Actualizar dependencias | `npm outdated`, subir una a la vez, `npm ci` + build + check; commit aparte | `package.json` |

Si el pedido no está en la tabla, Claude lo resuelve con la skill y **agrega la receta** a este recetario del sitio (`MAINTENANCE.md`) cuando se repita.

## 5 · Cuándo el contenido se pasa a MDX

Señal: una colección editorial (artículos, casos, docs) cuyos cuerpos ya no caben cómodos en un arreglo de cadenas: texto largo, imágenes intercaladas, citas o tablas dentro del cuerpo. Claude lo **propone** al usuario con la razón en una línea y espera el OK; no migra solo. Una colección editorial nueva nace en MDX. Detección, instalación, recetas y migración: `references/mdx.md`.

## 6 · Traspaso

`MAINTENANCE.md` debe bastar para que una persona nueva tome el sitio en una hora: qué es, cómo se corre, cómo se cambia algo, cómo se revierte, qué revisa la compuerta. Si falta algo de eso, se completa antes de entregar.

## 7 · Qué NO hacer

- Proponer un panel o un CMS externo (Sanity, Keystatic, WordPress…): el CMS es Claude Code.
- Prometer un flujo de publicación que no está definido.
- Inventar el hosting, el dominio o los mantenedores.
- Desactivar o saltar `npm run check` para publicar.
- Editar `tokens.css` a mano.
- Cambios grandes en una sola rama sin commits intermedios.
