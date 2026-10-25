import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import { Badge, EmptyState, MathBlock, PageHeading } from "../components/ui";
import { useDemo } from "../state/DemoContext";
import type { Question } from "../state/academic";

export function QuestionBank() {
  const { bank, classrooms } = useDemo();
  const [params, setParams] = useSearchParams();
  const query = params.get("buscar") || "",
    topic = params.get("tema") || "",
    state = params.get("estado") || "";
  const classroom = classrooms.find((c) => c.id === params.get("aula"));
  function filter(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }
  const shown = bank.filter(
    (q) =>
      (q.text + " " + q.topic)
        .toLocaleLowerCase()
        .includes(query.toLocaleLowerCase()) &&
      (!topic || q.topic === topic) &&
      (!state || q.state === state),
  );
  const context = classroom ? `?aula=${classroom.id}` : "";
  return (
    <>
      <PageHeading
        eyebrow="RECURSOS / PREGUNTAS"
        title="Banco de preguntas"
        description="Busca, revisa y prepara preguntas reutilizables. Contenido sintético."
        action={
          <Link
            className="button primary"
            to={`/docente/evaluaciones/nueva${context}`}
          >
            Crear evaluación <ArrowRight size={17} />
          </Link>
        }
      />
      {classroom && (
        <div className="context-strip">
          <Link to={`/docente/aulas/${classroom.id}`}>
            ← {classroom.name} · Sección {classroom.section}
          </Link>
          <span>Banco compartido · Aula de destino seleccionada</span>
        </div>
      )}
      <div className="filter-bar">
        <label className="filter-search">
          Buscar pregunta
          <div className="search-field">
            <Search size={18} />
            <input
              value={query}
              onChange={(e) => filter("buscar", e.target.value)}
              placeholder="Enunciado o tema…"
            />
          </div>
        </label>
        <label>
          Tema
          <select
            value={topic}
            onChange={(e) => filter("tema", e.target.value)}
          >
            <option value="">Todos los temas</option>
            {[...new Set(bank.map((q) => q.topic))].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          Estado de revisión
          <select
            value={state}
            onChange={(e) => filter("estado", e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option>Revisada</option>
            <option>Pendiente de revisión</option>
          </select>
        </label>
      </div>
      <p className="results-count" role="status">
        {shown.length} preguntas encontradas
      </p>
      <div className="question-list">
        {shown.map((q, i) => (
          <article className="question-row" key={q.id}>
            <span className="row-number">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <div className="meta-row">
                <span>{q.topic}</span>
                <Badge tone={q.state === "Revisada" ? "green" : "amber"}>
                  {q.state}
                </Badge>
              </div>
              <h2>
                <Link to={`/docente/banco/${q.id}${context}`}>{q.text}</Link>
              </h2>
              <MathBlock formula={q.formula} />
            </div>
            <Link
              className="button secondary"
              to={`/docente/banco/${q.id}${context}`}
            >
              Ver y editar <ArrowRight size={16} />
            </Link>
          </article>
        ))}
      </div>
      {!shown.length && (
        <EmptyState title="No hay preguntas con esos filtros">
          Prueba otro tema o{" "}
          <button
            className="text-link"
            onClick={() => setParams(classroom ? { aula: classroom.id } : {})}
          >
            limpia los filtros
          </button>
          .
        </EmptyState>
      )}
    </>
  );
}
export function QuestionDetail() {
  const { id } = useParams();
  return <QuestionDetailContent key={id} />;
}
function QuestionDetailContent() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const { bank, setBank } = useDemo();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const q = bank.find((item) => item.id === id);
  if (!q)
    return (
      <EmptyState title="Pregunta no disponible">
        <Link to="/docente/banco">Volver al banco</Link>
      </EmptyState>
    );
  const context = params.get("aula")
    ? `?aula=${encodeURIComponent(params.get("aula")!)}`
    : "";
  function update(patch: Partial<Question>) {
    setBank((all) =>
      all.map((item) =>
        item.id === id
          ? { ...item, ...patch, state: "Pendiente de revisión" }
          : item,
      ),
    );
    setReviewed(false);
    setError("");
  }
  async function approve() {
    if (!q) return;
    if (
      !q.text.trim() ||
      !q.formula.trim() ||
      q.options.some((o) => !o.trim()) ||
      !q.rule.trim() ||
      q.steps.some((s) => !s.trim()) ||
      !q.recommendation.trim() ||
      q.errors.some((e, i) => i !== q.correct && !e.trim())
    ) {
      setError(
        "Completa el enunciado, las alternativas, la regla, los pasos y las explicaciones de error.",
      );
      return;
    }
    if (new Set(q.options.map((o) => o.trim())).size !== 4) {
      setError("Las cuatro alternativas deben ser diferentes.");
      return;
    }
    try {
      const { default: katex } = await import("katex");
      for (const formula of [q.formula, ...q.options])
        katex.renderToString(formula, { throwOnError: true, trust: false });
      setBank((all) =>
        all.map((item) =>
          item.id === id ? { ...item, state: "Revisada" } : item,
        ),
      );
      setEditing(false);
      setError("");
    } catch {
      setError("Revisa la sintaxis LaTeX de la fórmula y de las alternativas.");
    }
  }
  return (
    <>
      <Link className="text-link" to={`/docente/banco${context}`}>
        ← Banco de preguntas
      </Link>
      <PageHeading
        eyebrow={`${q.topic.toUpperCase()} / PREGUNTA DE DEMOSTRACIÓN`}
        title="Detalle de pregunta"
        description="Los cambios se conservan en memoria durante esta sesión. Editar exige una nueva revisión."
        action={
          <button
            className="button secondary"
            onClick={() => setEditing(!editing)}
          >
            {editing ? "Ver pregunta" : "Editar pregunta"}
          </button>
        }
      />
      <div className="detail-grid">
        <section className="panel">
          <Badge tone={q.state === "Revisada" ? "green" : "amber"}>
            {q.state}
          </Badge>
          {editing ? (
            <div className="form-stack question-edit">
              <label>
                Enunciado
                <textarea
                  value={q.text}
                  onChange={(e) => update({ text: e.target.value })}
                />
              </label>
              <label>
                Tema
                <select
                  value={q.topic}
                  onChange={(e) => update({ topic: e.target.value })}
                >
                  {["Derivadas", "Límites", "Integrales"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label>
                Fórmula LaTeX
                <input
                  value={q.formula}
                  onChange={(e) => update({ formula: e.target.value })}
                />
              </label>
              <MathBlock formula={q.formula} />
              {q.options.map((o, i) => (
                <label key={i}>
                  Alternativa {"ABCD"[i]}
                  <input
                    value={o}
                    onChange={(e) =>
                      update({
                        options: q.options.map((value, j) =>
                          j === i ? e.target.value : value,
                        ),
                      })
                    }
                  />
                </label>
              ))}
              <label>
                Respuesta correcta
                <select
                  value={q.correct}
                  onChange={(e) => update({ correct: Number(e.target.value) })}
                >
                  {q.options.map((_, i) => (
                    <option key={i} value={i}>
                      Alternativa {"ABCD"[i]}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Regla matemática
                <textarea
                  value={q.rule}
                  onChange={(e) => update({ rule: e.target.value })}
                />
              </label>
              {q.steps.map((step, i) => (
                <label key={i}>
                  Paso {i + 1}
                  <textarea
                    value={step}
                    onChange={(e) =>
                      update({
                        steps: q.steps.map((s, j) =>
                          i === j ? e.target.value : s,
                        ),
                      })
                    }
                  />
                </label>
              ))}
              {q.errors.map(
                (reason, i) =>
                  i !== q.correct && (
                    <label key={i}>
                      Explicación del error {"ABCD"[i]}
                      <textarea
                        value={reason}
                        onChange={(e) =>
                          update({
                            errors: q.errors.map((s, j) =>
                              i === j ? e.target.value : s,
                            ),
                          })
                        }
                      />
                    </label>
                  ),
              )}
              <label>
                Recomendación
                <textarea
                  value={q.recommendation}
                  onChange={(e) => update({ recommendation: e.target.value })}
                />
              </label>
            </div>
          ) : (
            <>
              <h2>{q.text}</h2>
              <MathBlock formula={q.formula} />
              <ol className="option-preview" type="A">
                {q.options.map((o, i) => (
                  <li key={i}>
                    <MathBlock formula={o} block={false} />
                    {i === q.correct && <Badge tone="green">Respuesta</Badge>}
                  </li>
                ))}
              </ol>
              <h3>Regla matemática</h3>
              <p>{q.rule}</p>
              <ol className="solution-steps">
                {q.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </>
          )}
        </section>
        <aside>
          <div className="panel">
            <h2>Revisión docente</h2>
            <p className="muted">
              Revisa también las alternativas y el desarrollo. No existe un
              motor de validación matemática.
            </p>
            {q.state !== "Revisada" && (
              <>
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={reviewed}
                    onChange={(e) => setReviewed(e.target.checked)}
                  />
                  He comprobado manualmente enunciado, respuesta y explicación.
                </label>
                <button
                  className="button primary"
                  disabled={!reviewed}
                  onClick={approve}
                >
                  Marcar revisada · demo
                </button>
              </>
            )}
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <Link
              className="text-link"
              to={`/docente/evaluaciones/nueva${context}${context ? "&" : "?"}pregunta=${q.id}`}
            >
              Usar en evaluación <ArrowRight size={16} />
            </Link>
          </div>
          <p className="notice">
            Las evaluaciones publicadas conservan una copia de las preguntas.
            Una edición posterior no altera esa copia.
          </p>
        </aside>
      </div>
    </>
  );
}
