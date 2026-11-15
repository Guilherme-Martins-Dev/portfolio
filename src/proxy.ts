import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Tudo, menos api, trpc, _next, _vercel e caminhos com ponto (arquivos estáticos).
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
