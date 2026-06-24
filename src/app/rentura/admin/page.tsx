"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL = "gowads047@gmail.com";

const C = {
  bg: "#0c0f1a", card: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.07)",
  ink: "rgba(255,255,255,0.85)", ink2: "rgba(255,255,255,0.45)", ink3: "rgba(255,255,255,0.22)",
  gold: "#c9a84c", green: "#22c55e", red: "#ef4444", amber: "#f59e0b", blue: "#3b82f6",
};

type Tab = "users" | "subscriptions" | "waitlist" | "overview";

export default function RenturaAdmin() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [users, setUsers] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [stats, setStats] = useState({ users: 0, active: 0, waitlist: 0, mrr: 0 });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/rentura/auth");
    if (!loading && user && user.email !== ADMIN_EMAIL) router.push("/rentura/dashboard");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL) return;
    Promise.all([
      fetch("/api/admin/users").then(r => r.json()).then(d => ({ data: d.users || [] })),
      supabase.from("rentura_subscriptions").select("*").order("created_at", { ascending: false }),
      supabase.from("rentura_waitlist").select("*").order("created_at", { ascending: false }),
    ]).then(([u, s, w]) => {
      setUsers(u.data || []);
      setSubs(s.data || []);
      setWaitlist(w.data || []);
      const activeSubs = (s.data || []).filter((x: any) => x.status === "active");
      setStats({
        users: (u.data || []).length,
        active: activeSubs.length,
        waitlist: (w.data || []).length,
        mrr: activeSubs.length * 9.99,
      });
      setDataLoading(false);
    });
  }, [user]);

  if (loading || dataLoading) return <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: C.ink3 }}>Loading admin…</p></div>;
  if (!user || user.email !== ADMIN_EMAIL) return null;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "var(--font-family-body)", color: C.ink }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>

      {/* Top bar */}
      <header style={{ background: "rgba(0,0,0,0.4)", borderBottom: `1px solid ${C.border}`, padding: "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: C.gold }}>Rentura™</span>
          <span style={{ fontSize: 12, color: C.ink3, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 20, padding: "2px 10px" }}>Admin</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <a href="/rentura/dashboard" style={{ fontSize: 12, color: C.ink2, textDecoration: "none" }}>← Dashboard</a>
          <span style={{ fontSize: 12, color: C.ink3 }}>{user.email}</span>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 32 }}>
          {[
            { label: "Total users", value: stats.users, color: C.blue },
            { label: "Active subscribers", value: stats.active, color: C.green },
            { label: "Waitlist signups", value: stats.waitlist, color: C.amber },
            { label: "MRR", value: `£${stats.mrr.toFixed(2)}`, color: C.gold },
          ].map(s => (
            <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 20px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: C.ink3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{s.label}</p>
              <p style={{ fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: `1px solid ${C.border}` }}>
          {(["overview", "users", "subscriptions", "waitlist"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
              padding: "8px 16px", fontSize: 13, fontWeight: tab === t ? 700 : 500,
              color: tab === t ? C.gold : C.ink2,
              borderBottom: tab === t ? `2px solid ${C.gold}` : "2px solid transparent",
              textTransform: "capitalize",
            }}>{t}</button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 24px" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 16 }}>Recent signups</p>
              {waitlist.slice(0, 8).map((w: any) => (
                <div key={w.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 13, color: C.ink }}>{w.email}</span>
                  <span style={{ fontSize: 11, color: C.ink3 }}>{new Date(w.created_at).toLocaleDateString("en-GB")}</span>
                </div>
              ))}
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 24px" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 16 }}>Active subscriptions</p>
              {subs.filter((s: any) => s.status === "active").slice(0, 8).map((s: any) => (
                <div key={s.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 12, color: C.ink, fontFamily: "monospace" }}>{s.stripe_customer_id?.slice(0, 18)}…</span>
                  <span style={{ fontSize: 11, color: C.green }}>Active</span>
                </div>
              ))}
              {subs.filter((s: any) => s.status === "active").length === 0 && (
                <p style={{ fontSize: 13, color: C.ink3 }}>No active subscriptions yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Users table */}
        {tab === "users" && (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {["Email", "Name", "Joined", "Verified", "Plan"].map(h => (
                    <th key={h} style={{ padding: "12px 18px", fontSize: 11, fontWeight: 700, color: C.ink3, textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "left" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u: any) => (
                  <tr key={u.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "12px 18px", fontSize: 13, color: C.ink }}>{u.email || "—"}</td>
                    <td style={{ padding: "12px 18px", fontSize: 12, color: C.ink2 }}>{u.name || "—"}</td>
                    <td style={{ padding: "12px 18px", fontSize: 12, color: C.ink2 }}>{u.created_at ? new Date(u.created_at).toLocaleDateString("en-GB") : "—"}</td>
                    <td style={{ padding: "12px 18px" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: u.confirmed ? C.green : C.amber, background: u.confirmed ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)", padding: "2px 8px", borderRadius: 10 }}>
                        {u.confirmed ? "✓" : "Pending"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 18px" }}>
                      {subs.find((s: any) => s.user_id === u.id) ? (
                        <span style={{ fontSize: 10, fontWeight: 700, color: C.green, background: "rgba(34,197,94,0.1)", padding: "2px 8px", borderRadius: 10 }}>Subscriber</span>
                      ) : (
                        <span style={{ fontSize: 10, fontWeight: 700, color: C.ink3, background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 10 }}>Free</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <p style={{ textAlign: "center", padding: 32, color: C.ink3, fontSize: 13 }}>No users yet.</p>}
          </div>
        )}

        {/* Subscriptions */}
        {tab === "subscriptions" && (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {["Customer", "Subscription ID", "Status", "Renews", "Plan"].map(h => (
                    <th key={h} style={{ padding: "12px 18px", fontSize: 11, fontWeight: 700, color: C.ink3, textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "left" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subs.map((s: any) => (
                  <tr key={s.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "12px 18px", fontSize: 11, color: C.ink, fontFamily: "monospace" }}>{s.stripe_customer_id || "—"}</td>
                    <td style={{ padding: "12px 18px", fontSize: 11, color: C.ink2, fontFamily: "monospace" }}>{s.stripe_subscription_id?.slice(0, 20) || "—"}</td>
                    <td style={{ padding: "12px 18px" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: s.status === "active" ? C.green : C.red, background: s.status === "active" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", padding: "2px 8px", borderRadius: 10, textTransform: "capitalize" }}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 18px", fontSize: 12, color: C.ink2 }}>
                      {s.current_period_end ? new Date(s.current_period_end).toLocaleDateString("en-GB") : "—"}
                    </td>
                    <td style={{ padding: "12px 18px", fontSize: 12, color: C.ink2, textTransform: "capitalize" }}>{s.plan || "monthly"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {subs.length === 0 && <p style={{ textAlign: "center", padding: 32, color: C.ink3, fontSize: 13 }}>No subscriptions yet.</p>}
          </div>
        )}

        {/* Waitlist */}
        {tab === "waitlist" && (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{waitlist.length} signups</p>
              <button
                onClick={() => {
                  const csv = ["email,name,phone,created_at", ...waitlist.map((w: any) => `${w.email},${w.name || ""},${w.phone || ""},${w.created_at}`)].join("\n");
                  const blob = new Blob([csv], { type: "text/csv" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url; a.download = "rentura-waitlist.csv"; a.click();
                }}
                style={{ background: C.gold, color: "#0f1b36", fontWeight: 800, fontSize: 12, padding: "6px 14px", borderRadius: 7, border: "none", cursor: "pointer" }}
              >
                Export CSV
              </button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {["Email", "Name", "Phone", "Signed up"].map(h => (
                    <th key={h} style={{ padding: "10px 18px", fontSize: 11, fontWeight: 700, color: C.ink3, textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "left" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {waitlist.map((w: any) => (
                  <tr key={w.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "11px 18px", fontSize: 13, color: C.ink }}>{w.email}</td>
                    <td style={{ padding: "11px 18px", fontSize: 13, color: C.ink2 }}>{w.name || "—"}</td>
                    <td style={{ padding: "11px 18px", fontSize: 13, color: C.ink2 }}>{w.phone || "—"}</td>
                    <td style={{ padding: "11px 18px", fontSize: 12, color: C.ink3 }}>{new Date(w.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {waitlist.length === 0 && <p style={{ textAlign: "center", padding: 32, color: C.ink3, fontSize: 13 }}>No waitlist signups yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
