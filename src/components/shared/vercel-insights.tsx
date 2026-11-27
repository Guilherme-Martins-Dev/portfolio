import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { shouldLoadVercelInsights } from "@/lib/vercel-insights";

/** Vercel Web Analytics + Speed Insights (P04), só no deploy de produção. */
export function VercelInsights() {
  if (!shouldLoadVercelInsights()) return null;
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
