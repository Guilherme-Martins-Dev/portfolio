# 1. Referências visuais e de estrutura

> Pesquisa de 15/11/2026. Cada referência traz o que ela faz, a técnica e **o que adaptar sem copiar**. As URLs estão em [fontes.md](fontes.md).

## 1.1 Referências citadas no planejamento

| Site | O que é | Padrão útil para nós |
|---|---|---|
| **Kairo (ProfitizeBuild)** | Template pago de portfólio para "engenheiros de IA", vendido na biblioteca da Profitize. O que se compra é um prompt (~3,5 mil tokens) + `CLAUDE.md` + checklist de 11 passos + um .zip, no plano Pro (R$ 70,90/mês; R$ 49,90 na Black November) | O destaque é o **portfólio que se monta ao vivo** diante do visitante, com um "enxame" de cursores animados desenhando e encaixando blocos. **Ideia adaptável:** um Hero em que a interface "se compila" no carregamento, ligada à narrativa de engenharia. Como é um prompt para IA, dá para chegar a uma experiência equivalente sem pagar |
| **mozcan.dev** | Portfólio de desenvolvedor em uma página (turco) | Hero com badge "Open to work", cards de Hobbies/Toolkit em faixas de palavras repetidas (estilo marquee), cards de projeto com capa, tags e links "Detalhes"/"Ver projeto". Next.js + Firebase |
| **lazimmv.com** | Portfólio de desenvolvedor freelancer | Loader com contador em %, alternância de tema, projetos em cards (screenshot, categoria, ano) com página de detalhe, workflow em 5 passos, FAQ. GSAP + Framer Motion |
| **devxprite.github.io** | Portfólio full-stack | Experiência em linha do tempo com conquistas em tópicos, **métricas do GitHub ao vivo** e calendário de contribuições, cards open source com estrelas e forks |
| **nzt108.dev** | Site-serviço de dev freelancer | Hero com foto em tela cheia e **números-chave** (10+ projetos entregues, resposta em 24h), projetos numerados com tag de stack, processo em 3 passos, relógio local no rodapé, toggle "Ambient off" para desligar o efeito |
| **thesinova.com** | Renderiza só no cliente; a busca não conseguiu ler o conteúdo | Sem análise; vale uma inspeção manual no navegador |
| **mirax.cc** | O domínio não resolveu em 15/11/2026 (ENOTFOUND) | Sem análise |
| **awwwards.com** | Coleções "Three.js" e "WebGL", com Sites of the Day | Fonte contínua de inspiração (ver 1.2) |
| **creativedevjobs.com** | Lista curada de portfólios Three.js | Base da tabela 1.2 |

## 1.2 Portfólios 3D e de scroll que são referência em 2026

| Portfólio | Técnica-chave | Lição para o nosso |
|---|---|---|
| **ITom — itomdev.com** (CSS Winner SOTD em 25/03/2026; Awwwards HM) | Shaders GLSL de distorção de imagem no mouse, ScrollTrigger com tipografia em blur progressivo, parallax, **Lenis**, transições FLIP, corredor 3D navegável. Next.js + React 19 + R3F | Muito próximo da nossa stack. Mostra que **prêmios e imprensa** podem virar uma seção, que equivale à nossa de Eventos |
| **Bruno Simon — bruno-simon.com** | Carro dirigível pela cena; código aberto | Referência clássica de "o portfólio é a demonstração". O código aberto também é marketing |
| **Bilal El Moussaoui — bilal.show** | História 3D guiada pelo scroll | Scroll como narrativa |
| **Sébastien Lempens** | Tour 3D de Paris pelo scroll, trocando de câmera | A câmera muda de "modo" a cada capítulo |
| **Thibault Introvigne** | Exploração espacial com **10 colecionáveis que revelam a carreira** (R3F) | Gamificação discreta da trajetória |
| **Aimee's Papercraft World** | Ilustrações 2D aplicadas sobre geometria 3D (R3F, código aberto) | Estética própria sem modelagem pesada |
| **Weisdevice** | Shaders GLSL, Howler.js, GSAP; **raycasting limitado a 30 FPS, loop pausado quando não precisa, lazy load** | Modelo de orçamento de performance |
| **JReyes MC** (Awwwards HM) | Circuito no estilo Minecraft guiado pelo scroll | O scroll leva a "casas" de conteúdo |

Fora do mundo dos portfólios: Cartier Watches & Wonders (Three.js + GLSL + **GSAP + Lenis**, seis alcovas 3D no scroll), Shopify Editions Spring 2026 (tipografia que se dispersa em partículas), Hubtown (monólito 3D + revelação no mouse) e IVRESS (WebGPURenderer com fallback WebGL, shaders em TSL).

## 1.3 Padrões que se repetem

1. **Uma ideia difícil, bem executada.** Os melhores sites giram em torno de uma técnica principal em vez de empilhar efeitos.
2. **O scroll como dispositivo narrativo.** Cada seção é uma "cena" com entrada, permanência e saída.
3. **HTML primeiro, 3D depois.** O conteúdo legível carrega antes, por SEO e Core Web Vitals; a cena WebGL entra sob demanda.
4. **Interruptor de efeito.** O "Ambient off" do nzt108 e o fallback 2D respeitam quem não quer o efeito pesado.
5. **Prova social estruturada.** Prêmios, imprensa e eventos viram listas com data e link (ITom).
6. **Dados vivos.** GitHub stats e contribuições (devxprite) mostram atividade real, o que combina com a decisão D05 de calcular os indicadores.

## 1.4 Recomendação para o portfólio GMB

- **Conceito de Hero:** um "núcleo digital" (rede neural/circuito) em R3F que **se monta conforme o carregamento e a rolagem**. É a nossa versão da ideia da Kairo, só que em 3D real e ligada à identidade de Engenharia de Computação.
- **Capítulos de scroll:** Hero → Sobre (revelação progressiva) → Indicadores (números que se "compilam") → Projetos (cards em profundidade) → Trajetória (linha do tempo com parallax) → Contato.
- **Uma técnica marcante só:** a rede de nós do Hero, que **reaparece** como fio condutor (por exemplo, a visualização de competências do PDF). Nada de efeitos diferentes em cada seção.
- **Seção de Eventos** inspirada no "Studio/Awards" do ITom, com lista datada, papel (participante ou organizador) e link.
