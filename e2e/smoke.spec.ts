import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const locales = [
  { path: "/pt", lang: "pt-BR" },
  { path: "/en", lang: "en" },
] as const;

for (const { path, lang } of locales) {
  test.describe(`fumaça ${path}`, () => {
    test("abre com status 200, lang correto e um h1", async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toBeVisible();
    });

    test("não tem violações de acessibilidade (axe, WCAG A/AA)", async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
      expect(results.violations).toEqual([]);
    });
  });
}

test("o projeto de movimento reduzido emula prefers-reduced-motion", async ({ page }, testInfo) => {
  await page.goto("/pt");
  const reduced = await page.evaluate(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  expect(reduced).toBe(testInfo.project.name === "chromium-reduced-motion");
});
