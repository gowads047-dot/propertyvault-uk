-- Rate limiting counters.
--
-- RUN THIS IN PRODUCTION. Until it exists, consume_rate_limit() 404s, the
-- limiter fails closed by design, and /api/deal-ai-verdict returns 429 for
-- everyone. That is the safe direction — before this file the endpoint was
-- callable by anyone with no limit at all — but it does mean the AI verdict
-- stays off until this runs.

create table if not exists public.rate_limit (
  bucket      text primary key,
  count       integer not null default 0,
  expires_at  timestamptz not null
);

-- Rows are only ever read by the function below, which runs as definer.
-- Nothing else should reach this table.
alter table public.rate_limit enable row level security;
revoke all on public.rate_limit from anon, authenticated;

-- Lets the cleanup below find expired rows without scanning the table.
create index if not exists rate_limit_expires_idx on public.rate_limit (expires_at);

/*
 * Add one to a bucket and return the new count.
 *
 * The increment has to be atomic. Read-then-write would let two concurrent
 * requests both read 11, both write 12, and both be allowed past a limit of
 * 12 — which is exactly the case a rate limiter exists to stop. The upsert
 * does it in one statement, under the row lock Postgres takes anyway.
 *
 * An expired bucket resets rather than being deleted and recreated, so a
 * caller cannot get a fresh window by racing the cleanup.
 */
create or replace function public.consume_rate_limit(
  p_bucket text,
  p_window_seconds integer
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  insert into public.rate_limit as rl (bucket, count, expires_at)
  values (p_bucket, 1, now() + make_interval(secs => p_window_seconds))
  on conflict (bucket) do update
    set count = case
          when rl.expires_at < now() then 1
          else rl.count + 1
        end,
        expires_at = case
          when rl.expires_at < now() then now() + make_interval(secs => p_window_seconds)
          else rl.expires_at
        end
  returning rl.count into v_count;

  return v_count;
end;
$$;

-- Only the service role calls this. The anon key must not be able to burn
-- somebody else's allowance, or inflate a bucket to lock them out.
revoke all on function public.consume_rate_limit(text, integer) from public, anon, authenticated;
grant execute on function public.consume_rate_limit(text, integer) to service_role;

/*
 * Housekeeping. Expired rows are harmless — the function resets them in place —
 * so this is only to stop the table growing without bound. Call it from any
 * existing cron, or leave it; at this traffic the table stays small either way.
 */
create or replace function public.purge_rate_limit()
returns integer
language sql
security definer
set search_path = public
as $$
  with gone as (
    delete from public.rate_limit where expires_at < now() - interval '1 day'
    returning 1
  )
  select count(*)::integer from gone;
$$;

revoke all on function public.purge_rate_limit() from public, anon, authenticated;
grant execute on function public.purge_rate_limit() to service_role;
