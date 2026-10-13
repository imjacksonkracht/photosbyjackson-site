// Builds the public web photos from the private originals.
//
//   npm run photos                    # process new or changed photos
//   npm run photos -- --force         # rebuild everything
//   npm run photos -- --approved-only # skip photos marked "pending" (awaiting permission)
//   npm run photos -- --check         # validate outputs only, write nothing
//
// Inputs (private, gitignored, never modified):
//   photos/                 full-resolution originals, any folder layout
//   photos/selection.json   which originals are published, grouped by project,
//                           with a descriptive label for each
//
// Outputs:
//   public/photos/<dir>/<name>-{640,1280,2048}.avif, <name>.webp   (metadata stripped)
//   public/images/about/jackson-behind-the-scenes{.webp,-640.avif,…}
//   public/og/<project-slug>.jpg, public/og.jpg                    (1200×630 share images)
//   content/photos.generated.json   public: sizes, blur, exposure, source hash
//   photos/source-map.json          private: public name → original file
//
// Public names are <prefix>-<label>-NN, numbered in selection order, so the
// same selection always produces the same filenames.

import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import exifr from "exifr";
import sharp from "sharp";
import { categoryCovers, heroSlides, projects, selectedWork } from "../content/projects.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "photos");
const PUBLIC = path.join(ROOT, "public");
const OUT = path.join(PUBLIC, "photos");
const MANIFEST = path.join(ROOT, "content", "photos.generated.json");
const SOURCE_MAP = path.join(SRC, "source-map.json");
const SELECTION = path.join(SRC, "selection.json");

const AVIF_WIDTHS = [640, 1280, 2048];

// Photos shown large on the home page (hero, category tiles, Selected Work)
// get a 2560px tier for retina screens and gentler compression, which keeps
// film grain and fine detail that AVIF smooths away at lower quality.
const FEATURED = new Set([
  ...heroSlides.map((h) => h.photo),
  ...Object.values(categoryCovers),
  ...selectedWork.map((s) => s.photo),
]);
const FEATURED_WIDTHS = [640, 1280, 2048, 2560];

function profileFor(id) {
  return FEATURED.has(id)
    ? { name: "featured", widths: FEATURED_WIDTHS, quality: (w) => (w >= 2560 ? 56 : w >= 2048 ? 62 : 68) }
    : { name: "standard", widths: AVIF_WIDTHS, quality: (w) => (w >= 2048 ? 52 : 56) };
}
const FALLBACK_WIDTH = 1600;
const HERO = "petty-theft-guitarist-silhouette-01";

const args = new Set(process.argv.slice(2));
const force = args.has("--force");
const approvedOnly = args.has("--approved-only");
const checkOnly = args.has("--check");

const LENSES = {
  "FE 70-200mm F2.8 GM OSS II": "70–200mm GM II",
  "SAMYANG AF 35mm F1.8": "Samyang 35mm",
};

// ---------- helpers ----------

const exists = (p) => stat(p).then(() => true, () => false);
const sha1 = (buf) => createHash("sha1").update(buf).digest("hex");

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(jpe?g)$/i.test(entry.name)) out.push(p);
  }
  return out;
}

async function dhash(buf) {
  const px = await sharp(buf).rotate().grayscale().resize(9, 8, { fit: "fill" }).raw().toBuffer();
  let bits = "";
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) bits += px[y * 9 + x] > px[y * 9 + x + 1] ? "1" : "0";
  return bits;
}

const hamming = (a, b) => [...a].reduce((n, c, i) => n + (c !== b[i] ? 1 : 0), 0);

function formatShutter(t) {
  if (!t) return null;
  return t >= 1 ? `${Number(t.toFixed(1))}s` : `1/${Math.round(1 / t)}s`;
}

function formatExposure(e) {
  if (!e) return null;
  const parts = [
    e.FocalLength ? `${Math.round(e.FocalLength)}mm` : null,
    e.FNumber ? `ƒ/${Number(e.FNumber.toFixed(1))}` : null,
    formatShutter(e.ExposureTime),
    e.ISO ? `ISO ${e.ISO}` : null,
  ].filter(Boolean);
  return parts.length >= 3 ? parts.join(" · ") : null;
}

function outputsFor(base, widths = AVIF_WIDTHS) {
  return [...widths.map((w) => `${base}-${w}.avif`), `${base}.webp`];
}

// ---------- plan ----------

