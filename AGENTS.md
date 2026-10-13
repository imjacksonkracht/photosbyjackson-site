# Photos by Jackson site agent instructions

## Purpose and layout

Portfolio and booking site for Jackson Kracht. Next.js App Router + TypeScript + Tailwind CSS v4 + Motion, tested with Playwright, deployed to Cloudflare Workers through OpenNext. The 2026 redesign brief approved replacing the earlier dependency-free static prototype (kept for reference in `legacy/`).

- `app/`: routes (`/`, `/work`, `/work/{music,sports,events,portraits}`, `/work/[slug]`, `/about`, `/contact`, `/api/contact`).
- `components/`: UI. `content/`: all editable data. `lib/`: shared logic.
- `scripts/process-photos.mjs` builds `public/photos/` derivatives from originals in `photos/` (gitignored), driven by the private `photos/selection.json`.
- Portfolio categories: Live Music, Events, Portraits & Headshots. Sports is retired; keep its originals but do not list it.

## Local use

```bash
npm install
npm run dev
```

## Constraints

- This version of Next.js has breaking changes from older releases; check `node_modules/next/dist/docs/` before using unfamiliar APIs.
- Use only Jackson's genuine photographs. Verify a file exists before referencing it; every id must exist in both `content/photos.generated.json` and `content/photos.ts`.
- Do not invent prices, turnaround times, contact details, reviews, clients, credentials, event dates, locations, or gallery URLs. Leave optional fields out rather than guessing.
- Keep business details in `content/site.ts` so duplicated values cannot diverge.
- Do not identify people in photos by name in public copy, alt text, filenames, manifests, or scripts. Client names may appear only in the private `photos/` folder.
- Publish client photos only when Jackson has confirmed permission. Mark others `"pending": true` in the selection.
- Preserve keyboard access, focus handling, alt text, responsive layout, lazy loading, reduced-motion support, and lightbox controls.
- Never put credentials in client code. Contact delivery secrets are server env vars only.
- Only deploy the `photosbyjackson-preview` Worker. The Cloudflare account also hosts unrelated production Workers (LexSheet, Kracht); never modify them. Do not change DNS or alter the Pixieset gallery platform without explicit approval.
- Keep copy short and factual. No project descriptions, exposure captions, or photo counts on public pages.

## Verification

- `npm run typecheck`, `npm run lint`, `npm run build`, `npm test`.
- Review screenshots (`npm run screenshots`) at 375, 390, 768, 1024, and 1440 widths.
- Report missing image content separately from code defects.

## Code review rules

- Flag references to nonexistent photo ids, duplicated business details that diverge, inaccessible controls, unverified claims, and unnecessary dependencies.
