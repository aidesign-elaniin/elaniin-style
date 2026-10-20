# Prompt de instalación — Español (copiar y pegar)

> Instrucciones para una persona no técnica. Pega todo lo que está dentro del bloque
> de código en Claude (chat de claude.ai, Claude Code, o cualquier agente). Claude
> ejecutará la instalación y la verificará por ti.

```
Quiero que instales la skill "Elaniin Style" en mi máquina y confirmes que funciona.

Pasos:
1. Ejecuta este comando en una terminal y muéstrame el resultado:
   curl -fsSL https://elaniin-style.netlify.app/install.sh | bash
2. Si el comando falla por red o permisos, dime exactamente qué falló y dame la
   alternativa manual:
   git clone https://github.com/danielpineda-elaniin/elaniin-style.git
   y luego ejecuta: bash elaniin-style/install.sh
3. Después de una instalación exitosa, verifica que exista el archivo:
   ./.claude/skills/elaniin-style/SKILL.md
4. Avísame que la skill está lista y que debo reiniciar mi sesión de Claude (o abrir
   un proyecto nuevo) para que se cargue.
5. No me pidas instalar nada más. Si más adelante la skill necesita la librería
   "motion" en un proyecto, ejecuta su script en silencio:
   bash ./.claude/skills/elaniin-style/scripts/ensure-motion.sh

Una vez instalada, quiero poder decir cosas como:
- "Crea un pitch deck con el estilo Elaniin para mi startup de fintech"
- "Diseña un dashboard con el estilo Elaniin con nuestras métricas de Q4"
- "Construye una landing page con el estilo Elaniin"

Confirma que entendiste todo antes de empezar.
```
