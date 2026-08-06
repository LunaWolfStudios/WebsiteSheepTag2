/**
 * Press kit copy & structure, following the presskit() format by Rami Ismail
 * (dopresskit.com): factsheet, description, history, features, videos, images,
 * logo & icon, coverage, monetization permission, links, about, credits, contact.
 *
 * Facts sourced from the Steam page, the Kickstarter campaign, and Jeff.
 */
import { LINKS } from "./links";

export const PRESS_EMAIL = "support@lunawolfstudios.com";

/** Studio-level press kit, for Luna Wolf Studios logos and company info. */
export const LWS_PRESSKIT = "https://lunawolfstudios.com/presskit";

export const FACTSHEET: Array<{ label: string; value: string; href?: string }> = [
  { label: "Developer", value: "Luna Wolf Studios (Delaware, USA)" },
  { label: "Release date", value: "TBA (in closed beta)" },
  { label: "Platforms", value: "Steam (Windows, macOS & Linux)", href: LINKS.steam },
  { label: "Price", value: "Free-to-play, never pay-to-win" },
  { label: "Genre", value: "Asymmetric multiplayer strategy & survival" },
  { label: "Players", value: "Up to 16 online, or solo vs. bots" },
  { label: "Engine", value: "Unity" },
  { label: "Languages", value: "English (more planned)" },
  { label: "Website", value: "sheeptag2.com", href: LINKS.homepage },
  { label: "Press contact", value: PRESS_EMAIL, href: `mailto:${PRESS_EMAIL}` },
];

/** One-line pitch, then the long-form description. */
export const PITCH =
  "The classic cat-and-mouse game! It's Sheep vs. Wolves in a unique blend of real-time strategy and survival. Party with up to 16 players online.";

export const DESCRIPTION = [
  "Sheep Tag 2 is the classic cat-and-mouse game reborn as an asymmetric, free-to-play multiplayer showdown where quick-thinking Sheep race to build sprawling mazes of farms while a coordinated pack of Wolves tears through every wall between them and their prey. Survive the clock as the flock, or capture every last Sheep as the pack. Either way, your reflexes are in for a workout.",
  "Every match is a duel of wits. Sheep weave defenses from more than twenty farm types, from the humble Straw Farm to Illusion and Invisible trickery, while Wolves upgrade, buy items, and unleash abilities like Pack Wolves, Lunar Strike, Phase Shift, and Snare Trap to corner Sheep one by one. Captured Sheep aren't out of the fight. They linger as Spirits in the central Pen, waiting for a daring teammate to pull off a rescue that can turn a lost round on its head.",
  "Born from the beloved Warcraft III mod that a devoted community has kept alive for more than two decades, Sheep Tag 2 is a from-the-ground-up standalone successor with five game modes, a built-in level editor, a free community terrain library, bot matches for solo practice, and a 17-track original soundtrack. It's free-to-play and never pay-to-win.",
];

export const HISTORY = [
  "Sheep Tag's story spans a quarter-century of custom-game history. Its DNA traces back to the classic Cat and Mouse custom games of StarCraft, but it found its true home in the early 2000s as Sheep Tag, a fan-made mod for Warcraft III. Simple to learn and endlessly deep, the mod built a devoted competitive community that has kept it alive and actively played for over twenty years.",
  "Jeff, co-founder of Luna Wolf Studios, has been part of that story almost from the beginning. A Sheep Tag player since the earliest days of Warcraft III, he went on to help develop and maintain the original mod alongside devoted community members GosuSheep and Chakra. That experience made it clear that Sheep Tag deserved to grow beyond its humble beginnings as a mod, just as Dota 2 and Legion TD 2 grew beyond theirs.",
  "The first standalone prototypes date to August 2015. Production ramped up in 2017 when Quaternius, one of the most recognizable low-poly 3D artists working in games, came aboard to shape the game's bright, readable world. Illustrator Nik Hagialas joined in 2019, creating all of the game's concept art, cover art, and UI illustration, and in 2020 composers Baelex Metcalf, Lazerwolph, and M set to work on what would become the complete 17-track original soundtrack.",
  "In November 2021 the community put its money where its heart is. The Sheep Tag 2 Kickstarter funded successfully, raising $10,072 from 65 backers. The closed beta launched in December 2022 with every backer reward delivered on time, exactly as promised. The game has been in continuous development ever since, on the road to a free-to-play launch on Steam for Windows, macOS, and Linux.",
  "Through it all, Sheep Tag 2 has remained a genuine solo project. Jeff is the game's sole core developer, its designer, programmer, and producer. He deliberately keeps the team small, bringing in hand-picked specialists exactly where their craft can take the game further than any one person could alone.",
];

export const TIMELINE: Array<{ when: string; what: string }> = [
  { when: "Early 2000s", what: "Sheep Tag is born as a Warcraft III mod, descended from StarCraft's Cat and Mouse." },
  { when: "Aug 2015", what: "Jeff builds the first standalone Sheep Tag 2 prototypes." },
  { when: "2017", what: "Production ramps up and 3D artist Quaternius joins." },
  { when: "2019", what: "Illustrator Nik Hagialas joins for concept, cover, and UI art." },
  { when: "2020", what: "Baelex Metcalf, Lazerwolph, and M begin the original soundtrack." },
  { when: "Nov 2021", what: "Kickstarter funds with $10,072 pledged by 65 backers." },
  { when: "Dec 2022", what: "Closed beta launches and every Kickstarter reward is delivered on time." },
  { when: "Today", what: "In active development toward a free-to-play launch on Steam." },
];

