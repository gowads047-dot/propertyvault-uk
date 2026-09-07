# Social publishing: operating rules

How the Instagram Reels pipeline runs, what it does on its own, what needs a
person, and what to do when it stops.

## What runs where

Everything runs as Vercel crons on the production deployment. No desktop
machine is involved; if every laptop is off, the posts still go out.

| When (UTC)        | Path                    | Does                                                                              |
|-------------------|-------------------------|-----------------------------------------------------------------------------------|
| 18:00 daily       | `/api/social/publish`   | Publishes today's queued Reel, after checking it. Retries once, itself, on a passing error. |
| 07:00 Monday      | `/api/social/weekly`    | Exchanges the Instagram token for a fresh 60-day one, then emails the one-page summary. |
| on demand         | `/api/social/status`    | Queue health as JSON, for a person with the cron secret.                          |

All of them require `Authorization: Bearer $CRON_SECRET`. Vercel sends it;
for a manual call:

    curl -H "Authorization: Bearer $CRON_SECRET" https://www.propertyvaultuk.co.uk/api/social/status

**The times are approximate.** The Vercel team is on the Hobby plan, whose
cron precision is per hour: a job scheduled for 18:00 fires anywhere between
18:00 and 18:59, and Vercel does not promise a single invocation. So "19:00
UK" means between 19:00 and 20:00 UK, "07:00 Monday" means some time in that
hour, and the publisher is written on the assumption that two runs may
overlap or arrive in either order — the row is claimed with one conditional
update before anything else is done to it, and a run that loses the claim
stops. This is also why there is no separate retry cron: two slots forty
minutes apart could fire in any order, or together. The one run retries
itself instead. (Hobby also allows one run per day per job and 100 jobs per
project; this site uses seven.)

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

"Today" is the Europe/London date. The evening slot falls on the same London
day all year.

## What needs a person

**The token, once.** Publishing needs an Instagram access token from the Meta
app ("Instagram API with Instagram Login", long-lived, 60 days). Set it as
`INSTAGRAM_ACCESS_TOKEN` in Vercel. The Monday run exchanges it and writes
the result to `social_settings.ig_access_token`; from then on the stored token
is the one used and the environment variable is the fallback. A token that is
never refreshed stops working on day 61.

The Monday refresh tries the stored token first and, if Meta refuses it, the
environment token; whichever exchange succeeds is stored. Two things to know:

- **Meta will not refresh a token under 24 hours old.** A refresh on the
  Monday after a token was created fails with Meta's message; that is
  expected, and the following Monday works. The token is still good.
- **If the stored token has gone bad** (Meta answers code 190 to it), the
  evening publish falls back to `INSTAGRAM_ACCESS_TOKEN` for that run and
  logs `token_fallback_env`. To discard the stored token and start again from
  the environment variable:

      update social_settings set value = 'null' where key = 'ig_access_token';

A failed refresh returns 500, logs `token_refresh_failed`, sends its own
alert email, and is stated at the top of the Monday summary — which is still
sent. When both tokens are refused, a new one must be generated in the Meta
dashboard and set as `INSTAGRAM_ACCESS_TOKEN`. No token value is ever
logged, returned or emailed.

**The queue.** Nothing is posted that is not in `social_posts`. To load the
30-day calendar:

    npm run social:seed                         # from tomorrow
    npm run social:seed -- 2026-09-15           # from a chosen day
    npm run social:seed -- --dry-run            # look first
    npm run social:seed -- --evergreen 1,5,12   # also add pool copies of those days

Re-running is safe: rows already present (same video digest) are skipped, and
a date that already has a live post is skipped rather than shifted.

**After a re-render.** `npm run reels` changes every file, and therefore
every digest. The queued rows still carry the old digests, and a plain
re-seed inserts nothing (thirty unknown videos, thirty taken dates). Either
delete the old queued rows and seed again, or keep them and update the
digests in place:

    npm run social:seed -- --refresh-digests --dry-run
    npm run social:seed -- --refresh-digests

That rewrites `asset_sha256` on queued rows (dated and pool) whose file on
disk has changed, and touches nothing else. Deploy the new files first; the
publish checks the URL, not the disk.

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
2. Any queued or failed row dated before today is marked `skipped`, with a
   warning event (`missed_day`) and one alert email for the lot. Missed days
   are skipped, not shifted — the calendar does not slide. A row a crashed
   run left in `publishing` is asked about first (below) before it is
   written off.
3. Today's row is **claimed**: one conditional update that moves it to
   `publishing` only if it is still `queued` (or `failed`) with the attempt
   count the run read. A second run finds the claim gone and returns
   `in-progress`.
4. It is checked: plain https URL with no query string; a HEAD request
   returns 200 (not a redirect), `video/mp4`, more than 100 kB; caption at
   most 2,200 characters with 5–30 hashtags and no banned claim; the video
   has not already been published (stand-ins count).
