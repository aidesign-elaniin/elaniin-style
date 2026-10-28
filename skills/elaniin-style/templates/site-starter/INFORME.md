# Informe de entrega

> Plantilla: se llena al terminar el proyecto maestro y se entrega junto con el sitio.

## Escalón y stack
Una línea: qué escalón se eligió y por qué (por defecto, Next.js estático con `output: "export"` y `trailingSlash: true`).

## Qué es real y qué es relleno
| Ruta | `content` | Qué es real | Qué es relleno |
|---|---|---|---|

## Decisiones a revisar
-

## Qué se revisó visualmente
- 1280, 768 y 375 px: (páginas)
- Overflow horizontal medido en TODAS las páginas a 375 y 768 (`scripts/overflow.html`): (resultado)
- `npm run build` y `npm run check`: (resultado)

## Qué NO se revisó
- reduced-motion, foco con Tab, contraste, páginas no vistas una por una.

## Avisos
- `/legal/` redirige a su primera hija con JS/meta refresh (export estático, sin servidor).
