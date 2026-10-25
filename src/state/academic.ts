export type Question = {
  id: string;
  topic: string;
  text: string;
  formula: string;
  options: string[];
  correct: number;
  state: "Pendiente de revisión" | "Revisada";
  rule: string;
  steps: string[];
  errors: string[];
  recommendation: string;
};
// Ejemplos preparados: sus desarrollos se revisan manualmente, sin servicios de IA.
export const preparedQuestions: Question[] = [
  {
    id: "derivada",
    topic: "Derivadas",
    text: "¿Cuál es la derivada de esta función?",
    formula: "f(x)=x^3-3x+2",
    options: ["3x^2-3", "3x^2+2", "x^2-3", "3x-3"],
    correct: 0,
    state: "Revisada",
    rule: "Linealidad y regla de la potencia: la derivada de xⁿ es n·xⁿ⁻¹.",
    steps: [
      "Deriva x³: multiplica por 3 y reduce el exponente a 2, obteniendo 3x².",
      "Deriva −3x: el resultado es −3. La derivada de la constante 2 es 0.",
      "Suma los términos: f′(x) = 3x² − 3.",
    ],
    errors: [
      "",
      "La constante 2 no permanece al derivar: su derivada es 0. Además, la derivada de −3x es −3.",
      "Al derivar x³ debes multiplicar por el exponente 3.",
      "El exponente de x³ se reduce a 2, no a 1.",
    ],
    recommendation:
      "Practica la regla de la potencia por separado antes de combinar términos.",
  },
  {
    id: "limite",
    topic: "Límites",
    text: "Calcula el siguiente límite.",
    formula: "\\lim_{x \\to 2}(x^2+1)",
    options: ["3", "4", "5", "6"],
    correct: 2,
    state: "Revisada",
    rule: "Continuidad de los polinomios: el límite coincide con el valor de la función.",
    steps: [
      "El polinomio x² + 1 es continuo en x = 2.",
      "Sustituye x por 2 y calcula el cuadrado: 2² = 4.",
      "Suma la constante: 4 + 1 = 5.",
    ],
    errors: [
      "Elevar al cuadrado significa multiplicar 2 por 2, no conservar el 2.",
      "Después de calcular 2² = 4 falta sumar 1.",
      "",
      "Revisa la suma final: 2² + 1 es 4 + 1, no 4 + 2.",
    ],
    recommendation:
      "Repasa la sustitución directa y el orden de las operaciones.",
  },
  {
    id: "integral",
    topic: "Integrales",
    text: "Encuentra una primitiva de la función.",
    formula: "\\int 2x\\,dx",
    options: ["2x^2+C", "x^2+C", "2+C", "x+C"],
    correct: 1,
    state: "Revisada",
    rule: "Regla de integración de potencias: ∫xⁿ dx = xⁿ⁺¹/(n + 1) + C, para n ≠ −1.",
    steps: [
      "Escribe 2x como 2·x¹ y conserva el factor 2.",
      "Aumenta el exponente a 2 y divide entre 2: 2·x²/2 = x².",
      "Añade C. Comprueba derivando x² + C: obtienes 2x.",
    ],
    errors: [
      "Al aumentar el exponente debes dividir por 2; el factor inicial se cancela.",
      "",
      "Has derivado en lugar de integrar. La integral debe ser una función cuya derivada sea 2x.",
      "La derivada de x + C es 1, no 2x. Debes aumentar el exponente.",
    ],
    recommendation: "Comprueba tus primitivas derivando el resultado.",
  },
];
export const initialBank: Question[] = [
  ...preparedQuestions,
  {
    ...preparedQuestions[0],
    id: "derivada-revision",
    text: "Revisa el procedimiento de una derivada polinómica.",
    state: "Pendiente de revisión",
  },
];
export type Assessment = {
  id: string;
  title: string;
  classroomId: string;
  questionIds: string[];
  mode: "Práctica" | "Evaluación";
  start: string;
  end: string;
  attempts: number;
  instructions: string;
  status: "Borrador" | "Pendiente de revisión" | "Publicada";
  snapshot?: Question[];
};
export const initialAssessments: Assessment[] = [
  {
    id: "repaso",
    title: "Comprender el cambio",
    classroomId: "calculo",
    questionIds: preparedQuestions.map((q) => q.id),
    mode: "Práctica",
    start: "2026-10-01T08:00",
    end: "2026-12-31T23:59",
    attempts: 1,
    instructions:
      "Resuelve a tu ritmo y consulta cada explicación después de comprobar la respuesta.",
    status: "Publicada",
    snapshot: preparedQuestions,
  },
  {
    id: "control",
    title: "Control de derivadas",
    classroomId: "calculo",
    questionIds: ["derivada-revision"],
    mode: "Evaluación",
    start: "",
    end: "",
    attempts: 1,
    instructions: "Revisa el procedimiento antes de enviar.",
    status: "Borrador",
  },
  {
    id: "repaso-limites",
    title: "Repaso de límites",
    classroomId: "calculo",
    questionIds: ["limite"],
    mode: "Práctica",
    start: "2026-10-01T08:00",
    end: "2026-12-31T23:59",
    attempts: 1,
    instructions: "Utiliza la sustitución directa y comprueba el resultado.",
    status: "Pendiente de revisión",
  },
];
export function publicationIssues(
  item: Assessment,
  bank: Question[],
  classroomIds: string[],
) {
  const issues: string[] = [];
  if (!item.title.trim()) issues.push("Escribe un título.");
  if (!classroomIds.includes(item.classroomId))
    issues.push("Selecciona un aula existente.");
  if (!item.questionIds.length)
    issues.push("Selecciona al menos una pregunta.");
  if (
    item.questionIds.some(
      (id) => !bank.some((q) => q.id === id && q.state === "Revisada"),
    )
  )
    issues.push("Revisa todas las preguntas seleccionadas en el banco.");
  if (
    !item.start ||
    !item.end ||
    !Number.isFinite(Date.parse(item.start)) ||
    !Number.isFinite(Date.parse(item.end))
  )
    issues.push("Completa las fechas de apertura y cierre.");
  else if (Date.parse(item.end) <= Date.parse(item.start))
    issues.push("El cierre debe ser posterior a la apertura.");
  if (
    !Number.isInteger(item.attempts) ||
    item.attempts < 1 ||
    item.attempts > 5
  )
    issues.push("Configura entre 1 y 5 intentos.");
  if (!item.instructions.trim())
    issues.push("Describe las reglas de la actividad.");
  return issues;
}
