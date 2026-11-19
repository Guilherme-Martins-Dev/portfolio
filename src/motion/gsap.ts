import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registro único dos plugins do GSAP (a #19 estende este arquivo). Sempre importe daqui.
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
