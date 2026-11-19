import type { CameraPose, SceneChapter, Vec3, WorldState } from "./chapters/chapters";
import { MOBILE_BREAKPOINT } from "./chapters/chapters";

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Suavização com permanência nas pontas: o capítulo "descansa" perto de cada inteiro. */
export const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

/**
 * Valor fracionário do capítulo em curso (ex.: 2,35 = 35% do caminho entre o 3º e o 4º).
 * `tops` são os topos absolutos das seções, em ordem; `anchorY` é o ponto da página que
 * "vale" como posição atual (rolagem + uma fração da altura da janela). Determinístico:
 * a mesma rolagem sempre dá o mesmo valor, para frente, para trás ou após recarregar.
 */
export function chapterValue(tops: readonly number[], anchorY: number): number {
  const last = tops.length - 1;
  if (last < 0 || anchorY <= tops[0]) return 0;
  for (let i = 0; i < last; i++) {
    if (anchorY < tops[i + 1]) {
      const span = tops[i + 1] - tops[i];
      return span > 0 ? i + (anchorY - tops[i]) / span : i;
    }
  }
  return last;
}

export type Segment = { a: number; b: number; t: number };

/** Par de capítulos vizinhos e o avanço eased entre eles. */
export function segmentState(value: number, count: number): Segment {
  const a = Math.min(Math.max(Math.floor(value), 0), Math.max(count - 2, 0));
  const b = Math.min(a + 1, count - 1);
  return { a, b, t: smootherstep(clamp01(value - a)) };
}

export function poseFor(chapter: SceneChapter, width: number): CameraPose {
  return width < MOBILE_BREAKPOINT && chapter.mobile ? chapter.mobile : chapter.camera;
}

export const lerpVec3 = (a: Vec3, b: Vec3, t: number): [number, number, number] => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];

export function lerpWorld(a: WorldState, b: WorldState, t: number): WorldState {
  return {
    open: lerp(a.open, b.open, t),
    stretch: lerp(a.stretch, b.stretch, t),
    hue: lerp(a.hue, b.hue, t),
    glow: lerp(a.glow, b.glow, t),
  };
}

/** Aproxima `current` de `target` de forma independente da taxa de quadros. */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  lerp(current, target, 1 - Math.exp(-lambda * dt));
