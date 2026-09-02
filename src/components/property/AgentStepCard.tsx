import { PVScore } from "./PVScore";
import { MaxOfferCard } from "./MaxOfferCard";
import { stepLabel, gbp, pct, isRenderKind, soldDate } from "@/lib/agent/render";
import type { MaximumOffer } from "@/lib/max-offer";
import type { ScoreBand } from "@/lib/deal-score";

/**
 * One thing the agent did, drawn rather than described.
 *
 * The model's prose is the interpretation; this is the evidence behind it. It
 * matters that these are components and not numbers retyped into a sentence:
 * a figure the model repeated could be a figure the model changed, whereas a
 * card renders the tool's own output.
 */

export interface StepView {
  tool: string;
  ok: boolean;
  render: string | null;
  data: Record<string, unknown> | null;
  error: string | null;
}

const shell: React.CSSProperties = {
  background: "var(--card-surface)",
  border: "1px solid var(--hairline)",
  borderRadius: "8px",
  padding: "0.9rem 1rem",
};

export function AgentStepCard({ step }: { step: StepView }) {
  return (
    <div style={shell}>
      <div
        style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "var(--ink-subtle)",
          marginBottom: "0.6rem",
        }}
      >
        {stepLabel(step.tool)}
      </div>
      {step.ok && step.data ? <Body render={step.render} data={step.data} /> : <Failed error={step.error} />}
    </div>
  );
}

function Failed({ error }: { error: string | null }) {
  return (
    <p style={{ color: "var(--ink-muted)", fontSize: "0.9rem", margin: 0 }}>
      This step did not complete{error ? `: ${error}` : "."} Nothing has been assumed in its place.
    </p>
  );
}

function Body({ render, data }: { render: string | null; data: Record<string, unknown> }) {
  if (!isRenderKind(render)) return null;
  switch (render) {
    case "score": return <Score data={data} />;
    case "sdlt": return <Sdlt data={data} />;
    case "area": return <Area data={data} />;
    case "stress": return <Stress data={data} />;
    case "tax": return <Tax data={data} />;
    case "offer": return <Offer data={data} />;
    case "constraints": return <Constraints data={data} />;
  }
}

// -- the cards --------------------------------------------------------------

function Score({ data }: { data: Record<string, unknown> }) {
  const d = data as unknown as {
    pvScore: number;
    band: ScoreBand;
    scoreComponents: { key: string; label: string; score: number; max: number; reason: string }[];
    scoreExcluded?: { label: string; reason: string }[];
    monthlyCashflow: number;
    netYieldPct: number;
    cashRequired: number;
    stampDuty: number;
    runningCostsAssumed: boolean;
  };
  return (
    <>
      <PVScore total={d.pvScore} band={d.band} components={d.scoreComponents} excluded={d.scoreExcluded} />
      <Figures
        rows={[
          ["Monthly cash flow", gbp(d.monthlyCashflow), d.monthlyCashflow < 0],
          ["Net yield", pct(d.netYieldPct), false],
          ["Cash required", gbp(d.cashRequired), false],
          ["Stamp duty", gbp(d.stampDuty), false],
        ]}
      />
      {d.runningCostsAssumed && (
        <Note>Running costs are an assumption, not your figures. Give yours and every number here moves.</Note>
      )}
    </>
  );
}

function Sdlt({ data }: { data: Record<string, unknown> }) {
  const d = data as unknown as {
    total: number;
    bands: { from: number; to: number | null; ratePct: number; tax: number }[];
  };
  return (
    <>
      <Big value={gbp(d.total)} label="Stamp duty land tax" />
      <Table
        head={["Band", "Rate", "Tax"]}
        rows={d.bands.map(b => [
          `${gbp(b.from)}${b.to == null ? "+" : ` – ${gbp(b.to)}`}`,
          `${b.ratePct}%`,
          gbp(b.tax),
        ])}
      />
    </>
  );
}

function Area({ data }: { data: Record<string, unknown> }) {
  const d = data as unknown as {
    found: boolean;
    postcode: string;
    region: string | null;
    soldCount: number;
    medianSoldPrice: number | null;
    recentSales?: { date: string | null; price: number; propertyType?: string }[];
  };

  if (!d.found || d.medianSoldPrice == null) {
    return (
      <Note>
        HM Land Registry returned no sold records for {d.postcode}. That is an absence of data, not
        evidence that nothing has sold there.
      </Note>
    );
  }

  return (
    <>
      <Big value={gbp(d.medianSoldPrice)} label={`Median of ${d.soldCount} recent sales in ${d.postcode}`} />
      {d.recentSales && d.recentSales.length > 0 && (
        <Table
          head={["Sold", "Price", "Type"]}
          rows={d.recentSales.slice(0, 6).map(s => [soldDate(s.date), gbp(s.price), s.propertyType ?? "—"])}
        />
      )}
      <Note>
        Sold records cover every property type in the postcode, so this is a guide rather than a
        like-for-like comparison.
      </Note>
    </>
  );
}

function Stress({ data }: { data: Record<string, unknown> }) {
  const d = data as unknown as {
    rows: { ratePct: number; monthlyCashflow: number }[];
    turnsNegativeAtPct: number | null;
    survivesPlus2: boolean;
  };
  return (
    <>
      <Table
        head={["Mortgage rate", "Monthly cash flow"]}
        rows={d.rows.map(r => [`${r.ratePct.toFixed(2)}%`, gbp(r.monthlyCashflow)])}
        warnRow={i => d.rows[i].monthlyCashflow < 0}
      />
      <Note>
        {d.turnsNegativeAtPct != null
          ? `Cash flow turns negative at ${d.turnsNegativeAtPct.toFixed(2)}%.`
          : "Cash flow stays positive across every rate modelled here."}
      </Note>
    </>
  );
}

