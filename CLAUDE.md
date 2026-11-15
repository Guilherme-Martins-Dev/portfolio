# Regras do repositório

Portfólio pessoal e bilíngue (PT/EN) de Guilherme Martins Bezerra. Antes de qualquer task, leia [docs/decisoes.md](docs/decisoes.md) e o arquivo de [docs/pesquisa/](docs/pesquisa/) ligado à task.

## Fluxo de trabalho

- Cada task é uma issue no GitHub. Label `agente` = pode ser feita por um agente; `manual` = depende do Guilherme (não mexa).
- Trabalhe em uma branch `task/<número-da-issue>-<slug>` a partir de `main` e abra **um PR por issue**, com `Closes #<número>` no corpo.
- Nunca faça push direto em `main`, merge de PR nem force push.
- Se a task depender de uma decisão ainda pendente (P01–P06 em `docs/decisoes.md`), use a recomendação da pesquisa e registre a escolha no PR. Se ela depender de algo que só o Guilherme tem (foto, textos reais, logomarca), deixe `TODO(guilherme): ...` no código e diga isso no PR.
- Commits e PRs **sem** `Co-Authored-By: Claude` e sem a linha "Generated with Claude Code".
- Mensagens de commit em português, no formato `tipo(escopo): descrição` (feat, fix, docs, chore, test, refactor).

## Stack (decidida)

Next.js 16 (App Router, `src/`) · TypeScript estrito · Tailwind v4 (`@theme`) · shadcn/ui · Motion (`motion/react`) · next-intl 4 com `src/proxy.ts` e `app/[locale]` · Zod · Velite para MDX · R3F 9 + Drei · GSAP 3 + ScrollTrigger (`@gsap/react`) · Lenis · Vitest + Playwright · pnpm.

## Regras de conteúdo e qualidade

- Só fatos reais. Não invente projetos, datas, números, empresas ou depoimentos; campo vazio não aparece na interface.
- Indicadores da Home são calculados dos dados em `src/content/`, nunca digitados.
- Texto: use os tokens de contraste validados (`#A66BE0` para roxo no escuro, `#007A8C` para ciano no claro). Ver [05-marca](docs/pesquisa/05-marca.md).
- Toda animação respeita `prefers-reduced-motion`; o 3D é carregado sob demanda e tem fallback 2D.
- Nunca versione segredos. Variáveis novas entram em `.env.example` sem valor.

## Antes de abrir o PR

`pnpm lint && pnpm typecheck && pnpm test && pnpm build` precisam passar (depois que o scaffold existir). Diga no PR o que foi verificado e o que não foi.
