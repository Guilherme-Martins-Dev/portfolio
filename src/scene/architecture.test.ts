import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

import { describe, expect, it } from "vitest";

const SRC = join(process.cwd(), "src");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx)$/.test(name) && !name.endsWith(".test.ts") && !name.endsWith(".test.tsx") ? [path] : [];
  });
}

const files = sourceFiles(SRC).map((path) => ({
  path: relative(SRC, path).split(sep).join("/"),
  text: readFileSync(path, "utf8"),
}));

describe("arquitetura da cena (briefing)", () => {
  it("há no máximo um <Canvas>, e ele vive em src/scene/Canvas.tsx", () => {
    const withCanvas = files.filter((file) => /<Canvas[\s>]/.test(file.text)).map((file) => file.path);
    expect(withCanvas.length).toBeLessThanOrEqual(1);
    for (const path of withCanvas) expect(path).toBe("scene/Canvas.tsx");
  });

  it("nada fora de src/scene/ importa Three.js ou React Three Fiber", () => {
    const offenders = files
      .filter((file) => !file.path.startsWith("scene/"))
      .filter((file) => /from\s+["'](three|three\/[^"']*|@react-three\/[^"']*)["']/.test(file.text))
      .map((file) => file.path);
    expect(offenders).toEqual([]);
  });

  it("src/content/ não importa React nem código de apresentação", () => {
    const offenders = files
      .filter((file) => file.path.startsWith("content/"))
      .filter((file) => /from\s+["'](react|react\/[^"']*|next\/[^"']*|next-intl[^"']*|@\/(components|features|app|scene)\/[^"']*)["']/.test(file.text))
      .map((file) => file.path);
    expect(offenders).toEqual([]);
  });
});

describe("arquitetura do movimento (#19)", () => {
  it("gsap, ScrollTrigger e @gsap/react só são importados em src/motion/gsap.ts", () => {
    const offenders = files
      .filter((file) => file.path !== "motion/gsap.ts")
      .filter((file) => /from\s+["'](gsap|gsap\/[^"']*|@gsap\/[^"']*)["']/.test(file.text))
      .map((file) => file.path);
    expect(offenders).toEqual([]);
  });

  it("não há Lenis nem outro scroll suave que sequestre o scroll nativo (D19 revogada)", () => {
    const offenders = files
      .filter((file) => /from\s+["'](lenis|lenis\/[^"']*|@studio-freight\/[^"']*|locomotive-scroll)["']|ScrollSmoother/.test(file.text))
      .map((file) => file.path);
    expect(offenders).toEqual([]);
  });
});
