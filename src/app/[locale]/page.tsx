import { useTranslations } from "next-intl";

import { HomeSection } from "@/components/layout/home-section";
import { HOME_SECTIONS } from "@/components/layout/sections";

// Home provisória: só a estrutura de seções com âncora (#14). O conteúdo de cada capítulo
// entra nas issues #15 (Hero, Sobre, Indicadores) e #16 (Projetos, Trajetória, Contato).
export default function Home() {
  const t = useTranslations("Sections");

  return (
    <>
      {HOME_SECTIONS.map((section) => (
        <HomeSection
          key={section.id}
          id={section.id}
          aria-labelledby={`${section.id}-titulo`}
          className="mx-auto flex min-h-[80svh] w-full max-w-6xl flex-col justify-center gap-4 px-4 py-16 sm:px-6"
        >
          {section.id === "inicio" ? (
            <h1 id={`${section.id}-titulo`} className="font-display text-5xl sm:text-7xl">
              Guilherme Martins Bezerra
            </h1>
          ) : (
            <h2 id={`${section.id}-titulo`} className="font-display text-4xl sm:text-5xl">
              {t(section.label)}
            </h2>
          )}
        </HomeSection>
      ))}
    </>
  );
}
