// Portfolio content. Adding an event means adding one record here (and its
// photos to photos/selection.json + content/photos.ts) — no component
// changes.
//
// Each project's `sequence` is its photo essay, read top to bottom:
//   full   — edge-to-edge, the loudest frame
//   wide   — full content width
//   pair / trio — a justified row; widths follow each photo's aspect ratio,
//                 so nothing is cropped
//   offset — one image set off to one side with open space beside it
//
// Only verified facts go in `date`, `location`, and `galleryUrl`. Leave a
// field out rather than guessing.

export type Category = "music" | "events" | "portraits";

export const categories: Record<Category, { label: string; short: string; title: string; blurb: string }> = {
  music: {
    label: "Live Music",
    short: "Live Music",
    title: "Live music",
    blurb: "Headliners, campus bands, and festival stages, from the photo pit and the back of the room.",
  },
  events: {
    label: "Events",
    short: "Events",
    title: "Events",
    blurb: "Campus organizations, cookouts, parades, and the moments in between.",
  },
  portraits: {
    label: "Portraits & Headshots",
    short: "Portraits",
    title: "Portraits & headshots",
    blurb: "Headshots and group portraits for students and organizations at the University of Florida.",
  },
};

export const categoryOrder: Category[] = ["music", "events", "portraits"];

export type Row =
  | { kind: "full"; photo: string }
  | { kind: "wide"; photo: string }
  | { kind: "pair"; photos: [string, string] }
  | { kind: "trio"; photos: [string, string, string] }
  | { kind: "offset"; photo: string; side: "left" | "right" };

export type Project = {
  slug: string;
  title: string;
  category: Category;
  /** ISO date, only when verified. */
  date?: string;
  location?: string;
  summary: string;
  cover: string;
  sequence: Row[];
  galleryUrl?: string;
};

const pt = (s: string) => `petty-theft-${s}`;
const sf = (s: string) => `swamp-fest-${s}`;
const lftl = (s: string) => `live-from-the-lawn-${s}`;
const jam = (s: string) => `gator-jam-${s}`;
const ggc = (s: string) => `gator-grill-club-${s}`;
const hc = (s: string) => `homecoming-parade-${s}`;
const gb = (s: string) => `cicerones-general-body-${s}`;
const rec = (s: string) => `florida-cicerones-recruitment-${s}`;

