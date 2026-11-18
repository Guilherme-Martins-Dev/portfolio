import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Páginas /projetos e /projetos/[slug] (#17). Os dados vêm de src/content; nada aqui fixa nomes de projetos,
// só a estrutura. O fallback de idioma é coberto em src/lib/projects-catalog.test.ts, porque ainda não há
// estudo de caso publicado (o do Questum é rascunho).
const locales = [
  { list: "/pt/projetos", base: "/pt/projetos", title: "Projetos", status: "Situação", all: "Todos", notFound: "Página não encontrada", lang: "pt-BR" },
  { list: "/en/projects", base: "/en/projects", title: "Projects", status: "Status", all: "All", notFound: "Page not found", lang: "en" },
] as const;

for (const locale of locales) {
  test.describe(`listagem ${locale.list}`, () => {
    test("abre com um h1, metadata própria e todos os projetos", async ({ page }) => {
      const response = await page.goto(locale.list);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText(locale.title);
      await expect(page).toHaveTitle(new RegExp(`^${locale.title} · `));
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /\S+/);
      const cards = page.locator("[data-project-card]");
      expect(await cards.count()).toBeGreaterThan(0);
      for (const card of await cards.all()) await expect(card.locator("h2")).not.toBeEmpty();
    });

    test("o filtro de status reduz a lista e volta ao total", async ({ page }) => {
      await page.goto(locale.list);
      const cards = page.locator("[data-project-card]");
      const total = await cards.count();
      const group = page.getByRole("group", { name: locale.status });
      const all = group.getByRole("button", { name: locale.all, exact: true });
      await expect(all).toHaveAttribute("aria-pressed", "true");

      const option = group.getByRole("button").nth(1);
      const label = (await option.innerText()).trim();
      await option.click();
      await expect(option).toHaveAttribute("aria-pressed", "true");
      await expect(all).toHaveAttribute("aria-pressed", "false");
      const filtered = await cards.count();
      expect(filtered).toBeGreaterThan(0);
      expect(filtered).toBeLessThanOrEqual(total);
      for (const card of await cards.all()) await expect(card.locator("[data-status-badge]")).toHaveText(label);
      await expect(page.getByRole("status")).toContainText(String(filtered));

      await all.click();
      await expect(cards).toHaveCount(total);
    });

    test("o filtro de tecnologia mostra só projetos com a tecnologia", async ({ page }) => {
      await page.goto(locale.list);
      const group = page.locator("#filtro-tecnologia").locator("..");
      const option = group.getByRole("button").nth(1);
      const name = (await option.innerText()).trim();
      await option.click();
      const cards = page.locator("[data-project-card]");
      expect(await cards.count()).toBeGreaterThan(0);
      for (const card of await cards.all()) await expect(card.getByText(name, { exact: true })).toBeVisible();
    });

    test("não tem violações de acessibilidade (axe, WCAG A/AA)", async ({ page }) => {
      await page.goto(locale.list);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
      expect(results.violations).toEqual([]);
    });

    test("slug inexistente dá HTTP 404 com a página de erro do idioma", async ({ page }) => {
      const response = await page.goto(`${locale.base}/projeto-que-nao-existe`);
      expect(response?.status()).toBe(404);
      await expect(page.locator("h1")).toHaveText(locale.notFound);
      await expect(page.locator("html")).toHaveAttribute("lang", locale.lang);
    });

    test("rascunho não é publicado: o estudo de caso do Questum dá 404 em produção", async ({ page }) => {
      const response = await page.goto(`${locale.base}/questum`);
      expect(response?.status()).toBe(404);
    });
  });
}
