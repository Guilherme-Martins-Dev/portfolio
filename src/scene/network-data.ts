/**
 * Dados da rede de nós (núcleo digital, P06): posições dos nós e das conexões, geradas uma
 * única vez e de forma determinística (mesma semente, mesma rede). Sem Three.js aqui:
 * só Float32Array, para poder testar e reaproveitar.
 */
export const NODE_COUNT = 360;
const NEIGHBORS = 2;
const MAX_LINK = 1.25;
const RADIUS = 2.1;

/** PRNG pequeno e estável (mulberry32). */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type NetworkData = {
  count: number;
  /** x,y,z por nó. */
  positions: Float32Array;
  /** Semente 0..1 por nó (varia tamanho, deslocamento e cor). */
  seeds: Float32Array;
  linkCount: number;
  /** x,y,z de cada ponta de cada conexão (2 pontas por conexão). */
  linkPositions: Float32Array;
  /** Semente do nó de cada ponta, para a conexão acompanhar o nó. */
  linkSeeds: Float32Array;
};

export function buildNetwork(count = NODE_COUNT, seed = 20261119): NetworkData {
  const random = mulberry32(seed);
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));

  // Casca esférica (espiral de Fibonacci) com espessura e leve achatamento.
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const ring = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const radius = RADIUS * (0.55 + random() * 0.45);
    positions[i * 3] = Math.cos(theta) * ring * radius;
    positions[i * 3 + 1] = y * radius * 0.85;
    positions[i * 3 + 2] = Math.sin(theta) * ring * radius;
    seeds[i] = random();
  }

  // Cada nó liga aos vizinhos mais próximos dentro do alcance; sem conexões repetidas.
  const links: [number, number][] = [];
  const seen = new Set<number>();
  for (let i = 0; i < count; i++) {
    const near: { j: number; d: number }[] = [];
    for (let j = 0; j < count; j++) {
      if (j === i) continue;
      const dx = positions[i * 3] - positions[j * 3];
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
      const d = Math.hypot(dx, dy, dz);
      if (d <= MAX_LINK) near.push({ j, d });
    }
    near.sort((a, b) => a.d - b.d);
    for (const { j } of near.slice(0, NEIGHBORS)) {
      const key = Math.min(i, j) * count + Math.max(i, j);
      if (seen.has(key)) continue;
      seen.add(key);
      links.push([i, j]);
    }
  }

  const linkPositions = new Float32Array(links.length * 6);
  const linkSeeds = new Float32Array(links.length * 2);
  links.forEach(([a, b], index) => {
    linkPositions.set(positions.subarray(a * 3, a * 3 + 3), index * 6);
    linkPositions.set(positions.subarray(b * 3, b * 3 + 3), index * 6 + 3);
    linkSeeds[index * 2] = seeds[a];
    linkSeeds[index * 2 + 1] = seeds[b];
  });

  return { count, positions, seeds, linkCount: links.length, linkPositions, linkSeeds };
}
