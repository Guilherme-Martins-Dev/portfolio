import { useLocale, useTranslations } from "next-intl";

import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { DateRange } from "@/components/shared/date-range";
import { TechList } from "@/components/shared/tech-list";
import { experience } from "@/content";
import { getProjectTechnologies } from "@/lib/home-data";
import { pageMetadata } from "@/lib/page-metadata";
import { sortExperience } from "@/lib/pages";

export const generateMetadata = () => pageMetadata("ExperiencePage", "/experiencia");

/** /experiencia (/en/experience): experiências de src/content/experience.ts, as em andamento primeiro. */
export default function ExperiencePage() {
  const t = useTranslations("ExperiencePage");
  const tPages = useTranslations("Pages");
  const locale = useLocale() as "pt" | "en";
  const items = sortExperience(experience);

  return (
    <PageContainer>
      <PageHeader title={t("title")} lead={t("lead")} />
      {items.length > 0 ? (
        <ol className="flex flex-col gap-10 border-l border-border pl-6">
          {items.map((item) => (
            <li key={item.id} data-experience className="relative flex flex-col gap-2">
              <span
                aria-hidden
                className="absolute top-2 -left-[1.9rem] size-3 rounded-full border-2 border-background bg-ring"
              />
              <p className="font-mono text-xs text-muted-foreground">
                <DateRange start={item.start} end={item.end} locale={locale} ongoingLabel={tPages("present")} />
              </p>
              <h2 className="font-display text-3xl">{item.role[locale]}</h2>
              <p className="text-muted-foreground">{item.organization}</p>
              {item.description && <p className="max-w-2xl leading-relaxed">{item.description[locale]}</p>}
              <TechList names={getProjectTechnologies(item.technologies)} label={tPages("technologies")} />
            </li>
          ))}
        </ol>
      ) : (
        // TODO(guilherme): cadastrar as experiências em src/content/experience.ts.
        <p className="text-muted-foreground">{t("empty")}</p>
      )}
    </PageContainer>
  );
}
