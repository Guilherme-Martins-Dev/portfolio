import { useTranslations } from "next-intl";

import { LocaleSwitcher } from "@/components/navigation/locale-switcher";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Link } from "@/i18n/navigation";
import { MobileMenu } from "./mobile-menu";
import { PageLinks, SectionLinks } from "./nav-links";

/**
 * Cabeçalho fixo (sticky) com altura `--header-height`, a mesma usada no
 * `scroll-margin-top` das seções. Marca provisória em texto até a logomarca (#2).
 */
export function SiteHeader() {
  const t = useTranslations("Navigation");
  const tLayout = useTranslations("Layout");

  return (
    <header className="sticky top-0 z-40 h-(--header-height) border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="relative mx-auto flex h-full w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* TODO(guilherme): trocar o texto pela logomarca quando a #2 entregar os SVGs. */}
        <Link
          href="/"
          className="truncate rounded-sm font-display text-xl leading-none outline-none focus-visible:ring-[3px] focus-visible:ring-ring sm:text-2xl"
        >
          Guilherme Martins Bezerra
        </Link>

        <nav aria-label={t("label")} className="hidden md:block">
          <SectionLinks className="flex items-center gap-6 text-sm" />
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <LocaleSwitcher />
          <ThemeToggle />
          <MobileMenu>
            <nav aria-label={tLayout("mobileMenu")} className="flex flex-col gap-6">
              <div>
                <p id="menu-secoes" className="mb-3 font-mono text-xs tracking-wider text-muted-foreground uppercase">
                  {tLayout("homeSections")}
                </p>
                <SectionLinks aria-labelledby="menu-secoes" className="flex flex-col gap-4 text-lg" />
              </div>
              <div className="border-t border-border pt-6">
                <p id="menu-paginas" className="mb-3 font-mono text-xs tracking-wider text-muted-foreground uppercase">
                  {tLayout("pages")}
                </p>
                <PageLinks aria-labelledby="menu-paginas" className="flex flex-col gap-3" />
              </div>
            </nav>
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
