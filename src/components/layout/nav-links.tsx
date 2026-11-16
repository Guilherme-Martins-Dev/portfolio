import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { MENU_SECTIONS, SITE_PAGES } from "./sections";

const linkClass =
  "rounded-sm text-foreground underline-offset-4 outline-none hover:text-link hover:underline focus-visible:ring-[3px] focus-visible:ring-ring";

/**
 * Âncoras das seções da Home. O href inclui a Home do idioma atual (`/pt#sobre`, `/en#sobre`),
 * então o link funciona também a partir das páginas internas.
 */
type ListProps = { className?: string; "aria-labelledby"?: string };

export function SectionLinks({ className, ...aria }: ListProps) {
  const t = useTranslations("Navigation");
  return (
    <ul className={className} {...aria}>
      {MENU_SECTIONS.map((section) => (
        <li key={section.id}>
          <Link href={{ pathname: "/", hash: section.id }} className={linkClass}>
            {t(section.label)}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function PageLinks({ className, linkClassName, ...aria }: ListProps & { linkClassName?: string }) {
  const t = useTranslations("Navigation");
  return (
    <ul className={className} {...aria}>
      {SITE_PAGES.map((page) => (
        <li key={page.pathname}>
          <Link href={page.pathname} className={cn(linkClass, linkClassName)}>
            {t(page.label)}
          </Link>
        </li>
      ))}
    </ul>
  );
}
