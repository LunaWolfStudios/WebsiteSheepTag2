/**
 * Guides — the web edition of the in-game Learn screen.
 *
 * The prose and tooltip bodies here are the game's own copy, lifted from I18n.Learn and from
 * the stats assets the Learn screen reads (Assets/ScriptableObjects/**), so a section reads the
 * way the command card does. Leave that wording alone when editing; the site's own voice lives
 * in the section blurbs and the page intros, which are written for the web. Icons name files
 * under art/icons or farms/, copied out of the same project.
 *
 * What the web edition drops, on purpose: hotkeys, gold and mana costs, raw stat numbers,
 * and the tip library — those stay in game, where they're live and rebindable.
 */

export interface Entry {
  /** Title as the game writes it. */
  name: string;
  /** Tooltip body, as HTML (the game's rich text is already converted). */
  description: string;
  /** Filename under art/icons or farms/. */
  icon: string;
  /** Farms an upgrade-only farm grows out of — the Learn screen's upgrade path row. */
  from?: string[];
  /** Farms this one upgrades into — the tooltip's "Upgrades to" line. */
  upgradesTo?: string[];
}

export interface Section {
  slug: string;
  title: string;
  /** One line for the table of contents card and the page deck. */
  blurb: string;
  /** The small glyph, for the rail, the table of contents, and group headings. */
  icon: string;
  /**
   * The big icon beside the page's own title, when it should differ from the rail glyph. Roles
   * use their painted portrait here and keep the multiboard head in the rail; Farms takes the
   * build tab glyph in the rail, to sit with Spells, Potions and Upgrades, and leads with a
   * farm on the page itself.
   */
  headerIcon?: string;
  /** A duller second line under the page title, the way the game names each side. */
  kicker?: string;
  /** Which rail group the section belongs to. */
  group: "Start here" | "Roles" | "Reference";
}

/* -------------------------------------------------------------------------- */
/* Sections                                                                    */
/* -------------------------------------------------------------------------- */

export const SECTIONS: Section[] = [
  {
    slug: "basic-abilities",
    title: "Basic Abilities",
    blurb: "The commands most units share, from moving to queueing a whole plan.",
    icon: "UI_Icon_MouseRight.png",
    group: "Start here",
  },
  {
    slug: "resources-and-stats",
    title: "Resources and Stats",
    blurb: "Gold, health, mana and combat stats.",
    icon: "Icon_Gold.png",
    group: "Start here",
  },
  {
    slug: "day-and-night",
    title: "Day and Night",
    blurb: "The round timer turns from rooster to owl, and the field changes with it.",
    icon: "TimerPanel_OwlIcon.png",
    group: "Start here",
  },
  {
    slug: "game-modes",
    title: "Game Modes",
    blurb: "Classic, Switch, Vamp, VIP and Practice. Who hunts whom, and what a capture makes them.",
    icon: "UI_Icon_Flag.png",
    group: "Start here",
  },
  {
    slug: "sheep",
    title: "Sheep",
    kicker: "The Flock",
    blurb: "Build farms, use your size, and save allies from the pen.",
    icon: "MultiboardIcon_Sheep.png",
    headerIcon: "PortraitIcon_Sheep.png",
    group: "Roles",
  },
  {
    slug: "wolves",
    title: "Wolves",
    kicker: "The Pack",
    blurb: "Corner the Sheep, and grow stronger the longer the round runs.",
    icon: "MultiboardIcon_Wolf.png",
    headerIcon: "PortraitIcon_Werewolf.png",
    group: "Roles",
  },
  {
    slug: "spirits",
    title: "Spirits",
    kicker: "The Pen",
    blurb: "Caught is a change of role, not the end of the round.",
    icon: "MultiboardIcon_Spirit.png",
    group: "Roles",
  },
  {
    slug: "spells",
    title: "Spells",
    blurb: "The spells on each command card, side by side.",
    icon: "AbilityPanel_AbilityIcon_Pressed.png",
    group: "Reference",
  },
  {
    slug: "farms",
    title: "Farms",
    blurb: "The Sheep build menu, the upgrade paths out of it, and the farms they lead to.",
    icon: "AbilityPanel_BuildIcon_Pressed.png",
    headerIcon: "Icon_StrawFarm.png",
    group: "Reference",
  },
  {
    slug: "potions",
    title: "Potions",
    blurb: "Brews a Wolf buys with gold for the moment it needs an edge.",
    icon: "AbilityPanel_ShopIcon_Pressed.png",
    group: "Reference",
  },
  {
    slug: "upgrades",
    title: "Upgrades",
    blurb: "Permanent stat upgrades Wolves can purchase with gold.",
    icon: "AbilityPanel_InventoryIcon_Pressed.png",
    group: "Reference",
  },
];

