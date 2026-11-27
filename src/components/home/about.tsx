import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";

import { HomeSection } from "@/components/layout/home-section";
import { RevealLines } from "@/components/motion/reveal-lines";
import { profile } from "@/content";
import { getFocusAreas } from "@/lib/home-data";

/** Sobre: bio, áreas de foco e, como `children`, a faixa de indicadores. Campo vazio não aparece (D08). */
export function About({ children }: { children?: ReactNode }) {
  const t = useTranslations("Sections");
  const tAreas = useTranslations("Areas");
  const tAbout = useTranslations("About");
  const locale = useLocale() as "pt" | "en";
  const focus = getFocusAreas();

  return (
    <HomeSection
      id="about"
      aria-labelledby="about-titulo"
      className="mx-auto flex min-h-[80svh] w-full max-w-6xl flex-col justify-center gap-6 px-4 py-16 sm:px-6"
    >
      <h2 id="about-titulo" className="font-display text-4xl sm:text-5xl">
        {t("about")}
      </h2>
      {/* TODO(guilherme): bio em src/content/profile.ts. */}
      {profile.bio && <RevealLines className="max-w-2xl text-lg leading-relaxed">{profile.bio[locale]}</RevealLines>}
      {focus.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="font-mono text-sm uppercase tracking-wide text-muted-foreground">
            {tAbout("focusAreas")}
          </h3>
          <ul className="flex flex-wrap gap-2">
            {focus.map((area) => (
              <li key={area} className="rounded-full border border-border px-3 py-1 text-sm">
                {tAreas(area)}
              </li>
            ))}
          </ul>
        </div>
      )}
      {children}
    </HomeSection>
  );
}
