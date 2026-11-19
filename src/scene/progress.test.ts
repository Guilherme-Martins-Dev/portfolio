import { describe, expect, it } from "vitest";

import { HOME_SECTIONS } from "@/components/layout/sections";
import { chapters } from "./chapters/chapters";
import { chapterValue, clamp01, damp, lerpWorld, poseFor, segmentState, smootherstep } from "./progress";

describe("ledger de capítulos", () => {
  it("tem um capítulo por seção da Home, na mesma ordem", () => {
    expect(chapters.map((chapter) => chapter.id)).toEqual(HOME_SECTIONS.map((section) => section.id));
  });

  it("todo valor do mundo fica entre 0 e 1 (exceto o alongamento)", () => {
    for (const { world, id } of chapters) {
      for (const key of ["open", "hue", "glow"] as const) {
        expect(world[key], `${id}.${key}`).toBeGreaterThanOrEqual(0);
        expect(world[key], `${id}.${key}`).toBeLessThanOrEqual(1);
      }
      expect(world.stretch, `${id}.stretch`).toBeGreaterThan(0);
    }
  });
});

describe("chapterValue", () => {
  const tops = [0, 800, 1600, 2400];

  it("fica em 0 antes da primeira seção e no último capítulo depois dele", () => {
    expect(chapterValue(tops, -50)).toBe(0);
    expect(chapterValue(tops, 0)).toBe(0);
    expect(chapterValue(tops, 2400)).toBe(3);
    expect(chapterValue(tops, 9999)).toBe(3);
  });

  it("interpola entre seções vizinhas", () => {
    expect(chapterValue(tops, 400)).toBeCloseTo(0.5);
    expect(chapterValue(tops, 1600 + 200)).toBeCloseTo(2.25);
  });

  it("é determinístico e monótono", () => {
    let previous = -1;
    for (let y = 0; y <= 2600; y += 50) {
      const value = chapterValue(tops, y);
      expect(value).toBe(chapterValue(tops, y));
      expect(value).toBeGreaterThanOrEqual(previous);
      previous = value;
    }
  });

  it("não quebra sem seções", () => {
    expect(chapterValue([], 500)).toBe(0);
  });
});

describe("segmentState", () => {
  it("escolhe o par de capítulos e o avanço eased", () => {
    expect(segmentState(0, 6)).toEqual({ a: 0, b: 1, t: 0 });
    expect(segmentState(2.5, 6).a).toBe(2);
    expect(segmentState(2.5, 6).t).toBeCloseTo(0.5);
    // No último capítulo o par é (n-2, n-1) com t = 1.
    expect(segmentState(5, 6)).toEqual({ a: 4, b: 5, t: 1 });
    expect(segmentState(99, 6)).toEqual({ a: 4, b: 5, t: 1 });
  });

  it("smootherstep fica entre 0 e 1 e vai de 0 a 1", () => {
    expect(smootherstep(0)).toBe(0);
    expect(smootherstep(1)).toBe(1);
    for (let i = 0; i <= 10; i++) expect(smootherstep(i / 10)).toBe(clamp01(smootherstep(i / 10)));
  });
});

describe("helpers", () => {
  it("poseFor usa a pose mobile só em telas estreitas", () => {
    const hero = chapters[0];
    expect(poseFor(hero, 390)).toBe(hero.mobile);
    expect(poseFor(hero, 1280)).toBe(hero.camera);
  });

  it("lerpWorld interpola todos os campos", () => {
    const mid = lerpWorld(chapters[0].world, chapters[2].world, 0.5);
    expect(mid.stretch).toBeCloseTo((chapters[0].world.stretch + chapters[2].world.stretch) / 2);
  });

  it("damp converge sem ultrapassar o alvo", () => {
    let value = 0;
    for (let i = 0; i < 200; i++) value = damp(value, 1, 5, 1 / 60);
    expect(value).toBeGreaterThan(0.99);
    expect(value).toBeLessThanOrEqual(1);
  });
});