/** The guides hub, listed first in the rail so a section page can get back to it. */
export const OVERVIEW: Section = {
  slug: "",
  title: "Overview",
  blurb: "How a round plays, the three roles, and the way into the other sections.",
  icon: "UI_Icon_Book.png",
  group: "Start here",
};

export const SECTION_GROUPS = ["Start here", "Roles", "Reference"] as const;

/** Overview first, then every section page. This is what the rail and the menus list. */
export const NAV_SECTIONS: Section[] = [OVERVIEW, ...SECTIONS];

export const sectionHref = (section: Section) =>
  section.slug ? `/guides/${section.slug}` : "/guides";

export const sectionBySlug = (slug: string): Section => {
  const s = SECTIONS.find((x) => x.slug === slug);
  if (!s) throw new Error(`Unknown guide section "${slug}"`);
  return s;
};

/* -------------------------------------------------------------------------- */
/* Overview — I18n.Learn                                                       */
/* -------------------------------------------------------------------------- */

export const WELCOME = "Welcome to Sheep Tag 2";
export const TAGLINE = "Sheep survive. Wolves hunt.";

export const ROUND_LOOP_HEADING = "How a Round Plays";
export const ROUND_LOOP_FOOTER = "Teams swap sides each round.";

/** The three beats of a round, read left to right with an arrow between each. */
export const ROUND_LOOP: Array<{ title: string; caption: string; icon: string }> = [
  { title: "Survive the timer", caption: "Wolves must catch every Sheep", icon: "MultiboardIcon_Clock.png" },
  { title: "Caught? Become a Spirit", caption: "You're down, not out", icon: "MultiboardIcon_Spirit.png" },
  { title: "Allies can save you", caption: "Back in the round", icon: "MultiboardIcon_SavesRevive.png" },
];

export const LEARN_MORE_HEADING = "Pick a role to learn more";

/**
 * One line under each role tile, in the Learn screen's tab order. These wear the multiboard
 * heads rather than the painted portraits, so all three sit in their disc the same way.
 */
export const ROLE_TILES: Array<{ slug: string; title: string; caption: string; icon: string }> = [
  { slug: "sheep", title: "Sheep", caption: "Build farms and save allies", icon: "MultiboardIcon_Sheep.png" },
  { slug: "wolves", title: "Wolves", caption: "Hunt and capture", icon: "MultiboardIcon_Wolf.png" },
  { slug: "spirits", title: "Spirits", caption: "Caught, waiting for a save", icon: "MultiboardIcon_Spirit.png" },
];

/* -------------------------------------------------------------------------- */
/* Roles                                                                       */
/* -------------------------------------------------------------------------- */

export const FLOCK_HEADING = "The Flock";
export const FLOCK_BODY = [
  "As Sheep the objective is to not get captured by the Wolves. The best way to do that is by building farms, and using size as an advantage. The Sheep are smaller than the Wolves so they fit in tighter spaces, enabling them to build in a grid-like fashion to freely move about their defenses.",
  "Farms are the whole defense. Build them into dense grids that stall the pack, destroy one when it boxes you in, and build on top of yourself to hop over the farms in your way. Sheep look after each other too. Bridge out to an ally who is cut off, free the Spirits waiting in the pen, and call out where the Wolves are hunting.",
];

