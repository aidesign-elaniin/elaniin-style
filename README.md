# elaniin-style

**Elaniin design system as a Claude plugin.** Bilingüe EN/ES.
Decks, dashboards & reports, websites & landings en el estilo Elaniin 2027.

Documentación completa (equipo y devs): https://aidesign-elaniin.github.io/elaniin-style/ ([`docs/index.html`](docs/index.html)).

---

## Instalar / Install

Una sola vía: **plugin de Claude** desde este repositorio (marketplace `elaniin-style-marketplace`).

### Equipo (sin terminal, sin cuenta de GitHub) / Team

1. En la app de Claude haz clic en tu nombre o correo (abajo a la izquierda) → **Settings** (o `⌘ ,`) y, en el grupo **Customize**, **Plugins**. En claude.ai también sirve https://claude.ai/customize/plugins.
2. Pulsa **Add → Add marketplace**.
3. Elige **Add from a repository**, pega en **URL** la dirección completa, siempre la misma, `https://github.com/aidesign-elaniin/elaniin-style` (repositorio público), y pulsa **Sync**. El aviso rojo es normal: Claude lo muestra con cualquier marketplace que no sea de Anthropic.
4. En **Discover** aparece la tarjeta **Elaniin style**: pulsa **Add** (cambia a **Added**). Luego ve a la pestaña **Yours** y haz clic en la tarjeta **Elaniin Style**. Queda en tu cuenta (chat, Cowork y Claude Code).
5. En la misma pestaña **Yours**, abre el marketplace de Elaniin y verifica que el switch **Update** esté activado. Si no lo está, actívalo para que el plugin siempre esté actualizado.
6. Úsalo: en un chat escribe `/`, luego `elaniin`, elige **Elaniin Style** y pide lo que necesites.

Si no ves **Add marketplace**, un administrador de tu plan de Claude controla si se permite: pídeselo.
En la pestaña **Code** del escritorio llega en la siguiente sesión (o con `/reload-plugins`).

### Devs (Claude Code)

```bash
claude plugin marketplace add https://github.com/aidesign-elaniin/elaniin-style
claude plugin install elaniin@elaniin-style-marketplace
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
  "enabledPlugins": { "elaniin@elaniin-style-marketplace": true }
}
```

## Actualizar / Update

El plugin **no define `version`**: cada commit de este repo es una versión nueva.
Con `autoUpdate` activo se descarga solo unos minutos después de abrir una sesión; la
sesión en curso aplica el cambio con `/reload-plugins` o al reiniciar.

```bash
claude plugin update elaniin@elaniin-style-marketplace
```

Auto-update obligatorio para toda la organización: `autoUpdate: true` en *managed settings*
(ver la sección 06 de la documentación).

## Usar / Use

Claude carga la skill cuando el pedido encaja, o invócala con
`/elaniin:elaniin-style`:

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
├── references/           tokens, tailwind-api, motion, ux-a11y, websites, site-architect, decks, dashboards, site-dev…
├── scripts/              ensure-motion.sh (instala motion en silencio si hay package.json)
└── templates/            tokens.css, landing.html, dashboard.html, deck.html, motion-presets.ts,
                          module-field.js / module-field.tsx (textura interactiva del hero),
                          iso-stack.js + iso/ (recurso isométrico del hero: HTML y React),
                          nav-theme.js (la barra adopta el color de la sección bajo ella),
                          site-starter/ (proyecto Next.js estático para sitios completos)
```

## No negociables / Non-negotiables

- **Logo oficial siempre** (`assets/`), nunca el brand como texto.
- **Cero overflow:** decks 16:9 con canvas fijo; nada se corta.
- **Siempre vivo:** spotlight reactivo + microinteracciones, todo apagable con `prefers-reduced-motion`.
- **Textura firma:** `module-field` (cuadritos que se encienden con el mouse) en el hero y el CTA de toda landing. Pídela como "textura interactiva" o "module field".
- **Solo tokens:** colores, tipos, radios, sombras y duraciones salen de `@theme`.

Fuente de verdad / Source of truth: `DESIGN.md` v1.86.2 (Elaniin 2027 site).

## License

MIT
