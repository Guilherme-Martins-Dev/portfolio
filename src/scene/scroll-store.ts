/**
 * Valor do capítulo em curso, único e compartilhado. O scroll nativo escreve aqui; a cena lê
 * e pede um frame quando ele muda (`frameloop="demand"`): parada, a cena não gasta GPU.
 */
let value = 0;
const listeners = new Set<() => void>();

export const sceneScroll = {
  get: () => value,
  set(next: number) {
    if (next === value) return;
    value = next;
    listeners.forEach((listener) => listener());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
