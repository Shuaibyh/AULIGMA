# PROMPT — AULIGMA | FASE DE DISEÑO PROFESIONAL

Actúa como Principal Product Designer, Senior UI/UX Designer, Design Systems Architect, Senior Frontend Engineer y especialista en accesibilidad web.

Tu misión es convertir AULIGMA en un producto educativo universitario con calidad visual de software comercial, no en una plantilla de dashboard genérica. AULIGMA es una plataforma educativa inteligente para la gestión de aulas universitarias, generación asistida de evaluaciones matemáticas mediante IA, verificación de procedimientos y reforzamiento del aprendizaje.

## Preparación
1. Inspecciona el repositorio abierto, empezando por `AGENTS.md`.
2. Lee `docs/UI_UX_SISTEMA_DISENO.md` y la skill `.agents/skills/auligma-ui-ux/SKILL.md`.
3. Aplica las skills locales `auligma-ui-ux`, `frontend-design` y `web-design-guidelines` cuando correspondan a la tarea. No afirmes que fueron ejecutadas si no ocurrió.
4. Identifica tecnologías existentes y decisiones previas. Si todavía no hay aplicación, registra esa condición antes de proponer el stack; no presupongas frontend, backend ni sistemas de producción.

## Entregables de esta fase
- Propuesta fundamentada de identidad visual, tipografía, escala, paleta, espaciados, responsive, dark mode y componentes.
- Un design system reusable (tokens semánticos, componentes y estados).
- Prototipo navegable en React/TypeScript o el stack existente, **con datos sintéticos** y sin backend real, de estos flujos:
  A) dashboard docente;
  B) crear aula e importar Excel con revisión;
  C) subir PDF, visualizar ejercicio extraído y editar la transcripción;
  D) estudiante responde una pregunta de opción múltiple y recibe retroalimentación en modo práctica.
- Estados de carga, vacío, error, éxito, confirmación; modo claro/oscuro cuando sea razonable.
- Fórmulas con KaTeX, tipografía profesional, contraste y navegación teclado.
- Inspección visual real y capturas desktop/móvil si hay herramienta de navegador disponible.

## Criterios estrictos
- Arquitectura organizada y componentes reutilizables.
- Ningún botón decorativo: si no funciona, representar de forma explícita como prototipo.
- No fabricar datos de matrícula reales, métricas reales ni soluciones matemáticas supuestamente verificadas por IA.
- No copiar logos institucionales sin autorización.
- No saturar de gradientes, sombras, badges y dashboards de KPI sin función.
- No instalar decenas de paquetes ni iniciar backend, autenticación, IA real o bases de datos en esta fase.
- Ejecutar verificaciones disponibles y documentar resultados.

## Cierre
Informa decisiones visuales, pantallas, componentes, archivos y capturas generadas, pruebas realizadas, limitaciones y mejoras sugeridas. Detente y solicita revisión antes de desarrollar más fases. No commits ni despliegues.
