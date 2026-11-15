import { z } from "zod";
import { describe, expect, it } from "vitest";

import { defineCollection, projectSchema } from "@/lib/schemas";
import { computeStats } from "@/lib/stats";
import { checkReferences, events, experience, projects, technologies } from ".";

describe("conteúdo cadastrado", () => {
  it("é válido e as referências entre coleções existem", () => {
    expect(() => checkReferences({ projects, events, experience, technologies })).not.toThrow();
  });

  it("tem de 3 a 4 projetos em destaque (02-conteudo §2.3)", () => {
    const featured = projects.filter((p) => p.featured).length;
    expect(featured).toBeGreaterThanOrEqual(3);
    expect(featured).toBeLessThanOrEqual(4);
  });

  it("os indicadores saem dos dados, não de números digitados", () => {
    const stats = computeStats({ projects, events, experience });
    expect(stats.totalProjects).toBe(projects.length);
    expect(stats.projectsByStatus.concluido).toBe(projects.filter((p) => p.status === "concluido").length);
  });
});

describe("validação", () => {
  it("falha com mensagem clara quando um item é inválido", () => {
    const invalid = [{ slug: "Projeto X", title: "", summary: { pt: "a" }, status: "pronto", featured: true }];
    expect(() => defineCollection("projects", z.array(projectSchema), invalid)).toThrowError(
      /Conteúdo inválido em src\/content\/projects\.ts:[\s\S]*slug[\s\S]*status/,
    );
  });

  it("acusa tecnologia inexistente e id repetido", () => {
    const [first] = projects;
    expect(() =>
      checkReferences({
        projects: [{ ...first, technologies: ["nao-existe"] }, first],
        events: [],
        experience: [],
        technologies,
      }),
    ).toThrowError(/id repetido[\s\S]*tecnologia desconhecida "nao-existe"/);
  });

  it("rejeita campos desconhecidos (evita dado digitado no lugar errado)", () => {
    const [first] = projects;
    expect(() => defineCollection("projects", z.array(projectSchema), [{ ...first, stars: 999 }])).toThrowError(/stars/);
  });
});
