# Dashboards & Reports / Dashboards y Reportes

> Template base: `templates/dashboard.html`. Insumo: `saas_screens_skill.md`.
> Principio: densidad de datos con calma; navy solo como acento de estructura, no de fondo.

## Layout estándar

```
┌─ Sidebar (240px, blanco, hairline right) ─┬─ Topbar (64px, hairline bottom) ────────┐
│  Logo (sidebar fija, 100dvh)              │  Título página · Export · acción       │
│  Nav items (icono 16px + label body-sm)   ├────────────────────────────────────────┤
│  · activo: marcador elevate-blue 2px o    │  KPI row (4 cards hairline)            │
│    bg blue-tint-50 + texto ink            │  ┌────┐ ┌────┐ ┌────┐ ┌────┐           │
│                                           │  │ 4  │ │ 12%│ │ $3k│ │ 98 │           │
│                                           │  └────┘ └────┘ └────┘ └────┘           │
│                                           │  Chart principal (2/3) · Side list(1/3)│
│                                           │  Tabla de datos hairline               │
└───────────────────────────────────────────┴────────────────────────────────────────┘
```

Mobile (<1024px): la sidebar pasa a **drawer** (`drawer` + `scrim` + `templates/drawer.js`),
abierto con un botón hamburguesa de 44px (`aria-expanded`, Esc, scrim y foco de regreso).
Topbar a 375px: hamburguesa + **título** (prioridad, trunca al final) + acciones solo-icono
(`aria-label`) bajo `md`; el logo vive en la cabecera del drawer. KPIs 1 col <640, 2 col ≥640,
4 col ≥1280; charts full-width; tabla con scroll horizontal dentro de su card.

## Un dashboard es funcional, no una maqueta (obligatorio)
La **sidebar está fija**: `position: sticky; top: 0; height: 100dvh` (la utility `drawer` a `lg+`),
con el nav scrolleando por dentro si es largo; solo el contenido de la página hace scroll. El pie
legal vive **pegado a la esquina inferior de la sidebar como una franja fina de una línea**
(Privacy · Terms a la izquierda, © año a la derecha, 44px de alto): siempre visible, nunca al fondo
de la página.

Un dashboard **no es un SaaS**: no lleva bloque de usuario/cuenta (avatar, nombre, rol) ni
planes, billing ni selector de workspace en la sidebar. El pie de la sidebar es **legal**
(Privacy · Terms · © año), y esos enlaces abren vistas reales.

1. **Cada ítem del nav abre una vista real.** Router por hash (`#/overview`, `#/revenue`…):
   una `<div data-view>` por ruta, `aria-current="page"` en el enlace activo, `h1` y
   `document.title` que cambian, foco movido a `<main tabindex="-1">`, scroll arriba, el
   drawer se cierra al elegir. Ruta desconocida → Overview. El skip link `#main` no cambia de vista.
   Prohibido `href="#"` en la navegación.
2. **Cada vista tiene contenido y controles que funcionan**, con datos de muestra en un solo
   objeto JS fácil de reemplazar. Vistas mínimas: Overview, una por cada ítem del nav
   (p. ej. Revenue con rango 3M/6M/12M, Customers con búsqueda + filtros + orden por columna +
   detalle en `<dialog>`, Products, Reports con crear/descargar/borrar, Settings con formulario
   que guarda en `localStorage` y reinicia) y las páginas legales.
3. **Botones de la topbar reales:** Export descarga la data de la vista actual (CSV o JSON
   según Settings) y se **deshabilita** donde no hay datos; New report abre un diálogo.
4. **Estados completos:** vacío (“No accounts match…”), cargando (`spinner`), éxito/error
   (toast con `role="status"`, error de campo con `role="alert"`), `aria-sort` en columnas
   ordenables, `<dialog>` nativo (Esc, foco de regreso) y `m-auto` (el preflight lo resetea).
5. **Una vista oculta usa `hidden`** (fuera de árbol de accesibilidad y de tab order).
6. Todo con los tokens y utilities del plugin: `side-link`, `field`, `switch` (ver
   `tailwind-api.md`), `grid-page`/`grid-auto`, `pad-card`.

## Sin eyebrows
Los headings de cards y secciones van solos. Los labels mono son solo de dato (caption de KPI,
estado, encabezado de tabla, grupo de navegación), nunca encima de un título.

