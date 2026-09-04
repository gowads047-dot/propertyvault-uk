"use client";

import { useEffect } from "react";

/**
 * The last resort: an error in the root layout itself.
 *
 * error.tsx sits inside the layout, so it cannot catch a failure in the layout
 * that renders it. This one replaces the whole document, which is why it has
 * to supply its own html and body tags — and why it cannot use the site's
 * components, fonts or CSS variables, since the thing that provides them is
 * what failed.
 *
 * So it is written to survive with nothing: inline styles, system fonts, no
 * imports beyond React. Plain, but legible, branded enough to be recognisable,
 * and honest about what happened.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled root layout error:", error);
  }, [error]);

  return (
    <html lang="en-GB">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a1224",
          color: "#e4e8f0",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "32rem", textAlign: "center" }}>
          <p
            style={{
              margin: "0 0 0.5rem",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#c9a84c",
            }}
          >
            PropertyVault UK
          </p>
          <h1 style={{ margin: "0 0 0.75rem", fontSize: "1.6rem", fontWeight: 800 }}>
            The site failed to load
          </h1>
          <p style={{ margin: "0 0 1.5rem", lineHeight: 1.6, color: "#aab4c8" }}>
            Something went wrong before the page could start. That is our fault. Reloading usually
            fixes it.
          </p>

          <button
            onClick={reset}
            style={{
              background: "#c9a84c",
              color: "#0f1b36",
              border: "none",
              borderRadius: "10px",
              padding: "0.8rem 1.4rem",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Reload the page
          </button>

          <p style={{ marginTop: "1.5rem", fontSize: "0.8125rem", color: "#8b97ad" }}>
            Still broken?{" "}
            <a href="mailto:info@propertyvaultuk.co.uk" style={{ color: "#c9a84c" }}>
              info@propertyvaultuk.co.uk
            </a>
            {error.digest ? ` — reference ${error.digest}` : ""}
          </p>
        </div>
      </body>
    </html>
  );
}
