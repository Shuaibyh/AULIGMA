import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("docente: aula, filtros del banco, edición, evaluación y publicación protegida", async ({
  page,
}) => {
  await page.goto("/docente");
  await page
    .locator(".classroom-card")
    .filter({ hasText: "Cálculo diferencial" })
    .click();
  await page
    .getByRole("link", { name: /Banco de preguntas Seleccionar/ })
    .click();
  await expect(page).toHaveURL(/banco\?aula=calculo/);
  await page.getByLabel("Buscar pregunta").fill("inexistente");
  await expect(
    page.getByText("No hay preguntas con esos filtros"),
  ).toBeVisible();
  await page.getByRole("button", { name: "limpia los filtros" }).click();
  await page
    .getByRole("combobox", { name: "Tema", exact: true })
    .selectOption("Derivadas");
  await page
    .getByLabel("Estado de revisión")
    .selectOption("Pendiente de revisión");
  await expect(page.locator(".question-row")).toHaveCount(1);
  await page.getByRole("link", { name: "Ver y editar" }).click();
  await page
    .getByRole("button", { name: "Editar pregunta", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Enunciado", exact: true })
    .fill("Derivada para el aula de demostración");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Marcar revisada · demo" }).click();
  await expect(page.getByText("Revisada", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Usar en evaluación" }).click();
  await expect(
    page.getByRole("combobox", { name: "Aula", exact: true }),
  ).toHaveValue("calculo");
  await expect(
    page.getByRole("button", { name: "Simular publicación" }),
  ).toBeDisabled();
  await page
    .getByLabel("Título", { exact: true })
    .fill("Práctica de derivadas 1.1");
  await page.getByLabel("Apertura", { exact: true }).fill("2026-10-24T09:00");
  await page.getByLabel("Cierre", { exact: true }).fill("2026-10-23T10:00");
  await page
    .getByLabel("Reglas e instrucciones")
    .fill("Revisa el procedimiento y comprueba tu respuesta.");
  await expect(
    page.getByText("El cierre debe ser posterior a la apertura."),
  ).toBeVisible();
  await page.getByLabel("Cierre", { exact: true }).fill("2026-10-25T10:00");
  await page.getByRole("button", { name: "Enviar a revisión" }).click();
  await page.getByLabel("He revisado preguntas, fechas y reglas.").check();
  await page.getByRole("button", { name: "Simular publicación" }).click();
  await page
    .getByRole("button", { name: "Confirmar publicación demo" })
    .click();
  await expect(page.getByText("Publicada", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Título", { exact: true })).toBeDisabled();
  await page.getByRole("link", { name: "Vista de práctica" }).click();
  await expect(page.locator("#question-heading")).toHaveText(
    "Derivada para el aula de demostración",
  );
  await page.getByRole("radio").first().check();
  await page.getByRole("button", { name: "Comprobar respuesta" }).click();
  await expect(
    page.getByText("Respuesta correcta. Bien razonado."),
  ).toBeVisible();
});
test("el borrador sobrevive a la navegación y una publicación conserva sus preguntas", async ({
  page,
}) => {
  await page.goto("/docente/evaluaciones/nueva");
  await page
    .getByRole("textbox", { name: "Título", exact: true })
    .fill("Borrador conservado");
  await page.getByRole("link", { name: "Abrir banco", exact: true }).click();
  await page
    .getByRole("navigation", { name: "Navegación principal" })
    .getByRole("link", { name: "Evaluaciones", exact: true })
    .click();
  await page
    .locator(".assessment-row")
    .filter({ hasText: "Borrador conservado" })
    .getByRole("link", { name: "Configurar" })
    .click();
  await expect(
    page.getByRole("textbox", { name: "Título", exact: true }),
  ).toHaveValue("Borrador conservado");
  await page
    .getByRole("navigation", { name: "Navegación principal" })
    .getByRole("link", { name: "Banco de preguntas", exact: true })
    .click();
  await page
    .locator(".question-row")
    .filter({ hasText: "¿Cuál es la derivada de esta función?" })
    .getByRole("link", { name: "Ver y editar" })
    .click();
  await page
    .getByRole("button", { name: "Editar pregunta", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Enunciado", exact: true })
    .fill("Texto cambiado después de publicar");
  await page
    .getByRole("navigation", { name: "Navegación principal" })
    .getByRole("link", { name: "Evaluaciones", exact: true })
    .click();
  await page
    .locator(".assessment-row")
    .filter({ hasText: "Comprender el cambio" })
    .getByRole("link", { name: "Ver publicación" })
    .click();
  await page.getByRole("link", { name: "Vista de práctica" }).click();
  await expect(page.locator("#question-heading")).toHaveText(
    "¿Cuál es la derivada de esta función?",
  );
});
test("editar pregunta invalida revisión y bloquea publicación de un borrador", async ({
  page,
}) => {
  await page.goto("/docente/banco/limite");
  await page
    .getByRole("button", { name: "Editar pregunta", exact: true })
    .click();
  await page.getByLabel("Fórmula LaTeX").fill("\\frac{");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Marcar revisada · demo" }).click();
  await expect(
    page.getByText(
      "Revisa la sintaxis LaTeX de la fórmula y de las alternativas.",
    ),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Navegación principal" })
    .getByRole("link", { name: "Evaluaciones", exact: true })
    .click();
  await page
    .locator(".assessment-row")
    .filter({ hasText: "Repaso de límites" })
    .getByRole("link", { name: "Configurar" })
    .click();
  await expect(
    page.getByText("Revisa todas las preguntas seleccionadas en el banco."),
  ).toBeVisible();
  await page.getByLabel("He revisado preguntas, fechas y reglas.").check();
  await expect(
    page.getByRole("button", { name: "Simular publicación" }),
  ).toBeDisabled();
});
test("estudiante: respuestas conservadas, error explicado, progreso y reinicio confirmado", async ({
  page,
}) => {
  await page.goto("/estudiante");
  await expect(page.getByText("Pendiente", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Resolver", exact: true }).click();
  await expect(page.locator(".sidebar")).toBeHidden();
  await page.getByRole("radio").nth(1).check();
  await page.getByRole("button", { name: "Siguiente" }).click();
  await page.getByRole("button", { name: "Anterior" }).click();
  await expect(page.getByRole("radio").nth(1)).toBeChecked();
  await page.reload();
  await expect(page.getByRole("radio").nth(1)).toBeChecked();
  await page.getByRole("button", { name: "Comprobar respuesta" }).click();
  await expect(
    page.getByText("Respuesta incorrecta. Revisemos el procedimiento."),
  ).toBeVisible();
  for (const heading of [
    "Regla utilizada",
    "Desarrollo paso a paso",
    "¿Dónde estuvo el error?",
    "Para reforzar",
  ])
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  await expect(page.locator(".solution-steps li")).toHaveCount(3);
  await page.getByRole("link", { name: "Consultar mi progreso" }).click();
  await expect(page.locator(".progress-metrics")).toContainText(
    "Intentadas1Aciertos0Errores1Sin comprobar0",
  );
  await page.getByRole("button", { name: "Reiniciar práctica" }).click();
  await page.getByRole("button", { name: "Conservar respuestas" }).click();
  await expect(
    page.getByText("1 de 3 preguntas revisadas", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Navegación principal" })
    .getByRole("link", { name: "Mis actividades", exact: true })
    .click();
  await expect(page.getByText("En progreso", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Continuar", exact: true }).click();
  await expect(page.getByRole("radio").nth(1)).toBeChecked();
});
for (const width of [390, 768, 1440])
  test(`refinamiento visual y accesibilidad ${width}px`, async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width, height: 1000 });
    for (const path of [
      "/docente",
      "/docente/aulas/calculo",
      "/docente/banco",
      "/docente/banco/derivada",
      "/docente/evaluaciones",
      "/docente/evaluaciones/nueva",
      "/estudiante",
      "/estudiante/practica",
      "/estudiante/progreso",
    ]) {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      if (path === "/estudiante/practica") {
        await page.getByRole("radio").nth(1).check();
        await page.getByRole("button", { name: "Comprobar respuesta" }).click();
      }
      for (const dark of [false, true]) {
        if (dark)
          await page
            .getByRole("button", { name: "Activar modo oscuro" })
            .click();
        await page.evaluate(async () => {
          await document.fonts.ready;
          await Promise.all(
            document.getAnimations().map((a) => a.finished.catch(() => {})),
          );
        });
        if (path.includes("/banco") || path === "/estudiante/practica")
          await expect(page.locator(".katex").first()).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBeTruthy();
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze();
        expect(
          result.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          })),
        ).toEqual([]);
        await page.locator("main").focus();
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({
          path: `test-results/fase-1-1/${width}-${path.replaceAll("/", "-")}-${dark ? "oscuro" : "claro"}.png`,
          fullPage: true,
        });
      }
    }
  });
