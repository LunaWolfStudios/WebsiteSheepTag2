// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://www.sheeptag2.com';

// https://astro.build
export default defineConfig({
  site: SITE,
  // Typo-tolerant aliases for the press kit — static builds emit meta-refresh pages,
  // which is all GitHub Pages can serve. /press/ stays usable for the asset files.
  // /farms is where the farm catalogue used to live before it moved under /guides.
  redirects: {
    '/press': '/presskit',
    '/press-kit': '/presskit',
    '/farms': '/guides/farms',
  },
  integrations: [
    sitemap({
      // The easter egg is intentionally not advertised (WEBSITE_PROPOSAL.md §10);
      // the 404 is a fallback, not a destination; the aliases only redirect.
      filter: (page) =>
        !page.includes('/history/east') &&
        !page.includes('/404') &&
        page !== `${SITE}/press/` &&
        page !== `${SITE}/press-kit/` &&
        page !== `${SITE}/farms/`,
    }),
  ],
});
