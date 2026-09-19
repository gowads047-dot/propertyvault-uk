-- Subscribers: where they came from, and whether they have left.
--
-- RUN THIS IN PRODUCTION. Until it does, the subscribe route stores the
-- row without these two fields (it retries without them on an unknown
-- column) and the unsubscribe link cannot record the request.
--
-- attribution: the utm_* / click id / landing page / referrer the visitor
-- arrived with, as the form sent it. unsubscribed_at: set by
-- /api/unsubscribe/, the one-click link in every newsletter email; a fresh
-- sign-up clears it, because signing up again is renewed consent.

alter table public.subscribers add column if not exists attribution jsonb;
alter table public.subscribers add column if not exists unsubscribed_at timestamptz;
