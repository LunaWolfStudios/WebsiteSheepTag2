/**
 * Press kit copy & structure, following the presskit() format by Rami Ismail
 * (dopresskit.com): factsheet, description, history, features, videos, images,
 * logo & icon, coverage, monetization permission, links, about, credits, contact.
 *
 * Facts sourced from the Steam page, the Kickstarter campaign, and Jeff.
 */
import { LINKS, withUtm } from "./links";

export const PRESS_EMAIL = "support@lunawolfstudios.com";

/** Studio-level press kit, for Luna Wolf Studios logos and company info. */
export const LWS_PRESSKIT = "https://lunawolfstudios.com/presskit";

export const FACTSHEET: Array<{ label: string; value: string; href?: string }> = [
  { label: "Developer", value: "Luna Wolf Studios (Delaware, USA)" },
  { label: "Release date", value: "Early Access coming 2027" },
  { label: "Platforms", value: "Steam (Windows, macOS & Linux)", href: withUtm(LINKS.steam, "presskit") },
  { label: "Price", value: "Free-to-play, never pay-to-win" },
  { label: "Genre", value: "Asymmetric multiplayer strategy & survival" },
  { label: "Players", value: "Up to 32 online, or solo vs. bots" },
  { label: "Engine", value: "Unity" },
  { label: "Languages", value: "English (more planned)" },
  { label: "Website", value: "sheeptag2.com", href: LINKS.homepage },
  { label: "Press contact", value: PRESS_EMAIL, href: `mailto:${PRESS_EMAIL}` },
];

/** One-line pitch, then the long-form description. */
export const PITCH =
  "The classic cat-and-mouse game! It's Sheep vs. Wolves in a unique blend of real-time strategy and survival. Party with up to 32 players online.";

export const DESCRIPTION = [
  "Sheep Tag 2 is a multiplayer game of Sheep against Wolves. The Sheep build farms to keep the Wolves out and survive until the timer runs out. The Wolves work together to corner and capture every Sheep before then.",
  "Sheep can build more than twenty types of farm, from the Straw Farm to Illusion farms their team can walk through and Invisible farms the Wolves cannot see. Wolves buy potions and upgrades with gold, summon Pack Wolves, and use spells like Lunar Strike, Phase Shift, and Snare Trap to corner the Sheep. A captured Sheep becomes a Spirit in the pen. Any living Sheep can save it by attacking it, which brings that player back into the round.",
  "Sheep Tag 2 is the standalone successor to Sheep Tag, a Warcraft III mod that people still play more than twenty years later. It has five game modes, a built-in level editor with Steam Workshop sharing, a free library of community terrains, bots for solo play, and a 17-track original soundtrack. It is free-to-play and never pay-to-win.",
];

/** Paragraphs render as HTML, so a fact can carry the link that backs it up. */
export const HISTORY = [
  "Sheep Tag started in the early 2000s as a fan-made mod for Warcraft III, based on the Cat and Mouse custom games for StarCraft. It is easy to learn and has a lot of depth, and its competitive community has kept playing it for more than twenty years.",
  "Jeff, co-founder of Luna Wolf Studios, has played Sheep Tag since the early days of Warcraft III and later helped develop and maintain the original mod with community members GosuSheep and Chakra. Working on the mod made it clear that Sheep Tag could become a standalone game, as Dota 2 and Legion TD 2 did.",
  "The first standalone prototypes were built in August 2015. Production sped up in 2017 when Quaternius, a well-known low-poly 3D artist, joined to work on the game's 3D models and animations. Illustrator Nik Hagialas joined in 2019 and created all of the game's concept art, cover art, and UI illustration. In 2020, composers Baelex Metcalf, Lazerwolph, and M started work on the 17-track original soundtrack.",
  `In November 2021 the <a href="${LINKS.kickstarter}" target="_blank" rel="noopener">Sheep Tag 2 Kickstarter</a> was funded, raising $10,072 from 65 backers. The closed beta started in December 2022, and every backer reward was delivered on time. Development has continued since then. Early Access on Steam is planned for 2027, on Windows, macOS, and Linux.`,
  "Sheep Tag 2 is a solo project. Jeff is the only core developer and handles the design, programming, and production. The team is kept small on purpose, with specialists brought in for the art, music, and sound.",
];

