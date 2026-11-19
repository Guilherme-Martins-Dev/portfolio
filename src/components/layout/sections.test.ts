import { describe, expect, it } from "vitest";

import en from "@/messages/en.json";
import pt from "@/messages/pt.json";
import { routing } from "@/i18n/routing";
import { HOME_SECTIONS, MAIN_CONTENT_ID, MENU_SECTIONS, SITE_PAGES } from "./sections";

const messages = { pt, en };

describe("seções e navegação", () => {
  it("ids de âncora são únicos, válidos e não colidem com o <main>", () => {
    const ids = HOME_SECTIONS.map((section) => section.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).not.toContain(MAIN_CONTENT_ID);
    for (const id of ids) expect(id).toMatch(/^[a-z][a-z0-9-]*$/);
  });

  it("toda seção e todo item de menu tem texto nos dois idiomas", () => {
    for (const [locale, m] of Object.entries(messages)) {
      for (const section of HOME_SECTIONS) {
        expect(m.Sections[section.label], `${locale}: Sections.${section.label}`).toBeTruthy();
      }
      for (const item of [...MENU_SECTIONS, ...SITE_PAGES]) {
        expect(m.Navigation[item.label], `${locale}: Navigation.${item.label}`).toBeTruthy();
      }
    }
  });

  it("as páginas do menu existem no roteamento", () => {
    for (const page of SITE_PAGES) expect(Object.keys(routing.pathnames)).toContain(page.pathname);
  });
});

describe("seções do briefing (fase 0)", () => {
  it("a Home tem exatamente os seis ids do briefing, nesta ordem", () => {
    expect(HOME_SECTIONS.map((section) => section.id)).toEqual(["hero", "about", "experience", "projects", "events", "contact"]);
  });
});

describe("textos da Home (#15)", () => {
  it("Hero, Sobre, áreas de foco e indicadores têm texto nos dois idiomas", () => {
    const technologyAreas = ["frontend", "backend", "ia", "3d", "hardware", "integracao", "ferramentas"] as const;
    const statKeys = ["projects", "projectsCompleted", "projectsInProgress", "events", "eventsOrganized", "technologies", "yearsOfExperience"];
    for (const [locale, m] of Object.entries(messages)) {
      expect(m.Hero.viewProjects, `${locale}: Hero.viewProjects`).toBeTruthy();
      expect(m.Hero.contact, `${locale}: Hero.contact`).toBeTruthy();
      expect(m.About.focusAreas, `${locale}: About.focusAreas`).toBeTruthy();
      for (const area of technologyAreas) expect(m.Areas[area], `${locale}: Areas.${area}`).toBeTruthy();
      for (const key of statKeys) expect(m.Stats[key as keyof typeof m.Stats], `${locale}: Stats.${key}`).toBeTruthy();
    }
  });
});
