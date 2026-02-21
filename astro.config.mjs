import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: vercel(),

  devToolbar: {
    enabled: false
  },

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  }
});