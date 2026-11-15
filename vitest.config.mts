import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    // Testes de unidade ficam ao lado do código (src/**); os e2e do Playwright ficam em e2e/.
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "node",
  },
});
