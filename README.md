<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

# embelleze-dashboard

```text
========================================
   EMBELLEZE TRINDADE · DASHBOARD
========================================
Função  : Fila de contatos para o dono
Deploy  : Railway — ghcr.io/neomello/embelleze-dashboard
Porta   : 8080 (prod) · 4322 (dev)
========================================
```

## ⟠ O que é

Painel mobile-first para o dono do Instituto Embelleze Trindade.
Exibe a fila de contatos capturados pelo site e pela Bella (WhatsApp SDR),
ordenados por prioridade de conversão, com ações diretas de ligação e WhatsApp.

Acesso por senha única. Sem cadastro, sem roles, sem CMS.

────────────────────────────────────────

## ⨷ Stack

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Framework   Astro SSR (output: server)
┃ Adapter     @astrojs/node (standalone)
┃ Banco       PostgreSQL — tabela leads
┃ Auth        Cookie httpOnly — senha única
┃ Deploy      Railway via GHCR
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

## ⧉ Independência

Este módulo é completamente autossuficiente.
Pode ser clonado e executado sem o workspace monorepo.

```bash
git clone <repo>
cd embelleze-dashboard
pnpm install
pnpm build
node dist/server/entry.mjs
```

O `Dockerfile` usa apenas os arquivos desta pasta como contexto.

────────────────────────────────────────

## ⧇ Variáveis de Ambiente

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ VARIÁVEL            DESCRIÇÃO
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ DATABASE_URL        Postgres (Railway)
┃ DASHBOARD_PASSWORD  Senha de acesso ao painel
┃ PORT                Porta do servidor (padrão 8080)
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

## ⟠ Comandos

```bash
make dev      # dev server — http://localhost:4322
make build    # build de produção
make start    # inicia dist/server/entry.mjs
make check    # type check
make clean    # remove dist/ e .astro/
```

────────────────────────────────────────

## ◬ Documentação

- [SETUP.md](./SETUP.md) — instalação, variáveis, comandos, deploy
- [CONTEXT.md](./CONTEXT.md) — quem usa, modelo de dados, decisões de produto
- [CLAUDE.md](./CLAUDE.md) — regras técnicas para agentes IA
- [AGENTS.md](./AGENTS.md) — protocolo de execução para agentes

────────────────────────────────────────

## ◬ Deploy

```bash
# Build e push manual (requer login no GHCR)
docker build -t ghcr.io/neomello/embelleze-dashboard:latest .
docker push ghcr.io/neomello/embelleze-dashboard:latest
```

O CI faz isso automaticamente via `.github/workflows/docker-push-dashboard.yml`
a cada push em `main` que altere arquivos dentro de `embelleze-dashboard/`.

────────────────────────────────────────

```text
▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol

"Code is law. Expand until
chaos becomes protocol."
────────────────────────────────────────
```