export const TIMELINE: Array<{ when: string; what: string }> = [
  { when: "Early 2000s", what: "Sheep Tag starts as a Warcraft III mod, based on StarCraft's Cat and Mouse." },
  { when: "Aug 2015", what: "Jeff builds the first standalone Sheep Tag 2 prototypes." },
  { when: "2017", what: "3D artist Quaternius joins and production speeds up." },
  { when: "2019", what: "Illustrator Nik Hagialas joins for concept, cover, and UI art." },
  { when: "2020", what: "Baelex Metcalf, Lazerwolph, and M begin the original soundtrack." },
  { when: "Nov 2021", what: "The Kickstarter raises $10,072 from 65 backers." },
  { when: "Dec 2022", what: "The closed beta starts and every Kickstarter reward is delivered on time." },
  { when: "Today", what: "In closed beta. Early Access on Steam is planned for 2027." },
];

/** Grouped so a long list stays easy to scan. The groups flow down two columns. */
export const FEATURES: Array<{ heading: string; items: string[] }> = [
  {
    heading: "Gameplay",
    items: [
      "Online multiplayer for up to 32 players, with Sheep on one team and Wolves on the other.",
      "More than 20 types of farm for the Sheep to build, from the Straw Farm to Illusion and Invisible farms.",
      "Wolf spells like Summon Pack Wolf, Lunar Strike, Phase Shift, and Snare Trap, plus potions and upgrades bought with gold.",
      "Captured Sheep become Spirits in the pen, and their teammates can save them to bring them back into the round.",
      "A day and night cycle. At night the Sheep cannot see as far and the Wolves get stronger.",
      "Five game modes: Classic, Switch, Vamp, VIP, and Practice.",
      "Rulesets that change how a game plays. Pick a ready made one, or build, save, and share your own.",
      "Victory zones that win the round instantly, Field Rescue for saving Spirits without a pen, and the tools to recreate classic games like Run Sheepy Run.",
    ],
  },
  {
    heading: "Online and solo play",
    items: [
      "Multiplayer built on Photon Quantum, with prediction and rollback so every player's game stays in sync.",
      "US, EU, and AU servers, with games in any region open to join.",
      "Join a game that is already running. Watch as an observer and play from the next round.",
      "Play solo against bots across five difficulty levels, or let bots fill empty seats online.",
    ],
  },
  {
    heading: "Learning the game",
    items: [
      "A full tutorial with over a dozen lessons that teach you to play as a Sheep and as a Wolf.",
      "A Learn panel that explains every unit, farm, and spell.",
      "Beginner-friendly building and camera controls, plus visual aids like grids and placement grids. Many more settings let you set up the game the way you like.",
    ],
  },
  {
    heading: "Price and platforms",
    items: [
      "Free-to-play and never pay-to-win. The optional Supporter Pack DLC adds cosmetics and profile features, and doubles the Wool and XP you earn. Wool and XP only unlock cosmetics and profile features like avatar icons and highlights.",
      "Native on Windows, macOS, and Linux.",
      "A 17-track original soundtrack, available on Steam.",
    ],
  },
  {
    heading: "Progression",
    items: [
      "Earn experience and level up from every game you play.",
      "Medals for feats like double captures, triple captures, and saving sprees. The Medal Case tracks every medal you earn.",
      "Achievements that unlock in game and on Steam.",
      "Leaderboards, both global and against your Steam friends.",
      "A profile that shows your level, stats, playstyle, medals, recent games, and highlights.",
      "Over 100 avatar icons to unlock by playing, and a Pack Tag to show next to your name.",
    ],
  },
  {
    heading: "Reports and replays",
    items: [
      "A report after every round with each player's stats, medals, and a timeline of captures, saves, and other big moments.",
      "A game report that compares every player, grades your game, names your playstyle, and shows the experience and Wool you earned.",
      "Save any game as a replay. Watch it from any player's view, change the speed, and jump to any moment.",
      "Save clips of your best plays, export them as video files, and show them as highlights on your profile. Recent community highlights show on the home screen.",
    ],
  },
  {
    heading: "Wardrobe and themes",
    items: [
      "The Wardrobe has hats and shoes for your Sheep, and furs and outfits for your Werewolf and Pack Wolf. Pay with Wool, which you earn by playing or can buy on Steam.",
      "Ten interface themes, from light to dark.",
    ],
  },
  {
    heading: "Level editor",
    items: [
      "A built-in level editor with tilesets, structures, doodads, terrain borders, and a mirror mode.",
      "Share terrains and rulesets on the Steam Workshop. Browse, rate, and download community terrains in game or on the website.",
    ],
  },
];

