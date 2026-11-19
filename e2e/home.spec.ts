import { expect, test } from "@playwright/test";

// Seções Projetos, Experiência, Eventos e Contato da Home (#16, ajustadas na fase 0).
const locales = [
  { path: "/pt", inProgress: "Em desenvolvimento" },
  { path: "/en", inProgress: "In development" },
] as const;

for (const locale of locales) {
  test.describe(`home ${locale.path}`, () => {
    test("mostra de 1 a 4 projetos em destaque, cada um com selo de status em texto", async ({ page }) => {
      await page.goto(locale.path);
      const cards = page.locator("#projects [data-project-card]");
      const count = await cards.count();
      expect(count).toBeGreaterThanOrEqual(1);
      expect(count).toBeLessThanOrEqual(4);
      await expect(page.locator("#projects h3", { hasText: locale.inProgress })).toBeVisible();
      for (const card of await cards.all()) {
        await expect(card.locator("h4")).not.toBeEmpty();
        // O status é lido como texto, não só pela cor do ponto.
        await expect(card.locator("[data-status-badge]")).toHaveText(/\S+/);
      }
    });

    test("experiência, eventos e contato existem como seções com título", async ({ page }) => {
      await page.goto(locale.path);
      await expect(page.locator("section#experience h2")).toBeVisible();
      await expect(page.locator("section#events h2")).toBeVisible();
      await expect(page.locator("section#contact h2")).toBeVisible();
    });
  });
}

test("a profundidade 3D do card só aparece sem movimento reduzido", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/pt");
  const card = page.locator("#projects [data-project-card]").first();
  await card.scrollIntoViewIfNeeded();
  await card.hover();

  const reduced = testInfo.project.name === "chromium-reduced-motion";
  await expect
    .poll(() => card.evaluate((el) => getComputedStyle(el).rotate !== "none" || getComputedStyle(el).transform !== "none"))
    .toBe(!reduced);
});
