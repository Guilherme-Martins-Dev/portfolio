import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { locale as rootLocale } from "next/root-params";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MAIN_CONTENT_ID } from "@/components/layout/sections";
import { SkipLink } from "@/components/layout/skip-link";
import { themeScript } from "@/components/shared/theme-script";
import { VercelInsights } from "@/components/shared/vercel-insights";
import { reduceMotionScript } from "@/motion/preference";
import { SceneLayer } from "@/scene/SceneLayer";
import { htmlLang, routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/seo";
import "../globals.css";

// Tipografia de 05-marca §5.2 (opção A): serifa editorial nos títulos, Geist no corpo, Geist Mono no técnico.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  // metadataBase: as URLs relativas (imagem OG gerada por idioma) viram absolutas (#24).
  return { metadataBase: new URL(siteUrl()), title: t("title"), description: t("description") };
}

export default async function LocaleLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await rootLocale();
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html
      lang={htmlLang[locale]}
      data-theme="light"
      suppressHydrationWarning
      className={`${instrumentSerif.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: reduceMotionScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Único canvas WebGL do projeto: montado aqui, uma vez, atrás do conteúdo (briefing). */}
        <SceneLayer />
        <NextIntlClientProvider>
          <SkipLink />
          <SiteHeader />
          {/* tabIndex -1: o skip link move o foco para cá, não só a rolagem. */}
          <main id={MAIN_CONTENT_ID} tabIndex={-1} className="flex flex-1 flex-col outline-none">
            {children}
          </main>
          <SiteFooter />
        </NextIntlClientProvider>
        <VercelInsights />
      </body>
    </html>
  );
}
