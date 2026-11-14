/**
 * Home-page video gallery — the two trailers, then one short clip for each section of the
 * Steam page's "About This Game".
 *
 * `id` is the YouTube video. `poster` matches a JPG in the repo-root `videos/` folder, which
 * the component resolves through astro:assets, so a card costs no request to YouTube until
 * someone presses play. `next` is a video the theater plays once this one ends.
 */
import { LINKS } from "./links";

export interface Video {
  id: string;
  title: string;
  poster: string;
  next?: string;
}

export const VIDEOS: Video[] = [
  { id: LINKS.trailerId, title: "Gameplay Trailer", poster: "gameplay-trailer.jpg", next: LINKS.cinematicTrailerId },
  { id: LINKS.cinematicTrailerId, title: "Cinematic Teaser", poster: "cinematic-teaser.jpg" },
  { id: "JwVvkdnIIQg", title: "Sheep Survive. Wolves Hunt.", poster: "sheep-survive-wolves-hunt.jpg" },
  { id: "ZAj3N36xC4k", title: "An Approachable RTS", poster: "an-approachable-rts.jpg" },
  { id: "_IQO36AQHe0", title: "Play as Sheep or Wolf", poster: "play-as-sheep-or-wolf.jpg" },
  { id: "7OzmgL1tVVg", title: "Play Online, Solo, or Both", poster: "play-online-solo-or-both.jpg" },
  { id: "PjNLCQmYS1c", title: "Build Your Battlegrounds", poster: "build-your-battlegrounds.jpg" },
  { id: "b-kbfnlHRtY", title: "Twenty Years in the Making", poster: "twenty-years-in-the-making.jpg" },
];
