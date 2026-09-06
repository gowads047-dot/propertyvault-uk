"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authFetch } from "@/lib/auth-fetch";
import { useAuth } from "@/lib/auth-context";
import { useIsAdmin } from "@/lib/useIsAdmin";

/**
 * Every enquiry the site has taken.
 *
 * /api/contact writes each one to contact_messages and then emails a
 * notification, in that order, and explains why in a comment: "The enquiry is
 * saved. It can be picked up from contact_messages." Nothing could pick it up.
 * The table's policies are anon INSERT and service_role SELECT, and no page or
 * route read it — so an enquiry whose email failed sat somewhere unreachable,
 * which is lost with extra steps.
 *
 * Everything funnels through that one table: the contact form, the guaranteed
 * rent enquiries, and every service waitlist. Grouping by source is the point
 * as much as the list is — "nine people want Rent Ready and two want Compliance
 * Care" is the only evidence available for what to build next, and it is
 * currently sitting in an inbox as nine separate emails.
 */

const BG = "#08090f";
const CARD = "rgba(255,255,255,0.03)";
const BORDER = "rgba(255,255,255,0.08)";
const INK = "rgba(255,255,255,0.88)";
const INK2 = "rgba(255,255,255,0.62)";
const INK3 = "rgba(255,255,255,0.42)";
const GOLD = "#c9a84c";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string | null;
  source: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
};

function when(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

/** "waitlist:rent-ready" reads as a slug; a person wants "Rent Ready waitlist". */
function sourceLabel(source: string | null): string {
  if (!source) return "Unknown";
  const [kind, rest] = source.split(":");
  if (!rest) return kind.replace(/-/g, " ").replace(/^\w/, c => c.toUpperCase());
  const name = rest.replace(/-/g, " ").replace(/^\w/, c => c.toUpperCase());
  return kind === "waitlist" ? `${name} waitlist` : `${name} (${kind})`;
}

export default function EnquiriesPage() {
  const { user, loading: authLoading } = useAuth();
  // The server decides. The admin address never reaches the browser.
  const admin = useIsAdmin(!!user);

  const [enquiries, setEnquiries] = useState<Enquiry[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!admin) return;
    authFetch("/api/admin/enquiries/")
      .then(async r => {
        if (!r.ok) throw new Error((await r.json().catch(() => null))?.error ?? "Could not load enquiries.");
        return r.json();
      })
      .then(d => setEnquiries(d.enquiries ?? []))
      .catch(e => setError(e.message));
  }, [admin]);

  if (authLoading || admin === null) {
    return <Shell><p style={{ color: INK3 }}>Checking…</p></Shell>;
  }
  if (!admin) {
    return (
      <Shell>
        <p style={{ color: INK2 }}>
          Not available. <Link href="/rentura/auth" style={{ color: GOLD }}>Sign in</Link> as the
          account that owns this site.
        </p>
      </Shell>
    );
  }

  const bySource = new Map<string, number>();
  for (const e of enquiries ?? []) {
    const key = sourceLabel(e.source);
    bySource.set(key, (bySource.get(key) ?? 0) + 1);
  }
  const grouped = [...bySource.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <Shell>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: INK, marginBottom: 4 }}>Enquiries</h1>
      <p style={{ fontSize: 13, color: INK2, marginBottom: 24 }}>
        Everything the contact form, the guaranteed rent enquiries and the service waitlists have
        taken. Newest first.
      </p>

      {error ? (
        <p role="alert" style={{ color: "#ef6461", fontSize: 14 }}>{error}</p>
      ) : enquiries === null ? (
        <p style={{ color: INK3 }}>Loading…</p>
      ) : enquiries.length === 0 ? (
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 22px" }}>
          <p style={{ color: INK, fontSize: 14, margin: "0 0 8px", fontWeight: 600 }}>
            Nothing yet.
          </p>
          <p style={{ color: INK2, fontSize: 13, margin: 0, lineHeight: 1.6 }}>
            No enquiry has ever reached this table. That is a count of enquiries, not a broken
            form — the insert policy and grant are both in place and the write path works. This
            page exists so the first one is visible somewhere other than an inbox.
          </p>
        </div>
      ) : (
        <>
          {/* What people are asking for, which is the part worth reading first. */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
            {grouped.map(([label, n]) => (
              <span key={label} style={{
                fontSize: 12, fontWeight: 600, color: INK, background: CARD,
                border: `1px solid ${BORDER}`, borderRadius: 20, padding: "5px 12px",
              }}>
                {label} <span style={{ color: GOLD, fontWeight: 800 }}>{n}</span>
              </span>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {enquiries.map(e => (
              <article key={e.id} style={{
                background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "14px 16px",
              }}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "4px 10px", marginBottom: 6 }}>
                  <strong style={{ fontSize: 14, color: INK }}>{e.name}</strong>
                  <a href={`mailto:${e.email}`} style={{ fontSize: 13, color: GOLD, textDecoration: "none" }}>
                    {e.email}
                  </a>
                  <span style={{ fontSize: 11, color: INK3, marginLeft: "auto" }}>{when(e.created_at)}</span>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: GOLD,
                    background: "rgba(201,168,76,0.12)", borderRadius: 4, padding: "2px 7px",
                  }}>
                    {sourceLabel(e.source)}
                  </span>
                  {e.subject ? (
                    <span style={{ fontSize: 12, color: INK2 }}>{e.subject}</span>
                  ) : null}
                </div>

                {e.message ? (
                  <p style={{ fontSize: 13, color: INK2, lineHeight: 1.55, margin: 0, whiteSpace: "pre-wrap" }}>
                    {e.message}
                  </p>
                ) : null}

                {/* Whatever the specific form sent that the route does not name
                    itself — a postcode, a rent, a property type. */}
                {e.details && Object.keys(e.details).length > 0 ? (
                  <dl style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", margin: "10px 0 0", fontSize: 12 }}>
                    {Object.entries(e.details).map(([k, v]) => (
                      <div key={k} style={{ display: "flex", gap: 5 }}>
                        <dt style={{ color: INK3 }}>{k}</dt>
                        <dd style={{ color: INK2, margin: 0 }}>{String(v)}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </article>
            ))}
          </div>
        </>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "var(--font-family-body)", padding: "40px 20px" }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <Link href="/rentura/admin" style={{ fontSize: 12, color: INK3, textDecoration: "none" }}>
          &larr; Admin
        </Link>
        <div style={{ marginTop: 18 }}>{children}</div>
      </div>
    </div>
  );
}
