-- Trigger functions: not callable over the API, and a fixed search_path.
--
-- RUN THIS IN PRODUCTION. Nothing on the site changes until it does; it
-- closes two findings from Supabase's security advisor (18 Sept 2026).
--
-- 1. Every function in public is granted EXECUTE to PUBLIC by default, so
--    PostgREST exposes each one at /rest/v1/rpc/<name> to anon and
--    authenticated alike. For a trigger function that is a door with
--    nothing behind it — Postgres refuses to run one outside a trigger —
--    but it is still a door, and handle_new_user() is SECURITY DEFINER.
--    A trigger does not need the firing user to hold EXECUTE (checked on
--    this database in a rolled-back transaction: revoked from every role
--    including the owner, the row-touch trigger still ran), so the grant
--    buys nothing and is withdrawn.
--
-- 2. Three of them ran with whatever search_path the caller had. For a
--    SECURITY DEFINER function that is the textbook privilege-escalation
--    route: create a same-named object earlier in the path and the
--    function, running as its owner, calls yours. The bodies only touch
--    public.* by qualified name and now(), which lives in pg_catalog and is
--    always found, so an empty search_path changes nothing they do.
--
-- Not touched: the makan_*_visible / _org / _is_member helpers. They are
-- SECURITY DEFINER by design — RLS policies call them, and the policy runs
-- as the querying role, which must therefore hold EXECUTE. The advisor
-- lists them; that is the cost of the pattern, not a misconfiguration.

revoke execute on function public.handle_new_user()             from public, anon, authenticated;
revoke execute on function public.handle_updated_at()           from public, anon, authenticated;
revoke execute on function public.makan_touch_updated_at()      from public, anon, authenticated;
revoke execute on function public.makan_enquiry_mark_replied()  from public, anon, authenticated;
revoke execute on function public.makan_space_status_audit()    from public, anon, authenticated;

alter function public.handle_new_user()        set search_path = '';
alter function public.handle_updated_at()      set search_path = '';
alter function public.makan_touch_updated_at() set search_path = '';
