/**
 * Choosing which terrains the home page shows off.
 *
 * Shared by the build (which renders a fixed set, so the section still reads without
 * JavaScript and for crawlers) and by the browser (which reshuffles on every load, so the
 * strip isn't the same three maps every visit).
 */

export interface TerrainPick {
  name: string;
  author: string;
  size: string;
  tileset: string;
  thumb: string;
  id: string;
}

const STUDIO = "Luna Wolf Studios";

/** Fisher-Yates on a copy, so the caller's array is left alone. */
export function shuffled<T>(items: T[], random: () => number = Math.random): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * A strip that says "community" should be community work, and should not be a dozen views of
 * the same pasture by the same author. So: community maps first, spreading across tilesets and
 * authors before doubling up on either, and only then the studio's own maps to fill.
 *
 * Pass a pre-shuffled pool to vary which maps come out; the spread rules still apply, so a
 * random set is still a varied one.
 */
export function pickFeatured(pool: TerrainPick[], slots: number): TerrainPick[] {
  const picks: TerrainPick[] = [];
  const tilesets = new Set<string>();
  const authors = new Set<string>();

  const take = (t: TerrainPick) => {
    picks.push(t);
    tilesets.add(t.tileset);
    authors.add(t.author);
  };

  const community = pool.filter((t) => t.author !== STUDIO);
  const rounds: Array<(t: TerrainPick) => boolean> = [
    (t) => !tilesets.has(t.tileset) && !authors.has(t.author),
    (t) => !tilesets.has(t.tileset),
    (t) => !authors.has(t.author),
    () => true,
  ];
  for (const fits of rounds) {
    for (const t of community) {
      if (picks.length >= slots) break;
      if (!picks.includes(t) && fits(t)) take(t);
    }
  }
  for (const t of pool) {
    if (picks.length >= slots) break;
    if (!picks.includes(t)) take(t);
  }
  return picks.slice(0, slots);
}
