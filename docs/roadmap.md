# Roadmap

Cada task é uma [issue](https://github.com/Guilherme-Martins-Dev/portfolio/issues) agrupada por etapa nos [milestones](https://github.com/Guilherme-Martins-Dev/portfolio/milestones).

- **`agente`:** a routine "Portfólio: próxima task" pega uma por execução (seg a sex, 8h de Brasília) e abre um PR.
- **`manual`:** dependem de você.

Uma issue só é liberada quando todas as listadas em "Depende de" estão fechadas, ou seja, quando os PRs delas foram mergeados.

> **Exceção de hoje (15/11/2026):** a produção está liberada até as **8h de Brasília (11h UTC)**. Nesse período o agente pode trabalhar em mais de uma issue em sequência, sempre um PR por issue e respeitando o "Depende de". Depois das 8h volta o padrão acima: uma task por execução da routine.

## 0. Pesquisa ✅ (15/11/2026)

O levantamento está em [pesquisa/](pesquisa/) e as decisões em [decisoes.md](decisoes.md).

## 1. Branding

| # | Task | Tipo | Depende de |
|---|---|---|---|
| #1 | Briefing e 3 direções de símbolo | manual | — |
| #2 | Logomarca final e versões | manual | #1 |
| #3 | Fechar a tipografia (P05) | manual | — |
| #4 | Sessão de foto profissional | manual | — |

## 2. UI/UX e protótipo

| # | Task | Tipo | Depende de |
|---|---|---|---|
| #5 | MagicPath: corrigir âncoras e scrollytelling | manual | — |
| #6 | Storyboard do scroll ([`docs/storyboard.md`](storyboard.md)) | agente | — |

## 3. Arquitetura e design system

| # | Task | Tipo | Depende de |
|---|---|---|---|
| #7 | Scaffold Next.js 16 + TS + Tailwind v4 | agente | — |
| #8 | Design tokens, fontes, temas + shadcn/ui | agente | #7 |
| #9 | next-intl (PT/EN) | agente | #7 |
| #10 | Conteúdo tipado (Zod) + indicadores | agente | #7 |
| #11 | Estudos de caso em MDX (Velite) | agente | #10 |
| #12 | Vitest + Playwright + CI | agente | #7 |
| #13 | Repositórios do GitHub com revalidação | agente | #10 |

## 4. Desenvolvimento

| # | Task | Tipo | Depende de |
|---|---|---|---|
| #14 | Layout base e navegação por âncoras | agente | #8, #9 |
| #15 | Home: Hero, Sobre e Indicadores | agente | #14, #10 |
| #16 | Home: Projetos, Trajetória/Eventos, Contato | agente | #15 |
| #17 | Páginas /projetos e /projetos/[slug] | agente | #11, #14 |
| #18 | Páginas Sobre, Experiência, Eventos, Estudos, Contato | agente | #14, #10 |
| #19 | Lenis + GSAP + movimento reduzido | agente | #14 |
| #20 | Cena 3D do Hero (R3F) | agente | #15, #19 |
| #21 | Coreografia de scroll da Home | agente | #16, #19, #6 |
| #22 | Grafo de competências | agente | #20 |
| #23 | Conteúdo real (textos, datas, links, imagens) | manual | #10 |

## 5. Refinamento e publicação

| # | Task | Tipo | Depende de |
|---|---|---|---|
| #24 | SEO multilíngue | agente | #17, #18 |
| #25 | Auditoria de acessibilidade e Core Web Vitals | agente | #20, #21 |
| #26 | Formulário de contato | agente | #18 |
| #27 | Vercel Analytics + Speed Insights | agente | #14 |
| #28 | Domínio + Cloudflare DNS + Vercel | manual | — |
| #29 | Variáveis de ambiente na Vercel | manual | #28 |
