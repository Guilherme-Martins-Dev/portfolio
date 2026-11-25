import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/seo";

/** /robots.txt (#24): tudo liberado, menos a página interna do design system, e o endereço do sitemap. */
export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/pt/design", "/en/design"] },
    sitemap: `${base}/sitemap.xml`,
  };
}
