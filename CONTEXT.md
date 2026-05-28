<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 MD041 -->

```text
========================================
   EMBELLEZE DASHBOARD · CONTEXT
========================================
Escopo : embelleze-dashboard/
========================================
```

## ⟠ Quem usa

Gestão e operação comercial do Instituto Embelleze Trindade
no dia a dia.

Acesso mobile (painel compacto)
e desktop (bento grid com feed ao vivo).

────────────────────────────────────────

## ⨷ O que precisa refletir

```text
▓▓▓ DADOS OPERACIONAIS
────────────────────────────────────────
└─ Status do lead (novo, contato, matrícula)
└─ Origem e mídia em taxonomia PT-BR
└─ Estado de follow-up (pendente, enviado, entregue, aberto)
└─ Contatos parados +48h sem retorno

▓▓▓ CANAIS DE MÍDIA
────────────────────────────────────────
└─ Meta Ads — campanhas reais via Marketing API
└─ UTM tracking — atribuição de leads por campanha
└─ ChatGPT Ads — leads com utm_source=chatgpt
└─ Origens LP por curso

▓▓▓ ATIVIDADE
────────────────────────────────────────
└─ Feed em tempo real (desktop) — polling 30s
└─ Funil de conversão
└─ Geo — acessos ao Google Maps
```

────────────────────────────────────────

## ⧉ Fonte de verdade

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ FONTE                     RESPONSÁVEL
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ followup-state.json       embelleze-web (escrita canônica)
┃ Postgres — tabela leads   embelleze-web
┃ Meta Marketing API        graph.facebook.com (leitura direta)
┃ Redis — geo               embelleze-web (via redis)
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

O dashboard é consumidor.
Não escreve estado em nenhuma fonte.

────────────────────────────────────────

## ⍟ Objetivo de UX

```text
└─ menos ruído técnico
└─ clareza de ação para equipe comercial
└─ atualização sem intervenção manual
└─ mobile compacto e desktop completo no mesmo deploy
```

────────────────────────────────────────

```text
▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
────────────────────────────────────────
```
