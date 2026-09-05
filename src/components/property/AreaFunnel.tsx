"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { track, events } from "@/lib/analytics";
import { cityName } from "@/lib/areas";

/**
 * The next step from an area guide.
 *
 * Twenty-one city guides and the postcode pages bring people in on searches
 * like "is Birmingham good for buy to let" — and not one of them linked to
 * Vault. A visitor could read a full guide to an area, decide they liked it,
 * and find nothing that helped them assess an actual property in it.
 *
 * The copy names the place, because "Vault a property" is a weaker invitation
 * than "Vault a property in Bradford" to somebody who has just spent four
 * minutes reading about Bradford.
 */

/**
 * What the page is about, from the path.
 *
 * Returns null for the index and the postcode hub, where there is no single
 * place to name and a generic band is the honest version.
 */
export function placeFrom(pathname: string): string | null {
  const rest = pathname.replace(/^\/areas\/?/, "").replace(/\/$/, "");
  if (!rest) return null;

  if (rest.startsWith("postcodes")) {
    const district = rest.split("/")[1];
    // A district code is an initialism, so it is uppercased rather than
    // title-cased — "Ng7" would look like a typo.
    return district ? district.toUpperCase() : null;
  }
  return cityName(rest);
}

export function AreaFunnel({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const place = placeFrom(pathname);
  const where = place ? ` in ${place}` : "";

  return (
    <>
      {children}

      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 48px" }}>
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
              Found somewhere{where}?
            </p>
            <p style={{ fontSize: 13, color: "var(--ink-muted)", margin: "3px 0 0", lineHeight: 1.5 }}>
              An area average tells you about the area. Vault checks the actual property against
              what comparable homes nearby sold for, and shows where each figure came from.
            </p>
          </div>
          <Link
            href="/vault"
            className="btn-gold"
            style={{ whiteSpace: "nowrap" }}
            onClick={() => track(events.ctaClicked, { from: `area:${place ?? "index"}`, to: "vault" })}
          >
            Vault a property →
          </Link>
        </div>
      </section>
    </>
  );
}