async function plan() {
  const selection = JSON.parse(await readFile(SELECTION, "utf8"));
  const entries = [];
  const names = new Set();

  for (const group of selection.groups) {
    const counters = {};
    for (const item of group.items) {
      const stem = `${group.prefix}-${item.label}`;
      counters[stem] = (counters[stem] ?? 0) + 1;
      const name = `${stem}-${String(counters[stem]).padStart(2, "0")}`;
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) throw new Error(`Bad public name "${name}"`);
      if (names.has(name)) throw new Error(`Name collision: ${name}`);
      names.add(name);
      if (approvedOnly && item.pending) continue;
      entries.push({
        name,
        group: group.dir,
        src: item.src,
        pending: !!item.pending,
        urlBase: `/photos/${group.dir}/${name}`,
      });
    }
  }
  if (selection.about) {
    entries.push({ name: "jackson-behind-the-scenes", group: "about", src: selection.about.src, pending: false, urlBase: `/${selection.about.out}` });
  }
  return entries;
}

// ---------- process ----------

async function processOne(entry, buf, hash, previous) {
  const base = path.join(PUBLIC, entry.urlBase);
  const profile = profileFor(entry.name);
  const files = outputsFor(base, profile.widths);
  if (
    !force &&
    previous?.sourceHash === hash.slice(0, 12) &&
    (previous.profile ?? "standard") === profile.name &&
    (await Promise.all(files.map(exists))).every(Boolean)
  ) {
    return previous;
  }
  await mkdir(path.dirname(base), { recursive: true });

  // .rotate() bakes in EXIF orientation. Sharp writes no EXIF/XMP/GPS unless
  // asked, so public files carry pixels and a colour profile only.
  const img = sharp(buf).rotate();
  const meta = await img.metadata();
  const upright = meta.orientation && meta.orientation >= 5;
  const width = upright ? meta.height : meta.width;
  const height = upright ? meta.width : meta.height;

  for (const w of profile.widths) {
    await img
      .clone()
      .resize({ width: Math.min(w, width), withoutEnlargement: true })
      .avif({ quality: profile.quality(w), effort: 5 })
      .toFile(`${base}-${w}.avif`);
  }
  await img
    .clone()
    .resize({ width: Math.min(FALLBACK_WIDTH, width) })
    .webp({ quality: 78, effort: 5 })
    .toFile(`${base}.webp`);

  const tiny = await img.clone().resize(20).webp({ quality: 40 }).toBuffer();
  const { dominant } = await img.clone().resize(64).stats();
  const color = `#${[dominant.r, dominant.g, dominant.b]
    .map((c) => Math.round(c * 0.55).toString(16).padStart(2, "0"))
    .join("")}`;

  let exif = null;
  try {
    exif = await exifr.parse(buf, { pick: ["FocalLength", "FNumber", "ExposureTime", "ISO", "LensModel", "Model"] });
  } catch {
    exif = null;
  }
  // Phone shots: no lens line, and their exposure data isn't meaningful here.
  const camera = exif?.Model && /^ILCE/.test(exif.Model);

  return {
    id: entry.name,
    path: entry.urlBase,
    group: entry.group,
    width,
    height,
    color,
    blur: `data:image/webp;base64,${tiny.toString("base64")}`,
    exposure: camera ? formatExposure(exif) : null,
    lens: camera && exif?.LensModel ? (LENSES[exif.LensModel] ?? exif.LensModel) : null,
    sourceHash: hash.slice(0, 12),
    profile: profile.name,
    widths: profile.widths,
  };
}

async function shareImages(manifest) {
  await mkdir(path.join(PUBLIC, "og"), { recursive: true });
  const wanted = new Set(projects.map((p) => `${p.slug}.jpg`));
  for (const f of await readdir(path.join(PUBLIC, "og"))) {
    if (!wanted.has(f)) await rm(path.join(PUBLIC, "og", f));
  }
  const jobs = projects.map((p) => [p.cover, path.join(PUBLIC, "og", `${p.slug}.jpg`)]);
  jobs.push([HERO, path.join(PUBLIC, "og.jpg")]);
  for (const [id, out] of jobs) {
    if (!manifest[id]) throw new Error(`Share image: cover "${id}" was not generated`);
    await sharp(path.join(PUBLIC, `${manifest[id].path}.webp`))
      .resize(1200, 630, { fit: "cover", position: sharp.strategy.attention })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(out);
  }
}

