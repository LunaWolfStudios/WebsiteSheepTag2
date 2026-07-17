/**
 * Prebuild data generator (WEBSITE_PROPOSAL.md §7 & §8).
 * - farms.json      : parsed from farms/descriptions.tsv, joined to icons, curated order.
 * - terrains.list.json : lightweight fallback list (filenames + byte sizes ONLY — no
 *   images, no metadata). The Terrains page parses previews/metadata live at runtime.
 */
import { readFile, writeFile, readdir, stat, mkdir, copyFile, rm } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const ROOT = process.cwd();
const TSV = path.join(ROOT, "farms", "descriptions.tsv");
const TERRAINS_DIR = path.join(ROOT, "terrains");
const DATA_DIR = path.join(ROOT, "src", "data");
const PUBLIC_DIR = path.join(ROOT, "public");

/** Exact farm name -> icon file (§8). Two farms intentionally reuse an icon. */
const ICON_BY_NAME: Record<string, string> = {
  "Aura Farm": "Icon_AuraFarm.png",
  "Hard Farm": "Icon_HardFarm.png",
  "Illusion Farm": "Icon_IllusionStrawFarm.png",
  "Illusion Hard Farm": "Icon_IllusionHardFarm.png",
  "Illusion Tiny Farm": "Icon_IllusionTinyFarm.png",
  "Illusion Wide Farm": "Icon_IllusionWideFarm.png",
  "Invisible Farm": "Icon_InvisibleFarm.png",
  "Invisible Hard Farm": "Icon_InvisibleHardFarm.png",
  "Invisible Tiny Farm": "Icon_InvisibleTinyFarm.png",
  "Invisible Wide Farm": "Icon_InvisibleWideFarm.png",
  "Magic Farm": "Icon_MagicFarm.png",
  "Mud Farm": "Icon_MudFarm.png",
  "Savings Farm": "Icon_SavingsFarm.png",
  "Sentry Farm": "Icon_SentryFarm.png",
  "Stack Farm": "Icon_StackFarm.png",
  "Stick Farm": "Icon_StickFarm.png",
  "Stone Farm": "Icon_StoneFarm.png",
  "Straw Farm": "Icon_StrawFarm.png",
  "Super Savings Farm": "Icon_SavingsFarm.png",
  "Tiny Farm": "Icon_TinyFarm.png",
  "Tiny Magic Farm": "Icon_MagicFarm.png",
  "Wide Farm": "Icon_WideFarm.png",
};

/** Curated gameplay order (§14B-E): base progression first, then variants. */
const ORDER = [
  "Straw Farm", "Stick Farm", "Stone Farm", "Tiny Farm", "Wide Farm", "Hard Farm",
  "Sentry Farm", "Stack Farm", "Savings Farm", "Super Savings Farm", "Mud Farm",
  "Aura Farm", "Invisible Farm", "Magic Farm",
  "Illusion Farm", "Illusion Tiny Farm", "Illusion Wide Farm", "Illusion Hard Farm",
  "Invisible Tiny Farm", "Invisible Wide Farm", "Invisible Hard Farm", "Tiny Magic Farm",
];

const VARIANT = /^(Illusion |Invisible (Hard|Tiny|Wide)|Tiny Magic)/;

function unityRichToHtml(s: string): string {
  return s
    .replace(/<color=#([0-9a-fA-F]{6})(?:[0-9a-fA-F]{2})?>/g, '<span style="color:#$1">')
    .replace(/<\/color>/g, "</span>")
    .replace(/<(\/?)(b|i)>/g, "<$1$2>")
    .replace(/<\/?(size|material|quad)[^>]*>/g, "");
}

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const orderIndex = (name: string) => {
  const i = ORDER.indexOf(name);
  return i === -1 ? 999 : i;
};
const humanBytes = (n: number) =>
  n < 1024 ? `${n} B` : n < 1048576 ? `${Math.round(n / 1024)} KB` : `${(n / 1048576).toFixed(1)} MB`;

async function buildFarms() {
  const raw = await readFile(TSV, "utf8");
  const farms = raw
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0)
    .map((line) => {
      const [name, description] = line.split("\t");
      const clean = name.trim();
      return {
        name: clean,
        slug: slugify(clean),
        description: unityRichToHtml((description ?? "").trim()),
        icon: ICON_BY_NAME[clean] ?? null,
        variant: VARIANT.test(clean),
      };
    })
    .sort((a, b) => orderIndex(a.name) - orderIndex(b.name));

  const missing = farms.filter((f) => !f.icon).map((f) => f.name);
  if (missing.length) console.warn("[build] farms missing an icon mapping:", missing);

  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(path.join(DATA_DIR, "farms.json"), JSON.stringify(farms, null, 2));
  console.log(`[build] farms.json — ${farms.length} farms`);
}

