import { useLocale, useTranslations } from "next-intl";

import { HomeSection } from "@/components/layout/home-section";
import { formatPartialDate, type TimelineItem } from "@/lib/home-sections";
import { getTimeline } from "@/lib/home-data";

/**
 * Trajetória e eventos (storyboard §6): experiências e eventos numa lista ordenada, do mais
 * recente para o mais antigo, com as datas em <time>. A versão horizontal com pin é da #21;
 * esta é a estrutura do HTML, que já é a forma final com movimento reduzido e no celular.
 */
export function Journey() {
  const t = useTranslations("Sections");
  const tJourney = useTranslations("Journey");
  const timeline = getTimeline();

  return (
    <HomeSection
      id="trajetoria"
      aria-labelledby="trajetoria-titulo"
      className="mx-auto flex min-h-[80svh] w-full max-w-6xl flex-col justify-center gap-8 px-4 py-16 sm:px-6"
    >
      <h2 id="trajetoria-titulo" className="font-display text-4xl sm:text-5xl">
        {t("journey")}
      </h2>
      {timeline.length > 0 ? (
        <ol className="flex flex-col gap-8 border-l border-border pl-6">
          {timeline.map((item) => (
            <TimelineEntry key={item.id} item={item} />
          ))}
        </ol>
      ) : (
        // TODO(guilherme): cadastrar experiências (src/content/experience.ts) e eventos com data (src/content/events.ts).
        <p className="text-muted-foreground">{tJourney("empty")}</p>
      )}
    </HomeSection>
  );
}

function TimelineEntry({ item }: { item: TimelineItem }) {
  const tJourney = useTranslations("Journey");
  const tRoles = useTranslations("EventRole");
  const locale = useLocale() as "pt" | "en";

  const kindLabel = item.kind === "experience" ? tJourney("experience") : tJourney("event");
  const title = item.kind === "experience" ? item.title[locale] : item.title;
  const meta = item.kind === "experience" ? item.organization : [tRoles(item.role), item.location].filter(Boolean).join(" · ");

  return (
    <li className="relative flex flex-col gap-1">
      <span aria-hidden className="absolute top-1.5 -left-[1.9rem] size-3 rounded-full border-2 border-background bg-ring" />
      <p className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
        <span className="rounded-full border border-border px-2 py-0.5">{kindLabel}</span>
        <span>
          <time dateTime={item.date}>{formatPartialDate(item.date, locale)}</time>
          {item.kind === "experience" && (
            <>
              {" – "}
              {item.end ? <time dateTime={item.end}>{formatPartialDate(item.end, locale)}</time> : tJourney("present")}
            </>
          )}
        </span>
      </p>
      <h3 className="text-lg font-semibold">{title}</h3>
      {meta && <p className="text-sm text-muted-foreground">{meta}</p>}
      {item.description && <p className="max-w-2xl">{item.description[locale]}</p>}
    </li>
  );
}
