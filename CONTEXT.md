<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

# CONTEXT

```text
========================================
   EMBELLEZE DASHBOARD · CONTEXT
========================================
Escopo : embelleze-dashboard/
========================================
```

## ⟠ Quem usa

Uma pessoa: o dono do Instituto Embelleze Trindade.
Acessa pelo celular para ver quem entrou em contato,
ligar ou mandar mensagem no WhatsApp diretamente da lista.

────────────────────────────────────────

## ⨷ O que faz

Exibe a fila de contatos capturados por dois caminhos:

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ORIGEM               COMO CHEGA
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Site (embelleze-web) FutureSimulator → POST /api/leads
┃                      GlobalInterceptor → clique wa.me
┃ WhatsApp (Bella SDR) Z-API webhook → bella.ts → db.ts
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

O dashboard não grava nada. Só lê.

────────────────────────────────────────

## ⧉ Modelo de Dados

Todos os contatos vivem na tabela `leads` do Postgres Railway.
O dashboard lê essa tabela diretamente via `pg.Pool`.

### Status possíveis

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ STATUS        SIGNIFICADO
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ NOVO          Chegou pelo site ou WA, sem qualificação
┃ QUALIFICADO   Completou o FutureSimulator
┃ INTERESSADO   Clicou no botão de WhatsApp
┃ PIX_GERADO    Bella gerou link de pagamento via Pix
┃ PIX_PAGO      Pagamento confirmado
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Prioridade de exibição

```text
1. PIX_PAGO    — fechar agora
2. PIX_GERADO  — acompanhar pagamento
3. INTERESSADO — quentes (badge vermelho no header)
4. QUALIFICADO — qualificados para abordar
5. NOVO        — entrada fria
```

Dentro de cada grupo, mais recente primeiro (`updated_at DESC`).

────────────────────────────────────────

## ⧇ Relação com outros módulos

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ MÓDULO            RELAÇÃO
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ embelleze-web     Grava leads no Postgres
┃                   Dashboard lê os mesmos dados
┃ Bella (WhatsApp)  Atualiza status via webhook
┃                   Dashboard reflete em tempo real
┃ Probeltec (CRM)   probeltec_synced_at indica sincronização
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

O dashboard é somente leitura. Qualquer escrita nos dados
passa obrigatoriamente pelo `embelleze-web` ou pelo webhook da Bella.

────────────────────────────────────────

## ⍟ Decisões de Produto

```text
▓▓▓ O QUE FOI DECIDIDO E POR QUÊ
────────────────────────────────────────
└─ Senha única (sem usuários)
   Motivo: único usuário real. Complexidade zero.

└─ Sem edição de status pelo painel
   Motivo: status é gerenciado pela Bella e pelo site.
   Interferência manual cria inconsistência.

└─ LIMIT 200 na listagem
   Motivo: volume atual não justifica paginação.
   Revisitar quando operação escalar.

└─ Auto-refresh a cada 60 segundos
   Motivo: mobile não usa WebSockets facilmente.
   Refresh simples é suficiente para o volume atual.

└─ Linguagem sem jargão técnico
   Motivo: o dono não é técnico.
   "Contatos" não "Leads". "Painel" não "Dashboard".
   "No sistema" não "CRM". "Sair" não "Logout".
```

────────────────────────────────────────

## ◬ Ambiente

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ PARÂMETRO     VALOR
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Domínio       dash-embelleze.up.railway.app
┃ Banco         Postgres Railway (compartilhado)
┃ Deploy        Railway via GHCR
┃ Imagem        ghcr.io/neomello/embelleze-dashboard
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────
