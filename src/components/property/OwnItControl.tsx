"use client";

import { useState } from "react";
import Link from "next/link";
import { ownProperty } from "@/lib/vault-client";
import { track, events } from "@/lib/analytics";
import { lifecycleOf, LIFECYCLE, type AnyStage } from "@/lib/lifecycle";

/**
 * Carrying a property across the moment it stops being research.
 *
 * Until now nothing connected the two halves. A house you vaulted in March and
 * bought in September was two unrelated rows, and everything you worked out
 * while deciding — the sold comparables, the score, the maximum offer and why
 * it was that number — stayed on the wrong side of the purchase.
 *
 * Only offered once the property has actually reached completion. Showing it
 * to somebody still screening would be inviting them to add a house they do
 * not own to a portfolio of houses they do.
 */

/** Completion is the earliest point at which "yours" is true. */
function isOwnedYet(stage: AnyStage): boolean {
  const life = lifecycleOf(stage);
  if (!life) return false;
  return LIFECYCLE.indexOf(life) >= LIFECYCLE.indexOf("complete");
}

export function OwnItControl({
  id,
  stage,
  renturaPropertyId,
  onLinked,
}: {
  id: string;
  stage: AnyStage;
  renturaPropertyId: string | null;
  onLinked: (renturaPropertyId: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [needsAccount, setNeedsAccount] = useState(false);

  if (!isOwnedYet(stage)) return null;

  if (renturaPropertyId) {
    return (
      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12,
        background: "color-mix(in srgb, var(--state-verified) 8%, transparent)",
        border: "1px solid color-mix(in srgb, var(--state-verified) 30%, transparent)",
        borderRadius: 12, padding: "14px 16px",
      }}>
        <p style={{ fontSize: 13.5, color: "var(--ink)", margin: 0, flex: 1, minWidth: 220 }}>
          <strong>In your portfolio.</strong> Everything on this page stays here; the tenancy,
          compliance dates and documents live in Rentura.
        </p>
        <Link
          href={`/rentura/properties/${renturaPropertyId}/passport`}
          className="btn-gold"
          style={{ whiteSpace: "nowrap" }}
          onClick={() => track(events.ctaClicked, { from: "property:owned", to: "rentura-passport" })}
        >
          Open in Rentura →
        </Link>
      </div>
    );
  }

  async function add() {
    if (busy) return;
    setBusy(true);
    setError("");
    setNeedsAccount(false);

    const result = await ownProperty(id);

    if (!result.ok) {
      setError(result.error);
      setNeedsAccount(result.needsAccount);
      setBusy(false);
      return;
    }
    if (result.created) track(events.propertyOwned, { stage });
    onLinked(result.renturaPropertyId);
    setBusy(false);
  }

  return (
    <div style={{
      background: "var(--card-surface)", border: "1.5px solid var(--gold-ink)",
      borderRadius: 12, padding: "14px 16px",
    }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
        <p style={{ fontSize: 13.5, color: "var(--ink)", margin: 0, flex: 1, minWidth: 220, lineHeight: 1.5 }}>
          <strong>This one is yours now.</strong> Add it to your portfolio and the analysis on this
          page follows it — the comparables, the score, and what you were prepared to pay.
        </p>
        <button
          type="button"
          onClick={add}
          disabled={busy}
          className="btn-gold"
          style={{ whiteSpace: "nowrap", opacity: busy ? 0.6 : 1 }}
        >
          {busy ? "Adding…" : "Add to my portfolio"}
        </button>
      </div>

      {error ? (
        <p role="alert" style={{ fontSize: 13, color: "var(--state-missing)", margin: "10px 0 0", lineHeight: 1.5 }}>
          {error}
          {/* The one failure worth doing something about rather than just
              reporting. Everything else is retry-or-report. */}
          {needsAccount ? (
            <>
              {" "}
              <Link href="/rentura/auth" style={{ color: "var(--gold-ink)", fontWeight: 700 }}>
                Sign in
              </Link>
            </>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
