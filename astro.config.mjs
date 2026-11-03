// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';
import rehypePaper from './src/plugins/rehype-paper.mjs';

// https://astro.build/config
export default defineConfig({
  // Canonical origin. Used for the sitemap, <link rel="canonical"> and JSON-LD URLs.
  site: 'https://openmuscle.org',
  integrations: [sitemap()],
  // Markdown is used by one page, the HTML copy of the technical report. Keep its
  // text exactly as written (no smart quotes) and style code blocks with site CSS.
  markdown: {
    smartypants: false,
    syntaxHighlight: false,
    rehypePlugins: [rehypePaper],
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
