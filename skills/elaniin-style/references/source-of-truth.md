# Fuente de verdad: DESIGN.md / Source of truth

El design system vive en el `DESIGN.md` del repositorio del sitio Elaniin 2027, **no en este plugin**.
La skill replica sus tokens, componentes y reglas; si algo aquí contradice a ese archivo, gana ese archivo.

| | |
|---|---|
| Repositorio | `https://github.com/roger-elaniin/elaniin-2027-website` |
| Archivo | `DESIGN.md` (y `src/app/globals.css`, `src/components/ui/iso/`) |
| Versión implementada por el plugin | **v1.87.2** |
| Commit contra el que se sincronizó | `5fa8a6c` (28 oct 2026) |

## Adoptado en v1.87

Los **tres íconos oficiales de Elaniin** (software, AI y cloud) sustituyen a los de Lucide en las losas del recurso isométrico del
hero. Son los íconos de las **soluciones de Elaniin** y del detalle de AI; todo lo demás (flechas, cerrar, personas, etc.) sigue en Lucide.
Los SVG fuente están en `assets/icons/` (activos de marca, bajo su licencia reservada). Se dibujan al 90 % alrededor del centro de la
celda de 24 con el trazo dividido por 0.9, para conservar el peso de línea del sistema (React: `templates/iso/elaniin-icons.tsx`; HTML:
el mapa `ICONS` de `templates/iso-stack.js`). El `DESIGN.md` de la referencia aún los marca "to be validated applied": si la validación
cambia algo, se ajusta aquí.

## Cómo actualizar

1. Clona o actualiza el repositorio del sitio y compara el *Change log* de `DESIGN.md` desde el commit de la tabla.
2. Aplica lo que sea genérico (tokens, utilities, reglas) a `templates/tokens.css` y a las referencias; `python3 scripts/build-docs.py` regenera las copias.
3. Cambia la versión y el commit de esta tabla, y el encabezado de `SKILL.md`, `README.md` y `tokens.css`.
4. `python3 scripts/check-design-source.py` dice si la referencia se movió desde el commit fijado (informativo; `--strict` sale con código 1).
