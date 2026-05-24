import { defineMiddleware } from 'astro:middleware';
import { isAuthenticated } from './lib/auth';

const PUBLIC = ['/login', '/api/auth/'];

export const onRequest = defineMiddleware(({ url, cookies, redirect }, next) => {
  if (PUBLIC.some((p) => url.pathname.startsWith(p))) return next();
  if (!isAuthenticated(cookies)) return redirect('/login');
  return next();
});
