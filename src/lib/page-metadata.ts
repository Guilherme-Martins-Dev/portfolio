import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { routing } from "@/i18n/routing";

import { alternatesFor, ogLocale, type Locale, type PublicHref } from "./seo";

type PageNamespace = "AboutPage" | "ExperiencePage" | "EventsPage" | "StudiesPage" | "ContactPage" | "ProjectsPage";

/**
 * canonical + hreflang (pt-BR, en, x-default) e o Open Graph da rota no idioma atual (#24).
 * O `openGraph` de uma página substitui o do layout inteiro, então ele sai completo daqui.
 */
export async function localizedMetadata(
  href: PublicHref,
  { title, description, slug, type = "website" }: { title: string; description: string; slug?: string; type?: "website" | "article" },
): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const tMeta = await getTranslations("Metadata");
  const alternates = alternatesFor(href, locale, { slug });
  // O opengraph-image.tsx de [locale] só entra sozinho na Home: um `openGraph` em segmento filho
  // apaga a imagem herdada, então ela é referenciada aqui (relativa ao metadataBase do layout).
  const image = { url: `/${locale}/opengraph-image/default`, width: 1200, height: 630, alt: tMeta("ogAlt") };
  return {
    title,
    description,
    alternates,
    openGraph: {
      type,
      url: alternates.canonical,
      siteName: tMeta("title"),
      title,
      description,
      locale: ogLocale[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

/** Metadata de uma página interna: "Título · Nome do site", o parágrafo de abertura como descrição e o hreflang. */
export async function pageMetadata(namespace: PageNamespace, href: PublicHref): Promise<Metadata> {
  const t = await getTranslations(namespace);
  const tMeta = await getTranslations("Metadata");
  return localizedMetadata(href, { title: `${t("title")} · ${tMeta("title")}`, description: t("lead") });
}
