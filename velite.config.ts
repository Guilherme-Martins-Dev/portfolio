import { defineCollection, defineConfig, s } from "velite";

/**
 * Estudos de caso em MDX, um arquivo por idioma: src/content/projects/<slug>.<locale>.mdx
 * O `<slug>` precisa existir em src/content/projects.ts (conferido nos testes).
 * Arquivos que começam com "_" (como o _modelo.mdx) são ignorados.
 */
const locales = ["pt", "en"] as const;

const caseStudies = defineCollection({
  name: "CaseStudy",
  pattern: ["projects/**/*.mdx", "!projects/**/_*.mdx"],
  schema: s
    .object({
      title: s.string().min(1),
      /** Resumo de uma frase (TL;DR, 02-conteudo §2.2). */
      summary: s.string().min(1),
      /** Papel do Guilherme no projeto. */
      role: s.string().min(1).optional(),
      /** Rascunho: aparece no `next dev`, nunca no build de produção. */
      draft: s.boolean().default(false),
      updatedAt: s.isodate().optional(),
      path: s.path(),
      body: s.mdx(),
    })
    .transform((data, { addIssue }) => {
      // path = "projects/<slug>.<locale>"
      const match = data.path.match(/^projects\/([a-z0-9-]+)\.([a-z]+)$/);
      const locale = match?.[2] as (typeof locales)[number] | undefined;
      if (!match || !locale || !locales.includes(locale)) {
        addIssue({ code: "custom", message: `Nome de arquivo inválido "${data.path}.mdx": use <slug>.pt.mdx ou <slug>.en.mdx` });
        return { ...data, slug: "", locale: "pt" as const };
      }
      return { ...data, slug: match[1], locale };
    }),
});

export default defineConfig({
  root: "src/content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { caseStudies },
  mdx: {
    // Sem plugins por enquanto; realce de sintaxe pode entrar depois (rehype-pretty-code).
  },
});
