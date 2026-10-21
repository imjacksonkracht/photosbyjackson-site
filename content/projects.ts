// Portfolio content. Adding an event means adding one record here (and its
// photos to photos/selection.json + content/photos.ts) — no component
// changes.
//
// Each project's `sequence` is its photo essay, read top to bottom:
//   full   — edge-to-edge, the loudest frame
//   wide   — full content width
//   pair / trio — a justified row: every photo in the row is the same height
//                 and keeps its own aspect ratio, so nothing is cropped
//
// Only verified facts go in `date`, `location`, and `galleryUrl`. Leave a
// field out rather than guessing.

export type Category = "music" | "events" | "portraits";

export const categories: Record<Category, { label: string; short: string; title: string }> = {
  music: { label: "Live Music", short: "Live Music", title: "Live music" },
  events: { label: "Events", short: "Events", title: "Events" },
  portraits: { label: "Portraits & Headshots", short: "Portraits", title: "Portraits & headshots" },
};

export const categoryOrder: Category[] = ["music", "events", "portraits"];

export type Row =
  | { kind: "full"; photo: string }
  | { kind: "wide"; photo: string }
  | { kind: "pair"; photos: [string, string] }
  | { kind: "trio"; photos: [string, string, string] };

export type Project = {
  slug: string;
  title: string;
  category: Category;
  /** Shown instead of the category name, e.g. "Athletics". Filtering still uses `category`. */
  label?: string;
  /** ISO date, only when verified. */
  date?: string;
  location?: string;
  cover: string;
  sequence: Row[];
  galleryUrl?: string;
  /** Kept in the data but not shown anywhere on the site. */
  hidden?: boolean;
};

const pt = (s: string) => `petty-theft-${s}`;
const sf = (s: string) => `swamp-fest-${s}`;
const lftl = (s: string) => `live-from-the-lawn-${s}`;
const jam = (s: string) => `gator-jam-${s}`;
const ggc = (s: string) => `gator-grill-club-${s}`;
const gg = (s: string) => `gator-gallop-${s}`;
const hc = (s: string) => `homecoming-parade-${s}`;
const gb = (s: string) => `cicerones-general-body-${s}`;
const rec = (s: string) => `florida-cicerones-recruitment-${s}`;
const blur = (s: string) => `its-all-a-blur-tour-${s}`;

