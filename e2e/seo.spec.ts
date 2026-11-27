import { expect, test, type Page } from "@playwright/test";

// SEO multilíngue (#24): os erros de hreflang não aparecem em lugar nenhum, então o teste lê o
// <head> renderizado. As URLs absolutas usam NEXT_PUBLIC_SITE_URL (ou localhost:3000), por isso
// a comparação é feita pelo caminho.
const pages = [
  { pt: "/pt", en: "/en" },
  { pt: "/pt/sobre", en: "/en/about" },
  { pt: "/pt/experiencia", en: "/en/experience" },
  { pt: "/pt/projetos", en: "/en/projects" },
  { pt: "/pt/eventos", en: "/en/events" },
  { pt: "/pt/estudos", en: "/en/studies" },
  { pt: "/pt/contato", en: "/en/contact" },
] as const;

const pathOf = (href: string | null) => (href ? new URL(href).pathname : null);

async function headLinks(page: Page) {
  const alternates = await page
    .locator('head link[rel="alternate"][hreflang]')
    .evaluateAll((links) => links.map((l) => [l.getAttribute("hreflang"), l.getAttribute("href")] as const));
  const canonical = await page.locator('head link[rel="canonical"]').getAttribute("href");
  return { alternates: Object.fromEntries(alternates.map(([lang, href]) => [lang, pathOf(href)])), canonical };
}

for (const entry of pages) {
  for (const locale of ["pt", "en"] as const) {
    const path = entry[locale];

    test(`${path}: canonical, hreflang (pt-BR, en, x-default) e Open Graph no <head>`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);

      const { alternates, canonical } = await headLinks(page);
      expect(pathOf(canonical)).toBe(path);
      expect(alternates).toEqual({ "pt-BR": entry.pt, en: entry.en, "x-default": entry.pt });
      // Uma única fonte de hreflang: nada de header Link do next-intl com valores diferentes.
      expect(response?.headers()["link"] ?? "").not.toContain("hreflang");

      await expect(page.locator('head meta[property="og:url"]')).toHaveAttribute("content", new RegExp(`${path}$`));
      await expect(page.locator('head meta[property="og:locale"]')).toHaveAttribute(
        "content",
        locale === "pt" ? "pt_BR" : "en_US",
      );
      const ogImage = await page.locator('head meta[property="og:image"]').first().getAttribute("content");
      expect(pathOf(ogImage)).toBe(`/${locale}/opengraph-image/default`);
    });
  }

  test(`${entry.pt} ↔ ${entry.en}: hreflang recíproco`, async ({ page }) => {
    await page.goto(entry.pt);
    const fromPt = await headLinks(page);
    await page.goto(entry.en);
    const fromEn = await headLinks(page);
    expect(fromPt.alternates).toEqual(fromEn.alternates);
  });
}

test("imagem Open Graph por idioma", async ({ request }) => {
  for (const locale of ["pt", "en"]) {
    const response = await request.get(`/${locale}/opengraph-image/default`);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe("image/png");
  }
});

test("JSON-LD Person na Home", async ({ page }) => {
  await page.goto("/pt");
  const json = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(JSON.parse(json ?? "{}")).toMatchObject({ "@type": "Person", name: "Guilherme Martins Bezerra" });
});

test("sitemap.xml com alternates em cada URL", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const xml = await response.text();
  for (const entry of pages) {
    for (const path of [entry.pt, entry.en]) expect(xml).toMatch(new RegExp(`<loc>[^<]*${path}</loc>`));
  }
  const urls = xml.match(/<url>/g)?.length ?? 0;
  expect(xml.match(/hreflang="x-default"/g)?.length).toBe(urls);
});

test("robots.txt aponta para o sitemap e bloqueia a página do design system", async ({ request }) => {
  const text = await (await request.get("/robots.txt")).text();
  expect(text).toMatch(/Sitemap: \S+\/sitemap\.xml/);
  expect(text).toContain("Disallow: /pt/design");
});

test("manifest.webmanifest", async ({ request }) => {
  const response = await request.get("/manifest.webmanifest");
  expect(response.status()).toBe(200);
  expect(await response.json()).toMatchObject({ name: "Guilherme Martins Bezerra", start_url: "/" });
});
