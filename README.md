# Photos by Jackson

Portfolio and booking site for Jackson Kracht, photographer in Gainesville, FL.
Next.js (App Router) · TypeScript · Tailwind CSS v4 · Motion · Playwright.

The current production site at photosbyjackson.org is a separate Canva site. This
repo is not deployed yet. Client galleries stay on Pixieset at
galleries.photosbyjackson.org; this site only links to them.

## Local development

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm start
```

Checks:

```bash
npm run typecheck
npm run lint
npx playwright install chromium   # once
npm test               # builds, starts on :3200, runs tests/site.spec.ts at 5 widths
npm run screenshots    # full-page screenshots into screenshots/ (gitignored)
```

## Content

Everything editable lives in `content/`:

| File | What it holds |
|---|---|
| `content/site.ts` | Name, email, location, social links. Single source for anything shown twice. |
| `content/projects.ts` | Projects, categories, photo sequences, Selected Work, category covers. |
| `content/photos.ts` | Alt text and focal point for each photo, keyed by public name. |
| `content/galleries.ts` | Pixieset client galleries listed on /work. |
| `content/photos.generated.json` | Generated: sizes, blur placeholders, EXIF exposure. Don't edit by hand. |

### Photos: private originals, public derivatives

Originals live in `photos/`, which is gitignored and never modified. Two private
files there drive the pipeline:

- `photos/selection.json`: which originals are published, grouped by project, each
  with a descriptive label. Public names are `<prefix>-<label>-NN`, numbered in
  selection order, so the same selection always gives the same filenames.
- `photos/source-map.json`: written by the script. Maps each public name back to
  its original and SHA-1.

`npm run photos` scans `photos/` for duplicate originals, warns about near-duplicates
within a project, and writes:

- `public/photos/<project>/<name>-{640,1280,2048}.avif` and `<name>.webp` (1600px),
  with EXIF/GPS stripped
- `public/images/about/jackson-behind-the-scenes.*`
- `public/og/<project>.jpg` and `public/og.jpg` share images (1200×630)
- `content/photos.generated.json`

Stale public files are removed and every output is validated. Run
`npm run photos -- --check` to validate without writing anything. Items marked
`"pending": true` in the selection are awaiting publication permission;
`npm run photos -- --approved-only` builds without them.

### Adding a project

1. Copy the originals into `photos/` (any subfolder).
2. Add a group to `photos/selection.json`.
3. `npm run photos`
4. Add alt text (and an optional `focus`) for each public name in `content/photos.ts`.
5. Add a project record with its `sequence` to `content/projects.ts`. Only add `date`,
   `location`, and `galleryUrl` when verified.
6. `node scripts/photo-manifest.ts` to refresh `docs/PHOTO-MANIFEST.md`.

Captions show the real lens and exposure from each camera file's EXIF. Phone shots and
exports without metadata show no caption.

`node scripts/brand-assets.mjs` regenerates the favicons.

## Contact form

`POST /api/contact` validates the inquiry (shared rules in `lib/inquiry.ts`), applies a
honeypot, a minimum time-on-page, and a per-IP rate limit, then sends the email through
the [Resend](https://resend.com) HTTP API. Set on the host (see `.env.example`):

- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`: a sender on a domain verified in Resend
- `CONTACT_TO_EMAIL`: optional, defaults to jackson@photosbyjackson.org

Until those are set, the route returns 503 and the form tells visitors to email directly.
It never shows a false success.

## Deployment

Built for a Node host that runs Next.js (Vercel is the simplest fit). All pages
prerender statically; only `/api/contact` runs on demand. `/portfolio` (the old Canva
URL) redirects to `/work`; `/work/sports` redirects to `/work` now that sports is no
longer part of the portfolio.
