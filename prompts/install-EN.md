# Install prompt — English (copy & paste into Claude)

> Instructions for a non-technical user. Paste everything inside the code block into
> Claude (claude.ai chat, Claude Code, or any agent). Claude will run the install and
> verify it for you.

```
I want you to install the "Elaniin Style" skill on my machine and confirm it works.

Steps:
1. Run this command in a terminal and show me the result:
   curl -fsSL https://elaniin-style.netlify.app/install.sh | bash
2. If the command fails because of network or permissions, tell me exactly what failed
   and give me the manual alternative:
   git clone https://github.com/danielpineda-elaniin/elaniin-style.git
   and then run: bash elaniin-style/install.sh
3. After a successful install, verify that the file exists:
   ./.claude/skills/elaniin-style/SKILL.md
4. Tell me the skill is ready and that I should restart my Claude session (or open a
   new project) for it to load.
5. Do not ask me to install anything else. If the skill later needs the "motion"
   library in a project, run its script silently:
   bash ./.claude/skills/elaniin-style/scripts/ensure-motion.sh

Once installed, I want to be able to say things like:
- "Create a pitch deck in the Elaniin style for my fintech startup"
- "Design a dashboard in the Elaniin style with our Q4 metrics"
- "Build a landing page in the Elaniin style"

Confirm you understood everything before starting.
```