export const PACK_HEADING = "The Pack";
export const PACK_BODY = [
  "The primary goal for the Wolf team is to capture all the Sheep. This means Wolves need to work together to corner each Sheep, because once the Sheep has no place to go, capture is inevitable.",
  "A Wolf gets stronger over the round. Trade your Gold for permanent upgrades, use potions to gain an edge when you need it, and summon Pack Wolves to hunt alongside you. Phase Shift moves the Wolf sideways through a farm, a fence, or a cliff edge, so a line of farms is never the barrier it looks like.",
];

export const PEN_HEADING = "The Pen";
export const PEN_BODY = [
  "Capture isn't the end of the round, it's a change of role. A captured Sheep loses every farm it built and returns as a Spirit inside the pen, waiting to be saved.",
  "A Spirit is saved when a living Sheep attacks it. One attack sets the teammate free, rewards the saver with Gold, and brings a Sheep back into play. Spirits drift slowly, so waiting at the edge of the pen nearest your rescuers makes every save faster.",
  "Spirits can still help the flock by sharing Gold with living allies, calling out Wolf movement, and staying alert for a chance to be saved by a teammate. In Switch and Vamp modes, capture works differently and there are no Spirits.",
];

/* -------------------------------------------------------------------------- */
/* Basic abilities — the standing orders every unit shares                     */
/* -------------------------------------------------------------------------- */

export const BASIC_CONTROLS_HEADING = "Basic Controls";
export const BASIC_CONTROLS_BODY = "Most units share the same basic commands.";

export const BASIC_ABILITIES: Entry[] = [
  {
    name: "Move",
    description: "Right-click anywhere and your unit finds its way there. It works on the minimap too.",
    icon: "UI_Icon_MouseRight.png",
  },
  { name: "Attack", description: "Orders this unit to attack a given area or target.", icon: "Icon_Attack.png" },
  {
    name: "Stop",
    description: "Orders this unit to stop and stand its ground, attacking any enemy that comes within range.",
    icon: "Icon_Stop.png",
  },
  { name: "Hold", description: "Orders this unit to immediately stop all actions.", icon: "Icon_Hold.png" },
  {
    name: "Patrol",
    description: "Orders this unit to move back and forth between selected points, attacking enemies encountered.",
    icon: "Icon_Patrol.png",
  },
  {
    name: "Queue",
    // The game names the binding here; on the web the key is left to the player's own settings.
    description: "Hold the queue key while ordering to chain moves, builds, and attacks into one plan.",
    icon: "UI_Icon_InputKeyboard.png",
  },
];

/* -------------------------------------------------------------------------- */
/* Resources and stats                                                         */
/* -------------------------------------------------------------------------- */

export const RESOURCES_HEADING = "Resources and Stats";
export const RESOURCES_BODY = "These are displayed across the HUD while you play.";

/** Read in the order the stat panel lists them, each row paired with its own icon. */
export const STATS: Entry[] = [
  {
    name: "Gold",
    description:
      "The currency of the round. It trickles in while you are alive and buys farms for the flock or upgrades and potions for the pack.",
    icon: "Icon_Gold.png",
  },
  {
    name: "Health",
    description:
      "How much damage a unit takes before it falls. Farms carry their own health, so a Wolf has to break one down to get through it.",
    icon: "Icon_HealthCapacityStat.png",
  },
  {
    name: "Mana",
    description:
      "The fuel for spells. It refills on its own, so spending it all at once means waiting to cast again.",
    icon: "Icon_ManaCapacityStat.png",
  },
  {
    name: "Attack",
    description:
      "The damage every swing lands. It is what tears farms down and what frees a Spirit from the pen.",
    icon: "Icon_AttackDamageStat.png",
  },
  {
    name: "Attack Speed",
    description: "How quickly those swings come. The faster they land, the sooner a farm gives way.",
    icon: "Icon_AttackSpeedStat.png",
  },
  {
    name: "Armor",
    description: "How much of each hit is shrugged off. The more you carry, the less the same swing hurts.",
    icon: "Icon_ArmorStat.png",
  },
  {
    name: "Movement Speed",
    description:
      "How fast a unit crosses the terrain. It affects how quickly a unit can pursue or escape, while effects like mud and ice can slow or alter it.",
    icon: "Icon_MoveSpeedStat.png",
  },
];

