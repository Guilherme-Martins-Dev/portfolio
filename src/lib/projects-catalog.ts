import type { CaseStudy, CaseStudyLocale } from "./case-studies";
import type { Project, ProjectStatus, Technology } from "./schemas";

/**
 * Regras das páginas /projetos e /projetos/[slug] (#17). Funções puras: recebem as coleções
 * de src/content e os estudos de caso do Velite e devolvem o que a interface mostra.
 */

/** Ordem fixa dos filtros de status: concluídos, depois em andamento, depois planejados. */
export const STATUS_ORDER: ProjectStatus[] = ["concluido", "em-desenvolvimento", "planejamento"];

export type ProjectFilters = {
  /** Só os status que existem em algum projeto, na ordem de STATUS_ORDER. */
  statuses: ProjectStatus[];
  /** Só as tecnologias usadas em algum projeto, em ordem alfabética do nome. */
  technologies: Pick<Technology, "id" | "name">[];
};

/** Opções de filtro que de fato reduzem a lista: nenhum filtro aponta para uma lista vazia de saída. */
export function projectFilters(projects: Project[], technologies: Technology[]): ProjectFilters {
  const statuses = STATUS_ORDER.filter((s) => projects.some((p) => p.status === s));
  const used = new Set(projects.flatMap((p) => p.technologies));
  return {
    statuses,
    technologies: technologies
      .filter((t) => used.has(t.id))
      .map(({ id, name }) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
  };
}

export type ProjectQuery = { status?: ProjectStatus; technology?: string };

/** Um projeto passa quando atende a todos os filtros escolhidos (filtro ausente = qualquer valor). */
export function matchesQuery(project: Pick<Project, "status" | "technologies">, query: ProjectQuery): boolean {
  if (query.status && project.status !== query.status) return false;
  if (query.technology && !project.technologies.includes(query.technology)) return false;
  return true;
}

export function filterProjects<T extends Pick<Project, "status" | "technologies">>(projects: T[], query: ProjectQuery): T[] {
  return projects.filter((p) => matchesQuery(p, query));
}

/** Lista completa da página /projetos: concluídos, depois em desenvolvimento, depois em planejamento; na ordem do cadastro. */
export function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status));
}

export type ResolvedCaseStudy = {
  study: CaseStudy;
  /** true quando o estudo veio do outro idioma porque o atual não existe (ou é rascunho). */
  fallback: boolean;
};

/**
 * Estudo de caso do idioma atual; sem ele, o do outro idioma, marcado como fallback.
 * `studies` já deve vir sem os rascunhos (ver getCaseStudies). Sem nenhum dos dois: undefined (404).
 */
export function resolveCaseStudy(
  slug: string,
  locale: CaseStudyLocale,
  studies: CaseStudy[],
): ResolvedCaseStudy | undefined {
  const current = studies.find((s) => s.slug === slug && s.locale === locale);
  if (current) return { study: current, fallback: false };
  const other = studies.find((s) => s.slug === slug && s.locale !== locale);
  return other ? { study: other, fallback: true } : undefined;
}

/**
 * Dados da página /projetos/[slug]: o projeto de projects.ts e o estudo de caso visível.
 * 404 (undefined) quando o slug não existe em projects.ts ou não tem estudo de caso publicado
 * em nenhum idioma (rascunho conta como inexistente em produção).
 */
export function caseStudyPage(
  slug: string,
  locale: CaseStudyLocale,
  content: { projects: Project[]; studies: CaseStudy[] },
): (ResolvedCaseStudy & { project: Project }) | undefined {
  const project = content.projects.find((p) => p.slug === slug);
  if (!project) return undefined;
  const resolved = resolveCaseStudy(slug, locale, content.studies);
  return resolved && { ...resolved, project };
}

/**
 * Slug reservado, sempre pré-renderizado como 404 (o schema de slug não aceita "_", então não
 * colide com projeto). O proxy reescreve /projetos/<slug-desconhecido> para ele, para a resposta
 * sair com HTTP 404 em vez do "soft 404" do Cache Components.
 */
export const NOT_FOUND_SLUG = "_404";
