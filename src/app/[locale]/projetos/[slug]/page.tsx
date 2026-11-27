import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { StatusBadge } from "@/components/home/status-badge";
import { MDXContent } from "@/components/mdx/mdx-content";
import { profile, projects } from "@/content";
import { Link } from "@/i18n/navigation";
import { htmlLang, routing } from "@/i18n/routing";
import { getVisibleCaseStudies } from "@/lib/case-studies";
import { getProjectTechnologies } from "@/lib/home-data";
import { formatPartialDate } from "@/lib/home-sections";
import { localizedMetadata } from "@/lib/page-metadata";
import { caseStudyPage, NOT_FOUND_SLUG } from "@/lib/projects-catalog";
import { creativeWorkJsonLd, jsonLdScript, localizedUrl } from "@/lib/seo";

const linkClass =
  "rounded-sm text-link underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring";

/**
 * Todos os slugs de projects.ts em todos os idiomas (o [locale] vem do layout). Projeto sem
 * estudo de caso publicado (ex.: só rascunho) é pré-renderizado como 404. NOT_FOUND_SLUG também
 * vira um 404 estático: o proxy reescreve para ele os slugs desconhecidos, que de outro modo
 * seriam renderizados sob demanda com HTTP 200 (dynamicParams não existe com cacheComponents).
 */
export function generateStaticParams() {
  return [...projects.map((project) => ({ slug: project.slug })), { slug: NOT_FOUND_SLUG }];
}

// A página lê `params` fora de <Suspense> de propósito: o 404 precisa sair antes do streaming.
// Todos os slugs conhecidos são pré-renderizados, então a navegação continua imediata na prática.
export const instant = false;

async function load(params: PageProps<"/[locale]/projetos/[slug]">["params"]) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return undefined;
  const data = caseStudyPage(slug, locale, { projects, studies: getVisibleCaseStudies() });
  return data && { ...data, locale };
}

export async function generateMetadata({ params }: PageProps<"/[locale]/projetos/[slug]">): Promise<Metadata> {
  const data = await load(params);
  if (!data) return {};
  const tMeta = await getTranslations("Metadata");
  // No fallback o resumo do projeto (projects.ts) existe nos dois idiomas; o do MDX, só no idioma do arquivo.
  const description = data.fallback ? data.project.summary[data.locale] : data.study.summary;
  return localizedMetadata("/projetos/[slug]", {
    title: `${data.study.title} · ${tMeta("title")}`,
    description,
    slug: data.project.slug,
    type: "article",
  });
}

export default async function CaseStudyPage({ params }: PageProps<"/[locale]/projetos/[slug]">) {
  const data = await load(params);
  if (!data) notFound();

  const { project, study, fallback, locale } = data;
  const t = await getTranslations("CaseStudy");
  const tProjects = await getTranslations("Projects");
  const stack = getProjectTechnologies(project.technologies);
  const external = [
    !project.confidential && project.links.repository && { label: tProjects("repository"), href: project.links.repository },
    project.links.demo && { label: tProjects("demo"), href: project.links.demo },
  ].filter((link) => !!link);
  // Com fallback, o texto do MDX está no outro idioma: o `lang` vai no bloco para leitores de tela.
  const contentLang = fallback ? htmlLang[study.locale] : undefined;
  // Dados estruturados CreativeWork (#24); o repositório de projeto confidencial não entra.
  const creativeWork = creativeWorkJsonLd(
    {
      name: study.title,
      description: fallback ? project.summary[locale] : study.summary,
      url: localizedUrl("/projetos/[slug]", locale, { slug: project.slug }),
      inLanguage: htmlLang[study.locale],
      dateModified: study.updatedAt?.slice(0, 10),
      keywords: stack,
      codeRepository: project.confidential ? undefined : project.links.repository,
      demo: project.links.demo,
    },
    profile.name,
  );

  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-16 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(creativeWork) }} />
      <nav aria-label={t("breadcrumb")}>
        <Link href="/projetos" className={linkClass}>
          ← {t("back")}
        </Link>
      </nav>

      <header className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={project.status} />
          {project.confidential && (
            <span className="font-mono text-xs text-muted-foreground">{tProjects("confidential")}</span>
          )}
        </div>
        <h1 lang={contentLang} className="font-display text-5xl sm:text-6xl">
          {study.title}
        </h1>
        <p lang={contentLang} className="text-lg text-muted-foreground">
          {study.summary}
        </p>

        <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[auto_1fr]">
          {study.role && (
            <>
              <dt className="font-mono text-xs uppercase tracking-wide text-muted-foreground">{t("role")}</dt>
              <dd lang={contentLang}>{study.role}</dd>
            </>
          )}
          {project.teamSize && (
            <>
              <dt className="font-mono text-xs uppercase tracking-wide text-muted-foreground">{t("team")}</dt>
              <dd>{t("teamSize", { count: project.teamSize })}</dd>
            </>
          )}
          {stack.length > 0 && (
            <>
              <dt className="font-mono text-xs uppercase tracking-wide text-muted-foreground">{tProjects("stack")}</dt>
              <dd>
                <ul className="flex flex-wrap gap-2">
                  {stack.map((name) => (
                    <li key={name} className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs">
                      {name}
                    </li>
                  ))}
                </ul>
              </dd>
            </>
          )}
          {study.updatedAt && (
            <>
              <dt className="font-mono text-xs uppercase tracking-wide text-muted-foreground">{t("updatedAt")}</dt>
              <dd>
                <time dateTime={study.updatedAt.slice(0, 10)}>{formatPartialDate(study.updatedAt.slice(0, 10), locale)}</time>
              </dd>
            </>
          )}
        </dl>

        {external.length > 0 && (
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {external.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </header>

      {fallback && (
        <aside role="note" data-case-study-fallback className="rounded-lg border-l-4 border-l-primary bg-card px-4 py-3 text-card-foreground">
          {t("fallback", { language: t(`language.${study.locale}`) })}
        </aside>
      )}

      <div lang={contentLang} className="case-study-body">
        <MDXContent code={study.body} />
      </div>
    </article>
  );
}
