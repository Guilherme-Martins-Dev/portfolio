import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { contrastRatio } from "./contrast";

// Lê os tokens direto do CSS, que é a fonte única (sem duplicar valores em TS).
const css = readFileSync(resolve(__dirname, "../app/globals.css"), "utf8");

function declarations(block: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [, name, value] of block.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) out[name] = value.trim();
  return out;
}

function blockAfter(selectorPattern: RegExp): string {
  const match = css.match(new RegExp(`${selectorPattern.source}\\s*\\{([^}]*)\\}`));
  if (!match) throw new Error(`Bloco não encontrado: ${selectorPattern}`);
  return match[1];
}

const primitives = declarations(blockAfter(/@theme/));
const themes = {
  light: declarations(blockAfter(/\[data-theme="light"\]/)),
  dark: declarations(blockAfter(/\[data-theme="dark"\]/)),
};

function resolveColor(theme: Record<string, string>, token: string): string {
  const raw = theme[token];
  if (!raw) throw new Error(`Token semântico ausente: --${token}`);
  const ref = raw.match(/^var\(--([\w-]+)\)$/);
  const value = ref ? primitives[ref[1]] : raw;
  if (!value) throw new Error(`Primitivo ausente para --${token}: ${raw}`);
  return value;
}

// Pares texto/fundo usados na interface. Todo texto precisa de AA (4,5:1).
const textPairs: Array<[text: string, background: string]> = [
  ["foreground", "background"],
  ["foreground", "card"],
  ["card-foreground", "card"],
  ["popover-foreground", "popover"],
  ["muted-foreground", "background"],
  ["muted-foreground", "card"],
  ["muted-foreground", "muted"],
  ["primary-foreground", "primary"],
  ["secondary-foreground", "secondary"],
  ["accent-foreground", "accent"],
  ["accent-text", "background"],
  ["accent-text", "card"],
  ["link", "background"],
  ["link", "card"],
  ["destructive-foreground", "destructive"],
  ["destructive", "background"],
];

describe.each(Object.entries(themes))("tema %s", (_name, theme) => {
  it.each(textPairs)("--%s sobre --%s tem contraste ≥ 4,5:1", (text, background) => {
    const ratio = contrastRatio(resolveColor(theme, text), resolveColor(theme, background));
    expect(ratio, `${text} sobre ${background}: ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);
  });
});

describe("regras da marca (D11)", () => {
  const textTokens = textPairs.map(([text]) => text);

  it("o roxo #7B2CBF não é usado como texto no tema escuro", () => {
    for (const token of textTokens) {
      expect(resolveColor(themes.dark, token).toLowerCase(), token).not.toBe("#7b2cbf");
    }
  });

  it("o ciano #00E5FF não é usado como texto sobre o fundo claro", () => {
    for (const [text, background] of textPairs) {
      if (resolveColor(themes.light, background).toLowerCase() !== "#ffffff") continue;
      expect(resolveColor(themes.light, text).toLowerCase(), text).not.toBe("#00e5ff");
    }
  });

  it("usa os tons de texto validados: #A66BE0 no escuro e #007A8C no claro", () => {
    expect(resolveColor(themes.dark, "accent-text").toLowerCase()).toBe("#a66be0");
    expect(resolveColor(themes.light, "link").toLowerCase()).toBe("#007a8c");
  });
});

describe("contrastRatio", () => {
  it("reproduz os valores de 05-marca §5.3", () => {
    expect(contrastRatio("#7B2CBF", "#0B132B")).toBeCloseTo(2.59, 1);
    expect(contrastRatio("#00E5FF", "#FFFFFF")).toBeCloseTo(1.54, 1);
    expect(contrastRatio("#A66BE0", "#0B132B")).toBeCloseTo(5.08, 1);
    expect(contrastRatio("#007A8C", "#FFFFFF")).toBeCloseTo(5.05, 1);
  });

  it("rejeita cores inválidas", () => {
    expect(() => contrastRatio("azul", "#fff")).toThrow();
  });
});
