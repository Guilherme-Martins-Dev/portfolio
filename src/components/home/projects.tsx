import { useTranslations } from "next-intl";

import { HomeSection } from "@/components/layout/home-section";
import type { Project } from "@/lib/schemas";
import { getHomeProjects } from "@/lib/home-data";
import { ProjectCard } from "./project-card";

/**
 * Projetos (storyboard §4): os projetos com `featured: true`, com os concluídos primeiro e a
 * subseção "Em desenvolvimento" (D06) depois. Subseção sem projeto não aparece.
 */
export function Projects() {
  const t = useTranslations("Sections");
  const tProjects = useTranslations("Projects");
  const { completed, inProgress } = getHomeProjects();

  return (
    <HomeSection
      id="projects"
      aria-labelledby="projects-titulo"
      className="mx-auto flex min-h-[80svh] w-full max-w-6xl flex-col justify-center gap-10 px-4 py-16 sm:px-6"
    >
      <h2 id="projects-titulo" className="font-display text-4xl sm:text-5xl">
        {t("projects")}
      </h2>
      <ProjectGroup id="projetos-concluidos" title={tProjects("completed")} projects={completed} />
      <ProjectGroup id="projetos-em-desenvolvimento" title={tProjects("inProgress")} projects={inProgress} />
    </HomeSection>
  );
}

function ProjectGroup({ id, title, projects }: { id: string; title: string; projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <h3 id={id} className="font-mono text-sm uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <ul aria-labelledby={id} className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </ul>
    </div>
  );
}
