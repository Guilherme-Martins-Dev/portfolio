import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Âncoras do menu principal (src/components/layout/sections.ts), com o rótulo de cada idioma.
const locales = [
  {
    path: "/pt",
    nav: "Navegação principal",
    openMenu: "Abrir menu",
    skip: "Pular para o conteúdo",
    sections: [
      { id: "about", label: "Sobre" },
      { id: "experience", label: "Experiência" },
      { id: "projects", label: "Projetos" },
      { id: "events", label: "Eventos" },
      { id: "contact", label: "Contato" },
    ],
  },
  {
    path: "/en",
    nav: "Main navigation",
    openMenu: "Open menu",
    skip: "Skip to content",
    sections: [
      { id: "about", label: "About" },
      { id: "experience", label: "Experience" },
      { id: "projects", label: "Projects" },
      { id: "events", label: "Events" },
      { id: "contact", label: "Contact" },
    ],
  },
] as const;

/** A seção chegou ao topo, logo abaixo do cabeçalho fixo, sem ficar escondida atrás dele. */
async function expectSectionBelowHeader(page: Page, id: string) {
  const headerHeight = await page.locator("header").first().evaluate((el) => el.getBoundingClientRect().height);
  await expect
    .poll(async () => page.locator(`section#${id}:visible`).evaluate((el) => Math.round(el.getBoundingClientRect().top)))
    .toBeGreaterThanOrEqual(Math.floor(headerHeight) - 1);
  await expect
    .poll(async () => page.locator(`section#${id}:visible`).evaluate((el) => Math.round(el.getBoundingClientRect().top)))
    .toBeLessThanOrEqual(Math.ceil(headerHeight) + 2);
  await expect(page.locator(`section#${id}:visible :is(h1, h2)`)).toBeInViewport();
}

for (const locale of locales) {
  test.describe(`navegação ${locale.path}`, () => {
    test("cada âncora do cabeçalho leva à seção certa (desktop)", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(locale.path);
      const nav = page.getByRole("navigation", { name: locale.nav });

      for (const section of locale.sections) {
        await nav.getByRole("link", { name: section.label, exact: true }).click();
        await expect(page).toHaveURL(new RegExp(`${locale.path}#${section.id}$`));
        await expectSectionBelowHeader(page, section.id);
      }
    });

    test("menu do celular abre, leva à seção e fecha", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(locale.path);
      await expect(page.getByRole("navigation", { name: locale.nav })).toBeHidden();

      for (const section of locale.sections) {
        const toggle = page.getByRole("button", { name: locale.openMenu });
        await toggle.click();
        await expect(page.locator("header [aria-expanded]")).toHaveAttribute("aria-expanded", "true");
        // O menu do celular também lista as páginas (ex.: "Sobre" → /pt/sobre); aqui vale a âncora.
        await page
          .getByRole("navigation", { name: "Menu" })
          .locator(`a[href="${locale.path}#${section.id}"]`)
          .click();
        await expect(page).toHaveURL(new RegExp(`${locale.path}#${section.id}$`));
        await expect(page.locator("header [aria-expanded]")).toHaveAttribute("aria-expanded", "false");
        await expectSectionBelowHeader(page, section.id);
      }
    });

    test("menu do celular aberto não tem violações no axe e fecha com Esc", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(locale.path);
      const toggle = page.getByRole("button", { name: locale.openMenu });
      await toggle.click();
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
      expect(results.violations).toEqual([]);
      await page.keyboard.press("Escape");
      await expect(page.locator("header [aria-expanded]")).toHaveAttribute("aria-expanded", "false");
      await expect(page.locator("header [aria-expanded]")).toBeFocused();
    });

    test("skip link é o primeiro foco e leva ao conteúdo", async ({ page }) => {
      await page.goto(locale.path);
      await page.keyboard.press("Tab");
      const skip = page.getByRole("link", { name: locale.skip });
      await expect(skip).toBeFocused();
      await expect(skip).toBeInViewport();
      await page.keyboard.press("Enter");
      await expect(page.locator("main")).toBeFocused();
    });

    test("landmarks: um header, um main e um footer", async ({ page }) => {
      await page.goto(locale.path);
      await expect(page.getByRole("banner")).toHaveCount(1);
      await expect(page.getByRole("main")).toHaveCount(1);
      await expect(page.getByRole("contentinfo")).toHaveCount(1);
    });
  });
}

test("a âncora funciona a partir de outra página", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/pt/design");
  await page.getByRole("navigation", { name: "Navegação principal" }).getByRole("link", { name: "Projetos" }).click();
  await expect(page).toHaveURL(/\/pt#projects$/);
  await expectSectionBelowHeader(page, "projects");
});

test("trocar de idioma preserva a seção atual", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/pt#projects");
  await expectSectionBelowHeader(page, "projects");
  await page.getByRole("navigation", { name: "Idioma" }).getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en#projects$/);
  await expectSectionBelowHeader(page, "projects");
});

test("as seis seções do briefing existem na Home, cada uma com título", async ({ page }) => {
  await page.goto("/pt");
  for (const id of ["hero", "about", "experience", "projects", "events", "contact"]) {
    await expect(page.locator(`section#${id}:visible :is(h1, h2)`).first()).toBeVisible();
  }
  await expect(page.locator("h1")).toHaveCount(1);
});
