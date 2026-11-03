// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Canonical origin. Used for the sitemap, <link rel="canonical"> and JSON-LD URLs.
  site: 'https://openmuscle.org',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});
