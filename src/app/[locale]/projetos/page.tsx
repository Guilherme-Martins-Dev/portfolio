import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ProjectCard } from "@/components/home/project-card";
import { projects, technologies } from "@/content";
import { ProjectFilters } from "@/features/projects/project-filters";
import { projectFilters, sortProjects } from "@/lib/projects-catalog";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ProjectsPage");
  const tMeta = await getTranslations("Metadata");
  return { title: `${t("title")} · ${tMeta("title")}`, description: t("lead") };
}

/** /projetos (/en/projects): todos os projetos de src/content, com filtro por status e tecnologia. */
export default async function ProjectsPage() {
  const t = await getTranslations("ProjectsPage");
  const list = sortProjects(projects).map((project) => ({
    slug: project.slug,
    status: project.status,
    technologies: project.technologies,
    card: <ProjectCard key={project.slug} project={project} headingLevel={2} />,
  }));

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6">
      <header className="flex flex-col gap-4">
        <h1 className="font-display text-5xl sm:text-6xl">{t("title")}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{t("lead")}</p>
      </header>
      <ProjectFilters options={projectFilters(projects, technologies)} projects={list} />
    </div>
  );
}
