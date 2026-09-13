# Scheduled jobs

Seven crons in `vercel.json`, run by Vercel. Until 13 September 2026 none of
them had ever reached its handler: `trailingSlash: true` answered every bare
path with a 308, and the cron runner requested the bare path. #121 gave the
paths their slash and #122 made `/api/` paths serve on either form. The
first genuine runs are the ones after that deploy.

The plan is Hobby, which means each job runs **once a day at most** and
fires **anywhere inside its scheduled hour**, not on the minute.

| Path | Schedule (UTC) | What it does | What a run leaves behind |
|---|---|---|---|
| `/api/notifications/blog-draft/` | Mon 07:00 | Emails the owner a blog prompt for the week | Email to `info@` |
| `/api/social/weekly/` | Mon 07:00 | Exchanges the Instagram token for a fresh long-lived one and stores it | `social_events` row; with no token, an alert email |
| `/api/notifications/compliance/` | 08:00 daily | Emails a Rentura landlord whose certificate expires in exactly 45, 14 or 3 days | Email only on a matching day; nothing otherwise |
| `/api/notifications/rent-reminders/` | 09:00 daily | Emails a Rentura landlord whose tenant's rent is due today | Email only on a matching day |
| `/api/rentura/cancel-reminders/` | Mon 10:00 | Reminds a member whose subscription is ending | Email only if a subscription is ending |
| `/api/social/publish/` | 18:00 daily | Publishes today's queued Reel, with QC | `social_events` rows — always, whatever happened |
| `/api/vault/purge/` | Sun 03:00 | Deletes anonymous Vault properties untouched for 90 days | Nothing visible; returns a count |

## How to know they are running

The publisher is the one that always writes. After the 18:00 hour:

```sql
select ts, level, event, left(detail::text, 120)
from social_events
where ts >= current_date + interval '18 hours'
  and detail->>'via' is null      -- rows from the site, not the external task
order by ts;
```

- `alert_sent` (error) — the cron reached the handler; there is no Instagram
  token; an email went to `info@`. **This is what to expect until a token is
  set.** It is the proof the cron works.
- `already_published` — the cron reached the handler after the external
  process had already posted the day's Reel.
- `published`, `publish_failed`, `qc_failed`, `held_after_failures` — the site
  published (or tried to) itself.
- nothing at all — the cron did not reach the handler. Check the Vercel
  dashboard: Project → Settings → Cron Jobs shows each job's last run and
  status; Logs shows the request and its status code.

The other six only write email. The Monday morning pair should produce two
emails to `info@` (a blog prompt, and a token alert until a token exists).

## Two things outside this codebase

**The external publisher.** The `via: "scheduled-task"` rows in
`social_events` come from a Claude scheduled task on the owner's machine,
`propertyvault-instagram-daily-reel` (`~/.claude/scheduled-tasks/…`), which
fires at about 18:00–18:01 UTC and publishes through a Composio Instagram
connection, writing to Supabase directly. It has its own quality gate —
asset probe, caption rules, duplicate check — but not the site's claims
filter, and it never sets `qc`. Its prompt records that the owner chose it
as the publisher and ruled out code edits from it.

Now the site's cron reaches its handler, both run in the same hour. Both
claim the row atomically, so a double post is unlikely — but with no
Instagram token in the environment the site will email an alert every
night. Two ways to make that stop, and it is the owner's call:

- keep the task as publisher and remove `/api/social/publish/` from
  `vercel.json` (the code stays; the alert stops); or
- set `INSTAGRAM_ACCESS_TOKEN` on Vercel and disable the task, so the
  site publishes with its full QC, including the claims filter.

Not `social_settings.paused`: the task honours it too, and would stop.

**Instagram token.** `social_settings.ig_access_token` is null and there is
no `INSTAGRAM_ACCESS_TOKEN` in the environment as far as the app's behaviour
shows. Until one exists the publish cron stops at the token check every
night and emails about it. Set the token and the Monday job keeps it fresh.

## Adding a cron

Path with a trailing slash, a `route.ts` behind it that calls
`authorizeCron`, a schedule that runs at most once a day.
`src/lib/crons.test.ts` fails the suite on any of those being wrong.
