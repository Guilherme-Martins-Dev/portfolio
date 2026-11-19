"use client";

import { useEffect } from "react";

import { ScrollTrigger } from "@/motion/gsap";
import { chapters } from "./chapters/chapters";
import { chapterValue } from "./progress";
import { sceneScroll } from "./scroll-store";

/** Ponto da janela (fração da altura) que conta como "posição atual" da leitura. */
const ANCHOR = 0.4;

/**
 * Topos absolutos das seções da Home. O Next mantém a página anterior escondida no DOM, com os
 * mesmos ids: só vale a visível. Fora da Home (alguma seção ausente) devolve `null`.
 */
function measureSections(): number[] | null {
  const tops: number[] = [];
  for (const { id } of chapters) {
    const section = [...document.querySelectorAll<HTMLElement>(`section#${id}`)].find(
      (node) => node.getClientRects().length > 0,
    );
    if (!section) return null;
    tops.push(section.getBoundingClientRect().top + window.scrollY);
  }
  return tops;
}

/**
 * Liga o scroll NATIVO ao valor de capítulo da cena, com um único ScrollTrigger sobre a página
 * (ele cuida de recalcular em resize e mudança de layout). Com movimento reduzido o valor é
 * arredondado: a cena salta para o capítulo composto mais próximo, sem deslizar.
 * `route` vem de fora do Canvas (o R3F tem raiz React própria, sem os contextos do Next):
 * quando muda, as seções são medidas de novo.
 */
export function useScrollProgress(reducedMotion: boolean, route: string) {
  useEffect(() => {
    let tops = measureSections();

    const update = () => {
      if (!tops) {
        sceneScroll.set(0);
        return;
      }
      const value = chapterValue(tops, window.scrollY + window.innerHeight * ANCHOR);
      sceneScroll.set(reducedMotion ? Math.round(value) : value);
    };

    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 0,
      end: "max",
      onUpdate: update,
      onRefresh: () => {
        tops = measureSections();
        update();
      },
    });

    // As fontes mudam a altura das seções depois do primeiro desenho.
    void document.fonts?.ready.then(() => ScrollTrigger.refresh());
    update();

    return () => trigger.kill();
  }, [route, reducedMotion]);
}
