# Roadmap

Ordem herdada do planejamento original e ajustada pela pesquisa.

## 0. Pesquisa ✅ (15/11/2026)

O levantamento está em [pesquisa/](pesquisa/) e as decisões em [decisoes.md](decisoes.md).

## 1. Branding

- [ ] Briefing da marca: personalidade, palavras-chave e público
- [ ] Explorar 3 direções de símbolo (sem depender das iniciais; ver [05-marca](pesquisa/05-marca.md))
- [ ] Versões horizontal, vertical e reduzida, além de favicon e avatar
- [ ] Fechar tipografia (P05) e tokens de cor com contraste validado
- [ ] Sessão de foto profissional

## 2. UI/UX e protótipo

- [ ] Corrigir a estrutura do protótipo no MagicPath (ver [08-prototipacao](pesquisa/08-prototipacao.md))
- [ ] Storyboard do scroll: cada seção como uma cena com entrada, permanência e saída
- [ ] Versões desktop, tablet e celular, além da versão com movimento reduzido

## 3. Design system

- [ ] Tokens em três camadas (primitivo → semântico → componente)
- [ ] Componentes base: navegação, cards, linha do tempo, badges de status, seletor PT/EN
- [ ] Estados (hover, foco, desabilitado) e foco visível

## 4. Arquitetura

- [ ] `create-next-app` (Next 16) + TypeScript + Tailwind v4 + shadcn/ui
- [ ] next-intl com `[locale]`, `proxy.ts` e `generateStaticParams`
- [ ] Camada de conteúdo tipada (`content/*.ts` + Zod) e MDX (P02)
- [ ] Busca dos repositórios do GitHub com revalidação (padrão já usado em um portfólio para cliente)
- [ ] Vitest e Playwright configurados; CI no GitHub Actions

## 5. Desenvolvimento

- [ ] Home (seis seções) com indicadores calculados dos dados
- [ ] Páginas: Sobre, Experiência, Projetos e `/projetos/[slug]`, Eventos, Estudos, Contato
- [ ] Cena 3D do Hero (R3F), carregada sob demanda, com fallback 2D
- [ ] Coreografia do scroll (GSAP + ScrollTrigger + Lenis) e microinterações (Motion)

## 6. Refinamento e publicação

- [ ] SEO multilíngue (hreflang, sitemap, OG por idioma), acessibilidade e Core Web Vitals
- [ ] Comprar o domínio (P01), configurar a Cloudflare (DNS only) e a Vercel
- [ ] Publicar o repositório no GitHub (público) e fazer o deploy
