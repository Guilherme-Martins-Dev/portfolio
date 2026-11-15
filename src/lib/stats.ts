import type { EventRole, Experience, PortfolioEvent, Project, ProjectStatus } from "./schemas";

/**
 * Indicadores da Home (decisão D05): sempre calculados a partir de src/content, nunca digitados.
 * Funções puras para facilitar os testes; a data de referência entra como parâmetro.
 */

export type Stats = {
  totalProjects: number;
  projectsByStatus: Record<ProjectStatus, number>;
  totalEvents: number;
  eventsByRole: Record<EventRole, number>;
  /** Tecnologias distintas usadas em projetos e experiências. */
  distinctTechnologies: number;
  /** Anos completos desde o início da primeira experiência; `null` sem experiência cadastrada. */
  yearsOfExperience: number | null;
};

const statuses: ProjectStatus[] = ["concluido", "em-desenvolvimento", "planejamento"];
const roles: EventRole[] = ["participante", "organizador", "palestrante", "mentor", "apoio-tecnico"];

export function countBy<K extends string>(keys: readonly K[], values: readonly K[]): Record<K, number> {
  const counts = Object.fromEntries(keys.map((k) => [k, 0])) as Record<K, number>;
  for (const v of values) counts[v] += 1;
  return counts;
}

/** Converte "AAAA", "AAAA-MM" ou "AAAA-MM-DD" em Date (UTC), usando o primeiro dia do período. */
export function parsePartialDate(value: string): Date {
  const [year, month = "01", day = "01"] = value.split("-");
  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
}

export function fullYearsBetween(start: Date, end: Date): number {
  let years = end.getUTCFullYear() - start.getUTCFullYear();
  const beforeAnniversary =
    end.getUTCMonth() < start.getUTCMonth() ||
    (end.getUTCMonth() === start.getUTCMonth() && end.getUTCDate() < start.getUTCDate());
  if (beforeAnniversary) years -= 1;
  return Math.max(0, years);
}

export function computeStats(
  input: { projects: Project[]; events: PortfolioEvent[]; experience: Experience[] },
  now: Date = new Date(),
): Stats {
  const techs = new Set([
    ...input.projects.flatMap((p) => p.technologies),
    ...input.experience.flatMap((e) => e.technologies),
  ]);

  const starts = input.experience.map((e) => parsePartialDate(e.start).getTime());
  const firstStart = starts.length > 0 ? new Date(Math.min(...starts)) : null;

  return {
    totalProjects: input.projects.length,
    projectsByStatus: countBy(statuses, input.projects.map((p) => p.status)),
    totalEvents: input.events.length,
    eventsByRole: countBy(roles, input.events.map((e) => e.role)),
    distinctTechnologies: techs.size,
    yearsOfExperience: firstStart ? fullYearsBetween(firstStart, now) : null,
  };
}

export type Indicator = { key: string; value: number };

/**
 * Lista dos indicadores que podem aparecer na Home. Indicador zerado ou sem dado não aparece
 * (regra do conteúdo: campo vazio não aparece). Os rótulos ficam nas mensagens de i18n.
 */
export function toIndicators(stats: Stats): Indicator[] {
  const all: Array<[string, number | null]> = [
    ["projects", stats.totalProjects],
    ["projectsCompleted", stats.projectsByStatus.concluido],
    ["projectsInProgress", stats.projectsByStatus["em-desenvolvimento"]],
    ["events", stats.totalEvents],
    ["eventsOrganized", stats.eventsByRole.organizador],
    ["technologies", stats.distinctTechnologies],
    ["yearsOfExperience", stats.yearsOfExperience],
  ];
  return all.filter((entry): entry is [string, number] => entry[1] !== null && entry[1] > 0).map(([key, value]) => ({ key, value }));
}
