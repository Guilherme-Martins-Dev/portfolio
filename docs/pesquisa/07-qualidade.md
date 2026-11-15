# 7. Qualidade: SEO, performance, acessibilidade, contato e analytics

> Pesquisa de 15/11/2026; fontes em [fontes.md](fontes.md).

## 7.1 SEO multilíngue

- **hreflang** via Metadata API: `alternates.languages` no `generateMetadata` do `[locale]/layout`, com `pt-BR`, `en` e `x-default`, e um `canonical` por idioma.
- **Sitemap** em `app/sitemap.ts` com `alternates.languages` para cada URL (o recurso nativo dispensa `next-sitemap`).
- `robots.ts`, `manifest.ts`, **imagens OG geradas por idioma** (`opengraph-image.tsx`) e dados estruturados `Person` e `CreativeWork` (JSON-LD), padrão já usado em um portfólio para cliente.
- Os erros de hreflang **não aparecem em lugar nenhum**: conferir o `<head>` renderizado (teste Playwright que lê as `<link rel="alternate">`).
- O conteúdo principal vem em **HTML no servidor**; a cena 3D é decorativa e não carrega informação.

## 7.2 Core Web Vitals (limites inalterados em 2026)

| Métrica | Bom | Ruim | Risco num site com 3D |
|---|---|---|---|
| **LCP** | ≤ 2,5 s | > 4,0 s | Assets 3D baixando antes do conteúdo. Mitigação: o LCP deve ser o **título em HTML**, não o canvas |
| **INP** | ≤ 200 ms | > 500 ms | Compilação de shaders e tarefas longas no main thread. Mitigação: inicializar a cena depois do primeiro paint e usar `startTransition` |
| **CLS** | ≤ 0,1 | > 0,25 | Canvas e fontes sem dimensão. Mitigação: placeholder com tamanho fixo e `next/font` |

Medidos no **percentil 75** de visitas reais. Monitorar com o Speed Insights da Vercel e o Lighthouse no CI.

## 7.3 Acessibilidade

- `prefers-reduced-motion` respeitado em GSAP, Lenis, Motion e 3D (ver [04](04-3d-e-scroll.md#46-acessibilidade-do-movimento)).
- Contraste AA com os tokens ajustados (ver [05](05-marca.md#53-paleta-e-contraste-wcag)).
- Navegação por teclado com foco visível; **as âncoras precisam de `id`** (problema do protótipo atual).
- Canvas com `aria-hidden="true"`; o conteúdo equivalente fica em HTML.
- Hierarquia semântica: um `h1` por página, landmarks (`header`, `nav`, `main`, `footer`) e `lang` correto por locale.
- O seletor PT/EN tem que ser acessível (nomes "Português" e "English", não só bandeiras).
- Teste automatizado com `@axe-core/playwright`.

## 7.4 Formulário de contato (pendente P03)

Padrão em 2026: **Server Action + `useActionState` + Zod + Resend (+ React Email)**.

- O Resend exige um **domínio verificado** para enviar em produção (depende do P01).
- Antispam: **Cloudflare Turnstile** (grátis, sem a fricção do reCAPTCHA), com o token validado no servidor, mais um campo honeypot e rate limit por IP.
- Alternativa mais simples para a v1: só links (e-mail, LinkedIn, GitHub) e o formulário na v2.

## 7.5 Analytics (pendente P04)

| | Vercel Web Analytics | Umami |
|---|---|---|
| Setup | Instantâneo (`@vercel/analytics`) | Script + instância (cloud ou self-host) |
| Custo | Incluído no Hobby, com limite de eventos | Cloud grátis até ~10 mil eventos/mês; self-host grátis |
| Privacidade | Sem cookies | Sem cookies, código aberto (MIT) |
| Prende à Vercel | Sim | Não |

**Recomendação:** começar com o **Vercel Web Analytics + Speed Insights** (zero configuração) e migrar para o Umami se precisar de eventos personalizados ou sair da Vercel.
