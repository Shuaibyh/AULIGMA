import katex from "katex";
export default function MathRenderer({
  formula,
  block,
}: {
  formula: string;
  block: boolean;
}) {
  let html: string;
  try {
    html = katex.renderToString(formula, {
      throwOnError: true,
      displayMode: block,
      output: "htmlAndMathml",
      trust: false,
    });
  } catch {
    return (
      <span role="alert" className="error">
        La fórmula no es válida. Revisa la sintaxis LaTeX.
      </span>
    );
  }
  return (
    <span
      className={block ? "math-block" : "math-inline"}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
