import { describe, expect, it } from "vitest";

import { projects } from "@/content";
import { unknownProjectLocale } from "./project-routes";

describe("proxy: 404 de verdade para /projetos/<slug> desconhecido", () => {
  const known = projects[0].slug;

  it("devolve o idioma quando o slug não existe em projects.ts", () => {
    expect(unknownProjectLocale("/pt/projetos/nao-existe")).toBe("pt");
    expect(unknownProjectLocale("/en/projects/nao-existe/")).toBe("en");
    expect(unknownProjectLocale("/pt/projetos/%E0")).toBe("pt");
  });

  it("deixa passar slugs cadastrados, a listagem e outras rotas", () => {
    expect(unknownProjectLocale(`/pt/projetos/${known}`)).toBeUndefined();
    expect(unknownProjectLocale(`/en/projects/${known}`)).toBeUndefined();
    expect(unknownProjectLocale("/pt/projetos")).toBeUndefined();
    expect(unknownProjectLocale("/en/projects")).toBeUndefined();
    expect(unknownProjectLocale("/pt/sobre")).toBeUndefined();
    // URL na língua errada: o next-intl redireciona para a forma certa antes.
    expect(unknownProjectLocale("/en/projetos/nao-existe")).toBeUndefined();
  });
});
