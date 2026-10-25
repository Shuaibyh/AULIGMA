# AULIGMA — Guía del repositorio

## Identidad

El nombre oficial y único del proyecto es **AULIGMA**.

AULIGMA es una plataforma educativa inteligente para la gestión de aulas universitarias, generación asistida de evaluaciones matemáticas mediante IA, verificación de procedimientos y reforzamiento del aprendizaje.

Todo el contenido propio del proyecto debe redactarse en español y mantener esta identidad.

## Estado y alcance

- Inspecciona el repositorio antes de asumir un stack o una arquitectura.
- La presencia de documentación, prompts y skills no implica que ya exista una aplicación frontend o backend.
- No inventes archivos, servicios, integraciones, datos reales ni resultados de verificaciones.
- Conserva los datos de ejemplo como sintéticos y claramente identificados.
- No realices commits ni despliegues salvo solicitud explícita.

## Fuentes de trabajo

- Sistema de diseño: `docs/UI_UX_SISTEMA_DISENO.md`.
- Prompt inicial de diseño: `prompts/00_DISENO_PROFESIONAL_UI_UX.md`.
- Skill de producto: `.agents/skills/auligma-ui-ux/SKILL.md`.
- Skills externas disponibles: `.agents/skills/frontend-design/SKILL.md` y `.agents/skills/web-design-guidelines/SKILL.md`.

No modifiques las skills externas al actualizar contenido propio de AULIGMA. Usa rutas relativas a la raíz del repositorio y verifica que existan antes de documentarlas.
