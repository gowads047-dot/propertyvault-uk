"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { freshnessLabel, isMissingTable } from "@/lib/makan-inventory";
import { PERMITTED_USES } from "@/lib/makan-listing";
import {
  EMPTY_FILTERS,
  SEARCH_CITIES,
  activeCount,
  clearCompanyFiltersIfUnused,
  fromParams,
  publicLocation,
  resultsLabel,
  textFilter,
  toQueryString,
  toResults,
  type Filters,
  type LetTypeFilter,
  type SearchQueryRow,
  type SearchResult,
} from "@/lib/makan-search";

const KIND_OPTIONS = [
  { value: "", label: "Anything" },
  { value: "room", label: "Rooms" },
  { value: "studio", label: "Studios" },
  { value: "whole_property", label: "Whole properties" },
] as const;

/**
 * Room search.
 *
 * Filtering happens in Postgres, not in the browser. The previous version did
 * `.select("*")` and filtered the whole table in JavaScript, which meant the
 * page waited for every room in the country before it could show you the three
 * in Selly Oak — fine at nine rows, useless at a few hundred, and the reason
 * nothing built on top of it could ever feel quick.
 *
 * It also read the flat `listings` table, which cannot represent a room inside
 * a house. This reads `makan_space` through a published public listing, which
 * is the only path RLS exposes to an anonymous visitor: an unpublished room, a
 * commissioner-only vacancy or anything mid-assessment simply is not in the
 * result set, rather than being filtered out here and hoping.
 *
 * Filters live in the URL so a search is shareable and survives a refresh.
 */

type Load =
  | { state: "loading" }
  | { state: "no-schema" }
  | { state: "error"; message: string }
  | { state: "ready"; results: SearchResult[] };

const PAGE_SIZE = 60;

export default function RoomsPage() {
  return (
    <Suspense fallback={<Hero />}>
      <RoomsSearch />
    </Suspense>
  );
}

