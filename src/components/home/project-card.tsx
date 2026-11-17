import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { getCaseStudy } from "@/lib/case-studies";
import { getProjectTechnologies } from "@/lib/home-data";
import type { Project } from "@/lib/schemas";
import { StatusBadge } from "./status-badge";

const linkClass =
  "rounded-sm text-link underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring";

/**
 * Card de projeto da Home (storyboard §4). A profundidade em CSS 3D (inclinação + camadas em
 * `translateZ`) só existe com `motion-safe`, em dispositivos com hover; com movimento reduzido o
 * hover/foco muda só a borda. A stack e os links ficam sempre no HTML, nunca só no hover.
 */
export function ProjectCard({ project }: { project: Project }) {
  const t = useTranslations("Projects");
  const locale = useLocale() as "pt" | "en";
  const stack = getProjectTechnologies(project.technologies);
  const caseStudy = getCaseStudy(project.slug, locale);
  const titleId = `projeto-${project.slug}-titulo`;

  const external = [
    !project.confidential && project.links.repository && { label: t("repository"), href: project.links.repository },
    project.links.demo && { label: t("demo"), href: project.links.demo },
  ].filter((link) => !!link);

  return (
    <li className="perspective-distant">
      <article
        aria-labelledby={titleId}
        data-project-card
        className="group/card flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-6 text-card-foreground transition-[transform,border-color,box-shadow] duration-300 ease-out transform-3d hover:border-ring focus-within:border-ring motion-safe:hover:-rotate-y-4 motion-safe:hover:rotate-x-3 motion-safe:hover:shadow-[0_24px_48px_-24px_var(--glow)] motion-safe:focus-within:-rotate-y-4 motion-safe:focus-within:rotate-x-3 motion-safe:focus-within:shadow-[0_24px_48px_-24px_var(--glow)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 transition-transform duration-300 motion-safe:group-hover/card:translate-z-6 motion-safe:group-focus-within/card:translate-z-6">
          <h4 id={titleId} className="font-display text-2xl">
            {project.title}
          </h4>
          <StatusBadge status={project.status} />
        </div>

        <p className="text-muted-foreground">{project.summary[locale]}</p>

        {project.confidential && <p className="font-mono text-xs text-muted-foreground">{t("confidential")}</p>}

        {stack.length > 0 && (
          <ul aria-label={t("stack")} className="flex flex-wrap gap-2">
            {stack.map((name) => (
              <li key={name} className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs">
                {name}
              </li>
            ))}
          </ul>
        )}

        {(caseStudy || external.length > 0) && (
          <ul className="mt-auto flex flex-wrap gap-x-4 gap-y-2 pt-2 text-sm">
            {caseStudy && (
              <li>
                <Link href={{ pathname: "/projetos/[slug]", params: { slug: project.slug } }} className={linkClass}>
                  {t("caseStudy")}
                  <span className="sr-only">: {project.title}</span>
                </Link>
              </li>
            )}
            {external.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {link.label}
                  <span className="sr-only">: {project.title}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </article>
    </li>
  );
}
