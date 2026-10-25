# AULIGMA

Plataforma educativa inteligente para la gestión de aulas universitarias, generación asistida de evaluaciones matemáticas y reforzamiento del aprendizaje.

## Estado

Frontend funcional de Fase 1.1, con identidad «Geometría razonada». Incluye aulas, importación demostrativa, banco editable y filtrable, configuración y publicación simulada de evaluaciones, revisión de ejercicios y práctica con retroalimentación paso a paso. Todo utiliza datos sintéticos.

## Desarrollo local

Requisito: Node.js 24 LTS y npm. Desde la raíz del proyecto:

```powershell
npm.cmd ci
npm.cmd run dev
```

Abre la dirección que imprime Vite, normalmente http://127.0.0.1:5173. Elige «Soy docente» o «Soy estudiante». No se solicitan credenciales. La configuración docente vive en memoria y se restablece al recargar. Las respuestas de práctica se conservan por actividad en `sessionStorage` durante la pestaña; el reinicio requiere confirmación. Si el navegador bloquea el almacenamiento se usa memoria y se informa de la limitación.

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd run test:e2e
```

Las pruebas usan Google Chrome instalado en el equipo mediante Playwright. Las capturas se generan en `test-results/visual/` y `test-results/fase-1-1/` y no se versionan. Para servir la compilación, ejecuta `npm.cmd run preview` después del build.

## Organización

- `src/App.tsx`: rutas, bienvenida y estructura por rol.
- `src/pages/`: experiencias docentes, importación, revisión documental y estudiante.
- `src/components/`: componentes compartidos, diálogo accesible Radix y matemáticas KaTeX.
- `src/state/`: estado tipado de demostración, aulas, grupos, revisión, respuestas y tema.
- `src/styles.css`: tokens, tipografía, temas y reglas adaptativas; Tailwind se integra con Vite.
- `src/refinements.css`: refinamientos de densidad, componentes académicos y modo concentración.
- `src/state/academic.ts`: preguntas preparadas, modelos de evaluación y requisitos de publicación.
- `public/`: favicon original de AULIGMA.
- `tests/`: pruebas funcionales, accesibilidad automatizada y capturas en tres tamaños.
- `docs/FASE_1.md`: alcance, decisiones y evidencia de verificación.
- `docs/FASE_1_1.md`: mejoras funcionales, revisión matemática y verificación del refinamiento.

## Alcance de la simulación

La selección de Excel o PDF utiliza únicamente el nombre del archivo. Su contenido no se lee ni se envía: se abre una muestra sintética fija. La transcripción es editable y sus estados de verificación y aprobación son demostrativos. Las explicaciones matemáticas están preparadas para tres preguntas; no hay IA ni motor matemático.

No se implementan backend, autenticación, bases de datos, conexión con Moodle ni calificaciones reales. Publicar requiere preguntas revisadas, fechas coherentes, aula, título, reglas y confirmación. Se conserva una copia local de las preguntas. Las prácticas publicadas aparecen en el perfil estudiantil ficticio; fechas e intentos son configuración demostrativa. La modalidad Evaluación no ejecuta exámenes reales. Las publicaciones creadas en memoria dejan de estar disponibles al recargar, aunque sus respuestas queden en la pestaña.

Revisa `AGENTS.md`, `docs/UI_UX_SISTEMA_DISENO.md` y `prompts/00_DISENO_PROFESIONAL_UI_UX.md` antes de ampliar el producto. Las Skills externas se mantienen intactas.

> No publicar datos personales de estudiantes, archivos privados ni credenciales.
