"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { freshnessLabel, isMissingTable, STATUS_LABEL, type SpaceStatus } from "@/lib/makan-inventory";
import { publicLocation } from "@/lib/makan-search";
import { PERMITTED_USES } from "@/lib/makan-listing";
import { EnquiryForm } from "@/components/makan/EnquiryForm";
import { MediaGallery } from "@/components/makan/MediaGallery";
import { PhotoManager } from "@/components/makan/PhotoManager";
import { useAuth } from "@/lib/auth-context";
import { toMedia, type MediaItem, type MediaQueryRow } from "@/lib/makan-media";

/**
 * Room detail.
 *
 * The distinctive part is the rest of the building. Every portal treats a room
 * advert as a standalone thing, because their schema has no idea two adverts
 * are the same house. Makan knows, so a renter can see "4 other rooms here, 2
 * available" and a landlord gets three chances at a let instead of one.
 *
 * Nothing here is fetched that RLS would not already hand to an anonymous
 * visitor: an unpublished room, a commissioner-only vacancy or anything
 * mid-assessment is simply absent from the query, not hidden by this file.
 */

interface SpaceDetail {
  id: string;
  kind: string;
  label: string;
  ensuite: boolean;
  let_types: string[] | null;
  permitted_uses: string[] | null;
  min_lease_months: number | null;
  guaranteed_rent_considered: boolean | null;
  furnished: string | null;
  bills_included: boolean;
  rent_pcm: number | null;
  deposit: number | null;
  status: SpaceStatus;
  available_from: string | null;
  status_confirmed_at: string;
  makan_unit: {
    id: string;
    label: string;
    bedrooms: number | null;
    bathrooms: number | null;
    shared_kitchen: boolean;
    shared_bathrooms: number | null;
    shared_living_room: boolean;
    garden: boolean;
    makan_building: {
      id: string;
      org_id: string;
      address_line1: string;
      city: string;
      postcode: string;
      hmo_licence_number: string | null;
    } | null;
  } | null;
}

interface Sibling {
  id: string;
  label: string;
  rent_pcm: number | null;
  status: SpaceStatus;
}

type Load =
  | { state: "loading" }
  | { state: "missing" }
  | { state: "no-schema" }
  | { state: "error"; message: string }
  | { state: "ready"; space: SpaceDetail; siblings: Sibling[] };

const AVAILABLE: SpaceStatus[] = ["available_now", "available_from"];

