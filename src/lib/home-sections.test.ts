import { describe, expect, it } from "vitest";

import { buildTimeline, contactLinks, formatPartialDate, splitFeaturedProjects, technologyNames } from "./home-sections";
import type { Experience, PortfolioEvent, Project } from "./schemas";

const project = (slug: string, status: Project["status"], featured = true): Project => ({
  slug,
  title: slug,
  summary: { pt: slug, en: slug },
  status,
  featured,
  confidential: false,
  technologies: [],
  links: {},
});

const job = (id: string, start: string, end?: string): Experience => ({
  id,
  organization: id,
  role: { pt: "Dev", en: "Dev" },
  start,
  end,
  technologies: [],
});

const event = (id: string, date?: string): PortfolioEvent => ({ id, name: id, role: "participante", date, links: {} });

describe("splitFeaturedProjects", () => {
  it("só usa os projetos em destaque e separa concluídos de em desenvolvimento", () => {
    const result = splitFeaturedProjects([
      project("a", "concluido"),
      project("b", "em-desenvolvimento"),
      project("c", "concluido", false),
      project("d", "planejamento"),
    ]);
    expect(result.completed.map((p) => p.slug)).toEqual(["a"]);
    expect(result.inProgress.map((p) => p.slug)).toEqual(["b", "d"]);
  });

  it("mostra no máximo 4 projetos em destaque", () => {
    const many = ["a", "b", "c", "d", "e"].map((s) => project(s, "concluido"));
    expect(splitFeaturedProjects(many).completed).toHaveLength(4);
  });
});

describe("technologyNames", () => {
  it("troca ids por nomes e ignora id desconhecido", () => {
    const techs = [{ id: "arduino", name: "Arduino", area: "hardware" as const }];
    expect(technologyNames(["arduino", "x"], techs)).toEqual(["Arduino"]);
  });
});

describe("buildTimeline", () => {
  it("ordena do mais recente para o mais antigo, misturando experiências e eventos", () => {
    const timeline = buildTimeline({
      experience: [job("antigo", "2022-03", "2023"), job("atual", "2025-02")],
      events: [event("feira", "2024-10-05"), event("hackathon", "2026")],
    });
    expect(timeline.map((i) => i.id)).toEqual([
      "event-hackathon",
      "experience-atual",
      "event-feira",
      "experience-antigo",
    ]);
  });

  it("deixa de fora evento sem data", () => {
    expect(buildTimeline({ experience: [], events: [event("sem-data")] })).toEqual([]);
  });

  it("no empate, a experiência em andamento vem primeiro", () => {
    const timeline = buildTimeline({ experience: [job("fechada", "2024", "2025"), job("aberta", "2024")], events: [] });
    expect(timeline.map((i) => i.id)).toEqual(["experience-aberta", "experience-fechada"]);
  });
});

describe("formatPartialDate", () => {
  it("respeita a precisão do dado", () => {
    expect(formatPartialDate("2026", "pt")).toBe("2026");
    expect(formatPartialDate("2026-11", "en")).toBe("Nov 2026");
    expect(formatPartialDate("2026-11-05", "en")).toBe("Nov 5, 2026");
    expect(formatPartialDate("2026-01", "pt")).toMatch(/jan\.? de 2026/);
  });
});

describe("contactLinks", () => {
  it("não inventa contato: vazio sem dados", () => {
    expect(contactLinks({ links: {} })).toEqual([]);
  });

  it("lista e-mail, LinkedIn e GitHub nessa ordem", () => {
    const links = contactLinks({
      email: "a@b.dev",
      links: { github: "https://github.com/x", linkedin: "https://linkedin.com/in/x" },
    });
    expect(links.map((l) => l.kind)).toEqual(["email", "linkedin", "github"]);
    expect(links[0].href).toBe("mailto:a@b.dev");
  });
});
