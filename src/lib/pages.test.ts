import { describe, expect, it } from "vitest";

import { groupTechnologies, sortByDateDesc, sortExperience, sortStudies, splitEvents } from "./pages";
import type { EventRole, Experience, PortfolioEvent, Study, Technology } from "./schemas";

const job = (id: string, start: string, end?: string): Experience => ({
  id,
  organization: id,
  role: { pt: "Dev", en: "Dev" },
  start,
  end,
  technologies: [],
});

const event = (id: string, role: EventRole, date?: string): PortfolioEvent => ({ id, name: id, role, date, links: {} });

const study = (id: string, start?: string, end?: string): Study => ({
  id,
  kind: "curso",
  title: { pt: id, en: id },
  institution: "Escola",
  start,
  end,
  technologies: [],
  links: {},
});

const ids = (items: Array<{ id: string }>) => items.map((i) => i.id);

describe("sortByDateDesc", () => {
  it("ordena do mais recente ao mais antigo, compara precisões diferentes e deixa sem data no fim", () => {
    const items = [{ id: "a", d: "2024" }, { id: "b" }, { id: "c", d: "2025-03" }, { id: "d", d: "2024-06-10" }];
    expect(ids(sortByDateDesc(items, (i) => i.d))).toEqual(["c", "d", "a", "b"]);
  });

  it("mantém a ordem do cadastro no empate e não altera a lista original", () => {
    const items = [{ id: "a" }, { id: "b" }, { id: "c", d: "2020" }];
    const sorted = sortByDateDesc(items, (i) => i.d);
    expect(ids(sorted)).toEqual(["c", "a", "b"]);
    expect(ids(items)).toEqual(["a", "b", "c"]);
  });
});

describe("sortExperience", () => {
  it("põe as experiências em andamento primeiro e depois as encerradas pela data de início", () => {
    const list = [job("antiga", "2019", "2020"), job("atual", "2022"), job("recente", "2023-01", "2024-02")];
    expect(ids(sortExperience(list))).toEqual(["atual", "recente", "antiga"]);
  });
});

describe("splitEvents", () => {
  it("separa participação de organização e colaboração, com os sem data no fim", () => {
    const result = splitEvents([
      event("hackathon", "participante", "2024-05"),
      event("feira", "palestrante"),
      event("meetup", "organizador", "2025-02"),
      event("workshop", "participante", "2025-08"),
      event("mentoria", "mentor", "2023"),
      event("suporte", "apoio-tecnico", "2025-09"),
    ]);
    expect(ids(result.participation)).toEqual(["workshop", "hackathon"]);
    expect(ids(result.organization)).toEqual(["suporte", "meetup", "mentoria", "feira"]);
  });

  it("devolve as duas listas vazias quando não há eventos", () => {
    expect(splitEvents([])).toEqual({ participation: [], organization: [] });
  });
});

describe("sortStudies", () => {
  it("põe os estudos em andamento primeiro e ordena o resto pela conclusão", () => {
    const list = [
      study("sem-data"),
      study("graduacao", "2021", "2024-12"),
      study("certificado", undefined, "2025-03"),
      study("cursando", "2025-08"),
    ];
    expect(ids(sortStudies(list))).toEqual(["cursando", "certificado", "graduacao", "sem-data"]);
  });
});

describe("groupTechnologies", () => {
  it("agrupa na ordem das áreas e omite área vazia", () => {
    const techs: Technology[] = [
      { id: "arduino", name: "Arduino", area: "hardware" },
      { id: "r3f", name: "React Three Fiber", area: "3d" },
      { id: "cadquery", name: "CadQuery", area: "3d" },
    ];
    expect(groupTechnologies(techs)).toEqual([
      { area: "3d", technologies: [techs[1], techs[2]] },
      { area: "hardware", technologies: [techs[0]] },
    ]);
  });
});
