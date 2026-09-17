# Google Search Console — verification

The site has never been verified in Search Console. Production carries no
`google-site-verification` meta tag and no DNS TXT record for it, and the
environment variable that would emit the tag (`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`)
is unset on Vercel. Until it is verified there is no impressions, position or
query data — and that data does not backfill.

This is the one item on the SEO list that needs your Google account. It takes
about five minutes.

## Status — 17 September 2026

Property `https://www.propertyvaultuk.co.uk/` (URL prefix) was added and
verified by the **HTML file** method: `public/google19819c16e72c76b6.html`
is served at the site root and must stay there. The Google Analytics route
was tried first and Google refused it — Next renders the gtag script after
`</head>`, and that method requires it inside `<head>`. The file is bound
to this domain (Google fetches it from `www.propertyvaultuk.co.uk`), so a
fork or preview deployment cannot use it to claim the live site, which is
why it is committed rather than kept in an environment variable.

Two older unverified properties exist on the same account from earlier
attempts (`propertyvaultuk.co.uk` domain property and
`https://propertyvaultuk.co.uk/`); they are harmless and can be removed in
Settings, or the domain one verified by DNS TXT later for the wider view.

## Fastest route: Google Analytics (did not work here — see status)

The site already loads GA4 property `G-MG7FKKCKWQ` on every page. If the
Google account you use for Search Console has **Edit** access to that GA4
property, Google can verify ownership through the tag that is already there.

1. Go to https://search.google.com/search-console and sign in.
2. **Add property** → choose **URL prefix** → enter `https://www.propertyvaultuk.co.uk/` (with the `www` — the apex redirects to it).
3. Under *Other verification methods* choose **Google Analytics** → **Verify**.

If it fails, the account does not have Edit on the GA property. Use the HTML
tag route below instead.

## HTML tag route (works with any account)

1. Same as above, but choose **HTML tag**. Google shows a line like
   `<meta name="google-site-verification" content="AbC123…" />`.
2. Copy only the `content` value (`AbC123…`).
3. Set it on Vercel as `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` for the
   **Production** environment (Project → Settings → Environment Variables),
   then redeploy. The root layout emits the tag when the variable is set.
4. Back in Search Console, click **Verify**.

Do not commit the value to the repository: it identifies one Search Console
property, and a fork or preview deployment should not claim ownership of the
live site.

## Stronger: DNS TXT (recommended once the above is done)

A **Domain** property (`propertyvaultuk.co.uk`, no protocol) covers `www`,
the apex, http and https in one view and cannot be lost in a redeploy. Add the
TXT record Google gives you at the registrar. Both property types can coexist.

## After verification — do these the same day

1. **Sitemaps → Add** `https://www.propertyvaultuk.co.uk/sitemap.xml`.
   It lists 209 URLs; every one returns 200 with a canonical.
2. **URL Inspection** on `https://www.propertyvaultuk.co.uk/` → **Request indexing**.
   Then the same for `/guaranteed-rent/`, `/calculators/`, `/landlords/prs-database/`
   and `/blog/`. There is a daily quota of roughly ten; spend it on the pages
   that earn money first.
3. Check **Pages** (Indexing) after 48 hours. "Discovered – currently not
   indexed" on a new site is normal and clears as the site earns links;
   "Excluded by noindex" should list only `/community/`, `/membership/`,
   `/deal-sourcing/` and the app routes.
4. Also register at https://www.bing.com/webmasters — it can import the
   Search Console property in one click and feeds DuckDuckGo and Copilot.

## Bing and DuckDuckGo without waiting: IndexNow

Bing, DuckDuckGo, Yandex and others accept a push notification of changed
URLs (Google does not). The site carries an IndexNow key file under
`public/`, and

```bash
npm run seo:indexnow
```

submits every sitemap URL in one request; pass paths to submit only those.
Run it after a deploy that changed pages — not on a timer, and not for
unchanged URLs. HTTP 200 or 202 means accepted. Bing Webmaster Tools shows
the submissions under *IndexNow* once the site is registered there.

## Why the site is "not showing" in Google

Nothing technical blocks it: robots.txt allows crawling, the sitemap is
valid, every page has a title, description, canonical and one `<h1>`, and
HTTPS is enforced with HSTS. Google *has* indexed some pages already.

What is missing is ownership and authority. Without Search Console you
cannot see which pages are indexed or ask Google to crawl new ones; and with
no inbound links, Google has little reason to crawl often or rank the pages
above sites it already trusts. See `backlink-strategy.md` for the second half.
