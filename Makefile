WORKSPACE_ROOT := $(shell cd .. && pwd)

.DEFAULT_GOAL := help
.PHONY: help install add dev build preview check start sync audit deploy clean reset

help:
	@echo ""
	@echo "  embelleze-dashboard"
	@echo ""
	@echo "  install        instala dependências (raiz do workspace)"
	@echo "  add pkg=<pkg>  adiciona pacote via workspace root"
	@echo "  dev            dev server (porta 4322)"
	@echo "  sync           gera .astro/types.d.ts"
	@echo "  check          type check"
	@echo "  build          build de produção"
	@echo "  start          inicia o servidor compilado"
	@echo "  preview        preview do último build"
	@echo "  audit          auditoria de vulnerabilidades"
	@echo "  deploy         check + build"
	@echo "  clean          remove dist/ e .astro/"
	@echo "  reset          clean + remove node_modules + install"
	@echo ""

install:
	pnpm --dir $(WORKSPACE_ROOT) install

add:
	@test -n "$(pkg)" || (echo "uso: make add pkg=<pacote>"; exit 1)
	pnpm --dir $(WORKSPACE_ROOT) --filter embelleze-dashboard add $(pkg)

dev:
	pnpm dev

sync:
	pnpm astro sync

check:
	pnpm check

build:
	pnpm build

start:
	node dist/server/entry.mjs

preview:
	pnpm preview

audit:
	pnpm audit

deploy:
	pnpm check
	pnpm build
	@echo ""
	@echo "  ok — push para o branch conectado ao Railway."
	@echo ""

clean:
	rm -rf dist .astro

reset: clean
	rm -rf node_modules
	pnpm --dir $(WORKSPACE_ROOT) install
