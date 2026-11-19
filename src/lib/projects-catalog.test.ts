import { describe, expect, it } from "vitest";

import { projects, technologies } from "@/content";
import { caseStudies } from "#site/content";
import type { CaseStudy } from "./case-studies";
import { getVisibleCaseStudies } from "./case-studies";
import {
  caseStudyPage,
  filterProjects,
  projectFilters,
  resolveCaseStudy,
  sortProjects,
} from "./projects-catalog";
import type { Project, Technology } from "./schemas";

const project = (slug: string, status: Project["status"], techs: string[] = []): Project => ({
  slug,
  title: slug,
  summary: { pt: slug, en: slug },
  status,
  featured: false,
  confidential: false,
  technologies: techs,
  links: {},
});

const techs: Technology[] = [
  { id: "react", name: "React", area: "frontend" },
  { id: "arduino", name: "Arduino", area: "hardware" },
  { id: "moodle", name: "Moodle", area: "integracao" },
];

const sample = [
  project("a", "em-desenvolvimento", ["react"]),
  project("b", "concluido", ["arduino", "react"]),
  project("c", "em-desenvolvimento"),
];

const study = (slug: string, locale: "pt" | "en", draft = false) =>
  ({ slug, locale, draft, title: `${slug}-${locale}`, summary: "s", path: `projects/${slug}.${locale}`, body: "" }) as CaseStudy;

describe("filtros da página /projetos", () => {
  it("só oferece status e tecnologias que existem em algum projeto", () => {
    const options = projectFilters(sample, techs);
    expect(options.statuses).toEqual(["concluido", "em-desenvolvimento"]);
    expect(options.technologies.map((t) => t.id)).toEqual(["arduino", "react"]);
  });

  it("filtra por status, por tecnologia e pelos dois juntos", () => {
    expect(filterProjects(sample, {}).map((p) => p.slug)).toEqual(["a", "b", "c"]);
    expect(filterProjects(sample, { status: "em-desenvolvimento" }).map((p) => p.slug)).toEqual(["a", "c"]);
    expect(filterProjects(sample, { technology: "react" }).map((p) => p.slug)).toEqual(["a", "b"]);
    expect(filterProjects(sample, { status: "concluido", technology: "react" }).map((p) => p.slug)).toEqual(["b"]);
    expect(filterProjects(sample, { status: "planejamento" })).toEqual([]);
  });

  it("ordena concluídos antes dos em desenvolvimento, mantendo a ordem do cadastro", () => {
    expect(sortProjects(sample).map((p) => p.slug)).toEqual(["b", "a", "c"]);
  });

  it("cada opção de filtro do conteúdo real devolve pelo menos um projeto", () => {
    const options = projectFilters(projects, technologies);
    for (const status of options.statuses) expect(filterProjects(projects, { status }).length).toBeGreaterThan(0);
    for (const t of options.technologies) expect(filterProjects(projects, { technology: t.id }).length).toBeGreaterThan(0);
  });
});

describe("estudo de caso por idioma", () => {
  it("usa o idioma atual quando existe", () => {
    const resolved = resolveCaseStudy("x", "en", [study("x", "pt"), study("x", "en")]);
    expect(resolved).toMatchObject({ fallback: false, study: { locale: "en" } });
  });

  it("cai no outro idioma e marca o fallback", () => {
    expect(resolveCaseStudy("x", "en", [study("x", "pt")])).toMatchObject({ fallback: true, study: { locale: "pt" } });
    expect(resolveCaseStudy("x", "pt", [study("x", "en")])).toMatchObject({ fallback: true, study: { locale: "en" } });
  });

  it("rascunho conta como inexistente em produção (404) e o outro idioma publicado é o fallback", () => {
    const all = [study("x", "pt", true), study("x", "en")];
    const prod = all.filter((s) => !s.draft);
    expect(resolveCaseStudy("x", "pt", prod)).toMatchObject({ fallback: true, study: { locale: "en" } });
    expect(resolveCaseStudy("y", "pt", prod)).toBeUndefined();
    expect(resolveCaseStudy("x", "pt", [study("x", "pt", true)].filter((s) => !s.draft))).toBeUndefined();
  });

  it("404 para slug fora de projects.ts, mesmo com MDX", () => {
    const content = { projects: sample, studies: [study("a", "pt"), study("zzz", "pt")] };
    expect(caseStudyPage("zzz", "pt", content)).toBeUndefined();
    expect(caseStudyPage("a", "en", content)).toMatchObject({ fallback: true, project: { slug: "a" } });
    expect(caseStudyPage("b", "pt", content)).toBeUndefined();
  });

  it("com o conteúdo real, todo estudo visível aponta para um projeto e abre nos dois idiomas", () => {
    for (const s of getVisibleCaseStudies(caseStudies)) {
      for (const locale of ["pt", "en"] as const) {
        expect(caseStudyPage(s.slug, locale, { projects, studies: getVisibleCaseStudies() }), `${s.slug}/${locale}`).toBeDefined();
      }
    }
  });
});