interface TerrainMeta {
  Name?: string;
  Author?: string;
  Version?: unknown;
  Description?: string;
  PreviewImage?: string;
}

/** Extract just the Metadata object + Width/Length without parsing the huge TileData array. */
function parseTerrain(text: string): { m: TerrainMeta; width: number | null; length: number | null } {
  const ki = text.indexOf('"Metadata"');
  if (ki < 0) throw new Error("no Metadata block");
  const open = text.indexOf("{", ki + 10);
  let depth = 0, inStr = false, esc = false, end = -1;
  for (let i = open; i < text.length; i++) {
    const ch = text[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === '"') inStr = false;
    } else if (ch === '"') inStr = true;
    else if (ch === "{") depth++;
    else if (ch === "}") { depth--; if (depth === 0) { end = i + 1; break; } }
  }
  if (end === -1) throw new Error("Metadata not closed");
  const m = JSON.parse(text.slice(open, end)) as TerrainMeta;
  const wl = text.slice(end, end + 400).match(/"Width":(\d+),"Length":(\d+)/);
  return { m, width: wl ? +wl[1] : null, length: wl ? +wl[2] : null };
}

/**
 * Build the terrain manifest: parse each file's metadata, write its preview to a
 * thumbnail, and copy the file into public/ for download. Runs on every build so a
 * merged/deployed terrain is picked up automatically.
 */
async function buildTerrains() {
  const THUMBS = path.join(PUBLIC_DIR, "terrain-thumbs");
  const DOWNLOADS = path.join(PUBLIC_DIR, "terrains");
  // Start from a clean slate so removed/renamed terrains don't leave stale outputs behind.
  await rm(THUMBS, { recursive: true, force: true });
  await rm(DOWNLOADS, { recursive: true, force: true });
  await mkdir(DATA_DIR, { recursive: true });
  await mkdir(THUMBS, { recursive: true });
  await mkdir(DOWNLOADS, { recursive: true });

  const files = (await readdir(TERRAINS_DIR))
    .filter((f) => f.toLowerCase().endsWith(".json"))
    .sort((a, b) => a.localeCompare(b));

  const seen = new Set<string>();
  const terrains = [];
  let thumbs = 0;

  for (const file of files) {
    const full = path.join(TERRAINS_DIR, file);
    const buf = await readFile(full);
    const text = buf.toString("utf8");
    let parsed;
    try {
      parsed = parseTerrain(text);
    } catch (e) {
      console.warn(`[build] skipping ${file}: ${(e as Error).message}`);
      continue;
    }
    const m = parsed.m;
    let slug = slugify(m.Name || file.replace(/\.json$/i, ""));
    while (seen.has(slug)) slug += "-x";
    seen.add(slug);

    if (m.PreviewImage) {
      await writeFile(path.join(THUMBS, `${slug}.jpg`), Buffer.from(m.PreviewImage, "base64"));
      thumbs++;
    }
    await copyFile(full, path.join(DOWNLOADS, file));
    const bytes = (await stat(full)).size;

    terrains.push({
      slug,
      name: m.Name ?? file.replace(/\.json$/i, ""),
      author: m.Author ?? "Unknown",
      version: String(m.Version ?? ""),
      description: m.Description ?? "",
      size: parsed.width && parsed.length ? `${parsed.width}×${parsed.length}` : "",
      thumb: m.PreviewImage ? `/terrain-thumbs/${slug}.jpg` : null,
      download: `/terrains/${encodeURIComponent(file)}`,
      file,
      bytes,
      fileSize: humanBytes(bytes),
      // Content-addressed id (same JSON bytes → same id): stable shareable URLs
      // and fast duplicate detection. A new version of a map yields a new id.
      id: createHash("sha256").update(buf).digest("hex").slice(0, 16),
    });
  }

  terrains.sort((a, b) => a.name.localeCompare(b.name));
  await writeFile(
    path.join(DATA_DIR, "terrains.json"),
    JSON.stringify({ count: terrains.length, terrains }, null, 2),
  );
  console.log(`[build] terrains.json — ${terrains.length} terrains, ${thumbs} thumbnails, downloads copied`);
}

/** Serve the standalone easter-egg page from public/ (its deps live in public/history + public/assets). */
async function copyEasterEgg() {
  const dest = path.join(PUBLIC_DIR, "history");
  await mkdir(dest, { recursive: true });
  await copyFile(path.join(ROOT, "history", "east.html"), path.join(dest, "east.html"));
  console.log("[build] copied history/east.html → public/history/");
}

await buildFarms();
await buildTerrains();
await copyEasterEgg();
console.log("[build] done.");
