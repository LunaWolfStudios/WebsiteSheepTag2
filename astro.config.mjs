// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build
export default defineConfig({
  site: 'https://www.sheeptag2.com',
  integrations: [
    sitemap({
      // The easter egg is intentionally not advertised (WEBSITE_PROPOSAL.md §10);
      // the 404 is a fallback, not a destination.
      filter: (page) => !page.includes('/history/east') && !page.includes('/404'),
    }),
  ],
});
