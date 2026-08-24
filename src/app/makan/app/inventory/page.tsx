"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import {
  GROUPS,
  GROUP_LABEL,
  SPACE_STATUSES,
  STATUS_LABEL,
  STALE_AFTER_DAYS,
  filterRows,
  freshnessLabel,
  needsConfirmation,
  shouldOfferPublish,
  sortRows,
  summarise,
  toRows,
  isMissingTable,
  visibilityLabel,
  type Group,
  type InventoryRow,
  type SpaceQueryRow,
  type SpaceStatus,
} from "@/lib/makan-inventory";

/**
 * Room Manager.
 *
 * The screen an operator opens every morning. The job it has to make trivial
 * is "confirm or change the status of anything that moved", in under a minute,
 * because that is the only reason the data underneath Makan stays current.
 *
 * Everything here is deliberately one screen: no wizard, no detail drawer, no
 * save button. A status change writes immediately and the database trigger
 * re-stamps the freshness clock and appends the audit row.
 *
 * All the rules live in @/lib/makan-inventory so they can be tested without a
 * browser or a database. This file is rendering and I/O.
 */

type Load =
  | { state: "loading" }
  | { state: "no-schema" }
  | { state: "no-org" }
  | { state: "error"; message: string }
  | { state: "ready"; rows: InventoryRow[] };

