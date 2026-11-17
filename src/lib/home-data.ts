import { events, experience, profile, projects, technologies } from "@/content";

import { buildTimeline, contactLinks, splitFeaturedProjects, technologyNames } from "./home-sections";
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

export function getHomeProjects() {
  return splitFeaturedProjects(projects);
}

export function getProjectTechnologies(ids: string[]) {
  return technologyNames(ids, technologies);
}

export function getTimeline() {
  return buildTimeline({ experience, events });
}

export function getContactLinks() {
  return contactLinks(profile);
}
