<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

# AGENTS

```text
========================================
   EMBELLEZE DASHBOARD · AGENTS
========================================
Escopo : embelleze-dashboard/
Leitura: obrigatória antes de qualquer ação
========================================
```

## ⟠ Projeto

Painel mobile-first para o dono do Instituto Embelleze Trindade.
Exibe a fila de contatos com status, ações de ligação e WhatsApp.
Acesso por senha única. Sem usuários, sem roles, sem CMS.

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Framework   Astro SSR
┃ Banco       PostgreSQL compartilhado (tabela leads)
┃ Auth        Cookie httpOnly — senha única
┃ Deploy      Railway via GHCR
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

## ⨷ Regra de Independência

```text
▓▓▓ MAIS IMPORTANTE QUE QUALQUER OUTRA REGRA
────────────────────────────────────────
Este módulo é COMPLETAMENTE AUTOSSUFICIENTE.
Nenhum arquivo externo ao módulo pode ser referenciado.

Antes de qualquer commit, verifique:
└─ public/ contém TODOS os assets usados nas páginas
└─ Nenhuma URL aponta para embelleze-web ou outro módulo
└─ Dockerfile não depende de arquivos de outros módulos
└─ Nenhum import cruza fronteiras de pacote
```

────────────────────────────────────────

## ◬ Protocolo de Execução

**Leia antes de agir:** `../.skills/dev-agent.md` — NEØ DEV AGENT.
Define níveis de confiança, guardrails de mutação e formato de reporte.
Obrigatório para qualquer agente que opere neste pacote.

────────────────────────────────────────

## ⧉ Onde Cada Coisa Fica

```text
▓▓▓ ESTRUTURA DO MÓDULO
────────────────────────────────────────
└─ src/lib/auth.ts        cookie e validação de sessão
└─ src/lib/db.ts          queries PostgreSQL (fetchLeads, countByStatus)
└─ src/middleware.ts      proteção de rotas — redirect para /login
└─ src/pages/login.astro  tela de acesso
└─ src/pages/leads.astro  fila de contatos — tela principal
└─ src/pages/api/auth/    login.ts + logout.ts
└─ public/brand/          avatar e favicon — LOCAIS, nunca externos
```

────────────────────────────────────────

## ⍟ Proibições

- Não referenciar arquivos ou URLs de `embelleze-web/` ou qualquer outro módulo.
- Não usar `import.meta.env` — usar `process.env` para variáveis de runtime.
- Não remover `security: { checkOrigin: false }` do astro.config.mjs.
- Não expor mensagens de erro internas para o usuário final.
- Não usar jargão técnico na UI: "Ops", "CRM", "Leads", "Dashboard" → proibidos.
- Não criar rotas ou componentes adicionais sem aprovação do cliente.
