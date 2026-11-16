import { useTranslations } from "next-intl";

import { About } from "@/components/home/about";
import { Hero } from "@/components/home/hero";
import { Indicators } from "@/components/home/indicators";
import { HomeSection } from "@/components/layout/home-section";
import { HOME_SECTIONS } from "@/components/layout/sections";

// Home: Hero → Sobre → Indicadores → Projetos → Trajetória/Eventos → Contato (D04).
// Os três últimos ainda são provisórios; o conteúdo entra na #16.
const PENDING_SECTIONS = HOME_SECTIONS.filter((section) => ["projetos", "trajetoria", "contato"].includes(section.id));

export default function Home() {
  const t = useTranslations("Sections");

  return (
    <>
      <HomeSection
        id="inicio"
        aria-labelledby="inicio-titulo"
        className="mx-auto flex min-h-[80svh] w-full max-w-6xl flex-col justify-center px-4 py-16 sm:px-6"
      >
        <Hero />
      </HomeSection>

      <About />
      <Indicators />

      {PENDING_SECTIONS.map((section) => (
        <HomeSection
          key={section.id}
          id={section.id}
          aria-labelledby={`${section.id}-titulo`}
          className="mx-auto flex min-h-[80svh] w-full max-w-6xl flex-col justify-center gap-4 px-4 py-16 sm:px-6"
        >
          <h2 id={`${section.id}-titulo`} className="font-display text-4xl sm:text-5xl">
            {t(section.label)}
          </h2>
        </HomeSection>
      ))}
    </>
  );
}
