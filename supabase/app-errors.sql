-- Errors the site hits, kept where they can be read.
--
-- RUN THIS IN PRODUCTION. Until it exists, server errors still go to the
-- function log and browser errors are dropped at /api/errors/ with a 503.
--
-- Two sources write here through the service key: the server, from
-- instrumentation.ts (onRequestError — every unhandled error in a page,
-- route or server action), and the browser, from /api/errors/ (the error
-- boundaries and window.onerror). Nobody else reads or writes: RLS on,
-- no policies. /rentura/admin/errors/ lists the last hundred.

create table if not exists public.app_errors (
  id          uuid        primary key default gen_random_uuid(),
  ts          timestamptz not null default now(),
  side        text        not null check (side in ('server', 'client')),
  message     text        not null,
  stack       text,
  digest      text,
  path        text,
  method      text,
  router      text,
  route_type  text,
  user_agent  text,
  meta        jsonb
);

create index if not exists app_errors_ts_idx on public.app_errors (ts desc);

alter table public.app_errors enable row level security;
revoke all on public.app_errors from anon, authenticated;
