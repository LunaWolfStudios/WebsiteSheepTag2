/**
 * Prebuild data generator (WEBSITE_PROPOSAL.md §7 & §8).
 * - farms.json    : parsed from farms/descriptions.tsv, joined to icons, curated order.
 * - terrains.json : the terrain manifest — metadata read out of every .st2 archive in
 *   terrains/, with previews written to thumbnails and the archives copied into public/.
 */
import { readFile, writeFile, readdir, stat, mkdir, copyFile, rm } from "node:fs/promises";
import path from "node:path";
import { crc32 } from "node:zlib";
import {
  EXTENSION,
  St2Error,
  checkMetadata,
  checkTerrain,
  readArchive,
  tilesetName,
  verifyContentHash,
} from "../src/lib/st2.ts";

const ROOT = process.cwd();
const TSV = path.join(ROOT, "farms", "descriptions.tsv");
const TERRAINS_DIR = path.join(ROOT, "terrains");
const DATA_DIR = path.join(ROOT, "src", "data");
const PUBLIC_DIR = path.join(ROOT, "public");

/** Exact farm name -> icon file (§8). The Tiny Magic Farm shares the Magic Farm's icon, as in game. */
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
  "Super Savings Farm": "Icon_SuperSavingsFarm.png",
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

/**
 * Build the terrain manifest: read each archive's metadata, write its preview to a
 * thumbnail, and copy the archive into public/ for download. Runs on every build so a
 * merged/deployed terrain is picked up automatically.
 *
 * A map whose content hash doesn't verify was hand-edited outside the level editor, so it is
 * left out — the same bar the submission form holds uploads to.
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
    .filter((f) => f.toLowerCase().endsWith(EXTENSION))
    .sort((a, b) => a.localeCompare(b));

  const seen = new Set<string>();
  const terrains = [];
  let thumbs = 0;
  let skipped = 0;

  for (const file of files) {
    const full = path.join(TERRAINS_DIR, file);
    const skip = (why: string) => {
      console.warn(`[build] skipping ${file}: ${why}`);
      skipped++;
    };

    let archive;
    try {
      archive = await readArchive(await readFile(full));
    } catch (e) {
      skip(e instanceof St2Error ? e.message : `unreadable archive (${(e as Error).message})`);
      continue;
    }

    const m = archive.metadata;
    const problem = checkMetadata(m) ?? checkTerrain(archive);
    if (problem) {
      skip(problem);
      continue;
    }
    if (!(await verifyContentHash(archive))) {
      skip("content hash doesn't match — the map was edited outside the level editor");
      continue;
    }

    let slug = slugify(m.Name || file.replace(/\.st2$/i, ""));
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
      name: String(m.Name),
      author: String(m.Author),
      version: String(m.Version ?? ""),
      description: m.Description ?? "",
      size: `${archive.terrain.Width}×${archive.terrain.Length}`,
      tileset: tilesetName(m.TilesetId),
      tags: Array.isArray(m.Tags) ? m.Tags.map(String) : [],
      gameVersion: m.SupportedGameVersion ?? "",
      thumb: m.PreviewImage ? `/terrain-thumbs/${slug}.jpg` : null,
      download: `/terrains/${encodeURIComponent(file)}`,
      file,
      bytes,
      fileSize: humanBytes(bytes),
      // The level editor's content hash doubles as the id: content-addressed, so it gives
      // stable shareable URLs and exact duplicate detection, and a re-save yields a new id.
      id: String(m.ContentHash),
    });
  }

  terrains.sort((a, b) => a.name.localeCompare(b.name));
  await writeFile(
    path.join(DATA_DIR, "terrains.json"),
    JSON.stringify({ count: terrains.length, terrains }, null, 2),
  );
  console.log(
    `[build] terrains.json — ${terrains.length} terrains, ${thumbs} thumbnails, downloads copied` +
      (skipped ? `, ${skipped} skipped` : ""),
  );
}

/**
 * Press-kit downloads (/presskit): original-resolution assets copied into public/press/
 * for direct links, plus ready-made .zip bundles. Press-friendly kebab-case names —
 * the repo filenames (spaces, mixed conventions) would make ugly URLs.
 */
const PRESS_FILES: Record<string, Record<string, string>> = {
  "key-art": {
    "st2-key-art-2560x1440.png": "logos/st2_background_2560x1440.png",
    "st2-key-art-logo-2560x1440.png": "logos/Background_2560x1440.png",
    "st2-key-art-logo-1024x1024.png": "logos/Background_1024x1024.png",
    "st2-key-art-social-1200x630.png": "logos/st2_background_1200x630.png",
    "st2-key-art-vertical-600x900.png": "logos/Steam Library Capsule.png",
  },
  logo: {
    "st2-logo-transparent-1280x720.png": "logos/st2_logo_transparent_1280x720.png",
    "st2-icon-256x256.png": "icons/SheepTag2_Icon_256x256.png",
    "st2-icon-96x96.png": "icons/SheepTag2_Icon_96x96.png",
    "st2-icon-64x64.png": "icons/SheepTag2_Icon_64x64.png",
    "st2-icon-32x32.png": "icons/SheepTag2_Icon_32x32.png",
  },
};

