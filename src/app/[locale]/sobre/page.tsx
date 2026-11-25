import { useLocale, useTranslations } from "next-intl";

import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { profile, technologies } from "@/content";
import { Link } from "@/i18n/navigation";
import { getFocusAreas } from "@/lib/home-data";
import { pageMetadata } from "@/lib/page-metadata";
import { groupTechnologies } from "@/lib/pages";

export const generateMetadata = () => pageMetadata("AboutPage", "/sobre");

const linkClass =
  "rounded-sm text-link underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring";

/** /sobre (/en/about): perfil, áreas de foco e tecnologias por área. Campo vazio não aparece (D08). */
export default function AboutPage() {
  const t = useTranslations("AboutPage");
  const tAreas = useTranslations("Areas");
  const locale = useLocale() as "pt" | "en";
  const focus = getFocusAreas();
  const groups = groupTechnologies(technologies);

  return (
    <PageContainer>
      <PageHeader title={t("title")} lead={t("lead")} />

      <section aria-labelledby="sobre-perfil" className="flex flex-col gap-4">
        <h2 id="sobre-perfil" className="font-display text-3xl">
          {profile.name}
        </h2>
        {profile.headline && <p className="text-xl">{profile.headline[locale]}</p>}
        {/* TODO(guilherme): headline, bio e cidade em src/content/profile.ts. */}
        {profile.bio ? (
          <p className="max-w-2xl text-lg leading-relaxed">{profile.bio[locale]}</p>
        ) : (
          <p className="text-muted-foreground">{t("pending")}</p>
        )}
        {profile.location && (
          <p className="text-sm text-muted-foreground">
            <span className="font-mono uppercase tracking-wide">{t("location")}:</span> {profile.location}
          </p>
        )}
      </section>

      {focus.length > 0 && (
        <section aria-labelledby="sobre-areas" className="flex flex-col gap-4">
          <h2 id="sobre-areas" className="font-display text-3xl">
            {t("focusAreas")}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {focus.map((area) => (
              <li key={area} className="rounded-full border border-border px-3 py-1 text-sm">
                {tAreas(area)}
              </li>
            ))}
          </ul>
        </section>
      )}

      {groups.length > 0 && (
        <section aria-labelledby="sobre-tecnologias" className="flex flex-col gap-6">
          <h2 id="sobre-tecnologias" className="font-display text-3xl">
            {t("technologies")}
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <li
                key={group.area}
                className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 text-card-foreground"
              >
                <h3 className="font-mono text-sm uppercase tracking-wide text-muted-foreground">{tAreas(group.area)}</h3>
                <ul className="flex flex-wrap gap-2">
                  {group.technologies.map((tech) => (
                    <li key={tech.id} className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs">
                      {tech.name}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      )}

      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        <li>
          <Link href="/projetos" className={linkClass}>
            {t("seeProjects")}
          </Link>
        </li>
        <li>
          <Link href="/contato" className={linkClass}>
            {t("contact")}
          </Link>
        </li>
      </ul>
    </PageContainer>
  );
}
