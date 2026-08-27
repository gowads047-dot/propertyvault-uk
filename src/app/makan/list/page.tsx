"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { isMissingTable } from "@/lib/makan-inventory";
import {
  EMPTY_DRAFT,
  PERMITTED_USES,
  PROPERTY_TYPES,
  UNIT_TYPES,
  acceptsCompanies,
  companyLetExplainer,
  draftSummary,
  isValidPostcode,
  normalisePostcode,
  toInsertPlan,
  validateDraft,
  type LetType,
  type ListingDraft,
  type PermittedUse,
  type PropertyType,
  type UnitType,
} from "@/lib/makan-listing";

/**
 * List a property.
 *
 * The whole thesis lives on this screen. A landlord who has been let down by an
 * agent gives Makan about three minutes before going back to the agent, so
 * anything that can be asked later is asked later — bedrooms, description and
 * lease length are all optional, and there is no wizard.
 *
 * The question that matters is "who would you let to". Ticking companies is
 * what puts a property in front of serviced-accommodation and supported-living
 * operators — the offer an agent declines on the landlord's behalf, because a
 * company let costs them their management fee.
 *
 * No organisation setup either. If a landlord has no org, publishing creates
 * one. Being asked to "create an organisation" before listing a spare room is
 * exactly the kind of friction this page exists to remove.
 */

type Stage =
  | { at: "editing" }
  | { at: "publishing" }
  | { at: "published"; spaceId: string }
  | { at: "no-schema" };

interface Lookup {
  state: "idle" | "looking" | "found" | "not-found";
  city?: string;
  lat?: number;
  lng?: number;
}

