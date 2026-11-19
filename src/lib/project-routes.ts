import { projects } from "@/content/projects";
import { routing } from "@/i18n/routing";

/**
 * Usado pelo src/proxy.ts para responder HTTP 404 em /projetos/<slug> (e /en/projects/<slug>)
 * quando o slug não existe em projects.ts. Fica aqui, sem imports do Next, para ser testável.
 */
const projectSlugs = new Set(projects.map((p) => p.slug));
const caseStudyPaths = routing.locales.map((locale) => {
  const localized = routing.pathnames["/projetos/[slug]"][locale].replace("/[slug]", "");
  return { locale, pattern: new RegExp(`^/${locale}${localized}/([^/]+)/?$`) };
});

/** Locale da URL quando ela é /projetos/<slug> com um slug que não existe em projects.ts. */
export function unknownProjectLocale(pathname: string): (typeof routing.locales)[number] | undefined {
  for (const { locale, pattern } of caseStudyPaths) {
    const match = pathname.match(pattern);
    if (!match) continue;
    // Slugs válidos são só [a-z0-9-] (schema), então não precisam de decodeURIComponent.
    return projectSlugs.has(match[1]) ? undefined : locale;
  }
  return undefined;
}
