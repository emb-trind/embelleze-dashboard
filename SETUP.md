<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

# SETUP

```text
========================================
   EMBELLEZE DASHBOARD · SETUP
========================================
Framework : Astro SSR
Runtime   : Node.js >=20.0.0
Deploy    : Railway (Docker via GHCR)
========================================
```

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

Este módulo é independente — não precisa do workspace monorepo.

```bash
cd embelleze-dashboard
pnpm install
```

────────────────────────────────────────

## ⧉ Variáveis de Ambiente

Crie um arquivo `.env` na raiz do módulo:

```bash
cp .env.example .env   # se o arquivo existir
# ou crie manualmente:
```

```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
DASHBOARD_PASSWORD=sua-senha-aqui
PORT=4322
```

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ VARIÁVEL            OBRIGATÓRIA   DESCRIÇÃO
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ DATABASE_URL        sim           Postgres Railway
┃ DASHBOARD_PASSWORD  sim           Senha de acesso ao painel
┃ PORT                não           Padrão 4322 (dev) / 8080 (prod)
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

> Sem `DATABASE_URL`, a lista de contatos retorna vazia.
> Sem `DASHBOARD_PASSWORD`, o login sempre recusa.

────────────────────────────────────────

## ⧇ Comandos

```bash
make dev      # dev server — http://localhost:4322
make build    # build de produção (saída em dist/)
make start    # inicia o servidor compilado
make preview  # preview do último build
make check    # type check Astro
make clean    # remove dist/ e .astro/
```

────────────────────────────────────────

## ⍟ Estrutura

```text
embelleze-dashboard/
├── public/
│   ├── favicon.ico
│   └── brand/
│       └── avatar_e-trindade.png
│
├── src/
│   ├── lib/
│   │   ├── auth.ts      cookie e validação de sessão
│   │   └── db.ts        queries PostgreSQL
│   ├── middleware.ts    proteção de rotas
│   └── pages/
│       ├── index.astro  redirect → /leads
│       ├── login.astro  tela de acesso
│       ├── leads.astro  fila de contatos
│       └── api/
│           └── auth/
│               ├── login.ts
│               └── logout.ts
│
├── .npmrc               only-built-dependencies (esbuild)
├── .dockerignore
├── astro.config.mjs
├── Dockerfile
├── Makefile
└── package.json
```

────────────────────────────────────────

## ◭ Deploy — Railway via GHCR

Railway não faz build — puxa a imagem pronta do GHCR.
O CI faz o build e push automaticamente a cada push em `main`
que altere arquivos em `embelleze-dashboard/`.

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ PARÂMETRO     VALOR
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Source        Connect Image
┃ Imagem        ghcr.io/neomello/embelleze-dashboard:latest
┃ Registry      ghcr.io (público, sem auth)
┃ Domínio       dash-embelleze.up.railway.app
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Build manual (se necessário):**

```bash
cd embelleze-dashboard
docker build -t ghcr.io/neomello/embelleze-dashboard:latest .
docker push ghcr.io/neomello/embelleze-dashboard:latest
```

────────────────────────────────────────

## ◬ Banco de Dados

O dashboard lê da tabela `leads` do Postgres Railway — a mesma instância
usada pelo `embelleze-web`. Não cria nem migra tabelas.

Colunas esperadas:

```sql
phone               TEXT NOT NULL
name                TEXT
origin              TEXT
course_interest     TEXT
status              TEXT   -- NOVO | QUALIFICADO | INTERESSADO | PIX_GERADO | PIX_PAGO
last_message        TEXT
utm_source          TEXT
utm_medium          TEXT
utm_campaign        TEXT
updated_at          TIMESTAMPTZ
probeltec_synced_at TIMESTAMPTZ
```

────────────────────────────────────────

```text
▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol

"Code is law. Expand until
chaos becomes protocol."

Security by design.
Exploits find no refuge here.
────────────────────────────────────────
```
