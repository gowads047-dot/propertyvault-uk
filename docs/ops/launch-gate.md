# Launch gate — the thirty

The list the site does not launch without, as set on 19 September 2026, with
where each one stands and how that was checked. Three columns of truth:
**Done** is verified on the deployed site or on `next start` of the branch;
**In PR** is built, tested and waiting to merge; **Yours** needs an account,
a key or a dashboard toggle only the owner has.

| # | Item | Status | Evidence / what is left |
|---|------|--------|-------------------------|
| 1 | Turn on RLS | Done | All 60 tables in `public` have RLS on (`pg_class.relrowsecurity`). The 11 with no policies are service-role-only by design (`rate_limit`, `social_*`, `tenant_*`, `rentura_right_to_rent`, `app_errors`). |
| 2 | No keys in the front end | Done | Client chunks grep clean for service-role, Resend, Stripe, Meta, Anthropic and cron secrets. The only `NEXT_PUBLIC_*` values are the Supabase URL + anon key (public by design), site URL, admin email, site-verification token. |
| 3 | Lock admin routes | Done | `/api/admin/*` (check, enquiries, users, errors) each verify a session server-side and require `isAdmin(email)`; the admin pages are client-gated *and* only render data those routes return. `/api/rentura/admin` and Makan admin likewise. |
| 4 | Rate-limit logins | Done (platform) | Every sign-in is Supabase Auth (`signInWithPassword` / OTP), which rate-limits `/token` per IP and email sends per hour at the project level. The tenant token login is behind `rateGuard`. **Yours:** Supabase → Authentication → Attack protection → enable *leaked password protection*. |
| 5 | Turnstile on forms | In PR #179 | Widget in all 14 public forms; contact + subscribe routes verify server-side before any field is read; fails closed. Verified with Cloudflare's always-pass and always-fail test keys. **Yours:** create the Turnstile site, set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`. |
| 6 | CSP and HSTS | In PR #178 | Full policy on every route (`csp.test.ts` holds it to the code); `script-src` pinned to self + GTM + Cloudflare (`'unsafe-inline'` is required by a static Next site — see the comment in `next.config.ts`). HSTS `max-age=63072000; includeSubDomains; preload`. Zero violations across five page types with consent accepted. **Yours (optional):** submit at hstspreload.org. |
| 7 | npm audit | In PR #175 | Next 16.3.1 → 16.3.5 (closes a critical RCE advisory in image optimisation), sharp 0.35.4. `npm audit`: 0 vulnerabilities. |
| 8 | Force HTTPS | Done | `http://` → 308 `https://` on www and apex; apex → www 308; HSTS present (Vercel). |
| 9 | Error tracking | In PR #180 | `onRequestError` records every unhandled server error; browser beacon from both error boundaries and window listeners; `app_errors` table **created in production**; `/rentura/admin/errors/` reads it. Verified end-to-end. |
| 10 | Daily database backups | In PR #181 | The Supabase org is on the **free plan — no backups existed**. Nightly encrypted `pg_dump` to a 30-day GitHub artifact, self-verifying. **Yours:** two repository secrets (`SUPABASE_DB_URL` session-pooler URI, `BACKUP_PASSPHRASE`), then run it once. |
| 11 | Honest lastmod dates | Done | `sitemap.ts` sets `lastModified` only for blog posts, from their real dates; everything else carries none. |
| 12 | Canonical tags | Done | Every prerendered page has one except `/embed/*` (noindex by design) and Makan's signed-in app pages (robots-blocked). |
| 13 | Kill staging / noindex | In PR #176 | Preview deployments send `X-Robots-Tag: noindex, nofollow` (`VERCEL_ENV === "preview"` only). |
| 14 | LocalBusiness schema | In PR #176 | On every page from the root layout; now with `telephone` and a real `logo` (was the 16px favicon). |
| 15 | Author bylines | Done | "By Nass · date · read time" on every post; Article schema `author` → `/about/`. |
| 16 | No orphan pages | Done | Link graph over the build: 211/211 sitemap pages have at least one inbound internal link. |
| 17 | Allow AI search bots | Done | `robots.txt` is `User-agent: *` allow; no bot is blocked. Only the signed-in apps and `/api/` are disallowed, for everyone. |
| 18 | INP under 200 ms | Lab yes; field pending | Input handlers 3–8 ms, zero long tasks, 805 DOM nodes on the heaviest calculator; Lighthouse mobile TBT 100–200 ms. INP is a field metric: Speed Insights (this PR) will report the real number once there is traffic. |
| 19 | Never add llms.txt | Done | `/llms.txt` is 404 and nothing generates one. |
| 20 | No FAQ schema | In PR #176 | FAQPage JSON-LD removed from 128 pages; the visible FAQ lists stay. |
| 21 | SPF, DKIM, DMARC | Done / Yours | SPF (root: Hostinger; `send.`: Amazon SES for Resend), DKIM (`resend._domainkey`) and DMARC all resolve. DMARC is `p=none`. **Yours:** once nothing else sends as the domain, change the `_dmarc` TXT to `v=DMARC1; p=quarantine; rua=mailto:info@propertyvaultuk.co.uk`. |
| 22 | One-click unsubscribe | In PR #177 | `List-Unsubscribe` + `List-Unsubscribe-Post` (RFC 8058) on newsletter emails, footer link, signed token, rate-limited route. **Yours:** run `supabase/subscribers-consent.sql`. |
| 23 | Consent box before phone numbers | In PR #177 | Required checkbox on the only public form that takes a phone number; the tick time is stored with the enquiry. |
| 24 | No ad cookies before consent | Done | gtag.js is not even fetched until Accept All; Consent Mode defaults all four signals to denied. |
| 25 | Consent Mode v2 | Done | `ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage` defaulted denied in `<head>`; PR #182 makes Accept All grant all four. |
| 26 | WCAG 2.2 AA | Done | Lighthouse accessibility 100 on all 161 sitemap pages; every text node checked for AA contrast in both colour schemes; focus ring on every control; 2.2 additions checked: target size (no failures in Lighthouse's `target-size`), focus never obscured by the sticky header (pages scroll-pad it), no drag-only interaction, consistent help (same contact link in the footer everywhere). |
| 27 | Meta Conversions API | In PR #182 | Server-side Lead per enquiry, hashed email/phone, `fbc` from the click id, only with consent. **Yours:** `META_PIXEL_ID`, `META_CAPI_ACCESS_TOKEN`. |
| 28 | Google enhanced conversions | In PR #182 | `user_data` + conversion event on the existing gtag, only for consented visitors. **Yours:** `NEXT_PUBLIC_GADS_CONVERSION_ID`, `NEXT_PUBLIC_GADS_LEAD_LABEL`. |
| 29 | UTMs into every form | In PR #177 | utm_*, gclid, fbclid, msclkid, landing page and referrer captured on arrival and sent with every submission; visible per enquiry in the admin list and the notification email. |
| 30 | Do not look vibe-coded | — | The rest of this table. |

## After the PRs merge, in this order

1. Merge #175 (deps), #176 (schema), #178 (CSP), #180 (errors), #181 (backups), #172, #177, then #179 and #182 (I rebase those two after #177).
2. Run in the Supabase SQL editor: `supabase/subscribers-consent.sql`, `supabase/rls-initplan.sql` (from #171). `npm run check:db` confirms.
3. Set the secrets and keys listed under **Yours** above; `npm run check:env` lists every variable and what it enables.
4. Turn on leaked-password protection in Supabase Auth.
5. Change the DMARC record.
6. Run the backup workflow once by hand and check the artifact.