function RoomsSearch() {
  const router = useRouter();
  const params = useSearchParams();

  const filters = useMemo<Filters>(
    () => fromParams(new URLSearchParams(params.toString())),
    [params]
  );

  const [load, setLoad] = useState<Load>({ state: "loading" });
  const [now, setNow] = useState<Date | null>(null);
  const [draftQ, setDraftQ] = useState(filters.q);

  // The search box is a draft the user types into, but it also has to follow
  // the URL when that changes underneath it — a back button, or a link with
  // ?q= already set. Doing that in an effect meant a second render pass on
  // every keystroke-driven URL change; adjusting during render is React's own
  // pattern for state derived from changing props.
  const [lastQ, setLastQ] = useState(filters.q);
  if (filters.q !== lastQ) {
    setLastQ(filters.q);
    setDraftQ(filters.q);
  }

  const apply = useCallback(
    (next: Filters) => router.replace(`/makan/rooms${toQueryString(next)}`, { scroll: false }),
    [router]
  );

  const search = useCallback(async () => {
    let q = supabase
      .from("makan_space")
      .select(
        `id,kind,label,ensuite,bills_included,rent_pcm,status,available_from,status_confirmed_at,
         let_types,permitted_uses,min_lease_months,guaranteed_rent_considered,
         makan_media(url,sort_order),
         makan_unit!inner(label,shared_bathrooms,makan_building!inner(address_line1,city,postcode)),
         makan_listing!inner(channel,published_at)`
      )
      // No kind filter by default. This was hard-pinned to "room", so a
      // landlord could publish a studio or a whole property through /makan/list
      // and it could never appear in search — the listing flow and the search
      // disagreed about what Makan is for, and the listing flow was right.
      // Company lets are whole properties almost by definition, so pinning to
      // rooms also hid every listing the product exists to surface.
      // Only a published public listing reaches an anonymous visitor. Stated
      // here as well as in RLS so the query uses the partial index.
      .eq("makan_listing.channel", "public")
      .not("makan_listing.published_at", "is", null)
      .in("status", filters.availableNow ? ["available_now"] : ["available_now", "available_from"])
      // Freshest first. This is the whole differentiator: every portal is full
      // of rooms that went weeks ago, and ours can prove otherwise.
      .order("status_confirmed_at", { ascending: false })
      .limit(PAGE_SIZE);

    if (filters.kind) q = q.eq("kind", filters.kind);
    if (filters.city) q = q.eq("makan_unit.makan_building.city", filters.city);
    if (filters.maxPcm !== null) q = q.lte("rent_pcm", filters.maxPcm);
    if (filters.billsIncluded) q = q.eq("bills_included", true);
    if (filters.ensuite) q = q.eq("ensuite", true);

    // contains, not overlaps: asking for company lets must not also return
    // tenant-only listings just because the arrays share the "tenant" entry.
    if (filters.letType) q = q.contains("let_types", [filters.letType]);
    // overlaps here, because a landlord who accepts two uses should answer a
    // search for either one. Both columns are GIN-indexed.
    if (filters.permittedUses.length > 0) q = q.overlaps("permitted_uses", filters.permittedUses);
    if (filters.guaranteedRent) q = q.eq("guaranteed_rent_considered", true);

    const text = textFilter(filters.q);
    if (text) q = q.or(text, { referencedTable: "makan_unit.makan_building" });

    const { data, error } = await q;
    if (error) {
      setLoad(isMissingTable(error.code)
        ? { state: "no-schema" }
        : { state: "error", message: error.message });
      return;
    }
    setNow(new Date());
    setLoad({ state: "ready", results: toResults((data ?? []) as unknown as SearchQueryRow[]) });
  }, [filters]);

  // No "loading" flip on refetch on purpose: the previous results stay on
  // screen until the new ones arrive, so changing a filter does not blank the
  // page and then repaint it. Only the very first load shows a spinner, which
  // is the initial state.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async fetch; setState runs after the await, not during render
    search();
  }, [search]);

  const results = load.state === "ready" ? load.results : [];

  return (
    <>
      <Hero />

      <section className="border-b" style={{ background: "var(--h-surface)", borderColor: "var(--h-border)" }}>
        <div className="h-container py-3">
          <div className="flex flex-wrap items-center gap-3 text-sm" style={{ color: "var(--h-muted)" }}>
            <span><strong style={{ color: "var(--h-text)" }}>£0</strong> agent fees</span>
            <span>Direct landlord contact</span>
            <Link href="/makan/list" className="ml-auto h-btn h-btn-primary !py-2 !text-sm">
              List a property free →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-8" style={{ background: "var(--h-bg)", minHeight: "50vh" }}>
        <div className="h-container">

          {/* The one filter the whole site exists for. An operator searching a
              portal has no way to ask this question, because the answer is
              decided for them by an agent who never asked the landlord. */}
          <div className="mb-5">
            <p className="text-xs font-semibold mb-2" style={{ color: "var(--h-muted)" }}>
              Who is renting?
            </p>
            <div className="flex flex-wrap gap-2">
              {([null, "tenant", "company"] as LetTypeFilter[]).map(v => (
                <button
                  key={String(v)}
                  type="button"
                  aria-pressed={filters.letType === v}
                  onClick={() => apply(clearCompanyFiltersIfUnused({ ...filters, letType: v }))}
                  className="px-4 py-2 rounded-xl text-sm font-semibold border transition-colors"
                  style={{
                    background: filters.letType === v ? "var(--h-accent)" : "var(--h-surface)",
                    color: filters.letType === v ? "#ffffff" : "var(--h-muted)",
                    borderColor: filters.letType === v ? "var(--h-accent)" : "var(--h-border)",
                  }}
                >
                  {v === null ? "Show everything" : v === "tenant" ? "Me, to live in" : "A company"}
                </button>
              ))}
            </div>
            {filters.letType === "company" && (
              <p className="text-sm mt-2" style={{ color: "var(--h-muted)" }}>
                Landlords who have said they will let to a limited company —{" "}
                <Link href="/makan/company-lets" className="underline" style={{ color: "var(--h-accent-hover)" }}>
                  what that means
                </Link>.
              </p>
            )}
          </div>

          <form
            className="flex flex-wrap items-end gap-3 mb-6"
            onSubmit={e => { e.preventDefault(); apply({ ...filters, q: draftQ }); }}
          >
            <div className="flex-1 min-w-[220px]">
              <label htmlFor="r-q" className="block text-xs font-semibold mb-1.5" style={{ color: "var(--h-muted)" }}>
                Area or postcode
              </label>
              <input id="r-q" className="h-input" value={draftQ} onChange={e => setDraftQ(e.target.value)}
                     placeholder="Selly Oak, B29…" />
            </div>

            <div>
              <label htmlFor="r-kind" className="block text-xs font-semibold mb-1.5" style={{ color: "var(--h-muted)" }}>
                Type
              </label>
              <select id="r-kind" className="h-input !w-auto" value={filters.kind ?? ""}
                      onChange={e => apply({ ...filters, kind: (e.target.value || null) as Filters["kind"] })}>
                {KIND_OPTIONS.map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="r-city" className="block text-xs font-semibold mb-1.5" style={{ color: "var(--h-muted)" }}>
                City
              </label>
              <select id="r-city" className="h-input !w-auto" value={filters.city ?? ""}
                      onChange={e => apply({ ...filters, city: e.target.value || null })}>
                <option value="">All cities</option>
                {SEARCH_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="r-max" className="block text-xs font-semibold mb-1.5" style={{ color: "var(--h-muted)" }}>
                Max per month
              </label>
              <select id="r-max" className="h-input !w-auto" value={filters.maxPcm ?? ""}
                      onChange={e => apply({ ...filters, maxPcm: e.target.value ? Number(e.target.value) : null })}>
                <option value="">Any</option>
                {[400, 500, 600, 700, 800, 1000, 1500].map(v => (
                  <option key={v} value={v}>£{v}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="h-btn h-btn-secondary !py-2 !text-sm">Search</button>

            <div className="flex flex-wrap gap-2 basis-full sm:basis-auto">
              <Toggle label="Bills included" on={filters.billsIncluded}
                      onClick={() => apply({ ...filters, billsIncluded: !filters.billsIncluded })} />
              <Toggle label="Ensuite" on={filters.ensuite}
                      onClick={() => apply({ ...filters, ensuite: !filters.ensuite })} />
              <Toggle label="Available now" on={filters.availableNow}
                      onClick={() => apply({ ...filters, availableNow: !filters.availableNow })} />
              {filters.letType === "company" && (
                <>
                  {PERMITTED_USES.map(u => (
                    <Toggle
                      key={u.value}
                      label={u.label}
                      on={filters.permittedUses.includes(u.value)}
                      onClick={() => apply({
                        ...filters,
                        permittedUses: filters.permittedUses.includes(u.value)
                          ? filters.permittedUses.filter(x => x !== u.value)
                          : [...filters.permittedUses, u.value],
                      })}
                    />
                  ))}
                  <Toggle label="Open to guaranteed rent" on={filters.guaranteedRent}
                          onClick={() => apply({ ...filters, guaranteedRent: !filters.guaranteedRent })} />
                </>
              )}
              {activeCount(filters) > 0 && (
                <button type="button" onClick={() => apply(EMPTY_FILTERS)}
                        className="px-3 py-1.5 rounded-full text-sm font-semibold underline"
                        style={{ color: "var(--h-muted)", background: "none", border: "none" }}>
                  Clear all
                </button>
              )}
            </div>
          </form>

          {load.state === "loading" && <p style={{ color: "var(--h-muted)" }}>Searching…</p>}

          {load.state === "no-schema" && (
            <Panel title="Room search is not set up yet">
              Run <code>supabase/makan-rooms-schema.sql</code> in the Supabase SQL editor, then
              reload this page.
            </Panel>
          )}

          {load.state === "error" && <Panel title="Could not search">{load.message}</Panel>}

          {load.state === "ready" && now && (
            <>
              <p className="text-sm font-semibold mb-4" style={{ color: "var(--h-text)" }}>
                {resultsLabel(results.length, filters)}
              </p>

              {results.length === 0 ? (
                <Panel title={activeCount(filters) > 0 ? "Nothing matches yet" : "No rooms listed yet"}>
                  {activeCount(filters) > 0 ? (
                    <>Try widening the budget or clearing a filter. You can also{" "}
                      <Link href="/makan/wanted" style={{ color: "var(--h-accent)" }}>post what you need</Link>{" "}
                      and let landlords come to you.</>
                  ) : (
                    <>Makan is just getting started. If you have a room,{" "}
                      <Link href="/makan/list" style={{ color: "var(--h-accent)" }}>list it free</Link>.</>
                  )}
                </Panel>
              ) : (
                <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
                  {results.map(r => (
                    <li key={r.spaceId}>
                      <Link href={`/makan/space/${r.spaceId}`}
                            className="block rounded-2xl h-full overflow-hidden transition-shadow hover:shadow-lg"
                            style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
                        {r.coverUrl && (
                          <div className="relative w-full" style={{ aspectRatio: "4 / 3", background: "var(--h-warm)" }}>
                            <Image src={r.coverUrl} alt="" fill sizes="(max-width: 640px) 100vw, 360px"
                                   className="object-cover" />
                          </div>
                        )}
                        <div className="p-5">
                        <div className="flex items-baseline justify-between gap-2 mb-1">
                          <p className="font-bold text-lg" style={{ color: "var(--h-text)" }}>
                            {r.rentPcm !== null ? `£${r.rentPcm.toLocaleString("en-GB")}` : "Price on request"}
                            {r.rentPcm !== null && <span className="text-sm font-normal" style={{ color: "var(--h-muted)" }}>/mo</span>}
                          </p>
                          {r.billsIncluded && (
                            <span className="text-xs font-semibold px-2 py-1 rounded-full"
                                  style={{ background: "var(--h-green-light)", color: "var(--h-green)" }}>
                              Bills inc.
                            </span>
                          )}
                        </div>

                        <p className="text-sm mb-1" style={{ color: "var(--h-text)" }}>
                          {r.label}{r.ensuite && " · ensuite"}
                        </p>
                        <p className="text-sm mb-3" style={{ color: "var(--h-muted)" }}>
                          {publicLocation(r)}
                        </p>

                        {/* The reason to trust this over the same room on a
                            portal. Nothing else on the card matters as much. */}
                        <p className="text-xs" style={{ color: "var(--h-subtle)" }}>
                          Availability confirmed {freshnessLabel(r.statusConfirmedAt, now)}
                        </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-4 text-xs" style={{ color: "var(--h-subtle)" }}>
            <p>🛡 Never pay a deposit before viewing in person.</p>
            <p>🔐 Makan does not verify landlord identity yet — always check ID in person.</p>
            <p>📄 Always get a written tenancy agreement.</p>
          </div>
        </div>
      </section>
    </>
  );
}

function Hero() {
  return (
    <section className="py-14" style={{ background: "var(--h-slate)" }}>
      <div className="h-container">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
               style={{ background: "rgba(232,85,61,0.15)", color: "#f08a76" }}>
            🛏 Rooms, studios &amp; whole properties
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-white leading-tight">
            Find it direct.<br />No fees, no agents.
          </h1>
          <p className="text-base mb-0" style={{ color: "rgba(255,255,255,0.75)" }}>
            Rooms, studios and whole properties — including the company lets an agent would have
            turned down on the landlord’s behalf. Each one shows the date it was last confirmed
            available.
          </p>
        </div>
      </div>
    </section>
  );
}

function Toggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on}
            className="px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors"
            style={{
              background: on ? "var(--h-text)" : "var(--h-surface)",
              color: on ? "#ffffff" : "var(--h-muted)",
              borderColor: on ? "var(--h-text)" : "var(--h-border)",
            }}>
      {label}
    </button>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-8 max-w-xl"
         style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
      <h2 className="text-lg font-bold mb-2" style={{ color: "var(--h-text)" }}>{title}</h2>
      <p className="text-sm" style={{ color: "var(--h-muted)" }}>{children}</p>
    </div>
  );
}
