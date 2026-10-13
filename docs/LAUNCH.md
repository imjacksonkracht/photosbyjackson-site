# Production launch: photosbyjackson.org → Cloudflare Worker

Status: **not applied.** Each DNS step needs explicit approval.

- Production Worker: `photosbyjackson` (`wrangler.jsonc` → `env.production`), currently
  https://photosbyjackson.jackson-185.workers.dev
- Preview Worker: `photosbyjackson-preview`, unchanged
- Zone: `photosbyjackson.org` (account "Photos by Jackson Account", Free plan,
  Cloudflare nameservers), SSL mode Full

## Current state (inspected 2026-10-13)

| Record | Value | Proxy | Role |
|---|---|---|---|
| `A photosbyjackson.org` | 103.169.142.6 | DNS only, TTL 3600 | Canva site |
| `A www.photosbyjackson.org` | 103.169.142.6 | DNS only, TTL 3600 | Canva; it 301s www → apex |
| Page rule `photosbyjackson.org/*` | 301 → `https://www.photosbyjackson.org/$1` | — | **Dormant** (page rules only fire on proxied traffic) |
| `CNAME galleries` / `gallery` | domain.pixieset.com | DNS only | Pixieset, **untouched** |
| `A projects` / `www.projects` | 103.169.142.0 | DNS only | Separate Canva site, **untouched** |
| `A link` (×2) | AWS IPs | Proxied | Untouched |
| MX, DKIM (Stripe), SPF, DMARC, verification TXT | — | — | Email/verification, **untouched** |

No Workers routes, custom domains, or redirect rules exist on the zone.

The canonical host is the apex, `https://photosbyjackson.org` (the site's canonical
URLs, sitemap, and robots already use it). Canva also redirects www → apex today.

## Cutover

0. *(Optional, about an hour before)* Lower the TTL on the two `A` records above from
   3600 to 60, so resolvers drop the Canva IP quickly. No visible change.
1. **Delete the dormant page rule** (`photosbyjackson.org/*` → www). Once the apex is
   proxied it would start firing and redirect every visit to www, which redirects
   back to the apex: a loop.
2. **Delete** `A photosbyjackson.org` and `A www.photosbyjackson.org`. Workers custom
   domains refuse hostnames that already have records. The site is unreachable for
   the few seconds between this step and step 3.
3. **Attach Workers Custom Domains** `photosbyjackson.org` and `www.photosbyjackson.org`
   → `photosbyjackson`. Cloudflare creates the proxied DNS records and certificates.
4. **Add a redirect rule:** host `www.photosbyjackson.org` → `https://photosbyjackson.org${path}`,
   301, query string preserved.
5. Verify: both hosts, a deep link on www, HTTPS, the redirects, images, a contact
   inquiry, and that `galleries.photosbyjackson.org` still loads Pixieset.
6. Afterwards: add the custom domains to `env.production.routes` in `wrangler.jsonc`
   so future deploys keep them.

Nothing else in the zone changes.

## Rollback (back to Canva)

The Canva site and its domain settings stay untouched, so rollback is DNS only
(about 2 minutes):

1. Detach the two Workers Custom Domains. This removes their DNS records; the
   Worker keeps running on workers.dev.
2. Recreate `A photosbyjackson.org 103.169.142.6` and `A www.photosbyjackson.org 103.169.142.6`,
   **DNS only** (not proxied), TTL 60.
3. Delete the www → apex redirect rule. Canva handles that redirect itself.
4. Optional: recreate the old page rule. It was dormant and had no effect.

Keep the Canva site published, and keep its `canva-domain-verify` TXT records, until
the new site has run cleanly for a while. Disconnecting the domain in Canva is the
last step, done only once rollback is no longer needed.

## Not part of this cutover

- **Vercel** (`photosbyjackson-site.vercel.app`, team "latitudedemo") rebuilds `main`
  on every push. It serves no custom domain. To retire it: Vercel → the project →
  Settings → Git → Disconnect, then Settings → Advanced → Delete Project.
  Disconnecting does nothing to GitHub or Cloudflare.
- **GitHub Pages** builds the repo root of `main` at
  `imjacksonkracht.github.io/photosbyjackson-site/`, a leftover from the old static
  site (it now renders the README). To retire it: GitHub → repo → Settings → Pages →
  Source: None.
- **Mail:** MX lists both Google (priorities 1–10) and iCloud (priority 10). Senders
  try Google first. Make sure `jackson@photosbyjackson.org` actually lives in the
  provider that receives it, or contact inquiries won't arrive. This is independent of
  the website cutover.
