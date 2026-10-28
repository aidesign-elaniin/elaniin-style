# Mantenimiento del sitio

> Documento para la empresa. Responde cómo se mantiene este sitio, quién lo hace, con qué flujo y cómo se revierte un cambio.
> Lo que dice `PENDIENTE:` aún no está definido.

## Qué es
- Sitio: **PENDIENTE: nombre**
- Hecho con: Next.js (export estático) + Tailwind v4 + el design system de Elaniin.
- Cada página sale de archivos de texto (`src/content/`); no hay base de datos ni panel.
- **El CMS es Claude Code**: el contenido se agrega y cambia pidiéndoselo, y queda guardado en git.

## Quién lo mantiene
- **PENDIENTE: persona 1** · **PENDIENTE: persona 2 (opcional)**
- Trabajan con Claude Code y la skill `elaniin:elaniin-style`. Nadie más edita el sitio.

## Cómo se hace un cambio
1. Se abre el repo con Claude Code (la skill se carga por `CLAUDE.md`).
2. Se pide el cambio en lenguaje natural (ejemplos abajo). Claude trabaja en una rama.
3. Claude corre los chequeos automáticos (`npm run build && npm run check`).
4. La persona responsable revisa el resultado en pantalla (1280, 768 y 375 px).
5. Se guarda como un commit con mensaje claro.
6. Publicación: **PENDIENTE: depende del hosting**.

## Qué revisa el sistema antes de aceptar un cambio
Rutas, sitemap y páginas consistentes; un solo `h1` por página; sin enlaces rotos; sin colores ni medidas fuera del design system; sin texto de relleno sin marcar. Si algo falla, el cambio no se da por terminado.

## Cambios comunes: qué pedir
| Necesidad | Pedido de ejemplo |
|---|---|
| Cambiar un texto o precio | "Cambia el precio del plan Pro a $49" |
| Agregar un ítem (servicio, caso…) | "Agrega el servicio X con este texto…" |
| Página nueva | "Agrega la página /equipo/ con estas secciones…" |
| Cambiar una imagen | "Reemplaza la imagen del hero por esta" |
| Sección nueva en una página | "Agrega una sección de estadísticas al inicio" |
| Pasar relleno a texto real | "Estos textos ya son finales: quita la marca de relleno" |

## Cómo se revierte un cambio
Cada cambio es un commit. Para deshacer uno:

```bash
git log --oneline          # encontrar el commit
git revert <commit>        # deshace ese cambio y conserva el historial
```

Después se publica igual que cualquier cambio (paso 6). No se borra historial.

## Cómo correrlo
```bash
npm ci
npm run dev       # http://localhost:3000
npm run build && npm run check
```
Detalle de dónde vive cada cosa: `README.md`.

## Hosting y dominio
- **PENDIENTE:** proveedor, dominio, cómo se publica, quién tiene acceso.

## Si la persona que lo mantiene se va
1. Dar acceso al repo y a **PENDIENTE: hosting**.
2. La persona nueva instala Claude Code y la skill, abre el repo y lee este archivo y `README.md`.
3. Primer cambio de prueba: algo pequeño en una rama, con los chequeos en verde.

## Historial de cambios
`git log --oneline`. Cada commit es un cambio.
