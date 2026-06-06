<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 MD041 -->

```text
========================================
   EMBELLEZE DASHBOARD · META ADS
========================================
Escopo  : integração Meta Marketing API
Status  : implementado — 2026-05-28
========================================
```

> **Status:** implementado  
> **Lib:** `src/lib/meta.ts` — `fetchMetaInsights()`  
> **Credenciais:** preenchidas no `.env` e Railway  
> **Escopo:** server-side fetch (SSR, read-only)

────────────────────────────────────────

## ⟠ Objetivo

Adicionar dados reais da Meta Marketing API
à aba `#view-meta` do dashboard.

Hoje a aba exibe KPIs baseados em UTM
da base própria.
O bloco novo mostra gasto, impressões e cliques
vindos direto da API — sem substituir o existente.

────────────────────────────────────────

## ⨷ Credenciais

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ VARIÁVEL               STATUS
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ META_APP_ID            preenchido
┃ META_APP_SECRET        preenchido
┃ META_ACCESS_TOKEN      preenchido (System User — não expira)
┃ META_AD_ACCOUNT_ID     xxxxxxx
┃ META_LOOKBACK_DAYS     30
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Armazenadas em `.env` local e nas vars do Railway.
Nunca commitar.

────────────────────────────────────────

## ⧉ Endpoint

```text
GET https://graph.facebook.com/v19.0/act_{AD_ACCOUNT_ID}/insights
```

Parâmetros:

```text
++++++++━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━+++++++++++++
┃ PARÂMETRO       VALOR
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━+++++++++++++
┃ fields          campaign_name, spend, impressions,
┃                 clicks, cpc, cpm, actions
┃ date_preset     last_30d
┃ level           campaign
┃ access_token    META_ACCESS_TOKEN
++++++++━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━+++++++++++++
```

`landing_page_view` vem dentro do array `actions`
com `action_type: "landing_page_view"`.

────────────────────────────────────────

## ◬ Dados Retornados

Amostra validada — últimos 30 dias, 4 campanhas ativas:

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ CAMPANHA                             GASTO    IMPR.   CLI.  LPV
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ [LEADS] M GEO Ø 05/26              R$ 120,92  9.228   136   53
┃ [TRAFFIC] Stories Oferta Ø 05/26   R$  80,61 12.272   217   15
┃ Post: "Algumas transformações..."  R$ 155,75 13.741   212  110
┃ Test - [LEADS] M GEO Ø 05/26       R$   2,88    170     1    1
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ TOTAL                             R$ 360,16
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

## ⍟ Implementação

### Função

Criar `fetchMetaInsights()` em `src/lib/meta.ts`.

Contrato:

```text
▓▓▓ fetchMetaInsights
────────────────────────────────────────
└─ entrada  : vars META_ACCESS_TOKEN, META_AD_ACCOUNT_ID
└─ saída    : MetaCampaign[] | []
└─ em erro  : retorna [] — não quebra o dashboard
└─ campos   : campaign_name, spend, impressions,
              clicks, cpc, landing_page_views
```

```bash
# arquivo
src/lib/meta.ts
```

### Render

Chamar no frontmatter de `index.astro`
junto com as outras funções do `Promise.all`.

Renderizar em `#view-meta`,
abaixo dos KPIs de UTM existentes.
Bloco com título **"Campanhas Meta (API)"**
usando `glass-card source-wrap` já existente.

────────────────────────────────────────

## ◱ Arquitetura

```text
▓▓▓ RESTRIÇÕES
────────────────────────────────────────
└─ dashboard é read-only — sem escrita de estado
└─ fetch server-side no render SSR (Astro)
└─ sem cache — Railway builda fresh a cada deploy
└─ sem fallback de UI — bloco oculto se array vazio
```

────────────────────────────────────────

```text
▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
```
