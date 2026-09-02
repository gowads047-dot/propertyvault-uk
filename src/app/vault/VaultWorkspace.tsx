"use client";

import { useState } from "react";
import { DataState, EvidenceRow } from "@/components/property/DataState";
import { PVScore } from "@/components/property/PVScore";
import { MaxOfferCard } from "@/components/property/MaxOfferCard";
import { analyseDeal, lookupArea } from "@/lib/agent/tools";
import { calculateMaximumOffer, explainBinding } from "@/lib/max-offer";
import type { Evidence } from "@/lib/property";
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

interface Result {
  analysis: ReturnType<typeof analyseDeal>;
  offer: ReturnType<typeof calculateMaximumOffer>;
  offerExplanation: string;
  evidence: Evidence[];
  areaMedian: number | null;
  areaNote: string | null;
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

    // Progressive, because research takes a few seconds across several sources
    // and one indefinite spinner reads as broken.
    const plan: Step[] = [
      { label: "Checking sold prices", done: false },
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

      const analysis = analyseDeal({
        purchasePrice: p,
        monthlyRent: r,
        areaMedianSoldPrice: areaMedian ?? undefined,
      });
      advance(1);

      const targets = { minMonthlyCashflow: Number(targetCashflow) || undefined };
      const offer = calculateMaximumOffer(
        { askingPrice: p, monthlyRent: r, areaMedianSoldPrice: areaMedian ?? undefined },
        targets,
      );
      advance(2);

      setResult({
        analysis,
        offer,
        offerExplanation: explainBinding(offer, targets),
        evidence: analysis.evidence,
        areaMedian,
        areaNote,
      });
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

      {result && d && (
        <>
          <PVScore
            total={d.pvScore as unknown as number}
            band={d.band as unknown as ScoreBand}
            components={d.scoreComponents as unknown as never[]}
            excluded={d.scoreExcluded as unknown as { label: string; reason: string }[]}
          />

          <MaxOfferCard offer={result.offer} explanation={result.offerExplanation} />

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
    </div>
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