/**
 * Minimal STORED zip writer. The bundles are all PNGs — already compressed, so
 * deflating again buys nothing — and entries this size need no zip64, which keeps
 * the format trivial and the build free of a zip dependency.
 */
function zipStored(entries: Array<{ name: string; data: Buffer; mtime: Date }>): Buffer {
  const chunks: Buffer[] = [];
  const central: Buffer[] = [];
  let offset = 0;
  for (const { name, data, mtime } of entries) {
    const nameBytes = Buffer.from(name, "utf8");
    const crc = crc32(data) >>> 0;
    const dosTime =
      (mtime.getHours() << 11) | (mtime.getMinutes() << 5) | (mtime.getSeconds() >> 1);
    const dosDate =
      ((mtime.getFullYear() - 1980) << 9) | ((mtime.getMonth() + 1) << 5) | mtime.getDate();

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); // local file header
    local.writeUInt16LE(20, 4); // version needed
    local.writeUInt16LE(0, 8); // method: stored
    local.writeUInt16LE(dosTime, 10);
    local.writeUInt16LE(dosDate, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18); // compressed = uncompressed when stored
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBytes.length, 26);
    chunks.push(local, nameBytes, data);

    const dir = Buffer.alloc(46);
    dir.writeUInt32LE(0x02014b50, 0); // central directory header
    dir.writeUInt16LE(20, 4); // version made by
    dir.writeUInt16LE(20, 6); // version needed
    dir.writeUInt16LE(dosTime, 12);
    dir.writeUInt16LE(dosDate, 14);
    dir.writeUInt32LE(crc, 16);
    dir.writeUInt32LE(data.length, 20);
    dir.writeUInt32LE(data.length, 24);
    dir.writeUInt16LE(nameBytes.length, 28);
    dir.writeUInt32LE(offset, 42); // local header offset
    central.push(dir, nameBytes);
    offset += 30 + nameBytes.length + data.length;
  }
  const dirSize = central.reduce((n, b) => n + b.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); // end of central directory
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(dirSize, 12);
  end.writeUInt32LE(offset, 16);
  chunks.push(...central, end);
  return Buffer.concat(chunks);
}

async function buildPress() {
  const PRESS_DIR = path.join(PUBLIC_DIR, "press");
  await rm(PRESS_DIR, { recursive: true, force: true });

  // Screenshots go in at their native resolution and repo names (already kebab-case);
  // a new shot dropped into screenshots/ is picked up on the next build.
  const shots = (await readdir(path.join(ROOT, "screenshots")))
    .filter((f) => f.toLowerCase().endsWith(".png"))
    .sort((a, b) => a.localeCompare(b));
  const groups: Record<string, Record<string, string>> = {
    screenshots: Object.fromEntries(shots.map((f) => [f, `screenshots/${f}`])),
    ...PRESS_FILES,
  };

  const bundle: Array<{ rel: string; data: Buffer; mtime: Date }> = [];
  for (const [group, files] of Object.entries(groups)) {
    const dir = path.join(PRESS_DIR, group);
    await mkdir(dir, { recursive: true });
    for (const [out, src] of Object.entries(files)) {
      const full = path.join(ROOT, src);
      await copyFile(full, path.join(dir, out));
      bundle.push({ rel: `${group}/${out}`, data: await readFile(full), mtime: (await stat(full)).mtime });
    }
  }

  // Two bundles, presskit()-style: everything, and just the logo & icon.
  const zips: Array<[file: string, entries: Array<{ name: string; data: Buffer; mtime: Date }>]> = [
    [
      "sheep-tag-2-press.zip",
      bundle.map((e) => ({ name: `sheep-tag-2-press/${e.rel}`, data: e.data, mtime: e.mtime })),
    ],
    [
      "sheep-tag-2-logo-icon.zip",
      bundle
        .filter((e) => e.rel.startsWith("logo/"))
        .map((e) => ({ name: `sheep-tag-2-logo-icon/${path.posix.basename(e.rel)}`, data: e.data, mtime: e.mtime })),
    ],
  ];
  for (const [file, entries] of zips) {
    const zip = zipStored(entries);
    await writeFile(path.join(PRESS_DIR, file), zip);
    console.log(`[build] press ${file} — ${entries.length} files, ${humanBytes(zip.length)}`);
  }
  console.log(`[build] press assets — ${bundle.length} files copied to public/press/`);
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
await buildPress();
await copyEasterEgg();
console.log("[build] done.");
