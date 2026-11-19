import { expect, test, type Page } from "@playwright/test";

// Cena 3D (fase 4): um único canvas persistente, decorativo, que só desenha quando algo muda.

const hasWebGL = (page: Page) =>
  page.evaluate(() => {
    const probe = document.createElement("canvas");
    return Boolean(probe.getContext("webgl2") ?? probe.getContext("webgl"));
  });

const frames = (page: Page) => page.evaluate(() => window.__sceneFrames ?? 0);

/** Espera a cena carregar (ela entra depois do primeiro desenho) e devolve se há canvas. */
async function sceneReady(page: Page) {
  if (!(await hasWebGL(page))) return false;
  await expect(page.locator("canvas")).toHaveCount(1, { timeout: 15_000 });
  await expect.poll(() => frames(page), { timeout: 10_000 }).toBeGreaterThan(0);
  return true;
}

test("a camada da cena é decorativa e existe uma só", async ({ page }) => {
  await page.goto("/pt");
  const layer = page.locator("[data-scene-layer]");
  await expect(layer).toHaveCount(1);
  await expect(layer).toHaveAttribute("aria-hidden", "true");
  // Nunca mais de um canvas, com ou sem WebGL.
  expect(await page.locator("canvas").count()).toBeLessThanOrEqual(1);
});

test("o LCP é o conteúdo, nunca o canvas", async ({ page }) => {
  await page.goto("/pt");
  await sceneReady(page);
  const tag = await page.evaluate(
    () =>
      new Promise<string>((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries() as (PerformanceEntry & { element?: Element | null })[];
          resolve(entries.at(-1)?.element?.tagName ?? "none");
        }).observe({ type: "largest-contentful-paint", buffered: true });
      }),
  );
  expect(tag).not.toBe("CANVAS");
});

test("parada, a cena não desenha; ao rolar, desenha e volta a parar", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/pt");
  if (!(await sceneReady(page))) test.skip(true, "sem WebGL neste ambiente");

  // Deixa a cena assentar e confere que nenhum frame novo é pedido.
  await page.waitForTimeout(1500);
  const parked = await frames(page);
  await page.waitForTimeout(1000);
  expect(await frames(page)).toBe(parked);

  // Rolar pede frames…
  await page.evaluate(() => window.scrollTo(0, 1200));
  await expect.poll(() => frames(page)).toBeGreaterThan(parked);

  // …e, parada de novo, a cena para de desenhar.
  await page.waitForTimeout(2500);
  const settled = await frames(page);
  await page.waitForTimeout(1000);
  expect(await frames(page)).toBe(settled);
});

test("o mesmo canvas sobrevive à navegação entre páginas", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/pt");
  if (!(await sceneReady(page))) test.skip(true, "sem WebGL neste ambiente");

  await page.locator("canvas").evaluate((canvas) => canvas.setAttribute("data-marca", "original"));
  await page.getByRole("contentinfo").getByRole("link", { name: "Sobre", exact: true }).click();
  await expect(page).toHaveURL(/\/pt\/sobre$/);
  await page.getByRole("banner").getByRole("link", { name: "Guilherme Martins Bezerra" }).click();
  await expect(page).toHaveURL(/\/pt$/);

  await expect(page.locator("canvas")).toHaveCount(1);
  await expect(page.locator("canvas")).toHaveAttribute("data-marca", "original");
});
