# Contributing a terrain

Thanks for making maps for **Sheep Tag 2**! This repository is the community **Terrain Content Library** that powers [sheeptag2.com/terrains](https://www.sheeptag2.com/terrains). Anyone can add a terrain.

## What a terrain is

Each terrain is a single `.json` file exported from Sheep Tag 2, saved in the [`terrains/`](terrains/) folder. It contains a `Metadata` block plus the map's tile data:

```jsonc
{
  "Metadata": {
    "Name": "Your Terrain Name",
    "Author": "Your name / handle",
    "Version": "1",
    "Description": "A short description of your map.",
    "PreviewImage": "…"        // a small preview image, saved automatically by the game
  },
  "Width": 128, "Length": 128, // the map size
  "TileData": [ /* … */ ]
}
```

The website reads the `Metadata` and preview automatically — so please fill in the **Name**, **Author**, **Version**, and **Description**, and keep the preview image.

## How to submit

### Option A — The submission form (recommended, no account needed)

Use the **[terrain submission form](https://www.sheeptag2.com/submit)** on the website: drop in your `.json`, it's validated instantly in your browser, and it's sent to us for review.

### Option B — Pull request (for git users)

[Upload your `.json` to the `terrains/` folder](https://github.com/LunaWolfStudios/SheepTag2-ContentLibrary/upload/main/terrains) and GitHub will open a pull request for review.

## Guidelines

- Credit yourself in the `Author` field — you'll be shown on the site.
- Give your terrain a clear **Name** and a helpful **Description**.
- Make sure it's tested and playable in-game.
- **License:** by submitting a terrain you confirm it's your own original work and agree to license it under **[Creative Commons Attribution 4.0 (CC BY 4.0)](terrains/LICENSE)**. Please only submit maps you have the right to share.

## Where do downloaded terrains go?

Place any terrain you download into your Sheep Tag 2 **custom** folder, then it shows up in-game:

| OS | Folder |
|----|--------|
| **Windows** | `%USERPROFILE%\AppData\LocalLow\Luna Wolf Studios\Sheep Tag 2\Custom\` |
| **macOS** | `~/Library/Application Support/Luna Wolf Studios/Sheep Tag 2/Custom/` |
| **Linux** | `~/.config/unity3d/Luna Wolf Studios/Sheep Tag 2/Custom/` |

> On Windows the `AppData` folder and on macOS the `Library` folder are hidden by default.
