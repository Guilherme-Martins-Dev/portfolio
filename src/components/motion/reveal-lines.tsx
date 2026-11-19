"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";

import { gsap, MOTION_OK, SplitText } from "@/motion/gsap";

/**
 * Parágrafo que se revela em linhas (storyboard §2). O texto está inteiro no HTML do servidor e
 * visível: sem JS ou com movimento reduzido nada é dividido nem escondido. Quando a animação é
 * permitida, o SplitText divide em linhas (com máscara) e cada linha sobe ao entrar na tela, uma
 * vez. `aria: "auto"` mantém o texto original acessível aos leitores de tela.
 */
export function RevealLines({ children, className }: { children: string; className?: string }) {
  const root = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          aria: "auto",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.12,
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            }),
        });
        return () => split.revert();
      });

      return () => mm.revert();
    },
    { dependencies: [children] },
  );

  return (
    <p ref={root} className={className}>
      {children}
    </p>
  );
}
