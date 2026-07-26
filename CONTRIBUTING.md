# Contributing a terrain

Thanks for making maps for **Sheep Tag 2**! This repository is the community **Terrain Content Library** that powers [sheeptag2.com/terrains](https://www.sheeptag2.com/terrains). Anyone can add a terrain.

## What a terrain is

Each terrain is a single `.st2` file saved by Sheep Tag 2's level editor, dropped into the [`terrains/`](terrains/) folder. A `.st2` is a compressed archive holding three files at its top level:

| File | What's in it |
|------|--------------|
| `meta.json` | Name, Author, Version, Description, Tags, map size, tileset, preview image, and the content hash |
| `terrain.json` | The map's tile data |
| `scenery.json` | Scenery placement and spawn points |

The website reads `meta.json` and the preview automatically — so please fill in the **Name**, **Author**, **Version**, and **Description** in the level editor, and keep the preview image.

### The content hash

The level editor stamps a `ContentHash` into `meta.json` that signs the archive's contents. **Don't unpack, hand-edit, or rezip a `.st2`** — the hash stops matching, and both the submission form and the site's build reject the map. Make your changes in the level editor and save from there.

## How to submit

### Option A — The submission form (recommended, no account needed)

Use the **[terrain submission form](https://www.sheeptag2.com/submit)** on the website: drop in your `.st2`, it's validated instantly in your browser, and it's sent to us for review.

### Option B — Pull request (for git users)

[Upload your `.st2` to the `terrains/` folder](https://github.com/LunaWolfStudios/SheepTag2-ContentLibrary/upload/main/terrains) and GitHub will open a pull request for review.

## Guidelines

- Credit yourself in the `Author` field — you'll be shown on the site.
- Give your terrain a clear **Name** and a helpful **Description**.
- Make sure it's tested and playable in-game.
- Save it from the level editor so its content hash verifies (see above).
- **License:** by submitting a terrain you confirm it's your own original work and agree to license it under **[Creative Commons Attribution 4.0 (CC BY 4.0)](terrains/LICENSE)**. Please only submit maps you have the right to share.

## Where do downloaded terrains go?

Place any terrain you download into your Sheep Tag 2 **custom** folder, then it shows up in-game:

| OS | Folder |
|----|--------|
| **Windows** | `%USERPROFILE%\AppData\LocalLow\Luna Wolf Studios\Sheep Tag 2\Custom\` |
| **macOS** | `~/Library/Application Support/Luna Wolf Studios/Sheep Tag 2/Custom/` |
| **Linux** | `~/.config/unity3d/Luna Wolf Studios/Sheep Tag 2/Custom/` |

> On Windows the `AppData` folder and on macOS the `Library` folder are hidden by default.
