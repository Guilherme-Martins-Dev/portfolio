import { describe, expect, it } from "vitest";

import { shouldLoadVercelInsights } from "./vercel-insights";

describe("shouldLoadVercelInsights", () => {
  it("carrega só no deploy de produção da Vercel", () => {
    expect(shouldLoadVercelInsights({ VERCEL_ENV: "production" })).toBe(true);
  });

  it("não carrega em preview, desenvolvimento ou fora da Vercel", () => {
    expect(shouldLoadVercelInsights({ VERCEL_ENV: "preview" })).toBe(false);
    expect(shouldLoadVercelInsights({ VERCEL_ENV: "development" })).toBe(false);
    expect(shouldLoadVercelInsights({})).toBe(false);
  });

  it("DISABLE_VERCEL_INSIGHTS desliga mesmo em produção", () => {
    expect(shouldLoadVercelInsights({ VERCEL_ENV: "production", DISABLE_VERCEL_INSIGHTS: "1" })).toBe(false);
    expect(shouldLoadVercelInsights({ VERCEL_ENV: "production", DISABLE_VERCEL_INSIGHTS: "true" })).toBe(false);
    expect(shouldLoadVercelInsights({ VERCEL_ENV: "production", DISABLE_VERCEL_INSIGHTS: "" })).toBe(true);
  });
});
