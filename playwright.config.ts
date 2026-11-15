import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3000);
const baseURL = `http://localhost:${PORT}`;

// Em ambientes com um Chromium já instalado fora do cache do Playwright (ex.: o ambiente do agente),
// aponte PW_CHROMIUM_PATH para ele; no CI o navegador vem de `playwright install`.
const executablePath = process.env.PW_CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
    launchOptions: { executablePath },
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    // Mesmo conjunto de testes com movimento reduzido (D20): nada pode depender de animação.
    { name: "chromium-reduced-motion", use: { ...devices["Desktop Chrome"], reducedMotion: "reduce" } },
  ],
  webServer: {
    // No CI o build já foi feito no passo anterior; localmente, builda antes de subir.
    command: process.env.CI ? `pnpm start -p ${PORT}` : `pnpm build && pnpm start -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
