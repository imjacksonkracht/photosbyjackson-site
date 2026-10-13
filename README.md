# Photos by Jackson

Portfolio and booking site for Jackson Kracht, photographer in Gainesville, FL.
Next.js 16.3 (App Router) · TypeScript · Tailwind CSS v4 · Motion · Playwright · Cloudflare Workers (OpenNext).

The current production site at photosbyjackson.org is a separate Canva site. This
repo is deployed only to a preview Worker:
https://photosbyjackson-preview.jackson-185.workers.dev Client galleries stay on Pixieset at
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
PLAYWRIGHT_BASE_URL=https://photosbyjackson-preview.jackson-185.workers.dev npm test  # test a deployed Worker
npm run screenshots    # full-page screenshots into screenshots/ (gitignored)
```

## Content

Everything editable lives in `content/`:

| File | What it holds |
|---|---|
| `content/site.ts` | Name, email, location, social links. Single source for anything shown twice. |
| `content/projects.ts` | Projects, categories, photo sequences, hero slides, Selected Work, category covers. `hidden: true` keeps a project's data without showing it. |
| `content/photos.ts` | Alt text and focal point for each photo, keyed by public name. |
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

## Deployment (Cloudflare Workers)

The site runs on Cloudflare Workers through the OpenNext adapter
(`@opennextjs/cloudflare`), which deploys the real `next build` output.

```bash
npm run cf:preview   # build and serve locally in the Workers runtime (workerd)
npm run cf:deploy    # build and deploy the preview Worker (photosbyjackson-preview)
npm run cf:deploy:production  # build and deploy the production Worker (photosbyjackson)
```

- `wrangler.jsonc`: the default environment is the preview Worker; `env.production` is
  the `photosbyjackson` Worker. Neither has custom domains yet; the cutover plan is in
  `docs/LAUNCH.md`.
- Every page is prerendered, so `open-next.config.ts` serves prerendered pages from
  Workers static assets (`staticAssetsIncrementalCache`); no KV or R2 is needed.
- Next.js is pinned to 16.3.8: OpenNext 1.20.10 can't yet run Next 16.4
  ([opennextjs-cloudflare#1448](https://github.com/opennextjs/opennextjs-cloudflare/issues/1448)).
- Rollback: `npx wrangler deployments list` then `npx wrangler rollback <version-id>`.
- `CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL` are plain vars in `wrangler.jsonc`.
  Set the API key as a secret on each Worker: `npx wrangler secret put RESEND_API_KEY` (preview) and `npx wrangler secret put RESEND_API_KEY --env production`.
- Old URLs: `/portfolio` → `/work`; `/work/sports` → `/work`; renamed project slugs
  redirect to their new pages.
- vinext (`npx vinext check`: 94% compatible) is Cloudflare's recommended path for new
  apps; revisit when it leaves beta.
