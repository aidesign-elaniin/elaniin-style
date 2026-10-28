# Fuente de verdad: DESIGN.md / Source of truth

El design system vive en el `DESIGN.md` del repositorio del sitio Elaniin 2027, **no en este plugin**.
La skill replica sus tokens, componentes y reglas; si algo aquí contradice a ese archivo, gana ese archivo.

| | |
|---|---|
| Repositorio | `https://github.com/roger-elaniin/elaniin-2027-website` |
| Archivo | `DESIGN.md` (y `src/app/globals.css`, `src/components/ui/iso/`) |
| Versión implementada por el plugin | **v1.86.2** |
| Commit contra el que se sincronizó | `65653e9` (28 oct 2026) |

## Pendiente de adoptar

La referencia ya está en **v1.87.2** (commit `5fa8a6c`): trae tres **íconos oficiales de Elaniin** (software, AI y cloud) que
sustituyen a los de Lucide en las soluciones y en las losas del recurso isométrico del hero. Su propio `DESIGN.md` lo marca
como "to be validated applied", así que el plugin sigue usando los íconos genéricos de Lucide hasta que se valide. Los SVG
fuente están en `public/assets/icons/` del repositorio del sitio (son activos de marca: irían en `assets/`, bajo su licencia reservada).

## Cómo actualizar

1. Clona o actualiza el repositorio del sitio y compara el *Change log* de `DESIGN.md` desde el commit de la tabla.
2. Aplica lo que sea genérico (tokens, utilities, reglas) a `templates/tokens.css` y a las referencias; `python3 scripts/build-docs.py` regenera las copias.
3. Cambia la versión y el commit de esta tabla, y el encabezado de `SKILL.md`, `README.md` y `tokens.css`.
4. `python3 scripts/check-design-source.py` dice si la referencia se movió desde el commit fijado (informativo; `--strict` sale con código 1).
