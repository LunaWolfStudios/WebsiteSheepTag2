/**
 * Game art lookup by filename.
 *
 * The icons, glyphs and decor under art/ are copied straight out of the Sheep Tag 2
 * Unity project (Assets/Sprites/UI Sprites), so a guide page shows exactly the art the
 * game shows. Farm icons keep living in farms/ — the press/farm pipeline already owns
 * that folder — and are folded into the same table here so callers only need a filename.
 */
import type { ImageMetadata } from "astro";

const modules: Record<string, ImageMetadata> = {
  ...import.meta.glob<ImageMetadata>("../../art/icons/*.png", { eager: true, import: "default" }),
  ...import.meta.glob<ImageMetadata>("../../art/decor/*.png", { eager: true, import: "default" }),
  ...import.meta.glob<ImageMetadata>("../../farms/Icon_*.png", { eager: true, import: "default" }),
};

const byFile: Record<string, ImageMetadata> = {};
for (const [p, img] of Object.entries(modules)) {
  const file = p.split("/").pop();
  if (file) byFile[file] = img;
}

/** Resolve a game art filename (e.g. "MultiboardIcon_Sheep.png") to an optimizable image. */
export function art(file: string): ImageMetadata {
  const img = byFile[file];
  if (!img) throw new Error(`Game art "${file}" not found under art/ or farms/`);
  return img;
}

/**
 * The flat vector glyphs (arrows, swap, plus, flag, input hints) ship as white-on-transparent
 * art that the game tints through its palette. On the web they get the same treatment as a CSS
 * mask, so they take the surrounding ink colour instead of burning white into a dark page.
 */
export const MASK_GLYPHS = new Set([
  "UI_Icon_ArrowRight.png",
  "UI_Icon_Swap.png",
  "UI_Icon_Plus.png",
  "UI_Icon_Flag.png",
  "UI_Icon_Book.png",
  "UI_Icon_MouseRight.png",
  "UI_Icon_InputKeyboard.png",
]);

/**
 * Art painted edge to edge with no transparent margin. Everything else is a glyph that has to
 * be fitted inside its box; these have to fill it instead, or a circular frame cuts the corners
 * off a square picture.
 */
export const FULL_BLEED = new Set([
  "PortraitIcon_Sheep.png",
  "PortraitIcon_Werewolf.png",
  "PortraitIcon_Wolf.png",
]);
