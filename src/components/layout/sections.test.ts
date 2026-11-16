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
