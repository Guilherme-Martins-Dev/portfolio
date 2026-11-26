import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Páginas internas (#18). Os dados vêm de src/content e podem estar vazios (TODO(guilherme));
// os testes conferem só a estrutura: rota traduzida, um h1, metadata própria e acessibilidade.
const pages = [
  { pt: "/pt/sobre", en: "/en/about", titles: { pt: "Sobre", en: "About" } },
  { pt: "/pt/experiencia", en: "/en/experience", titles: { pt: "Experiência", en: "Experience" } },
  { pt: "/pt/eventos", en: "/en/events", titles: { pt: "Eventos", en: "Events" } },
  { pt: "/pt/estudos", en: "/en/studies", titles: { pt: "Estudos", en: "Studies" } },
  { pt: "/pt/contato", en: "/en/contact", titles: { pt: "Contato", en: "Contact" } },
] as const;

const locales = [
  { locale: "pt", lang: "pt-BR" },
  { locale: "en", lang: "en" },
] as const;

for (const page of pages) {
  for (const { locale, lang } of locales) {
    const path = page[locale];
    const title = page.titles[locale];

    test.describe(path, () => {
      test("abre com status 200, um h1 e metadata própria", async ({ page: browser }) => {
        const response = await browser.goto(path);
        expect(response?.status()).toBe(200);
        await expect(browser.locator("html")).toHaveAttribute("lang", lang);
        await expect(browser.locator("h1")).toHaveCount(1);
        await expect(browser.locator("h1")).toHaveText(title);
        await expect(browser).toHaveTitle(new RegExp(`^${title} · `));
        await expect(browser.locator('meta[name="description"]')).toHaveAttribute("content", /\S+/);
      });

      test("não tem violações de acessibilidade (axe, WCAG A/AA)", async ({ page: browser }) => {
        await browser.goto(path);
        const results = await new AxeBuilder({ page: browser })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();
        expect(results.violations).toEqual([]);
      });
    });
  }
}

test("a rota em português no prefixo /en redireciona para a URL traduzida", async ({ page }) => {
  await page.goto("/en/sobre");
  await expect(page).toHaveURL(/\/en\/about$/);
});

test("o seletor de idioma leva para a página equivalente", async ({ page }) => {
  await page.goto("/pt/eventos");
  const switcher = page.locator('header a[hreflang="en"]').first();
  await expect(switcher).toHaveAttribute("href", "/en/events");
});

for (const { path, participation, organization } of [
  { path: "/pt/eventos", participation: "Participação", organization: "Organização e colaboração" },
  { path: "/en/events", participation: "Participation", organization: "Organization and collaboration" },
]) {
  test(`${path} separa participação de organização e colaboração`, async ({ page }) => {
    await page.goto(path);
    const headings = page.locator("main h2");
    await expect(headings).toHaveText([participation, organization]);
  });
}

test("contato: e-mail selecionável, botão copiar e perfis só quando cadastrados", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/pt/contato");
  const email = page.locator("[data-contact-email]");

  if ((await email.count()) === 0) {
    // Sem e-mail nem perfis em profile.ts (TODO(guilherme)): só o aviso, nenhum link vazio.
    await expect(page.locator("main a[href^='mailto:']")).toHaveCount(0);
    return;
  }

  const address = (await email.innerText()).trim();
  await expect(email).toHaveAttribute("href", `mailto:${address}`);
  await page.getByRole("button", { name: "Copiar e-mail" }).click();
  await expect(page.getByRole("status")).toHaveText("E-mail copiado");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(address);
});

test("contato: sem as variáveis do formulário (#26), não há formulário e nada quebra", async ({ page }) => {
  test.skip(
    !!(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY),
    "o build foi feito com o formulário ligado",
  );
  const response = await page.goto("/pt/contato");
  expect(response?.status()).toBe(200);
  await expect(page.locator("[data-contact-form]")).toHaveCount(0);
  await expect(page.locator("[data-turnstile]")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Contato");
});
