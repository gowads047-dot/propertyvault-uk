-- Row-level security policies: auth.uid() evaluated once per query, and
-- one policy per table where there were two.
--
-- RUN THIS IN PRODUCTION. Nothing on the site changes until it does; it
-- closes two findings from Supabase's performance advisor (19 Sept 2026).
--
-- 1. auth.uid() in a policy is re-evaluated for every row the query
--    touches. Wrapped as (select auth.uid()) Postgres treats it as an
--    InitPlan and evaluates it once. Same predicate, same answer, one
--    call instead of n. Forty-four policies, rewritten from the catalogue
--    with nothing but that substitution.
--
-- 2. Nine Rentura tables carried two permissive policies with the same
--    predicate — own_x (USING and WITH CHECK) and rentura_x_own (USING
--    only, which for ALL means the same check) — and mortgages a third,
--    "owner". Two OR-ed identical policies are one policy evaluated
--    twice. The own_x form stays. enquiries likewise had "Users can send
--    enquiries" (public) beside "Authenticated users can send enquiries"
--    (authenticated) with the same check; for anon the predicate is
--    null = never, so the narrower one is the whole rule.
--
-- Not touched: unused indexes. The advisor lists 74, and at this size
-- nothing is being used; dropping on that evidence is guessing.

-- ── Duplicates ──────────────────────────────────────────────────────────
drop policy if exists "rentura_compliance_own" on public.rentura_compliance;
drop policy if exists "rentura_documents_own" on public.rentura_documents;
drop policy if exists "rentura_events_own" on public.rentura_events;
drop policy if exists "rentura_expenses_own" on public.rentura_expenses;
drop policy if exists "rentura_income_own" on public.rentura_income;
drop policy if exists "rentura_maintenance_own" on public.rentura_maintenance;
drop policy if exists "rentura_mortgages_own" on public.rentura_mortgages;
drop policy if exists "owner" on public.rentura_mortgages;
drop policy if exists "rentura_properties_own" on public.rentura_properties;
drop policy if exists "rentura_tenants_own" on public.rentura_tenants;
drop policy if exists "Users can send enquiries" on public.enquiries;

-- ── auth.uid() once per query ───────────────────────────────────────────
alter policy "academy_certificates_own" on public.academy_certificates
  using (((select auth.uid()) = user_id));
alter policy "academy_enrollments_own" on public.academy_enrollments
  using (((select auth.uid()) = user_id));
alter policy "Users can insert own record" on public.academy_members
  with check (((select auth.uid()) = user_id));
alter policy "Users can read own record" on public.academy_members
  using (((select auth.uid()) = user_id));
alter policy "Users can update own record" on public.academy_members
  using (((select auth.uid()) = user_id));
alter policy "academy_progress_own" on public.academy_progress
  using (((select auth.uid()) = user_id));
alter policy "academy_resources_select" on public.academy_resources
  using (((is_free = true) OR (EXISTS ( SELECT 1 FROM academy_enrollments e WHERE ((e.user_id = (select auth.uid())) AND (e.course_id = academy_resources.course_id))))));
alter policy "academy_subscriptions_own" on public.academy_subscriptions
  using (((select auth.uid()) = user_id));
alter policy "Authenticated users can send enquiries" on public.enquiries
  with check (((select auth.uid()) = sender_id));
alter policy "Recipients can mark as read" on public.enquiries
  using (((select auth.uid()) = recipient_id));
alter policy "Users can view own enquiries" on public.enquiries
  using ((((select auth.uid()) = sender_id) OR ((select auth.uid()) = recipient_id)));
alter policy "Users can add favourites" on public.favourites
  with check (((select auth.uid()) = user_id));
alter policy "Users can remove favourites" on public.favourites
  using (((select auth.uid()) = user_id));
alter policy "Users can view own favourites" on public.favourites
  using (((select auth.uid()) = user_id));
alter policy "users_own_verifications" on public.listing_verifications
  using (((select auth.uid()) = user_id));
alter policy "Users can create listings" on public.listings
  with check (((select auth.uid()) = user_id));
alter policy "Users can delete own listings" on public.listings
  using (((select auth.uid()) = user_id));
alter policy "Users can update own listings" on public.listings
  using (((select auth.uid()) = user_id));
