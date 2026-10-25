import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Plus,
  Users,
  FileText,
  Check,
  Upload,
  Search,
} from "lucide-react";
import {
  Badge,
  EmptyState,
  Modal,
  PageHeading,
  RouteCard,
} from "../components/ui";
import { useDemo, type Classroom } from "../state/DemoContext";
function ClassroomCard({
  classroom,
  index,
}: {
  classroom: Classroom;
  index: number;
}) {
  return (
    <Link
      to={`/docente/aulas/${classroom.id}`}
      className={`classroom-card ${classroom.color}`}
    >
      <div className="card-top">
        <span className="course-number">0{index + 1}</span>
        <ArrowUpRight size={20} />
      </div>
      <div className="course-symbol" aria-hidden="true">
        {["∂", "Σ", "√"][index % 3]}
      </div>
      <span className="small muted">SECCIÓN {classroom.section}</span>
      <h3>{classroom.name}</h3>
      <p className="class-meta">
        Semestre {classroom.period} · Turno {classroom.shift}
        <br />
        {classroom.group || "Sin grupo inicial"}
      </p>
      <div className="course-footer">
        <span>
          <Users size={15} />
          {classroom.students.length} estudiantes demo
        </span>
        <span>Ver aula →</span>
      </div>
    </Link>
  );
}
export function Dashboard() {
  const { classrooms, review, assessments, bank } = useDemo();
  return (
    <>
      <PageHeading
        eyebrow="TU ENSEÑANZA, CON PERSPECTIVA"
        title="Tu espacio docente"
        description="Aulas, preguntas y actividades de este semestre. Datos de demostración."
        action={
          <Link className="button primary" to="/docente/aulas?crear=1">
            <Plus size={18} />
            Crear aula
          </Link>
        }
      />
      <section>
        <div className="section-heading">
          <h2>
            Mis aulas{" "}
            <span className="count">
              {classrooms.length.toString().padStart(2, "0")}
            </span>
          </h2>
          <Link className="text-link" to="/docente/aulas">
            Ver todas <ArrowRight size={16} />
          </Link>
        </div>
        <div className="class-grid">
          {classrooms.slice(0, 3).map((c, i) => (
            <ClassroomCard classroom={c} index={i} key={c.id} />
          ))}
        </div>
      </section>
      <div className="dashboard-lower">
        <section className="panel">
          <div className="section-heading">
            <h2>Acciones pendientes</h2>
            <span className="small muted">DEMO</span>
          </div>
          {review.status < 2 && (
            <Link to="/docente/revision" className="task-row">
              <span className="task-icon">
                <FileText size={21} />
              </span>
              <div>
                <strong>Derivadas y sus aplicaciones</strong>
                <p className="muted small">
                  Cuaderno de ejercicios · 1 ejercicio
                </p>
              </div>
              <Badge tone={review.status === 2 ? "green" : "amber"}>
                {review.status === 2 ? "Aprobado · demo" : "Por revisar"}
              </Badge>
              <ArrowUpRight size={18} />
            </Link>
          )}
          {classrooms.find((c) => c.id === "algebra")?.students.length ===
            0 && (
            <Link to="/docente/aulas/algebra/importar" className="task-row">
              <span className="task-icon">
                <Users size={21} />
              </span>
              <div>
                <strong>Completa tu aula de Álgebra</strong>
                <p className="muted small">
                  Importa una nómina de demostración
                </p>
              </div>
              <ArrowUpRight size={18} />
            </Link>
          )}
          <RouteCard
            to="/docente/banco?estado=Pendiente+de+revisi%C3%B3n"
            title={`${bank.filter((q) => q.state === "Pendiente de revisión").length} preguntas por revisar`}
          >
            Completa la revisión antes de utilizarlas en una publicación.
          </RouteCard>
          <RouteCard
            to="/docente/evaluaciones"
            title={`${assessments.filter((a) => a.status !== "Publicada").length} evaluaciones en preparación`}
          >
            Continúa la configuración o confirma una revisión.
          </RouteCard>
        </section>
        <section className="quick-panel">
          <p className="eyebrow">PREPARAR LA CLASE</p>
          <h2>Accesos rápidos</h2>
          <RouteCard to="/docente/banco" title="Banco de preguntas">
            Buscar y editar contenido por tema.
          </RouteCard>
          <RouteCard to="/docente/evaluaciones/nueva" title="Nueva evaluación">
            Elegir aula, preguntas y reglas.
          </RouteCard>
          <RouteCard
            to="/docente/aulas/calculo/importar"
            title="Importar estudiantes"
          >
            Desde una plantilla de Moodle
          </RouteCard>
          <RouteCard to="/docente/revision" title="Revisar un documento">
            Del PDF al ejercicio editable
          </RouteCard>
        </section>
      </div>
    </>
  );
}
export function Classrooms() {
  const { classrooms, setClassrooms } = useDemo();
  const navigate = useNavigate();
  const [open, setOpen] = useState(
    new URLSearchParams(window.location.search).has("crear"),
  );
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name")).trim();
    if (!name) {
      setError("Escribe el nombre de la asignatura.");
      event.currentTarget.querySelector("input")?.focus();
      return;
    }
    const id = crypto.randomUUID();
    setClassrooms((previous) => [
      ...previous,
      {
        id,
        name,
        section: String(data.get("section")).trim(),
        period: String(data.get("period")),
        shift: String(data.get("shift")),
        group: String(data.get("group")).trim(),
        students: [],
        color: "blue",
      },
    ]);
    setOpen(false);
    navigate(`/docente/aulas/${id}`);
  }
  return (
    <>
      <PageHeading
        eyebrow="ESPACIOS PARA CRECER"
        title="Mis aulas"
        description="Organiza cada grupo y acompaña su aprendizaje."
        action={
          <button className="button primary" onClick={() => setOpen(true)}>
            <Plus size={18} />
            Crear aula
          </button>
        }
      />
      <label className="search-field">
        <Search size={18} />
        <input
          aria-label="Buscar aulas"
          placeholder="Buscar una asignatura…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <div className="class-grid">
        {classrooms
          .filter((c) =>
            c.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
          )
          .map((c, i) => (
            <ClassroomCard classroom={c} index={i} key={c.id} />
          ))}
      </div>
      {!classrooms.some((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()),
      ) && (
        <EmptyState title="No encontramos esa aula">
          Prueba con otro nombre o crea tu primera aula.
        </EmptyState>
      )}
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Un nuevo espacio para aprender"
        description="Crea un aula de demostración. No se enviarán invitaciones."
      >
        <form onSubmit={create} className="form-stack">
          <label>
            Asignatura
            <input
              name="name"
              maxLength={90}
              placeholder="Por ejemplo, Cálculo integral…"
              aria-invalid={!!error}
              aria-describedby={error ? "class-error" : undefined}
            />
          </label>
          {error && (
            <p role="alert" id="class-error" className="error">
              {error}
            </p>
          )}
          <div className="form-grid">
            <label>
              Periodo
              <select name="period">
                <option>2026-II</option>
                <option>2027-I</option>
              </select>
            </label>
            <label>
              Sección
              <input required name="section" maxLength={15} placeholder="A…" />
            </label>
          </div>
          <label>
            Turno
            <select name="shift">
              <option>Mañana</option>
              <option>Tarde</option>
              <option>Noche</option>
            </select>
          </label>
          <label>
            Grupo inicial <span className="muted">(opcional)</span>
            <input
              name="group"
              maxLength={40}
              placeholder="Por ejemplo, Grupo 1…"
            />
          </label>
          <button className="button primary" type="submit">
            Crear aula de demostración <ArrowRight size={17} />
          </button>
        </form>
      </Modal>
    </>
  );
}
export function ClassroomDetail() {
  const { id } = useParams();
  const { classrooms } = useDemo();
  const classroom = classrooms.find((c) => c.id === id);
  if (!classroom)
    return (
      <EmptyState title="Aula no disponible">
        Esta aula local ya no existe.{" "}
        <Link to="/docente/aulas">Volver a mis aulas</Link>
      </EmptyState>
    );
  return (
    <>
      <Link className="text-link" to="/docente/aulas">
        ← Mis aulas
      </Link>
      <PageHeading
        eyebrow={`${classroom.period} / SECCIÓN ${classroom.section}`}
        title={classroom.name}
        description={`${classroom.shift} · ${classroom.group || "Sin grupo inicial"} · Aula de demostración`}
        action={
          <Link className="button primary" to={`/docente/aulas/${id}/importar`}>
            <Upload size={18} />
            Importar estudiantes
          </Link>
        }
      />
      <div className="detail-grid">
        <section className="panel">
          <div className="section-heading">
            <h2>Estudiantes</h2>
            <Badge>{classroom.students.length} demo</Badge>
          </div>
          {classroom.students.length ? (
            <ul className="student-list">
              {classroom.students.map((name, i) => (
                <li key={name}>
                  <span className="avatar">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span>{name}</span>
                    <small className="muted block">
                      {classroom.studentGroups?.[name] ||
                        classroom.group ||
                        "Sin grupo"}
                    </small>
                  </span>
                  <Badge tone="green">
                    <Check size={13} /> Incorporado
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="Tu aula empieza aquí">
              Importa una nómina sintética para explorar la revisión de
              participantes.
            </EmptyState>
          )}
        </section>
        <aside>
          <RouteCard
            to={`/docente/banco?aula=${id}`}
            title="Banco de preguntas"
          >
            Seleccionar recursos para esta aula.
          </RouteCard>
          <RouteCard to="/docente/revision" title="Materiales y ejercicios">
            Revisar una transcripción de muestra
          </RouteCard>
          <RouteCard
            to={`/docente/evaluaciones?aula=${id}`}
            title="Evaluaciones"
          >
            Configurar actividades de esta aula.
          </RouteCard>
          <div className="notice">
            Los participantes son ficticios y solo se mantienen durante esta
            sesión.
          </div>
        </aside>
      </div>
    </>
  );
}
