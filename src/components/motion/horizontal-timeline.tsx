"use client";

import { useRef, type ReactNode } from "react";
import { DESKTOP, gsap, useMotionGSAP } from "@/motion/gsap";

/** Poucos marcos cabem na tela sem rolar para o lado: abaixo disso a lista fica vertical. */
const MIN_ITEMS = 3;

/**
 * Linha do tempo que corre na horizontal enquanto o visitante rola na vertical (storyboard §6).
 * O filho é uma `<ol>` vertical, completa e legível: esse é o estado de repouso (sem JS, celular e
 * movimento reduzido). Só em tela larga, sem movimento reduzido e com marcos suficientes, o JS
 * vira a lista em trilho horizontal (classe `timeline-h`), fixa o bloco `[data-pin]` e move o trilho
 * em scrub.
 * O scroll continua sendo o nativo.
 */
export function HorizontalTimeline({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useMotionGSAP(({ reduce }) => {
    if (reduce) return;
    const el = root.current;
    const track = el?.firstElementChild as HTMLElement | null;
    // Fixa o bloco interno (data-pin), nunca a <section>: ela é o alvo da âncora (#experience) e o
    // Next rola até ela; um alvo já em position: fixed faz a navegação por âncora cair no lugar errado.
    const pinned = el?.closest<HTMLElement>("[data-pin]");
    if (!el || !track || !pinned) return;
    const mm = gsap.matchMedia();

    mm.add(DESKTOP, () => {
      if (track.children.length < MIN_ITEMS) return;
      el.classList.add("timeline-h");

      const distance = () => Math.max(0, track.scrollWidth - el.clientWidth);
      if (distance() <= 0) {
        el.classList.remove("timeline-h");
        return;
      }
      const headerHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 64;

      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pinned,
          start: `top top+=${headerHeight}`,
          end: () => `+=${distance()}`,
          pin: pinned,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => el.classList.remove("timeline-h");
    });

    return () => mm.revert();
  });

  return <div ref={root}>{children}</div>;
}
