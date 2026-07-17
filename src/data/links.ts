/** Single source of truth for every external URL (WEBSITE_PROPOSAL.md §6.2). */
export const LINKS = {
  wishlist: "https://store.steampowered.com/app/537680/Sheep_Tag_2",
  steam: "https://store.steampowered.com/app/537680/Sheep_Tag_2",
  soundtrack:
    "https://store.steampowered.com/app/2151350/Sheep_Tag_2_Original_Soundtrack",
  kickstarter:
    "https://www.kickstarter.com/projects/lunawolfstudios/sheep-tag-2",
  discord: "https://discord.gg/jNf5RsaZPp",
  homepage: "https://www.sheeptag2.com/",
  x: "https://x.com/sheeptag2",
  facebook: "https://facebook.com/sheeptag2",
  instagram: "https://instagram.com/sheeptag2",
  youtube: "https://www.youtube.com/channel/UCzw57oNyk0mCeVSoi-UCUBQ",
  twitch: "https://twitch.tv/directory/game/Sheep%20Tag%202",
  indiedb: "https://www.indiedb.com/games/sheep-tag-2",

  // Hero trailer (confirmed current) — theater lightbox (§6.3)
  trailer: "https://www.youtube.com/watch?v=JxZhfs2ZCf0",
  trailerId: "JxZhfs2ZCf0",

  // Terrain submission portal (§9)
  submitPage: "/submit",
  /**
   * Form relay for the terrain submission portal (static site → email with the
   * terrain attached). FormSubmit.co alias for support@lunawolfstudios.com —
   * the random string hides the address from scrapers (issued after activation).
   * Swap this endpoint for Web3Forms / a Cloudflare Worker later if preferred.
   */
  terrainSubmitEndpoint: "https://formsubmit.co/2fae3dfa5af1f28e5650fe157a7867ef",
} as const;
