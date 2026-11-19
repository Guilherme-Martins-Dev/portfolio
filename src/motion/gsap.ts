import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Registro único dos plugins do GSAP. Sempre importe daqui, nunca de "gsap" direto.
gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

/** Só anima quando o visitante não pediu movimento reduzido. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
/** Tela larga o bastante para pin e parallax (no celular, tudo vertical e sem pin). */
export const DESKTOP = "(min-width: 768px)";
export const DESKTOP_MOTION_OK = `${MOTION_OK} and ${DESKTOP}`;
