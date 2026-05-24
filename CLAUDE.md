# CLAUDE.md

```text
========================================
   EMBELLEZE DASHBOARD · CLAUDE
========================================
Módulo  : embelleze-dashboard
Função  : Fila de contatos para o dono
Repo    : github.com/emb-trind/embelleze-dashboard
Deploy  : Railway — build direto do repo via Dockerfile
========================================
```

## ◬ Protocolo de Agente

```text
▓▓▓ LEITURA OBRIGATÓRIA ANTES DE QUALQUER AÇÃO
────────────────────────────────────────
└─ ../.skills/dev-agent.md — NEØ DEV AGENT
   decisão · execução · reporte
```

────────────────────────────────────────

## ⟠ Independência de Módulo

```text
▓▓▓ REGRA CRÍTICA — NÃO NEGOCIÁVEL
────────────────────────────────────────
Este módulo DEVE funcionar de forma completamente
independente. Se o workspace inteiro for removido
e só esta pasta sobrar, tudo deve continuar operando.

Consequências diretas:
└─ Todos os assets ficam em public/ deste módulo
   (favicon.ico, brand/*, etc.)
└─ Nenhuma rota referencia arquivo de outro módulo
└─ Nenhuma URL hardcoded apontando para outro módulo
└─ Dockerfile copia apenas o necessário deste módulo
└─ Sem import de pacotes de embelleze-web ou outros
```

────────────────────────────────────────

## ⨷ Arquitetura

### Stack

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Framework   Astro SSR (output: server)
┃ Adapter     @astrojs/node (standalone)
┃ DB          PostgreSQL via pg.Pool
┃ Auth        Cookie httpOnly — senha única
┃ Deploy      Railway via GHCR
┃ Porta dev   4322
┃ Porta prod  8080 (PORT env)
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Estrutura

```text
embelleze-dashboard/
  public/
    favicon.ico          — ícone local (não referenciar externo)
    brand/
      avatar_e-trindade.png — logo local (não referenciar externo)
  src/
    lib/
      auth.ts            — isAuthenticated, COOKIE constante
      db.ts              — fetchLeads, countByStatus (Pool pg)
    middleware.ts        — guarda todas as rotas exceto /login e /api/auth
    pages/
      index.astro        — redirect → /leads
      login.astro        — formulário de acesso por senha
      leads.astro        — fila de contatos com filtros e cards
      api/
        auth/
          login.ts       — POST: valida senha, seta cookie, redireciona
          logout.ts      — GET: apaga cookie, redireciona para /login
  astro.config.mjs       — server, node standalone, checkOrigin: false
  Makefile               — comandos locais
  Dockerfile             — build + runtime
```

────────────────────────────────────────

## ⧉ Regras Técnicas

### Astro

```text
▓▓▓ OBRIGATÓRIO
────────────────────────────────────────
└─ output: 'server' — nunca 'static'
└─ security: { checkOrigin: false }
   Motivo: CSRF do Astro bloqueia o form POST de login
└─ PORT via process.env.PORT — nunca hardcoded
```

### Variáveis de Ambiente

```text
▓▓▓ RUNTIME — não build-time
────────────────────────────────────────
└─ Usar process.env.VARIAVEL
└─ NUNCA import.meta.env — undefined em runtime no Railway

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ VARIÁVEL            DESCRIÇÃO
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ DATABASE_URL        Postgres (Railway)
┃ DASHBOARD_PASSWORD  Senha única de acesso
┃ PORT                Porta do servidor (padrão 8080)
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Autenticação

```text
└─ Cookie: dash_session (httpOnly, secure, sameSite: lax)
└─ Valor do cookie = DASHBOARD_PASSWORD
└─ Expiração: 30 dias
└─ Middleware protege tudo exceto /login e /api/auth/*
└─ Uma senha só — sem usuários, sem tokens extras
```

### Banco de Dados

```text
└─ pg.Pool com max: 5, idle: 30s, connect timeout: 2s
└─ SSL: rejectUnauthorized: false (Railway)
└─ fetchLeads: prioridade PIX_PAGO > PIX_GERADO > INTERESSADO
              > QUALIFICADO > NOVO, depois updated_at DESC
└─ Colunas usadas: phone, name, origin, course_interest,
                   status, last_message, utm_source,
                   utm_medium, utm_campaign, updated_at,
                   probeltec_synced_at
└─ NÃO usa created_at (pode não existir na tabela)
└─ COALESCE(updated_at, NOW()) — nullable safety
└─ LIMIT 200 — não paginar por ora
```

### UI / Identidade Visual

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ COR       HEX       USO
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Laranja   #de583d   badge quentes, tag interessado
┃ Roxo      #5f3080   fundo, filtro ativo, borda qualificado
┃ Verde     #25d366   convertidos, botão WhatsApp
┃ Base      #171018   fundo body
┃ Card      #1e1424   cards, header, filtros
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Linguagem na UI:
└─ "Contatos" (nunca "Leads" ou "Ops")
└─ "No sistema" (nunca "CRM" ou "Synced")
└─ "Painel" (nunca "Ops" ou "Dashboard")
└─ Nenhum jargão técnico exposto ao dono
```

────────────────────────────────────────

## ⟠ Comandos

Rodam de dentro de `embelleze-dashboard/`:

```bash
make dev       # dev server na porta 4322
make build     # build de produção (dist/)
make start     # inicia dist/server/entry.mjs
make preview   # preview do último build
make check     # type check Astro
make clean     # remove dist/ e .astro/
```

────────────────────────────────────────

## ◬ Deploy

```text
Pipeline: push main → Railway detecta → build via Dockerfile

Repo: github.com/emb-trind/embelleze-dashboard
Railway: conecta direto ao repo, sem GitHub Actions, sem GHCR

O Dockerfile é autossuficiente:
└─ .npmrc próprio → only-built-dependencies[]=esbuild
└─ pnpm install direto, sem --filter, sem workspace
└─ .dockerignore exclui node_modules, dist, .astro

Railway env vars obrigatórias:
└─ DATABASE_URL
└─ DASHBOARD_PASSWORD
└─ PORT (Railway injeta automaticamente)
```

────────────────────────────────────────

## ⍟ Proibições

- Não referenciar assets de `embelleze-web/` ou qualquer outro módulo.
- Não usar `import.meta.env` para variáveis de runtime.
- Não expor erros internos (DB, auth) para o cliente.
- Não adicionar dados numéricos (preços, vagas) sem validação do cliente.
- Não remover `security: { checkOrigin: false }` — quebra o login.
- Não paginar ou adicionar infinit scroll sem aprovação — LIMIT 200 é suficiente por ora.
