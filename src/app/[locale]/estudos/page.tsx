import { useLocale, useTranslations } from "next-intl";

import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { DateRange } from "@/components/shared/date-range";
import { TechList } from "@/components/shared/tech-list";
import { studies } from "@/content";
import { getProjectTechnologies } from "@/lib/home-data";
import { pageMetadata } from "@/lib/page-metadata";
import { sortStudies } from "@/lib/pages";

export const generateMetadata = () => pageMetadata("StudiesPage", "/estudos");

const linkClass =
  "rounded-sm text-link underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring";

/** /estudos (/en/studies): formação, cursos e certificações de src/content/studies.ts. */
export default function StudiesPage() {
  const t = useTranslations("StudiesPage");
  const tKind = useTranslations("StudyKind");
  const tPages = useTranslations("Pages");
  const locale = useLocale() as "pt" | "en";
  const items = sortStudies(studies);

  return (
    <PageContainer>
      <PageHeader title={t("title")} lead={t("lead")} />
      {items.length > 0 ? (
        <ul className="grid gap-6 md:grid-cols-2">
          {items.map((item) => (
            <li key={item.id} data-study>
              <article className="flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-6 text-card-foreground">
                <p className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
                  <span className="rounded-full border border-border px-2 py-0.5">{tKind(item.kind)}</span>
                  <DateRange start={item.start} end={item.end} locale={locale} ongoingLabel={tPages("presentStudy")} />
                </p>
                <h2 className="font-display text-2xl">{item.title[locale]}</h2>
                <p className="text-muted-foreground">{item.institution}</p>
                {item.description && <p>{item.description[locale]}</p>}
                <TechList names={getProjectTechnologies(item.technologies)} label={tPages("technologies")} />
                {item.links.certificate && (
                  <a
                    href={item.links.certificate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-auto self-start text-sm ${linkClass}`}
                  >
                    {t("certificate")}
                    <span className="sr-only">: {item.title[locale]}</span>
                  </a>
                )}
              </article>
            </li>
          ))}
        </ul>
      ) : (
        // TODO(guilherme): cadastrar formação, cursos e certificações em src/content/studies.ts.
        <p className="text-muted-foreground">{t("empty")}</p>
      )}
    </PageContainer>
  );
}
