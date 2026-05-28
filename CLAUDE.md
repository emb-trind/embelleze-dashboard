# CLAUDE.md

```text
========================================
   EMBELLEZE DASHBOARD · CLAUDE
========================================
Módulo  : embelleze-dashboard
Função  : visualização operacional e gestão
Repo    : github.com/emb-trind/embelleze-dashboard
Deploy  : Railway
========================================
```

## Convenções TypeScript

`tsconfig.json` segue o padrão workspace — ver raiz `CLAUDE.md` → *Convenções de Configuração*.
Este módulo não usa `baseUrl`, portanto não inclui `ignoreDeprecations`.
Targets Makefile canônicos: `dev` · `build` · `check` · `clean` · `install`.

## Escopo

Painel de leitura para operação diária.
Toda escrita e orquestração de estado pertence ao `embelleze-web`.

## Dados usados

- Snapshot sincronizado de follow-up (`followup-state`)
- Campos de taxonomia: `status`, `origem`, `midia`
- UTM para visão Meta (métricas e públicos)

## Taxonomia de fontes (PT-BR)

- LP Manicure
- LP Cílios
- LP Sobrancelha
- LP Cabeleireiro
- LP Transforme
- Form WhatsApp
- Rodapé do site
- Cadastro manual
- Origem desconhecida

## Observações Meta

- A aba Meta não depende de CRM.
- Deve mostrar indicadores de campanhas, públicos e desempenho com base nos dados disponíveis.
- Se faltarem variáveis de integração, mostrar estado claro de indisponibilidade, sem falso positivo.
