import { expect, test, type Page } from "@playwright/test";

// Movimento reduzido e botão "Reduzir efeitos" (#19). Roda nos dois projetos: com e sem
// prefers-reduced-motion emulado.

const toggle = (page: Page) => page.locator("header [data-reduce-motion-toggle]");
const htmlHasAttribute = (page: Page) =>
  page.evaluate(() => document.documentElement.hasAttribute("data-reduce-motion"));

test("o botão Reduzir efeitos liga, persiste ao recarregar e desliga", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/pt");
  const button = toggle(page);
  await expect(button).toHaveAccessibleName("Reduzir efeitos");
  await expect(button).toHaveAttribute("aria-pressed", "false");

  await button.click();
  await expect(button).toHaveAttribute("aria-pressed", "true");
  expect(await htmlHasAttribute(page)).toBe(true);

  // O script do <head> aplica a escolha antes do primeiro paint (sem animar e depois parar).
  await page.reload({ waitUntil: "commit" });
  await page.waitForFunction(() => document.readyState !== "loading");
  expect(await htmlHasAttribute(page)).toBe(true);
  await expect(toggle(page)).toHaveAttribute("aria-pressed", "true");

  await toggle(page).click();
  await expect(toggle(page)).toHaveAttribute("aria-pressed", "false");
  expect(await htmlHasAttribute(page)).toBe(false);
});

test("em inglês o botão tem rótulo próprio", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/en");
  await expect(toggle(page)).toHaveAccessibleName("Reduce effects");
});

test("com o botão ligado, o card perde a profundidade 3D e as transições", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/pt");
  await toggle(page).click();
  const card = page.locator("#projects [data-project-card]").first();
  await card.scrollIntoViewIfNeeded();
  await card.hover();
  await expect
    .poll(() => card.evaluate((el) => getComputedStyle(el).rotate === "none" && getComputedStyle(el).transform === "none"))
    .toBe(true);
  expect(await card.evaluate((el) => parseFloat(getComputedStyle(el).transitionDuration))).toBeLessThan(0.001);
});

for (const reduceButton of [false, true]) {
  test(`Tab, Home, End e âncoras funcionam${reduceButton ? " com Reduzir efeitos" : ""}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/pt");
    if (reduceButton) {
      // Liga e recarrega: vale a escolha salva, e o foco recomeça do topo do documento.
      await toggle(page).click();
      await page.reload();
      await expect(toggle(page)).toHaveAttribute("aria-pressed", "true");
    }

    // Tab percorre o cabeçalho a partir do skip link, sem ficar preso.
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toHaveText("Pular para o conteúdo");
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toBeVisible();

    const maxScroll = () => page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
    const scrollY = () => page.evaluate(() => Math.round(window.scrollY));

    await page.keyboard.press("End");
    await expect.poll(async () => (await maxScroll()) - (await scrollY())).toBeLessThanOrEqual(2);
    await page.keyboard.press("Home");
    await expect.poll(scrollY).toBe(0);

    // Âncora pelo menu continua levando à seção.
    await page.getByRole("navigation", { name: "Navegação principal" }).getByRole("link", { name: "Contato", exact: true }).click();
    await expect(page).toHaveURL(/\/pt#contact$/);
    await expect(page.locator("section#contact:visible h2")).toBeInViewport();
  });
}
