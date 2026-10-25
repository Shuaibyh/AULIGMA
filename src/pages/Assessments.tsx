import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";
import {
  Badge,
  EmptyState,
  MathBlock,
  Modal,
  PageHeading,
} from "../components/ui";
import { useDemo } from "../state/DemoContext";
import { publicationIssues, type Assessment } from "../state/academic";
export function Assessments() {
  const { assessments, classrooms } = useDemo();
  const [params] = useSearchParams();
  const classroomId = params.get("aula");
  const rows = assessments.filter(
    (a) => !classroomId || a.classroomId === classroomId,
  );
  return (
    <>
      <PageHeading
        eyebrow="PLANIFICACIÓN / ACTIVIDADES"
        title="Evaluaciones"
        description="Configura actividades, revisa sus requisitos y simula su publicación."
        action={
          <Link
            className="button primary"
            to={`/docente/evaluaciones/nueva${classroomId ? `?aula=${encodeURIComponent(classroomId)}` : ""}`}
          >
            <Plus size={18} />
            Crear evaluación
          </Link>
        }
      />
      {classroomId && (
        <Link className="text-link" to="/docente/evaluaciones">
          Ver todas las aulas
        </Link>
      )}
      <div className="question-list">
        {rows.map((a) => (
          <article className="assessment-row" key={a.id}>
            <div>
              <div className="meta-row">
                <Badge
                  tone={
                    a.status === "Publicada"
                      ? "green"
                      : a.status === "Pendiente de revisión"
                        ? "amber"
                        : ""
                  }
                >
                  {a.status}
                </Badge>
                <span>
                  {a.mode} · {a.questionIds.length} preguntas
                </span>
              </div>
              <h2>{a.title || "Borrador sin título"}</h2>
              <p className="muted">
                {classrooms.find((c) => c.id === a.classroomId)?.name ||
                  "Aula sin asignar"}{" "}
                · Datos ficticios
              </p>
            </div>
            <Link
              className="button secondary"
              to={`/docente/evaluaciones/${a.id}`}
            >
              {a.status === "Publicada" ? "Ver publicación" : "Configurar"}
              <ArrowRight size={16} />
            </Link>
          </article>
        ))}
      </div>
      {!rows.length && (
        <EmptyState title="Todavía no hay evaluaciones">
          Crea una actividad para esta aula.
        </EmptyState>
      )}
    </>
  );
}
export function AssessmentEditor() {
  const { id } = useParams();
  return <AssessmentEditorContent key={id} />;
}
function AssessmentEditorContent() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { assessments, setAssessments, classrooms, bank } = useDemo();
  const [confirm, setConfirm] = useState(false);
  const [ack, setAck] = useState(false);
  const existing = assessments.find((a) => a.id === id);
  const [draft, setDraft] = useState<Assessment>(
    () =>
      existing || {
        id: crypto.randomUUID(),
        title: "",
        classroomId: params.get("aula") || "",
        questionIds: params.get("pregunta") ? [params.get("pregunta")!] : [],
        mode: "Práctica",
        start: "",
        end: "",
        attempts: 1,
        instructions: "",
        status: "Borrador",
      },
  );
  const [message, setMessage] = useState("");
  if (id !== "nueva" && !existing)
    return (
      <EmptyState title="Evaluación no disponible">
        <Link to="/docente/evaluaciones">Volver a evaluaciones</Link>
      </EmptyState>
    );
  const item = existing || draft;
  const locked = item.status === "Publicada";
  const issues = publicationIssues(
    item,
    bank,
    classrooms.map((c) => c.id),
  );
  const selected =
    (locked
      ? item.snapshot
      : bank.filter((q) => item.questionIds.includes(q.id))) || [];
  function update(patch: Partial<Assessment>) {
    setMessage("");
    setAck(false);
    const next = { ...item, ...patch, status: "Borrador" as const };
    setDraft(next);
    setAssessments((all) =>
      all.some((a) => a.id === next.id)
        ? all.map((a) => (a.id === next.id ? next : a))
        : [...all, next],
    );
  }
  function save(status: Assessment["status"]) {
    const next = { ...item, status };
    setAssessments((all) =>
      all.some((a) => a.id === next.id)
        ? all.map((a) => (a.id === next.id ? next : a))
        : [...all, next],
    );
    setMessage(
      status === "Borrador"
        ? "Borrador guardado en esta sesión."
        : "Evaluación pendiente de revisión.",
    );
    if (!existing)
      navigate(`/docente/evaluaciones/${next.id}`, { replace: true });
  }
  function publish() {
    const blockers = publicationIssues(
      item,
      bank,
      classrooms.map((c) => c.id),
    );
    if (blockers.length || !ack || item.status !== "Pendiente de revisión")
      return;
    const next = {
      ...item,
      status: "Publicada" as const,
      snapshot: structuredClone(selected),
    };
    setAssessments((all) => all.map((a) => (a.id === item.id ? next : a)));
    setConfirm(false);
    setMessage("Publicación simulada completada.");
  }
  return (
    <>
      <Link className="text-link" to="/docente/evaluaciones">
        ← Evaluaciones
      </Link>
      <PageHeading
        eyebrow="CONFIGURACIÓN ACADÉMICA"
        title={locked ? item.title : "Configurar evaluación"}
        description="Demostración local · Fechas de referencia en hora de Lima · Sin calificaciones oficiales."
      />
      {!locked && (
        <p className="save-note">
          Los cambios se conservan automáticamente en esta sesión. Recargar
          restablece la configuración docente.
        </p>
      )}
      <div className="evaluation-layout">
        <section className="panel">
          <div className="section-heading">
            <h2>{locked ? "Actividad publicada" : "Datos de la actividad"}</h2>
            <Badge
              tone={
                locked
                  ? "green"
                  : item.status === "Pendiente de revisión"
                    ? "amber"
                    : ""
              }
            >
              {item.status}
            </Badge>
          </div>
          <fieldset disabled={locked} className="form-stack">
            <label>
              Título
              <input
                required
                maxLength={100}
                value={item.title}
                onChange={(e) => update({ title: e.target.value })}
                placeholder="Por ejemplo, Repaso de derivadas…"
              />
            </label>
            <div className="form-grid">
              <label>
                Aula
                <select
                  value={item.classroomId}
                  onChange={(e) => update({ classroomId: e.target.value })}
                >
                  <option value="">Seleccionar aula</option>
                  {classrooms.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} · {c.section} · {c.period}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Modalidad
                <select
                  value={item.mode}
                  onChange={(e) =>
                    update({ mode: e.target.value as Assessment["mode"] })
                  }
                >
                  <option>Práctica</option>
                  <option>Evaluación</option>
                </select>
              </label>
            </div>
            <div className="form-grid">
              <label>
                Apertura
                <input
                  type="datetime-local"
                  value={item.start}
                  onChange={(e) => update({ start: e.target.value })}
                />
              </label>
              <label>
                Cierre
                <input
                  type="datetime-local"
                  value={item.end}
                  onChange={(e) => update({ end: e.target.value })}
                />
              </label>
            </div>
            <label>
              Intentos permitidos
              <input
                type="number"
                min={1}
                max={5}
                value={item.attempts || ""}
                onChange={(e) => update({ attempts: Number(e.target.value) })}
              />
            </label>
            <label>
              Reglas e instrucciones
              <textarea
                rows={3}
                value={item.instructions}
                onChange={(e) => update({ instructions: e.target.value })}
                placeholder="Indica cómo resolver la actividad…"
              />
            </label>
          </fieldset>
          <div className="section-heading">
            <h2>Preguntas ({item.questionIds.length})</h2>
            {!locked && (
              <Link
                className="text-link"
                to={`/docente/banco${item.classroomId ? `?aula=${item.classroomId}` : ""}`}
              >
                Abrir banco
              </Link>
            )}
          </div>
          {locked
            ? selected.map((q) => (
                <div className="selected-question" key={q.id}>
                  <strong>{q.text}</strong>
                  <MathBlock formula={q.formula} />
                </div>
              ))
            : bank.map((q) => (
                <label className="question-choice" key={q.id}>
                  <input
                    type="checkbox"
                    checked={item.questionIds.includes(q.id)}
                    onChange={(e) =>
                      update({
                        questionIds: e.target.checked
                          ? [...item.questionIds, q.id]
                          : item.questionIds.filter((key) => key !== q.id),
                      })
                    }
                  />
                  <span>
                    <strong>{q.text}</strong>
                    <span className="meta-row">
                      {q.topic}
                      <Badge tone={q.state === "Revisada" ? "green" : "amber"}>
                        {q.state}
                      </Badge>
                    </span>
                  </span>
                </label>
              ))}
          {!locked && (
            <div className="button-row">
              <button
                className="button secondary"
                onClick={() => save("Borrador")}
              >
                Guardar borrador
              </button>
              <button
                className="button primary"
                onClick={() => save("Pendiente de revisión")}
              >
                Enviar a revisión
              </button>
            </div>
          )}
          <p role="status" className="success-text">
            {message}
          </p>
        </section>
        <aside className="panel publication-checklist">
          <h2>
            {locked ? "Publicación de demostración" : "Antes de publicar"}
          </h2>
          {locked ? (
            <>
              <p>La actividad conserva una copia de sus preguntas revisadas.</p>
              <p className="muted">
                Fechas e intentos son configuración demostrativa: no se ejecutan
                restricciones de acceso ni exámenes productivos.
              </p>
              {item.mode === "Práctica" && (
                <Link
                  className="button primary"
                  to={`/estudiante/practica?actividad=${item.id}`}
                >
                  Vista de práctica
                  <ArrowRight size={16} />
                </Link>
              )}
            </>
          ) : (
            <>
              <p className="muted">
                Completa la configuración y comprueba el contenido antes de
                confirmar.
              </p>
              {issues.length ? (
                <ul className="issue-list">
                  {issues.map((issue) => (
                    <li key={issue}>{issue}</li>
                  ))}
                </ul>
              ) : (
                <p className="success-text">
                  ✓ Configuración completa y preguntas revisadas.
                </p>
              )}
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={ack}
                  onChange={(e) => setAck(e.target.checked)}
                />
                He revisado preguntas, fechas y reglas.
              </label>
              <button
                className="button primary"
                disabled={
                  !!issues.length ||
                  !ack ||
                  item.status !== "Pendiente de revisión"
                }
                onClick={() => setConfirm(true)}
              >
                Simular publicación
              </button>
              {item.status === "Borrador" && (
                <p className="small muted">
                  Envía primero el borrador a revisión.
                </p>
              )}
            </>
          )}
        </aside>
      </div>
      <Modal
        open={confirm}
        onOpenChange={setConfirm}
        title="Publicar actividad de demostración"
        description="Se creará una copia local de las preguntas. No se envían avisos ni se generan calificaciones."
      >
        <div className="button-row">
          <button
            className="button secondary"
            onClick={() => setConfirm(false)}
          >
            Volver a revisar
          </button>
          <button className="button primary" onClick={publish}>
            Confirmar publicación demo
          </button>
        </div>
      </Modal>
    </>
  );
}
