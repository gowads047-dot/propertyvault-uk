"use client";

import { useEffect, useState } from "react";
import { track, events } from "@/lib/analytics";
import { DataState, EvidenceRow } from "@/components/property/DataState";
import { PVScore } from "@/components/property/PVScore";
import { MaxOfferCard } from "@/components/property/MaxOfferCard";
import { analyseDeal, lookupArea } from "@/lib/agent/tools";
import { calculateMaximumOffer, explainBinding } from "@/lib/max-offer";
import type { Evidence } from "@/lib/property";
import {
  dedupeEvidence, listVault, saveToVault, type SavedProperty,
} from "@/lib/vault-client";
import type { ScoreBand } from "@/lib/deal-score";

/**
 * Vault a property.
 *
 * The point of this screen is that every number on it says where it came from.
 * That is the whole argument against pasting a listing into a chat window: the
 * chat gives you figures, this gives you figures with provenance, and the ones
 * it could not check say so instead of being quietly filled in.
 *
 * The area lookup runs through the API because HM Land Registry cannot be
 * called from a browser; everything else is computed here from the same tested
 * libraries the calculators use, so the numbers are identical to the ones on
 * those pages.
 */

const gbp = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;

type Step = { label: string; done: boolean };

type SaveState =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved"; persistable: boolean }
  | { kind: "error"; message: string };

interface ConstraintView {
  label: string;
  matters: string;
  entries: Record<string, string>[];
}

interface Result {
  analysis: ReturnType<typeof analyseDeal>;
  offer: ReturnType<typeof calculateMaximumOffer>;
  offerExplanation: string;
  evidence: Evidence[];
  areaMedian: number | null;
  areaNote: string | null;
  constraints: ConstraintView[];
  noRecord: string[];
}

