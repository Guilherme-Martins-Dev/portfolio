import { describe, expect, it } from "vitest";

import {
  alternatesFor,
  buildSitemap,
  creativeWorkJsonLd,
  jsonLdScript,
  localizedPath,
  personJsonLd,
  siteUrl,
  SITEMAP_PAGES,
} from "./seo";

const BASE = "https://exemplo.dev";

describe("siteUrl", () => {
  it("usa NEXT_PUBLIC_SITE_URL sem a barra final", () => {
    expect(siteUrl("https://exemplo.dev/")).toBe(BASE);
    expect(siteUrl(" https://exemplo.dev ")).toBe(BASE);
  });

  it("cai em localhost sem a variável", () => {
    expect(siteUrl(undefined)).toBe("http://localhost:3000");
    expect(siteUrl("")).toBe("http://localhost:3000");
  });

  it("falha com uma URL inválida em vez de gerar links quebrados", () => {
    expect(() => siteUrl("exemplo.dev")).toThrow();
  });
});

describe("localizedPath", () => {
  it("prefixa o idioma e traduz o caminho", () => {
    expect(localizedPath("/", "pt")).toBe("/pt");
    expect(localizedPath("/", "en")).toBe("/en");
    expect(localizedPath("/sobre", "pt")).toBe("/pt/sobre");
    expect(localizedPath("/sobre", "en")).toBe("/en/about");
    expect(localizedPath("/projetos/[slug]", "en", { slug: "questum" })).toBe("/en/projects/questum");
  });

  it("exige o slug na rota dinâmica", () => {
    expect(() => localizedPath("/projetos/[slug]", "pt")).toThrow(/slug/);
  });
});

describe("alternatesFor", () => {
  it("dá o canonical do idioma atual e o hreflang de todos, com x-default no idioma padrão", () => {
    expect(alternatesFor("/contato", "en", {}, BASE)).toEqual({
      canonical: `${BASE}/en/contact`,
      languages: {
        "pt-BR": `${BASE}/pt/contato`,
        en: `${BASE}/en/contact`,
        "x-default": `${BASE}/pt/contato`,
      },
    });
  });

  it("é recíproco: os alternates são os mesmos vistos de qualquer idioma", () => {
    for (const href of SITEMAP_PAGES) {
      expect(alternatesFor(href, "pt", {}, BASE).languages).toEqual(alternatesFor(href, "en", {}, BASE).languages);
    }
  });
});

describe("buildSitemap", () => {
  it("lista cada página uma vez por idioma, com alternates e sem data inventada", () => {
    const entries = buildSitemap([], BASE);
    expect(entries).toHaveLength(SITEMAP_PAGES.length * 2);
    expect(entries.map((e) => e.url)).toContain(`${BASE}/en/studies`);
    expect(entries.every((e) => e.lastModified === undefined)).toBe(true);
    expect(entries.every((e) => Object.keys(e.alternates.languages).sort().join() === "en,pt-BR,x-default")).toBe(true);
  });

  it("inclui os estudos de caso com o updatedAt mais recente entre os idiomas", () => {
    const entries = buildSitemap(
      [
        { slug: "questum", updatedAt: "2026-10-01T00:00:00.000Z" },
        { slug: "questum", updatedAt: "2026-11-02T00:00:00.000Z" },
        { slug: "outro" },
      ],
      BASE,
    );
    const questum = entries.filter((e) => e.url.endsWith("/questum"));
    expect(questum.map((e) => e.url)).toEqual([`${BASE}/pt/projetos/questum`, `${BASE}/en/projects/questum`]);
    expect(questum.every((e) => e.lastModified === "2026-11-02")).toBe(true);
    expect(entries.find((e) => e.url.endsWith("/outro"))?.lastModified).toBeUndefined();
  });
});

describe("JSON-LD", () => {
  it("Person só com os campos cadastrados", () => {
    expect(personJsonLd({ name: "Fulano", links: {} }, BASE)).toEqual({
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${BASE}/#person`,
      name: "Fulano",
      url: BASE,
    });
    const full = personJsonLd(
      { name: "Fulano", headline: "Dev", email: "a@b.dev", links: { github: "https://github.com/x" } },
      BASE,
    );
    expect(full).toMatchObject({ jobTitle: "Dev", email: "mailto:a@b.dev", sameAs: ["https://github.com/x"] });
  });

  it("CreativeWork aponta para o Person do site e omite campos vazios", () => {
    const work = creativeWorkJsonLd(
      { name: "Projeto", description: "Resumo", url: `${BASE}/pt/projetos/p`, inLanguage: "pt-BR", keywords: [] },
      "Fulano",
      BASE,
    );
    expect(work).toMatchObject({ "@type": "CreativeWork", author: { "@id": `${BASE}/#person`, name: "Fulano" } });
    expect(work).not.toHaveProperty("keywords");
    expect(work).not.toHaveProperty("dateModified");
    expect(work).not.toHaveProperty("sameAs");
  });

  it("escapa < para não fechar o <script>", () => {
    expect(jsonLdScript({ name: "</script><script>alert(1)</script>" })).not.toContain("<");
  });
});
