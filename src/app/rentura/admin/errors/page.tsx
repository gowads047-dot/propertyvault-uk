"use client";

import { useEffect, useState } from "react";
import Link from "@/components/ui/Link";
import { authFetch } from "@/lib/auth-fetch";
import { useAuth } from "@/lib/auth-context";
import { useIsAdmin } from "@/lib/useIsAdmin";

/**
 * What has gone wrong lately.
 *
 * Every unhandled server error and every browser error the beacons caught,
 * newest first, with the stack a click away. The point is that "is the
 * site throwing?" has an answer that does not involve a dashboard with a
 * one-day log. Same gate as the enquiries page.
 */
const BG = "#08090f";
const CARD = "rgba(255,255,255,0.03)";
const BORDER = "rgba(255,255,255,0.08)";
const INK = "rgba(255,255,255,0.88)";
const INK2 = "rgba(255,255,255,0.62)";
const INK3 = "rgba(255,255,255,0.42)";
const GOLD = "#c9a84c";
const RED = "#ffa2a2";

type AppError = {
  id: string;
  ts: string;
  side: "server" | "client";
  message: string;
  stack: string | null;
  digest: string | null;
  path: string | null;
  method: string | null;
  route_type: string | null;
  user_agent: string | null;
};

function when(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

export default function ErrorsPage() {
  const { user, loading: authLoading } = useAuth();
  const admin = useIsAdmin(!!user);
  const [errors, setErrors] = useState<AppError[] | null>(null);
  const [failure, setFailure] = useState("");

  useEffect(() => {
    if (!admin) return;
    authFetch("/api/admin/errors/")
      .then(async r => {
        if (!r.ok) throw new Error((await r.json().catch(() => null))?.error ?? "Could not load errors.");
        return r.json();
      })
      .then(d => setErrors(d.errors ?? []))
      .catch(e => setFailure(e.message));
  }, [admin]);

  if (authLoading || admin === null) return <Shell><p style={{ color: INK3 }}>Checking…</p></Shell>;
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

  // The same message at the same path, however many times, is one problem.
  const groups = new Map<string, { first: AppError; count: number }>();
  for (const e of errors ?? []) {
    const key = `${e.side}|${e.path ?? ""}|${e.message}`;
    const g = groups.get(key);
    if (g) g.count++;
    else groups.set(key, { first: e, count: 1 });
  }

  return (
    <Shell>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: INK, marginBottom: 4 }}>Errors</h1>
      <p style={{ fontSize: 13, color: INK2, marginBottom: 24 }}>
        The last hundred unhandled errors, server and browser, newest first. Repeats of the same
        error at the same path are folded together.
      </p>

      {failure ? (
        <p role="alert" style={{ color: RED, fontSize: 14 }}>{failure}</p>
      ) : errors === null ? (
        <p style={{ color: INK3 }}>Loading…</p>
      ) : errors.length === 0 ? (
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 22px" }}>
          <p style={{ color: INK, fontSize: 14, margin: 0, fontWeight: 600 }}>Nothing recorded.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {[...groups.values()].map(({ first: e, count }) => (
            <details key={e.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "12px 16px" }}>
              <summary style={{ cursor: "pointer", listStyle: "none", display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "4px 10px" }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: e.side === "server" ? RED : GOLD,
                  background: e.side === "server" ? "rgba(248,113,113,0.12)" : "rgba(201,168,76,0.12)",
                  borderRadius: 4, padding: "2px 7px", textTransform: "uppercase",
                }}>
                  {e.side}{e.route_type ? ` · ${e.route_type}` : ""}
                </span>
                <span style={{ fontSize: 13, color: INK, fontWeight: 600, flex: "1 1 240px", wordBreak: "break-word" }}>{e.message}</span>
                {count > 1 ? <span style={{ fontSize: 12, color: GOLD, fontWeight: 800 }}>×{count}</span> : null}
                <span style={{ fontSize: 11, color: INK3 }}>{when(e.ts)}</span>
              </summary>
              <div style={{ marginTop: 10, fontSize: 12, color: INK2, lineHeight: 1.6 }}>
                <div>{e.method ?? "GET"} <code style={{ color: INK }}>{e.path ?? "—"}</code>{e.digest ? <> · digest <code>{e.digest}</code></> : null}</div>
                {e.user_agent ? <div style={{ color: INK3, wordBreak: "break-all" }}>{e.user_agent}</div> : null}
                {e.stack ? (
                  <pre style={{ marginTop: 8, whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: 11, color: INK2, background: "rgba(0,0,0,0.3)", padding: 10, borderRadius: 8 }}>{e.stack}</pre>
                ) : null}
              </div>
            </details>
          ))}
        </div>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "var(--font-family-body)", padding: "40px 20px" }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <Link href="/rentura/admin" style={{ fontSize: 12, color: INK3, textDecoration: "none" }}>&larr; Admin</Link>
        <div style={{ marginTop: 18 }}>{children}</div>
      </div>
    </div>
  );
}
