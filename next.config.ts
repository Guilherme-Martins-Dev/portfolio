import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Por padrão o plugin usa src/i18n/request.ts.
const withNextIntl = createNextIntlPlugin();

// No `next dev`, o Velite recompila os estudos de caso em MDX a cada mudança.
// Em build, typecheck e testes ele roda antes, pelos scripts do package.json (content:build).
if (process.argv.includes("dev") && !process.env.VELITE_STARTED) {
  process.env.VELITE_STARTED = "1";
  void import("velite").then((velite) => velite.build({ watch: true, clean: false }));
}

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
