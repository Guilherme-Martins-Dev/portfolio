import { describe, expect, it } from "vitest";

import type { Experience, PortfolioEvent, Project } from "./schemas";
import { computeStats, fullYearsBetween, parsePartialDate, toIndicators } from "./stats";

const project = (slug: string, status: Project["status"], technologies: string[] = []): Project => ({
  slug,
  title: slug,
  summary: { pt: slug, en: slug },
  status,
  featured: false,
  confidential: false,
  technologies,
  links: {},
});

const event = (id: string, role: PortfolioEvent["role"]): PortfolioEvent => ({ id, name: id, role, links: {} });

const job = (id: string, start: string, technologies: string[] = []): Experience => ({
  id,
  organization: id,
  role: { pt: "Dev", en: "Dev" },
  start,
  technologies,
});

describe("computeStats", () => {
  const now = new Date(Date.UTC(2026, 10, 15));

  it("conta projetos por status e eventos por papel", () => {
    const stats = computeStats(
      {
        projects: [project("a", "concluido"), project("b", "em-desenvolvimento"), project("c", "em-desenvolvimento")],
        events: [event("x", "organizador"), event("y", "participante"), event("z", "participante")],
        experience: [],
      },
      now,
    );
    expect(stats.totalProjects).toBe(3);
    expect(stats.projectsByStatus).toEqual({ concluido: 1, "em-desenvolvimento": 2, planejamento: 0 });
    expect(stats.totalEvents).toBe(3);
    expect(stats.eventsByRole).toEqual({ participante: 2, organizador: 1, palestrante: 0, mentor: 0, "apoio-tecnico": 0 });
  });

  it("conta tecnologias distintas entre projetos e experiências", () => {
    const stats = computeStats(
      {
        projects: [project("a", "concluido", ["react", "three"]), project("b", "concluido", ["react"])],
        events: [],
        experience: [job("j", "2024", ["react", "node"])],
      },
      now,
    );
    expect(stats.distinctTechnologies).toBe(3);
  });

  it("calcula anos completos desde a primeira experiência", () => {
    const stats = computeStats(
      { projects: [], events: [], experience: [job("b", "2024-03"), job("a", "2022-12-01")] },
      now,
    );
    expect(stats.yearsOfExperience).toBe(3);
  });

  it("devolve null em anos de experiência quando não há experiência cadastrada", () => {
    expect(computeStats({ projects: [], events: [], experience: [] }, now).yearsOfExperience).toBeNull();
  });
});

describe("datas", () => {
  it("interpreta datas parciais como o primeiro dia do período", () => {
    expect(parsePartialDate("2024").toISOString()).toBe("2024-01-01T00:00:00.000Z");
    expect(parsePartialDate("2024-07").toISOString()).toBe("2024-07-01T00:00:00.000Z");
    expect(parsePartialDate("2024-07-09").toISOString()).toBe("2024-07-09T00:00:00.000Z");
  });

  it("só conta o ano depois do aniversário", () => {
    const start = parsePartialDate("2020-11-16");
    expect(fullYearsBetween(start, parsePartialDate("2026-11-15"))).toBe(5);
    expect(fullYearsBetween(start, parsePartialDate("2026-11-16"))).toBe(6);
  });
});

describe("toIndicators", () => {
  it("esconde indicadores zerados ou sem dado", () => {
    const stats = computeStats({ projects: [project("a", "concluido", ["x"])], events: [], experience: [] });
    expect(toIndicators(stats)).toEqual([
      { key: "projects", value: 1 },
      { key: "projectsCompleted", value: 1 },
      { key: "technologies", value: 1 },
    ]);
  });
});