/* -------------------------------------------------------------------------- */
/* Day and night                                                               */
/* -------------------------------------------------------------------------- */

export const DAY_NIGHT_HEADING = "Day and Night";
export const DAY_NIGHT_BODY =
  "The round timer at the top of the screen turns from rooster to owl, and the field changes with it.";

export const DAY_NIGHT: Entry[] = [
  { name: "Day", description: "The rooster's hours. Everyone sees at their full range.", icon: "TimerPanel_RoosterIcon.png" },
  {
    name: "Night",
    description: "The owl's hours. Every Sheep's sight draws in while wolf eyes stay sharp.",
    icon: "TimerPanel_OwlIcon.png",
  },
  {
    name: "Moonlight",
    description:
      "This unit is empowered by the night. Every Wolf carries it from dusk to dawn, so the dark belongs to the pack.",
    icon: "StatusEffect_Moonlight.png",
  },
];

/* -------------------------------------------------------------------------- */
/* Spells                                                                      */
/* -------------------------------------------------------------------------- */

export const SHEEP_SPELLS: Entry[] = [
  {
    name: "Detect Sheep",
    description: "Pings every living ally Sheep on the map and minimap, visible only to you. Never marks a decoy.",
    icon: "Icon_DetectSheep.png",
  },
  {
    name: "Remove Last Farm",
    description: "Removes the last farm this unit created. No gold is refunded.",
    icon: "Icon_RemoveLastFarm.png",
  },
  {
    name: "Translocate",
    description:
      "Teleports this unit forward, passing through solid objects such as farms and walls within a limited range.",
    icon: "Icon_Translocate.png",
  },
];

export const WOLF_SPELLS: Entry[] = [
  {
    name: "Summon Ward",
    description: "Places a ward that grants sight in the target area. Reveals invisible units.",
    icon: "Icon_SentryWard.png",
  },
  {
    name: "Phase Shift",
    description:
      "Teleports this unit laterally, passing through solid objects such as farms and walls within a limited range. The unit will always be teleported the max distance within the limited range.",
    icon: "Icon_PhaseShift.png",
  },
  {
    name: "Target Sheep",
    description: "Automatically target a nearby sheep for this units next attack.",
    icon: "Icon_TargetSheep.png",
  },
  {
    name: "Summon Pack Wolf",
    description:
      "Summons a pack wolf, which can be used to capture enemies. Can be summoned over obstacles, such as farms and walls, within a limited range.",
    icon: "PortraitIcon_Wolf.png",
  },
  {
    name: "Lunar Strike",
    description:
      "Calls a meteor down on a target area. It explodes on impact, damaging surrounding farms and felling trees for good. Damages structures only.",
    icon: "Icon_LunarStrike.png",
  },
  {
    name: "Snare Trap",
    description: "Places a snare trap at the target location. Trapping an invisible unit reveals it.",
    icon: "Icon_SnareTrap.png",
  },
  {
    name: "Detect Sheep",
    description:
      "Pings every enemy Sheep on the map and minimap, even those hidden in the fog, for you and every ally Wolf.",
    icon: "Icon_DetectSheep.png",
  },
];

export const SPIRIT_SPELLS: Entry[] = [
  {
    name: "Give Gold",
    description:
      "Split your gold with living Sheep allies, keeping an even share. Use again to give away the rest. To give a single ally, select them then reselect this unit.",
    icon: "Icon_Gold.png",
  },
  {
    name: "Detect Sheep",
    description: "Pings every living ally Sheep on the map and minimap, visible only to you. Never marks a decoy.",
    icon: "Icon_DetectSheep.png",
  },
];

