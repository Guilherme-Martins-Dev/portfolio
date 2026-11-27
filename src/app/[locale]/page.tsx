import { getTranslations } from "next-intl/server";

import { About } from "@/components/home/about";
import { Contact } from "@/components/home/contact";
import { Hero } from "@/components/home/hero";
import { Indicators } from "@/components/home/indicators";
import { Projects } from "@/components/home/projects";
import { Events, Experience } from "@/components/home/timeline-sections";
import { HomeSection } from "@/components/layout/home-section";
import { profile } from "@/content";
import { localizedMetadata } from "@/lib/page-metadata";
import { jsonLdScript, personJsonLd, type Locale } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "Metadata" });
  return localizedMetadata("/", { title: t("title"), description: t("description") });
}

// Home: Hero → Sobre (com a faixa de indicadores) → Experiência → Projetos → Eventos → Contato (briefing, fase 0).
export default async function Home({ params }: PageProps<"/[locale]">) {
  const locale = (await params).locale as Locale;
  const person = personJsonLd({ ...profile, headline: profile.headline?.[locale] });

  return (
    <>
      {/* Dados estruturados Person (#24): só os campos cadastrados em profile.ts. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(person) }} />
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