function Tax({ data }: { data: Record<string, unknown> }) {
  const d = data as unknown as {
    taxCredit?: number;
    mortgageInterest?: number;
    note?: string;
    tax?: number;
    gain?: number;
    netOfTax?: number;
  };
  const rows: [string, string, boolean][] = d.taxCredit != null
    ? [
        ["Mortgage interest", gbp(d.mortgageInterest ?? 0), false],
        ["Basic-rate tax credit", gbp(d.taxCredit), false],
      ]
    : [
        ["Gain", gbp(d.gain ?? 0), false],
        ["Capital gains tax", gbp(d.tax ?? 0), false],
        ["Left after tax", gbp(d.netOfTax ?? 0), false],
      ];
  return (
    <>
      <Figures rows={rows} />
      {d.note && <Note>{d.note}</Note>}
    </>
  );
}

function Offer({ data }: { data: Record<string, unknown> }) {
  const { explanation, ...offer } = data as unknown as MaximumOffer & { explanation: string };
  return <MaxOfferCard offer={offer as MaximumOffer} explanation={explanation} />;
}

function Constraints({ data }: { data: Record<string, unknown> }) {
  const d = data as unknown as {
    found: boolean;
    postcode: string;
    reason?: string;
    constraintsFound?: { label: string; matters: string; entries: Record<string, string>[] }[];
    checkedWithNoRecord?: string[];
    couldNotCheck?: string[];
    coverageNote?: string;
  };

  if (!d.found) {
    return <Note>Could not check {d.postcode}{d.reason ? ` — ${d.reason}` : ""}.</Note>;
  }

  const found = d.constraintsFound ?? [];

  return (
    <>
      {found.length === 0 ? (
        <p style={{ margin: 0, color: "var(--ink)", fontWeight: 600 }}>
          Nothing found on the registers that were checked.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
          {found.map(c => (
            <div key={c.label}>
              <div style={{ fontWeight: 700, color: "var(--ink)" }}>{c.label}</div>
              <div style={{ fontSize: "0.85rem", color: "var(--ink-muted)" }}>{c.matters}</div>
              <ul
                style={{
                  margin: "0.35rem 0 0",
                  paddingLeft: "1.1rem",
                  listStyle: "disc",
                  fontSize: "0.875rem",
                  color: "var(--ink)",
                }}
              >
                {c.entries.map((e, i) => (
                  <li key={i}>{Object.values(e).filter(Boolean).join(" · ")}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* The point of the whole module: a register that was checked and came
          back empty is reported as exactly that, never as a clean bill of
          health, because national coverage is incomplete. */}
      {(d.checkedWithNoRecord?.length ?? 0) > 0 && (
        <Note>
          No record found for {d.checkedWithNoRecord!.join(", ")}. {d.coverageNote}
        </Note>
      )}
      {(d.couldNotCheck?.length ?? 0) > 0 && (
        <Note>Could not check {d.couldNotCheck!.join(", ")} &mdash; the register did not respond.</Note>
      )}
    </>
  );
}

// -- small shared pieces ----------------------------------------------------

function Big({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ marginBottom: "0.6rem" }}>
      <div
        style={{
          fontSize: "1.75rem",
          fontWeight: 800,
          color: "var(--ink)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: "0.85rem", color: "var(--ink-muted)" }}>{label}</div>
    </div>
  );
}

function Figures({ rows }: { rows: [string, string, boolean][] }) {
  return (
    <div style={{ marginTop: "0.6rem" }}>
      {rows.map(([label, value, warn]) => (
        <div
          key={label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            padding: "0.45rem 0",
            borderTop: "1px solid var(--hairline)",
          }}
        >
          <span style={{ color: "var(--ink-muted)", fontSize: "0.875rem" }}>{label}</span>
          <span
            style={{
              fontWeight: 700,
              fontVariantNumeric: "tabular-nums",
              color: warn ? "var(--danger)" : "var(--ink)",
            }}
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

function Table({
  head,
  rows,
  warnRow,
}: {
  head: string[];
  rows: string[][];
  warnRow?: (i: number) => boolean;
}) {
  return (
    <div style={{ overflowX: "auto", marginTop: "0.6rem" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
        <thead>
          <tr>
            {head.map((h, i) => (
              <th
                key={h}
                style={{
                  textAlign: i === 0 ? "left" : "right",
                  padding: "0.35rem 0",
                  color: "var(--ink-subtle)",
                  fontWeight: 600,
                  borderBottom: "1px solid var(--hairline)",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td
                  key={j}
                  style={{
                    textAlign: j === 0 ? "left" : "right",
                    padding: "0.35rem 0",
                    borderTop: "1px solid var(--hairline)",
                    fontVariantNumeric: "tabular-nums",
                    color: warnRow?.(i) && j > 0 ? "var(--danger)" : "var(--ink)",
                  }}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ margin: "0.6rem 0 0", fontSize: "0.8125rem", color: "var(--ink-muted)", lineHeight: 1.5 }}>
      {children}
    </p>
  );
}
