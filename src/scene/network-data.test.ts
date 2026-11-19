import { describe, expect, it } from "vitest";

import { buildNetwork, mulberry32, NODE_COUNT } from "./network-data";

describe("rede de nós", () => {
  it("é determinística: a mesma semente gera a mesma rede", () => {
    const a = buildNetwork();
    const b = buildNetwork();
    expect(Array.from(a.positions.slice(0, 30))).toEqual(Array.from(b.positions.slice(0, 30)));
    expect(a.linkCount).toBe(b.linkCount);
  });

  it("tem o número de nós esperado e conexões em quantidade razoável", () => {
    const network = buildNetwork();
    expect(network.count).toBe(NODE_COUNT);
    expect(network.positions).toHaveLength(NODE_COUNT * 3);
    expect(network.seeds).toHaveLength(NODE_COUNT);
    expect(network.linkCount).toBeGreaterThan(NODE_COUNT / 2);
    expect(network.linkCount).toBeLessThan(NODE_COUNT * 3);
    expect(network.linkPositions).toHaveLength(network.linkCount * 6);
    expect(network.linkSeeds).toHaveLength(network.linkCount * 2);
  });

  it("não tem valores inválidos e as sementes ficam entre 0 e 1", () => {
    const network = buildNetwork();
    for (const value of [...network.positions, ...network.linkPositions]) expect(Number.isFinite(value)).toBe(true);
    for (const seed of network.seeds) {
      expect(seed).toBeGreaterThanOrEqual(0);
      expect(seed).toBeLessThan(1);
    }
  });

  it("o PRNG fica entre 0 e 1", () => {
    const random = mulberry32(1);
    for (let i = 0; i < 100; i++) {
      const v = random();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});
