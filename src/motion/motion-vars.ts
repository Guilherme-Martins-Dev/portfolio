/**
 * Regras do movimento reduzido para a coreografia (04-3d-e-scroll §4.6), como funções puras:
 * com `reduce`, nada de pin, scrub nem snap, e toda animação vai direto ao estado final.
 */

/** Chaves do ScrollTrigger que prendem ou amarram a página ao scroll. */
const SCROLL_BOUND_KEYS = ["pin", "pinSpacing", "pinReparent", "anticipatePin", "scrub", "snap"] as const;

/**
 * Variáveis de ScrollTrigger seguras para o modo escolhido. Com `reduce`, tira pin, scrub e snap:
 * a página rola como um documento comum e o gatilho só dispara o estado final.
 */
export function scrollTriggerVars<T extends object>(vars: T, reduce: boolean): T {
  if (!reduce) return vars;
  const safe = { ...vars } as Record<string, unknown>;
  for (const key of SCROLL_BOUND_KEYS) delete safe[key];
  return safe as T;
}

/**
 * Variáveis de tween para o modo escolhido. Com `reduce`, duração e atraso zero, sem repetição
 * nem stagger e sem ScrollTrigger com scrub: o elemento aparece já no estado final.
 */
export function tweenVars<T extends object>(vars: T, reduce: boolean): T {
  if (!reduce) return vars;
  const safe: Record<string, unknown> = { ...vars, duration: 0, delay: 0, repeat: 0, yoyo: false, stagger: 0 };
  if (safe.scrollTrigger && typeof safe.scrollTrigger === "object") {
    safe.scrollTrigger = scrollTriggerVars(safe.scrollTrigger, true);
  }
  return safe as T;
}
