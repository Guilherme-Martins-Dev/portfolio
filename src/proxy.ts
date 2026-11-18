import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { routing } from "./i18n/routing";
import { unknownProjectLocale } from "./lib/project-routes";
import { NOT_FOUND_SLUG } from "./lib/projects-catalog";

const handleI18n = createMiddleware(routing);

/**
 * Com Cache Components, um slug fora do generateStaticParams é renderizado sob demanda e o
 * notFound() da página chega depois do shell, com HTTP 200 + noindex ("soft 404"). O status de
 * uma resposta reescrita no proxy é ignorado, então /projetos/<slug-desconhecido> (e
 * /en/projects/...) é reescrito para o slug reservado NOT_FOUND_SLUG, pré-renderizado como 404 no
 * build. Os slugs de projects.ts também são pré-renderizados (os sem estudo de caso publicado, como 404).
 */
export default function proxy(request: NextRequest) {
  const locale = unknownProjectLocale(request.nextUrl.pathname);
  if (locale) {
    const url = request.nextUrl.clone();
    // Caminho interno (pastas em app/[locale]), não o traduzido.
    url.pathname = `/${locale}/projetos/${NOT_FOUND_SLUG}`;
    return NextResponse.rewrite(url);
  }
  return handleI18n(request);
}

export const config = {
  // Tudo, menos api, trpc, _next, _vercel e caminhos com ponto (arquivos estáticos).
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
