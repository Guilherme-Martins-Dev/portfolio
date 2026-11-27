import { defineRouting } from "next-intl/routing";

// Rotas internas em português (nomes das pastas em app/[locale]); o inglês recebe URLs traduzidas.
export const routing = defineRouting({
  locales: ["pt", "en"],
  defaultLocale: "pt",
  // O hreflang sai só do <head> (generateMetadata, #24). O header `Link` do next-intl usaria
  // `pt` em vez de `pt-BR` e um x-default sem prefixo (/sobre), divergindo do <head> e do sitemap.
  alternateLinks: false,
  pathnames: {
    "/": "/",
    "/sobre": { pt: "/sobre", en: "/about" },
    "/experiencia": { pt: "/experiencia", en: "/experience" },
    "/projetos": { pt: "/projetos", en: "/projects" },
    "/projetos/[slug]": { pt: "/projetos/[slug]", en: "/projects/[slug]" },
    "/eventos": { pt: "/eventos", en: "/events" },
    "/estudos": { pt: "/estudos", en: "/studies" },
    "/contato": { pt: "/contato", en: "/contact" },
    // Página interna do design system (#8), fora do menu e do sitemap.
    "/design": "/design",
  },
});

/** Valor do atributo `lang` do <html> para cada locale (também usado no hreflang da #24). */
export const htmlLang = {
  pt: "pt-BR",
  en: "en",
} as const satisfies Record<(typeof routing.locales)[number], string>;
