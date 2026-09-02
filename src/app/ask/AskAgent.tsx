"use client";

import { useRef, useState } from "react";
import { AgentProse } from "@/components/property/AgentProse";
import { AgentStepCard, type StepView } from "@/components/property/AgentStepCard";
import { trimForRequest } from "@/lib/agent/render";

/**
 * Ask PropertyVault.
 *
 * The agent has existed as an API since the loop was built; this is its front
 * door. The design decision that matters is what a reply looks like: the
 * model's prose sits above the cards its tools produced, not instead of them.
 * Anyone can get prose about a property from a chat window. The cards are the
 * part that can be checked — each figure carries where it came from, and a
 * check that could not be run says so rather than being quietly filled in.
 */

interface Turn {
  role: "user" | "assistant";
  text: string;
  steps?: StepView[];
  truncated?: boolean;
}

/** Openers that show what this does differently, rather than what a chat box does. */
const STARTERS = [
  "£185,000 in NG7 1AA, rents for £1,050. Is it worth it?",
  "What is the most I should offer on a £220,000 house renting at £1,200 if I need £250 a month?",
  "Anything on the planning registers I should know about B29 6LA?",
  "I earn £52,000. What does Section 24 cost me on £8,400 of mortgage interest?",
];

export function AskAgent() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  async function send(question: string) {
    const text = question.trim();
    if (!text || busy) return;

    const next: Turn[] = [...turns, { role: "user", text }];
    setTurns(next);
    setDraft("");
    setBusy(true);
    setError("");

    try {
      // Trailing slash to match next.config trailingSlash:true — without it the
      // POST takes a 308 redirect hop before it lands.
      const res = await fetch("/api/agent/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: trimForRequest(next).map(t => ({ role: t.role, content: t.text })),
        }),
      });

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        // The route writes these for a person to read, so show what it said
        // rather than inventing a friendlier version of it.
        setError(
          (body as { error?: string } | null)?.error ??
            "The agent could not answer that. Please try again.",
        );
        return;
      }

      const reply = body as { text: string; steps: StepView[]; truncated: boolean };
      setTurns([
        ...next,
        { role: "assistant", text: reply.text, steps: reply.steps ?? [], truncated: reply.truncated },
      ]);
    } catch {
      setError("Could not reach the agent. Check your connection and try again.");
    } finally {
      setBusy(false);
      requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }));
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {turns.length === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <p style={{ margin: 0, fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--ink-subtle)" }}>
            Try one of these
          </p>
          {STARTERS.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              style={{
                textAlign: "left",
                background: "var(--card-surface)",
                border: "1px solid var(--hairline)",
                borderRadius: "8px",
                padding: "0.7rem 0.9rem",
                color: "var(--ink)",
                fontSize: "0.9375rem",
                cursor: "pointer",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {turns.map((t, i) =>
        t.role === "user" ? (
          <div key={i} style={{ alignSelf: "flex-end", maxWidth: "85%" }}>
            <div
              style={{
                background: "var(--ink)",
                color: "var(--page-surface)",
                borderRadius: "10px 10px 2px 10px",
                padding: "0.65rem 0.9rem",
                fontSize: "0.9375rem",
              }}
            >
              {t.text}
            </div>
          </div>
        ) : (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            {t.text && <AgentProse text={t.text} />}

            {(t.steps ?? []).map((s, j) => (
              <AgentStepCard key={j} step={s} />
            ))}

            {t.truncated && (
              <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--state-estimated)" }}>
                This answer is incomplete — the agent ran out of steps before it finished. Ask a
                narrower question and it will get further.
              </p>
            )}
          </div>
        ),
      )}

      {busy && (
        <p style={{ margin: 0, color: "var(--ink-muted)", fontSize: "0.9375rem" }}>
          Working — checking the registers and running the numbers…
        </p>
      )}

      {error && (
        <p style={{ margin: 0, color: "var(--danger)", fontSize: "0.9375rem" }} role="alert">
          {error}
        </p>
      )}

      <form
        onSubmit={e => {
          e.preventDefault();
          void send(draft);
        }}
        style={{ display: "flex", gap: "0.6rem", alignItems: "flex-end" }}
      >
        <label style={{ flex: 1 }}>
          <span className="sr-only">Your question</span>
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(draft);
              }
            }}
            rows={2}
            maxLength={4000}
            placeholder="A price, a rent and a postcode is enough to start."
            style={{
              width: "100%",
              resize: "vertical",
              background: "var(--card-surface)",
              border: "1px solid var(--hairline)",
              borderRadius: "8px",
              padding: "0.7rem 0.8rem",
              color: "var(--ink)",
              fontSize: "1rem",
              fontFamily: "inherit",
            }}
          />
        </label>
        <button
          type="submit"
          disabled={busy || draft.trim().length === 0}
          style={{
            background: busy || draft.trim().length === 0 ? "var(--ink-subtle)" : "var(--ink)",
            color: "var(--page-surface)",
            border: "none",
            borderRadius: "8px",
            padding: "0.85rem 1.2rem",
            fontWeight: 700,
            fontSize: "1rem",
            cursor: busy || draft.trim().length === 0 ? "default" : "pointer",
          }}
        >
          Ask
        </button>
      </form>

      <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--ink-muted)", lineHeight: 1.6 }}>
        {turns.length === 0
          ? "Answers come back with their workings: every figure is produced by the same calculators behind the public tools, or read from a named register."
          : "Every figure in the cards above is produced by the same calculators behind the public tools, or read from a named register."}{" "}
        The agent does not work numbers out for itself, and where a check could not be run it says so
        instead of estimating.
      </p>

      <div ref={endRef} />
    </div>
  );
}
