# 3. Stack técnica (estado em 15/11/2026)

> Versões consultadas com `npm view <pacote> version` em 15/11/2026. As fontes estão em [fontes.md](fontes.md).

## 3.1 Versões atuais

| Pacote | Versão | Observação |
|---|---|---|
| `next` | **16.4.6** | O Next 16 saiu em 21/10/2025; o 16.4 (06/10/2026) trouxe lazy compilation, saída menor do Turbopack, React 19.3 e melhorias em Cache Components. Há **lançamentos de segurança mensais**, o último em 03/11/2026 |
| `next-intl` | **4.15.1** | Linha 4.x |
| `tailwindcss` | **4.3.5** | Configuração em CSS (`@theme`), sem `tailwind.config.js` |
| `motion` | **14.14.0** | O antigo Framer Motion; importar de `motion/react` |
| `three` | **0.187.0** | |
| `@react-three/fiber` | **9.8.2** | R3F v9 (React 19) |
| `@react-three/drei` | **10.7.9** | |
| `gsap` | **3.15.1** | Gratuito por completo, inclusive os plugins (ver 04) |
| `lenis` | **1.3.27** | Tem `lenis/react` (`ReactLenis`, `useLenis`) |
| `zod` | **4.6.7** | |
| Node local | 24.18.1 | |

## 3.2 Next.js 16: o que muda para nós

- **`middleware.ts` virou `proxy.ts`.** Os guias de i18n antigos falam em middleware, e no Next 16 o arquivo é `src/proxy.ts`. O erro "Unable to find next-intl locale" depois de atualizar costuma vir do proxy ausente.
- `params`, `cookies()` e `headers()` são **assíncronos**.
- `next/root-params` vem ativo por padrão desde o **16.3**, o que simplifica o next-intl (ver 3.3).
- O Turbopack é o bundler padrão (dev e build). O blog oficial também divulgou ferramentas novas de **Bundle Analyzer** (28/10/2026), úteis para garantir que o three.js não caia no bundle principal.
- O `create-next-app` já gera um `AGENTS.md` (16.2), um bom lugar para as regras do projeto.

## 3.3 next-intl (estrutura oficial atual)

```
src/
├── proxy.ts            # export default createMiddleware(routing) + config.matcher
├── i18n/
│   ├── routing.ts      # defineRouting({ locales: ['pt','en'], defaultLocale: 'pt', pathnames? })
│   ├── navigation.ts   # createNavigation(routing) → Link, redirect, usePathname, useRouter, getPathname
│   └── request.ts      # getRequestConfig: locale via rootParams.locale(), hasLocale, notFound()
└── app/[locale]/layout.tsx  # + generateStaticParams → routing.locales.map(locale => ({locale}))
```

- O matcher ignora `api`, `trpc`, `_next`, `_vercel` e caminhos com ponto.
- **Renderização estática:** com `next/root-params`, basta o `generateStaticParams`. O `setRequestLocale` ficou como legado.
- **URLs traduzidas** (`/pt/sobre` × `/en/about`, como no PDF): use `pathnames` no `defineRouting`, documentado na página de configuração do next-intl.
- No `generateMetadata`, chamar `getTranslations({ locale, namespace })`.

## 3.4 Estilo e componentes

- **Tailwind v4 + shadcn/ui:** `npx shadcn@latest init` detecta o Next e adiciona `@import "shadcn/tailwind.css"`. Os tokens da marca ficam em `@theme`.
- **Motion:** use para microinterações, transições de layout e `AnimatePresence`. A coreografia longa de scroll fica com o GSAP.

## 3.5 Conteúdo tipado (TS + MDX)

| Opção | Prós | Contras |
|---|---|---|
| **`@next/mdx`** (oficial) | Zero dependência extra; exige `mdx-components.tsx` | Frontmatter sem schema; a tipagem fica por nossa conta |
| **Velite** | Valida o frontmatter no build com schema (estilo Zod) e gera tipos TS | Uma ferramenta a mais |
| **Content Collections** | Também valida e gera tipos | Menos citado |
| Contentlayer | — | **Abandonado.** Evitar |

**Recomendação:** dados estruturados (perfil, experiência, eventos, tecnologias) em `content/*.ts` validados com **Zod** (padrão já usado em um portfólio para cliente); estudos de caso em **MDX via Velite**, um arquivo `.pt.mdx`/`.en.mdx` por idioma. A migração futura para CMS (decisão "CMS futuro") só troca a fonte dos dados, mantendo os mesmos schemas.

## 3.6 Estrutura de pastas proposta

```
src/
├── app/[locale]/{page.tsx, sobre/, experiencia/, projetos/[slug]/, eventos/, estudos/, contato/}
├── components/{ui/, layout/, navigation/, shared/}
├── features/{profile/, experience/, projects/, events/, studies/, stats/}
├── three/{scenes/, objects/, shaders/}      # tudo que é WebGL, carregado sob demanda
├── motion/{gsap.ts, lenis-provider.tsx}     # registro único dos plugins
├── content/*.ts + content/projects/*.mdx
├── i18n/ · messages/{pt.json,en.json}
└── lib/{schemas.ts, stats.ts, github.ts}
```

## 3.7 Testes

- **Vitest:** schemas, cálculo dos indicadores (`stats.ts`) e utilitários.
- **Playwright:** navegação PT/EN, âncoras, formulário, `prefers-reduced-motion` (emulável) e acessibilidade com `@axe-core/playwright`.
