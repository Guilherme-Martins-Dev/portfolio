"use client";

import { useRef, type ReactNode } from "react";
import { DESKTOP, gsap, useMotionGSAP } from "@/motion/gsap";

/** Deslocamento (px) da coluna que se move: leve, só o bastante para dar profundidade. */
const SHIFT = 28;

/**
 * Lista de cards em grade com parallax leve (storyboard §4): a segunda coluna rola a uma velocidade
 * um pouco diferente da primeira, em scrub. A animação fica no `<li>` (o card dentro dele tem a
 * inclinação 3D no hover). Só em tela larga e sem movimento reduzido; fora disso é a grade normal.
 */
export function ParallaxList({
  children,
  className,
  "aria-labelledby": labelledBy,
}: {
  children: ReactNode;
  className?: string;
  "aria-labelledby"?: string;
}) {
  const list = useRef<HTMLUListElement>(null);

  useMotionGSAP(({ reduce }) => {
    if (reduce) return;
    const el = list.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add(DESKTOP, () => {
      const cells = gsap.utils.toArray<HTMLElement>(el.querySelectorAll(":scope > li")).filter((_, i) => i % 2 === 1);
      for (const cell of cells) {
        gsap.fromTo(
          cell,
          { y: SHIFT },
          {
            y: -SHIFT,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
          },
        );
      }
    });

    return () => mm.revert();
  });

  return (
    <ul ref={list} aria-labelledby={labelledBy} className={className}>
      {children}
    </ul>
  );
}
