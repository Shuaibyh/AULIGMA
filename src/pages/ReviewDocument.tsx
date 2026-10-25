import { useState } from "react";
import { FileText, ArrowRight, CheckCircle2, PencilLine } from "lucide-react";
import katex from "katex";
import { Badge, MathBlock, Modal, PageHeading } from "../components/ui";
import { useDemo } from "../state/DemoContext";
export function ReviewDocument() {
  const { review, setReview } = useDemo();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [filename, setFilename] = useState("Cuaderno de derivadas · ejemplo");
  const [approve, setApprove] = useState(false);
  async function load(name: string) {
    setBusy(true);
    setError("");
    setFilename(name);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setReview({ ...review, loaded: true, status: 0 });
    setBusy(false);
  }
  function verify() {
    if (!review.text.trim() || !review.formula.trim()) {
      setError("Completa el enunciado y la fórmula antes de continuar.");
      return;
    }
    try {
      katex.renderToString(review.formula, {
        throwOnError: true,
        trust: false,
      });
      setError("");
      setReview({ ...review, status: 1 });
    } catch {
      setError("Corrige la sintaxis LaTeX de la fórmula antes de continuar.");
    }
  }
  return (
    <>
      <PageHeading
        eyebrow="DEL PAPEL A LAS POSIBILIDADES"
        title="Una segunda mirada."
        description="Revisa la transcripción y conserva el control de cada ejercicio."
      />
      <div className="notice">
        <strong>Verificación demostrativa.</strong> No hay OCR, IA ni motor
        matemático. “Verificado” y “Aprobado” representan pasos simulados; no
        certifican la corrección del ejercicio.
      </div>
      {!review.loaded ? (
        <section className="panel import-upload">
          <FileText size={48} strokeWidth={1} />
          <h2>Dale un nuevo espacio a tus ejercicios</h2>
          <p className="muted">
            La carga abre un documento de muestra y una transcripción editable.
          </p>
          <button
            className="button primary"
            disabled={busy}
            onClick={() => load("Cuaderno de derivadas · ejemplo")}
          >
            {busy ? "Preparando documento…" : "Abrir documento de muestra"}
            <ArrowRight size={17} />
          </button>
          <label className="file-field">
            Seleccionar PDF de ejemplo
            <input
              type="file"
              accept=".pdf"
              disabled={busy}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (
                  !/\.pdf$/i.test(file.name) ||
                  file.size > 10 * 1024 * 1024
                ) {
                  setError("Selecciona un PDF de hasta 10 MB.");
                  return;
                }
                void load(file.name);
              }}
            />
          </label>
          <small className="muted">
            El archivo no se procesa: se muestra una página sintética.
          </small>
          <p role="status">{busy ? "Preparando muestra…" : ""}</p>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
        </section>
      ) : (
        <>
          <div className="document-toolbar">
            <span>
              <FileText size={18} />
              {filename}
            </span>
            <button
              className="button secondary"
              onClick={() => setReview({ ...review, loaded: false })}
            >
              Cambiar documento
            </button>
          </div>
          <div className="review-grid">
            <section className="document-view">
              <div className="document-label">
                DOCUMENTO DE MUESTRA <span>01 / 01</span>
              </div>
              <article className="paper">
                <p className="eyebrow">AULIGMA / CUADERNOS DE PRÁCTICA</p>
                <h2>
                  El lenguaje
                  <br />
                  del cambio.
                </h2>
                <hr />
                <p className="small">MATEMÁTICA · DERIVADAS</p>
                <h3>01. Explorar una función</h3>
                <p>
                  Determina la derivada de la siguiente función y explica el
                  procedimiento.
                </p>
                <MathBlock formula="f(x) = x^3 - 3x + 2" />
                <div className="paper-lines" />
                <span className="small muted">
                  Material sintético · Página 1
                </span>
              </article>
            </section>
            <section className="panel editor-panel">
              <div className="section-heading">
                <h2>
                  <PencilLine size={19} /> Transcripción
                </h2>
                <Badge>Ejercicio 01</Badge>
              </div>
              <div className="form-stack">
                <label>
                  Enunciado
                  <textarea
                    rows={4}
                    value={review.text}
                    onChange={(e) => {
                      setReview({ ...review, text: e.target.value, status: 0 });
                      setError("");
                    }}
                  />
                </label>
                <label>
                  Expresión matemática (LaTeX)
                  <input
                    value={review.formula}
                    onChange={(e) => {
                      setReview({
                        ...review,
                        formula: e.target.value,
                        status: 0,
                      });
                      setError("");
                    }}
                  />
                </label>
                <div className="formula-preview">
                  <span className="small muted">VISTA PREVIA</span>
                  <MathBlock formula={review.formula} />
                </div>
                <p className="small muted">
                  Los cambios se conservan en esta sesión. Editar reinicia la
                  revisión.
                </p>
              </div>
              <div className="verification-rail">
                <p className="eyebrow">MARGEN DE VERIFICACIÓN · DEMO</p>
                {["Extraído", "Verificado", "Aprobado"].map((label, i) => (
                  <div
                    key={label}
                    className={`verification-step ${review.status >= i ? "done" : ""}`}
                  >
                    <span>
                      {review.status >= i ? <CheckCircle2 size={19} /> : i + 1}
                    </span>
                    <div>
                      <strong>{label} · simulado</strong>
                      <p>
                        {
                          [
                            "Transcripción de una muestra preparada.",
                            "Revisión manual de demostración, sin motor matemático.",
                            "Aprobación local; no publica contenido.",
                          ][i]
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {error && (
                <p role="alert" className="error">
                  {error}
                </p>
              )}
              {review.status === 0 ? (
                <button className="button primary" onClick={verify}>
                  Simular verificación <ArrowRight size={17} />
                </button>
              ) : review.status === 1 ? (
                <button
                  className="button primary"
                  onClick={() => setApprove(true)}
                >
                  Aprobar en demostración
                </button>
              ) : (
                <p role="status" className="success-text">
                  ✓ Aprobado en esta sesión de demostración.
                </p>
              )}
            </section>
          </div>
        </>
      )}
      <Modal
        open={approve}
        onOpenChange={setApprove}
        title="Confirmar revisión simulada"
        description="Esta acción marca el ejemplo como aprobado en tu sesión. No comprueba matemáticas ni publica una evaluación."
      >
        <div className="button-row">
          <button
            className="button secondary"
            onClick={() => setApprove(false)}
          >
            Seguir revisando
          </button>
          <button
            className="button primary"
            onClick={() => {
              setReview({ ...review, status: 2 });
              setApprove(false);
            }}
          >
            Confirmar aprobación demo
          </button>
        </div>
      </Modal>
    </>
  );
}
