import { useLocale, useTranslations } from "next-intl";

import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { DateRange } from "@/components/shared/date-range";
import { events, projects } from "@/content";
import { Link } from "@/i18n/navigation";
import { getVisibleCaseStudies } from "@/lib/case-studies";
import { pageMetadata } from "@/lib/page-metadata";
import { splitEvents } from "@/lib/pages";
import { resolveCaseStudy } from "@/lib/projects-catalog";
import type { PortfolioEvent } from "@/lib/schemas";

export const generateMetadata = () => pageMetadata("EventsPage", "/eventos");

const linkClass =
  "rounded-sm text-link underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring";

const linkKinds = ["devpost", "photos", "certificate", "repository", "demo"] as const;

/** /eventos (/en/events): eventos em "Participação" e "Organização e colaboração" (D03). */
export default function EventsPage() {
  const t = useTranslations("EventsPage");
  const groups = splitEvents(events);

  const sections = [
    { id: "participacao", title: t("participation"), items: groups.participation, empty: t("emptyParticipation") },
    { id: "organizacao", title: t("organization"), items: groups.organization, empty: t("emptyOrganization") },
  ];

  return (
    <PageContainer>
      <PageHeader title={t("title")} lead={t("lead")} />
      {sections.map((section) => (
        <section key={section.id} aria-labelledby={`${section.id}-titulo`} className="flex flex-col gap-6">
          <h2 id={`${section.id}-titulo`} className="font-display text-3xl sm:text-4xl">
            {section.title}
          </h2>
          {section.items.length > 0 ? (
            <ul className="grid gap-6 md:grid-cols-2">
              {section.items.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </ul>
          ) : (
            // TODO(guilherme): cadastrar os eventos em src/content/events.ts.
            <p className="text-muted-foreground">{section.empty}</p>
          )}
        </section>
      ))}
    </PageContainer>
  );
}

function EventCard({ event }: { event: PortfolioEvent }) {
  const t = useTranslations("EventsPage");
  const tRoles = useTranslations("EventRole");
  const tPages = useTranslations("Pages");
  const locale = useLocale() as "pt" | "en";

  const project = event.relatedProject ? projects.find((p) => p.slug === event.relatedProject) : undefined;
  const hasCaseStudy = !!project && !!resolveCaseStudy(project.slug, locale, getVisibleCaseStudies());
  const links = linkKinds.flatMap((kind) => {
    const href = event.links[kind];
    return href ? [{ kind, href }] : [];
  });

  return (
    <li data-event>
      <article className="flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-6 text-card-foreground">
        <p className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="rounded-full border border-border px-2 py-0.5">{tRoles(event.role)}</span>
          {event.date && <DateRange start={event.date} end={event.date} locale={locale} ongoingLabel={tPages("present")} />}
          {event.location && <span>{event.location}</span>}
        </p>
        <h3 className="font-display text-2xl">{event.name}</h3>
        {event.description && <p>{event.description[locale]}</p>}
        {project && (
          <p className="text-sm">
            <span className="text-muted-foreground">{t("relatedProject")}: </span>
            {hasCaseStudy ? (
              <Link href={{ pathname: "/projetos/[slug]", params: { slug: project.slug } }} className={linkClass}>
                {project.title}
              </Link>
            ) : (
              project.title
            )}
          </p>
        )}
        {links.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-x-4 gap-y-2 pt-2 text-sm">
            {links.map((link) => (
              <li key={link.kind}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {t(`links.${link.kind}`)}
                  <span className="sr-only">: {event.name}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </article>
    </li>
  );
}
