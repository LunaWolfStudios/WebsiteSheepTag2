/**
 * Reader for the `.st2` map archive — a deflate zip holding `meta.json`, `terrain.json` and
 * `scenery.json`. Shared by the prebuild manifest generator (scripts/build.mts) and the
 * submission portal so both agree on what a valid archive is, and on how the content hash the
 * level editor stamps into `meta.json` is verified.
 *
 * Mirrors `MapArchive.cs` in the Unity project. Uses only web-platform APIs
 * (DecompressionStream, crypto.subtle), which Node 22+ and every current browser provide.
 */

export const EXTENSION = ".st2";
export const META_ENTRY = "meta.json";
export const TERRAIN_ENTRY = "terrain.json";
export const SCENERY_ENTRY = "scenery.json";

/** Every entry a valid archive contains — exactly these, at the root, and nothing else. */
export const ENTRY_NAMES = [META_ENTRY, TERRAIN_ENTRY, SCENERY_ENTRY] as const;

/**
 * Salts the content hash so it can't be recomputed by hashing the entries alone; it signs a map
 * as having come out of the level editor. Must match `MapArchive.ContentHashSalt`.
 */
const CONTENT_HASH_SALT = "LunaWolfStudios.SheepTag2.MapArchive";

/** Tileset display names, indexed by `MapMetadata.TilesetId`. */
export const TILESETS = [
  "Pasture",
  "Meadow",
  "Wildwood",
  "Glades",
  "Fortress",
  "Thicket",
  "Summit",
  "Abyss",
  "Haven",
  "Canyon",
  "Foundry",
  "Grove",
  "Ruin",
  "Caldera",
  "Legacy",
] as const;

/** Display name for a tileset id, or "" when the id is missing or from a newer game build. */
export function tilesetName(id: unknown): string {
  return typeof id === "number" && Number.isInteger(id) ? (TILESETS[id] ?? "") : "";
}

/** `meta.json` — the part map lists read without unpacking the tile array. */
export interface MapMetadata {
  SchemaVersion?: number;
  Name?: string;
  Author?: string;
  Version?: string;
  Description?: string;
  Tags?: string[];
  SaveNumber?: number;
  CreatedAtUtc?: string;
  UpdatedAtUtc?: string;
  SupportedGameVersion?: string;
  Width?: number;
  Length?: number;
  TilesetId?: number;
  CliffTextureId?: number;
  WaterTint?: string;
  ContentHash?: string | null;
  PreviewImage?: string;
}

/** `terrain.json` — only the fields needed to sanity-check the map's shape. */
export interface MapTerrain {
  Width?: number;
  Length?: number;
  TileData?: unknown[];
}

export interface St2Archive {
  /** Raw entry text, kept verbatim because the content hash is computed over these bytes. */
  metaJson: string;
  terrainJson: string;
  sceneryJson: string;
  metadata: MapMetadata;
  terrain: MapTerrain;
}

/** A rejection with a message meant to be shown to whoever uploaded the file. */
export class St2Error extends Error {}

const decoder = new TextDecoder("utf-8", { fatal: false });

const EOCD_SIG = 0x06054b50;
const CENTRAL_SIG = 0x02014b50;
const LOCAL_SIG = 0x04034b50;
const STORED = 0;
const DEFLATED = 8;

/**
 * Ceiling on what an archive may expand to, so a zip bomb can't be handed to the submission
 * form. The largest map in the library unpacks to about 2 MB, so this leaves plenty of room.
 */
const MAX_INFLATED_BYTES = 64 * 1024 * 1024;

/** Offset of the end-of-central-directory record, or -1. Scans back over its optional comment. */
function findEocd(view: DataView): number {
  const max = Math.min(view.byteLength, 0xffff + 22);
  for (let back = 22; back <= max; back++) {
    const at = view.byteLength - back;
    if (view.getUint32(at, true) === EOCD_SIG) return at;
  }
  return -1;
}

