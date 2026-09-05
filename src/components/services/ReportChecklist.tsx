import {
  REPORT, ANSWERER_LABEL, ANSWERER_MEANING, type Answerer,
} from "@/lib/vaultcheck";

/**
 * The VaultCheck report, laid out as the questions it answers.
 *
 * Every question, with who answers it. This is the honest version of a sales
 * pitch: rather than asserting value, it shows eight questions the free Vault
 * already answers and six it does not, and lets the reader decide whether the
 * six are worth paying for.
 *
 * The property record does not render this. It shows the gaps for that
 * specific property and links here, which is shorter and more use in place.
 */

const TONE: Record<Answerer, { fg: string; bg: string }> = {
  evidence:     { fg: "var(--state-verified)",  bg: "color-mix(in srgb, var(--state-verified) 13%, transparent)" },
  analyst:      { fg: "var(--gold-ink)",        bg: "color-mix(in srgb, var(--gold-ink) 14%, transparent)" },
  professional: { fg: "var(--ink-subtle)",      bg: "color-mix(in srgb, var(--ink-subtle) 13%, transparent)" },
};

function Chip({ answerer }: { answerer: Answerer }) {
  const tone = TONE[answerer];
  return (
    <span
      title={ANSWERER_MEANING[answerer]}
      style={{
        display: "inline-flex", alignItems: "center", whiteSpace: "nowrap",
        fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.03em",
        padding: "0.1rem 0.45rem", borderRadius: 3,
        color: tone.fg, background: tone.bg,
      }}
    >
      {ANSWERER_LABEL[answerer]}
    </span>
  );
}

export function ReportChecklist() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
      {REPORT.map(section => (
        <section key={section.id}>
          <h3 style={{ fontFamily: "var(--font-family-heading)", fontSize: 17, fontWeight: 800, color: "var(--ink)", marginBottom: 3 }}>
            {section.title}
          </h3>
          <div style={{ height: 2, width: 36, background: "var(--gold-ink)", marginBottom: 12 }} />

          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 2 }}>
            {section.checks.map(check => (
                <li
                  key={check.id}
                  style={{
                    display: "flex", flexWrap: "wrap", alignItems: "baseline",
                    justifyContent: "space-between", gap: "4px 12px",
                    padding: "11px 0", borderTop: "1px solid var(--hairline)",
                  }}
                >
                  <div style={{ minWidth: 220, flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", lineHeight: 1.35 }}>
                      {check.question}
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--ink-subtle)", lineHeight: 1.45, marginTop: 2 }}>
                      {check.why}
                    </div>
                  </div>

                  <Chip answerer={check.answerer} />
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