/** The spells a Magic Farm casts — a farm that carries a command card of its own. */
export const MAGIC_FARM_SPELLS: Entry[] = [
  {
    name: "Clone Sheep",
    description:
      "Creates a Decoy Sheep that perfectly mimics the appearance of the target Sheep. Decoys can move and dance, but cannot build or attack.",
    icon: "PortraitIcon_Sheep.png",
  },
  {
    name: "Invisibility",
    description:
      "Turns the target ally unit invisible. Attacking, building, or casting a spell removes the invisibility. Invisible units can still be detected by wards.",
    icon: "Icon_DetectSheep.png",
  },
  {
    name: "Bloodlust",
    description: "Drives an ally moving unit into a frenzy, increasing its attack and movement speed for the duration.",
    icon: "Icon_Bloodlust.png",
  },
];

/** Every farm answers to this, so it reads once rather than on all twenty-two cards. */
export const DESTROY_FARM: Entry = {
  name: "Destroy Farm",
  description: "Destroys this farm immediately. No gold is refunded.",
  icon: "Icon_DestroyFarm.png",
};

/* -------------------------------------------------------------------------- */
/* Potions                                                                     */
/* -------------------------------------------------------------------------- */

export const POTIONS: Entry[] = [
  { name: "Mana Potion", description: "Arcane motes pour mana back into this unit.", icon: "Icon_ManaPotion.png" },
  { name: "Speed Potion", description: "This unit is quickened, moving and striking faster.", icon: "Icon_SpeedPotion.png" },
  {
    name: "Strength Potion",
    description: "This unit is swollen with strength, and its swings hit far harder.",
    icon: "Icon_StrengthPotion.png",
  },
  {
    name: "Invincible Potion",
    description:
      "Grants invulnerability and removes all negative effects for a short duration. Consuming another refreshes the duration.",
    icon: "Icon_InvinciblePotion.png",
  },
  {
    name: "Invisible Potion",
    description:
      "Renders you invisible until you attack, use an ability, or the effect expires. Enemies with true sight can detect you. Consuming another refreshes the duration.",
    icon: "Icon_InvisPotion.png",
  },
];

/* -------------------------------------------------------------------------- */
/* Upgrades                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * The permanent buys on the Wolf's upgrade card. In game each one reads as a bare stat line,
 * so the web edition borrows the stat's own description from Resources and Stats instead —
 * same words, no numbers.
 */
export const UPGRADES: Entry[] = [
  {
    name: "Attack Damage",
    description: "The damage every swing lands. It is what tears farms down and what frees a Spirit from the pen.",
    icon: "Icon_AttackDamageStat.png",
  },
  {
    name: "Attack Speed",
    description: "How quickly those swings come. The faster they land, the sooner a farm gives way.",
    icon: "Icon_AttackSpeedStat.png",
  },
  {
    name: "Movement Speed",
    description:
      "How fast a unit crosses the terrain. It affects how quickly a unit can pursue or escape, while effects like mud and ice can slow or alter it.",
    icon: "Icon_MoveSpeedStat.png",
  },
  {
    name: "Mana Capacity",
    description: "The fuel for spells. A deeper pool means more casts before you have to wait.",
    icon: "Icon_ManaCapacityStat.png",
  },
  {
    name: "Mana Regeneration",
    description: "Mana refills on its own. The faster it comes back, the shorter the wait between casts.",
    icon: "Icon_ManaRegenStat.png",
  },
  {
    name: "Armor",
    description: "How much of each hit is shrugged off. The more you carry, the less the same swing hurts.",
    icon: "Icon_ArmorStat.png",
  },
  {
    name: "Health Capacity",
    description: "How much damage a unit takes before it falls. A deeper pool buys more time under fire.",
    icon: "Icon_HealthCapacityStat.png",
  },
  {
    name: "Health Regeneration",
    description: "Health comes back on its own. The faster it returns, the less of the round you spend recovering.",
    icon: "Icon_HealthRegenStat.png",
  },
];

/* -------------------------------------------------------------------------- */
/* Farms                                                                       */
/* -------------------------------------------------------------------------- */

export const UPGRADED_FARMS_INTRO = "To upgrade a Farm select it and choose an available upgrade.";

