# Dashboards & Reports / Dashboards y Reportes

> Template base: `templates/dashboard.html`. Insumo: `saas_screens_skill.md`.
> Principio: densidad de datos con calma; navy solo como acento de estructura, no de fondo.

## Layout estándar

```
┌─ Sidebar (240px, blanco, hairline right) ─┬─ Topbar (64px, hairline bottom) ────────┐
│  Logo                                     │  Título página · búsqueda · avatar     │
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
- [ ] Mobile sin pérdida crítica de datos.
- [ ] La hamburguesa abre el drawer (probado); topbar legible a 375px; targets ≥44px; probado en 375/768/1280.
- [ ] ≥1 dato vivo (deriva de KPI + redibujado del chart + `live-dot`): pausa fuera de
      pantalla; con reduced-motion el valor queda fijo en su estado final.
