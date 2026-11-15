# Registro de decisões

Cada decisão traz a origem (**PDF**, o planejamento original, ou **Pesquisa**, este levantamento de 15/11/2026) e o motivo.

## Produto

| # | Decisão | Origem | Motivo |
|---|---|---|---|
| D01 | O site é uma plataforma de apresentação profissional, não um currículo online | PDF | Precisa responder a três perguntas: quem sou, o que já construí e o que estou fazendo agora |
| D02 | Posicionamento híbrido (carreira + técnica) | PDF | O público inclui recrutadores, clientes e outros desenvolvedores |
| D03 | Seis áreas: Sobre, Experiência, Projetos, Eventos (participação e organização), Estudos, Contato | PDF | Cobrem toda a trajetória |
| D04 | Home em narrativa híbrida: Hero → Sobre → Indicadores → Projetos → Trajetória/Eventos → Contato | PDF | Primeiro a pessoa, depois as provas |
| D05 | Indicadores calculados a partir dos dados cadastrados, nunca números decorativos | PDF | Adicionar um projeto ou evento atualiza os números sozinho |
| D06 | Seção "Em desenvolvimento", separada dos projetos concluídos | PDF | Mostra iniciativas em andamento (Questum, Chatbot WhatsApp, NeuroSim 3D...) |
| D07 | Cada projeto principal tem página própria de estudo de caso | PDF + Pesquisa | Recrutadores preferem de 3 a 5 projetos aprofundados a muitos rasos ([02-conteudo](pesquisa/02-conteudo.md)) |
| D08 | Regra do conteúdo: só fatos reais; campo vazio não aparece | Pesquisa | Padrão já validado em um portfólio Next.js feito para cliente |

## Identidade

| # | Decisão | Origem | Motivo |
|---|---|---|---|
| D09 | Marca "Guilherme Martins Bezerra" com logomarca própria; o GMB é provisório | PDF | Identidade pessoal e profissional |
| D10 | Paleta-base #0B132B, #00E5FF e #7B2CBF, com superfícies neutras | PDF | Visual tecnológico sem parecer um painel de monitoramento |
| D11 | Para texto, usar tons ajustados: roxo `#A66BE0` sobre o azul-marinho e ciano `#007A8C` sobre branco | Pesquisa | `#7B2CBF` sobre `#0B132B` dá 2,59:1 e `#00E5FF` sobre branco dá 1,54:1; os dois reprovam no WCAG AA ([05-marca](pesquisa/05-marca.md)) |
| D12 | Tipografia: serifa editorial nos títulos + sans neutra no corpo + mono nos elementos técnicos | PDF + Pesquisa | O PDF pede editorial + mono; a pesquisa sugeriu Instrument Serif/Fraunces + Geist + Geist Mono |
| D13 | Foto profissional integrada à composição | PDF | Identidade pessoal |

## Técnica

| # | Decisão | Origem | Motivo |
|---|---|---|---|
| D14 | Next.js 16 (App Router, 16.4.6 no npm em 15/11/2026) + TypeScript | PDF + Pesquisa | Linha estável atual, com lançamentos de segurança mensais |
| D15 | i18n com next-intl 4.x em `app/[locale]`; o roteamento fica em `src/proxy.ts`, que substituiu o `middleware.ts` no Next 16 | PDF + Pesquisa | Doc oficial do next-intl ([03-stack](pesquisa/03-stack.md)) |
| D16 | Tailwind v4 (configuração em CSS com `@theme`) + shadcn/ui | PDF + Pesquisa | O shadcn/ui já suporta Tailwind v4 e React 19 |
| D17 | Motion (`motion/react`) para microinterações; GSAP + ScrollTrigger para a coreografia do scroll | PDF + Pesquisa | O GSAP inteiro é gratuito desde a compra pela Webflow, inclusive SplitText e ScrollSmoother |
| D18 | 3D com React Three Fiber v9 + Drei, só nos momentos de destaque, carregado sob demanda | PDF + Pesquisa | Economia de GPU em celulares; boas práticas oficiais do R3F |
| D19 | Lenis para smooth scroll, sincronizado com o ticker do GSAP | Pesquisa | Padrão de ITom, Cartier e outros sites premiados |
| D20 | Toda animação respeita `prefers-reduced-motion` e o site tem fallback 2D sem WebGL | PDF + Pesquisa | Acessibilidade e alcance |
| D21 | Conteúdo em TS tipado com Zod; estudos de caso em MDX (Velite ou `@next/mdx`, a decidir no scaffold) | PDF + Pesquisa | Validação no build; o Contentlayer está abandonado |
| D22 | Testes com Vitest (unidade) + Playwright (e2e e acessibilidade) | PDF | Qualidade verificável |

## Infra

| # | Decisão | Origem | Motivo |
|---|---|---|---|
| D23 | Vercel (plano Hobby) | PDF + Pesquisa | Um portfólio pessoal sem venda de serviços cabe no uso não comercial do Hobby |
| D24 | DNS na Cloudflare com os registros da Vercel em **DNS only** (nuvem cinza) | PDF + Pesquisa | A própria Vercel desaconselha o proxy (KB atualizada em 13/11/2026) |
| D25 | Repositório público no GitHub, com `.env.example` e push protection | PDF + Pesquisa | O push protection é gratuito e vem ligado por padrão em repositórios públicos |

## Pendentes

| # | Decisão | Opções | Onde está a análise |
|---|---|---|---|
| P01 | Domínio | `.com` ou `.dev` (Cloudflare Registrar, a preço de custo) × `.com.br` (Registro.br, ~R$ 40/ano) | [06-infra-dominio](pesquisa/06-infra-dominio.md) |
| P02 | Camada de MDX | Velite × `@next/mdx` | [03-stack](pesquisa/03-stack.md) |
| P03 | Formulário de contato | Server Action + Resend + Zod + Turnstile × só links/e-mail | [07-qualidade](pesquisa/07-qualidade.md) |
| P04 | Analytics | Vercel Web Analytics × Umami | [07-qualidade](pesquisa/07-qualidade.md) |
| P05 | Fontes definitivas | Instrument Serif ou Fraunces + Geist + Geist Mono | [05-marca](pesquisa/05-marca.md) |
| P06 | Conceito da cena 3D do Hero | Núcleo digital/rede neural (recomendado) × outros | [04-3d-e-scroll](pesquisa/04-3d-e-scroll.md) |
