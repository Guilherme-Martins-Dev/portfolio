import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

/** 404 dentro do layout do idioma (cabeçalho, rodapé e `lang` certos), para os notFound() das páginas. */
export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-start gap-6 px-4 py-24 sm:px-6">
      <h1 className="font-display text-5xl sm:text-6xl">{t("title")}</h1>
      <p className="text-lg text-muted-foreground">{t("description")}</p>
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        <li>
          <Link
            href="/"
            className="rounded-sm text-link underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring"
          >
            {t("home")}
          </Link>
        </li>
        <li>
          <Link
            href="/projetos"
            className="rounded-sm text-link underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring"
          >
            {t("projects")}
          </Link>
        </li>
      </ul>
    </div>
  );
}
