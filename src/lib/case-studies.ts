import { caseStudies, type CaseStudy } from "#site/content";

export type { CaseStudy };
export type CaseStudyLocale = CaseStudy["locale"];

/** Rascunhos aparecem no `next dev` e nunca no build de produção. */
export function isVisible(study: Pick<CaseStudy, "draft">, env: string | undefined = process.env.NODE_ENV): boolean {
  return !study.draft || env !== "production";
}

export function getCaseStudies(locale: CaseStudyLocale, all: CaseStudy[] = caseStudies): CaseStudy[] {
  return all.filter((s) => s.locale === locale && isVisible(s));
}

export function getCaseStudy(slug: string, locale: CaseStudyLocale, all: CaseStudy[] = caseStudies): CaseStudy | undefined {
  return getCaseStudies(locale, all).find((s) => s.slug === slug);
}

/** Todos os estudos de caso visíveis no ambiente atual, nos dois idiomas. */
export function getVisibleCaseStudies(all: CaseStudy[] = caseStudies): CaseStudy[] {
  return all.filter((s) => isVisible(s));
}
