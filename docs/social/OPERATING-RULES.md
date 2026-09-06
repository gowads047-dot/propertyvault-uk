# Social publishing: operating rules

How the Instagram Reels pipeline runs, what it does on its own, what needs a
person, and what to do when it stops.

## What runs where

Everything runs as Vercel crons on the production deployment. No desktop
machine is involved; if every laptop is off, the posts still go out.

| When (UTC)        | Path                          | Does                                                                    |
|-------------------|-------------------------------|-------------------------------------------------------------------------|
| 18:00 daily       | `/api/social/publish`         | Publishes today's queued Reel, after checking it.                       |
| 18:40 daily       | `/api/social/publish/retry`   | Same handler. A no-op when 18:00 succeeded; one more go when it did not. |
| 06:00 Monday      | `/api/social/refresh-token`   | Exchanges the Instagram token for a fresh 60-day one and stores it.     |
| 07:00 Monday      | `/api/social/weekly`          | Emails the one-page summary.                                            |
| on demand         | `/api/social/status`          | Queue health as JSON, for a person with the cron secret.                |

All of them require `Authorization: Bearer $CRON_SECRET`. Vercel sends it;
for a manual call:

    curl -H "Authorization: Bearer $CRON_SECRET" https://www.propertyvaultuk.co.uk/api/social/status

State lives in Supabase (project `ubmxpuukspfponiesasc`), in six tables created
by `supabase/social-ops.sql`:

- `social_posts` — the queue. One row per post; status is one of `queued`,
  `publishing`, `published`, `failed`, `held`, `skipped`.
- `social_settings` — `paused`, `monthly_cap_gbp`, `alert_email`, `ig_access_token`.
- `social_events` — every decision the publisher made, newest first. Read this
  before the Vercel function logs.
- `social_spend` — money spent, entered by hand.
- `social_facts` — claims a caption may make about the business, and who approved them.
- `social_assets` — licence records for the music beds.

"Today" is the Europe/London date. Both evening slots fall on the same London
day all year.

## What needs a person

**The token, once.** Publishing needs an Instagram access token from the Meta
app ("Instagram API with Instagram Login", long-lived, 60 days). Set it as
`INSTAGRAM_ACCESS_TOKEN` in Vercel. The Monday refresh exchanges it and writes
the result to `social_settings.ig_access_token`; from then on the stored token
is the one used and the environment variable is only a fallback. If the
weekly refresh ever fails (it returns 500 and logs `token_refresh_failed`),
the token has expired and a new one must be generated in the Meta dashboard.
A token that is never refreshed stops working on day 61.

**The queue.** Nothing is posted that is not in `social_posts`. To load the
30-day calendar:

    npm run social:seed                         # from tomorrow
    npm run social:seed -- 2026-09-15           # from a chosen day
    npm run social:seed -- --dry-run            # look first
    npm run social:seed -- --evergreen 1,5,12   # also add pool copies of those days

Re-running is safe: rows already present (same video digest) are skipped, and
a date that already has a live post is skipped rather than shifted.

**Budget.** `monthly_cap_gbp` starts at 0, meaning no spend is approved.
Nothing in this pipeline spends money — publishing is free. The cap and the
`social_spend` ledger exist so that when something paid is added (a boost, a
tool) it has a ceiling to check against and a place to be recorded. Raise the
cap by updating the settings row; record spend by inserting into the ledger.

**New content.** Every caption in the calendar is computed from the
calculators and states its assumptions. Anything new that makes a claim about
the business goes into `social_facts` as `proposed` and is approved by a
person before it is used. The banned-claim list (`src/lib/social/claims.ts`)
is applied to every row before it is published, whoever wrote it.

## What happens on an ordinary evening

1. If `social_settings.paused` is `true`: stop. Event `skipped_paused`.
2. Any queued row dated before today is marked `skipped`, with a warning event
   (`missed_day`). Missed days are skipped, not shifted — the calendar does
   not slide.
3. Today's row is checked: plain https URL with no query string; a HEAD
   request returns 200 (not a redirect), `video/mp4`, more than 100 kB;
   caption at most 2,200 characters with 5–30 hashtags and no banned claim;
   the video has not already been published.
4. It is published through the Graph API: create container, poll until
   finished, publish. On success the row records the media id, the permalink
   and the time. Event `published`.

