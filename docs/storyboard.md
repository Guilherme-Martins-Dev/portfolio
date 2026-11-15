# Storyboard do scroll da Home

> Detalha os 7 capítulos sugeridos em [04-3d-e-scroll §4.8](pesquisa/04-3d-e-scroll.md#48-storyboard-sugerido-navegação-híbrida) como cenas com **entrada, permanência e saída**. É só especificação: o código vem nas issues #19 (Lenis + GSAP), #20 (cena 3D), #21 (coreografia) e #22 (grafo de competências).
>
> Conceito da cena 3D (P06, ainda pendente): segue a recomendação da pesquisa, **núcleo digital / rede de nós**. Se o Guilherme escolher outro conceito, os capítulos 1, 2, 5 e 7 mudam; os demais continuam valendo.

## 0. Regras que valem para todas as cenas

### 0.1 Uma técnica marcante só

A rede de nós do Hero é o fio condutor ([01-referencias](pesquisa/01-referencias.md)): nasce no Hero, fica ao fundo no Sobre, some durante as provas (Indicadores, Projetos), volta como grafo nas Competências e converge num ponto no Contato. Nenhum capítulo inventa um efeito novo fora desse vocabulário.

### 0.2 Quem faz o quê

| Camada | Ferramenta | Onde aparece |
|---|---|---|
| Cena 3D | R3F 9 + Drei (`three`) | Capítulos 1, 2, 5 e 7 |
| Coreografia (pin, scrub, timelines) | GSAP 3 + ScrollTrigger, via `useGSAP` | Todos os capítulos |
| Revelação de texto | GSAP SplitText | Capítulos 1 e 2 |
| Smooth scroll | Lenis, ligado ao ticker do GSAP ([§4.5](pesquisa/04-3d-e-scroll.md#45-lenis--scrolltrigger-padrão-de-integração)) | Global |
| Microinterações (hover, foco, layout) | Motion (`motion/react`) | Capítulos 4 e 7 |
| Profundidade sem WebGL | CSS 3D (`perspective`, `transform`) | Capítulo 4 |

### 0.3 Um canvas só, com "modos"

- **Um único `<Canvas>`** fixo atrás do conteúdo (`position: fixed`, `aria-hidden="true"`, `pointer-events: none` exceto no Hero), carregado com `next/dynamic(..., { ssr: false })` depois do primeiro paint. Evita criar vários contextos WebGL e mantém a rede contínua entre capítulos.
- Cada capítulo com 3D tem um **modo de cena** (`hero`, `about`, `skills`, `contact`). O ScrollTrigger de cada capítulo escreve o progresso (`0 → 1`) num store compartilhado; a cena lê esse valor no `useFrame` e interpola câmera, opacidade e posição dos nós.
- Nos capítulos sem 3D (3, 4 e 6) o canvas fica com opacidade 0 e **para de renderizar** (`frameloop="demand"`, sem `invalidate()`). O canvas também pausa quando a aba fica oculta (`visibilitychange`).
- O grafo de Competências (capítulo 5) reaproveita os mesmos nós instanciados, só reposicionados por área. Se na #22 isso se mostrar inviável, ele pode virar um segundo canvas carregado sob demanda quando a seção se aproxima (`rootMargin` de 1 viewport), mas nunca dois canvas ativos ao mesmo tempo.

### 0.4 Convenções de gatilho

- Cada capítulo é uma `<section id="...">` com `scroll-margin-top` igual à altura do cabeçalho (correção 2 de [08-prototipacao §8.3](pesquisa/08-prototipacao.md#83-o-que-corrigir-no-protótipo-atual-levantado-no-pdf)). Os ids abaixo são os do menu de âncoras (#14).
- Notação dos gatilhos: `start: "top top"` significa "quando o topo da seção encosta no topo da viewport". `end: "+=150%"` significa "150% da altura da viewport de rolagem depois do start".
- `scrub: true` só onde o movimento precisa seguir o dedo/roda; entradas pontuais usam `toggleActions` ou `once: true`.
- Pins: **no máximo 2 capítulos pinados no desktop** (Sobre e Trajetória) e **nenhum pin longo no celular**. Pins longos no toque brigam com a barra de endereço e com navegadores dentro de apps.
- O conteúdo de cada capítulo está **completo no HTML do servidor**. A animação só parte de um estado inicial visual; se o JS não carregar, tudo aparece no estado final.

### 0.5 Movimento reduzido e celular

| Situação | Detecção | Comportamento global |
|---|---|---|
| `prefers-reduced-motion: reduce` | `gsap.matchMedia()` ([§4.6](pesquisa/04-3d-e-scroll.md#46-acessibilidade-do-movimento)) + `useReducedMotion` do Motion | Lenis desligado; sem pin e sem scrub; todos os elementos já no estado final; canvas trocado por **imagem estática** (render da cena); hovers só com mudança de cor/borda, sem deslocamento |
| Botão "reduzir efeitos" no cabeçalho | Preferência salva (classe no `<html>`) | Mesmo efeito do `reduce`, escolhido pelo visitante |
| Sem WebGL | Teste de contexto antes de montar o canvas | Mesma imagem estática do `reduce` (fallback 2D), com as animações GSAP mantidas |
| Celular (`max-width: 767px`) | `gsap.matchMedia()` | Lenis sem suavizar o toque (o scroll nativo continua); pins trocados por revelações simples; canvas com metade dos nós e DPR menor (ver orçamento) |
| Abaixo do limite de FPS | `PerformanceMonitor` do Drei | Primeiro reduz o DPR; se continuar ruim, cai para a imagem estática |

### 0.6 Orçamento global (metas a medir na #25)

| Item | Desktop | Celular |
|---|---|---|
| Draw calls no frame (cena inteira) | ≤ 20 | ≤ 10 |
| Nós instanciados | ≤ 400 | ≤ 150 |
| DPR (`dpr` do Canvas, ajustado pelo `PerformanceMonitor`) | `[1, 2]` | `[1, 1.5]` |
| Modelos 3D (glTF) | Nenhum: geometria procedural | Nenhum |
| Texturas | ≤ 1 sprite de brilho, ≤ 32 KB | Igual |
| Chunk JS do 3D (three + R3F + Drei), gzip | ≤ 250 KB, carregado depois do primeiro paint | Igual |
| Imagem estática de fallback (AVIF/WebP) | ≤ 80 KB | ≤ 40 KB (versão menor via `srcset`) |
| Pós-processamento (bloom etc.) | Opcional, 1 passe no máximo | Nenhum |
| Raycasting (hover nos nós) | ≤ 30 vezes/s | Desligado (não há hover) |
| LCP | Título do Hero em HTML, nunca o canvas | Igual |

Esses números são metas de projeto, não medições: a #25 confere em celular intermediário e ajusta.

---

## 1. Hero (`#inicio`), cinematográfico

**Ideia:** o núcleo digital se monta no carregamento; no scroll, a câmera se afasta e a rede se abre para dar passagem ao Sobre.

| Fase | O que acontece | Ferramenta | Gatilho |
|---|---|---|---|
| Entrada | Título, apresentação e CTAs (HTML) aparecem em ~600 ms: linhas do título sobem com máscara, CTAs com fade. Em paralelo, os nós surgem do centro e as arestas se desenham em ~1,5 s | SplitText + timeline GSAP; R3F (`useFrame` interpolando escala/opacidade dos nós) | Carregamento: a timeline do texto roda no mount; a da rede roda quando o canvas termina de montar (o texto nunca espera o 3D) |
| Permanência | A rede gira bem devagar; o cursor move a câmera alguns graus (parallax). Nós próximos ao cursor acendem | R3F (câmera com amortecimento), raycasting limitado | Movimento do ponteiro, só enquanto o Hero está visível |
| Saída | A câmera recua e os nós se afastam do centro ("a rede se abre"); o texto sobe e perde opacidade | ScrollTrigger com scrub escrevendo o progresso no store | `start: "top top"`, `end: "bottom top"`, `scrub: true`, sem pin |

- **Movimento reduzido:** texto já visível; imagem estática da rede montada no lugar do canvas; sem parallax de cursor.
- **Celular:** sem parallax de cursor (não há ponteiro); a rede entra montada mais rápido (~800 ms); a saída mantém o recuo da câmera por scrub, que é barato.
- **Orçamento:** nós em 1 `instancedMesh` + arestas em 1 `lineSegments` + 1 camada opcional de brilho = **≤ 3 draw calls**. O canvas monta dentro de um placeholder com o mesmo tamanho (CLS zero).

## 2. Sobre (`#sobre`), pinado

**Ideia:** o texto de apresentação se revela linha a linha, com a rede ao fundo em baixa opacidade.

| Fase | O que acontece | Ferramenta | Gatilho |
|---|---|---|---|
| Entrada | A rede, já aberta, cai para ~20% de opacidade e se desloca para um lado, deixando espaço para o texto e a foto | R3F (modo `about`) | Fim da saída do Hero (progresso 1) |
| Permanência | A seção fica pinada; cada linha do texto passa de baixa opacidade para opacidade total conforme o scroll. A foto (quando existir) entra com leve escala | SplitText (`type: "lines"`) + timeline com scrub | `start: "top top"`, `end: "+=150%"`, `pin: true`, `scrub: true` |
| Saída | O pin solta; a rede some (opacidade 0) e o canvas para de renderizar antes dos Indicadores | ScrollTrigger (fim do pin) + R3F | `end` do pin |

- **Movimento reduzido:** sem pin; texto inteiro visível; rede estática ao fundo como imagem, ou ausente.
- **Celular:** sem pin; cada parágrafo entra com fade/subida curta quando chega a 80% da viewport (`once: true`); rede escondida (o texto precisa da tela inteira).
- **Orçamento:** mesmos ≤ 3 draw calls do Hero (é a mesma cena); a foto entra com `next/image` em tamanho responsivo. A foto depende da #4 (sessão de foto); até lá, o bloco da foto não aparece.
- **Acessibilidade:** o SplitText quebra o texto em linhas só para efeito visual; o texto original precisa continuar legível por leitores de tela (conferir a opção de acessibilidade do SplitText na versão instalada ao implementar).

## 3. Indicadores (`#indicadores`)

**Ideia:** os números "compilam": contam até o valor real com um glitch curto na fonte mono.

| Fase | O que acontece | Ferramenta | Gatilho |
|---|---|---|---|
| Entrada | Cada indicador conta de 0 até o valor em ~1,2 s, com escalonamento de 100 ms entre eles; nos primeiros ~300 ms os dígitos "embaralham" (caracteres aleatórios em Geist Mono) antes de assentar | Tween GSAP num objeto `{ value }` atualizando o texto | `start: "top 80%"`, `once: true` |
| Permanência | Estático. O rótulo de cada número fica legível o tempo todo | — | — |
| Saída | Nenhuma animação; a seção sai com o scroll normal | — | — |

- **Fonte dos números:** calculados de `src/content/` (D05, issue #10). Indicador com valor 0 ou sem dado não aparece.
- **Acessibilidade:** o valor final está no HTML do servidor. O número animado é uma cópia visual com `aria-hidden="true"`; o leitor de tela lê só o valor real, uma vez.
- **Movimento reduzido:** números já no valor final, sem glitch.
- **Celular:** mesma contagem (é barata); grade em 2 colunas.
- **Orçamento:** 0 draw calls (canvas parado); nenhum asset; só transform/opacity e texto.

## 4. Projetos (`#projetos`), parallax

**Ideia:** cards com profundidade em CSS 3D; o hover revela a stack.

| Fase | O que acontece | Ferramenta | Gatilho |
|---|---|---|---|
| Entrada | Os cards sobem em camadas, com `translateZ` diferente por coluna, e se acomodam | ScrollTrigger + CSS 3D (`perspective` no contêiner) | `start: "top 75%"`, `toggleActions: "play none none reverse"` |
| Permanência | Parallax leve: cada coluna rola a uma velocidade um pouco diferente. No hover/foco, o card inclina até ~6° seguindo o ponteiro e mostra a stack e os links | ScrollTrigger com scrub (parallax); Motion (`whileHover`, `whileFocus`, layout da stack) | Parallax: `start: "top bottom"`, `end: "bottom top"`, `scrub: true`. Hover/foco: evento |
| Saída | Os cards seguem o scroll normal | — | — |

- **"Em desenvolvimento" (D06):** subseção separada dentro do capítulo, depois dos concluídos, com selo de status. Mesmo tratamento visual, sem parallax próprio.
- **Teclado:** o foco no card (`:focus-within`) dispara o mesmo estado do hover. A stack também está no HTML, nunca só no hover.
- **Movimento reduzido:** sem parallax e sem inclinação; hover/foco só muda borda e brilho.
- **Celular:** uma coluna; sem parallax e sem inclinação (não há hover); stack sempre visível no card.
- **Orçamento:** 0 draw calls; imagens de capa via `next/image` (AVIF/WebP, `sizes` correto), carregadas com lazy load; no máximo 4 cards em destaque na Home ([02-conteudo](pesquisa/02-conteudo.md)). As capas reais dependem da #23.

## 5. Competências (`#competencias`)

**Ideia:** a rede de nós volta, agora como grafo de tecnologias agrupado por área (ideia do PDF; implementação na #22).

| Fase | O que acontece | Ferramenta | Gatilho |
|---|---|---|---|
| Entrada | O canvas volta a renderizar; os nós entram dispersos e se reagrupam em clusters por área (por exemplo, front-end, back-end, IA, hardware), cada um com um rótulo HTML | R3F (modo `skills`) com progresso do ScrollTrigger; rótulos com `Html` do Drei ou HTML sobreposto | `start: "top 70%"`, `end: "top 20%"`, `scrub: true` |
| Permanência | Hover/foco num nó destaca as arestas até os projetos que usam aquela tecnologia | R3F (raycasting ≤ 30/s) | Ponteiro; foco via lista HTML equivalente |
| Saída | Os clusters perdem opacidade e o canvas para de renderizar antes da Trajetória | ScrollTrigger + R3F | `start: "bottom 60%"`, `end: "bottom top"`, `scrub: true` |

- **Dados:** as áreas e tecnologias saem dos projetos cadastrados (#10), nunca de uma lista digitada à parte. Tecnologia que não aparece em nenhum projeto não vira nó.
- **Acessibilidade:** o grafo é decorativo; a mesma informação existe como **lista HTML agrupada por área**, navegável por teclado. O destaque por foco usa essa lista.
- **Movimento reduzido / sem WebGL:** só a lista agrupada (com o visual de "chips"), sem canvas.
- **Celular:** lista agrupada em vez do grafo (o grafo com rótulos não cabe numa tela estreita sem perder a legibilidade).
- **Orçamento:** reaproveita o `instancedMesh` e o `lineSegments` do Hero (≤ 3 draw calls) + rótulos em HTML (não contam como draw call). Se os rótulos forem `Html` do Drei, no máximo ~20 ao mesmo tempo.

## 6. Trajetória / Eventos (`#trajetoria`), linha do tempo horizontal

**Ideia:** experiência, estudos e eventos numa linha do tempo que corre na horizontal enquanto o visitante rola na vertical.

| Fase | O que acontece | Ferramenta | Gatilho |
|---|---|---|---|
| Entrada | O título fixa e a trilha da linha do tempo aparece com o traço sendo desenhado (`scaleX` de 0 a 1) | Timeline GSAP | `start: "top 60%"`, `once: true` |
| Permanência | A seção pina e a trilha se desloca em `x` pela largura excedente (`-(scrollWidth - innerWidth)`); cada marco acende quando passa pelo centro. Filtros "Participação / Organização" (D03) mudam os marcos com animação de layout | ScrollTrigger (`pin: true`, `scrub: 1`, `containerAnimation` para os marcos); Motion (`layout`) nos filtros | `start: "top top"`, `end: () => "+=" + larguraExcedente`, `invalidateOnRefresh: true` |
| Saída | O pin solta no último marco; a trilha some com o scroll normal | — | Fim do pin |

- **Dados:** marcos vêm de experiência, estudos e eventos (#10). Evento sem data não entra na linha do tempo.
- **Acessibilidade:** a trilha é uma lista ordenada (`<ol>`) no HTML; os marcos têm data em `<time>`. Navegação por Tab percorre os marcos em ordem e, se o foco cair num marco fora da tela, a rolagem leva até ele.
- **Movimento reduzido:** sem pin; linha do tempo vertical, tudo visível.
- **Celular:** linha do tempo vertical, sem pin; cada marco entra com fade curto (`once: true`).
- **Orçamento:** 0 draw calls; só transform/opacity; logos de eventos/instituições (se houver) como SVG ou imagens pequenas com lazy load.

## 7. Contato (`#contato`)

**Ideia:** a rede converge num ponto, fechando o ciclo aberto no Hero.

| Fase | O que acontece | Ferramenta | Gatilho |
|---|---|---|---|
| Entrada | O canvas volta a renderizar com poucos nós vindos das bordas; título e links do contato entram com fade/subida | R3F (modo `contact`) + Motion para os links | `start: "top 80%"` para o texto (`once: true`); `start: "top bottom"`, `end: "center center"`, `scrub: true` para a convergência |
| Permanência | Os nós chegam a um ponto atrás do CTA principal e ficam pulsando devagar; o hover nos links tem microinteração | R3F; Motion (`whileHover`, `whileFocus`) | — |
| Saída | Fim da página; o rodapé entra com o scroll normal e o canvas para de renderizar | R3F | Rodapé visível |

- **Conteúdo:** só links reais (e-mail, LinkedIn, GitHub). O formulário depende da P03 e da #26; enquanto não existir, o capítulo tem só links. Link sem valor cadastrado não aparece.
- **Movimento reduzido / sem WebGL:** imagem estática do ponto de convergência, ou nenhum fundo; links visíveis.
- **Celular:** convergência mantida, com metade dos nós (o scrub é barato) ou trocada por um SVG estático se o `PerformanceMonitor` tiver baixado a qualidade antes.
- **Orçamento:** ≤ 3 draw calls (mesma cena); nenhum asset novo.

---

## Mapa para as issues

| Capítulo | Estrutura e conteúdo | Movimento | 3D |
|---|---|---|---|
| 1. Hero | #15 | #21 | #20 |
| 2. Sobre | #15 | #21 | #20 |
| 3. Indicadores | #15 (#10 calcula os números) | #21 | — |
| 4. Projetos | #16 | #21 | — |
| 5. Competências | #16 | #21 | #22 |
| 6. Trajetória/Eventos | #16 | #21 | — |
| 7. Contato | #16 | #21 | #20 (modo `contact`) |

A infraestrutura comum (Lenis, registro dos plugins do GSAP, `matchMedia`, botão "reduzir efeitos") fica na #19.

## Pontos em aberto

- **P06 (conceito da cena 3D):** este documento assume o núcleo digital / rede de nós, a recomendação da pesquisa.
- **Competências na Home:** a [D04](decisoes.md) lista a Home sem um capítulo de Competências, mas o [§4.8](pesquisa/04-3d-e-scroll.md#48-storyboard-sugerido-navegação-híbrida) e a #22 o incluem. Este storyboard segue o §4.8 e põe Competências entre Projetos e Trajetória; se o Guilherme preferir, o capítulo pode ir para a página Sobre sem mudar os demais.
- **Ids das âncoras:** os ids em português (`#inicio`, `#sobre`...) são uma sugestão; a #14 define os definitivos, inclusive se mudam por idioma.
