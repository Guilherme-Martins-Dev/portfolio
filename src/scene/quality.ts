/**
 * Governador de qualidade (briefing: baixar DPR antes de cortar o que foi desenhado à mão).
 * Observa o tempo dos quadros que a cena de fato desenha (só existem enquanto há scroll, por
 * causa do `frameloop="demand"`) e desce um degrau de DPR quando o tempo médio passa do limite.
 * Sobe de volta só depois de várias janelas seguidas folgadas, para não oscilar.
 * Puro e sem Three.js: o componente apenas aplica o DPR devolvido.
 */
export type GovernorOptions = {
  /** Degraus de DPR, do maior para o menor. */
  steps?: readonly number[];
  /** Quadros por janela de medição. */
  windowSize?: number;
  /** Média (ms) acima da qual desce um degrau (≈ abaixo de 45 fps). */
  slowMs?: number;
  /** Média (ms) abaixo da qual a janela conta como folgada (≈ acima de 55 fps). */
  fastMs?: number;
  /** Janelas folgadas seguidas necessárias para subir um degrau. */
  upAfter?: number;
  /** Quadros mais longos que isto (ms) são pausas (aba escondida, retomada), não custo da cena. */
  stallMs?: number;
};

export type QualityGovernor = {
  /** Registra o tempo de um quadro (ms). Devolve o novo DPR quando ele muda; senão `null`. */
  observe(frameMs: number): number | null;
  readonly dpr: number;
};

export const DPR_STEPS = [1.5, 1.25, 1, 0.75] as const;

export function createQualityGovernor(startDpr: number, options: GovernorOptions = {}): QualityGovernor {
  const { steps = DPR_STEPS, windowSize = 30, slowMs = 22, fastMs = 18, upAfter = 4, stallMs = 100 } = options;

  // Começa no maior degrau que não passa do DPR inicial (já limitado pelo teto do dispositivo).
  const first = steps.findIndex((step) => step <= startDpr);
  let index = first === -1 ? steps.length - 1 : first;
  const ceiling = index;

  let sum = 0;
  let count = 0;
  let goodWindows = 0;

  return {
    get dpr() {
      return steps[index];
    },
    observe(frameMs) {
      if (!(frameMs > 0) || frameMs > stallMs) return null;
      sum += frameMs;
      count += 1;
      if (count < windowSize) return null;

      const average = sum / count;
      sum = 0;
      count = 0;

      if (average > slowMs && index < steps.length - 1) {
        index += 1;
        goodWindows = 0;
        return steps[index];
      }
      goodWindows = average < fastMs ? goodWindows + 1 : 0;
      if (goodWindows >= upAfter && index > ceiling) {
        index -= 1;
        goodWindows = 0;
        return steps[index];
      }
      return null;
    },
  };
}
