"use client";

import { useState } from "react";
import { setStage as save } from "@/lib/vault-client";
import { track, events } from "@/lib/analytics";
import {
  ALL_STAGES, LIFECYCLE_LABEL, NEXT_STEP, STORABLE_STAGES,
  isStorable, lifecycleOf, type AnyStage,
} from "@/lib/lifecycle";

/**
 * Moving a property along its lifecycle.
 *
 * pv_property.stage was written once, at insert, and never again. Every
 * vaulted property sat on 'screening' for ever while the record page drew a
 * lifecycle bar around it — a progress indicator nobody could advance, which
 * is worse than none, because it implies the platform is tracking something it
 * is not.
 *
 * The stages the migration has not enabled yet are shown, disabled, with the
 * reason. Hiding them would be tidier and would also hide the fact that the
 * product has a second half; a landlord who owns the property should be able
 * to see that "Letting" is coming rather than conclude it does not exist.
 */

/** Human wording for each stored stage. The database value is not a label. */
const STAGE_LABEL: Record<AnyStage, string> = {
  screening: "Just looking",
  analysing: "Running the numbers",
  viewing: "Viewing it",
  offer: "Offer made",
  negotiating: "Negotiating",
  under_offer: "Under offer",
  due_diligence: "Doing the checks",
  purchased: "Bought it",
  rejected: "Passed on it",
  archived: "Archived",
  refurbishing: "Refurbishing",
  rent_ready: "Getting it ready",
  let: "Letting it",
  managed: "Managing it",
  optimising: "Reviewing returns",
  selling: "Selling",
  sold: "Sold",
};

export function StageControl({
  id,
  stage,
  onChanged,
}: {
  id: string;
  stage: AnyStage;
  onChanged: (stage: AnyStage) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function choose(next: AnyStage) {
    if (next === stage || busy) return;
    setBusy(true);
    setError("");

    const result = await save(id, next);

    if (!result.ok) {
      setError(result.error);
      setBusy(false);
      return;
    }
    track(events.stageChanged, { from: stage, to: next });
    onChanged(next);
    setBusy(false);
  }

  return (
    <div>
      <div
        role="group"
        aria-label="Where this property is"
        style={{ display: "flex", flexWrap: "wrap", gap: 6 }}
      >
        {ALL_STAGES.map(s => {
          const current = s === stage;
          const storable = isStorable(s);
          const life = lifecycleOf(s);
          return (
            <button
              key={s}
              type="button"
              disabled={!storable || busy}
              aria-pressed={current}
              onClick={() => choose(s)}
              title={
                storable
                  ? `${life ? LIFECYCLE_LABEL[life] : "Closed"} — ${NEXT_STEP[s]}`
                  : "Not available yet — this part of the lifecycle is not switched on"
              }
              style={{
                fontSize: 12.5,
                fontWeight: current ? 700 : 600,
                padding: "6px 11px",
                borderRadius: 8,
                cursor: storable && !busy ? "pointer" : "not-allowed",
                // A disabled stage is dimmed *and* struck through, so the
                // difference survives greyscale and does not rely on colour.
                textDecoration: storable ? "none" : "line-through",
                opacity: storable ? (busy ? 0.6 : 1) : 0.45,
                color: current ? "var(--gold-ink)" : "var(--ink-muted)",
                background: current ? "color-mix(in srgb, var(--gold-ink) 12%, transparent)" : "var(--page-surface)",
                border: `1.5px solid ${current ? "var(--gold-ink)" : "var(--hairline)"}`,
              }}
            >
              {STAGE_LABEL[s]}
            </button>
          );
        })}
      </div>

      {error ? (
        <p role="alert" style={{ fontSize: 13, color: "var(--state-missing)", margin: "10px 0 0" }}>
          {error}
        </p>
      ) : null}

      {STORABLE_STAGES.length < ALL_STAGES.length ? (
        <p style={{ fontSize: 12, color: "var(--ink-subtle)", margin: "10px 0 0", lineHeight: 1.5 }}>
          The struck-through stages are the ownership half of the lifecycle. They are built but
          not switched on yet, so nothing can be moved into one.
        </p>
      ) : null}
    </div>
  );
}
