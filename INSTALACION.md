# Preparar AULIGMA en VS Code + Codex

1. Descomprime este proyecto directamente dentro de una carpeta raíz llamada `AULIGMA/`, conservando las rutas incluidas y evitando crear carpetas intermedias adicionales.
2. Comprueba que existan:
   - `AULIGMA/AGENTS.md`
   - `AULIGMA/.agents/skills/auligma-ui-ux/SKILL.md`
   - `AULIGMA/.agents/skills/frontend-design/SKILL.md`
   - `AULIGMA/.agents/skills/web-design-guidelines/SKILL.md`
   - `AULIGMA/docs/UI_UX_SISTEMA_DISENO.md`
   - `AULIGMA/prompts/00_DISENO_PROFESIONAL_UI_UX.md`
3. Reinicia una sesión de Codex para detectar la skill. En el chat de Codex escribe `$` o `/skills` para localizarla si tu versión lo admite.
4. Las skills requeridas ya están incluidas en `.agents/skills/`. No reinstales ni sobrescribas `frontend-design` o `web-design-guidelines` salvo que se decida actualizar sus fuentes de forma explícita.
5. Desde la raíz de AULIGMA, ejecuta en Codex: `Lee AGENTS.md y ejecuta solamente prompts/00_DISENO_PROFESIONAL_UI_UX.md. Usa $auligma-ui-ux y, cuando correspondan, $frontend-design y $web-design-guidelines. No desarrolles funcionalidades backend ni autenticación; primero el diseño.`

Este repositorio puede contener únicamente documentación, prompts y skills. La preparación no presupone que ya exista código frontend o backend.

Documentación de referencia:
- https://learn.chatgpt.com/docs/build-skills
- https://github.com/vercel-labs/agent-skills
- https://github.com/vercel-labs/open-agents/blob/main/.agents/skills/frontend-design/SKILL.md
