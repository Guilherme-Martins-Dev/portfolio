# Portfólio — Guilherme Martins Bezerra

Portfólio web pessoal e bilíngue (PT/EN): uma plataforma de apresentação profissional que conta quem eu sou, o que já construí e o que estou construindo agora. Ela também serve de demonstração técnica, com 3D, animações orientadas à rolagem e código aberto.

> **Fase atual:** arquitetura (nov/2026). O projeto Next.js já está criado; as páginas do site ainda não.

## Decisões fechadas

| Item | Decisão |
|---|---|
| Identidade | Guilherme Martins Bezerra, com logomarca própria (o monograma GMB é provisório) |
| Posicionamento | Híbrido: trajetória profissional + capacidade técnica |
| Interface | Profissional + tecnológica (editorial com elementos digitais) |
| Idiomas | Português (`/pt`) e inglês (`/en`) |
| Home | Narrativa híbrida: Hero → Sobre → Indicadores → Projetos → Trajetória/Eventos → Contato |
| 3D e scroll | Estilo digital/cybernetic, intensidade imersiva, navegação híbrida (cinematográfica + parallax) |
| Stack | Next.js 16 (App Router) · TypeScript · Tailwind v4 · shadcn/ui · Motion · next-intl · MDX · Zod · R3F + Drei · GSAP + ScrollTrigger · Lenis |
| Conteúdo | Arquivos TS/MDX tipados, preparados para um CMS no futuro |
| Hospedagem | Vercel, com DNS na Cloudflare (registros "DNS only") |
| Repositório | Público no GitHub |

Detalhes e justificativas em [docs/decisoes.md](docs/decisoes.md).

## Pesquisa

| # | Eixo | Arquivo |
|---|---|---|
| 1 | Referências visuais e de estrutura | [01-referencias.md](docs/pesquisa/01-referencias.md) |
| 2 | Conteúdo: o que mostrar e como | [02-conteudo.md](docs/pesquisa/02-conteudo.md) |
| 3 | Stack técnica (versões de nov/2026) | [03-stack.md](docs/pesquisa/03-stack.md) |
| 4 | 3D e animações de scroll | [04-3d-e-scroll.md](docs/pesquisa/04-3d-e-scroll.md) |
| 5 | Marca pessoal, tipografia e cores | [05-marca.md](docs/pesquisa/05-marca.md) |
| 6 | Infraestrutura, domínio e repositório público | [06-infra-dominio.md](docs/pesquisa/06-infra-dominio.md) |
| 7 | Qualidade: SEO, performance, acessibilidade, contato e analytics | [07-qualidade.md](docs/pesquisa/07-qualidade.md) |
| 8 | Prototipação e as correções do protótipo atual | [08-prototipacao.md](docs/pesquisa/08-prototipacao.md) |
| — | Todas as fontes consultadas | [fontes.md](docs/pesquisa/fontes.md) |
| — | Versão visual da pesquisa (HTML) | [pesquisa.html](docs/pesquisa/pesquisa.html) |

Também em [docs/](docs/): o [roadmap](docs/roadmap.md). As tasks são acompanhadas nas [issues](https://github.com/Guilherme-Martins-Dev/portfolio/issues), agrupadas por etapa nos milestones.

## Como rodar

Pré-requisitos: Node 24 (veja `.nvmrc`) e pnpm 10 (`corepack enable` usa a versão de `packageManager`).

```bash
pnpm install       # instala as dependências
pnpm dev           # servidor de desenvolvimento em http://localhost:3000
pnpm lint          # ESLint
pnpm typecheck     # gera os tipos de rota (next typegen) e roda tsc --noEmit
pnpm test          # placeholder até a issue #12 (Vitest + Playwright)
pnpm build         # build de produção
pnpm start         # serve o build
```

Variáveis de ambiente: copie `.env.example` para `.env.local` quando houver alguma. Nunca versione `.env*`.

`NEXT_PUBLIC_SITE_URL` (ex.: `https://seu-dominio`) define a URL base do canonical, do hreflang, do `sitemap.xml`, do `robots.txt` e das imagens Open Graph. Em produção ela precisa estar definida na Vercel; sem ela as URLs saem com `http://localhost:3000`.

## Analytics

O site usa o [Vercel Web Analytics](https://vercel.com/docs/analytics) e o [Speed Insights](https://vercel.com/docs/speed-insights) (decisão P04), montados em `src/components/shared/vercel-insights.tsx`. Eles só carregam no deploy de **produção** da Vercel (`VERCEL_ENV=production`): nada é enviado em `pnpm dev`, nos previews nem num `pnpm start` local.

Para desligar:

- **Sem mexer no código:** defina `DISABLE_VERCEL_INSIGHTS=1` nas variáveis de ambiente do projeto na Vercel e faça um novo deploy (o layout é pré-renderizado, então o valor vale a partir do build).
- **Só a coleta:** desative Analytics e/ou Speed Insights na aba do projeto no painel da Vercel.
- **De vez:** remova `<VercelInsights />` de `src/app/[locale]/layout.tsx` e os pacotes `@vercel/analytics` e `@vercel/speed-insights`.

## Licença

O **código** deste repositório está sob a licença MIT ([LICENSE](LICENSE)). O **conteúdo** (textos, fotos, marca e identidade visual de Guilherme Martins Bezerra) tem todos os direitos reservados e não pode ser reutilizado sem autorização.
