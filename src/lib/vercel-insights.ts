type InsightsEnv = Record<string, string | undefined>;

/**
 * Web Analytics e Speed Insights só carregam no deploy de produção da Vercel
 * (nem em `next dev`, nem em previews, nem num `next start` local).
 * `DISABLE_VERCEL_INSIGHTS=1` desliga os dois sem mexer no código.
 * O layout é pré-renderizado, então vale o valor do momento do build: mudou, faça um novo deploy.
 */
export function shouldLoadVercelInsights(env: InsightsEnv = process.env): boolean {
  if (env.DISABLE_VERCEL_INSIGHTS === "1" || env.DISABLE_VERCEL_INSIGHTS === "true") return false;
  return env.VERCEL_ENV === "production";
}
