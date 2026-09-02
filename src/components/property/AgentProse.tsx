import { parseProse, type Span } from "@/lib/agent/render";

/**
 * The model's reply, rendered.
 *
 * Rendered from parsed data rather than injected as HTML: the reply is
 * untrusted text — anything the user pasted can end up echoed in it — so it
 * only ever becomes React elements, never markup.
 */
export function AgentProse({ text }: { text: string }) {
  const blocks = parseProse(text);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
      {blocks.map((b, i) => {
        if (b.kind === "heading") {
          return (
            <h2
              key={i}
              style={{
                margin: 0,
                fontSize: "1.0625rem",
                fontWeight: 700,
                color: "var(--ink)",
                textWrap: "balance",
              }}
            >
              <Spans spans={b.spans} />
            </h2>
          );
        }

        if (b.kind === "list") {
          return (
            // Tailwind's reset strips list markers, so they are asked for here.
            <ul
              key={i}
              style={{
                margin: 0,
                paddingLeft: "1.15rem",
                listStyle: "disc",
                display: "flex",
                flexDirection: "column",
                gap: "0.35rem",
              }}
            >
              {b.items.map((item, j) => (
                <li key={j} style={{ color: "var(--ink)", fontSize: "1rem", lineHeight: 1.6 }}>
                  <Spans spans={item} />
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={i} style={{ margin: 0, color: "var(--ink)", fontSize: "1rem", lineHeight: 1.65 }}>
            <Spans spans={b.spans} />
          </p>
        );
      })}
    </div>
  );
}

function Spans({ spans }: { spans: Span[] }) {
  return (
    <>
      {spans.map((s, i) =>
        s.bold ? (
          <strong key={i} style={{ fontWeight: 700 }}>
            {s.text}
          </strong>
        ) : (
          <span key={i}>{s.text}</span>
        ),
      )}
    </>
  );
}
