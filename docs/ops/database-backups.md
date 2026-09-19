# Database backups

The Supabase project (`ubmxpuukspfponiesasc`, "makan", eu-west-1) is on the
**free plan, which keeps no backups**. Until this workflow existed the live
database was the only copy of every enquiry, subscriber, Rentura record and
Makan listing.

`.github/workflows/db-backup.yml` takes a full `pg_dump` of the `public` and
`auth` schemas every night at 02:17 UTC, encrypts it, checks it decrypts and
reads as a dump, and keeps it as a GitHub Actions artifact for 30 days. It can
also be run by hand from the Actions tab (*Database backup → Run workflow*).

## One-time setup (two secrets)

Repository → Settings → Secrets and variables → Actions → New repository secret:

| Secret | Value |
|---|---|
| `SUPABASE_DB_URL` | Supabase dashboard → Connect → **Session pooler** → the URI, with the database password filled in. It looks like `postgresql://postgres.ubmxpuukspfponiesasc:PASSWORD@aws-0-eu-west-1.pooler.supabase.com:5432/postgres`. Use the session pooler, not the direct host: the direct host is IPv6-only and GitHub's runners have no IPv6. |
| `BACKUP_PASSPHRASE` | Anything long (16+ characters) and private. Keep a copy somewhere that is not this repository or GitHub — without it the backups cannot be opened. |

Then run the workflow once by hand and confirm it goes green and an artifact
appears on the run.

## Restoring

1. Download the artifact from the run (Actions → Database backup → the run →
   Artifacts). It unzips to one file, `propertyvault-<date>.dump.gz.enc`.
2. Decrypt and decompress:
   ```bash
   openssl enc -d -aes-256-cbc -pbkdf2 -iter 200000 -pass pass:'THE PASSPHRASE' \
     -in propertyvault-2026-09-19T0217Z.dump.gz.enc | gunzip > backup.dump
   ```
3. See what is in it:
   ```bash
   pg_restore --list backup.dump | less
   ```
4. Restore into a database. To a fresh Supabase project (the usual reason —
   the old one is gone), against its session-pooler URL:
   ```bash
   pg_restore --no-owner --no-privileges --schema=public --dbname "$NEW_DB_URL" backup.dump
   ```
   `auth` is included in the dump for the user rows, but a new Supabase
   project owns its own `auth` schema; restore `public` first, then bring
   across `auth.users` selectively if needed:
   ```bash
   pg_restore --no-owner --data-only --schema=auth --table=users --dbname "$NEW_DB_URL" backup.dump
   ```
   A single table into the live database (the other usual reason — one table
   was damaged):
   ```bash
   pg_restore --no-owner --data-only --table=contact_messages --dbname "$DB_URL" backup.dump
   ```
5. Re-run the migrations `npm run check:db` reports as missing, then point the
   site's `NEXT_PUBLIC_SUPABASE_URL` / keys at the new project.

## What it does not cover

- **Storage buckets** (Makan listing photos, Rentura documents). Those are
  files in Supabase Storage, not rows; the dump has the metadata, not the
  bytes. When there is a meaningful number of them, add a step that syncs the
  buckets to somewhere else.
- **Point-in-time recovery.** One copy a night; a mistake at 14:00 loses the
  day. Supabase Pro has PITR if that ever matters.
- **Retention beyond 30 days.** GitHub's artifact limit. Download one a month
  to keep longer.
