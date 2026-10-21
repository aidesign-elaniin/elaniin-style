# elaniin-style

**Elaniin design system as a Claude plugin.** Bilingüe EN/ES.
Decks, dashboards & reports, websites & landings en el estilo Elaniin 2027.

Documentación completa (equipo y devs): https://aidesign-elaniin.github.io/elaniin-style/ ([`docs/index.html`](docs/index.html)).

---

## Instalar / Install

Una sola vía: **plugin de Claude** desde este repositorio (marketplace `elaniin-style-marketplace`).

### Equipo (sin terminal) / Team (no terminal)

1. Claude → **Customize → Plugins**.
2. **Add → Add marketplace** → pega la dirección completa: `https://github.com/aidesign-elaniin/elaniin-style` (repositorio público, sin cuenta de GitHub).
3. **Discover → elaniin-style → Add**.
4. Activa **Sync automatically** para recibir actualizaciones solas.

### Devs (Claude Code)

```bash
claude plugin marketplace add https://github.com/aidesign-elaniin/elaniin-style
claude plugin install elaniin-style@elaniin-style-marketplace
```

> **Usa siempre la misma dirección (la URL completa)** en la app, la CLI y los settings. Mezclar
> `owner/repo` con la URL da el error *“network source differs”*. Arreglo:
> `claude plugin marketplace remove elaniin-style-marketplace` y vuelve a agregarlo con la URL.

Repo compartido: commitea en `.claude/settings.json`

```json
{
  "extraKnownMarketplaces": {
    "elaniin-style-marketplace": {
      "source": { "source": "git", "url": "https://github.com/aidesign-elaniin/elaniin-style.git" },
      "autoUpdate": true
    }
  },
  "enabledPlugins": { "elaniin-style@elaniin-style-marketplace": true }
}
```

## Actualizar / Update

El plugin **no define `version`**: cada commit de este repo es una versión nueva.
Con `autoUpdate` activo se descarga solo unos minutos después de abrir una sesión; la
sesión en curso aplica el cambio con `/reload-plugins` o al reiniciar.

```bash
claude plugin update elaniin-style@elaniin-style-marketplace
```

Auto-update obligatorio para toda la organización: `autoUpdate: true` en *managed settings*
(ver la sección 09 de la documentación).

## Usar / Use

Claude carga la skill cuando el pedido encaja, o invócala con
`/elaniin-style:elaniin-style`:

- "Crea un pitch deck de Serie A con el estilo Elaniin"
- "Diseña un dashboard con nuestras métricas de Q4, estilo Elaniin"
- "Construye una landing para nuestro producto con el estilo Elaniin"

**Modos:** `deck` · `dashboard` · `website` · `site-dev`

Los entregables son un HTML autocontenido con Tailwind v4 (`@tailwindcss/browser@4.3.3`) y
tokens `@theme`/`@utility` embebidos: se editan a mano con clases de Tailwind. Inventario
clase → token en `skills/elaniin-style/references/tailwind-api.md`.

## Qué contiene / What's inside

```
.claude-plugin/           marketplace.json + plugin.json
docs/index.html           landing de instalación y documentación (+ templates de muestra)
scripts/build-docs.py     regenera docs/ desde los templates: `python3 scripts/build-docs.py`
scripts/make-og.py        regenera la imagen para compartir `docs/og.png`
skills/elaniin-style/
├── SKILL.md              pipeline de 5 fases, routing, UX core
├── assets/               logos oficiales y favicon
├── references/           tokens, tailwind-api, motion, ux-a11y, websites, decks, dashboards, site-dev…
├── scripts/              ensure-motion.sh (instala motion en silencio si hay package.json)
└── templates/            tokens.css, landing.html, dashboard.html, deck.html, motion-presets.ts,
                          module-field.js / module-field.tsx (textura interactiva del hero)
```

## No negociables / Non-negotiables

- **Logo oficial siempre** (`assets/`), nunca el brand como texto.
- **Cero overflow:** decks 16:9 con canvas fijo; nada se corta.
- **Siempre vivo:** spotlight reactivo + microinteracciones, todo apagable con `prefers-reduced-motion`.
- **Textura firma:** `module-field` (cuadritos que se encienden con el mouse) en el hero y el CTA de toda landing. Pídela como "textura interactiva" o "module field".
- **Solo tokens:** colores, tipos, radios, sombras y duraciones salen de `@theme`.

Fuente de verdad / Source of truth: `DESIGN.md` v1.45 (Elaniin 2027 site).

## License

MIT
