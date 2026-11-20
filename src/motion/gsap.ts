import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { NO_PREFERENCE_QUERY, REDUCED_MOTION_QUERY } from "./preference";
import { useUserReduceMotion } from "./use-reduced-motion";

// Registro único dos plugins do GSAP. Sempre importe gsap, ScrollTrigger e useGSAP daqui.
// O ScrollTrigger lê o scroll NATIVO: sem Lenis nem scroll suave que o sequestre (D19 revogada).
gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };
export { scrollTriggerVars, tweenVars } from "./motion-vars";

type Scope = RefObject<Element | null> | Element | string;

export interface MotionContext {
  /** Movimento reduzido (sistema OU botão "Reduzir efeitos"): sem pin/scrub, estados finais imediatos. */
  reduce: boolean;
}

/**
 * `useGSAP` + `gsap.matchMedia()` com a preferência de movimento (04-3d-e-scroll §4.6).
 * O `matchMedia` cuida do sistema (refaz a coreografia quando a preferência muda) e a dependência
 * do botão refaz tudo quando a pessoa liga ou desliga "Reduzir efeitos". Use `tweenVars` e
 * `scrollTriggerVars` com o `reduce` recebido. A limpeza (revert) é automática.
 */
export function useMotionGSAP(
  setup: (motion: MotionContext) => void | (() => void),
  { scope, dependencies = [] }: { scope?: Scope; dependencies?: unknown[] } = {},
) {
  const userReduce = useUserReduceMotion();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ reduce: REDUCED_MOTION_QUERY, ok: NO_PREFERENCE_QUERY }, (context) => {
        const systemReduce = Boolean(context.conditions?.reduce);
        return setup({ reduce: systemReduce || userReduce });
      });
      return () => mm.revert();
    },
    { scope, dependencies: [userReduce, ...dependencies], revertOnUpdate: true },
  );
}