export default function InventoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [load, setLoad] = useState<Load>({ state: "loading" });
  const [group, setGroup] = useState<Group>("all");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [publishFor, setPublishFor] = useState<InventoryRow | null>(null);

  // One clock for the whole render, so a row cannot read "29 days" in the list
  // and count as stale in the summary.
  //
  // It starts null and is stamped when the rows land rather than in an effect
  // body: reading the clock during the first render would disagree with the
  // server's prerender, and setting it synchronously in an effect just trades
  // that for a cascading render. The interval below only ever sets state from
  // its callback.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const fetchRows = useCallback(async () => {
    if (!user) return;

    const orgs = await supabase.from("makan_org_member").select("org_id").eq("user_id", user.id);
    if (orgs.error) {
      setLoad(
        isMissingTable(orgs.error.code)
          ? { state: "no-schema" }
          : { state: "error", message: orgs.error.message }
      );
      return;
    }

    const orgIds = (orgs.data ?? []).map(o => o.org_id as string);
    if (orgIds.length === 0) {
      setLoad({ state: "no-org" });
      return;
    }

    // !inner so the org filter on the nested building actually restricts the
    // result. Without it RLS would also hand back every publicly listed room
    // belonging to somebody else, which is correct for search and wrong here.
    const { data, error } = await supabase
      .from("makan_space")
      .select(
        `id, label, status, rent_pcm, bills_included, available_from, status_confirmed_at,
         makan_unit!inner ( id, label, makan_building!inner ( id, address_line1, postcode, org_id ) ),
         makan_listing ( channel, published_at )`
      )
      .in("makan_unit.makan_building.org_id", orgIds);

    if (error) {
      setLoad(
        isMissingTable(error.code)
          ? { state: "no-schema" }
          : { state: "error", message: error.message }
      );
      return;
    }
    setNow(new Date());
    setLoad({ state: "ready", rows: toRows((data ?? []) as unknown as SpaceQueryRow[]) });
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/makan/auth");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async fetch; setState runs after the await, not during render
    fetchRows();
  }, [user, authLoading, router, fetchRows]);

  const rows = useMemo(() => (load.state === "ready" ? load.rows : []), [load]);
  const summary = useMemo(() => (now ? summarise(rows, now) : null), [rows, now]);
  const visible = useMemo(
    () => (now ? sortRows(filterRows(rows, group), now) : []),
    [rows, group, now]
  );

  async function patch(row: InventoryRow, patchBody: Record<string, unknown>) {
    setSavingId(row.spaceId);
    const { error } = await supabase.from("makan_space").update(patchBody).eq("id", row.spaceId);
    setSavingId(null);
    if (error) {
      setLoad({ state: "error", message: error.message });
      return false;
    }
    await fetchRows();
    return true;
  }

  async function changeStatus(row: InventoryRow, next: SpaceStatus) {
    if (next === row.status) return;
    // status_confirmed_at and the audit row are handled by the trigger, so the
    // client sends only what the operator actually chose.
    const ok = await patch(row, { status: next });
    if (ok && shouldOfferPublish(row.status, next, row)) {
      setPublishFor({ ...row, status: next });
    }
  }

  /** "Still available" — no status change, just a fresh timestamp. */
  function confirmStill(row: InventoryRow) {
    return patch(row, { status_confirmed_at: new Date().toISOString() });
  }

  // Note the clock is deliberately NOT part of this guard. It is only stamped
  // on a successful load, so folding `!now` in here left the no-schema, no-org
  // and error states showing "Loading your rooms…" forever -- including the
  // state the page is in before the migration has been run.
  if (authLoading || load.state === "loading") {
    return <Shell><p style={{ color: "var(--h-muted)" }}>Loading your rooms…</p></Shell>;
  }

  if (load.state === "no-schema") {
    return (
      <Shell>
        <Notice title="The room tables are not in the database yet">
          <p>
            Run <code>supabase/makan-rooms-schema.sql</code> in the Supabase SQL editor, then reload
            this page. It only creates new tables — nothing existing is touched.
          </p>
        </Notice>
      </Shell>
    );
  }

  if (load.state === "no-org") {
    return (
      <Shell>
        <Notice title="You are not a member of an organisation yet">
          <p>
            Rooms belong to an organisation — a landlord, a provider or a council — rather than to a
            single account, so more than one person can keep the inventory current.
          </p>
        </Notice>
      </Shell>
    );
  }

  if (load.state === "error") {
    return (
      <Shell>
        <Notice title="Could not load your rooms" tone="error">
          <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 13 }}>{load.message}</p>
          <button onClick={() => { setLoad({ state: "loading" }); fetchRows(); }}
            className="h-btn h-btn-secondary mt-4">Try again</button>
        </Notice>
      </Shell>
    );
  }

  // From here on the table renders, which needs the clock.
  if (!now || !summary) {
    return <Shell><p style={{ color: "var(--h-muted)" }}>Loading your rooms…</p></Shell>;
  }

  if (rows.length === 0) {
    return (
      <Shell>
        {/* An importer, not an illustration. The first thing an operator has is
            a spreadsheet, and asking them to retype 40 rooms loses them. */}
        <Notice title="No rooms yet">
          <p>Add your first building, or bring a portfolio across from a spreadsheet.</p>
          <div className="flex flex-wrap gap-3 mt-5">
            <Link href="/makan/app/inventory/import" className="h-btn h-btn-primary">Import a spreadsheet</Link>
            <Link href="/makan/app/inventory/new" className="h-btn h-btn-secondary">Add a building</Link>
          </div>
        </Notice>
      </Shell>
    );
  }

  return (
    <Shell>
      {/* Counts double as the filter. Tapping one narrows the table and nothing
          else on the page moves. */}
      <div className="flex flex-wrap gap-2 mb-5" role="group" aria-label="Filter rooms by status">
        {GROUPS.map(g => {
          const n = summary.counts[g];
          const active = group === g;
          return (
            <button
              key={g}
              onClick={() => setGroup(g)}
              aria-pressed={active}
              className="px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors"
              style={{
                background: active ? "var(--h-text)" : "var(--h-surface)",
                color: active ? "#ffffff" : "var(--h-muted)",
                borderColor: active ? "var(--h-text)" : "var(--h-border)",
                opacity: n === 0 && !active ? 0.55 : 1,
              }}
            >
              {GROUP_LABEL[g]} <span style={{ fontVariantNumeric: "tabular-nums" }}>{n}</span>
            </button>
          );
        })}
      </div>

      {summary.stale > 0 && (
        <p className="mb-4 text-sm px-4 py-3 rounded-xl"
           style={{ background: "#fff8e6", border: "1px solid #f0d9a0", color: "#6b4e0f" }}>
          <strong>{summary.stale}</strong>{" "}
          {summary.stale === 1 ? "room has" : "rooms have"} not been confirmed for{" "}
          {STALE_AFTER_DAYS} days. They are listed first.
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl"
           style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <caption className="sr-only">
            Your rooms, with status, rent and when each was last confirmed
          </caption>
          <thead>
            <tr style={{ background: "var(--h-warm)" }}>
              {["Room", "Rent", "Status", "Available", "Confirmed", "Listed", ""].map(h => (
                <th key={h} scope="col" className="text-left px-4 py-3 font-semibold whitespace-nowrap"
                    style={{ color: "var(--h-muted)", fontSize: 12, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map(row => {
              const stale = needsConfirmation(row, now);
              const busy = savingId === row.spaceId;
              return (
                <tr key={row.spaceId}
                    style={{ borderTop: "1px solid var(--h-border)", opacity: busy ? 0.55 : 1 }}>
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      {stale && (
                        <span aria-hidden="true" title="Not confirmed recently"
                              className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
                              style={{ background: "#c98a12" }} />
                      )}
                      <div>
                        <div className="font-semibold" style={{ color: "var(--h-text)" }}>{row.label}</div>
                        <div style={{ color: "var(--h-subtle)", fontSize: 12 }}>
                          {row.buildingLabel}
                          {row.unitLabel !== "Whole house" && ` · ${row.unitLabel}`}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {row.rentPcm === null ? (
                      <span style={{ color: "var(--h-subtle)" }}>—</span>
                    ) : (
                      <>
                        £{row.rentPcm.toLocaleString("en-GB")}
                        <span style={{ color: "var(--h-subtle)" }}>/mo</span>
                        {row.billsIncluded && (
                          <div style={{ color: "var(--h-subtle)", fontSize: 12 }}>bills inc.</div>
                        )}
                      </>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <label className="sr-only" htmlFor={`status-${row.spaceId}`}>
                      Status of {row.label} at {row.buildingLabel}
                    </label>
                    <select
                      id={`status-${row.spaceId}`}
                      className="h-input !py-1.5 !text-sm"
                      value={row.status}
                      disabled={busy}
                      onChange={e => changeStatus(row, e.target.value as SpaceStatus)}
                    >
                      {SPACE_STATUSES.map(s => (
                        <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                      ))}
                    </select>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "var(--h-muted)" }}>
                    {row.availableFrom
                      ? new Date(row.availableFrom).toLocaleDateString("en-GB",
                          { day: "numeric", month: "short", year: "numeric" })
                      : "—"}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap"
                      style={{ color: stale ? "#8a5b0a" : "var(--h-muted)", fontWeight: stale ? 600 : 400 }}>
                    {freshnessLabel(row.statusConfirmedAt, now)}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "var(--h-muted)" }}>
                    {visibilityLabel(row)}
                  </td>

                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => confirmStill(row)}
                      disabled={busy}
                      className="h-btn h-btn-secondary !py-1.5 !px-3 !text-sm"
                    >
                      Confirm
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {visible.length === 0 && (
          <p className="px-4 py-10 text-center" style={{ color: "var(--h-muted)" }}>
            No rooms are {GROUP_LABEL[group].toLowerCase()} right now.
          </p>
        )}
      </div>

      {/* One prompt at the one moment it matters, with three buttons and no
          wizard. Publishing itself lands with the listing work. */}
      {publishFor && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center p-4 z-50"
             style={{ background: "rgba(0,0,0,0.45)" }}
             role="dialog" aria-modal="true" aria-labelledby="publish-title">
          <div className="w-full max-w-md rounded-2xl p-6"
               style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
            <h2 id="publish-title" className="text-lg font-bold mb-1" style={{ color: "var(--h-text)" }}>
              {publishFor.label} is now available
            </h2>
            <p className="text-sm mb-5" style={{ color: "var(--h-muted)" }}>
              {publishFor.buildingLabel}
            </p>
            <div className="flex flex-col gap-2">
              <button className="h-btn h-btn-primary" onClick={() => setPublishFor(null)}>
                Advertise publicly
              </button>
              <button className="h-btn h-btn-secondary" onClick={() => setPublishFor(null)}>
                Share with commissioners only
              </button>
              <button className="h-btn h-btn-secondary" onClick={() => setPublishFor(null)}>
                Keep private for now
              </button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="py-10" style={{ background: "var(--h-bg)", minHeight: "100vh" }}>
      <div className="h-container">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold mb-1" style={{ color: "var(--h-text)" }}>
            Room Manager
          </h1>
          <p className="text-sm" style={{ color: "var(--h-muted)" }}>
            Every room you hold, and whether it is available. Confirm anything that has moved.
          </p>
        </div>
        {children}
      </div>
    </main>
  );
}

function Notice({
  title,
  tone = "info",
  children,
}: {
  title: string;
  tone?: "info" | "error";
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl p-8 max-w-xl"
         style={{
           background: "var(--h-surface)",
           border: `1px solid ${tone === "error" ? "#e5b4ab" : "var(--h-border)"}`,
         }}>
      <h2 className="text-lg font-bold mb-2" style={{ color: "var(--h-text)" }}>{title}</h2>
      <div className="text-sm" style={{ color: "var(--h-muted)" }}>{children}</div>
    </div>
  );
}