## Grids
KPIs y charts se arman con `grid-page` + `col-span-12 sm:col-span-6 xl:col-span-3` /
`xl:col-span-8|4`; listas de conteo desconocido con `grid-auto`. Detalle: `references/grids.md`.

## Componentes

### KPI card
- Blanco, `border hairline`, `radius-card 12px`, `pad-card 32px`.
- Mono-label uppercase (categoría) → número `display` o `h2` con `tabular-nums` →
  delta (↑ verde / ↓ rojo, texto + icono, nunca solo color).
- Delta en `success-text` / `error-text` con dot.

### Tabla
- Header: mono-label uppercase, `border-bottom strong`.
- Filas: hairline `border-default`; hover `blue-tint-50` o `inspire-grey`.
- Números alineados a la derecha, tabular-nums.
- Selected row: marcador elevate-blue 2px izquierdo o bg `blue-tint-50`.
- Estados de fila vacía / loading / error con copy claro.

### Charts
- Series: 1ª elevate-blue; después blue-300, blue-200, greys. `dynamic-blue` para tintes.
- Grid lines hairline `border-default`; ejes `border-strong`.
- Sin 3D, sin gradientes de área pesados; área con fill 8–12% de opacidad.
- Tooltip: card con sombra `menu`, mono-label para serie.
- Leyenda con dots 8px + label body-sm.

### Filtros / tabs
- Tabs: underline 2px elevate-blue + texto ink (activo); muted los inactivos.
- Selects/inputs: `border-input`, radius 6px, focus ring.

### Sidebar
- Items 40px height, radius 6px, icono 16px + label.
- Activo: bg `blue-tint-50`, texto `#141414`, marcador elevate-blue.
- Secciones con mono-label uppercase separadas por hairline.

## Banda oscura en reportes
En reportes ejecutivos (no dashboards operativos) se permite una banda excellence-blue:
- Resumen del hallazgo principal: texto `on-dark-secondary`, número display blanco,
  acento `on-dark-accent`.
- O una "insight card" oscura dentro de la grilla clara.

## Reglas

- **Logo oficial:** sidebar/topbar con `main-isologo-elaniin.svg` (superficie clara).
  Nunca el nombre escrito como texto.
- **Vivo por defecto:** microinteracciones obligatorias — KPIs con count-up al entrar en
  viewport, charts cuyo trazo se dibuje una vez, card glow al hover, filas de tabla con
  respuesta de hover. Ver `motion.md` §Living surfaces. Un dashboard plano no es Elaniin.
- **Living loop:** ≥1 dato vivo por dashboard (KPI en deriva cada 7s + redibujado del
  chart, `live-dot` en el header, todo gated por IntersectionObserver y estático bajo
  reduced-motion) — `motion.md` §Living mockups. CSS: `references/tailwind-api.md`.
- **Anti-overflow:** `min-w-0` en children de grid; tablas en `overflow-x-auto`;
  `break-words` en nombres largos; KPI numbers con `tabular-nums` y sin `nowrap` forzado.
- **Fondo de página:** blanco o inspire-grey, nunca navy en dashboards densos.
- **elevate-blue:** indicadores activos, primera serie, badges info. No más.
- **Sombras:** casi ninguna; hairlines dan estructura. Menús/tooltips: `menu`.
- **Vacios:** nunca pantalla en blanco; skeleton o mensaje + CTA de acción.
- **Números:** siempre unidades y período ("$12.4k · Oct", no "$12.4k" solo).
- **Idioma:** todo el copy en EN o ES según el usuario.

## Checklist de dashboard

- [ ] Jerarquía: KPIs → tendencia → detalle → acciones.
- [ ] Todo dato tiene label, período y unidad.
- [ ] Estados vacíos, loading, error diseñados.
- [ ] Tabla usable con teclado; charts con aria-label descriptivo.
- [ ] Cada ítem del nav abre una vista real (probado ruta por ruta); sin `href="#"`; sin bloque de usuario, pie legal.
- [ ] Export, New report y los controles de cada vista funcionan; vacíos, toasts y diálogos probados.
- [ ] Mobile sin pérdida crítica de datos.
- [ ] La hamburguesa abre el drawer (probado); topbar legible a 375px; targets ≥44px; probado en 375/768/1280.
- [ ] ≥1 dato vivo (deriva de KPI + redibujado del chart + `live-dot`): pausa fuera de
      pantalla; con reduced-motion el valor queda fijo en su estado final.