export const projects: Project[] = [
  {
    slug: "hcgg-petty-theft",
    title: "HCGG × Petty Theft",
    category: "music",
    date: "2026-10-09",
    location: "Gainesville, FL",
    summary: "Petty Theft on stage for Homecoming and Gator Growl 2026.",
    cover: pt("lead-vocalist-01"),
    galleryUrl: "https://galleries.photosbyjackson.org/hcgg-pettytheft/",
    sequence: [
      { kind: "full", photo: pt("guitarist-silhouette-01") },
      { kind: "pair", photos: [pt("lead-vocalist-02"), pt("lead-vocalist-04")] },
      { kind: "offset", photo: pt("lead-vocalist-03"), side: "left" },
      { kind: "full", photo: pt("lead-vocalist-01") },
      { kind: "pair", photos: [pt("singer-01"), pt("lead-vocalist-06")] },
      { kind: "offset", photo: pt("bassist-01"), side: "right" },
      { kind: "pair", photos: [pt("keyboardist-01"), pt("lead-vocalist-05")] },
    ],
  },
  {
    slug: "swamp-fest",
    title: "Swamp Fest",
    category: "music",
    date: "2026-04-14",
    summary: "Swamp Fest from golden hour into the night: CO2 cannons, DJ sets, and a packed crowd.",
    cover: sf("co2-cannons-01"),
    galleryUrl: "https://galleries.photosbyjackson.org/swampfest/",
    sequence: [
      { kind: "full", photo: sf("co2-cannons-01") },
      { kind: "pair", photos: [sf("dj-set-01"), sf("stage-performance-01")] },
      { kind: "wide", photo: sf("crowd-01") },
      { kind: "offset", photo: sf("dj-set-02"), side: "right" },
      { kind: "pair", photos: [sf("stage-performance-02"), sf("stage-performance-03")] },
      { kind: "wide", photo: sf("main-stage-01") },
      { kind: "pair", photos: [sf("festivalgoers-01"), sf("crowd-03")] },
      { kind: "pair", photos: [sf("crowd-02"), sf("main-stage-02")] },
    ],
  },
  {
    slug: "live-from-the-lawn",
    title: "Live From the Lawn",
    category: "music",
    date: "2026-09-23",
    location: "Gainesville, FL",
    summary: "An outdoor show on campus that ran from afternoon sun into dark.",
    cover: lftl("trombonist-01"),
    galleryUrl: "https://galleries.photosbyjackson.org/livefromthelawnfall2026/",
    sequence: [
      { kind: "full", photo: lftl("trombonist-01") },
      { kind: "pair", photos: [lftl("acoustic-guitarist-01"), lftl("guitarist-01")] },
      { kind: "offset", photo: lftl("table-setup-01"), side: "left" },
      { kind: "trio", photos: [lftl("bassist-01"), lftl("guitar-detail-01"), lftl("acoustic-guitarist-02")] },
      { kind: "wide", photo: lftl("guitarist-03") },
      { kind: "pair", photos: [lftl("bassist-02"), lftl("guitarist-02")] },
      { kind: "offset", photo: lftl("guitar-detail-02"), side: "right" },
    ],
  },
  {
    slug: "gator-jam",
    title: "Gator Jam",
    category: "music",
    date: "2026-04-09",
    summary: "Bands under the truss lights at Gator Jam.",
    cover: jam("band-01"),
    galleryUrl: "https://galleries.photosbyjackson.org/gatorjam/",
    sequence: [
      { kind: "wide", photo: jam("band-01") },
      { kind: "trio", photos: [jam("keyboardist-01"), jam("guitarist-01"), jam("stage-01")] },
    ],
  },
  {
    slug: "gator-grill-club",
    title: "Gator Grill Club",
    category: "events",
    summary: "A Gator Grill Club cookout: the grills, the line, the food, and the people who showed up hungry.",
    cover: ggc("cookout-01"),
    sequence: [
      { kind: "wide", photo: ggc("live-grilling-sign-01") },
      { kind: "pair", photos: [ggc("cookout-01"), ggc("food-01")] },
      { kind: "full", photo: ggc("cookout-02") },
      { kind: "pair", photos: [ggc("grill-01"), ggc("grill-02")] },
      { kind: "offset", photo: ggc("food-02"), side: "left" },
      { kind: "pair", photos: [ggc("cookout-03"), ggc("cookout-04")] },
      { kind: "pair", photos: [ggc("cookout-05"), ggc("food-03")] },
    ],
  },
  {
    slug: "its-all-a-blur-tour",
    title: "It’s All a Blur Tour",
    category: "music",
    date: "2024-02-02",
    summary: "Arena light, smoke, and a single spotlight.",
    cover: "its-all-a-blur-tour-arena-stage-01",
    galleryUrl: "https://galleries.photosbyjackson.org/itsallablur/",
    sequence: [{ kind: "pair", photos: ["its-all-a-blur-tour-arena-stage-01", "its-all-a-blur-tour-arena-stage-02"] }],
  },
  {
    slug: "homecoming-parade-2026",
    title: "Homecoming Parade",
    category: "events",
    date: "2026-10-09",
    location: "Gainesville, FL",
    summary: "UF’s 2026 Homecoming Parade: mascots, floats, the band, and the people lining the street.",
    cover: hc("cheerleaders-01"),
    sequence: [
      { kind: "full", photo: hc("cheerleaders-01") },
      { kind: "pair", photos: [hc("mascots-01"), hc("float-01")] },
      { kind: "offset", photo: hc("marching-band-01"), side: "right" },
      { kind: "pair", photos: [hc("float-02"), hc("float-03")] },
      { kind: "wide", photo: hc("spectators-01") },
      { kind: "pair", photos: [hc("police-escort-01"), hc("float-04")] },
    ],
  },
  {
    slug: "campus-organizations",
    title: "Campus Organizations",
    category: "events",
    location: "University of Florida",
    summary: "Group photos and event coverage for student organizations.",
    cover: "campus-organization-group-portrait-01",
    sequence: [
      { kind: "wide", photo: "campus-organization-group-portrait-01" },
      { kind: "pair", photos: ["campus-organization-group-portrait-02", "campus-organization-gator-chomp-01"] },
    ],
  },
  {
    slug: "florida-cicerones-general-body-headshots",
    title: "Florida Cicerones — General Body Headshots",
    category: "portraits",
    location: "University of Florida",
    summary: "General body headshots for Florida Cicerones, made in natural light under campus archways.",
    cover: gb("headshot-01"),
    sequence: [
      { kind: "pair", photos: [gb("headshot-01"), gb("headshot-02")] },
      { kind: "wide", photo: gb("candid-01") },
      { kind: "trio", photos: [gb("headshot-05"), gb("headshot-06"), gb("headshot-07")] },
      { kind: "pair", photos: [gb("headshot-10"), gb("headshot-11")] },
      { kind: "pair", photos: [gb("headshot-08"), gb("headshot-09")] },
      { kind: "pair", photos: [gb("headshot-03"), gb("headshot-04")] },
      { kind: "offset", photo: gb("duo-portrait-01"), side: "right" },
      { kind: "offset", photo: gb("mascot-01"), side: "left" },
    ],
  },
  {
    slug: "florida-cicerones-recruitment-portraits",
    title: "Florida Cicerones — Recruitment Portraits",
    category: "portraits",
    date: "2026-10-12",
    location: "University of Florida",
    summary: "Group portraits for Florida Cicerones recruitment, made around campus.",
    cover: rec("group-portrait-01"),
    sequence: [
      { kind: "wide", photo: rec("group-portrait-01") },
      { kind: "pair", photos: [rec("group-portrait-02"), rec("group-portrait-03")] },
      { kind: "pair", photos: [rec("group-portrait-04"), rec("group-portrait-05")] },
    ],
  },
];

