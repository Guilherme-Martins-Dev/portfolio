"use client";

import { Suspense, type ComponentProps } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { Link, usePathname } from "@/i18n/navigation";
import { htmlLang, routing } from "@/i18n/routing";

type Href = ComponentProps<typeof Link>["href"];

/**
 * Seletor de idioma acessível: links reais (funcionam sem JS), com o nome de cada idioma
 * escrito na própria língua e `lang`/`hrefLang` corretos. Mantém a página atual,
 * inclusive os parâmetros dinâmicos (ex.: /pt/projetos/x ↔ /en/projects/x).
 *
 * O `Suspense` é necessário com Cache Components: em rotas dinâmicas o shell estático é
 * gerado sem os params, e `useParams` sem Suspense derruba o prerender. Enquanto isso,
 * o fallback aponta para a Home de cada idioma.
 */
export function LocaleSwitcher() {
  return (
    <Suspense fallback={<LocaleLinks href="/" />}>
      <CurrentPageLocaleLinks />
    </Suspense>
  );
}

function CurrentPageLocaleLinks() {
  const pathname = usePathname();
  const params = useParams();
  // O pathname interno vem do próprio roteamento; o cast só reconecta os params dinâmicos.
  return <LocaleLinks href={{ pathname, params } as Href} />;
}

function LocaleLinks({ href }: { href: Href }) {
  const t = useTranslations("LocaleSwitcher");
  const current = useLocale();

  return (
    <nav aria-label={t("label")}>
      <ul className="flex gap-3 text-sm">
        {routing.locales.map((locale) => {
          const isCurrent = locale === current;
          return (
            <li key={locale}>
              <Link
                href={href}
                locale={locale}
                lang={htmlLang[locale]}
                hrefLang={htmlLang[locale]}
                aria-current={isCurrent ? "true" : undefined}
                className={isCurrent ? "font-semibold underline underline-offset-4" : "hover:underline"}
              >
                {t(locale)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