/**
 * Inflates one entry, stopping the moment the output runs past `limit`. The limit is the size
 * the directory declared, which the caller has already bounded — an entry that lies about how
 * much it expands to gets cut off rather than being allowed to fill memory.
 */
async function inflateRaw(data: Uint8Array, limit: number): Promise<Uint8Array> {
  const source = new ReadableStream<BufferSource>({
    start(controller) {
      controller.enqueue(new Uint8Array(data)); // copied so the view isn't tied to the zip's buffer
      controller.close();
    },
  });
  const reader = source.pipeThrough(new DecompressionStream("deflate-raw")).getReader();
  const out = new Uint8Array(limit);
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (size + value.length > limit) {
      await reader.cancel();
      throw new Error("entry is larger than its directory says");
    }
    out.set(value, size);
    size += value.length;
  }
  if (size !== limit) throw new Error("entry is smaller than its directory says");
  return out;
}

/**
 * Unpacks every entry, rejecting anything a level-editor save would never produce: subfolders,
 * zip64, unexpected extra files. Being strict here is the point — the content hash only covers
 * the three known entries, so anything riding alongside them would be unverified content.
 */
async function unzip(bytes: Uint8Array): Promise<Map<string, Uint8Array>> {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (bytes.length < 22 || view.getUint32(0, true) !== LOCAL_SIG) {
    throw new St2Error("This file isn't a Sheep Tag 2 map archive.");
  }
  const eocd = findEocd(view);
  if (eocd < 0) throw new St2Error("The archive is damaged — its directory is missing.");

  const count = view.getUint16(eocd + 10, true);
  let at = view.getUint32(eocd + 16, true);
  if (count === 0xffff || at === 0xffffffff) {
    throw new St2Error("Zip64 archives aren't supported.");
  }

  const entries = new Map<string, Uint8Array>();
  let inflated = 0;
  for (let i = 0; i < count; i++) {
    if (at + 46 > bytes.length || view.getUint32(at, true) !== CENTRAL_SIG) {
      throw new St2Error("The archive is damaged — its directory is unreadable.");
    }
    const method = view.getUint16(at + 10, true);
    const compressedSize = view.getUint32(at + 20, true);
    const uncompressedSize = view.getUint32(at + 24, true);
    const nameLength = view.getUint16(at + 28, true);
    const extraLength = view.getUint16(at + 30, true);
    const commentLength = view.getUint16(at + 32, true);
    const localAt = view.getUint32(at + 42, true);
    const name = decoder.decode(bytes.subarray(at + 46, at + 46 + nameLength));
    at += 46 + nameLength + extraLength + commentLength;
    if (at > bytes.length) {
      throw new St2Error("The archive is damaged — its directory runs past the end of the file.");
    }

    if (name.includes("/") || name.includes("\\")) {
      throw new St2Error(
        `The map's files must sit at the top level of the archive — "${name}" is inside a folder. Re-save the map from the level editor instead of zipping it yourself.`,
      );
    }
    if (!(ENTRY_NAMES as readonly string[]).includes(name)) {
      throw new St2Error(`The archive contains an unexpected file: "${name}".`);
    }
    if (compressedSize === 0xffffffff || uncompressedSize === 0xffffffff || localAt === 0xffffffff) {
      throw new St2Error("Zip64 archives aren't supported.");
    }
    inflated += uncompressedSize;
    if (inflated > MAX_INFLATED_BYTES) {
      throw new St2Error("The archive expands to far more data than a map ever should.");
    }
    if (localAt + 30 > bytes.length || view.getUint32(localAt, true) !== LOCAL_SIG) {
      throw new St2Error(`The archive is damaged — "${name}" is unreadable.`);
    }
    const dataAt =
      localAt + 30 + view.getUint16(localAt + 26, true) + view.getUint16(localAt + 28, true);
    if (dataAt + compressedSize > bytes.length) {
      throw new St2Error(`The archive is truncated — "${name}" is incomplete.`);
    }
    const raw = bytes.subarray(dataAt, dataAt + compressedSize);

    if (method !== STORED && method !== DEFLATED) {
      throw new St2Error(`"${name}" uses an unsupported compression method.`);
    }
    if (method === STORED && compressedSize !== uncompressedSize) {
      throw new St2Error(`The archive is damaged — "${name}" has inconsistent sizes.`);
    }
    try {
      entries.set(name, method === STORED ? raw : await inflateRaw(raw, uncompressedSize));
    } catch {
      throw new St2Error(`The archive is damaged — "${name}" could not be decompressed.`);
    }
  }
  return entries;
}