export default function SpacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [load, setLoad] = useState<Load>({ state: "loading" });
  const [now, setNow] = useState<Date | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [memberOfOrg, setMemberOfOrg] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchSpace = useCallback(async () => {
    const { data, error } = await supabase
      .from("makan_space")
      .select(
        `id,kind,label,ensuite,furnished,bills_included,rent_pcm,deposit,status,available_from,status_confirmed_at,
         let_types,permitted_uses,min_lease_months,guaranteed_rent_considered,
         makan_unit!inner(id,label,bedrooms,bathrooms,shared_kitchen,shared_bathrooms,shared_living_room,garden,
           makan_building!inner(id,org_id,address_line1,city,postcode,hmo_licence_number))`
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      setLoad(isMissingTable(error.code)
        ? { state: "no-schema" }
        : { state: "error", message: error.message });
      return;
    }
    // RLS returns nothing rather than a 403 for a room you may not see, so
    // "not found" and "not yours" are deliberately the same answer here.
    if (!data) { setLoad({ state: "missing" }); return; }

    const space = data as unknown as SpaceDetail;

    const sib = await supabase
      .from("makan_space")
      .select("id,label,rent_pcm,status")
      .eq("unit_id", space.makan_unit?.id ?? "")
      .neq("id", space.id)
      .order("label");

    // Photos are fetched alongside, not blocking: a listing with no photos is
    // still a listing, and a failure here must not take the page down with it.
    const shots = await supabase
      .from("makan_media")
      .select("id,url,caption,sort_order")
      .eq("space_id", space.id)
      .eq("kind", "photo")
      .order("sort_order");
    setMedia(toMedia((shots.data ?? []) as MediaQueryRow[]));

    setNow(new Date());
    setLoad({ state: "ready", space, siblings: (sib.data ?? []) as Sibling[] });
  }, [id]);

  // Which org this viewer belongs to, if any. Recorded rather than reduced to
  // a boolean here so nothing has to be set synchronously in the effect —
  // whether the manager shows is derived at render time instead.
  //
  // RLS refuses the write regardless; this only decides whether to offer it.
  useEffect(() => {
    if (!user || load.state !== "ready") return;
    const orgId = load.space.makan_unit?.makan_building?.org_id;
    if (!orgId) return;
    let live = true;
    void supabase
      .from("makan_org_member")
      .select("org_id")
      .eq("user_id", user.id)
      .eq("org_id", orgId)
      .maybeSingle()
      .then(({ data }) => { if (live && data) setMemberOfOrg(orgId); });
    return () => { live = false; };
  }, [user, load]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async fetch; setState runs after the await
    fetchSpace();
  }, [fetchSpace]);

  if (load.state === "loading") return <Shell><p style={{ color: "var(--h-muted)" }}>Loading…</p></Shell>;
  if (load.state === "no-schema") return <Shell><Panel title="Rooms are not set up yet">Run <code>supabase/makan-rooms-schema.sql</code> first.</Panel></Shell>;
  if (load.state === "error") return <Shell><Panel title="Could not load this room">{load.message}</Panel></Shell>;
  if (load.state === "missing") {
    return (
      <Shell>
        <Panel title="This room is not available">
          It may have been let, or taken off the market.{" "}
          <Link href="/makan/rooms" style={{ color: "var(--h-accent)" }}>Browse other rooms</Link>.
        </Panel>
      </Shell>
    );
  }

  const { space, siblings } = load;
  const building = space.makan_unit?.makan_building;
  const unit = space.makan_unit;
  if (!building || !unit || !now) {
    return <Shell><Panel title="This room is not available">Some details are missing.</Panel></Shell>;
  }

  const availableSiblings = siblings.filter(s => AVAILABLE.includes(s.status));
  const canManage = Boolean(user) && memberOfOrg !== null && memberOfOrg === building.org_id;

  return (
    <Shell>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <MediaGallery items={media} alt={space.label} />
          {canManage && <PhotoManager spaceId={space.id} />}
          <p className="text-sm mb-2" style={{ color: "var(--h-muted)" }}>
            {publicLocation({ addressLine1: building.address_line1, city: building.city, postcode: building.postcode })}
            {" · "}{building.city}
          </p>

          <h1 className="text-3xl font-extrabold mb-3" style={{ color: "var(--h-text)" }}>
            {space.label}{space.ensuite && " · ensuite"}
          </h1>

          <div className="flex flex-wrap items-baseline gap-3 mb-5">
            <p className="text-2xl font-bold" style={{ color: "var(--h-text)" }}>
              {space.rent_pcm !== null ? `£${space.rent_pcm.toLocaleString("en-GB")}` : "Price on request"}
              {space.rent_pcm !== null && <span className="text-base font-normal" style={{ color: "var(--h-muted)" }}>/month</span>}
            </p>
            {space.bills_included && (
              <span className="text-sm font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: "var(--h-green-light)", color: "var(--h-green)" }}>
                Bills included
              </span>
            )}
            <span className="text-sm font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: "var(--h-warm)", color: "var(--h-muted)" }}>
              {STATUS_LABEL[space.status]}
              {space.available_from && ` — ${new Date(space.available_from).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}`}
            </span>
          </div>

          {/* The trust line. Every portal is full of rooms that went weeks ago
              and cannot say when anyone last checked; this one can. */}
          <p className="text-sm mb-8 px-4 py-3 rounded-xl"
             style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)", color: "var(--h-muted)" }}>
            ✓ The landlord confirmed this was available{" "}
            <strong style={{ color: "var(--h-text)" }}>{freshnessLabel(space.status_confirmed_at, now)}</strong>
          </p>

          <h2 className="text-lg font-bold mb-3" style={{ color: "var(--h-text)" }}>The room</h2>
          <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-2 mb-8 text-sm">
            <Row label="Type" value={space.ensuite ? "Ensuite room" : "Room"} />
            <Row label="Furnished" value={space.furnished ? space.furnished.replace(/_/g, " ") : "Ask the landlord"} />
            <Row label="Deposit" value={space.deposit !== null ? `£${space.deposit.toLocaleString("en-GB")}` : "Ask the landlord"} />
            <Row label="Bills" value={space.bills_included ? "Included in the rent" : "Not included"} />
          </dl>

          {/* An operator arriving from a company-let search has to be able to
              see the terms here. Without this the search finds the property and
              then the page says nothing about the one thing they filtered for,
              and they have to open an enquiry to ask what is already recorded. */}
          {(space.let_types ?? ["tenant"]).includes("company") && (
            <div className="mb-8 rounded-2xl p-5"
                 style={{ background: "var(--h-warm)", border: "1px solid var(--h-border)" }}>
              <h2 className="text-lg font-bold mb-1" style={{ color: "var(--h-text)" }}>
                Open to a company let
              </h2>
              <p className="text-sm mb-4" style={{ color: "var(--h-muted)" }}>
                The landlord has said they would consider letting to a limited company —{" "}
                <Link href="/makan/company-lets" className="underline" style={{ color: "var(--h-accent-hover)" }}>
                  what that means
                </Link>.
              </p>
              <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <Row
                  label="Uses considered"
                  value={
                    (space.permitted_uses ?? []).length > 0
                      ? (space.permitted_uses ?? [])
                          .map(u => PERMITTED_USES.find(p => p.value === u)?.label ?? u.replace(/_/g, " "))
                          .join(", ")
                      : "Not stated — ask the landlord"
                  }
                />
                <Row
                  label="Minimum lease"
                  value={space.min_lease_months !== null
                    ? `${space.min_lease_months} months`
                    : "Not stated — ask the landlord"}
                />
                <Row
                  label="Guaranteed rent"
                  value={space.guaranteed_rent_considered ? "Would consider it" : "Not stated — ask the landlord"}
                />
                <Row label="Also open to tenants"
                     value={(space.let_types ?? []).includes("tenant") ? "Yes" : "Company lets only"} />
              </dl>
            </div>
          )}

          <h2 className="text-lg font-bold mb-3" style={{ color: "var(--h-text)" }}>Shared with the house</h2>
          <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-2 mb-8 text-sm">
            <Row label="Kitchen" value={unit.shared_kitchen ? "Shared" : "Private"} />
            <Row label="Bathrooms" value={unit.shared_bathrooms !== null ? `${unit.shared_bathrooms} shared` : "Ask the landlord"} />
            <Row label="Living room" value={unit.shared_living_room ? "Yes" : "No"} />
            <Row label="Garden" value={unit.garden ? "Yes" : "No"} />
            {unit.bedrooms !== null && <Row label="Bedrooms in the house" value={String(unit.bedrooms)} />}
            {building.hmo_licence_number && <Row label="HMO licence" value={building.hmo_licence_number} />}
          </dl>
        </div>

        <aside>
          <EnquiryForm
            spaceId={space.id}
            orgId={building.org_id}
            acceptsCompanies={(space.let_types ?? ["tenant"]).includes("company")}
          />

          {/* Nobody else can show this, because nobody else models a property
              as a thing with rooms in it. */}
          <div className="rounded-2xl p-5"
               style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
            <h2 className="font-bold mb-1" style={{ color: "var(--h-text)" }}>
              The rest of this house
            </h2>
            {siblings.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--h-muted)" }}>
                This is the only room listed here.
              </p>
            ) : (
              <>
                <p className="text-sm mb-3" style={{ color: "var(--h-muted)" }}>
                  {siblings.length} other {siblings.length === 1 ? "room" : "rooms"}
                  {availableSiblings.length > 0 && `, ${availableSiblings.length} available`}
                </p>
                <ul className="list-none p-0 m-0 grid gap-2">
                  {siblings.map(s => {
                    const free = AVAILABLE.includes(s.status);
                    return (
                      <li key={s.id}>
                        {free ? (
                          <Link href={`/makan/space/${s.id}`}
                                className="flex items-center justify-between text-sm py-2 px-3 rounded-lg"
                                style={{ background: "var(--h-warm)", color: "var(--h-text)" }}>
                            <span>{s.label}</span>
                            <span className="font-semibold">
                              {s.rent_pcm !== null ? `£${s.rent_pcm.toLocaleString("en-GB")}` : "—"}
                            </span>
                          </Link>
                        ) : (
                          <div className="flex items-center justify-between text-sm py-2 px-3 rounded-lg"
                               style={{ color: "var(--h-subtle)" }}>
                            <span>{s.label}</span>
                            <span>{STATUS_LABEL[s.status]}</span>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>

          <p className="text-xs mt-5" style={{ color: "var(--h-subtle)" }}>
            🔐 Makan does not verify landlord identity yet — always view in person and check ID
            before paying anything.
          </p>
        </aside>
      </div>
    </Shell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-1"
         style={{ borderBottom: "1px solid var(--h-border)" }}>
      <dt style={{ color: "var(--h-muted)" }}>{label}</dt>
      <dd className="font-medium text-right m-0" style={{ color: "var(--h-text)" }}>{value}</dd>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="py-10" style={{ background: "var(--h-bg)", minHeight: "70vh" }}>
      <div className="h-container">
        <Link href="/makan/rooms" className="text-sm inline-block mb-6" style={{ color: "var(--h-accent)" }}>
          ← All rooms
        </Link>
        {children}
      </div>
    </main>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-8 max-w-xl"
         style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
      <h1 className="text-lg font-bold mb-2" style={{ color: "var(--h-text)" }}>{title}</h1>
      <p className="text-sm" style={{ color: "var(--h-muted)" }}>{children}</p>
    </div>
  );
}
