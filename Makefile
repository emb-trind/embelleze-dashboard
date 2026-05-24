.DEFAULT_GOAL := help
.PHONY: help dev build preview check start clean

help:
	@echo ""
	@echo "  embelleze-dashboard"
	@echo ""
	@echo "  dev       dev server (porta 4322)"
	@echo "  build     build de produção"
	@echo "  start     inicia o servidor compilado"
	@echo "  preview   preview do último build"
	@echo "  check     type check"
	@echo "  clean     remove dist/ e .astro/"
	@echo ""

dev:
	pnpm dev

build:
	pnpm build

start:
	node dist/server/entry.mjs

preview:
	pnpm preview

check:
	pnpm check

clean:
	rm -rf dist .astro
