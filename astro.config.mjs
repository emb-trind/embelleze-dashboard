import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

const port = process.env.PORT ? Number(process.env.PORT) : 4322;

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  server: { port },
  security: { checkOrigin: false },
});
