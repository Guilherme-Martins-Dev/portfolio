import {
  technologyAreas,
  type Experience,
  type PortfolioEvent,
  type Study,
  type Technology,
  type TechnologyArea,
} from "./schemas";
import { parsePartialDate } from "./stats";

/**
 * Dados das páginas internas (#18): Sobre, Experiência, Eventos e Estudos.
 * Funções puras: recebem as coleções de src/content e devolvem o que a interface mostra.
 */

/**
 * Ordena do mais recente para o mais antigo pela data devolvida por `dateOf`.
 * Item sem data vai para o fim; empate mantém a ordem do cadastro (sort estável).
 */
export function sortByDateDesc<T>(items: readonly T[], dateOf: (item: T) => string | undefined): T[] {
  const time = (item: T) => {
    const date = dateOf(item);
    return date ? parsePartialDate(date).getTime() : Number.NEGATIVE_INFINITY;
  };
  return [...items].sort((a, b) => {
    const ta = time(a);
    const tb = time(b);
    if (ta === tb) return 0;
    return tb > ta ? 1 : -1;
  });
}

/** Experiências: as em andamento (sem `end`) primeiro, depois pela data de início, da mais recente. */
export function sortExperience(experience: readonly Experience[]): Experience[] {
  const ongoing = experience.filter((e) => !e.end);
  const finished = experience.filter((e) => e.end);
  return [...sortByDateDesc(ongoing, (e) => e.start), ...sortByDateDesc(finished, (e) => e.start)];
}

export type EventGroups = {
  /** Eventos em que o Guilherme participou. */
  participation: PortfolioEvent[];
  /** Organização e colaboração: organizador, palestrante, mentor ou apoio técnico. */
  organization: PortfolioEvent[];
};

/** Separa os eventos em "Participação" e "Organização e colaboração" (D03), do mais recente ao mais antigo. */
export function splitEvents(events: readonly PortfolioEvent[]): EventGroups {
  const sorted = sortByDateDesc(events, (e) => e.date);
  return {
    participation: sorted.filter((e) => e.role === "participante"),
    organization: sorted.filter((e) => e.role !== "participante"),
  };
}

/** Estudos do mais recente para o mais antigo: em andamento primeiro, depois pela conclusão (ou início). */
export function sortStudies(studies: readonly Study[]): Study[] {
  const ongoing = studies.filter((s) => s.start && !s.end);
  const rest = studies.filter((s) => !(s.start && !s.end));
  return [...sortByDateDesc(ongoing, (s) => s.start), ...sortByDateDesc(rest, (s) => s.end ?? s.start)];
}

export type TechnologyGroup = { area: TechnologyArea; technologies: Technology[] };

/** Tecnologias agrupadas por área, na ordem de `technologyAreas`. Área sem tecnologia não aparece. */
export function groupTechnologies(technologies: readonly Technology[]): TechnologyGroup[] {
  return technologyAreas.flatMap((area) => {
    const items = technologies.filter((t) => t.area === area);
    return items.length > 0 ? [{ area, technologies: items }] : [];
  });
}
