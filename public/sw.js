/**
 * Service Worker — Embelleze Painel
 * v1.0.0
 *
 * SEGURANÇA: Este SW armazena SOMENTE assets estáticos do shell (ícones, manifest).
 * Nenhuma rota SSR, página, dado de lead ou resposta de API é armazenada em cache.
 * Dados do negócio trafegam exclusivamente via rede autenticada.
 */

const SHELL_VERSION = 'shell-v1.0.0';

// Apenas recursos verdadeiramente estáticos — sem dados
const SHELL_ASSETS = [
  '/manifest.json',
  '/brand/avatar_e-trindade.png',
  '/brand/logo_cor_horizontal.png',
  '/favicon.ico',
];

// Rotas que NUNCA devem ser interceptadas pelo SW (dados sensíveis)
const NETWORK_ONLY = [
  '/',
  '/leads',
  '/login',
  '/api/',
];

function isNetworkOnly(url) {
  const path = new URL(url).pathname;
  return NETWORK_ONLY.some(prefix => path === prefix || path.startsWith(prefix));
}

// ── Install: pré-carrega shell estático ──────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(SHELL_VERSION).then(cache => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

// ── Activate: remove versões antigas ────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== SHELL_VERSION)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch: dados sempre da rede, nunca de cache ──────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;

  // Ignora requisições não-GET
  if (request.method !== 'GET') return;

  // Rotas de dados → sempre rede, sem fallback de cache
  if (isNetworkOnly(request.url)) {
    event.respondWith(fetch(request));
    return;
  }

  // Assets estáticos → cache-first (shell apenas)
  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request))
  );
});