/** Home page Selected Work, in display order. */
export const selectedWork: { slug: string; photo: string }[] = [
  { slug: "hcgg-petty-theft", photo: pt("lead-vocalist-01") },
  { slug: "live-from-the-lawn", photo: lftl("acoustic-guitarist-01") },
  { slug: "swamp-fest", photo: sf("crowd-01") },
  { slug: "gator-grill-club", photo: ggc("cookout-01") },
  { slug: "florida-cicerones-general-body-headshots", photo: gb("headshot-01") },
  { slug: "homecoming-parade-2026", photo: hc("cheerleaders-01") },
];

/** Photo used for each category's entry on the home page. */
export const categoryCovers: Record<Category, string> = {
  music: lftl("bassist-02"),
  events: hc("mascots-01"),
  portraits: rec("group-portrait-03"),
};

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function projectsIn(category: Category) {
  return projects.filter((p) => p.category === category);
}

export function photosIn(project: Project): string[] {
  return project.sequence.flatMap((row) => ("photos" in row ? row.photos : [row.photo]));
}

export function adjacentProjects(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  const n = projects.length;
  return { prev: projects[(i - 1 + n) % n], next: projects[(i + 1) % n] };
}

export function formatDate(iso: string, style: "long" | "short" = "long") {
  const d = new Date(`${iso}T12:00:00Z`);
  return d.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: style === "long" ? "long" : "short",
    day: "numeric",
    year: "numeric",
  });
}