/**
 * Farm structure only. Descriptions live in farms/descriptions.tsv and reach the page through
 * the generated farms.json, so there is one place to edit a farm's tooltip text.
 */
export interface FarmRef {
  name: string;
  icon: string;
  /** Farms this one grows out of, for the upgrade path row. */
  from?: string[];
  /** Farms it upgrades into, for the tooltip's "Upgrades to" line. */
  upgradesTo?: string[];
}

/** The Sheep build menu, in the order the command card lays it out. */
export const BUILDABLE_FARMS: FarmRef[] = [
  { name: "Straw Farm", icon: "Icon_StrawFarm.png", upgradesTo: ["Stick Farm", "Invisible Farm", "Illusion Farm"] },
  { name: "Stick Farm", icon: "Icon_StickFarm.png", upgradesTo: ["Stone Farm"] },
  { name: "Stone Farm", icon: "Icon_StoneFarm.png" },
  { name: "Tiny Farm", icon: "Icon_TinyFarm.png", upgradesTo: ["Invisible Tiny Farm", "Illusion Tiny Farm"] },
  { name: "Wide Farm", icon: "Icon_WideFarm.png", upgradesTo: ["Invisible Wide Farm", "Illusion Wide Farm"] },
  { name: "Hard Farm", icon: "Icon_HardFarm.png", upgradesTo: ["Invisible Hard Farm", "Illusion Hard Farm"] },
  { name: "Sentry Farm", icon: "Icon_SentryFarm.png" },
  { name: "Stack Farm", icon: "Icon_StackFarm.png" },
  { name: "Savings Farm", icon: "Icon_SavingsFarm.png", upgradesTo: ["Super Savings Farm"] },
  { name: "Aura Farm", icon: "Icon_AuraFarm.png" },
  { name: "Invisible Farm", icon: "Icon_InvisibleFarm.png", upgradesTo: ["Magic Farm"] },
  { name: "Mud Farm", icon: "Icon_MudFarm.png" },
];

/** The farms no build menu offers. Each one grows out of a farm already on the field. */
export const UPGRADE_FARMS: FarmRef[] = [
  { name: "Illusion Farm", icon: "Icon_IllusionStrawFarm.png", from: ["Straw Farm"] },
  { name: "Illusion Hard Farm", icon: "Icon_IllusionHardFarm.png", from: ["Hard Farm"] },
  { name: "Illusion Tiny Farm", icon: "Icon_IllusionTinyFarm.png", from: ["Tiny Farm"] },
  { name: "Illusion Wide Farm", icon: "Icon_IllusionWideFarm.png", from: ["Wide Farm"] },
  { name: "Invisible Hard Farm", icon: "Icon_InvisibleHardFarm.png", from: ["Hard Farm"] },
  { name: "Invisible Tiny Farm", icon: "Icon_InvisibleTinyFarm.png", from: ["Tiny Farm"], upgradesTo: ["Tiny Magic Farm"] },
  { name: "Invisible Wide Farm", icon: "Icon_InvisibleWideFarm.png", from: ["Wide Farm"] },
  { name: "Magic Farm", icon: "Icon_MagicFarm.png", from: ["Invisible Farm"] },
  { name: "Super Savings Farm", icon: "Icon_SuperSavingsFarm.png", from: ["Savings Farm"] },
  { name: "Tiny Magic Farm", icon: "Icon_MagicFarm.png", from: ["Invisible Tiny Farm"] },
];

/** Every farm by name, so the upgrade tree can look one up by the title in a path. */
export const FARM_BY_NAME: Record<string, FarmRef> = Object.fromEntries(
  [...BUILDABLE_FARMS, ...UPGRADE_FARMS].map((f) => [f.name, f]),
);

/**
 * The build menu's upgrade tree, read off each farm's own upgrade spells. A root is a farm
 * you can build outright; each chain is one road out of it, followed to its dead end.
 */
