"use client";

import { Suspense, type ComponentProps, type MouseEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter as useNextRouter } from "next/navigation";

import { HOME_SECTIONS } from "@/components/layout/sections";
import { Link, getPathname, usePathname } from "@/i18n/navigation";
import { htmlLang, routing } from "@/i18n/routing";

type Href = ComponentProps<typeof Link>["href"];

/** Folga abaixo do cabeçalho fixo para decidir qual seção está "em curso". */
const SECTION_OFFSET = 120;

/**
 * Seção da Home em curso: a última cujo topo já passou do cabeçalho. Fora da Home (sem as
 * seções) devolve `undefined`. Só roda em evento de clique, nunca no render.
 */
function currentSectionId(): string | undefined {
  let current: string | undefined;
  for (const { id } of HOME_SECTIONS) {
    // O Next mantém a página anterior escondida no DOM, com os mesmos ids: só vale a visível.
    const el = [...document.querySelectorAll<HTMLElement>(`section#${id}`)].find((node) => node.getClientRects().length > 0);
    if (!el) return current;
    if (el.getBoundingClientRect().top <= SECTION_OFFSET) current = id;
  }
  return current;
}

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
  const nextRouter = useNextRouter();

  // Troca de idioma preserva a seção atual (briefing, fase 0). Sem JS ou com Cmd/Ctrl+clique,
  // o link normal continua valendo e leva ao topo da mesma página.
  function keepSection(event: MouseEvent<HTMLAnchorElement>, locale: (typeof routing.locales)[number]) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const hash = currentSectionId();
    if (!hash || locale === current) return;
    event.preventDefault();
    // O router do next-intl descarta o hash; a URL já localizada vai direto ao router do Next.
    const target = typeof href === "string" ? { pathname: href } : href;
    const path = getPathname({ href: target as Parameters<typeof getPathname>[0]["href"], locale });
    nextRouter.push(`${path}#${hash}`);
  }

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
                onClick={(event) => keepSection(event, locale)}
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
