# 2. Conteúdo: o que mostrar e como

> Pesquisa de 15/11/2026. As fontes são guias de carreira e recrutamento (opinião de mercado, não pesquisas formais); os links estão em [fontes.md](fontes.md).

## 2.1 O que recrutadores procuram (pontos em que as fontes concordam)

- **Poucos projetos, com profundidade:** de 3 a 5 projetos bem documentados valem mais que dez rasos. Um bom estudo de caso vale mais que cinco superficiais.
- **Leitura rápida:** a primeira olhada dura minutos. Abertura clara e resultado em destaque.
- **O problema primeiro:** cada caso começa pelo problema, não pela tecnologia.
- **Autoria explícita:** dizer o que *você* fez, principalmente em projetos de equipe.
- **Números:** métricas interrompem a leitura dinâmica e prendem a atenção.
- **Processo e decisões > screenshots:** uma galeria de telas diz pouco sobre como você pensa.
- **Links vivos e GitHub organizado:** de 4 a 6 repositórios fixados e histórico de commits consistente.

## 2.2 Estrutura do estudo de caso (`/projetos/[slug]`)

Juntando o PDF com a pesquisa:

1. **Resumo** (TL;DR): uma frase, o papel, o período, o status e a stack.
2. **Contexto e problema:** para quem é e qual dor resolve.
3. **Objetivo e proposta.**
4. **Minha participação:** responsabilidades concretas e o tamanho da equipe.
5. **Arquitetura:** diagrama, modelo de dados e integrações.
6. **Decisões e trade-offs:** 2 ou 3 escolhas com o motivo de cada.
7. **Resultado:** números reais, demonstração (vídeo ou GIF) e links (repositório, deploy).
8. **Próximos passos / status** (alimenta a seção "Em desenvolvimento").

## 2.3 Candidatos a projeto principal (do vault)

| Projeto | Por que entra | Status para o site |
|---|---|---|
| **Questum** | Provas `.docx` → Moodle com IA, questões no padrão ENEM; extensão com 8 integrantes | Em desenvolvimento (portfólio do projeto até 29/11) |
| **NeuroSim 3D** | Simulador 3D de exame neurológico; resumo para a AMEE | Em desenvolvimento, e já demonstra 3D |
| **Chatbot WhatsApp + Lead Intelligence** | Chatbot e painel de leads para cliente | Em desenvolvimento (repositório privado: mostrar arquitetura e prints, sem código) |
| **AI Discovery** | Diagnóstico de IA por QR Code e telão, na Feira do Conhecimento; no ar | Concluído, e serve também como **evento** |
| **Bancada 4WD** | Montagem 3D de carro robô Arduino no navegador (R3F + CadQuery) | Em desenvolvimento |
| **Biblioteca ITIA** | Plataforma educacional em produção | Concluído / em evolução |
| **Portfólio para cliente** | Trabalho para cliente em Next.js | Concluído (só entra com autorização do cliente) |

> Sugestão: de 3 a 4 em destaque na Home (Questum, NeuroSim 3D, AI Discovery e Chatbot) e o restante na listagem `/projetos`.

## 2.4 Eventos e comunidades

Dois tipos, como no PDF: **Participação** (congressos, workshops, hackathons, palestras) e **Organização/colaboração** (equipe organizadora, apoio técnico).

Modelo de dados sugerido para cada evento: `nome`, `data`, `local/online`, `papel` (`participante` | `organizador` | `palestrante` | `mentor` | `apoio-tecnico`), `descrição curta`, `links` (Devpost, fotos, certificado), `projetoRelacionado?`.

- Hackathons costumam ter página no **Devpost** (projeto, equipe, prêmios); linkar é melhor que reescrever.
- A Feira do Conhecimento (AI Discovery) é o caso perfeito de **evento + projeto** ligados um ao outro.

## 2.5 Indicadores calculados (decisão D05)

Os números saem dos próprios dados: `projetos.length`, projetos por status, `eventos` por papel, tecnologias distintas usadas nos projetos e anos de experiência a partir da primeira data da linha do tempo. Opcionalmente, repositórios públicos e estrelas via API do GitHub, com revalidação a cada hora (padrão já usado em um portfólio para cliente).
