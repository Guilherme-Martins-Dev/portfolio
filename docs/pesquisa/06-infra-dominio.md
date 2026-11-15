# 6. Infraestrutura, domínio e repositório público

> Pesquisa de 15/11/2026; fontes em [fontes.md](fontes.md).

## 6.1 Arquitetura

```
Visitante → www.<dominio> → Cloudflare DNS (só resolve, nuvem cinza) → Vercel (CDN, HTTPS, deploy) → app Next.js
                                                                          ↑
                                                         GitHub (público) → deploy a cada push
```

## 6.2 Vercel + Cloudflare: a posição oficial

A KB da Vercel (*"Can I use a proxy on top of my Vercel deployment?"*, publicada em 03/11/2025 e **atualizada em 13/11/2026**) diz: **conecte direto sempre que possível**. Colocar o proxy da Cloudflare na frente:

- reduz a visibilidade de segurança e prejudica a mitigação de DDoS (IPs compartilhados);
- quebra o **Bot Protection** gerenciado da Vercel;
- adiciona um salto de rede e mais um ponto de falha;
- cria **dois caches**: depois de um deploy, o HTML antigo pode pedir assets que já não existem;
- esconde o IP e a geolocalização reais do visitante.

**Passo a passo (DNS only):**

1. Vercel → Project → Settings → **Domains** → adicionar `dominio` e `www.dominio`.
2. Copiar os registros que a **Vercel mostrar** (A para o apex e CNAME para o `www`; use os valores do painel, que mudam com o tempo).
3. Na Cloudflare, criar os registros com **Proxy status: DNS only** (nuvem cinza).
4. Aguardar a verificação e o certificado na Vercel.
5. Definir o redirecionamento canônico (apex → `www` ou o contrário) **na Vercel**, para não duplicar regras na Cloudflare.

Se um dia o proxy for necessário: Verified Proxy, SSL **Full (strict)** (o modo Flexible causa loop de redirecionamento) e coordenação de cache.

## 6.3 Plano da Vercel

Pelas fair use guidelines oficiais, o **Hobby** é restrito a **uso pessoal não comercial**. Um portfólio pessoal se encaixa. Ele deixa de se encaixar se o site **vender serviços** (preços, "contrate-me" para trabalho pago) ou tiver monetização; nesse caso, o plano é o Pro. Os limites estourados no Hobby bloqueiam o recurso por 30 dias.

> Implicação: deixar o portfólio com foco em **trajetória e oportunidades de emprego/estágio/pesquisa**, sem tabela de preços (diferente do nzt108).

## 6.4 Domínio

| Opção | Onde | Custo aproximado | Observação |
|---|---|---|---|
| `.com` | Cloudflare Registrar | ~US$ 10,44/ano (preço de custo: tarifa do registro + ICANN, renovação igual) | A Cloudflare já cuida do DNS |
| `.dev` | Cloudflare Registrar | ~US$ 12,20/ano na renovação | **HSTS preload obrigatório** (só HTTPS, o que a Vercel já garante) e cara de "dev" |
| `.com.br` | Registro.br | ~R$ 40/ano (valor de referência) | Exige CPF; transmite presença no Brasil; o DNS pode apontar para a Cloudflare |

**Sugestão de nomes:** `guilhermemartinsbezerra.com` (completo, alinhado à marca) ou `guilhermebezerra.dev` (curto). Checar a disponibilidade antes de decidir; se der, registrar o `.com.br` também e redirecionar.

> Os preços de terceiros variam (o `.com` aparece entre US$ 8,57 e 10,46 conforme a fonte). Confirmar no painel da Cloudflare e no registro.br na hora da compra.

## 6.5 Repositório público: cuidados

- **Push protection** do GitHub: gratuito e **ligado por padrão** em repositórios públicos, bloqueia o push de segredos conhecidos. Detecta só alguns formatos de segredo, então não substitui o cuidado manual.
- `.env*` no `.gitignore` (já está no repositório) e `.env.example` sem valores reais.
- As variáveis secretas (`RESEND_API_KEY`, `GITHUB_TOKEN`, `TURNSTILE_SECRET_KEY`) ficam **só na Vercel**.
- Não publicar dados de clientes nem código de projetos privados (Chatbot WhatsApp): só a descrição e as imagens autorizadas.
- **Licença:** MIT para o **código** e "todos os direitos reservados" para o **conteúdo** (textos, fotos, marca), dito no README. Assim ninguém clona o site com a sua identidade.
- Verificar as licenças das fontes (OFL), dos modelos 3D e das imagens usadas.