export default function ListPage() {
  const { user, profile, loading: authLoading } = useAuth();

  const [d, setD] = useState<ListingDraft>(EMPTY_DRAFT);
  const [stage, setStage] = useState<Stage>({ at: "editing" });
  const [error, setError] = useState<string | null>(null);
  const [errorField, setErrorField] = useState<keyof ListingDraft | null>(null);
  const [lookup, setLookup] = useState<Lookup>({ state: "idle" });

  const set = <K extends keyof ListingDraft>(k: K, v: ListingDraft[K]) =>
    setD(prev => ({ ...prev, [k]: v }));

  /**
   * postcodes.io fills in the town and the coordinates so nobody types their
   * own city. Free, no key, and if it is down the landlord can still publish —
   * the city field just stays editable and the map pin is null.
   */
  const lookupPostcode = useCallback(async (raw: string) => {
    if (!isValidPostcode(raw)) { setLookup({ state: "idle" }); return; }
    setLookup({ state: "looking" });
    try {
      const res = await fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(normalisePostcode(raw))}`
      );
      if (!res.ok) { setLookup({ state: "not-found" }); return; }
      const json = await res.json();
      const r = json?.result;
      if (!r) { setLookup({ state: "not-found" }); return; }
      const city: string = r.post_town || r.admin_district || "";
      setLookup({ state: "found", city, lat: r.latitude, lng: r.longitude });
      setD(prev => (prev.city.trim() ? prev : { ...prev, city }));
    } catch {
      setLookup({ state: "not-found" });
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { lookupPostcode(d.postcode); }, 500);
    return () => clearTimeout(t);
  }, [d.postcode, lookupPostcode]);

  /** The landlord's org, created on first publish rather than asked for. */
  async function ensureOrg(userId: string): Promise<string | null> {
    const mine = await supabase.from("makan_org_member").select("org_id").eq("user_id", userId).limit(1);
    if (mine.error) throw mine.error;
    if (mine.data?.[0]) return mine.data[0].org_id as string;

    const name = profile?.name?.trim() || "My properties";
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "landlord"}-${userId.slice(0, 8)}`;
    const org = await supabase
      .from("makan_org")
      .insert({ name, slug, kind: "landlord" })
      .select("id")
      .single();
    if (org.error || !org.data) throw org.error ?? new Error("Could not create your account");

    const member = await supabase
      .from("makan_org_member")
      .insert({ org_id: org.data.id, user_id: userId, role: "owner" });
    if (member.error) throw member.error;
    return org.data.id as string;
  }

  async function publish(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setErrorField(null);

    const check = validateDraft(d);
    if (!check.ok) { setError(check.message); setErrorField(check.field); return; }
    if (!user) return;

    setStage({ at: "publishing" });
    try {
      const orgId = await ensureOrg(user.id);
      if (!orgId) throw new Error("Could not find your account");

      const coords = lookup.state === "found" && lookup.lat != null && lookup.lng != null
        ? { lat: lookup.lat, lng: lookup.lng }
        : null;
      const plan = toInsertPlan(d, orgId, coords);

      const b = await supabase.from("makan_building").insert(plan.building).select("id").single();
      if (b.error || !b.data) throw b.error ?? new Error("Could not save the address");

      const u = await supabase
        .from("makan_unit")
        .insert({ ...plan.unit, building_id: b.data.id })
        .select("id").single();
      if (u.error || !u.data) throw u.error ?? new Error("Could not save the property");

      const s = await supabase
        .from("makan_space")
        .insert({ ...plan.space, unit_id: u.data.id })
        .select("id").single();
      if (s.error || !s.data) throw s.error ?? new Error("Could not save the listing");

      const l = await supabase.from("makan_listing").insert({
        ...plan.listing,
        space_id: s.data.id,
        published_at: new Date().toISOString(),
      });
      if (l.error) throw l.error;

      setStage({ at: "published", spaceId: s.data.id });
    } catch (err) {
      const e2 = err as { code?: string; message?: string };
      if (isMissingTable(e2.code)) { setStage({ at: "no-schema" }); return; }
      setStage({ at: "editing" });
      setError(e2.message ?? "Something went wrong. Try again.");
    }
  }

  function toggleLetType(t: LetType) {
    const has = d.letTypes.includes(t);
    // Never let both come off — a listing nobody may answer is not a listing.
    if (has && d.letTypes.length === 1) return;
    set("letTypes", has ? d.letTypes.filter(x => x !== t) : [...d.letTypes, t]);
  }

  function toggleUse(u: PermittedUse) {
    set("permittedUses", d.permittedUses.includes(u)
      ? d.permittedUses.filter(x => x !== u)
      : [...d.permittedUses, u]);
  }

  if (authLoading) return <Shell><p style={{ color: "var(--h-muted)" }}>Loading…</p></Shell>;

  if (stage.at === "no-schema") {
    return <Shell><Panel title="Listings are not set up yet">
      Run <code>supabase/makan-rooms-schema.sql</code> and{" "}
      <code>supabase/makan-lettype-schema.sql</code> in the Supabase SQL editor, then reload.
    </Panel></Shell>;
  }

  if (stage.at === "published") {
    return (
      <Shell>
        <Panel title="It's live.">
          Your property is on Makan and can be found by tenants
          {acceptsCompanies(d) && " and by serviced-accommodation and supported-living companies"}.
          No agent involved.
          <span className="block mt-5 flex flex-wrap gap-3">
            <Link href={`/makan/space/${stage.spaceId}`} className="h-btn h-btn-primary">See your listing</Link>
            <Link href="/makan/app/inventory" className="h-btn h-btn-secondary">Manage your properties</Link>
          </span>
        </Panel>
      </Shell>
    );
  }

  if (!user) {
    return (
      <Shell>
        <Panel title="Sign in to list — it's free">
          No listing fee, no agent, no commission. Sign in and your first property takes about
          three minutes.
          <span className="block mt-5">
            <Link href="/makan/auth?next=/makan/list" className="h-btn h-btn-primary">Sign in or create an account</Link>
          </span>
        </Panel>
      </Shell>
    );
  }

  const err = (field: keyof ListingDraft) =>
    errorField === field ? <p className="text-sm mt-1.5" role="alert" style={{ color: "var(--h-accent)" }}>{error}</p> : null;

  return (
    <Shell>
      <form onSubmit={publish} className="max-w-2xl">

        {/* ── Where ─────────────────────────────────────── */}
        <Section n={1} title="Where is it?">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pc">Postcode</Label>
              <input id="pc" className="h-input" value={d.postcode} autoComplete="postal-code"
                     onChange={e => set("postcode", e.target.value)} placeholder="B29 6AA" />
              {lookup.state === "looking" && <Hint>Looking that up…</Hint>}
              {lookup.state === "found" && lookup.city && <Hint>✓ {lookup.city}</Hint>}
              {lookup.state === "not-found" && <Hint>Couldn&apos;t find that one — carry on and fill in the town.</Hint>}
              {err("postcode")}
            </div>
            <div>
              <Label htmlFor="city">Town or city</Label>
              <input id="city" className="h-input" value={d.city}
                     onChange={e => set("city", e.target.value)} placeholder="Birmingham" />
              {err("city")}
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="addr">Street address</Label>
              <input id="addr" className="h-input" value={d.addressLine1} autoComplete="street-address"
                     onChange={e => set("addressLine1", e.target.value)} placeholder="12 Chapel Street" />
              <Hint>Only the street and outward code are shown publicly — never the house number.</Hint>
              {err("addressLine1")}
            </div>
          </div>
        </Section>

        {/* ── What ──────────────────────────────────────── */}
        <Section n={2} title="What are you letting?">
          <div className="flex flex-wrap gap-2 mb-4">
            {PROPERTY_TYPES.map(t => (
              <Choice key={t.value} on={d.propertyType === t.value}
                      onClick={() => set("propertyType", t.value as PropertyType)}>{t.label}</Choice>
            ))}
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {d.propertyType === "whole_property" && (
              <div>
                <Label htmlFor="ut">Property type</Label>
                <select id="ut" className="h-input" value={d.unitType}
                        onChange={e => set("unitType", e.target.value as UnitType)}>
                  {UNIT_TYPES.map(t => <option key={t} value={t}>{t[0].toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
            )}
            <div>
              <Label htmlFor="beds">Bedrooms <Opt /></Label>
              <input id="beds" className="h-input" inputMode="numeric" value={d.bedrooms}
                     onChange={e => set("bedrooms", e.target.value)} placeholder="4" />
              {err("bedrooms")}
            </div>
            <div>
              <Label htmlFor="rent">Rent per month</Label>
              <input id="rent" className="h-input" inputMode="numeric" value={d.rentPcm}
                     onChange={e => set("rentPcm", e.target.value)} placeholder="£650" />
              {err("rentPcm")}
            </div>
          </div>

          <label className="flex items-center gap-2 mt-4 text-sm" style={{ color: "var(--h-text)" }}>
            <input type="checkbox" checked={d.billsIncluded}
                   onChange={e => set("billsIncluded", e.target.checked)} />
            Bills included
          </label>
        </Section>

        {/* ── Who. The whole product. ───────────────────── */}
        <Section n={3} title="Who would you let to?">
          <p className="text-sm mb-4" style={{ color: "var(--h-muted)" }}>
            Pick both if you don&apos;t mind either. This is the bit an agent usually decides for you.
          </p>
          <div className="flex flex-wrap gap-2">
            <Choice on={d.letTypes.includes("tenant")} onClick={() => toggleLetType("tenant")}>
              Tenants
            </Choice>
            <Choice on={d.letTypes.includes("company")} onClick={() => toggleLetType("company")}>
              Companies
            </Choice>
          </div>
          {err("letTypes")}

          {acceptsCompanies(d) && (
            <div className="mt-5 rounded-xl p-5" style={{ background: "var(--h-warm)" }}>
              <h3 className="font-bold mb-2" style={{ color: "var(--h-text)" }}>What a company let means</h3>
              <ul className="text-sm m-0 pl-5" style={{ color: "var(--h-muted)" }}>
                {companyLetExplainer().map((line, i) => (
                  <li key={i} className="mb-1.5">{line}</li>
                ))}
              </ul>

              <div className="mt-5">
                <Label>What would you allow it to be used for? <Opt /></Label>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {PERMITTED_USES.map(u => (
                    <Choice key={u.value} small on={d.permittedUses.includes(u.value)}
                            onClick={() => toggleUse(u.value)}>{u.label}</Choice>
                  ))}
                </div>
                <Hint>Leave blank and companies will ask. Ticking these gets you found faster.</Hint>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="lease">Minimum lease, months <Opt /></Label>
                  <input id="lease" className="h-input" inputMode="numeric" value={d.minLeaseMonths}
                         onChange={e => set("minLeaseMonths", e.target.value)} placeholder="36" />
                  {err("minLeaseMonths")}
                </div>
                <label className="flex items-center gap-2 text-sm self-end pb-3" style={{ color: "var(--h-text)" }}>
                  <input type="checkbox" checked={d.guaranteedRentConsidered}
                         onChange={e => set("guaranteedRentConsidered", e.target.checked)} />
                  Open to guaranteed rent
                </label>
              </div>
            </div>
          )}
        </Section>

        {/* ── Anything else ─────────────────────────────── */}
        <Section n={4} title="Anything else? (optional)">
          <Label htmlFor="desc">Description</Label>
          <textarea id="desc" className="h-input" rows={4} value={d.description}
                    onChange={e => set("description", e.target.value)}
                    placeholder="Recently refurbished, walking distance to the QE, off-street parking…" />
          <Hint>Photos come next, once it&apos;s live — you don&apos;t need them to publish.</Hint>
        </Section>

        <div className="rounded-xl p-4 mb-5" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
          <p className="text-xs font-semibold mb-1" style={{ color: "var(--h-muted)" }}>ABOUT TO PUBLISH</p>
          <p className="m-0 font-semibold" style={{ color: "var(--h-text)" }}>{draftSummary(d)}</p>
        </div>

        {error && !errorField && (
          <p className="text-sm mb-3" role="alert" style={{ color: "var(--h-accent)" }}>{error}</p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className="h-btn h-btn-primary" disabled={stage.at === "publishing"}>
            {stage.at === "publishing" ? "Publishing…" : "Publish — free"}
          </button>
          <p className="text-sm m-0" style={{ color: "var(--h-muted)" }}>
            No fee, no commission. Edit or take it down whenever you like.
          </p>
        </div>
      </form>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section className="py-12" style={{ background: "var(--h-slate)" }}>
        <div className="h-container">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
                 style={{ background: "rgba(232,85,61,0.15)", color: "#f08a76" }}>
              Free to list
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-white leading-tight">
              List your property.<br />Reach tenants and companies.
            </h1>
            <p className="text-base mb-0" style={{ color: "rgba(255,255,255,0.75)" }}>
              Including the serviced-accommodation and supported-living companies an agent would
              have turned down on your behalf.
            </p>
          </div>
        </div>
      </section>
      <main className="py-10" style={{ background: "var(--h-bg)", minHeight: "50vh" }}>
        <div className="h-container">{children}</div>
      </main>
    </>
  );
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl p-6 mb-5"
             style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
      <h2 className="text-lg font-bold mb-4 flex items-baseline gap-2.5" style={{ color: "var(--h-text)" }}>
        <span className="text-sm font-mono" style={{ color: "var(--h-subtle)" }}>{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Label({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-semibold mb-1.5" style={{ color: "var(--h-muted)" }}>
      {children}
    </label>
  );
}

function Opt() {
  return <span style={{ fontWeight: 400, color: "var(--h-subtle)" }}>optional</span>;
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs mt-1.5 mb-0" style={{ color: "var(--h-subtle)" }}>{children}</p>;
}

function Choice({ on, onClick, small, children }:
  { on: boolean; onClick: () => void; small?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on}
            className={`rounded-full font-semibold border transition-colors ${small ? "px-3 py-1.5 text-sm" : "px-4 py-2"}`}
            style={{
              background: on ? "var(--h-text)" : "var(--h-surface)",
              color: on ? "#ffffff" : "var(--h-muted)",
              borderColor: on ? "var(--h-text)" : "var(--h-border)",
            }}>
      {children}
    </button>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-8 max-w-xl"
         style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
      <h2 className="text-xl font-bold mb-2" style={{ color: "var(--h-text)" }}>{title}</h2>
      <div className="text-sm" style={{ color: "var(--h-muted)" }}>{children}</div>
    </div>
  );
}
