import { existsSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { describe, expect, it } from "vitest";

import { defineCollection, projectSchema, studySchema, technologySchema } from "@/lib/schemas";
import { computeStats } from "@/lib/stats";
import { checkReferences, events, experience, projects, studies, technologies } from ".";

describe("conteúdo cadastrado", () => {
  it("é válido e as referências entre coleções existem", () => {
    expect(() => checkReferences({ projects, events, experience, technologies, studies })).not.toThrow();
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
        studies: [],
      }),
    ).toThrowError(/id repetido[\s\S]*tecnologia desconhecida "nao-existe"/);
  });

  it("acusa tecnologia inexistente em um estudo", () => {
    const study = studySchema.parse({ id: "curso-x", kind: "curso", title: { pt: "Curso X", en: "Course X" }, institution: "Escola", technologies: ["nao-existe"] });
    expect(() => checkReferences({ projects, events, experience, technologies, studies: [study] })).toThrowError(
      /studies\/curso-x: tecnologia desconhecida "nao-existe"/,
    );
  });

  it("rejeita campos desconhecidos (evita dado digitado no lugar errado)", () => {
    const [first] = projects;
    expect(() => defineCollection("projects", z.array(projectSchema), [{ ...first, stars: 999 }])).toThrowError(/stars/);
  });
});

describe("tecnologias", () => {
  it("aceita logo, status e destaque opcionais", () => {
    expect(technologySchema.parse({ id: "x", name: "X", area: "frontend" })).toEqual({ id: "x", name: "X", area: "frontend" });
    expect(() => technologySchema.parse({ id: "x", name: "X", area: "frontend", logo: "/logos/x.svg", status: "usada", destaque: true })).not.toThrow();
  });

  it("rejeita logo fora de /logos/ e status desconhecido", () => {
    expect(() => technologySchema.parse({ id: "x", name: "X", area: "frontend", logo: "https://x.com/a.svg" })).toThrow();
    expect(() => technologySchema.parse({ id: "x", name: "X", area: "frontend", status: "expert" })).toThrow();
  });

  it("todo logo cadastrado existe em public/", () => {
    for (const t of technologies) {
      if (t.logo) expect(existsSync(join(process.cwd(), "public", t.logo)), `${t.id}: ${t.logo}`).toBe(true);
    }
  });
});