export function VaultWorkspace() {
  const [postcode, setPostcode] = useState("");
  const [price, setPrice] = useState("185000");
  const [rent, setRent] = useState("1050");
  const [targetCashflow, setTargetCashflow] = useState("250");

  const [busy, setBusy] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const [save, setSave] = useState<SaveState>({ kind: "idle" });
  const [saved, setSaved] = useState<SavedProperty[]>([]);

  // What is already in the vault, so the page opens on the work rather than
  // on an empty form that forgets every visit.
  useEffect(() => {
    void listVault().then(setSaved);
  }, []);

  /** Persist what was just worked out. */
  async function persist(r: Result, price: number, monthlyRent: number, pc: string) {
    setSave({ kind: "saving" });

    const constraintEvidence: Evidence[] = r.constraints.map(c => ({
      field: `planning_${c.label.toLowerCase().replace(/[^a-z]+/g, "_")}`,
      state: "verified",
      valueText: c.entries.map(e => Object.values(e).filter(Boolean).join(" · ")).join("; "),
      source: "planning.data.gov.uk",
      method: c.matters,
    }));

    const evidence = dedupeEvidence([
      ...r.evidence,
      { field: "monthly_rent", state: "user", valueNum: monthlyRent, source: "you" },
      { field: "asking_price", state: "user", valueNum: price, source: "you" },
      ...(r.areaMedian != null
        ? [{
            field: "area_median_sold", state: "verified" as const, valueNum: r.areaMedian,
            source: "HM Land Registry Price Paid", method: r.areaNote,
          }]
        : []),
      ...constraintEvidence,
    ]);

    const out = await saveToVault({
      property: { source: "postcode", postcode: pc || null, askingPrice: price },
      evidence,
      analysis: {
        inputs: { askingPrice: price, monthlyRent, postcode: pc || null },
        computed: r.analysis.data,
        score: (r.analysis.data as { pvScore?: number }).pvScore,
        band: (r.analysis.data as { band?: string }).band,
      },
    });

    if (!out.ok) {
      setSave({ kind: "error", message: out.error ?? "Could not save that." });
      return;
    }
    setSave({ kind: "saved", persistable: out.persistable });
    setSaved(await listVault());
  }

  async function vault(e: React.FormEvent) {
    e.preventDefault();
    const p = Number(price);
    const r = Number(rent);
    if (!Number.isFinite(p) || p <= 0 || !Number.isFinite(r) || r < 0) {
      setError("Enter a purchase price and a monthly rent.");
      return;
    }

    setBusy(true);
    setError("");
    setResult(null);
    setSave({ kind: "idle" });
    track(events.vaultStarted);

    // Progressive, because research takes a few seconds across several sources
    // and one indefinite spinner reads as broken.
    const plan: Step[] = [
      { label: "Checking sold prices", done: false },
      { label: "Checking planning constraints", done: false },
      { label: "Running the numbers", done: false },
      { label: "Solving the maximum offer", done: false },
    ];
    setSteps(plan);
    const advance = (i: number) =>
      setSteps(s => s.map((x, j) => (j === i ? { ...x, done: true } : x)));

    try {
      let areaMedian: number | null = null;
      let areaNote: string | null = null;

      if (postcode.trim()) {
        // Trailing slash to match next.config trailingSlash:true — without it every
          // lookup takes a 308 redirect hop before the POST lands.
          const res = await fetch("/api/vault/area/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postcode: postcode.trim() }),
        });
        if (res.ok) {
          const area = (await res.json()) as Awaited<ReturnType<typeof lookupArea>>;
          const d = area.data as { medianSoldPrice?: number | null; soldCount?: number };
          areaMedian = d.medianSoldPrice ?? null;
          if (areaMedian) {
            areaNote = `Median of ${d.soldCount} recent sales in ${postcode.trim().toUpperCase()}. ` +
              "Sold records cover all property types in the postcode, so treat this as a guide " +
              "rather than a like-for-like comparison.";
          }
        }
      }
      advance(0);

      let constraints: ConstraintView[] = [];
      let noRecord: string[] = [];
      if (postcode.trim()) {
        const res = await fetch("/api/vault/constraints/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postcode: postcode.trim() }),
        });
        if (res.ok) {
          const j = await res.json();
          constraints = j.data?.constraintsFound ?? [];
          noRecord = j.data?.checkedWithNoRecord ?? [];
        }
      }
      advance(1);

      const analysis = analyseDeal({
        purchasePrice: p,
        monthlyRent: r,
        areaMedianSoldPrice: areaMedian ?? undefined,
      });
      advance(2);

      const targets = { minMonthlyCashflow: Number(targetCashflow) || undefined };
      const offer = calculateMaximumOffer(
        { askingPrice: p, monthlyRent: r, areaMedianSoldPrice: areaMedian ?? undefined },
        targets,
      );
      advance(3);

      const built: Result = {
        analysis,
        offer,
        offerExplanation: explainBinding(offer, targets),
        evidence: analysis.evidence,
        areaMedian,
        areaNote,
        constraints,
        noRecord,
      };
      setResult(built);
      // The pair that gives the funnel its shape: how many people start an
      // analysis against how many see one. A start on its own measures
      // interest and never says whether the thing worked.
      track(events.vaultCompleted, { score: (built.analysis.data as { pvScore?: number }).pvScore ?? -1 });
      // Saving is deliberately not awaited: the analysis is on screen either
      // way, and a slow write should not hold up the thing the user asked for.
      void persist(built, p, r, postcode.trim().toUpperCase());
    } catch {
      setError("Could not complete that. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const d = result?.analysis.data as Record<string, never> | undefined;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <form
        onSubmit={vault}
        style={{
          background: "var(--card-surface)",
          border: "1px solid var(--hairline)",
          borderRadius: "8px",
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: "0.9rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(9.5rem, 1fr))",
            alignItems: "start",
          }}
        >
        <Field label="Postcode" hint="Optional — unlocks sold prices">
          <input
            value={postcode}
            onChange={e => setPostcode(e.target.value)}
            placeholder="NG7 1AA"
            style={inputStyle}
          />
        </Field>
        <Field label="Asking price">
          <input value={price} onChange={e => setPrice(e.target.value)} inputMode="numeric" style={inputStyle} />
        </Field>
        <Field label="Monthly rent" hint="We ask rather than guess">
          <input value={rent} onChange={e => setRent(e.target.value)} inputMode="numeric" style={inputStyle} />
        </Field>
        <Field label="Cash flow you need" hint="£ per month">
          <input
            value={targetCashflow}
            onChange={e => setTargetCashflow(e.target.value)}
            inputMode="numeric"
            style={inputStyle}
          />
        </Field>
        </div>
        <button
          type="submit"
          disabled={busy}
          style={{
            background: busy ? "var(--ink-subtle)" : "var(--ink)",
            color: "var(--page-surface)",
            border: "none",
            borderRadius: "6px",
            padding: "0.75rem 1.1rem",
            fontWeight: 700,
            fontSize: "1rem",
            cursor: busy ? "default" : "pointer",
            alignSelf: "flex-start",
            minWidth: "9rem",
          }}
        >
          {busy ? "Working…" : "Vault it"}
        </button>
      </form>

      {busy && (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          {steps.map(s => (
            <li key={s.label} style={{ color: s.done ? "var(--ok)" : "var(--ink-subtle)", fontSize: "0.875rem" }}>
              {s.done ? "✓" : "…"} {s.label}
            </li>
          ))}
        </ul>
      )}

      {error && <p style={{ color: "var(--danger)", margin: 0 }}>{error}</p>}

      {result && <SaveNote state={save} />}

      {result && d && (
        <>
          <PVScore
            total={d.pvScore as unknown as number}
            band={d.band as unknown as ScoreBand}
            components={d.scoreComponents as unknown as never[]}
            excluded={d.scoreExcluded as unknown as { label: string; reason: string }[]}
          />

          <MaxOfferCard offer={result.offer} explanation={result.offerExplanation} />

          {result.constraints.length > 0 && (
            <section
              style={{
                background: "var(--card-surface)",
                border: "1px solid var(--hairline)",
                borderRadius: "8px",
                padding: "1.25rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em",
                  textTransform: "uppercase", color: "var(--ink-subtle)", margin: "0 0 0.5rem",
                }}
              >
                What applies to this location
              </p>
              {result.constraints.map(c => (
                <div key={c.label} style={{ padding: "0.6rem 0", borderTop: "1px solid var(--hairline)" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", flexWrap: "wrap" }}>
                    <strong style={{ color: "var(--ink)" }}>{c.label}</strong>
                    <DataState state="verified" source="planning.data.gov.uk" method={c.matters} />
                  </div>
                  <p style={{ margin: "0.2rem 0 0", color: "var(--ink)", fontSize: "0.9rem" }}>
                    {c.entries
                      .map(e => Object.values(e).filter(Boolean).join(" \u00b7 "))
                      .join("; ")}
                  </p>
                  <p style={{ margin: "0.15rem 0 0", color: "var(--ink-muted)", fontSize: "0.8125rem" }}>
                    {c.matters}
                  </p>
                </div>
              ))}

              {/* Absence of a record is not confirmation. Saying so is the
                  difference between this and a clean bill of health. */}
              {result.noRecord.length > 0 && (
                <p style={{ marginTop: "0.9rem", fontSize: "0.8125rem", color: "var(--ink-muted)" }}>
                  <DataState state="missing" method="Checked, no record found" /> No record found for{" "}
                  {result.noRecord.join(", ").toLowerCase()}. The national register does not cover every
                  local authority, so this is not confirmation that none applies.
                </p>
              )}
            </section>
          )}

          <section
            style={{
              background: "var(--card-surface)",
              border: "1px solid var(--hairline)",
              borderRadius: "8px",
              padding: "1.25rem",
            }}
          >
            <p
              style={{
                fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em",
                textTransform: "uppercase", color: "var(--ink-subtle)", margin: "0 0 0.5rem",
              }}
            >
              Every figure, and where it came from
            </p>

            <EvidenceRow
              label="Monthly cash flow"
              value={`${gbp(d.monthlyCashflow as unknown as number)}/mo`}
              state="calculated" source="lib/finance.ts"
            />
            <EvidenceRow
              label="Net yield"
              value={`${d.netYieldPct as unknown as number}%`}
              state="calculated" source="lib/finance.ts"
              method="after running costs and finance"
            />
            <EvidenceRow
              label="Cash required"
              value={gbp(d.cashRequired as unknown as number)}
              state="calculated" source="lib/finance.ts"
              method="deposit + stamp duty + legals"
            />
            <EvidenceRow
              label="Stamp duty"
              value={gbp(d.stampDuty as unknown as number)}
              state="calculated" source="lib/tax.ts" method="FA 2003 bands"
            />
            <EvidenceRow
              label="Running costs"
              value={`${gbp(d.runningCostsMonthly as unknown as number)}/mo`}
              state={(d.runningCostsAssumed as unknown as boolean) ? "assumed" : "user"}
              source={(d.runningCostsAssumed as unknown as boolean) ? "PropertyVault default" : "you"}
              method={(d.runningCostsAssumed as unknown as boolean) ? "28% of rent" : undefined}
            />
            <EvidenceRow label="Monthly rent" value={`${gbp(Number(rent))}/mo`} state="user" source="you" />
            <EvidenceRow
              label="Area median sold price"
              value={result.areaMedian ? gbp(result.areaMedian) : ""}
              state={result.areaMedian ? "verified" : "missing"}
              source={result.areaMedian ? "HM Land Registry Price Paid" : null}
              method={result.areaMedian ? "median of recent sales in the postcode" : "no postcode given"}
            />

            {result.areaNote && (
              <p style={{ marginTop: "0.9rem", fontSize: "0.8125rem", color: "var(--ink-muted)" }}>
                <DataState state="verified" source="HM Land Registry" /> {result.areaNote}
              </p>
            )}
          </section>
        </>
      )}

      {saved.length > 0 && <VaultList properties={saved} />}
    </div>
  );
}

/** What happened to the save, in one honest line. */
function SaveNote({ state }: { state: SaveState }) {
  if (state.kind === "idle") return null;

  const line =
    state.kind === "saving" ? "Saving to your vault…"
      : state.kind === "error" ? state.message
        : state.persistable
          ? "Saved to your vault on this device. Run it again later and you will see what changed."
          : "Saved, but this browser would not store your vault key — you will not find it again here.";

  return (
    <p
      style={{
        margin: 0,
        fontSize: "0.875rem",
        color: state.kind === "error" ? "var(--danger)"
          : state.kind === "saved" && !state.persistable ? "var(--state-estimated)"
            : "var(--ink-muted)",
      }}
    >
      {line}
    </p>
  );
}

/**
 * Everything vaulted from this browser.
 *
 * Each row carries its latest score and how many times it has been run, which
 * is the point of storing analysis as snapshots rather than a mutable record.
 */
function VaultList({ properties }: { properties: SavedProperty[] }) {
  return (
    <section
      style={{
        background: "var(--card-surface)",
        border: "1px solid var(--hairline)",
        borderRadius: "8px",
        padding: "1.25rem",
      }}
    >
      <p
        style={{
          fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em",
          textTransform: "uppercase", color: "var(--ink-subtle)", margin: "0 0 0.5rem",
        }}
      >
        In your vault
      </p>

      {properties.map(p => {
        const runs = p.pv_analysis ?? [];
        const latest = runs[0];
        return (
          <div
            key={p.id}
            style={{
              display: "flex", justifyContent: "space-between", alignItems: "baseline",
              gap: "1rem", padding: "0.6rem 0", borderTop: "1px solid var(--hairline)",
            }}
          >
            <div>
              <strong style={{ color: "var(--ink)" }}>{p.postcode ?? p.address ?? "Unnamed property"}</strong>
              <div style={{ fontSize: "0.8125rem", color: "var(--ink-muted)" }}>
                {p.asking_price != null ? gbp(p.asking_price) : "no price"}
                {runs.length > 1 ? ` · ${runs.length} runs` : ""}
              </div>
            </div>
            {latest?.score != null && (
              <span style={{ fontWeight: 700, color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>
                {latest.score}
                <span style={{ color: "var(--ink-subtle)", fontWeight: 400 }}>/100</span>
              </span>
            )}
          </div>
        );
      })}

      <p style={{ margin: "0.9rem 0 0", fontSize: "0.8125rem", color: "var(--ink-muted)" }}>
        These are held against a key stored in this browser, not an account. Clear your site data and
        they are gone — and a property nobody comes back to is deleted after 90 days.
      </p>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.7rem",
  borderRadius: "6px",
  border: "1px solid var(--hairline)",
  background: "var(--page-surface)",
  color: "var(--ink)",
  fontSize: "1rem",
  fontVariantNumeric: "tabular-nums",
};

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
      <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--ink)" }}>{label}</span>
      {children}
      <span style={{ fontSize: "0.7rem", color: "var(--ink-subtle)", minHeight: "1.6em" }}>
        {hint ?? ""}
      </span>
    </label>
  );
}
