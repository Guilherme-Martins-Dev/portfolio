import { useLocale, useTranslations } from "next-intl";

import { HomeSection } from "@/components/layout/home-section";
import { getTimeline } from "@/lib/home-data";
import { formatPartialDate, type TimelineItem } from "@/lib/home-sections";

type ExperienceItem = Extract<TimelineItem, { kind: "experience" }>;
type EventItem = Extract<TimelineItem, { kind: "event" }>;

const sectionClass = "mx-auto flex min-h-[80svh] w-full max-w-6xl flex-col justify-center gap-8 px-4 py-16 sm:px-6";

/**
 * Experiência (#experience): linha do tempo das experiências, da mais recente para a mais
 * antiga. A versão horizontal com pin é da #21; este HTML já é a forma final com movimento
 * reduzido e no celular.
 */
export function Experience() {
  const t = useTranslations("Sections");
  const tJourney = useTranslations("Journey");
  const items = getTimeline().filter((item): item is ExperienceItem => item.kind === "experience");

  return (
    <HomeSection id="experience" aria-labelledby="experience-titulo" className={sectionClass}>
      <h2 id="experience-titulo" className="font-display text-4xl sm:text-5xl">
        {t("experience")}
      </h2>
      {items.length > 0 ? (
        <ol className="flex flex-col gap-8 border-l border-border pl-6">
          {items.map((item) => (
            <TimelineEntry key={item.id} item={item} />
          ))}
        </ol>
      ) : (
        // TODO(guilherme): cadastrar experiências em src/content/experience.ts.
        <p className="text-muted-foreground">{tJourney("emptyExperience")}</p>
      )}
    </HomeSection>
  );
}

/** Eventos (#events): organização e participação em grupos separados (briefing). */
export function Events() {
  const t = useTranslations("Sections");
  const tJourney = useTranslations("Journey");
  const items = getTimeline().filter((item): item is EventItem => item.kind === "event");
  const organized = items.filter((item) => item.role === "organizador");
  const participated = items.filter((item) => item.role !== "organizador");

  return (
    <HomeSection id="events" aria-labelledby="events-titulo" className={sectionClass}>
      <h2 id="events-titulo" className="font-display text-4xl sm:text-5xl">
        {t("events")}
      </h2>
      {items.length === 0 ? (
        // TODO(guilherme): cadastrar eventos com data em src/content/events.ts.
        <p className="text-muted-foreground">{tJourney("emptyEvents")}</p>
      ) : (
        <>
          <EventGroup id="events-organizados" title={tJourney("organized")} items={organized} />
          <EventGroup id="events-participacao" title={tJourney("participated")} items={participated} />
        </>
      )}
    </HomeSection>
  );
}

function EventGroup({ id, title, items }: { id: string; title: string; items: EventItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-col gap-4">
      <h3 id={id} className="font-mono text-sm uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <ol aria-labelledby={id} className="flex flex-col gap-8 border-l border-border pl-6">
        {items.map((item) => (
          <TimelineEntry key={item.id} item={item} />
        ))}
      </ol>
    </div>
  );
}

function TimelineEntry({ item }: { item: TimelineItem }) {
  const tJourney = useTranslations("Journey");
  const tRoles = useTranslations("EventRole");
  const locale = useLocale() as "pt" | "en";

  const title = item.kind === "experience" ? item.title[locale] : item.title;
  const meta =
    item.kind === "experience" ? item.organization : [tRoles(item.role), item.location].filter(Boolean).join(" · ");

  return (
    <li className="relative flex flex-col gap-1">
      <span aria-hidden className="absolute top-1.5 -left-[1.9rem] size-3 rounded-full border-2 border-background bg-ring" />
      <p className="font-mono text-xs text-muted-foreground">
        <time dateTime={item.date}>{formatPartialDate(item.date, locale)}</time>
        {item.kind === "experience" && (
          <>
            {" – "}
            {item.end ? <time dateTime={item.end}>{formatPartialDate(item.end, locale)}</time> : tJourney("present")}
          </>
        )}
      </p>
      <h3 className="text-lg font-semibold">{title}</h3>
      {meta && <p className="text-sm text-muted-foreground">{meta}</p>}
      {item.description && <p className="max-w-2xl">{item.description[locale]}</p>}
    </li>
  );
}
