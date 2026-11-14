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
    caption: "Thirty two players, one pasture, and a farm on every patch of grass.",
    alt: "A 32 player game seen from high above, with hundreds of farms filling a green terrain around the pen in the middle.",
  },
  {
    file: "st2-screenshot-01.png",
    caption: "Lunar Strike takes a base apart.",
    alt: "Playing as a Wolf, meteors rain down on a Sheep base while the pack waits at its edge.",
  },
  {
    file: "st2-screenshot-02.png",
    caption: "Fortify your farms when the pack shows up.",
    alt: "A Sheep casts Fortify in the middle of a huge grid of farms on ReVoLuTiOn as Wolves close in from the right.",
  },
  {
    file: "st2-screenshot-03.png",
    caption: "A Triple Capture at the pen.",
    alt: "The words Triple Capture hang over the pen while a Lunar Strike lands on the farms inside it.",
  },
  {
    file: "st2-screenshot-04.png",
    caption: "Fighting over the pen on Fire and Ice.",
    alt: "Sheep and Wolves clash around the pen on a snowy terrain ringed by ice and lava.",
  },
  {
    file: "st2-screenshot-05.png",
    caption: "The pack breaks into the base.",
    alt: "A pack of Wolves runs through rows of farms on the Kickstarter terrain while the Sheep slip away between them.",
  },
  {
    file: "st2-screenshot-06.png",
    caption: "Hunt as a Wolf.",
    alt: "Playing as a Wolf, the hunter chases a Sheep between its farms, with the Wolf's abilities and gold on the HUD.",
  },
  {
    file: "st2-screenshot-07.png",
    caption: "A strike lands deep inside a canyon base.",
    alt: "A Lunar Strike hits the middle of a wide field of farms on a red rock terrain.",
  },
  {
    file: "st2-screenshot-08.png",
    caption: "Night raids on the pen.",
    alt: "At night a meteor falls toward the pen while Sheep rush in to free the Spirits held there.",
  },
  {
    file: "st2-screenshot-09.png",
    caption: "Farms right up to the pen on the tundra.",
    alt: "Rows of farms surround the pen on a snowy terrain while Wolves guard the Sheep they have caught.",
  },
  {
    file: "st2-screenshot-10.png",
    caption: "Farms fall as the Wolves push in.",
    alt: "Farms burst apart beside the pen on a rocky terrain hanging over a dark drop.",
  },
  {
    file: "st2-screenshot-11.png",
    caption: "A Saving Spree at the pen.",
    alt: "Sheep build inside the pen on a bright green terrain and free their allies as Wolves circle the fence.",
  },
  {
    file: "st2-screenshot-12.png",
    caption: "A field of farms on Ultimate.",
    alt: "Farms stretch across the grass on Ultimate, with Sheep and Wolves fighting at the pen in the corner.",
  },
  {
    file: "st2-screenshot-13.png",
    caption: "The Floor Is Lava.",
    alt: "Sheep build on a small island of rock in the middle of a terrain made of lava.",
  },
  {
    file: "st2-screenshot-14.png",
    caption: "Dress your Sheep in the Wardrobe.",
    alt: "In the Wardrobe, a Sheep up on its hind legs tries on a Mushroom hat and Bass Slippers.",
  },
  {
    file: "st2-screenshot-15.png",
    caption: "Outfits for your Werewolf too.",
    alt: "In the Wardrobe, a Werewolf stands upright in the Granny Outfit.",
  },
];