alter policy "Users can view own listings" on public.listings
  using (((select auth.uid()) = user_id));
alter policy "makan_enquiry_insert" on public.makan_enquiry
  with check (((sender_id = (select auth.uid())) AND makan_space_is_visible(space_id)));
alter policy "makan_enquiry_read" on public.makan_enquiry
  using (((sender_id = (select auth.uid())) OR makan_is_member(makan_space_org(space_id))));
alter policy "makan_enquiry_message_insert" on public.makan_enquiry_message
  with check (((author_id = (select auth.uid())) AND (makan_enquiry_is_sender(enquiry_id) OR makan_enquiry_is_landlord(enquiry_id))));
alter policy "makan_wanted_delete" on public.makan_wanted
  using ((created_by = (select auth.uid())));
alter policy "makan_wanted_insert" on public.makan_wanted
  with check ((created_by = (select auth.uid())));
alter policy "makan_wanted_read" on public.makan_wanted
  using (((created_by = (select auth.uid())) OR makan_wanted_visible(id)));
alter policy "makan_wanted_update" on public.makan_wanted
  using ((created_by = (select auth.uid())))
  with check ((created_by = (select auth.uid())));
alter policy "Users can insert own profile" on public.profiles
  with check (((select auth.uid()) = id));
alter policy "Users can update own profile" on public.profiles
  using (((select auth.uid()) = id));
alter policy "pv_analysis_owner" on public.pv_analysis
  using ((EXISTS ( SELECT 1 FROM pv_property p WHERE ((p.id = pv_analysis.property_id) AND (p.user_id = (select auth.uid()))))))
  with check ((EXISTS ( SELECT 1 FROM pv_property p WHERE ((p.id = pv_analysis.property_id) AND (p.user_id = (select auth.uid()))))));
alter policy "pv_evidence_owner" on public.pv_evidence
  using ((EXISTS ( SELECT 1 FROM pv_property p WHERE ((p.id = pv_evidence.property_id) AND (p.user_id = (select auth.uid()))))))
  with check ((EXISTS ( SELECT 1 FROM pv_property p WHERE ((p.id = pv_evidence.property_id) AND (p.user_id = (select auth.uid()))))));
alter policy "pv_property_owner" on public.pv_property
  using ((user_id = (select auth.uid())))
  with check ((user_id = (select auth.uid())));
alter policy "own_arrears" on public.rentura_arrears
  using (((select auth.uid()) = user_id))
  with check (((select auth.uid()) = user_id));
alter policy "own_arrears_events" on public.rentura_arrears_events
  using (((select auth.uid()) = user_id))
  with check (((select auth.uid()) = user_id));
alter policy "own_compliance" on public.rentura_compliance
  using (((select auth.uid()) = user_id))
  with check (((select auth.uid()) = user_id));
alter policy "own_contacts" on public.rentura_contacts
  using (((select auth.uid()) = user_id))
  with check (((select auth.uid()) = user_id));
alter policy "own_documents" on public.rentura_documents
  using (((select auth.uid()) = user_id))
  with check (((select auth.uid()) = user_id));
alter policy "own_events" on public.rentura_events
  using (((select auth.uid()) = user_id))
  with check (((select auth.uid()) = user_id));
alter policy "own_expenses" on public.rentura_expenses
  using (((select auth.uid()) = user_id))
  with check (((select auth.uid()) = user_id));
alter policy "own_income" on public.rentura_income
  using (((select auth.uid()) = user_id))
  with check (((select auth.uid()) = user_id));
alter policy "own_maintenance" on public.rentura_maintenance
  using (((select auth.uid()) = user_id))
  with check (((select auth.uid()) = user_id));
alter policy "own_mortgages" on public.rentura_mortgages
  using (((select auth.uid()) = user_id))
  with check (((select auth.uid()) = user_id));
alter policy "own_properties" on public.rentura_properties
  using (((select auth.uid()) = user_id))
  with check (((select auth.uid()) = user_id));
alter policy "rentura_subscriptions_own" on public.rentura_subscriptions
  using (((select auth.uid()) = user_id));
alter policy "own_tenants" on public.rentura_tenants
  using (((select auth.uid()) = user_id))
  with check (((select auth.uid()) = user_id));
