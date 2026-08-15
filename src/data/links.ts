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
  bluesky: "https://bsky.app/profile/lunawolfstudios.bsky.social",
  facebook: "https://facebook.com/sheeptag2",
  instagram: "https://instagram.com/sheeptag2",
  youtube: "https://www.youtube.com/channel/UCzw57oNyk0mCeVSoi-UCUBQ",
  twitch: "https://twitch.tv/directory/game/Sheep%20Tag%202",
  indiedb: "https://www.indiedb.com/games/sheep-tag-2",

  // Hero trailer (confirmed current) — theater lightbox (§6.3)
  trailer: "https://www.youtube.com/watch?v=9eJ0F5nIWL0",
  trailerId: "9eJ0F5nIWL0",

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

/**
 * Campaign tags for outbound store links.
 *
 * Steam only records a visit when the URL carries utm_source or utm_campaign,
 * and reports the five standard fields under Steamworks → Traffic → UTM
 * (https://partner.steamgames.com/doc/marketing/utm_analytics). Wishlists and
 * purchases made within 72 hours of a tagged visit come back as conversions,
 * which is how clicks on the site's Steam buttons get measured — the site's own
 * analytics only sees page visits, never where a visitor leaves to.
 *
 * The first three fields stay fixed so every link from this site lands in one
 * row, and the placement goes in utm_content so buttons can be told apart.
 * Values are locked in once they ship: Steam cannot rename them after the fact,
 * so a renamed placement reads as a brand new one.
 */
const UTM_SITE = {
  utm_source: "sheeptag2.com",
  utm_medium: "referral",
  utm_campaign: "website",
} as const;

/** Where the link sits, recorded as utm_content. Keep these stable. */
export type LinkPlacement =
  | "header"
  | "nav_mobile"
  | "hero"
  | "footer"
  | "presskit";

/**
 * Tag an outbound store URL for campaign reporting. Canonical URLs stay clean in
 * LINKS — structured data (schema.org sameAs) has to point at the untagged page,
 * so only rendered links go through here.
 */
export function withUtm(url: string, placement: LinkPlacement): string {
  const tagged = new URL(url);
  for (const [key, value] of Object.entries(UTM_SITE)) {
    tagged.searchParams.set(key, value);
  }
  tagged.searchParams.set("utm_content", placement);
  return tagged.href;
}
