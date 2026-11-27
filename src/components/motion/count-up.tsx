"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useMotionGSAP } from "@/motion/gsap";

const SCRAMBLE_SECONDS = 0.3;
const COUNT_SECONDS = 1.2;

/**
 * Indicador numérico (storyboard §3). O valor real está no HTML do servidor, em `sr-only`, e é o
 * único que o leitor de tela lê. O número visível é uma cópia `aria-hidden`: já nasce no valor final
 * (estado de repouso: sem JS ou com movimento reduzido nada muda) e, quando a animação é permitida,
 * embaralha os dígitos por ~0,3 s e conta de 0 até o valor em ~1,2 s ao entrar na tela, uma vez.
 */
export function CountUp({ value, index = 0, className }: { value: number; index?: number; className?: string }) {
  const visible = useRef<HTMLSpanElement>(null);

  useMotionGSAP(
    ({ reduce }) => {
      const el = visible.current;
      if (!el || reduce) return;
      const digits = String(value).length;
      const state = { v: 0 };
      const tween = gsap.to(state, {
        v: value,
        duration: COUNT_SECONDS,
        delay: index * 0.1,
        ease: "power2.out",
        paused: true,
        onUpdate() {
          el.textContent =
            tween.time() < SCRAMBLE_SECONDS
              ? Array.from({ length: digits }, () => Math.floor(Math.random() * 10)).join("")
              : String(Math.round(state.v));
        },
        onComplete() {
          el.textContent = String(value);
        },
      });
      el.textContent = "0";
      const trigger = ScrollTrigger.create({ trigger: el, start: "top 80%", once: true, onEnter: () => tween.play() });

      return () => {
        trigger.kill();
        tween.kill();
        el.textContent = String(value);
      };
    },
    { dependencies: [value, index] },
  );

  return (
    <>
      <span className="sr-only">{value}</span>
      <span ref={visible} aria-hidden="true" className={className}>
        {value}
      </span>
    </>
  );
}