## What happens when it goes wrong

| Situation                                   | What the pipeline does                                                                                                            | Result code |
|---------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|-------------|
| Check fails                                 | Row → `held`, event `qc_failed`, alert email. Then the evergreen fallback (below).                                                 | 200 if the fallback published, else 500 |
| Publish fails                               | Row → `failed`, attempt counted, event `publish_failed`. Retried at 18:40 and on later runs, up to 3 attempts.                     | 500         |
| Third failure                               | Row → `held`, alert email.                                                                                                        | 500         |
| Nothing queued for today                    | Event `nothing_queued`. Nothing is posted and nothing is invented.                                                                 | 200         |
| No token anywhere                           | Nothing is posted; the response says so.                                                                                          | 500         |
| Database not configured                     | Same.                                                                                                                             | 500         |
| Alert needed but `RESEND_API_KEY` missing   | Event `alert_not_sent`; the response says a hold happened and nobody was told.                                                    | 500         |
| A run crashed mid-publish                   | The next run counts it as a failed attempt (`stale_publishing`) and retries.                                                      | —           |

A 500 makes the cron show as failed in the Vercel dashboard. That is
deliberate: the previous route ran for a week with no token and nothing
outside the function log said so.

### The evergreen fallback

The pool is rows with `evergreen = true` and no date: copies of calendar days
that are safe to repeat. When today's post fails its checks, the least
recently used pool row is copied into a new row for today (event
`evergreen_fallback`), checked, and published in its place. The pool row's
`last_used_at` is updated so the next fallback picks a different one. A repeat
is labelled as such in the weekly summary.

The fallback runs only on a failed check, not on an empty day. An empty day is
a real outcome and stays empty. Keep the pool stocked with
`npm run social:seed -- --evergreen ...`.

### A held row

A held row does not go out until a person changes it. Read `last_error` and
`qc` on the row, fix the cause (re-render the video, correct the caption), and
set `status` back to `queued`. If a fallback already went out that day, the
one-live-post-per-day rule will refuse a second — re-date the row instead.

## Pausing

    npm run social:pause -- on
    npm run social:pause -- off
    npm run social:pause            # show state

Or set `social_settings.paused` to `true`/`false` directly. Takes effect at the
next run; no deploy. Days that pass while paused are marked `skipped` on
resume, not posted late.

## Alerts

Sent by Resend to `social_settings.alert_email` (default
`info@propertyvaultuk.co.uk`), when:

- a post is held after failing its checks;
- a post is held after its third failed publish;
- the weekly refresh cannot exchange the token (the cron itself fails; there
  is no separate email — check the Monday summary and the Vercel dashboard).

If the alert cannot be sent, the run returns 500 and logs `alert_not_sent`.

## The Monday summary

Emailed at 07:00 UTC to the alert address. Contains: every post published in
the last seven days with its permalink and, where the Graph API provides them,
views, reach, likes, comments, saves and shares ("unavailable" when it does
not — never zero); followers now; what is queued for the next fourteen days
and which days have nothing; holds and pending retries; the size of the
evergreen pool; spend this month against the cap.

## Attribution

The bio link is `https://www.propertyvaultuk.co.uk/ig`. It redirects to the
home page with `utm_source=instagram&utm_medium=bio&utm_campaign=reels` and
sets a `pv_src=instagram` cookie (30 days, site-wide, HttpOnly, Secure).

Instagram-to-site visits are not yet measured in any report; the weekly
summary says so in those words. Instagram-to-subscription attribution only
exists once the sign-up flow records `pv_src` — it does not yet. TODO: read
the `pv_src` cookie in `src/app/api/subscribe/route.ts` and the Rentura
checkout session creation, and store it against the subscriber or customer.
Until then, no attribution figure will appear anywhere, and none should be
quoted.

## Music

Every rendered Reel carries a music bed (`npm run reels`):
`assets/music/bed-a-calm-pulse.mp3` under autopsy, the-gap and the-cash;
`assets/music/bed-b-tense-tick.mp3` under the-bill, the-stress and the-tax.
Both are ElevenLabs Music generations on the owner's account; the licence
records with track ids are the seed rows in `social_assets`. Re-rendering
changes the videos' digests, so after a re-render the queue's `asset_sha256`
values no longer match the files — re-seed, or update the rows.
