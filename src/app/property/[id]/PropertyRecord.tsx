"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DataState } from "@/components/property/DataState";
import { LifecycleBar } from "@/components/property/LifecycleBar";
import { specFor, formatValue } from "@/lib/evidence-fields";
import { NEXT_STEP, lifecycleOf, LIFECYCLE_LABEL, type AnyStage } from "@/lib/lifecycle";
import { getVaultProperty, type VaultProperty } from "@/lib/vault-client";
import { assess, coverage, type EvidenceLike } from "@/lib/vaultcheck";
import type { EvidenceState } from "@/lib/property";
import { track, events } from "@/lib/analytics";

/**
 * Everything the platform knows about one property, on one page.
 *
 * This is the page the product was missing. A property could be analysed,
 * scored, saved and then only ever seen again as a row in a list — the
 * evidence, the workings and the history all existed in the database with
 * nothing to display them. Rentura had a passport page doing roughly this job
 * for a property you already own, three levels deep behind a login, linked
 * from nowhere a prospect would ever look.
 *
 * Client-side rather than server-rendered, because a property may be owned by
 * an anonymous claim token held in this browser's localStorage. The server
 * cannot know who is asking until the browser tells it.
 */

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function PropertyRecord({ id }: { id: string }) {
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");
  const [property, setProperty] = useState<VaultProperty | null>(null);

  useEffect(() => {
    let live = true;
    getVaultProperty(id).then(p => {
      if (!live) return;
      setProperty(p);
      setState(p ? "ready" : "missing");
      if (p) track(events.propertyViewed, { stage: p.stage });
    });
    return () => { live = false; };
  }, [id]);

  if (state === "loading") {
    return <p style={{ color: "var(--ink-muted)", padding: "40px 0" }}>Loading the record…</p>;
  }

  if (state === "missing" || !property) {
    return (
      <div style={{ padding: "32px 0" }}>
        <h1 style={{ fontFamily: "var(--font-family-heading)", fontSize: 26, fontWeight: 800, color: "var(--ink)", marginBottom: 10 }}>
          We cannot find that property
        </h1>
        {/* Deliberately does not distinguish "no such property" from "not
            yours" — the route does not either, because telling them apart
            would let anyone holding an id learn whether it exists. */}
        <p style={{ fontSize: 15, color: "var(--ink-muted)", lineHeight: 1.6, marginBottom: 8, maxWidth: 560 }}>
          Either it does not exist, or it belongs to a different browser. A property saved without
          an account is tied to the browser that saved it — a different device, or cleared site
          data, and the link no longer resolves.
        </p>
        <p style={{ fontSize: 15, color: "var(--ink-muted)", lineHeight: 1.6, marginBottom: 22, maxWidth: 560 }}>
          Signing up claims everything saved in this browser, which is what stops it happening again.
        </p>
        <Link href="/vault" className="btn-gold">Vault a property</Link>
      </div>
    );
  }

  const stage = property.stage as AnyStage;
  const life = lifecycleOf(stage);
  const latest = property.pv_analysis?.[0];
  const evidence = property.pv_evidence ?? [];
  const check = coverage(evidence as EvidenceLike[]);
  const unanswered = assess(evidence as EvidenceLike[]).filter(r => !r.answered);
  const title = property.address ?? property.postcode ?? "Untitled property";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <header>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold-ink)", marginBottom: 8 }}>
          {life ? LIFECYCLE_LABEL[life] : "No longer tracked"}
        </p>
        <h1 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(24px, 3.4vw, 34px)", fontWeight: 800, color: "var(--ink)", lineHeight: 1.15, marginBottom: 8 }}>
          {title}
        </h1>
        <p style={{ fontSize: 13, color: "var(--ink-muted)", margin: 0 }}>
          {[
            property.postcode && property.address ? property.postcode : null,
            property.property_type,
            property.bedrooms != null ? `${property.bedrooms} bed` : null,
            `Saved ${fmtDate(property.created_at)}`,
          ].filter(Boolean).join(" · ")}
        </p>
      </header>

      <section aria-labelledby="lifecycle-heading">
        <h2 id="lifecycle-heading" style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 10 }}>
          Where this one is
        </h2>
        <LifecycleBar stage={stage} />
        <p style={{
          fontSize: 14, color: "var(--ink)", lineHeight: 1.6, margin: "14px 0 0",
          padding: "12px 16px", borderRadius: 10,
          background: "var(--card-surface)", border: "1px solid var(--hairline)",
        }}>
          {NEXT_STEP[stage] ?? "No next step recorded for this stage."}
        </p>
      </section>

      {latest ? (
        <section aria-labelledby="score-heading">
          <h2 id="score-heading" style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 10 }}>
            Latest analysis
          </h2>
          <div style={{
            display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "6px 18px",
            background: "var(--card-surface)", border: "1.5px solid var(--hairline)",
            borderRadius: 12, padding: "16px 18px",
          }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: "var(--ink)", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
              {latest.score ?? "—"}
            </span>
            <span style={{ fontSize: 13, color: "var(--ink-muted)" }}>out of 100</span>
            {latest.band ? (
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.05em", color: "var(--gold-ink)" }}>
                {latest.band}
              </span>
            ) : null}
            <span style={{ fontSize: 12, color: "var(--ink-subtle)", marginLeft: "auto" }}>
              {/* Coverage rather than confidence: how much of the score rested
                  on real data is a fact, "how confident we are" would not be. */}
              {latest.components_scored != null ? `${latest.components_scored} components scored · ` : ""}
              {fmtDate(latest.created_at)}
            </span>
          </div>
          {property.pv_analysis && property.pv_analysis.length > 1 ? (
            <p style={{ fontSize: 12, color: "var(--ink-subtle)", margin: "8px 0 0" }}>
              Run {property.pv_analysis.length} times. Earlier runs are kept, so a score that moves
              can be explained rather than just noticed.
            </p>
          ) : null}
        </section>
      ) : null}

      <section aria-labelledby="evidence-heading">
        <h2 id="evidence-heading" style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>
          Every figure, and where it came from
        </h2>
        <p style={{ fontSize: 13, color: "var(--ink-muted)", margin: "0 0 12px" }}>
          Including the checks that could not be run. A blank is shown as a blank.
        </p>

        {evidence.length === 0 ? (
          <p style={{ fontSize: 14, color: "var(--ink-muted)" }}>
            No figures were saved against this property.
          </p>
        ) : (
          <div style={{ background: "var(--card-surface)", border: "1.5px solid var(--hairline)", borderRadius: 12, padding: "4px 18px 12px" }}>
            {evidence.map(row => {
              const spec = specFor(row.field);
              const value = formatValue(row.field, row);
              return (
                <div
                  key={row.field}
                  style={{
                    display: "flex", flexWrap: "wrap", alignItems: "baseline",
                    justifyContent: "space-between", gap: "2px 12px",
                    padding: "12px 0", borderTop: "1px solid var(--hairline)",
                  }}
                >
                  <div style={{ minWidth: 200, flex: 1 }}>
                    <div style={{ fontSize: 14, color: "var(--ink)", fontWeight: 600 }}>{spec.label}</div>
                    {spec.hint ? (
                      <div style={{ fontSize: 12, color: "var(--ink-subtle)", lineHeight: 1.45 }}>{spec.hint}</div>
                    ) : null}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{
                      fontWeight: 700, fontVariantNumeric: "tabular-nums",
                      color: value === null ? "var(--ink-subtle)" : "var(--ink)",
                    }}>
                      {value ?? "—"}
                    </span>
                    <DataState
                      state={row.state as EvidenceState}
                      source={row.source}
                      method={row.method}
                      checkedAt={fmtDate(row.checked_at)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* What is still unanswered about this property.
          Deliberately a count of named questions rather than a percentage:
          "answers 9 of 16" can be checked line by line, and a reader cannot
          mistake it for a verdict the way they would a score. */}
      <section aria-labelledby="gaps-heading">
        <h2 id="gaps-heading" style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>
          What this record does not tell you
        </h2>
        <p style={{ fontSize: 13, color: "var(--ink-muted)", margin: "0 0 12px" }}>
          A buyer needs {check.total} questions answered before offering. This record answers{" "}
          {check.answered}.
        </p>
        <div style={{
          background: "var(--card-surface)", border: "1.5px solid var(--hairline)",
          borderRadius: 12, padding: "16px 18px",
        }}>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 12px", display: "flex", flexDirection: "column", gap: 6 }}>
            {unanswered.slice(0, 4).map(c => (
              <li key={c.id} style={{ fontSize: 13.5, color: "var(--ink)", lineHeight: 1.45 }}>
                <span aria-hidden="true" style={{ color: "var(--ink-subtle)", marginRight: 8 }}>—</span>
                {c.question}
              </li>
            ))}
          </ul>
          {unanswered.length > 4 ? (
            <p style={{ fontSize: 12.5, color: "var(--ink-subtle)", margin: "0 0 12px" }}>
              and {unanswered.length - 4} more, including two that need a surveyor or a solicitor
              rather than us.
            </p>
          ) : null}
          <Link
            href="/services/vaultcheck-pro"
            style={{ fontSize: 13, fontWeight: 700, color: "var(--gold-ink)", textDecoration: "none" }}
            onClick={() => track(events.ctaClicked, { from: `property:${stage}`, to: "vaultcheck-pro" })}
          >
            See the full list, and who answers each one &rarr;
          </Link>
        </div>
      </section>

      <section style={{ display: "flex", flexWrap: "wrap", gap: 10, paddingTop: 4 }}>
        <Link
          href="/vault"
          className="btn-gold"
          onClick={() => track(events.ctaClicked, { from: `property:${stage}`, to: "vault" })}
        >
          Run it again
        </Link>
        <Link
          href="/services"
          style={{
            fontSize: 14, fontWeight: 600, color: "var(--ink)", padding: "10px 20px",
            border: "1.5px solid var(--hairline)", borderRadius: 10,
            background: "var(--page-surface)", textDecoration: "none",
          }}
          onClick={() => track(events.ctaClicked, { from: `property:${stage}`, to: "services" })}
        >
          What we can do next
        </Link>
      </section>
    </div>
  );
}