// ---------- validate ----------

async function validate(manifest) {
  const problems = [];
  for (const [id, m] of Object.entries(manifest)) {
    for (const f of outputsFor(path.join(PUBLIC, m.path), m.widths)) {
      if (!(await exists(f))) problems.push(`${id}: missing ${path.relative(ROOT, f)}`);
    }
    const webp = path.join(PUBLIC, `${m.path}.webp`);
    if (await exists(webp)) {
      const meta = await sharp(webp).metadata();
      if (meta.exif || meta.xmp || meta.iptc) problems.push(`${id}: public file still carries metadata`);
    }
  }
  for (const p of projects) {
    const ids = [p.cover, ...p.sequence.flatMap((r) => ("photos" in r ? r.photos : [r.photo]))];
    for (const id of ids) if (!manifest[id]) problems.push(`project ${p.slug}: unknown photo "${id}"`);
    if (!(await exists(path.join(PUBLIC, "og", `${p.slug}.jpg`)))) problems.push(`project ${p.slug}: missing share image`);
  }
  return problems;
}

// ---------- main ----------

async function main() {
  const previous = JSON.parse(await readFile(MANIFEST, "utf8").catch(() => "{}"));

  if (checkOnly) {
    const problems = await validate(previous);
    problems.forEach((p) => console.error(`✗ ${p}`));
    console.log(problems.length ? `${problems.length} problem(s)` : `✓ ${Object.keys(previous).length} photos valid`);
    process.exit(problems.length ? 1 : 0);
  }

  const entries = await plan();

  // Exact duplicates anywhere in the source library (by content hash).
  const byHash = new Map();
  for (const file of await walk(SRC)) {
    const h = sha1(await readFile(file));
    byHash.set(h, [...(byHash.get(h) ?? []), path.relative(SRC, file)]);
  }
  for (const files of byHash.values()) if (files.length > 1) console.warn(`  duplicate originals: ${files.join(" = ")}`);

  const manifest = {};
  const sourceMap = {};
  const hashes = [];
  for (const entry of entries) {
    const file = path.join(SRC, entry.src);
    if (!(await exists(file))) throw new Error(`Missing original for ${entry.name}: photos/${entry.src}`);
    const buf = await readFile(file);
    const hash = sha1(buf);
    const dh = await dhash(buf);
    for (const other of hashes) {
      if (other.hash === hash) throw new Error(`${entry.name} is the same file as ${other.name}`);
      if (other.group === entry.group && hamming(other.dh, dh) <= 4) {
        console.warn(`  near-duplicate: ${entry.name} ~ ${other.name}`);
      }
    }
    hashes.push({ name: entry.name, group: entry.group, hash, dh });

    process.stdout.write(`${entry.name.padEnd(48)} `);
    manifest[entry.name] = await processOne(entry, buf, hash, previous[entry.name]);
    sourceMap[entry.name] = { src: entry.src, sha1: hash, pending: entry.pending || undefined };
    console.log(`${manifest[entry.name].width}×${manifest[entry.name].height}`);
  }

  // Remove public files that no longer belong to any selected photo.
  const keep = new Set(Object.values(manifest).flatMap((m) => outputsFor(path.join(PUBLIC, m.path), m.widths)));
  for (const dir of [OUT, path.join(PUBLIC, "images", "about")]) {
    if (!(await exists(dir))) continue;
    for (const file of await walk2(dir)) if (!keep.has(file)) await rm(file);
  }

  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  await writeFile(SOURCE_MAP, `${JSON.stringify(sourceMap, null, 2)}\n`);

  // Share images need projects.ts to reference only generated photos.
  const problemsBefore = (await validate(manifest)).filter((p) => !p.includes("share image"));
  if (problemsBefore.length) {
    problemsBefore.forEach((p) => console.error(`✗ ${p}`));
    console.error("Fix content/projects.ts, then rerun.");
    process.exit(1);
  }
  await shareImages(manifest);
  const problems = await validate(manifest);
  problems.forEach((p) => console.error(`✗ ${p}`));
  console.log(`\n${Object.keys(manifest).length} photos → content/photos.generated.json${problems.length ? `, ${problems.length} problem(s)` : ", all valid"}`);
  process.exit(problems.length ? 1 : 0);
}

async function walk2(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk2(p)));
    else out.push(p);
  }
  return out;
}

await main();
