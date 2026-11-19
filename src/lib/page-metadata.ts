import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type PageNamespace = "AboutPage" | "ExperiencePage" | "EventsPage" | "StudiesPage" | "ContactPage";

/** Metadata de uma página interna: "Título · Nome do site" e o parágrafo de abertura como descrição. */
export async function pageMetadata(namespace: PageNamespace): Promise<Metadata> {
  const t = await getTranslations(namespace);
  const tMeta = await getTranslations("Metadata");
  return { title: `${t("title")} · ${tMeta("title")}`, description: t("lead") };
}
