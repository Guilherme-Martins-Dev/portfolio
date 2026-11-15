import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";

import { routing } from "./routing";

export default getRequestConfig(async ({ locale }) => {
  // `locale` só vem preenchido quando é passado explicitamente (ex.: getTranslations({ locale })).
  // No caso comum, o locale sai do segmento [locale] via next/root-params.
  const requested = locale ?? (await rootLocale());
  if (!hasLocale(routing.locales, requested)) notFound();

  return {
    locale: requested,
    messages: (await import(`../messages/${requested}.json`)).default,
  };
});
