import { About } from "@/components/home/about";
import { Contact } from "@/components/home/contact";
import { Hero } from "@/components/home/hero";
import { Indicators } from "@/components/home/indicators";
import { Projects } from "@/components/home/projects";
import { Events, Experience } from "@/components/home/timeline-sections";
import { HomeSection } from "@/components/layout/home-section";

// Home: Hero → Sobre (com a faixa de indicadores) → Experiência → Projetos → Eventos → Contato (briefing, fase 0).
export default function Home() {
  return (
    <>
      <HomeSection
        id="hero"
        aria-labelledby="hero-titulo"
        className="mx-auto flex min-h-[80svh] w-full max-w-6xl flex-col justify-center px-4 py-16 sm:px-6"
      >
        <Hero />
      </HomeSection>

      <About>
        <Indicators />
      </About>
      <Experience />
      <Projects />
      <Events />
      <Contact />
    </>
  );
}
