import { describe, expect, it, vi } from "vitest";

import {
  createMotionPreference,
  REDUCE_MOTION_ATTRIBUTE,
  REDUCE_MOTION_STORAGE_KEY,
  reduceMotionScript,
  type MotionPreferenceEnv,
} from "./preference";

function fakeEnv({ system = false, storageThrows = false } = {}) {
  const attributes = new Set<string>();
  const stored = new Map<string, string>();
  const mediaListeners = new Set<() => void>();
  const media = {
    matches: system,
    addEventListener: (_: "change", listener: () => void) => void mediaListeners.add(listener),
    removeEventListener: (_: "change", listener: () => void) => void mediaListeners.delete(listener),
  };
  const env: MotionPreferenceEnv = {
    root: {
      hasAttribute: (name) => attributes.has(name),
      setAttribute: (name) => void attributes.add(name),
      removeAttribute: (name) => void attributes.delete(name),
    },
    media,
    storage: () => {
      if (storageThrows) throw new Error("SecurityError");
      return { setItem: (k, v) => void stored.set(k, v), removeItem: (k) => void stored.delete(k) };
    },
  };
  const changeSystem = (matches: boolean) => {
    media.matches = matches;
    mediaListeners.forEach((listener) => listener());
  };
  return { env, attributes, stored, mediaListeners, changeSystem };
}

describe("preferência de movimento", () => {
  it("sem sistema e sem botão, o movimento é normal", () => {
    const { env } = fakeEnv();
    const pref = createMotionPreference(env);
    expect(pref.reduced()).toBe(false);
    expect(pref.userChoice()).toBe(false);
  });

  it("o sistema sozinho reduz, sem marcar o botão", () => {
    const pref = createMotionPreference(fakeEnv({ system: true }).env);
    expect(pref.reduced()).toBe(true);
    expect(pref.userChoice()).toBe(false);
  });

  it("o botão liga o atributo do <html>, salva no localStorage e avisa quem escuta", () => {
    const { env, attributes, stored } = fakeEnv();
    const pref = createMotionPreference(env);
    const listener = vi.fn();
    pref.subscribe(listener);

    pref.setUserChoice(true);
    expect(pref.reduced()).toBe(true);
    expect(attributes.has(REDUCE_MOTION_ATTRIBUTE)).toBe(true);
    expect(stored.get(REDUCE_MOTION_STORAGE_KEY)).toBe("on");
    expect(listener).toHaveBeenCalledTimes(1);

    pref.setUserChoice(false);
    expect(pref.reduced()).toBe(false);
    expect(attributes.has(REDUCE_MOTION_ATTRIBUTE)).toBe(false);
    expect(stored.has(REDUCE_MOTION_STORAGE_KEY)).toBe(false);
  });

  it("sem localStorage (modo privado) o botão ainda funciona na página", () => {
    const { env } = fakeEnv({ storageThrows: true });
    const pref = createMotionPreference(env);
    expect(() => pref.setUserChoice(true)).not.toThrow();
    expect(pref.reduced()).toBe(true);
  });

  it("acompanha a mudança do sistema e solta o listener do matchMedia no fim", () => {
    const { env, changeSystem, mediaListeners } = fakeEnv();
    const pref = createMotionPreference(env);
    const listener = vi.fn();
    const unsubscribe = pref.subscribe(listener);
    changeSystem(true);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(pref.reduced()).toBe(true);
    unsubscribe();
    expect(mediaListeners.size).toBe(0);
  });

  it("o script do <head> lê a mesma chave e aplica o mesmo atributo", () => {
    expect(reduceMotionScript).toContain(JSON.stringify(REDUCE_MOTION_STORAGE_KEY));
    expect(reduceMotionScript).toContain(JSON.stringify(REDUCE_MOTION_ATTRIBUTE));
    expect(reduceMotionScript).toContain("try{");
  });
});
