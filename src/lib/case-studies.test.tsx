import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MDXContent, mdxComponents } from "@/components/mdx/mdx-content";
import { projects } from "@/content";
import { caseStudies } from "#site/content";
import { getCaseStudies, getCaseStudy, isVisible } from "./case-studies";

describe("estudos de caso (Velite)", () => {
  it("cada estudo de caso aponta para um projeto cadastrado em projects.ts", () => {
    const slugs = new Set(projects.map((p) => p.slug));
    for (const study of caseStudies) expect(slugs, study.path).toContain(study.slug);
  });

  it("cada estudo de caso existe nos dois idiomas", () => {
    const key = (s: { slug: string; locale: string }) => `${s.slug}.${s.locale}`;
    const keys = new Set(caseStudies.map(key));
    for (const study of caseStudies) {
      const other = study.locale === "pt" ? "en" : "pt";
      expect(keys, `${study.slug} sem versão ${other}`).toContain(key({ slug: study.slug, locale: other }));
    }
  });

  it("o exemplo do Questum é rascunho", () => {
    expect(caseStudies.filter((s) => s.slug === "questum").every((s) => s.draft)).toBe(true);
  });
});

describe("rascunhos", () => {
  const draft = caseStudies.find((s) => s.draft)!;

  it("aparecem em desenvolvimento e somem em produção", () => {
    expect(isVisible(draft, "development")).toBe(true);
    expect(isVisible(draft, "production")).toBe(false);
    expect(isVisible({ draft: false }, "production")).toBe(true);
  });

  it("o acesso por idioma e slug respeita o ambiente atual (test = não produção)", () => {
    expect(getCaseStudy("questum", "pt")?.locale).toBe("pt");
    expect(getCaseStudies("en").every((s) => s.locale === "en")).toBe(true);
    expect(getCaseStudy("nao-existe", "pt")).toBeUndefined();
  });
});

describe("MDXContent", () => {
  it("renderiza as seções e os componentes, sem os comentários TODO", () => {
    const study = getCaseStudy("questum", "pt")!;
    const html = renderToStaticMarkup(<MDXContent code={study.body} />);
    expect(html).toContain("<h2>Objetivo e proposta</h2>");
    expect(html).toContain('role="note"');
    expect(html).not.toContain("TODO");
  });

  it("troca <pre> pelo bloco de código focável e permite sobrescrever componentes", () => {
    const Pre = mdxComponents.pre as unknown as (p: { children: string }) => React.ReactElement;
    const pre = renderToStaticMarkup(<Pre>const x = 1;</Pre>);
    expect(pre).toMatch(/<pre tabindex="0"[^>]*>const x = 1;<\/pre>/);

    const study = getCaseStudy("questum", "pt")!;
    const html = renderToStaticMarkup(<MDXContent code={study.body} components={{ h2: (() => null) as never }} />);
    expect(html).not.toContain("<h2>");
  });
});
