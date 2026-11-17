import { About } from "@/components/home/about";
import { Contact } from "@/components/home/contact";
import { Hero } from "@/components/home/hero";
import { Indicators } from "@/components/home/indicators";
import { Journey } from "@/components/home/journey";
import { Projects } from "@/components/home/projects";
import { HomeSection } from "@/components/layout/home-section";

// Home: Hero → Sobre → Indicadores → Projetos → Trajetória/Eventos → Contato (D04).
export default function Home() {
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
      <Projects />
      <Journey />
      <Contact />
    </>
  );
}
