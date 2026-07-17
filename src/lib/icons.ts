/**
 * Icon path library. Brand/OS marks come from simple-icons (fill, 24x24);
 * UI glyphs are hand-authored Lucide-style stroke paths. Windows is hand-drawn
 * because simple-icons no longer ships a Microsoft Windows mark.
 */
import {
  siSteam,
  siKickstarter,
  siX,
  siFacebook,
  siInstagram,
  siYoutube,
  siTwitch,
  siDiscord,
  siApple,
  siLinux,
} from "simple-icons";

export interface IconDef {
  path: string;
  stroke?: boolean;
  viewBox?: string;
}

const brand = (i: { path: string }): IconDef => ({ path: i.path });

export const ICONS: Record<string, IconDef> = {
  // Brand marks (fill)
  steam: brand(siSteam),
  kickstarter: brand(siKickstarter),
  x: brand(siX),
  facebook: brand(siFacebook),
  instagram: brand(siInstagram),
  youtube: brand(siYoutube),
  twitch: brand(siTwitch),
  discord: brand(siDiscord),
  apple: brand(siApple),
  linux: brand(siLinux),
  // Hand-drawn fill marks
  windows: { path: "M3 4.2 10.6 3.1v7.6H3zM11.5 3 21 1.7v9H11.5zM3 11.6h7.6v7.6L3 18.1zM11.5 11.6H21v9.1l-9.5-1.3z" },
  star: {
    path: "M12 2l2.9 6.26 6.86.6-5.19 4.52 1.55 6.71L12 17.3l-6.12 3.79 1.55-6.71L2.24 8.86l6.86-.6z",
  },

  // UI glyphs (stroke)
  home: { stroke: true, path: "M3 10.6 12 3l9 7.6M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" },
  music: {
    stroke: true,
    path: "M9 18V5l11-2v11M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
  },
  help: {
    stroke: true,
    path: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20M9.6 9a2.5 2.5 0 0 1 4.9.8c0 1.7-2.5 2.2-2.5 3.2M12 17h.01",
  },
  menu: { stroke: true, path: "M4 6h16M4 12h16M4 18h16" },
  close: { stroke: true, path: "M6 6l12 12M18 6 6 18" },
  external: {
    stroke: true,
    path: "M15 3h6v6M21 3l-9 9M10 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-4",
  },
  download: { stroke: true, path: "M12 3v12M7 10l5 5 5-5M5 21h14" },
  search: { stroke: true, path: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35" },
  upload: { stroke: true, path: "M12 15V3M7 8l5-5 5 5M5 21h14" },
  chevronLeft: { stroke: true, path: "M15 6l-6 6 6 6" },
  chevronRight: { stroke: true, path: "M9 6l6 6-6 6" },
  play: { path: "M8 5v14l11-7z" },
  list: { stroke: true, path: "M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" },
  grid: { stroke: true, path: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
  check: { stroke: true, path: "M4 12.5l5 5L20 6.5" },
};

export type IconName = keyof typeof ICONS;
