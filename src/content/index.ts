import { events } from "./events";
import { experience } from "./experience";
import { profile } from "./profile";
import { projects } from "./projects";
import { studies } from "./studies";
import { technologies } from "./technologies";

/**
 * Ponto único de acesso ao conteúdo. Além do schema de cada coleção, confere as referências
 * entre coleções (ids repetidos, tecnologia inexistente, projeto relacionado inexistente).
 */
export function checkReferences(content: {
  projects: typeof projects;
  events: typeof events;
  experience: typeof experience;
  technologies: typeof technologies;
  studies: typeof studies;
}): void {
  const errors: string[] = [];
  const techIds = new Set(content.technologies.map((t) => t.id));
  const projectSlugs = new Set(content.projects.map((p) => p.slug));

  const duplicates = (name: string, ids: string[]) => {
    const seen = new Set<string>();
    for (const id of ids) {
      if (seen.has(id)) errors.push(`${name}: id repetido "${id}"`);
      seen.add(id);
    }
  };
  duplicates("technologies", content.technologies.map((t) => t.id));
  duplicates("projects", content.projects.map((p) => p.slug));
  duplicates("events", content.events.map((e) => e.id));
  duplicates("experience", content.experience.map((e) => e.id));
  duplicates("studies", content.studies.map((s) => s.id));

  for (const p of content.projects) {
    for (const t of p.technologies) {
      if (!techIds.has(t)) errors.push(`projects/${p.slug}: tecnologia desconhecida "${t}" (cadastre em technologies.ts)`);
    }
  }
  for (const e of content.experience) {
    for (const t of e.technologies) {
      if (!techIds.has(t)) errors.push(`experience/${e.id}: tecnologia desconhecida "${t}" (cadastre em technologies.ts)`);
    }
  }
  for (const s of content.studies) {
    for (const t of s.technologies) {
      if (!techIds.has(t)) errors.push(`studies/${s.id}: tecnologia desconhecida "${t}" (cadastre em technologies.ts)`);
    }
  }
  for (const e of content.events) {
    if (e.relatedProject && !projectSlugs.has(e.relatedProject)) {
      errors.push(`events/${e.id}: projeto relacionado inexistente "${e.relatedProject}"`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Referências inválidas no conteúdo:\n${errors.map((e) => `  ✖ ${e}`).join("\n")}`);
  }
}

checkReferences({ projects, events, experience, technologies, studies });

export { events, experience, profile, projects, studies, technologies };
