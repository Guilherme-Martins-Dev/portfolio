# 5. Marca pessoal, tipografia e cores

> Pesquisa de 15/11/2026. Os contrastes foram calculados pela fórmula de luminância relativa do WCAG 2.x; as fontes estão em [fontes.md](fontes.md).

## 5.1 Processo da logomarca

Os guias (Figma, Linearity, Fabrik) concordam neste fluxo:

1. **Briefing:** personalidade, valores e público. Para nós: engenharia, IA, construção e conexão.
2. **Referências:** o que fazem os pares e o que está em alta, para escolher o caminho próprio.
3. **Tipo de logo:** monograma (iniciais), símbolo abstrato, logotipo tipográfico ou combinação.
4. **Esboços no papel** antes do software.
5. **Cor e tipografia.**
6. **Iterações e feedback.**

Para o GMB, o PDF pede **um símbolo exclusivo que não dependa das iniciais**. Três direções para explorar:

- **Nó / grafo:** um símbolo formado por nós e arestas, ligado à rede do Hero, para que a marca e a cena 3D sejam a mesma linguagem.
- **Circuito:** uma trilha que forma um contorno abstrato (a origem em Engenharia de Computação).
- **Geométrico modular:** uma forma simples que funciona em 16 px (favicon) e anima bem.

**Teste obrigatório:** legibilidade em 16 px e 32 px (favicon), no avatar redondo do LinkedIn/GitHub e em uma cor só.

## 5.2 Tipografia

O PDF pede **fonte editorial + monoespaçada**. As combinações mais citadas em 2026 (todas grátis no Google Fonts):

| Papel | Opção A (recomendada) | Opção B |
|---|---|---|
| Títulos (editorial) | **Instrument Serif** | **Fraunces** (variável, mais "calorosa") |
| Corpo | **Geist** (variável, de 100 a 900) | Geist / Inter |
| Técnico (labels, código, metadados) | **Geist Mono** | JetBrains Mono / Space Mono |

Regras: uma fonte neutra, no máximo 2 famílias de texto + 1 mono; carregar com `next/font` (self-hosting, sem layout shift).

## 5.3 Paleta e contraste (WCAG)

| Combinação | Contraste | AA texto normal (4,5) | AA texto grande/UI (3,0) |
|---|---|---|---|
| Branco sobre `#0B132B` | **18,38** | ✅ | ✅ |
| `#00E5FF` sobre `#0B132B` | **11,95** | ✅ | ✅ |
| `#7B2CBF` sobre `#0B132B` | **2,59** | ❌ | ❌ |
| `#00E5FF` sobre branco | **1,54** | ❌ | ❌ |
| `#7B2CBF` sobre branco | **7,11** | ✅ | ✅ |
| Branco sobre `#7B2CBF` | **7,11** | ✅ | ✅ |
| `#0B132B` sobre `#00E5FF` (botão ciano) | **11,95** | ✅ | ✅ |
| `#A66BE0` sobre `#0B132B` *(roxo claro proposto)* | **5,08** | ✅ | ✅ |
| `#007A8C` sobre branco *(ciano escuro proposto)* | **5,05** | ✅ | ✅ |

**Consequências:**

- No **tema escuro**, o roxo `#7B2CBF` fica só em **brilhos, gradientes e fundos de botão com texto branco**. Para texto ou ícone roxo, use `#A66BE0`.
- No **tema claro**, o ciano `#00E5FF` não serve para texto; use `#007A8C`. O `#7B2CBF` funciona bem como texto sobre branco.
- Botão primário: fundo `#00E5FF` com texto `#0B132B` (11,95:1).

## 5.4 Tokens sugeridos (três camadas)

```css
@theme {
  /* primitivos */
  --color-navy-950: #0B132B;  --color-cyan-400: #00E5FF;  --color-cyan-700: #007A8C;
  --color-purple-600: #7B2CBF; --color-purple-400: #A66BE0;
  --font-display: "Instrument Serif"; --font-sans: "Geist"; --font-mono: "Geist Mono";
}
/* semânticos (por tema): --bg, --surface, --text, --text-muted, --accent, --accent-text, --glow */
```
