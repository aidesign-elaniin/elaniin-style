# elaniin-style

**Elaniin design system as an installable skill.** Bilingüe EN/ES.
Skill de diseño Elaniin instalable. Bilingüe EN/ES.

---

## What it does / Qué hace

Turns Claude (Code, Artifacts, or other agents) into a designer that speaks the
Elaniin 2027 language: decks, dashboards & reports, websites & landings — and
develops the Elaniin 2027 site itself.

Convierte a Claude (Code, Artifacts u otros agentes) en un diseñador que habla el
lenguaje Elaniin 2027: decks, dashboards & reports, websites & landings — y
desarrolla el sitio Elaniin 2027.

**Modes / Modos:** `deck` · `dashboard` · `website` · `site-dev`

---

## Install / Instalación

### Option A — One command (recommended) / Opción A — Un comando (recomendada)

Copy & paste into Claude. / Copia y pega en Claude:

- **English:** see [`prompts/install-EN.md`](prompts/install-EN.md)
- **Español:** ver [`prompts/install-ES.md`](prompts/install-ES.md)

The prompt tells Claude to run: / El prompt le indica a Claude que ejecute:

```bash
curl -fsSL https://elaniin-style.netlify.app/install.sh | bash
```

### Option B — Manual / Opción B — Manual

```bash
git clone https://github.com/danielpineda-elaniin/elaniin-style.git
cd elaniin-style
bash install.sh                # installs into ./.claude (current project)
bash install.sh --all          # user-level Claude + Codex
bash install.sh --codex        # Codex only
bash install.sh --project ~/my-app   # into a specific project
```

### Option C — Claude Code plugin marketplace / Opción C — Marketplace de plugin

```
/plugin marketplace add danielpineda-elaniin/elaniin-style
/plugin install elaniin-style@elaniin-style-marketplace
```

No Anthropic approval needed — it is your own marketplace.
No requiere aprobación de Anthropic — es tu propio marketplace.

### Uninstall / Desinstalar

```bash
bash uninstall.sh [--project <dir>] [--codex] [--all]
```

---

## Use it / Cómo usarla

After install + session restart, just ask in EN or ES:

- "Create a Series A pitch deck in the Elaniin style"
- "Design a dashboard with our Q4 metrics, Elaniin style"
- "Build a landing page for our product in the Elaniin style"
- "Change the hero section of the Elaniin site"

Después de instalar + reiniciar la sesión, pide en EN o ES:

- "Crea un pitch deck de Serie A con el estilo Elaniin"
- "Diseña un dashboard con nuestras métricas de Q4, estilo Elaniin"
- "Construye una landing page para nuestro producto con el estilo Elaniin"
- "Cambia el hero del sitio Elaniin"

---

## What's inside / Qué contiene

```
skills/elaniin-style/
├── SKILL.md              # pipeline 5 fases, routing, UX core
├── assets/               # logos oficiales Elaniin (isologo dark/white, wordmarks, favicon)
├── references/           # tokens, methodology, motion, ux-a11y,
│                         # websites, dashboards, decks, site-dev,
│                         # visual-references, search-keywords
└── templates/            # tokens.css, landing.html, dashboard.html,
                          # deck.html, motion-presets.ts
scripts/ensure-motion.sh  # instala motion en silencio si hay proyecto npm
install.sh / uninstall.sh
prompts/                  # prompts de instalación EN y ES
.claude-plugin/           # marketplace.json + plugin.json
```

## Non-negotiables / No negociables

- **Logo oficial siempre** (`assets/`), nunca el brand como texto.
- **Cero overflow:** decks full-screen 16:9 con canvas fijo y `overflow:hidden`;
  nada se corta en viewport, slides ni cards.
- **Siempre vivo:** textura/spotlight reactivo al mouse + microinteracciones
  (card glow, count-up, chart draw, botones con flecha) en cada propuesta;
  todo se apaga con `prefers-reduced-motion`.


---

## Design in one line / El diseño en una línea

White and grey carry the page · Excellence Blue (`#01172E`) carries the weight ·
Elevate Blue (`#1054FF`) appears only in fine details (<5% of the area) ·
Hairline grids divide · Motion is restrained and always respects reduced-motion.

Blanco y gris llevan la página · Excellence Blue (`#01172E`) lleva el peso ·
Elevate Blue (`#1054FF`) aparece solo en detalles finos (<5% del área) ·
Hairlines dividen · El movimiento es contenido y siempre respeta reduced-motion.

Source of truth / Fuente de verdad: `DESIGN.md` v1.45 (Elaniin 2027 site).

---

## Requirements / Requisitos

- `bash`, `curl`, `unzip` (for the piped installer / para el installer por piped).
- Claude Code, Claude Artifacts, or another agent that reads Agent Skills.
- No runtime dependency on any host: everything is self-contained.
- Sin dependencia de runtime con ningún host: todo es autocontenido.

## License

MIT
