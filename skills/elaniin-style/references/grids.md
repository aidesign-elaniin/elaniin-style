# Grids

> Tailwind ya trae `grid-cols-*`, `col-span-*`, `gap-*`, `@container`. Elaniin añade **cuatro
> utilities** que los conectan con sus tokens (ver `templates/tokens.css`). Usa siempre estas
> en vez de armar grids con valores sueltos.

| Clase | Qué es | Cuándo |
|---|---|---|
| `gap-grid` | `gap: var(--grid-gap)` (24px; 16px en móvil) | cualquier grid/flex que no use las de abajo |
| `grid-page` | 12 columnas + `gap-grid` | layouts de **conteo fijo** (KPIs, feature rows, página con aside) |
| `grid-auto` | `auto-fit` con `--card-min` (16rem) + `gap-grid` | colecciones de **conteo desconocido** (cards, logos, resultados) |
| `grid-hairline` | celdas con líneas de 1px compartidas, borde y radio externos | tablas visuales, stats, comparativas **sin hover de elevación** |

## Reglas (sin excepciones)

1. **Mobile primero, una columna.** En `grid-page` cada hijo lleva `col-span-12` y luego sube:
   `col-span-12 md:col-span-6 xl:col-span-3`.
2. **`min-w-0` en cada hijo** de grid/flex que contenga texto, media o tablas.
3. **Gap siempre del token** (`gap-grid`, o el que ya traen las utilities). Nada de `gap-[18px]`.
4. **Nunca márgenes negativos** (`-mx-*`) para alinear bordes ni hover: es el bug clásico.
5. **Si una celda tiene `lift`/`card-glow`, es una card**: `rounded-card border bg-surface-card pad-card`
   dentro de un `grid-page`/`grid-auto`. **No** uses `grid-hairline` con `lift` (el `overflow:hidden`
   recorta la sombra).
6. **`grid-hairline`:** las celdas llevan `pad-card`; define columnas con `grid-cols-N` /
   `md:grid-cols-N` para que la última fila quede completa (por defecto es 1 columna).
7. **Deck:** el canvas siempre mide 1280 px → columnas explícitas (`grid-cols-3`), nunca
   `md:`/`lg:` ni `grid-auto`.
8. **Breakpoints del proyecto:** `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280. No existen otros.

## Recetas

### Página con aside (8 + 4)
```html
<section class="grid-page">
  <article class="col-span-12 min-w-0 xl:col-span-8">…chart…</article>
  <aside class="col-span-12 min-w-0 xl:col-span-4">…insight…</aside>
</section>
```

### Fila de KPIs (1 → 2 → 4)
```html
<section class="grid-page">
  <article class="col-span-12 min-w-0 rounded-card border border-border-default bg-surface-card pad-card sm:col-span-6 xl:col-span-3">…</article>
  <!-- ×4 -->
</section>
```

### Cards de conteo desconocido
```html
<ul class="grid-auto" style="--card-min: 14rem">
  <li class="min-w-0 rounded-card border border-border-default bg-surface-card pad-card">…</li>
</ul>
```
`--card-min` cambia el ancho mínimo de cada card; el navegador decide cuántas caben.

### Stats / comparativa con hairlines
```html
<div class="grid-hairline grid-cols-2 md:grid-cols-4">
  <div class="pad-card">…</div>
  <!-- ×4: la última fila queda completa -->
</div>
```

### Bento (una celda destacada)
```html
<section class="grid-page">
  <article class="col-span-12 min-w-0 rounded-card bg-excellence-blue pad-card text-white md:col-span-8 md:row-span-2">…</article>
  <article class="col-span-12 min-w-0 rounded-card border border-border-default pad-card md:col-span-4">…</article>
  <article class="col-span-12 min-w-0 rounded-card border border-border-default pad-card md:col-span-4">…</article>
</section>
```
Una sola celda en excellence-blue por bento; elevate-blue solo en detalles.

### Sidebar + contenido
Dashboard: la sidebar es el `drawer` (ver `ux-a11y.md`); el contenido va en `<main>` con
`p-4 md:p-6` y dentro un `grid-page`. No uses `grid` para la sidebar: ya es `flex`.

### Componente que se adapta a su contenedor
```html
<div class="@container">
  <div class="grid gap-grid @md:grid-cols-2 @xl:grid-cols-3">…</div>
</div>
```
`@container` mira el ancho del contenedor, no del viewport: úsalo en componentes reutilizables
(cards en un aside, widgets). Los tamaños `@md`, `@xl` son de Tailwind y no se afectan por el
reset de breakpoints.

## Auditoría rápida
```bash
grep -n -E '\-mx-|gap-\[|grid-cols-\[' archivo.html          # debe salir vacío
grep -n -E 'grid-hairline' archivo.html | grep -E 'lift|card-glow'  # debe salir vacío
```