export const UPGRADE_TREE: Array<{ root: string; chains: string[][] }> = [
  {
    root: "Straw Farm",
    chains: [["Stick Farm", "Stone Farm"], ["Invisible Farm", "Magic Farm"], ["Illusion Farm"]],
  },
  { root: "Tiny Farm", chains: [["Invisible Tiny Farm", "Tiny Magic Farm"], ["Illusion Tiny Farm"]] },
  { root: "Wide Farm", chains: [["Invisible Wide Farm"], ["Illusion Wide Farm"]] },
  { root: "Hard Farm", chains: [["Invisible Hard Farm"], ["Illusion Hard Farm"]] },
  { root: "Savings Farm", chains: [["Super Savings Farm"]] },
];

/* -------------------------------------------------------------------------- */
/* Game modes                                                                  */
/* -------------------------------------------------------------------------- */

export interface FlowGlyph {
  icon: string;
  /** Overlaid above the head, the way the VIP wears its crown. */
  crown?: string;
  alt: string;
}

export interface GameMode {
  title: string;
  body: string;
  /** The mode told in glyphs before it is told in words. */
  flow: FlowGlyph[];
  /** The glyph between each step: an arrow unless the mode is a trade or a hand of units. */
  separator: "arrow" | "swap" | "plus";
}

export const GAME_MODES: GameMode[] = [
  {
    title: "Classic",
    body: "The game as we remember it. Sheep build farms and survive the round timer, Wolves capture every last one of them. Captured Sheep become Spirits that living Sheep can save.",
    flow: [
      { icon: "MultiboardIcon_Wolf.png", alt: "Wolf" },
      { icon: "MultiboardIcon_KillCapture1.png", alt: "Captured Sheep" },
      { icon: "MultiboardIcon_Spirit.png", alt: "Spirit" },
    ],
    separator: "arrow",
  },
  {
    title: "Switch",
    body: "Tagging a Sheep trades places with it. The Sheep player becomes a Wolf back at the pen, while the Wolf takes control of the Sheep. The round goes to whoever spent the longest time as a Sheep.",
    flow: [
      { icon: "MultiboardIcon_Sheep.png", alt: "Sheep" },
      { icon: "MultiboardIcon_Wolf.png", alt: "Wolf" },
    ],
    separator: "swap",
  },
  {
    title: "Vamp",
    body: "There are no saves. Every captured Sheep joins the pack, and the flock shrinks until nobody is left or the clock runs out.",
    flow: [
      { icon: "MultiboardIcon_Wolf.png", alt: "Wolf" },
      { icon: "MultiboardIcon_KillCapture1.png", alt: "Captured Sheep" },
      { icon: "MultiboardIcon_Wolf.png", alt: "Wolf" },
    ],
    separator: "arrow",
  },
  {
    title: "VIP",
    body: "One crowned Sheep is the VIP. The flock wins by keeping the VIP alive until the timer runs out, while losing the VIP immediately ends the round.",
    flow: [
      { icon: "MultiboardIcon_Wolf.png", alt: "Wolf" },
      { icon: "MultiboardIcon_Sheep.png", crown: "MultiboardIcon_VIP.png", alt: "The VIP Sheep" },
      { icon: "MultiboardIcon_Wolf.png", crown: "MultiboardIcon_VIP.png", alt: "The Wolf that takes the VIP" },
    ],
    separator: "arrow",
  },
  {
    title: "Practice",
    body: "A no-pressure game for practicing your skills. You control a Sheep, a Wolf, and a Spirit all at once, and Wolves can chase and tag without ever capturing. Practice jumps, farm tricks, and rescues freely.",
    flow: [
      { icon: "MultiboardIcon_Sheep.png", alt: "Sheep" },
      { icon: "MultiboardIcon_Wolf.png", alt: "Wolf" },
      { icon: "MultiboardIcon_Spirit.png", alt: "Spirit" },
    ],
    separator: "plus",
  },
];

export const SEPARATOR_ICON: Record<GameMode["separator"], string> = {
  arrow: "UI_Icon_ArrowRight.png",
  swap: "UI_Icon_Swap.png",
  plus: "UI_Icon_Plus.png",
};
