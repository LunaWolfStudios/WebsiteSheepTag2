// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build
export default defineConfig({
  site: 'https://www.sheeptag2.com',
  // Typo-tolerant aliases for the press kit — static builds emit meta-refresh pages,
  // which is all GitHub Pages can serve. /press/ stays usable for the asset files.
  redirects: {
    '/press': '/presskit',
    '/press-kit': '/presskit',
  },
  integrations: [
    sitemap({
      // The easter egg is intentionally not advertised (WEBSITE_PROPOSAL.md §10);
      // the 404 is a fallback, not a destination; the press aliases only redirect.
      filter: (page) =>
        !page.includes('/history/east') &&
        !page.includes('/404') &&
        !page.endsWith('/press/') &&
        !page.endsWith('/press-kit/'),
    }),
  ],
});
