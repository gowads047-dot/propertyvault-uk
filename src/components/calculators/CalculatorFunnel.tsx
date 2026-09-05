"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { track, events } from "@/lib/analytics";

/**
 * Measures whether a free tool does anything for the business, and offers the
 * next step when it does.
 *
 * Two problems, one component.
 *
 * The measurement problem: the calculators recompute on every keystroke, so
 * there is no "calculate" click to hang an event on, and firing per keystroke
 * would produce noise rather than data. The honest signal is whether the
 * visitor changed anything at all from the defaults — that separates someone
 * who used the tool from someone who glanced and left. A change event bubbles,
 * so one listener on a wrapper catches every input under it without touching
 * any of the fifteen calculator components.
 *
 * The funnel problem: twenty-three calculators carry the site's search traffic
 * and none of them offered a next step. Someone works out a yield, gets their
 * answer, and leaves — the tool did its job and the platform got nothing. The
 * band below is deliberately slim rather than another full-width CTA block,
 * because four of these pages already carry the guaranteed-rent panel and two
 * stacked pitches read as a pitch rather than a next step.
 */
export function CalculatorFunnel({ children }: { children: React.ReactNode }) {
  // From the client, so the layout above can stay a server component and the
  // twenty-three pages beneath it can stay statically generated.
  const pathname = usePathname();
  const tool = pathname.split("/calculators/")[1]?.replace(/\/$/, "") || "index";

  const fired = useRef(false);

  function onFirstChange() {
    if (fired.current) return;
    fired.current = true;
    track(events.toolUsed, { tool });
  }

  return (
    <div onChangeCapture={onFirstChange}>
      {children}

      <section
        style={{
          maxWidth: 900, margin: "0 auto", padding: "0 16px 48px",
        }}
      >
        <div
          style={{
            display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14,
            justifyContent: "space-between",
            background: "var(--card-surface)", border: "1.5px solid var(--hairline)",
            borderRadius: 14, padding: "16px 20px",
          }}
        >
          <div style={{ minWidth: 240, flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", margin: 0 }}>
              Got a real property in mind?
            </p>
            <p style={{ fontSize: 13, color: "var(--ink-muted)", margin: "3px 0 0", lineHeight: 1.5 }}>
              A calculator works on the numbers you type in. Vault checks them against what
              comparable properties actually sold for, and tells you where each figure came from.
            </p>
          </div>
          <Link
            href="/vault"
            className="btn-gold"
            style={{ whiteSpace: "nowrap" }}
            onClick={() => track(events.ctaClicked, { from: `calculator:${tool}`, to: "vault" })}
          >
            Vault a property →
          </Link>
        </div>
      </section>
    </div>
  );
}