export const allProjects: Project[] = [
  {
    slug: "hcgg-petty-theft",
    title: "HCGG × Petty Theft",
    category: "music",
    date: "2026-10-09",
    location: "Gainesville, FL",
    cover: pt("lead-vocalist-01"),
    galleryUrl: "https://galleries.photosbyjackson.org/hcgg-pettytheft/",
    sequence: [
      { kind: "full", photo: pt("guitarist-silhouette-01") },
      { kind: "pair", photos: [pt("lead-vocalist-02"), pt("lead-vocalist-04")] },
      { kind: "wide", photo: pt("lead-vocalist-01") },
      { kind: "pair", photos: [pt("lead-vocalist-03"), pt("bassist-01")] },
      { kind: "pair", photos: [pt("singer-01"), pt("lead-vocalist-06")] },
      { kind: "pair", photos: [pt("keyboardist-01"), pt("lead-vocalist-05")] },
    ],
  },
  {
    slug: "drake-j-cole-its-all-a-blur-tour",
    title: "Drake & J. Cole — It’s All a Blur Tour",
    category: "music",
    date: "2024-02-02",
    cover: blur("arena-stage-01"),
    galleryUrl: "https://galleries.photosbyjackson.org/itsallablur/",
    sequence: [{ kind: "pair", photos: [blur("arena-stage-01"), blur("arena-stage-02")] }],
  },
  {
    slug: "swamp-fest",
    title: "Swamp Fest",
    category: "music",
    date: "2026-04-14",
    location: "Gainesville, FL",
    cover: sf("co2-cannons-01"),
    galleryUrl: "https://galleries.photosbyjackson.org/swampfest/",
    sequence: [
      { kind: "full", photo: sf("co2-cannons-01") },
      { kind: "pair", photos: [sf("dj-set-01"), sf("stage-performance-01")] },
      { kind: "wide", photo: sf("crowd-01") },
      { kind: "trio", photos: [sf("dj-set-02"), sf("stage-performance-03"), sf("crowd-03")] },
      { kind: "pair", photos: [sf("stage-performance-02"), sf("main-stage-01")] },
      { kind: "wide", photo: sf("crowd-02") },
      { kind: "pair", photos: [sf("festivalgoers-01"), sf("main-stage-02")] },
    ],
  },
  {
    slug: "live-from-the-lawn",
    title: "Live From the Lawn",
    category: "music",
    date: "2026-09-23",
    location: "Gainesville, FL",
    cover: lftl("trombonist-01"),
    galleryUrl: "https://galleries.photosbyjackson.org/livefromthelawnfall2026/",
    sequence: [
      { kind: "full", photo: lftl("trombonist-01") },
      { kind: "trio", photos: [lftl("acoustic-guitarist-01"), lftl("guitarist-01"), lftl("bassist-01")] },
      { kind: "pair", photos: [lftl("table-setup-01"), lftl("guitar-detail-01")] },
      { kind: "wide", photo: lftl("guitarist-03") },
      { kind: "trio", photos: [lftl("bassist-02"), lftl("acoustic-guitarist-02"), lftl("guitarist-02")] },
      { kind: "wide", photo: lftl("guitar-detail-02") },
    ],
  },
  {
    slug: "gator-jam",
    title: "Gator Jam",
    category: "music",
    date: "2026-04-09",
    cover: jam("band-01"),
    galleryUrl: "https://galleries.photosbyjackson.org/gatorjam/",
    // Phone photos; not strong enough to show yet.
    hidden: true,
    sequence: [
      { kind: "wide", photo: jam("band-01") },
      { kind: "trio", photos: [jam("keyboardist-01"), jam("guitarist-01"), jam("stage-01")] },
    ],
  },
  {
    slug: "gator-grill-club",
    title: "Gator Grill Club",
    category: "events",
    cover: ggc("cookout-01"),
    sequence: [
      { kind: "wide", photo: ggc("live-grilling-sign-01") },
      { kind: "pair", photos: [ggc("cookout-01"), ggc("food-01")] },
      { kind: "full", photo: ggc("cookout-02") },
      { kind: "pair", photos: [ggc("grill-01"), ggc("grill-02")] },
      { kind: "pair", photos: [ggc("cookout-03"), ggc("cookout-04")] },
      { kind: "wide", photo: ggc("food-02") },
      { kind: "pair", photos: [ggc("cookout-05"), ggc("food-03")] },
    ],
  },
  {
    slug: "gator-gallop",
    title: "Gator Gallop",
    category: "events",
    label: "Athletics",
    date: "2026-10-09",
    location: "Gainesville, FL",
    cover: gg("runner-01"),
    sequence: [
      { kind: "full", photo: gg("runner-01") },
      { kind: "pair", photos: [gg("start-line-01"), gg("check-in-01")] },
      { kind: "pair", photos: [gg("runner-02"), gg("high-five-01")] },
      { kind: "wide", photo: gg("runners-01") },
      { kind: "trio", photos: [gg("runners-04"), gg("dog-01"), gg("finishers-01")] },
      { kind: "pair", photos: [gg("runners-02"), gg("runners-03")] },
    ],
  },
  {
    slug: "homecoming-parade-2026",
    title: "Homecoming Parade",
    category: "events",
    date: "2026-10-09",
    location: "Gainesville, FL",
    cover: hc("cheerleaders-01"),
    sequence: [
      { kind: "full", photo: hc("cheerleaders-01") },
      { kind: "pair", photos: [hc("mascots-01"), hc("float-01")] },
      { kind: "pair", photos: [hc("marching-band-01"), hc("float-02")] },
      { kind: "wide", photo: hc("spectators-01") },
      { kind: "pair", photos: [hc("float-03"), hc("police-escort-01")] },
      { kind: "wide", photo: hc("float-04") },
    ],
  },
  {
    slug: "campus-organizations",
    title: "Campus Organizations",
    category: "events",
    location: "University of Florida",
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
    cover: gb("headshot-01"),
    sequence: [
      { kind: "trio", photos: [gb("headshot-01"), gb("headshot-02"), gb("headshot-05")] },
      { kind: "wide", photo: gb("candid-01") },
      { kind: "trio", photos: [gb("headshot-06"), gb("headshot-07"), gb("headshot-08")] },
      { kind: "pair", photos: [gb("headshot-10"), gb("headshot-11")] },
      { kind: "trio", photos: [gb("headshot-09"), gb("mascot-01"), gb("headshot-03")] },
      { kind: "pair", photos: [gb("headshot-04"), gb("duo-portrait-01")] },
    ],
  },
  {
    slug: "florida-cicerones-recruitment-portraits",
    title: "Florida Cicerones — Recruitment Portraits",
    category: "portraits",
    location: "University of Florida",
    cover: rec("group-portrait-01"),
    sequence: [
      { kind: "wide", photo: rec("group-portrait-01") },
      { kind: "trio", photos: [rec("headshot-01"), rec("headshot-02"), rec("headshot-03")] },
      { kind: "wide", photo: rec("group-portrait-02") },
      { kind: "pair", photos: [rec("duo-portrait-01"), rec("group-portrait-03")] },
      { kind: "trio", photos: [rec("headshot-04"), rec("headshot-05"), rec("headshot-06")] },
      { kind: "wide", photo: rec("group-portrait-04") },
      { kind: "pair", photos: [rec("group-portrait-05"), rec("duo-portrait-02")] },
      { kind: "wide", photo: rec("group-portrait-06") },
      { kind: "trio", photos: [rec("headshot-07"), rec("group-portrait-07"), rec("headshot-08")] },
      { kind: "wide", photo: rec("group-portrait-08") },
    ],
  },
];

