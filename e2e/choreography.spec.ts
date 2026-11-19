import { expect, test, type Page } from "@playwright/test";

// Coreografia de scroll dos capítulos (#21): tudo legível em repouso, nada escondido com
// movimento reduzido, contagem termina no valor real, sem pin no celular.

const visibleIndicators = (page: Page) =>
  page.evaluate(() => {
    const shown = [...document.querySelectorAll<HTMLElement>('span[aria-hidden="true"].font-display')].filter(
      (n) => n.getClientRects().length > 0,
    );
    return shown.map((n) => ({ shown: n.textContent, real: n.previousElementSibling?.textContent }));
  });

async function scrollThrough(page: Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 500) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    await page.waitForTimeout(60);
  }
}

test("indicadores: o número visível termina igual ao valor lido pelo leitor de tela", async ({ page }) => {
  await page.goto("/pt");
  await page.locator("#about").scrollIntoViewIfNeeded();
  await scrollThrough(page);
  await expect
    .poll(async () => (await visibleIndicators(page)).every((i) => i.shown === i.real), { timeout: 8_000 })
    .toBe(true);
  expect((await visibleIndicators(page)).length).toBeGreaterThan(0);
});

test("nada na Home fica invisível (opacity 0) depois de rolar tudo", async ({ page }) => {
  await page.goto("/pt");
  await scrollThrough(page);
  await page.waitForTimeout(1500);
  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>("main *")]
      .filter((n) => n.getClientRects().length > 0 && getComputedStyle(n).opacity === "0")
      .map((n) => n.tagName + "." + n.className),
  );
  expect(hidden).toEqual([]);
});

test("com movimento reduzido não há pin, trilho horizontal nem parallax", async ({ page }, info) => {
  test.skip(info.project.name !== "chromium-reduced-motion", "só no projeto de movimento reduzido");
  await page.goto("/pt");
  await scrollThrough(page);
  expect(await page.locator(".pin-spacer").count()).toBe(0);
  expect(await page.locator(".timeline-h").count()).toBe(0);
  const transformed = await page.evaluate(
    () =>
      [...document.querySelectorAll<HTMLElement>("#projects ul > li")].filter(
        (li) => getComputedStyle(li).transform !== "none",
      ).length,
  );
  expect(transformed).toBe(0);
});

test("no celular não há pin: a linha do tempo fica vertical", async ({ page }, info) => {
  test.skip(info.project.name === "chromium-reduced-motion", "o caso de movimento reduzido já é coberto");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/pt");
  await scrollThrough(page);
  expect(await page.locator(".pin-spacer").count()).toBe(0);
  expect(await page.locator(".timeline-h").count()).toBe(0);
});