5. It is published through the Graph API: create container — the id is
   written to the row at once — poll until finished, publish. On success the
   row records the media id, the permalink and the time. Event `published`.

## What happens when it goes wrong

| Situation                                   | What the pipeline does                                                                                                            | Result code |
|---------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|-------------|
| Check fails                                 | Row → `held`, event `qc_failed`, alert email. Then the evergreen fallback (below).                                                 | 200 if the fallback published, else 500 |
| Publish fails for a passing reason          | Network failure, HTTP 5xx, Meta codes 2, 4, 9, 9007: event `publish_retry_wait`, 45 s wait, one more go with a fresh container, in the same run. | — |
| Publish fails otherwise, or the retry fails | Row → `held` with the error, event `held_after_failures`, alert email. Codes 190 and permission errors are never retried.        | 500         |
| Stored token refused (code 190)             | The run switches to `INSTAGRAM_ACCESS_TOKEN` for that evening; event `token_fallback_env`. Without an environment token: held.   | —           |
| Nothing queued for today                    | Event `nothing_queued`, one alert email per day (`nothing_queued_alerted`). Nothing is posted and nothing is invented.              | 500         |
| No token anywhere                           | Nothing is posted; alert email (email does not need the token); the response says so.                                             | 500         |
| Database not configured                     | The response says so.                                                                                                             | 500         |
| Alert needed but `RESEND_API_KEY` missing   | Event `alert_not_sent`; the response says something needed a person and nobody was told.                                          | 500         |
| A run crashed mid-publish                   | See below.                                                                                                                        | —           |

A 500 makes the cron show as failed in the Vercel dashboard. That is
deliberate: the previous route ran for a week with no token and nothing
outside the function log said so.

Attempts (`social_posts.attempts`) count containers made for the row, across
runs; at three the row is held whatever the error. A day that fails ends
`held`, never quietly `skipped` the next evening.

### A run that crashed mid-publish

A row left in `publishing` for more than eight minutes was abandoned. The
next run asks Meta about the container the row recorded:

- **PUBLISHED** — the Reel is live. The row is marked published and the
  media id and permalink are recovered from the account's most recent posts
  (the newest one on or after the row was last touched). Event
  `recovered_published`, or `recovered_published_unmatched` if no recent post
  matched — the row is still published, with no media id, and a person should
  look.
- **FINISHED** — the last step never ran. It runs now. Event `recovered_finished`.
- **anything else, or no container recorded** — a failed attempt is counted
  (`stale_publishing`) and a new container is made.

The same check runs on a `publishing` row from an earlier day before it is
marked `skipped`: PUBLISHED is recorded as published; a container that merely
finished is not published a day late.

### The evergreen fallback

The pool is rows with `evergreen = true` and no date: copies of calendar days
that are safe to repeat. When today's post fails its checks, the least
recently used pool row that (a) is not the same video as the held post and
(b) has not gone out in the last 14 days — as itself or as a stand-in — is
copied into a new row for today (event `evergreen_fallback`, `is_clone =
true`, same digest), checked, and published in its place. The pool row's
`last_used_at` is updated so the next fallback picks a different one. A repeat
is labelled as such in the weekly summary. If no pool row is eligible, event
`no_evergreen` says which were rejected and why.

The fallback runs only on a failed check, not on an empty day. An empty day is
a real outcome and stays empty. Keep the pool stocked with
`npm run social:seed -- --evergreen ...`.

### A held row

A held row is the record of what happened and does not go out. To send the
post again, fix the cause (re-render the video, correct the caption) and
queue it on a **new date as a new row**:

- delete the held row (its events survive the delete), then insert a copy
  with a fresh `slot_date` and status `queued`; or
- delete it and run `npm run social:seed -- <date>`.

Do not set the held row's status back to `queued`: it would re-run with its
old attempt count against a date a stand-in may already have used, and the
asset-uniqueness index refuses a second calendar row with the same digest
while the held one still carries it. The alert email says the same.

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
- a post is held after failing to publish (after the in-run retry, if any);
- one or more earlier days passed without a publish;
- nothing is queued for today (once per day);
- there is no token anywhere;
- the Monday refresh cannot exchange the token.

If the alert cannot be sent, the run returns 500 and logs `alert_not_sent`.

## The Monday summary

Emailed at about 07:00 UTC to the alert address, after the token refresh.
Contains: whether the token was refreshed and when it now expires; every post
published in the last seven days with its permalink and, where the Graph API
provides them, views, reach, likes, comments, saves and shares ("unavailable"
when it does not — never zero; with no token at all the API is not asked and
the page says so); followers now; what is queued for the next fourteen days,
how many of those days are covered, and which have nothing; holds and pending
retries; the size of the evergreen pool; spend this month against the cap.

`/api/social/status` reports the same queue figures as JSON: `queuedNext14`,
`daysCovered`, `gapsNext14`, `holds`, `fails`, `lastPublished`.

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
changes the videos' digests: see "After a re-render" above.
