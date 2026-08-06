/**
 * Home-page screenshot gallery — copy for each shot.
 *
 * Order matches the numbering on the file names, which is the same order the
 * shots appear on the Steam page. Keep the two in sync when shots are added.
 *
 * `file` matches a PNG in the repo-root `screenshots/` folder; the component
 * resolves it through astro:assets (like farms/Icon_*.png) so the originals
 * stay out of `public/` and ship as optimized, responsive WebP.
 *
 * `caption` is the line shown under the shot; `alt` is the accessible
 * description (what is actually happening in the frame).
 */
export interface Screenshot {
  file: string;
  caption: string;
  alt: string;
}

export const SCREENSHOTS: Screenshot[] = [
  {
    file: "st2-screenshot-00.png",
    caption: "Fence off the pasture before the Wolves are let loose.",
    alt: "A Sheep builds a dense grid of farms across a green pasture, right up against the fenced Wolf pen.",
  },
  {
    file: "st2-screenshot-01.png",
    caption: "The pack hunts together.",
    alt: "Playing as a Wolf at night, the pack sweeps across an open field toward a Sheep's farms.",
  },
  {
    file: "st2-screenshot-02.png",
    caption: "One gap in the wall is all a Wolf needs.",
    alt: "A Wolf slips between the farms of a half-finished maze on a dark grassland map.",
  },
  {
    file: "st2-screenshot-03.png",
    caption: "Farms sprawling clear across the canyon.",
    alt: "A huge colourful maze of farms covers a sunlit desert canyon map, with Wolves gathering by the pen.",
  },
  {
    file: "st2-screenshot-04.png",
    caption: "Caught in the open. That is how a Sheep's night ends.",
    alt: "A kill feed reads that a Wolf has captured a Sheep while the pack swarms the farms below.",
  },
  {
    file: "st2-screenshot-05.png",
    caption: "Race to the pen and save the allies trapped there as spirits.",
    alt: "A Sheep heads for the fenced pen where captured team-mates drift as glowing spirits, its maze of farms left behind.",
  },
  {
    file: "st2-screenshot-06.png",
    caption: "Out on the snowfields there is nowhere to hide.",
    alt: "Wolves prowl a snow-covered map beside open water while scattered farms dot the ice.",
  },
  {
    file: "st2-screenshot-07.png",
    caption: "Farming on the edge of the lava flow.",
    alt: "Rows of golden farms are packed along a river of lava on a volcanic map.",
  },
  {
    file: "st2-screenshot-08.png",
    caption: "Molten rivers, frozen shores, and a Wolf on your tail.",
    alt: "A night-time volcanic map where lava and water cut through the farms as a Wolf closes in.",
  },
];
