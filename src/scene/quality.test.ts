import { describe, expect, it } from "vitest";

import { createQualityGovernor, DPR_STEPS } from "./quality";

/** Alimenta `n` quadros de `ms` e devolve a última mudança de DPR (ou null). */
function feed(governor: ReturnType<typeof createQualityGovernor>, ms: number, n: number) {
  let last: number | null = null;
  for (let i = 0; i < n; i++) last = governor.observe(ms) ?? last;
  return last;
}

describe("governador de qualidade", () => {
  it("começa no maior degrau que cabe no DPR inicial", () => {
    expect(createQualityGovernor(2).dpr).toBe(1.5);
    expect(createQualityGovernor(1.25).dpr).toBe(1.25);
    expect(createQualityGovernor(1).dpr).toBe(1);
    expect(createQualityGovernor(0.5).dpr).toBe(0.75);
  });

  it("não muda enquanto os quadros estão rápidos", () => {
    const governor = createQualityGovernor(1.5);
    expect(feed(governor, 8, 300)).toBeNull();
    expect(governor.dpr).toBe(1.5);
  });

  it("desce um degrau por janela lenta, até o piso", () => {
    const governor = createQualityGovernor(1.5);
    expect(feed(governor, 40, 30)).toBe(1.25);
    expect(feed(governor, 40, 30)).toBe(1);
    expect(feed(governor, 40, 30)).toBe(0.75);
    expect(feed(governor, 40, 300)).toBeNull();
    expect(governor.dpr).toBe(0.75);
  });

  it("ignora pausas (aba escondida, retomada depois de parar), que não são custo da cena", () => {
    const governor = createQualityGovernor(1.5);
    expect(feed(governor, 500, 200)).toBeNull();
    expect(feed(governor, 0, 200)).toBeNull();
    expect(feed(governor, Number.NaN, 200)).toBeNull();
    expect(governor.dpr).toBe(1.5);
  });

  it("sobe de volta só depois de várias janelas folgadas seguidas", () => {
    const governor = createQualityGovernor(1.5);
    feed(governor, 40, 30); // 1.25
    expect(feed(governor, 8, 30 * 3)).toBeNull(); // 3 janelas boas: ainda não
    expect(feed(governor, 8, 30)).toBe(1.5); // 4ª janela boa: sobe
  });

  it("uma janela ruim no meio zera a contagem para subir", () => {
    const governor = createQualityGovernor(1.5);
    feed(governor, 40, 30); // 1.25
    feed(governor, 8, 30 * 3);
    feed(governor, 20, 30); // nem lenta nem folgada
    expect(feed(governor, 8, 30 * 3)).toBeNull();
    expect(governor.dpr).toBe(1.25);
  });

  it("nunca sobe acima do degrau inicial", () => {
    const governor = createQualityGovernor(1.25);
    expect(feed(governor, 8, 30 * 20)).toBeNull();
    expect(governor.dpr).toBe(1.25);
  });

  it("os degraus vão do maior para o menor", () => {
    for (let i = 1; i < DPR_STEPS.length; i++) expect(DPR_STEPS[i]).toBeLessThan(DPR_STEPS[i - 1]);
  });
});
