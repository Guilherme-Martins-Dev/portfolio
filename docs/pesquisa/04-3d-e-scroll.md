# 4. 3D e animações de scroll

> Direção já escolhida: **3D digital/cybernetic, intensidade imersiva, navegação híbrida** (cinematográfica + parallax). Pesquisa de 15/11/2026; fontes em [fontes.md](fontes.md).

## 4.1 Divisão de responsabilidades

| Camada | Ferramenta | Uso |
|---|---|---|
| Cena 3D | **three 0.187 + R3F 9 + Drei 10** | Hero (núcleo digital) e no máximo 1 ou 2 momentos de destaque |
| Coreografia do scroll | **GSAP 3.15 + ScrollTrigger** (`@gsap/react` → `useGSAP`) | Capítulos com pin, scrub e timelines |
| Smooth scroll | **Lenis** (`lenis/react`) | Inércia, sincronizada com o GSAP |
| Microinterações | **Motion** | Hover, layout e entrada de componentes |
| Profundidade leve | **CSS 3D** (`perspective`, `transform`) | Cards de projeto sem WebGL |

## 4.2 Licença do GSAP

Desde a compra pela **Webflow**, o GSAP é **100% gratuito, inclusive para uso comercial e com todos os plugins** (SplitText, MorphSVG, ScrollSmoother...), e vem do npm público sem token. A única restrição relevante: não usar o GSAP para construir uma ferramenta visual que concorra com a Webflow. Um portfólio está liberado.

## 4.3 R3F dentro do Next.js

- A cena fica num componente `'use client'`, carregado com `next/dynamic(..., { ssr: false })` **dentro de um client component**, com um placeholder do mesmo tamanho para não causar layout shift.
- **HTML primeiro:** o título, a apresentação e os CTAs do Hero são HTML real; o canvas é decorativo (`aria-hidden`).
- Conferir no Bundle Analyzer se o `three` não vazou para o bundle principal (há relatos disso).

## 4.4 Orçamento de performance (R3F oficial + estúdios)

- `frameloop="demand"` quando a cena está parada, com `invalidate()` para pedir um frame.
- **Pausar quando o canvas sai da viewport** (IntersectionObserver).
- `PerformanceMonitor` do Drei + **DPR adaptativo** (`setDpr`), com DPR máximo em torno de 1,5 no celular.
- `instancedMesh` para os nós da rede: um draw call para centenas de pontos. Manter **poucas centenas de draw calls** no total.
- Reaproveitar geometrias e materiais; `<Detailed />` (LOD) se houver modelos.
- Assets comprimidos: **Draco/Meshopt** (geometria) e **KTX2** (texturas). Definir um orçamento em bytes por cena antes de modelar.
- Limitar o raycasting a ~30 FPS (Weisdevice).
- Testar em **celular intermediário** e em navegadores dentro de apps (Instagram, LinkedIn).

## 4.5 Lenis + ScrollTrigger (padrão de integração)

```ts
// motion/lenis-provider.tsx ('use client')
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

- Registrar os plugins do GSAP **uma vez**, em um módulo compartilhado.
- `lenis.stop()` e `lenis.start()` ao abrir e fechar modais.
- Sem `'use client'`, o Lenis falha no Next (o erro mais comum).

## 4.6 Acessibilidade do movimento

```ts
useGSAP(() => {
  const mm = gsap.matchMedia();
  mm.add({ reduce: '(prefers-reduced-motion: reduce)', ok: '(prefers-reduced-motion: no-preference)' }, (ctx) => {
    const { reduce } = ctx.conditions!;
    // reduce → estados finais imediatos (duration: 0), sem pin/scrub, sem Lenis, canvas estático
  });
  return () => mm.revert();   // o revert fica no cleanup do useGSAP
});
```

- Com `reduce`: desligar o Lenis, trocar a cena 3D por uma **imagem estática** (render da cena) e manter o conteúdo legível.
- **Fallback 2D** para quem não tem WebGL: detectar e mostrar a imagem.
- Botão "reduzir efeitos" no cabeçalho, inspirado no "Ambient off" do nzt108.

## 4.7 Spline × R3F

| | Spline | R3F |
|---|---|---|
| Velocidade para começar | Alta (editor visual) | Média |
| Controle e interação | Limitado | Total |
| Bundle | O runtime do Spline pesa e o export é menos otimizado | O React adiciona overhead ao three puro (num teste: ~462 kB × ~1.036 kB), mas permite tree-shaking e lazy load |
| Valor como demonstração técnica | Baixo | **Alto**: o código é o diferencial do repositório |

**Recomendação:** R3F. O Spline, no máximo, para esboçar formas.

## 4.8 Storyboard sugerido (navegação híbrida)

1. **Hero (cinematográfico):** núcleo digital com nós e conexões que se montam; reage ao cursor (parallax de câmera) e, no scroll, a câmera se afasta e a rede "se abre".
2. **Sobre (pinned):** o texto se revela em linhas (SplitText), com a rede ao fundo em baixa opacidade.
3. **Indicadores:** números que "compilam" (contagem + glitch sutil).
4. **Projetos (parallax):** cards em CSS 3D com profundidade; o hover revela a stack.
5. **Competências:** a rede de nós volta como **grafo de tecnologias**, agrupado por área (ideia do PDF).
6. **Trajetória/Eventos:** linha do tempo horizontal com scrub.
7. **Contato:** a rede converge num ponto, fechando o ciclo.
