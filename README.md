<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 MD041 -->

```text
========================================
   EMBELLEZE TRINDADE · DASHBOARD
========================================
Função  : painel operacional de leads e campanhas
Deploy  : Railway — build direto do repo
Porta   : 8080 (prod) · 4322 (dev)
========================================
```

## ⟠ O que é

Painel de gestão para o Instituto Embelleze Trindade.
Visualiza leads, funil de vendas, origens, campanhas Meta
e feed de atividade em tempo real.

Acesso por senha única.
Sem cadastro, sem roles, sem CMS.
Este módulo é read-only — toda escrita pertence ao `embelleze-web`.

────────────────────────────────────────

## ⨷ Stack

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Framework   Astro SSR (output: server)
┃ Adapter     @astrojs/node (standalone)
┃ Banco       PostgreSQL — tabela leads
┃             followup-state.json (snapshot)
┃ Auth        Cookie httpOnly — senha única
┃ Deploy      Railway — build via Dockerfile
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

## ⧉ Páginas

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ROTA          DESCRIÇÃO
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ /             mobile dashboard — redirect desktop → /desktop
┃ /desktop      desktop dashboard — bento grid + feed ao vivo
┃ /leads        lista completa de contatos
┃ /api/activity feed de atividade (JSON, polling 30s)
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

## ⧇ Variáveis de Ambiente

Ver [SETUP.md](./SETUP.md) para tabela completa com descrição e prioridades.

Vars obrigatórias:

```text
DASHBOARD_PASSWORD
DATABASE_URL
META_APP_ID · META_APP_SECRET · META_ACCESS_TOKEN · META_AD_ACCOUNT_ID
```

────────────────────────────────────────

## ⟠ Comandos

```bash
make install  # instala dependências
make sync     # gera .astro/types.d.ts
make dev      # dev server — http://localhost:4322
make check    # type check
make build    # build de produção
make deploy   # check + build
make clean    # remove dist/ e .astro/
make reset    # clean + node_modules + install
```

────────────────────────────────────────

## ◭ Deploy

Railway conecta ao repo `emb-trind/embelleze-dashboard`
e builda via `Dockerfile` a cada push em `main`.
Sem GitHub Actions. Sem registry externo.

Rollback: Railway → redeploy de deploy anterior.

────────────────────────────────────────

## ◬ Documentação

- [SETUP.md](./SETUP.md) — instalação, vars, comandos, deploy
- [CONTEXT.md](./CONTEXT.md) — quem usa, modelo de dados, decisões
- [CLAUDE.md](./CLAUDE.md) — regras para agentes IA
- [AGENTS.md](./AGENTS.md) — protocolo de execução
- [docs/meta-ads.md](./docs/meta-ads.md) — integração Meta Marketing API

────────────────────────────────────────

```text
▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
────────────────────────────────────────
```
