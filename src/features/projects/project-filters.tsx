"use client";

import { useTranslations } from "next-intl";
import { Fragment, useState, type ReactNode } from "react";

import { filterProjects, type ProjectFilters as Options, type ProjectQuery } from "@/lib/projects-catalog";
import type { ProjectStatus } from "@/lib/schemas";
import { cn } from "@/lib/utils";

export type FilterableProject = {
  slug: string;
  status: ProjectStatus;
  technologies: string[];
  /** Card já renderizado no servidor (um <li>). */
  card: ReactNode;
};

const chipClass =
  "rounded-full border border-border bg-background px-3 py-1 font-mono text-xs outline-none transition-colors hover:border-ring focus-visible:ring-[3px] focus-visible:ring-ring aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground";

/**
 * Filtro por status e por tecnologia da página /projetos. Os cards vêm prontos do servidor;
 * sem JavaScript a lista inteira aparece (estado inicial = sem filtro). Os botões usam
 * `aria-pressed` e a contagem de resultados é anunciada numa região `role="status"`.
 */
export function ProjectFilters({ options, projects }: { options: Options; projects: FilterableProject[] }) {
  const t = useTranslations("ProjectsPage");
  const tStatus = useTranslations("ProjectStatus");
  const [query, setQuery] = useState<ProjectQuery>({});
  const visible = filterProjects(projects, query);
  const filtered = !!(query.status || query.technology);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        {options.statuses.length > 1 && (
          <FilterGroup id="filtro-status" label={t("filterStatus")}>
            <Chip pressed={!query.status} onClick={() => setQuery((q) => ({ ...q, status: undefined }))}>
              {t("all")}
            </Chip>
            {options.statuses.map((status) => (
              <Chip
                key={status}
                pressed={query.status === status}
                onClick={() => setQuery((q) => ({ ...q, status: q.status === status ? undefined : status }))}
              >
                {tStatus(status)}
              </Chip>
            ))}
          </FilterGroup>
        )}

        {options.technologies.length > 0 && (
          <FilterGroup id="filtro-tecnologia" label={t("filterTechnology")}>
            <Chip pressed={!query.technology} onClick={() => setQuery((q) => ({ ...q, technology: undefined }))}>
              {t("all")}
            </Chip>
            {options.technologies.map((tech) => (
              <Chip
                key={tech.id}
                pressed={query.technology === tech.id}
                onClick={() =>
                  setQuery((q) => ({ ...q, technology: q.technology === tech.id ? undefined : tech.id }))
                }
              >
                {tech.name}
              </Chip>
            ))}
          </FilterGroup>
        )}

        <p role="status" className="text-sm text-muted-foreground">
          {t("count", { count: visible.length })}
        </p>
      </div>

      {visible.length > 0 ? (
        <ul aria-label={t("listLabel")} className="grid gap-6 md:grid-cols-2">
          {visible.map((project) => (
            <Fragment key={project.slug}>{project.card}</Fragment>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-start gap-3">
          <p>{t("empty")}</p>
          {filtered && (
            <button type="button" className={cn(chipClass, "text-sm")} onClick={() => setQuery({})}>
              {t("clear")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function FilterGroup({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div role="group" aria-labelledby={id} className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
      <span id={id} className="shrink-0 font-mono text-xs uppercase tracking-wide text-muted-foreground sm:w-28">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" aria-pressed={pressed} onClick={onClick} className={chipClass}>
      {children}
    </button>
  );
}
