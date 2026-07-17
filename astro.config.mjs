// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build
export default defineConfig({
  site: 'https://www.sheeptag2.com',
  integrations: [
    sitemap({
      // The easter egg is intentionally not advertised (WEBSITE_PROPOSAL.md §10).
      filter: (page) => !page.includes('/history/east'),
    }),
  ],
});
