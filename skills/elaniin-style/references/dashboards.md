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

Mobile: sidebar → drawer; KPIs 2×2; charts full-width; tabla con scroll horizontal.

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
