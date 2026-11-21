"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { motionPreference } from "@/motion/preference";
import { useReducedMotion, useUserReduceMotion } from "@/motion/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Botão "Reduzir efeitos" do cabeçalho (04-3d-e-scroll §4.6). Liga o mesmo modo do
 * `prefers-reduced-motion`: sem pin/scrub, estados finais imediatos e cena 3D parada.
 * `aria-pressed` reflete a escolha da pessoa; o sistema continua valendo por cima dela.
 */
export function ReduceMotionToggle() {
  const t = useTranslations("ReduceMotion");
  const pressed = useUserReduceMotion();
  const reduced = useReducedMotion();

  return (
    <Button
      variant="outline"
      size="icon"
      aria-pressed={pressed}
      aria-label={t("label")}
      title={reduced && !pressed ? t("system") : t("label")}
      data-reduce-motion-toggle
      onClick={() => motionPreference().setUserChoice(!pressed)}
      className={cn(pressed && "bg-accent text-accent-foreground")}
    >
      <Sparkles aria-hidden="true" className={cn(reduced && "opacity-50")} />
    </Button>
  );
}
