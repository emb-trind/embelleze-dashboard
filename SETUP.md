<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 MD041 -->

```text
========================================
   EMBELLEZE DASHBOARD · SETUP
========================================
Framework : Astro SSR
Runtime   : Node.js >=20.0.0
Deploy    : Railway (build direto do repo)
========================================
```

────────────────────────────────────────

## ⟠ Pré-requisitos

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ REQUISITO     VERSÃO
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Node.js       >=20.0.0
┃ pnpm          >=10.0.0
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

## ⨷ Instalação

```bash
cp .env.example .env
# preencha as vars obrigatórias
pnpm install
make sync     # gera .astro/types.d.ts
make dev      # http://localhost:4322
```

────────────────────────────────────────

## ⧉ Variáveis de Ambiente

### Obrigatórias

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ VARIÁVEL             DESCRIÇÃO
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ DASHBOARD_PASSWORD   senha de acesso ao painel
┃ DATABASE_URL         Postgres Railway (sem valor = dados vazios)
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Meta Ads

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ VARIÁVEL              OBR.   DESCRIÇÃO
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ META_APP_ID           sim    ID do app Meta
┃ META_APP_SECRET       sim    Secret do app
┃ META_ACCESS_TOKEN     sim    System User Token (não expira)
┃ META_AD_ACCOUNT_ID    sim    ID da conta de anúncios
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ META_LOOKBACK_DAYS    não    Janela em dias → last_{n}d
┃                              Aceita: 7 · 14 · 28 · 30 · 90
┃                              Padrão: 30
┃ META_DATE_PRESET      não    Preset direto da API Meta
┃                              ex: last_7d · this_month · last_month
┃                              Sobrepõe LOOKBACK_DAYS
┃ META_DATE_START       não    Início do range (YYYY-MM-DD)
┃ META_DATE_END         não    Fim do range (YYYY-MM-DD)
┃                              DATE_START+END sobrepõe tudo acima
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ META_CAMPAIGN_STATUS  não    Filtra por status efetivo
┃                              ex: ACTIVE · PAUSED · ACTIVE,PAUSED
┃                              Padrão: todas as campanhas
┃ META_LEVEL            não    Nível de agregação
┃                              campaign · adset · ad
┃                              Padrão: campaign
┃ META_TIMEZONE         não    Fuso do relatório
┃                              Padrão: America/Sao_Paulo
┃ META_INCLUDE_TEST     não    Inclui campanhas cujo nome inicia com "Test"
┃                              Padrão: false (filtradas da lista e do total)
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Prioridade do período:
`DATE_START + DATE_END` > `DATE_PRESET` > `LOOKBACK_DAYS`

### Opcionais

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ VARIÁVEL              DESCRIÇÃO
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ FOLLOWUP_STATE_PATH   path do snapshot follow-up
┃                       Padrão: ./data/followup-state.json
┃ OPENAI_PIXEL_ID       Pixel ID ChatGPT Ads
┃ REDIS_URL             Redis Railway (geo e cache)
┃ PORT                  Padrão 4322 dev / 8080 prod
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

## ⧇ Comandos

```bash
make install  # instala dependências
make sync     # gera .astro/types.d.ts
make dev      # dev server — http://localhost:4322
make check    # type check
make build    # build de produção
make start    # inicia servidor compilado
make preview  # preview do último build
make audit    # auditoria de vulnerabilidades
make deploy   # check + build
make clean    # remove dist/ e .astro/
make reset    # clean + node_modules + install
```

────────────────────────────────────────

## ⍟ Estrutura

```text
embelleze-dashboard/
├── data/
│   └── followup-state.json   snapshot follow-up (gerado pelo embelleze-web)
│
├── docs/
│   ├── markdown_style_guide.md
│   └── meta-ads.md
│
├── public/
│   └── brand/
│
├── src/
│   ├── lib/
│   │   ├── auth.ts     cookie e validação de sessão
│   │   ├── db.ts       queries Postgres + leitura followup-state
│   │   ├── meta.ts     fetchMetaInsights — Meta Marketing API
│   │   └── redis.ts    geo e dados de localização
│   │
│   ├── middleware.ts   proteção de rotas
│   │
│   └── pages/
│       ├── index.astro     mobile dashboard (redirect desktop → /desktop)
│       ├── desktop.astro   desktop dashboard — bento grid + feed ao vivo
│       ├── leads.astro     lista de contatos
│       └── api/
│           ├── activity.ts         feed de atividade (polling)
│           └── auth/
│               ├── login.ts
│               └── logout.ts
│
├── .env.example
├── astro.config.mjs
├── Dockerfile
├── Makefile
└── package.json
```

────────────────────────────────────────

## ◭ Deploy — Railway

Railway conecta diretamente ao repo `emb-trind/embelleze-dashboard`
e builda via `Dockerfile`.
Sem GitHub Actions. Sem registry externo.

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ PARÂMETRO     VALOR
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Source        GitHub repo
┃ Repo          emb-trind/embelleze-dashboard
┃ Builder       Dockerfile
┃ Domínio       dash-embelleze.up.railway.app
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Rollback: Railway → redeploy de deploy anterior.

────────────────────────────────────────

## ◬ Banco de Dados

Lê da tabela `leads` do Postgres Railway —
mesma instância do `embelleze-web`.
Não cria nem migra tabelas.

O snapshot `followup-state.json` é a fonte
primária de dados operacionais —
gerado e sincronizado pelo `embelleze-web`.

────────────────────────────────────────

```text
▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
────────────────────────────────────────
```
