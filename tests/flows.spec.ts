import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("aula, formulario, mapeo e incorporación de filas válidas", async ({
  page,
}) => {
  await page.goto("/docente/aulas");
  await page.getByRole("button", { name: "Crear aula", exact: true }).click();
  await page.getByLabel("Asignatura").fill("Geometría de demostración");
  await page.getByLabel("Sección", { exact: true }).fill("D");
  await page.getByLabel("Grupo inicial").fill("Seminario");
  await page
    .getByRole("button", { name: "Crear aula de demostración" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Geometría de demostración" }),
  ).toBeVisible();
  await expect(page.getByText("Tu aula empieza aquí")).toBeVisible();
  await page
    .getByRole("link", { name: "Importar estudiantes", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Usar nómina de demostración" })
    .click();
  await page.getByLabel("Nombre del estudiante").selectOption("Código");
  await expect(
    page.getByRole("button", { name: "Revisar participantes" }),
  ).toBeDisabled();
  await page
    .getByLabel("Nombre del estudiante")
    .selectOption("Nombre completo");
  await page.getByRole("button", { name: "Revisar participantes" }).click();
  await expect(
    page.getByText("Código duplicado", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Datos incompletos", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Confirmar incorporación" }),
  ).toBeDisabled();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Confirmar incorporación" }).click();
  await page.getByRole("link", { name: "Ver estudiantes" }).click();
  await expect(
    page.getByText("Estudiante demo 04", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Estudiante demo 05", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Grupo 2", { exact: true })).toBeVisible();
});
test("revisión explícita y reinicio de verificación al editar", async ({
  page,
}) => {
  await page.goto("/docente/revision");
  await page
    .getByRole("button", { name: "Abrir documento de muestra" })
    .click();
  await page.getByRole("button", { name: "Simular verificación" }).click();
  await page.getByRole("button", { name: "Aprobar en demostración" }).click();
  await page.getByRole("button", { name: "Confirmar aprobación demo" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Aprobado en esta sesión",
  );
  await page.getByLabel("Enunciado").fill("Nueva transcripción de ejemplo");
  await expect(
    page.getByRole("button", { name: "Simular verificación" }),
  ).toBeVisible();
  await page.getByLabel("Expresión matemática").fill("\\frac{");
  await page.getByRole("button", { name: "Simular verificación" }).click();
  await expect(page.getByText("Corrige la sintaxis LaTeX")).toBeVisible();
});
test("práctica con feedback, navegación y progreso local", async ({ page }) => {
  await page.goto("/estudiante/practica");
  await expect(
    page.getByRole("button", { name: "Comprobar respuesta" }),
  ).toBeDisabled();
  for (const [question, option] of [0, 2, 1].entries()) {
    await page.getByRole("radio").nth(option).check();
    await page.getByRole("button", { name: "Comprobar respuesta" }).click();
    await expect(
      page.getByText("Respuesta correcta. Bien razonado.", { exact: true }),
    ).toBeVisible();
    if (question < 2)
      await page.getByRole("button", { name: "Siguiente" }).click();
  }
  await page.getByRole("link", { name: "Ver mi progreso" }).click();
  await expect(
    page.getByText("3 de 3 preguntas revisadas", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reiniciar práctica" }).click();
  await page.getByRole("button", { name: "Confirmar reinicio" }).click();
  await expect(
    page.getByText("0 de 3 preguntas revisadas", { exact: true }),
  ).toBeVisible();
});
for (const width of [390, 768, 1440]) {
  test(`pantallas, contraste y desbordamiento a ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of [
      "/",
      "/docente",
      "/docente/aulas",
      "/docente/aulas/calculo/importar",
      "/docente/revision",
      "/estudiante",
      "/estudiante/practica",
    ]) {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      if (path === "/docente/revision")
        await page
          .getByRole("button", { name: "Abrir documento de muestra" })
          .click();
      if (path.endsWith("/importar")) {
        await page
          .getByRole("button", { name: "Usar nómina de demostración" })
          .click();
        await page
          .getByRole("button", { name: "Revisar participantes" })
          .click();
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBeTruthy();
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(
          document
            .getAnimations()
            .map((animation) => animation.finished.catch(() => {})),
        );
      });
      if (["/docente/revision", "/estudiante/practica"].includes(path)) {
        await expect(page.locator(".katex").first()).toBeVisible();
        await expect(page.getByText("Preparando fórmula…")).toHaveCount(0);
      }
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(
        results.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
      ).toEqual([]);
      await page.locator("main").focus();
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: `test-results/visual/${width}-${path.replaceAll("/", "-") || "inicio"}.png`,
        fullPage: true,
      });
    }
    await page.getByRole("button", { name: "Activar modo oscuro" }).click();
    await page.evaluate(async () => {
      await Promise.all(
        document
          .getAnimations()
          .map((animation) => animation.finished.catch(() => {})),
      );
    });
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    await page.screenshot({
      path: `test-results/visual/${width}-oscuro.png`,
      fullPage: true,
    });
  });
}
test("navegación secundaria y diálogo por teclado", async ({ page }) => {
  await page.goto("/docente");
  for (const name of [
    "Mis aulas",
    "Banco de preguntas",
    "Evaluaciones",
    "Informes",
  ]) {
    await page
      .getByRole("navigation", { name: "Navegación principal" })
      .getByRole("link", { name, exact: true })
      .click();
    await expect(page.locator("h1")).toHaveText(name);
  }
  await page.getByRole("link", { name: "Ajustes", exact: true }).click();
  await expect(page.locator("h1")).toHaveText("Ajustes");
  await page.goto("/docente/aulas");
  await page.getByRole("button", { name: "Crear aula", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