export const FEATURES = [
  "Asymmetric online multiplayer for up to 16 players, one flock of Sheep against a pack of Wolves.",
  "Build to survive: raise mazes from 20+ farm types, from the humble Straw Farm to Illusion and Invisible trickery.",
  "Hunt as a pack: Wolf abilities like Pack Wolves, Lunar Strike, Phase Shift, and Snare Trap, plus gold, items, and upgrades.",
  "Dramatic comebacks: captured Sheep become Spirits in the central Pen, and every rescue can swing the match.",
  "A day/night cycle that hands the advantage back and forth between flock and pack.",
  "Five game modes: Classic, Switch, Vamp, VIP, and Practice.",
  "Built-in level editor with multiple biomes, plus a free community terrain library on the website.",
  "Play solo against bots across five difficulty levels.",
  "Complete 17-track original soundtrack, available on Steam.",
  "Free-to-play and never pay-to-win, with cosmetics only. (Yes, there are hats.)",
  "Native on Windows, macOS, and Linux.",
];

export const VIDEOS: Array<{ id: string; title: string }> = [
  { id: LINKS.trailerId, title: "Sheep Tag 2 - Cinematic Teaser Trailer" },
];

export const COVERAGE: Array<{ outlet: string; title: string; url: string; note: string }> = [
  {
    outlet: "WTii (YouTube)",
    title: "Sheep Tag 2 - interview & gameplay showcase",
    url: "https://www.youtube.com/watch?v=ZGcLcwCXzj0",
    note: "Popular Warcraft III creator WTii sits down with Jeff to talk Sheep Tag's history and the road to Sheep Tag 2.",
  },
];

export const MONETIZATION =
  "Luna Wolf Studios grants permission for the contents of Sheep Tag 2 to be published through video broadcasting services and monetized. Let's Plays, streams, reviews, and similar content are welcome and encouraged on platforms such as YouTube and Twitch. We'd love it if you linked to sheeptag2.com alongside your content.";

export const ADDITIONAL_LINKS: Array<{ label: string; url: string; note: string }> = [
  { label: "Steam page", url: LINKS.steam, note: "Wishlist Sheep Tag 2 on Steam" },
  { label: "Original Soundtrack", url: LINKS.soundtrack, note: "The 17-track OST on Steam" },
  { label: "Kickstarter campaign", url: LINKS.kickstarter, note: "Funded November 2021, with the full campaign, updates, and rewards" },
  { label: "Discord", url: LINKS.discord, note: "The Sheep Tag 2 community server" },
  { label: "Terrain library", url: "https://www.sheeptag2.com/terrains", note: "Free community-made maps to browse and download" },
  { label: "Farms guide", url: "https://www.sheeptag2.com/farms", note: "Illustrated guide to every farm in the game" },
  { label: "Luna Wolf Studios press kit", url: LWS_PRESSKIT, note: "Studio logos and company info" },
];

export const ABOUT = [
  "Luna Wolf Studios is an independent game studio based in Delaware, USA, and the home of Sheep Tag 2, the standalone successor to the beloved Warcraft III mod. The studio builds community-first multiplayer games that are free-to-play, never pay-to-win, and shaped in the open alongside the players who love them.",
  "Sheep Tag 2 is solo-developed by co-founder Jeff, who partners with a hand-picked roster of specialist artists and musicians to bring the game's world to life.",
];

export const CREDITS: Array<{ name: string; role: string; note: string; url?: string; linkLabel?: string }> = [
  {
    name: "Jeff",
    role: "Creator - Design, Programming & Production",
    note: "Co-founder of Luna Wolf Studios and the game's sole core developer, part of the Sheep Tag community since the earliest days of Warcraft III.",
  },
  {
    name: "Quaternius",
    role: "3D Art & Animation",
    note: "Renowned low-poly 3D artist whose stylized models and animations define Sheep Tag 2's bright, readable world.",
    url: "https://quaternius.com/",
  },
  {
    name: "Nik Hagialas",
    role: "Illustration, Concept & UI Art",
    note: "Exceptionally talented illustrator behind all of the game's concept art, cover art, and UI illustration.",
    url: "https://www.nikhagialasart.com/",
  },
  {
    name: "Baelex Metcalf",
    role: "Original Soundtrack",
    note: "Lead composer of the original soundtrack, writing twelve of its seventeen tracks.",
    url: "https://www.youtube.com/watch?v=MyKVMWSLCZ0",
    linkLabel: "Soundtrack - Behind the scenes",
  },
  {
    name: "Lazerwolph",
    role: "Original Soundtrack",
    note: "Composer of Canis Lupus, Prowl, New Frontier, and The Sheep Or The Wolf.",
  },
  { name: "M", role: "Original Soundtrack", note: "Composer of The Great Escape." },
  { name: "Sara Sherlock", role: "Sound Effects", note: "Sound designer behind the game's sound effects." },
];

export const SOCIALS: Array<{ label: string; url: string }> = [
  { label: "X (Twitter)", url: LINKS.x },
  { label: "Bluesky", url: LINKS.bluesky },
  { label: "Facebook", url: LINKS.facebook },
  { label: "Instagram", url: LINKS.instagram },
  { label: "YouTube", url: LINKS.youtube },
  { label: "Twitch", url: LINKS.twitch },
  { label: "IndieDB", url: LINKS.indiedb },
];