function parse<T>(json: string, entryName: string): T {
  let value: unknown;
  try {
    value = JSON.parse(json);
  } catch {
    throw new St2Error(`"${entryName}" inside the archive isn't valid JSON.`);
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new St2Error(`"${entryName}" inside the archive isn't in the expected format.`);
  }
  return value as T;
}

/** Reads and parses an archive. Throws {@link St2Error} with a message safe to show the user. */
export async function readArchive(bytes: Uint8Array): Promise<St2Archive> {
  const entries = await unzip(bytes);
  for (const name of ENTRY_NAMES) {
    if (!entries.has(name)) throw new St2Error(`The archive is missing "${name}".`);
  }
  const metaJson = decoder.decode(entries.get(META_ENTRY));
  const terrainJson = decoder.decode(entries.get(TERRAIN_ENTRY));
  const sceneryJson = decoder.decode(entries.get(SCENERY_ENTRY));
  return {
    metaJson,
    terrainJson,
    sceneryJson,
    metadata: parse<MapMetadata>(metaJson, META_ENTRY),
    terrain: parse<MapTerrain>(terrainJson, TERRAIN_ENTRY),
  };
}

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * True when the stamped `ContentHash` matches the archive's contents — the signature that says
 * the map came out of the level editor and hasn't been hand-edited since.
 *
 * The editor hashes the metadata with its own hash field nulled out, then writes the result back
 * in (see `MapArchive.ToBytes`). Since the rest of the serialized metadata is byte-identical
 * either way, swapping the stamped value back to `null` in the raw text reproduces exactly what
 * was hashed — no need to re-serialize, which would have to match Newtonsoft's output byte for
 * byte.
 */
export async function verifyContentHash(archive: St2Archive): Promise<boolean> {
  const hash = archive.metadata.ContentHash;
  if (typeof hash !== "string" || !/^[0-9a-f]{64}$/.test(hash)) return false;
  const stamped = `"ContentHash":"${hash}"`;
  if (!archive.metaJson.includes(stamped)) return false;
  const unstamped = archive.metaJson.replace(stamped, '"ContentHash":null');
  const expected = await sha256Hex(
    CONTENT_HASH_SALT + unstamped + archive.terrainJson + archive.sceneryJson,
  );
  return expected === hash;
}

/**
 * Checks the metadata a listing needs, returning a message for the first problem found.
 * `Description` may be empty, but the field has to be there.
 */
export function checkMetadata(m: MapMetadata): string | null {
  for (const field of ["Name", "Author", "Version"] as const) {
    const value = m[field];
    if (value === undefined || value === null || String(value).trim() === "") {
      return `The map's ${field} is missing — set it in the level editor before sharing.`;
    }
  }
  if (!("Description" in m)) {
    return "The map's Description is missing (an empty description is fine).";
  }
  return null;
}

/** Checks the map's dimensions and that its tile data is complete. */
export function checkTerrain(archive: St2Archive): string | null {
  const width = Number(archive.terrain.Width);
  const length = Number(archive.terrain.Length);
  const tiles = archive.terrain.TileData;
  if (!Number.isFinite(width) || !Number.isFinite(length) || width <= 0 || length <= 0) {
    return "The map has no usable dimensions.";
  }
  if (!Array.isArray(tiles) || tiles.length !== width * length) {
    return "The map's tile data is incomplete.";
  }
  return null;
}
