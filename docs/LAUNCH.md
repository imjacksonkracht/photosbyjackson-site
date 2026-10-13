# Production launch: photosbyjackson.org → Cloudflare Worker

Status: **live.** Cut over on 2026-10-13 at 11:45 ET, with the user's approval. All
steps succeeded, and photosbyjackson.org is served by the `photosbyjackson` Worker.
The rollback below still applies if ever needed (the Canva values are preserved).

Custom domain IDs: apex `9fea6384c6afad1e843d5305e44cbe28049696bc`,
www `ca2db9d3078e1e569c02ca1654ef0705bb15015b`. Both are recorded in
`env.production.routes`.

- Production Worker: `photosbyjackson` (`wrangler.jsonc` → `env.production`), currently
  https://photosbyjackson.jackson-185.workers.dev
- Preview Worker: `photosbyjackson-preview`, unchanged
- Zone: `photosbyjackson.org` (account "Photos by Jackson Account", Free plan,
  Cloudflare nameservers), SSL mode Full

## Current state (inspected 2026-10-13)

| Record | Value | Proxy | Role |
|---|---|---|---|
| `A photosbyjackson.org` | 103.169.142.6 | DNS only, TTL 60 (was 3600) | Canva site |
| `A www.photosbyjackson.org` | 103.169.142.6 | DNS only, TTL 60 (was 3600) | Canva; it 301s www → apex |
| Page rule `photosbyjackson.org/*` | 301 → `https://www.photosbyjackson.org/$1` | — | **Dormant** (page rules only fire on proxied traffic) |
| `CNAME galleries` / `gallery` | domain.pixieset.com | DNS only | Pixieset, **untouched** |
| `A projects` / `www.projects` | 103.169.142.0 | DNS only | Separate Canva site, **untouched** |
| `A link` (×2) | AWS IPs | Proxied | Untouched |
| MX, DKIM (Stripe), SPF, DMARC, verification TXT | — | — | Email/verification, **untouched** |

No Workers routes, custom domains, or redirect rules exist on the zone.

The canonical host is the apex, `https://photosbyjackson.org` (the site's canonical
URLs, sitemap, and robots already use it). Canva also redirects www → apex today.

## Cutover

0. ~~Lower the TTL on the two `A` records from 3600 to 60.~~ **Done 2026-10-13.**
   Values and proxy status are unchanged; Canva still serves both hosts.
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
6. ~~Add the custom domains to `env.production.routes`.~~ Done.

The custom domain took about 1–2 minutes to take effect at Cloudflare's edge; during
that window requests still reached Canva.

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
- **Mail:** MX lists both Google (priorities 1–10) and iCloud (priority 10). Kept as
  is: inquiries to `jackson@photosbyjackson.org` arrive. The cutover touches no MX,
  SPF, DKIM, or DMARC records.
- **workers.dev:** after launch, `photosbyjackson.jackson-185.workers.dev` also serves
  the site. That's harmless (canonical URLs point to the apex), but `workers_dev` can
  be set to `false` in `env.production` once the custom domains work.

## Exact calls

Zone `18240b40c33f131d1a2cb4ff01d15e9c`, account `7185e3e596ff658976b222cd5847a8c2`.

### Canva snapshot (restore these on rollback)

| Record ID | Type | Name | Content | Proxied | TTL |
|---|---|---|---|---|---|
| `7127407bfb1a0af56f98d957d03ebad6` | A | photosbyjackson.org | 103.169.142.6 | false | 3600 (now 60) |
| `de5556b45d5d9dcf730b2bb53343a2e1` | A | www.photosbyjackson.org | 103.169.142.6 | false | 3600 (now 60) |

Page rule `4ca3b83c6f4dc75e220bd15e9ce906ef`, priority 1, active:
`photosbyjackson.org/*` → forwarding_url 301 `https://www.photosbyjackson.org/$1`.

### Cutover

1. `DELETE /zones/{zone}/pagerules/4ca3b83c6f4dc75e220bd15e9ce906ef`
2. `DELETE /zones/{zone}/dns_records/7127407bfb1a0af56f98d957d03ebad6` and
   `.../de5556b45d5d9dcf730b2bb53343a2e1`
3. `PUT /accounts/{account}/workers/domains`, once per hostname:
   `{"hostname": "photosbyjackson.org", "service": "photosbyjackson", "environment": "production", "zone_id": "<zone>"}`
   (and the same with `www.photosbyjackson.org`)
4. `PUT /zones/{zone}/rulesets/phases/http_request_dynamic_redirect/entrypoint`:
   ```json
   {"rules": [{
     "description": "www to apex",
     "expression": "(http.host eq \"www.photosbyjackson.org\")",
     "action": "redirect",
     "action_parameters": {"from_value": {
       "status_code": 301,
       "target_url": {"expression": "concat(\"https://photosbyjackson.org\", http.request.uri.path)"},
       "preserve_query_string": true
     }}
   }]}
   ```

### Rollback

1. `GET /accounts/{account}/workers/domains?zone_id=<zone>`, then
   `DELETE /accounts/{account}/workers/domains/{id}` for both hostnames.
2. `POST /zones/{zone}/dns_records` twice:
   `{"type": "A", "name": "photosbyjackson.org", "content": "103.169.142.6", "proxied": false, "ttl": 60}`
   and the same for `www.photosbyjackson.org`.
3. `PUT .../rulesets/phases/http_request_dynamic_redirect/entrypoint` with `{"rules": []}`.
4. Optional: recreate the page rule from the snapshot. It was dormant.
