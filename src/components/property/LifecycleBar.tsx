import {
  LIFECYCLE, LIFECYCLE_LABEL, STAGES_PENDING_MIGRATION,
  isClosed, lifecycleOf, type AnyStage,
} from "@/lib/lifecycle";

/**
 * Where this property is in its life, and what is still ahead of it.
 *
 * The point of drawing the whole line rather than only the current step: a
 * visitor who has just Vaulted something sees, without being told, that the
 * platform expects to still be here when they refurbish it, let it and sell
 * it. That is the positioning argument made as a diagram instead of a slogan.
 *
 * Stages the database cannot store yet are drawn dimmed and labelled, rather
 * than hidden. Hiding them would show a five-stage lifecycle and quietly
 * contradict every page that describes nine.
 */

const PENDING = new Set<string>(STAGES_PENDING_MIGRATION);

export function LifecycleBar({ stage }: { stage: AnyStage }) {
  const current = lifecycleOf(stage);
  const currentIndex = current ? LIFECYCLE.indexOf(current) : -1;
  const closed = isClosed(stage);

  return (
    <div>
      {closed ? (
        <p style={{ fontSize: 13, color: "var(--ink-muted)", margin: "0 0 10px" }}>
          This one is no longer being tracked, so it has no position on the line below.
        </p>
      ) : null}

      <ol
        aria-label="Property lifecycle"
        style={{
          display: "flex", flexWrap: "wrap", gap: 4,
          listStyle: "none", padding: 0, margin: 0,
        }}
      >
        {LIFECYCLE.map((s, i) => {
          const done = currentIndex >= 0 && i < currentIndex;
          const here = currentIndex === i;
          const pending = PENDING.has(s);

          return (
            <li
              key={s}
              aria-current={here ? "step" : undefined}
              title={pending ? "Not tracked yet — coming with the ownership record" : undefined}
              style={{
                flex: "1 1 92px", minWidth: 92,
                borderRadius: 6, padding: "7px 9px",
                border: here ? "1.5px solid var(--gold-ink)" : "1px solid var(--hairline)",
                background: here
                  ? "color-mix(in srgb, var(--gold-ink) 12%, transparent)"
                  : done
                    ? "color-mix(in srgb, var(--state-verified) 10%, transparent)"
                    : "var(--card-surface)",
                opacity: pending && !here ? 0.55 : 1,
              }}
            >
              <div style={{
                fontFamily: "ui-monospace, monospace", fontSize: 10, fontWeight: 600,
                color: here ? "var(--gold-ink)" : "var(--ink-subtle)",
              }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{
                fontSize: 12, fontWeight: here ? 800 : 600, lineHeight: 1.2,
                color: here ? "var(--ink)" : done ? "var(--ink)" : "var(--ink-muted)",
              }}>
                {LIFECYCLE_LABEL[s]}
              </div>
              {/* Said in words as well as by opacity, so it survives greyscale
                  and a screen reader. */}
              {pending ? (
                <div style={{ fontSize: 10, color: "var(--ink-subtle)", marginTop: 2 }}>
                  not tracked yet
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
