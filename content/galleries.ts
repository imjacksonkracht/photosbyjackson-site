// Client galleries hosted at galleries.photosbyjackson.org (Pixieset).
// Titles, dates, and URLs copied from the public gallery index. This site
// links to them; downloads and delivery stay on the gallery platform.

import type { Category } from "./projects";

// "sports" galleries are kept for the record but not listed on the site.
export type Gallery = { title: string; date: string; url: string; category: Category | "sports" };

const base = "https://galleries.photosbyjackson.org";

export const galleries: Gallery[] = [
  { title: "HCGG × Petty Theft", date: "2026-10-09", url: `${base}/hcgg-pettytheft/`, category: "music" },
  { title: "Live From the Lawn — Fall 2026", date: "2026-09-23", url: `${base}/livefromthelawnfall2026/`, category: "music" },
  { title: "Gator Grill Club — GBM 1", date: "2026-08-28", url: `${base}/ggc-gbm1/`, category: "events" },
  { title: "Gator Grill Club — Project Downtown", date: "2026-04-26", url: `${base}/ggc-projectdowntown/`, category: "events" },
  { title: "Swamp Fest", date: "2026-04-14", url: `${base}/swampfest/`, category: "music" },
  { title: "Gator Jam", date: "2026-04-09", url: `${base}/gatorjam/`, category: "music" },
  { title: "Winter Park vs. Bishop Moore", date: "2024-11-21", url: `${base}/wpvsbm/`, category: "sports" },
  { title: "Girls Soccer Preseason Game 2", date: "2024-10-30", url: `${base}/girlssoccerpreseasongame2/`, category: "sports" },
  { title: "Girls Soccer Preseason Game 1", date: "2024-10-28", url: `${base}/girlssoccerpreseasongame1/`, category: "sports" },
  { title: "It’s All a Blur Tour", date: "2024-02-02", url: `${base}/itsallablur/`, category: "music" },
  { title: "Blackout Soccer", date: "2023-11-15", url: `${base}/blackoutsoccer/`, category: "sports" },
  { title: "Pink Out Game", date: "2023-10-20", url: `${base}/pinkout/`, category: "sports" },
];
