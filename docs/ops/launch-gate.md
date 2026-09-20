# Launch gate — the thirty

The list the site does not launch without, as set on 19 September 2026, with
where each one stands and how that was checked. **Done** is verified on the
deployed site (every PR below is merged and live as of 19 Sept, 23:00);
**Yours** needs an account, a key or a dashboard toggle only the owner has.
The PR numbers say where the code and the verification live.

| # | Item | Status | Evidence / what is left |
|---|------|--------|-------------------------|
| 1 | Turn on RLS | Done | All 60 tables in `public` have RLS on (`pg_class.relrowsecurity`). Of the 11 with no policies, nine are service-role-only by design (`rate_limit`, `social_*`, `tenant_invites`, `tenant_issue_updates`, `app_errors`). Two were not: `rentura_right_to_rent` and `tenant_issues` are read with the user's session and were returning nothing (#189). And `profiles` had the opposite problem: `using (true)` on a table with every user's phone number (#190). **Yours:** `supabase/missing-policies.sql`, `supabase/profiles-privacy.sql`. |
| 2 | No keys in the front end | Done | Client chunks grep clean for service-role, Resend, Stripe, Meta, Anthropic and cron secrets. The only `NEXT_PUBLIC_*` values are the Supabase URL + anon key (public by design), site URL, admin email, site-verification token. |
| 3 | Lock admin routes | Done | `/api/admin/*` (check, enquiries, users, errors) each verify a session server-side and require `isAdmin(email)`; the admin pages are client-gated *and* only render data those routes return. `/api/rentura/admin` and Makan admin likewise. |
| 4 | Rate-limit logins | Done (platform) | Every sign-in is Supabase Auth (`signInWithPassword` / OTP), which rate-limits `/token` per IP and email sends per hour at the project level. The tenant token login is behind `rateGuard`. **Yours:** Supabase → Authentication → Attack protection → enable *leaked password protection*. |
| 5 | Turnstile on forms | Done (#179) | Widget in all 14 public forms; contact + subscribe routes verify server-side before any field is read; fails closed. Verified with Cloudflare's always-pass and always-fail test keys. **Yours:** create the Turnstile site, set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`. |
| 6 | CSP and HSTS | Done (#178) | Full policy on every route (`csp.test.ts` holds it to the code); `script-src` pinned to self + GTM + Cloudflare (`'unsafe-inline'` is required by a static Next site — see the comment in `next.config.ts`). HSTS `max-age=63072000; includeSubDomains; preload`. Zero violations across five page types with consent accepted. **Yours (optional):** submit at hstspreload.org. |
| 7 | npm audit | Done (#175) | Next 16.3.1 → 16.3.5 (closes a critical RCE advisory in image optimisation), sharp 0.35.4. `npm audit`: 0 vulnerabilities. |
| 8 | Force HTTPS | Done | `http://` → 308 `https://` on www and apex; apex → www 308; HSTS present (Vercel). |
| 9 | Error tracking | Done (#180) | `onRequestError` records every unhandled server error; browser beacon from both error boundaries and window listeners; `app_errors` table **created in production**; `/rentura/admin/errors/` reads it. Verified end-to-end. |
| 10 | Daily database backups | Done (#181) | The Supabase org is on the **free plan — no backups existed**. Nightly encrypted `pg_dump` to a 30-day GitHub artifact, self-verifying. **Yours:** two repository secrets (`SUPABASE_DB_URL` session-pooler URI, `BACKUP_PASSPHRASE`), then run it once. |
| 11 | Honest lastmod dates | Done | `sitemap.ts` sets `lastModified` only for blog posts, from their real dates; everything else carries none. |
| 12 | Canonical tags | Done | Every prerendered page has one except `/embed/*` (noindex by design) and Makan's signed-in app pages (robots-blocked). |
| 13 | Kill staging / noindex | Done (#176) | Preview deployments send `X-Robots-Tag: noindex, nofollow` (`VERCEL_ENV === "preview"` only). |
| 14 | LocalBusiness schema | Done (#176) | On every page from the root layout; now with `telephone` and a real `logo` (was the 16px favicon). |
| 15 | Author bylines | Done | "By Nass · date · read time" on every post; Article schema `author` → `/about/`. |
| 16 | No orphan pages | Done | Link graph over the build: 211/211 sitemap pages have at least one inbound internal link. |
| 17 | Allow AI search bots | Done | `robots.txt` is `User-agent: *` allow; no bot is blocked. Only the signed-in apps and `/api/` are disallowed, for everyone. |
| 18 | INP under 200 ms | Lab yes; field pending (#183) | Input handlers 3–8 ms, zero long tasks, 805 DOM nodes on the heaviest calculator; Lighthouse mobile TBT 100–200 ms. INP is a field metric: Speed Insights (this PR) will report the real number once there is traffic. |
| 19 | Never add llms.txt | Done | `/llms.txt` is 404 and nothing generates one. |
| 20 | No FAQ schema | Done (#176) | FAQPage JSON-LD removed from 128 pages; the visible FAQ lists stay. |
| 21 | SPF, DKIM, DMARC | Done / Yours | SPF (root: Hostinger; `send.`: Amazon SES for Resend), DKIM (`resend._domainkey`) and DMARC all resolve. DMARC is `p=none`. **Yours:** once nothing else sends as the domain, change the `_dmarc` TXT to `v=DMARC1; p=quarantine; rua=mailto:info@propertyvaultuk.co.uk`. |
| 22 | One-click unsubscribe | Done (#177) | `List-Unsubscribe` + `List-Unsubscribe-Post` (RFC 8058) on newsletter emails, footer link, signed token, rate-limited route. Columns applied to production. |
| 23 | Consent box before phone numbers | Done (#177) | Required checkbox on the only public form that takes a phone number; the tick time is stored with the enquiry. |
| 24 | No ad cookies before consent | Done | gtag.js is not even fetched until Accept All; Consent Mode defaults all four signals to denied. |
| 25 | Consent Mode v2 | Done | `ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage` defaulted denied in `<head>`; PR #182 makes Accept All grant all four. |
| 26 | WCAG 2.2 AA | Done | Lighthouse accessibility 100 on all 161 sitemap pages; every text node checked for AA contrast in both colour schemes; focus ring on every control; 2.2 additions checked: target size (no failures in Lighthouse's `target-size`), focus never obscured by the sticky header (pages scroll-pad it), no drag-only interaction, consistent help (same contact link in the footer everywhere). |
| 27 | Meta Conversions API | Done (#182) | Server-side Lead per enquiry, hashed email/phone, `fbc` from the click id, only with consent. **Yours:** `META_PIXEL_ID`, `META_CAPI_ACCESS_TOKEN`. |
| 28 | Google enhanced conversions | Done (#182) | `user_data` + conversion event on the existing gtag, only for consented visitors. **Yours:** `NEXT_PUBLIC_GADS_CONVERSION_ID`, `NEXT_PUBLIC_GADS_LEAD_LABEL`. |
| 29 | UTMs into every form | Done (#177) | utm_*, gclid, fbclid, msclkid, landing page and referrer captured on arrival and sent with every submission; visible per enquiry in the admin list and the notification email. |
| 30 | Do not look vibe-coded | — | The rest of this table, plus a structured security review of everything above (#186): three findings, all fixed — the admin routes had never been able to read the session token (every admin page 401'd, owner included); the sign-up upsert did not match the `lower(email)` index (42P10 — every sign-up 500'd for two hours, reproduced and fixed); an anonymous sign-up could undo someone else's unsubscribe. Sign-up, repeat sign-up and the unsubscribed case were then exercised on production with Resend's delivery-sink address. |

## What is left, all yours

Everything code could do is merged and verified on production. `app_errors`
and the `subscribers` columns have been applied to the database already.

1. Run `supabase/rls-initplan.sql`, `supabase/missing-policies.sql` and
   `supabase/profiles-privacy.sql` in the Supabase SQL editor (the connector
   is not allowed to change policies or add buckets). The last two matter
   more: until they run, landlords cannot save a right-to-rent check or see
   tenant issues, tenants cannot attach a photo to an issue, and anyone with
   the anon key can list every user's phone number. `npm run check:db` lists
   all three.
2. Vercel → Settings → Environment Variables (Production): the Turnstile pair,
   the Meta pair, the Google Ads pair. `npm run check:env` explains each.
3. GitHub → Settings → Secrets: `SUPABASE_DB_URL` (session pooler) and
   `BACKUP_PASSPHRASE`; then Actions → Database backup → Run workflow, once.
4. Supabase → Authentication → Attack protection → leaked password protection.
5. DNS: `_dmarc` TXT → `v=DMARC1; p=quarantine; rua=mailto:info@propertyvaultuk.co.uk`.
6. Optional: hstspreload.org; Bing Webmaster Tools import.
