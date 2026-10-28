# Reglas para Claude Code en este sitio

Este sitio se mantiene con Claude Code y la skill `elaniin:elaniin-style`. Léela antes de cualquier cambio. Guía de mantenimiento: `MAINTENANCE.md` (para personas) y `references/maintenance.md` de la skill (recetario).

**Tú eres el CMS de este sitio.** Agregar o cambiar contenido es tu trabajo: no propongas un panel ni un CMS externo.

## Siempre
1. Cargar la skill `elaniin:elaniin-style` antes de editar.
2. Trabajar en una rama (`cambio/<qué>`), nunca directo en la principal.
3. Textos en `src/content/`, rutas en `src/lib/site-map.ts`, piezas en `src/components/`. Un cambio de texto no toca componentes.
4. Antes de dar un cambio por terminado: `npm run build && npm run check` en verde.
5. Un commit por cambio, con mensaje claro.
6. Si el pedido repite una tarea que no está en `MAINTENANCE.md`, agregarla a su tabla de cambios comunes.

## Nunca
- Colores crudos, valores arbitrarios (`max-w-[…]`, `gap-[…]`) ni CSS suelto: solo tokens.
- Editar `src/styles/tokens.css` a mano.
- Desactivar o saltar `npm run check`.
- `git reset --hard` ni `git push --force` sobre la rama principal. Para deshacer: `git revert`.
- Inventar hosting, dominio, mantenedores, cifras o textos de clientes. Lo desconocido queda como `PENDIENTE:` o como relleno marcado.
- Subir de escalón (formularios, API, idiomas) sin justificarlo por escrito y esperar el OK.
- Migrar una colección a MDX sin proponerlo primero y esperar el OK.

## Página nueva
Mostrar primero la fila nueva del mapa del sitio (ruta, tipo, colección, contenido) y esperar OK antes de crearla.
