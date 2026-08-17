"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

const BG = "#08090f";
const BORDER = "rgba(255,255,255,0.07)";
const INK = "rgba(255,255,255,0.88)";
const INK2 = "rgba(255,255,255,0.45)";
const INK3 = "rgba(255,255,255,0.22)";
const GOLD = "#c9a84c";

type Stats = {
  rentura: { properties: number; tenants: number; alerts: number };
  academy: { enrolled: number; completed: number };
  makan: { listings: number; messages: number };
};

export default function HubPage() {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("rentura_properties").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("rentura_tenants").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("rentura_compliance").select("id", { count: "exact", head: true }).eq("user_id", user.id).lte("expiry_date", new Date(Date.now() + 45 * 86400000).toISOString().slice(0, 10)),
      supabase.from("academy_enrollments").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("academy_progress").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("completed", true),
      supabase.from("listings").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "active"),
      supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("recipient_id", user.id).eq("read", false),
    ]).then(([props, tenants, alerts, enrolled, progress, listings, unread]) => {
      setStats({
        rentura: { properties: props.count || 0, tenants: tenants.count || 0, alerts: alerts.count || 0 },
        academy: { enrolled: enrolled.count || 0, completed: progress.count || 0 },
        makan: { listings: listings.count || 0, messages: unread.count || 0 },
      });
    });
  }, [user]);

  if (authLoading) return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: INK3 }}>Loading…</p>
    </div>
  );

  const firstName = (profile?.name || user?.email?.split("@")[0] || "").split(" ")[0];

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "var(--font-family-body)", color: INK }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>

      {/* Header */}
      <header style={{ padding: "18px 32px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 18, fontWeight: 900, color: GOLD, letterSpacing: "-0.02em", fontFamily: "var(--font-family-heading)" }}>PropertyVault</span>
          <span style={{ fontSize: 11, color: INK3, fontWeight: 500 }}>Hub</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link href="/" style={{ fontSize: 12, color: INK3, textDecoration: "none" }}>Marketing site</Link>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 12, color: INK2 }}>{profile?.name || user.email}</span>
              <button onClick={signOut} style={{ fontSize: 12, color: INK3, background: "none", border: `1px solid ${BORDER}`, borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontFamily: "inherit" }}>Sign out</button>
            </div>
          ) : (
            <Link href="/auth/login" style={{ fontSize: 13, color: GOLD, fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
          )}
        </div>
      </header>

      <div style={{ maxWidth: 1020, margin: "0 auto", padding: "52px 24px 80px" }}>

        {/* Welcome */}
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 900, letterSpacing: "-0.03em", fontFamily: "var(--font-family-heading)", lineHeight: 1.1, marginBottom: 10 }}>
            {user ? <>Welcome back{firstName ? `, ${firstName}` : ""}</> : "Your Property Ecosystem"}
          </h1>
          <p style={{ fontSize: 16, color: INK2, maxWidth: 500 }}>
            {user ? "Everything connected — manage, learn, and transact from one place." : "Sign in to access all three platforms from your personal hub."}
          </p>
        </div>

        {/* Platform cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18, marginBottom: 52 }}>

          {/* Rentura */}
          <div style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.06) 0%, rgba(201,168,76,0.02) 100%)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 20, padding: "28px 26px", display: "flex", flexDirection: "column", gap: 0 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 18, fontWeight: 900, color: GOLD, letterSpacing: "-0.01em", marginBottom: 2 }}>Rentura™</p>
                <p style={{ fontSize: 11, color: INK3, letterSpacing: "0.04em" }}>Property Operating System</p>
              </div>
              <span style={{ fontSize: 24 }}>🏠</span>
            </div>
            <p style={{ fontSize: 13, color: INK2, lineHeight: 1.55, marginBottom: 20 }}>
              Manage tenants, compliance certs, maintenance, mortgages, financials, and tax — all in one landlord OS.
            </p>

            {stats && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
                {[
                  { label: "Properties", value: stats.rentura.properties },
                  { label: "Tenants", value: stats.rentura.tenants },
                  { label: "Alerts", value: stats.rentura.alerts, warn: stats.rentura.alerts > 0 },
                ].map(s => (
                  <div key={s.label} style={{ background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
                    <p style={{ fontSize: 18, fontWeight: 900, color: s.warn ? "#f59e0b" : INK, lineHeight: 1 }}>{s.value}</p>
                    <p style={{ fontSize: 10, color: INK3, marginTop: 3 }}>{s.label}</p>
                  </div>
                ))}
              </div>
            )}

            <Link href="/rentura/dashboard" style={{ display: "block", background: GOLD, color: "#0f1b36", fontWeight: 800, fontSize: 13, padding: "11px 0", borderRadius: 10, textDecoration: "none", textAlign: "center", marginTop: "auto" }}>
              Open Rentura →
            </Link>

            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              {[["Properties", "/rentura/properties"], ["Tenants", "/rentura/tenants"], ["Compliance", "/rentura/compliance"], ["Tax", "/rentura/tax"]].map(([l, h]) => (
                <Link key={h} href={h} style={{ fontSize: 11, color: INK3, textDecoration: "none", padding: "3px 8px", borderRadius: 6, border: `1px solid ${BORDER}` }}>{l}</Link>
              ))}
            </div>
          </div>

          {/* Academy */}
          <div style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(59,130,246,0.02) 100%)", border: "1px solid rgba(59,130,246,0.18)", borderRadius: 20, padding: "28px 26px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 18, fontWeight: 900, color: "#60a5fa", letterSpacing: "-0.01em", marginBottom: 2 }}>Academy</p>
                <p style={{ fontSize: 11, color: INK3, letterSpacing: "0.04em" }}>Property Investment School</p>
              </div>
              <span style={{ fontSize: 24 }}>🎓</span>
            </div>
            <p style={{ fontSize: 13, color: INK2, lineHeight: 1.55, marginBottom: 20 }}>
              Master sourcing, deal analysis, HMO conversions, SA strategies, and raising finance through structured video courses.
            </p>

            {stats && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
                {[
                  { label: "Enrolled courses", value: stats.academy.enrolled },
                  { label: "Lessons done", value: stats.academy.completed },
                ].map(s => (
                  <div key={s.label} style={{ background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
                    <p style={{ fontSize: 18, fontWeight: 900, color: "#60a5fa", lineHeight: 1 }}>{s.value}</p>
                    <p style={{ fontSize: 10, color: INK3, marginTop: 3 }}>{s.label}</p>
                  </div>
                ))}
              </div>
            )}

            <Link href="/academy/dashboard" style={{ display: "block", background: "#3b82f6", color: "white", fontWeight: 800, fontSize: 13, padding: "11px 0", borderRadius: 10, textDecoration: "none", textAlign: "center", marginTop: "auto" }}>
              Open Academy →
            </Link>

            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              {[["Courses", "/academy/courses"], ["Dashboard", "/academy/dashboard"], ["Playbooks", "/academy/playbooks"], ["Scripts", "/academy/scripts"]].map(([l, h]) => (
                <Link key={h} href={h} style={{ fontSize: 11, color: INK3, textDecoration: "none", padding: "3px 8px", borderRadius: 6, border: `1px solid ${BORDER}` }}>{l}</Link>
              ))}
            </div>
          </div>

          {/* Makan */}
          <div style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.06) 0%, rgba(34,197,94,0.02) 100%)", border: "1px solid rgba(34,197,94,0.18)", borderRadius: 20, padding: "28px 26px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 18, fontWeight: 900, color: "#4ade80", letterSpacing: "-0.01em", marginBottom: 2 }}>Makan</p>
                <p style={{ fontSize: 11, color: INK3, letterSpacing: "0.04em" }}>Property Marketplace</p>
              </div>
              <span style={{ fontSize: 24 }}>🏘️</span>
            </div>
            <p style={{ fontSize: 13, color: INK2, lineHeight: 1.55, marginBottom: 20 }}>
              List and discover UK properties — buy, sell, let, and rent-to-rent. Direct landlord-to-buyer, no agency fees.
            </p>

            {stats && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
                {[
                  { label: "Your listings", value: stats.makan.listings },
                  { label: "Unread messages", value: stats.makan.messages, warn: stats.makan.messages > 0 },
                ].map(s => (
                  <div key={s.label} style={{ background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
                    <p style={{ fontSize: 18, fontWeight: 900, color: s.warn ? "#f59e0b" : "#4ade80", lineHeight: 1 }}>{s.value}</p>
                    <p style={{ fontSize: 10, color: INK3, marginTop: 3 }}>{s.label}</p>
                  </div>
                ))}
              </div>
            )}

            <Link href="/makan" style={{ display: "block", background: "#22c55e", color: "#0a1a10", fontWeight: 800, fontSize: 13, padding: "11px 0", borderRadius: 10, textDecoration: "none", textAlign: "center", marginTop: "auto" }}>
              Open Makan →
            </Link>

            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              {[["Browse", "/makan"], ["Dashboard", "/makan/dashboard"], ["Messages", "/makan/messages"], ["List property", "/makan/list"]].map(([l, h]) => (
                <Link key={h} href={h} style={{ fontSize: 11, color: INK3, textDecoration: "none", padding: "3px 8px", borderRadius: 6, border: `1px solid ${BORDER}` }}>{l}</Link>
              ))}
            </div>
          </div>
        </div>

        {/* Quick links strip */}
        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 36 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: INK3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Quick links</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { label: "Main site", href: "/" },
              { label: "Guaranteed rent", href: "/guaranteed-rent" },
              { label: "Sourcing", href: "/sourcing" },
              { label: "Portfolio builder", href: "/portfolio" },
              { label: "Contact", href: "/contact" },
              { label: "Rentura admin", href: "/rentura/admin" },
              { label: "Academy admin", href: "/academy/admin" },
              { label: "Makan admin", href: "/makan/admin" },
            ].map(q => (
              <Link key={q.href} href={q.href} style={{ fontSize: 12, color: INK2, textDecoration: "none", padding: "6px 14px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "rgba(255,255,255,0.02)" }}>
                {q.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
