# 8. Prototipação e as correções do protótipo atual

> Pesquisa de 15/11/2026; fontes em [fontes.md](fontes.md).

## 8.1 MagicPath

- É um canvas de design com IA que gera telas e componentes editáveis à mão e por IA.
- **O código sai em React + TypeScript + Tailwind** (cópia com um clique ou codebase para download). As fontes não concordam sobre a exportação em HTML/CSS e a sincronização com o GitHub; confirmar no app.
- O **MagicPath 2.0** (maio de 2026) trouxe o canvas multiplayer e a integração com agentes: os componentes vão direto para o codebase via Codex, **Claude Code** ou Cursor. A CLI `magicpath-ai` instala os componentes como código-fonte.
- Importa e exporta para o Figma.

## 8.2 MagicPath × Figma × direto no código

| | MagicPath | Figma | Direto no Next.js |
|---|---|---|---|
| Velocidade para explorar UI | **Alta** | Média | Baixa |
| Marca e logo (vetor) | Fraco | **Forte** | — |
| 3D real e scroll | Não (só CSS/SVG) | Não | **Sim** |
| Caminho até o código final | CLI/agente → React | Handoff manual | — |

**Fluxo recomendado:**

1. **Figma** (gratuito) para a logomarca e os tokens.
2. **MagicPath** para validar o layout e a hierarquia das seções (já existe a base).
3. **Next.js** para tudo que é 3D e scroll. O protótipo serve de referência visual, mas os componentes são reescritos no design system do projeto, sem colar o código gerado como está.

## 8.3 O que corrigir no protótipo atual (levantado no PDF)

| # | Problema | Correção |
|---|---|---|
| 1 | **Scrollytelling ausente:** o CSS `gmb-scrollytelling` existe, mas a seção não está no JSX | Inserir a seção e ligar o progresso do scroll. No site final, isso vira GSAP + ScrollTrigger |
| 2 | **Âncoras quebradas:** o menu aponta para `#about`, `#experience`, `#projects`, mas as seções não têm `id` | Colocar `id` em cada `<section>` e `scroll-margin-top` para compensar o cabeçalho fixo |
| 3 | **3D provisório:** é CSS + SVG, sem WebGL, câmera ou iluminação | Fica como **fallback 2D**; a cena real vem com R3F |
| 4 | **Identidade e contatos provisórios** | Logomarca própria (roadmap, etapa 1); e-mail e links reais |
| 5 | **Dados provisórios:** foto, datas, descrições, imagens dos projetos | Levantar com o vault (notas de cada projeto) |
| 6 | "Build concluído" não prova que as interações funcionam | Validar no navegador: desktop, tablet, celular, movimento reduzido |

## 8.4 Ordem sugerida (do PDF, confirmada pela pesquisa)

1. Estrutura: IDs, navegação, semântica.
2. Scrollytelling ligado.
3. 3D real (R3F + Drei) no projeto Next, não no MagicPath.
4. Refinamento: transições, parallax, interações.
5. Validação: dispositivos, acessibilidade, performance.
