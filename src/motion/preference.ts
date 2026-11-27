/**
 * Preferência de movimento: o `prefers-reduced-motion` do sistema OU o botão "Reduzir efeitos" do
 * cabeçalho. A escolha do botão vive num atributo do <html> (o CSS e o Tailwind leem dele) e é salva
 * no localStorage. Este arquivo não importa React nem GSAP: o hook fica em `use-reduced-motion.ts`.
 */

/** Media query do sistema, a mesma usada no `gsap.matchMedia()`. */
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
export const NO_PREFERENCE_QUERY = "(prefers-reduced-motion: no-preference)";

/** Atributo do <html> presente quando a pessoa ligou "Reduzir efeitos". */
export const REDUCE_MOTION_ATTRIBUTE = "data-reduce-motion";

/** Chave do localStorage: "on" quando o botão está ligado; sem valor, vale só o sistema. */
export const REDUCE_MOTION_STORAGE_KEY = "reduce-motion";

/**
 * Script inline do <head>: aplica a escolha salva antes do primeiro paint, para o CSS de movimento
 * reduzido já valer no primeiro desenho (sem animar e depois parar).
 */
export const reduceMotionScript = `(function(){try{if(localStorage.getItem(${JSON.stringify(REDUCE_MOTION_STORAGE_KEY)})==="on")document.documentElement.setAttribute(${JSON.stringify(REDUCE_MOTION_ATTRIBUTE)},"")}catch(e){}})()`;

interface Root {
  hasAttribute(name: string): boolean;
  setAttribute(name: string, value: string): void;
  removeAttribute(name: string): void;
}

interface Media {
  readonly matches: boolean;
  addEventListener(type: "change", listener: () => void): void;
  removeEventListener(type: "change", listener: () => void): void;
}

interface Storage {
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface MotionPreferenceEnv {
  root: Root;
  media: Media;
  /** Pode lançar (modo privado, cookies bloqueados): todo acesso fica em try/catch. */
  storage: () => Storage;
}

export interface MotionPreference {
  /** Movimento reduzido efetivo: sistema OU botão. */
  reduced(): boolean;
  /** Só a escolha do botão (estado `aria-pressed`). */
  userChoice(): boolean;
  setUserChoice(on: boolean): void;
  /** Avisa quando o sistema ou o botão mudam. Devolve a função que cancela. */
  subscribe(listener: () => void): () => void;
}

export function createMotionPreference({ root, media, storage }: MotionPreferenceEnv): MotionPreference {
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((listener) => listener());

  const userChoice = () => root.hasAttribute(REDUCE_MOTION_ATTRIBUTE);

  return {
    reduced: () => media.matches || userChoice(),
    userChoice,
    setUserChoice(on) {
      if (on) root.setAttribute(REDUCE_MOTION_ATTRIBUTE, "");
      else root.removeAttribute(REDUCE_MOTION_ATTRIBUTE);
      try {
        const store = storage();
        if (on) store.setItem(REDUCE_MOTION_STORAGE_KEY, "on");
        else store.removeItem(REDUCE_MOTION_STORAGE_KEY);
      } catch {
        // localStorage indisponível: a escolha vale só até recarregar a página.
      }
      notify();
    },
    subscribe(listener) {
      listeners.add(listener);
      if (listeners.size === 1) media.addEventListener("change", notify);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) media.removeEventListener("change", notify);
      };
    },
  };
}

let browserPreference: MotionPreference | null = null;

/** Instância única do navegador (criada no primeiro uso; nunca no servidor). */
export function motionPreference(): MotionPreference {
  browserPreference ??= createMotionPreference({
    root: document.documentElement,
    media: window.matchMedia(REDUCED_MOTION_QUERY),
    storage: () => window.localStorage,
  });
  return browserPreference;
}
