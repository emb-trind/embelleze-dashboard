<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 MD041 -->

```text
========================================
   EMBELLEZE DASHBOARD · AGENTS
========================================
Escopo   : embelleze-dashboard/
Leitura  : obrigatória antes de qualquer ação
========================================
```

## ⟠ Primeira leitura

1. Este arquivo `dev-agent.md`
2. Sobre tráfego `mbelleze-dashboard/docs/meta-ads.md`
2. `CLAUDE.md` — regras técnicas e taxonomia
3. `SETUP.md` — vars de ambiente, estrutura de arquivos
4. `CONTEXT.md` — fontes de dados e objetivo

────────────────────────────────────────

## ⨷ Responsabilidades

```text
▓▓▓ PERTENCE AO DASHBOARD
────────────────────────────────────────
└─ exibir funil, leads e contatos parados
└─ exibir origens com taxonomia PT-BR
└─ exibir campanhas Meta (UTM + API real)
└─ exibir feed de atividade em tempo real
└─ adaptar layout por device (mobile / desktop)

▓▓▓ NÃO PERTENCE AO DASHBOARD
────────────────────────────────────────
└─ disparar email ou WhatsApp
└─ receber webhooks
└─ atualizar estado canônico de follow-up
└─ escrever em Postgres ou Redis
```

────────────────────────────────────────

## ⧉ Libs e páginas principais

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ARQUIVO                   FUNÇÃO
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ src/lib/db.ts             queries Postgres + followup-state
┃ src/lib/meta.ts           fetchMetaInsights — Meta API
┃ src/lib/redis.ts          geo e localização
┃ src/lib/auth.ts           cookie e sessão
┃ src/pages/index.astro     mobile dashboard
┃ src/pages/desktop.astro   desktop — bento grid + feed
┃ src/pages/leads.astro     lista de contatos
┃ src/pages/api/activity.ts JSON feed (polling 30s)
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

## ⍟ Regras

```text
└─ não usar import.meta.env para runtime no servidor
└─ não hardcode de fonte externa entre módulos
└─ não usar jargão técnico na UI
└─ pnpm obrigatório — nunca npm ou yarn
└─ toda nova var de ambiente → documentar em SETUP.md e .env.example
└─ qualquer integração nova → criar lib dedicada em src/lib/
```

────────────────────────────────────────

```text
▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
────────────────────────────────────────
```