/** Projects shown on the site. */
export const projects = allProjects.filter((p) => !p.hidden);

/**
 * Home page Selected Work, in display order. Layout lives in
 * components/home/SelectedWork.tsx: [feature + tall], full, [three portraits], [two].
 */
export const selectedWork: { slug: string; photo: string }[] = [
  { slug: "hcgg-petty-theft", photo: pt("lead-vocalist-01") },
  { slug: "drake-j-cole-its-all-a-blur-tour", photo: blur("arena-stage-01") },
  { slug: "swamp-fest", photo: sf("co2-cannons-01") },
  { slug: "live-from-the-lawn", photo: lftl("acoustic-guitarist-01") },
  { slug: "florida-cicerones-general-body-headshots", photo: gb("headshot-01") },
  { slug: "gator-gallop", photo: gg("finishers-01") },
  { slug: "gator-grill-club", photo: ggc("cookout-01") },
  { slug: "homecoming-parade-2026", photo: hc("cheerleaders-01") },
];

/** Photo used for each category's entry on the home page. */
export const categoryCovers: Record<Category, string> = {
  music: lftl("bassist-02"),
  events: hc("mascots-01"),
  portraits: rec("group-portrait-03"),
};

/**
 * Hero slideshow, in order: all from HCGG × Petty Theft. The first slide is
 * server-rendered and shown immediately. `zoom` (desktop only) scales the
 * photo from `origin` to keep faces clear of the headline at bottom left.
 */
export type HeroSlide = { photo: string; slug: string; zoom?: number; origin?: string };

export const heroSlides: HeroSlide[] = [
  { photo: pt("guitarist-silhouette-01"), slug: "hcgg-petty-theft" },
  // Close-up: zoomed from the left edge, which pushes the face right of the headline.
  { photo: pt("lead-vocalist-01"), slug: "hcgg-petty-theft", zoom: 1.3, origin: "0% 30%" },
  // Low angle, full body.
  { photo: pt("lead-vocalist-03"), slug: "hcgg-petty-theft" },
  // Black and white.
  { photo: pt("lead-vocalist-06"), slug: "hcgg-petty-theft" },
  // Wider stage.
  { photo: pt("bassist-01"), slug: "hcgg-petty-theft" },
];

export function projectLabel(p: Project) {
  return p.label ?? categories[p.category].label;
}

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
