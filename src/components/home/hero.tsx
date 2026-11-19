import { useLocale, useTranslations } from "next-intl";

import { profile } from "@/content";

/**
 * Hero da Home: nome (h1 renderizado no servidor, é o LCP), posicionamento e CTAs.
 * Os dois espaços reservados têm tamanho fixo para não deslocar o layout (CLS) quando
 * a foto (#4) e a cena 3D (#20) entrarem.
 */
export function Hero() {
  const t = useTranslations("Hero");
  const locale = useLocale() as "pt" | "en";

  return (
    <div className="grid items-center gap-10 md:grid-cols-[1fr_auto]">
      <div className="flex flex-col gap-6">
        <h1 id="hero-titulo" className="font-display text-5xl sm:text-7xl">
          {profile.name}
        </h1>
        {/* TODO(guilherme): headline em src/content/profile.ts; enquanto estiver vazio, não aparece. */}
        {profile.headline && <p className="max-w-xl text-lg text-muted-foreground">{profile.headline[locale]}</p>}
        <div className="flex flex-wrap gap-3">
          <a
            href="#projects"
            className="rounded-md bg-primary px-5 py-2.5 text-primary-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
          >
            {t("viewProjects")}
          </a>
          <a
            href="#contact"
            className="rounded-md border border-border px-5 py-2.5 outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
          >
            {t("contact")}
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        {/* TODO(guilherme): trocar pela foto profissional quando a #4 entregar (D13). */}
        <div aria-hidden className="h-72 w-56 rounded-lg border border-dashed border-border" />
        {/* Espaço da cena 3D (#20), com fallback 2D; tamanho fixo para evitar CLS. */}
        <div aria-hidden className="hidden h-72 w-72 rounded-full border border-dashed border-border md:block" />
      </div>
    </div>
  );
}