export const VIDEOS: Array<{ id: string; title: string }> = [
  { id: LINKS.trailerId, title: "Sheep Tag 2 - Official Gameplay Trailer (Early Access 2027)" },
  { id: LINKS.cinematicTrailerId, title: "Sheep Tag 2 - Cinematic Teaser Trailer" },
];

export const COVERAGE: Array<{ outlet: string; title: string; url: string; note: string }> = [
  {
    outlet: "WTii (YouTube)",
    title: "Sheep Tag 2 - interview & gameplay showcase",
    url: "https://www.youtube.com/watch?v=ZGcLcwCXzj0",
    note: "Warcraft III YouTuber WTii interviews Jeff about the history of Sheep Tag and the making of Sheep Tag 2.",
  },
];

export const MONETIZATION =
  "Luna Wolf Studios allows anyone to publish and monetize videos and streams of Sheep Tag 2 on YouTube, Twitch, and similar services. Let's Plays, streams, and reviews are all welcome. Please link to sheeptag2.com with your content.";

export const ADDITIONAL_LINKS: Array<{ label: string; url: string; note: string }> = [
  { label: "Steam page", url: withUtm(LINKS.steam, "presskit"), note: "Wishlist Sheep Tag 2 on Steam" },
  { label: "Original Soundtrack", url: withUtm(LINKS.soundtrack, "presskit"), note: "The 17-track OST on Steam" },
  { label: "Kickstarter campaign", url: LINKS.kickstarter, note: "Campaign page, updates, and rewards. Funded in November 2021" },
  { label: "Discord", url: LINKS.discord, note: "The Sheep Tag 2 community server" },
  { label: "Steam Workshop", url: LINKS.workshop, note: "Terrains and rulesets shared from the level editor" },
  { label: "Terrain library", url: "https://www.sheeptag2.com/terrains", note: "Free community terrains to browse and download" },
  { label: "Guides", url: "https://www.sheeptag2.com/guides", note: "Illustrated guides to the roles, spells, farms, upgrades, and game modes" },
  { label: "Luna Wolf Studios press kit", url: LWS_PRESSKIT, note: "Studio logos and company info" },
];

export const ABOUT = [
  "Luna Wolf Studios is an independent game studio based in Delaware, USA. It makes Sheep Tag 2, the standalone successor to the Warcraft III mod Sheep Tag. The studio makes multiplayer games that are free-to-play and never pay-to-win, and builds them with feedback from its players.",
  "Co-founder Jeff is the only core developer on Sheep Tag 2 and works with a small group of artists, composers, and a sound designer.",
];

export const CREDITS: Array<{ name: string; role: string; note: string; url?: string; linkLabel?: string }> = [
  {
    name: "Jeff",
    role: "Creator - Design, Programming & Production",
    note: "Co-founder of Luna Wolf Studios and the game's only core developer. A Sheep Tag player since the early days of Warcraft III.",
  },
  {
    name: "Quaternius",
    role: "3D Art & Animation",
    note: "Renowned low-poly 3D artist behind the game's stylized models and animations.",
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
