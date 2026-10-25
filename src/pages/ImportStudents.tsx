import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  Upload,
  AlertCircle,
} from "lucide-react";
import { Badge, PageHeading } from "../components/ui";
import { useDemo } from "../state/DemoContext";
const sample = [
  ["D001", "Estudiante demo 04", "Grupo 1"],
  ["D002", "Estudiante demo 05", "Grupo 2"],
  ["D002", "Estudiante demo 05", "Grupo 2"],
  ["D004", "", "Grupo 1"],
];
export function ImportStudents() {
  const { id } = useParams();
  const { classrooms, setClassrooms } = useDemo();
  const classroom = classrooms.find((c) => c.id === id);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [filename, setFilename] = useState("");
  const [busy, setBusy] = useState(false);
  const [mapping, setMapping] = useState({
    code: "Código",
    name: "Nombre completo",
    group: "Grupo",
  });
  const [confirmed, setConfirmed] = useState(false);
  if (!classroom)
    return (
      <p>
        Aula no disponible. <Link to="/docente/aulas">Volver a aulas</Link>
      </p>
    );
  async function load(name: string) {
    setError("");
    setFilename(name);
    setBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setBusy(false);
    setStep(1);
  }
  const validMap =
    mapping.code !== mapping.name &&
    (!mapping.group || ![mapping.code, mapping.name].includes(mapping.group));
  const cols = ["Código", "Nombre completo", "Grupo"];
  const rows = sample.map((row) => ({
    code: row[cols.indexOf(mapping.code)],
    name: row[cols.indexOf(mapping.name)],
    group: mapping.group ? row[cols.indexOf(mapping.group)] : "Sin grupo",
  }));
  const seen = new Set<string>();
  const reviewed = rows.map((row) => {
    const issue =
      !row.code || !row.name
        ? "Datos incompletos"
        : seen.has(row.code)
          ? "Código duplicado"
          : "";
    seen.add(row.code);
    return { ...row, issue };
  });
  const valid = reviewed.filter(
    (row) => !row.issue && !classroom.students.includes(row.name),
  );
  function confirm() {
    setClassrooms((all) =>
      all.map((c) =>
        c.id === id
          ? {
              ...c,
              students: [
                ...new Set([...c.students, ...valid.map((row) => row.name)]),
              ],
              studentGroups: {
                ...c.studentGroups,
                ...Object.fromEntries(
                  valid.map((row) => [row.name, row.group]),
                ),
              },
            }
          : c,
      ),
    );
    setStep(3);
  }
  return (
    <>
      <Link className="text-link" to={`/docente/aulas/${id}`}>
        ← {classroom.name}
      </Link>
      <PageHeading
        eyebrow="UNA INCORPORACIÓN CUIDADA"
        title="Cada estudiante cuenta."
        description="Importación simulada de una nómina de Moodle."
      />
      <ol className="stepper">
        {["Archivo", "Columnas", "Revisión", "Confirmación"].map((label, i) => (
          <li
            key={label}
            className={step >= i ? "active" : ""}
            aria-current={step === i ? "step" : undefined}
          >
            <span>{step > i ? "✓" : i + 1}</span>
            {label}
          </li>
        ))}
      </ol>
      <div className="notice">
        Simulación: se usa una nómina sintética fija. Un archivo seleccionado
        solo aporta su nombre; su contenido no se lee ni se transmite.
      </div>
      {step === 0 && (
        <section className="panel import-upload">
          <FileSpreadsheet size={48} strokeWidth={1} />
          <h2>Empieza con una nómina</h2>
          <p className="muted">
            Explora la vista previa, el mapeo y la revisión de incidencias.
          </p>
          <button
            disabled={busy}
            className="button primary"
            onClick={() => load("nomina_demostracion.xlsx")}
          >
            {busy ? "Preparando muestra…" : "Usar nómina de demostración"}
            <ArrowRight size={17} />
          </button>
          <label className="file-field">
            <Upload size={18} /> O selecciona un archivo de ejemplo
            <input
              type="file"
              accept=".xlsx,.xls"
              disabled={busy}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (!/\.xlsx?$/i.test(file.name)) {
                    setError("Selecciona un archivo .xlsx o .xls.");
                    return;
                  }
                  if (file.size > 10 * 1024 * 1024) {
                    setError("Selecciona un archivo menor de 10 MB.");
                    return;
                  }
                  void load(file.name);
                }
              }}
            />
          </label>
          <small className="muted">
            Solo nombre del archivo · Máximo 10 MB
          </small>
          <p role="status">{busy ? "Preparando vista previa…" : ""}</p>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
        </section>
      )}
      {step === 1 && (
        <section className="panel">
          <Badge>
            <FileSpreadsheet size={14} />
            {filename}
          </Badge>
          <h2>Conecta las columnas</h2>
          <p className="muted">
            Asocia cada campo con una columna de la muestra. Los grupos son
            opcionales.
          </p>
          <div className="mapping-grid">
            {(["code", "name", "group"] as const).map((key, index) => (
              <label key={key}>
                {
                  [
                    "Código del estudiante",
                    "Nombre del estudiante",
                    "Grupo (opcional)",
                  ][index]
                }
                <select
                  value={mapping[key]}
                  onChange={(e) =>
                    setMapping({ ...mapping, [key]: e.target.value })
                  }
                >
                  {key === "group" && (
                    <option value="">No importar grupos</option>
                  )}
                  {cols.map((col) => (
                    <option key={col}>{col}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          {!validMap && (
            <p role="alert" className="error">
              Cada campo debe utilizar una columna diferente.
            </p>
          )}
          <div
            className="table-scroll"
            tabIndex={0}
            role="region"
            aria-label="Vista previa de la nómina"
          >
            <table>
              <caption>Muestra sintética del archivo</caption>
              <thead>
                <tr>
                  {cols.map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sample.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j}>{cell || "—"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="button-row">
            <button className="button secondary" onClick={() => setStep(0)}>
              Cambiar archivo
            </button>
            <button
              className="button primary"
              disabled={!validMap}
              onClick={() => setStep(2)}
            >
              Revisar participantes <ArrowRight size={17} />
            </button>
          </div>
        </section>
      )}
      {step === 2 && (
        <section className="panel">
          <h2>Una última mirada</h2>
          <p className="muted">
            {valid.length} participantes nuevos disponibles. Las filas con
            incidencias se omitirán.
          </p>
          <div
            className="table-scroll"
            tabIndex={0}
            role="region"
            aria-label="Incidencias de la nómina"
          >
            <table>
              <caption>Resultado de la revisión de demostración</caption>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Grupo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {reviewed.map((row, i) => (
                  <tr key={i}>
                    <td>{row.code || "—"}</td>
                    <td>{row.name || "Sin nombre"}</td>
                    <td>{row.group}</td>
                    <td>
                      <Badge tone={row.issue ? "amber" : "green"}>
                        {row.issue ? (
                          <AlertCircle size={14} />
                        ) : (
                          <CheckCircle2 size={14} />
                        )}{" "}
                        {row.issue ||
                          (classroom.students.includes(row.name)
                            ? "Ya incorporado"
                            : "Listo")}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <label className="check-label">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
            He revisado la muestra y acepto omitir las filas con incidencias.
          </label>
          <div className="button-row">
            <button className="button secondary" onClick={() => setStep(1)}>
              Volver al mapeo
            </button>
            <button
              className="button primary"
              disabled={!confirmed || valid.length === 0}
              onClick={confirm}
            >
              Confirmar incorporación
            </button>
          </div>
        </section>
      )}
      {step === 3 && (
        <section className="panel success-state" role="status">
          <CheckCircle2 size={48} />
          <h2>Tu aula ya tiene compañía.</h2>
          <p>
            La nómina válida se incorporó al aula de demostración. Las filas con
            incidencias quedaron excluidas.
          </p>
          <Link className="button primary" to={`/docente/aulas/${id}`}>
            Ver estudiantes <ArrowRight size={18} />
          </Link>
        </section>
      )}
    </>
  );
}
