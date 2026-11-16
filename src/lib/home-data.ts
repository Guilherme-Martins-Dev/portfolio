import { events, experience, projects, technologies } from "@/content";

import { computeStats, focusAreas, toIndicators } from "./stats";

/**
 * Dados da Home calculados a partir de src/content (D05). "use cache" deixa `new Date()`
 * dentro do cálculo (anos de experiência), que o `cacheComponents` não aceita no prerender.
 */
export async function getHomeIndicators() {
  "use cache";
  return toIndicators(computeStats({ projects, events, experience }));
}

export function getFocusAreas() {
  return focusAreas({ projects, experience }, technologies);
}
