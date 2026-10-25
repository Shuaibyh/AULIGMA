# AULIGMA — Dirección visual y sistema de diseño v1

> Documento de especificación inicial, no mockups aprobados ni resultados de prueba. Es una propuesta para discusión previa a la implementación.

## 1. Posicionamiento

**Producto:** AULIGMA, plataforma educativa inteligente para la gestión de aulas universitarias, generación asistida de evaluaciones matemáticas mediante IA, verificación de procedimientos y reforzamiento del aprendizaje.

**Personalidad:** académico serio + producto tecnológico contemporáneo. Sobrio, elegante, amable, muy legible. Evitar estética infantil, glows masivos, gradientes exagerados y dashboards saturados.

**Públicos:** docentes universitarios, estudiantes con acceso individual y administrador. Objetivos principales: ahorrar tiempo al preparar actividades, facilitar la práctica matemática y ofrecer datos pedagógicos útiles.

**Principio rector:** primero claridad y confianza; después atractivo visual. La experiencia debería sentirse de nivel producto, no de plantilla genérica.

## 2. Diseño propuesto

### Colores semánticos

| Token | Claro (propuesto) | Oscuro (propuesto) | Uso |
|---|---|---|---|
| `--background` | `#F7F9FC` | `#0B1220` | Fondo general |
| `--surface` | `#FFFFFF` | `#111C2D` | Paneles/tarjetas |
| `--text-primary` | `#132237` | `#EAF1FB` | Texto principal |
| `--text-muted` | `#4C5D70` | `#B4C3D7` | Metadatos |
| `--primary` | `#3048B7` | `#8BA7FF` | Acción principal |
| `--accent` | `#087C86` | `#58D0D3` | Datos/gráficas destacados |
| `--border` | `#DCE4EF` | `#2A3B50` | Divisores |
| `--success` | `#16794C` | `#55D6A1` | Éxito |
| `--warning` | `#915A08` | `#F6C96E` | Revisión |
| `--danger` | `#B4233C` | `#FF8595` | Error |

Estas son **propuestas iniciales**, no sustituyen pruebas de contraste por combinación. Validar cada par texto/fondo.

### Tipografía

- Inter para contenido, navegación, tablas y controles.
- Plus Jakarta Sans para títulos, si el resultado y la carga visual lo justifican; si no, Inter en todo el sistema.
- KaTeX para expresiones matemáticas. Nunca rasterizar fórmulas como imágenes para el contenido central.
- Fallback: `system-ui, sans-serif`.
- Escala: hero 36–40px, h1 30–32px, h2 24px, h3 20px, cuerpo 16px, soporte 14px, etiquetas secundarias 12px.
- Interlineado: cuerpo 1.5–1.6; títulos 1.15–1.25. Prohibido usar texto diminuto para ahorrar espacio.

### Retícula y espaciados

- Unidad base de 4px; espaciados preferentes: 8, 12, 16, 24, 32, 48.
- Sidebar de escritorio: ~248px; ancho de contenido máximo recomendado: 1360px.
- Separación entre secciones: 24–32px; entre tarjetas: 16–24px.
- Radius: controles 10px, tarjetas 16px, modales 18px; sombras discretas.
- Bordes y estados coherentes, sin cajas innecesarias para cada oración.
- Tamaño táctil objetivo cercano o superior a 44×44 px para controles importantes.

### Accesibilidad y movimiento

- Objetivo WCAG 2.2 AA en pantallas clave.
- Focus visible, navegación por teclado, nombres accesibles y estados de error asociados al campo.
- Diseño comprobado a 390, 768 y 1440px; mantener zoom 200% sin pérdida crítica.
- Respeto a `prefers-reduced-motion`; animaciones funcionales de baja duración, nunca imprescindibles.
- No depender únicamente del color para diferenciar aciertos o fallos.

## 3. Navegación

### Docente
`Inicio · Mis aulas · Banco de preguntas · Evaluaciones · Informes · Ajustes`

En una aula: `Resumen · Estudiantes · Grupos (opcional) · Materiales · Evaluaciones · Resultados`

### Estudiante
`Mis actividades · Practicar · Mi progreso · Ayuda`

No mostrar a estudiantes páginas de docentes ni información individual de compañeros.

### Administrador
`Solicitudes docentes · Asignaturas · Seguridad y configuración`

## 4. Pantallas críticas a diseñar ANTES del backend completo

1. **Dashboard docente**: resumen realista sin cifras inventadas; pendientes y acción principal "Crear aula".
2. **Crear aula**: asignatura / periodo / sección / turno / reglas; creación en pocos pasos.
3. **Importador Excel Moodle**: archivo -> vista previa -> mapeo columnas -> detección de inconsistencias -> confirmación. Sin filtrar exclusivamente por grupo.
4. **Procesar PDF**: documento original a la izquierda; ejercicios identificados y transcripción editable a la derecha (diseño apilado en móvil).
5. **Editor de evaluación**: alternativas, indicador de verificación matemática, distractores, explicación y aprobación del docente.
6. **Portal estudiante**: acceso personal, lista de actividades con estado y fecha.
7. **Resolución matemática**: lectura clara de fórmula, alternativas accesibles, navegación y progreso; nunca mostrar la solución antes del momento permitido.
8. **Resultados y reforzamiento**: errores comunes con acceso a ejercicios recomendados; no atribuir mejoras causales sin pruebas.

## 5. UI kit

Componentes prioritarios: AppShell, Sidebar, MobileNav, PageHeader, Breadcrumbs, Buttons, Input, Select, Combobox, UploadDropzone, DataTable, EmptyState, ValidationAlert, ReviewBadge, MathBlock, QuestionCard, ProgressIndicator, Dialog, Toast y ChartPanel.

La implementación debe usar tokens centralizados. Evaluar `shadcn/ui` por accesibilidad y velocidad, personalizando el sistema visual en lugar de conservar el estilo predeterminado.

## 6. Flujo específico de IA

El resultado de un modelo de IA se considera **borrador**. Exigir tres estados claros:

- `Extraído`: contenido detectado y sin validar.
- `Verificado`: expresión y resultado comprobados en el alcance matemático admitido.
- `Aprobado`: revisado por docente, publicable.

Errores de OCR o soluciones no verificables deben mostrar corrección manual y evidencia de procedencia. La presentación debe inspirar confianza sin simular certeza.

## 7. Evidencias visuales y calidad

Antes de aprobar una fase visual, solicitar a Codex:

- Captura real de al menos: dashboard docente desktop, importador Excel desktop, editor PDF desktop y evaluación estudiante móvil.
- Revisión responsive 390/768/1440px y test de teclado.
- Comprobación de accesibilidad con herramientas disponibles y revisión manual.
- Lista de problemas detectados y correcciones realizadas.
- Confirmación de build, typecheck, lint y pruebas UI.

Si Codex carece de navegador, deberá informar limitación y **no inventar capturas**.

## 8. Alcance de primera iteración

Solo diseñar el sistema de diseño, UI kit y prototipos navegables de los cuatro flujos críticos. No construir toda la plataforma, ni cuentas reales, ni integración IA, ni persistencia en esta fase. Se revisará antes de implementar backend.
