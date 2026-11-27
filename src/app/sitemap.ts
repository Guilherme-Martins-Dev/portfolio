import type { MetadataRoute } from "next";

import { projects } from "@/content";
import { getVisibleCaseStudies } from "@/lib/case-studies";
import { buildSitemap } from "@/lib/seo";

/** /sitemap.xml (#24): páginas estáticas e estudos de caso publicados, com hreflang em cada URL. */
export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = new Set(projects.map((p) => p.slug));
  // Só estudos de projetos cadastrados: os outros dão 404 (ver caseStudyPage).
  return buildSitemap(getVisibleCaseStudies().filter((s) => slugs.has(s.slug)));
}
