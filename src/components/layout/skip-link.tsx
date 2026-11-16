import { useTranslations } from "next-intl";

import { MAIN_CONTENT_ID } from "./sections";

/** Primeiro elemento focável da página: só aparece quando recebe foco pelo teclado. */
export function SkipLink() {
  const t = useTranslations("Layout");
  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className="sr-only rounded-md bg-background px-4 py-2 text-sm font-medium text-foreground shadow-lg outline-none focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus-visible:ring-[3px] focus-visible:ring-ring"
    >
      {t("skipToContent")}
    </a>
  );
}
