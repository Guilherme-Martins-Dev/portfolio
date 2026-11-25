import { htmlLang, routing } from "@/i18n/routing";

/**
 * SEO multilíngue (#24, 07-qualidade §7.1). Funções puras, sem imports do Next, para serem
 * testáveis no Vitest: URL base, caminhos traduzidos, hreflang/canonical e JSON-LD.
 */

export type Locale = (typeof routing.locales)[number];

/** Rotas públicas indexáveis (chaves de `routing.pathnames`). A /design fica de fora (noindex). */
export type PublicHref = Exclude<keyof typeof routing.pathnames, "/design">;

/** Páginas estáticas que entram no sitemap, na ordem da navegação. */
export const SITEMAP_PAGES = [
  "/",
  "/sobre",
  "/experiencia",
  "/projetos",
  "/eventos",
  "/estudos",
  "/contato",
] as const satisfies readonly PublicHref[];

/** Locale do Open Graph (`og:locale`, formato idioma_PAÍS). */
export const ogLocale = { pt: "pt_BR", en: "en_US" } as const satisfies Record<Locale, string>;

const FALLBACK_SITE_URL = "http://localhost:3000";

/**
 * URL base absoluta do site, sem barra no fim. Vem de NEXT_PUBLIC_SITE_URL (definida na Vercel
 * na #28); sem ela, cai em localhost para o build e os testes não quebrarem.
 */
export function siteUrl(env: string | undefined = process.env.NEXT_PUBLIC_SITE_URL): string {
  const value = env?.trim();
  if (!value) return FALLBACK_SITE_URL;
  const url = new URL(value);
  return `${url.origin}${url.pathname}`.replace(/\/+$/, "");
}

/** Caminho público (com o prefixo do idioma e o nome traduzido) de uma rota interna. */
export function localizedPath(href: PublicHref, locale: Locale, params: { slug?: string } = {}): string {
  const entry = routing.pathnames[href];
  let path: string = typeof entry === "string" ? entry : entry[locale];
  if (path.includes("[slug]")) {
    if (!params.slug) throw new Error(`localizedPath: ${href} precisa de slug`);
    path = path.replace("[slug]", encodeURIComponent(params.slug));
  }
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** URL absoluta de uma rota no idioma pedido. */
export function localizedUrl(
  href: PublicHref,
  locale: Locale,
  params: { slug?: string } = {},
  base: string = siteUrl(),
): string {
  return `${base}${localizedPath(href, locale, params)}`;
}

export type Alternates = {
  canonical: string;
  /** Chaves no formato BCP 47 do `lang` do <html> (pt-BR, en) mais o x-default. */
  languages: Record<string, string>;
};

/**
 * `canonical` do idioma atual + `alternates.languages` com todos os idiomas e o `x-default`.
 * O x-default aponta para a versão no idioma padrão (pt): com `localePrefix: "always"` não há
 * uma URL sem idioma que sirva conteúdo, só o redirecionamento da raiz.
 */
export function alternatesFor(
  href: PublicHref,
  locale: Locale,
  params: { slug?: string } = {},
  base: string = siteUrl(),
): Alternates {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[htmlLang[l]] = localizedUrl(href, l, params, base);
  languages["x-default"] = localizedUrl(href, routing.defaultLocale, params, base);
  return { canonical: localizedUrl(href, locale, params, base), languages };
}

/** Serializa JSON-LD para um <script>, escapando `<` para não fechar a tag (guia JSON-LD do Next). */
export function jsonLdScript(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

type PersonInput = {
  name: string;
  headline?: string;
  email?: string;
  links: { github?: string; linkedin?: string };
};

/** JSON-LD `Person` só com os campos cadastrados em profile.ts (campo vazio não entra, D08). */
export function personJsonLd(profile: PersonInput, base: string = siteUrl()) {
  const sameAs = [profile.links.github, profile.links.linkedin].filter((link): link is string => !!link);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${base}/#person`,
    name: profile.name,
    url: base,
    ...(profile.headline && { jobTitle: profile.headline }),
    ...(profile.email && { email: `mailto:${profile.email}` }),
    ...(sameAs.length > 0 && { sameAs }),
  };
}

type CreativeWorkInput = {
  name: string;
  description: string;
  url: string;
  inLanguage: string;
  dateModified?: string;
  keywords: string[];
  /** Link público do repositório; não é passado para projeto confidencial. */
  codeRepository?: string;
  demo?: string;
};

/** JSON-LD `CreativeWork` de um estudo de caso, com o autor apontando para o `Person` do site. */
export function creativeWorkJsonLd(work: CreativeWorkInput, authorName: string, base: string = siteUrl()) {
  const sameAs = [work.codeRepository, work.demo].filter((link): link is string => !!link);
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: work.name,
    description: work.description,
    url: work.url,
    inLanguage: work.inLanguage,
    author: { "@type": "Person", "@id": `${base}/#person`, name: authorName, url: base },
    ...(work.dateModified && { dateModified: work.dateModified }),
    ...(work.keywords.length > 0 && { keywords: work.keywords.join(", ") }),
    ...(sameAs.length > 0 && { sameAs }),
  };
}

export type SitemapEntry = {
  url: string;
  lastModified?: string;
  alternates: { languages: Record<string, string> };
};

/**
 * Entradas do sitemap: cada página estática e cada estudo de caso publicado, uma vez por idioma,
 * cada uma com os alternates de todos os idiomas (e o x-default). `lastModified` só aparece quando
 * existe uma data real (o `updatedAt` do MDX); as páginas estáticas ficam sem data.
 */
export function buildSitemap(
  caseStudies: readonly { slug: string; updatedAt?: string }[],
  base: string = siteUrl(),
): SitemapEntry[] {
  const lastModifiedBySlug = new Map<string, string | undefined>();
  for (const study of caseStudies) {
    const current = lastModifiedBySlug.get(study.slug);
    const date = study.updatedAt?.slice(0, 10);
    lastModifiedBySlug.set(study.slug, current && (!date || current > date) ? current : date);
  }

  const pages: { href: PublicHref; slug?: string; lastModified?: string }[] = [
    ...SITEMAP_PAGES.map((href) => ({ href })),
    ...[...lastModifiedBySlug].map(([slug, lastModified]) => ({ href: "/projetos/[slug]" as const, slug, lastModified })),
  ];

  return pages.flatMap(({ href, slug, lastModified }) =>
    routing.locales.map((locale) => {
      const { canonical, languages } = alternatesFor(href, locale, { slug }, base);
      return { url: canonical, ...(lastModified && { lastModified }), alternates: { languages } };
    }),
  );
}
