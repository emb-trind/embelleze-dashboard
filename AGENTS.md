<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

# AGENTS

```text
========================================
   EMBELLEZE DASHBOARD · AGENTS
========================================
Escopo : embelleze-dashboard/
========================================
```

## Projeto

Painel mobile-first para gestão operacional.
Este módulo é leitura e visualização, com linguagem PT-BR.

## Responsabilidades

- Exibir funil e contatos
- Exibir fontes (`origem`/`midia`) com taxonomia combinada
- Exibir aba Meta com métricas e públicos sem assumir CRM
- Refletir estado do follow-up sincronizado

## Não pertence ao dashboard

- Disparar email
- Receber webhook da Resend
- Atualizar estado canônico de follow-up

## Regras

- Não usar jargão técnico na UI
- Não usar `import.meta.env` para runtime no servidor
- Não hardcode de fonte externa entre módulos
