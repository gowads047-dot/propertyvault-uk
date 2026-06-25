"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

type Event = {
  id: string;
  property_id: string;
  event_type: string;
  title: string;
  description?: string | null;
  amount?: number | null;
  event_date: string;
  trust_level?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
};

type Property = { id: string; address: string };

const EVENT_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  payment:           { icon: "£", color: "#16a34a", label: "Rent received" },
  rent_payment:      { icon: "£", color: "#16a34a", label: "Rent received" },
  bulk_payment:      { icon: "£", color: "#16a34a", label: "Bulk rent" },
  maintenance_issue: { icon: "🔧", color: "#d97706", label: "Maintenance" },
  maintenance_cost:  { icon: "🧾", color: "#b8962e", label: "Cost logged" },
  new_property:      { icon: "🏠", color: "#2563eb", label: "Property added" },
  new_tenant:        { icon: "👤", color: "#7c3aed", label: "New tenant" },
  tenant_leaving:    { icon: "📦", color: "#6b7280", label: "Tenant leaving" },
  arrears:           { icon: "⚠", color: "#dc2626", label: "Arrears" },
  section_21:        { icon: "📋", color: "#dc2626", label: "Section 21" },
  deposit_protection:{ icon: "🔒", color: "#0891b2", label: "Deposit protected" },
  rent_review:       { icon: "↑", color: "#2563eb", label: "Rent review" },
  compliance:        { icon: "✓", color: "#0891b2", label: "Compliance" },
  void_period:       { icon: "⬜", color: "#6b7280", label: "Void period" },
  mortgage_renewal:  { icon: "🏦", color: "#b8962e", label: "Mortgage renewal" },
  insurance_renewal: { icon: "🛡", color: "#0891b2", label: "Insurance" },
  general:           { icon: "●", color: "#6b7280", label: "Event" },
};

function cfg(type: string) { return EVENT_CONFIG[type] ?? EVENT_CONFIG.general; }
function fmt(n: number) { return "£" + n.toLocaleString("en-GB"); }
function shortAddr(a: string) { return a.split(",")[0]; }
function groupByDate(events: Event[]): [string, Event[]][] {
  const map = new Map<string, Event[]>();
  for (const e of events) {
    const key = new Date(e.event_date || e.created_at).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(e);
  }
  return Array.from(map.entries());
}

const EVENT_TYPES = ["all", "payment", "maintenance_issue", "maintenance_cost", "new_tenant", "tenant_leaving", "arrears", "compliance", "deposit_protection", "section_21"];

export default function TimelinePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [propFilter, setPropFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    if (!authLoading && !user) router.push("/rentura/auth?next=/rentura/timeline");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("rentura_events").select("*").eq("user_id", user.id).order("event_date", { ascending: false }).order("created_at", { ascending: false }).limit(300),
      supabase.from("rentura_properties").select("id,address").eq("user_id", user.id),
    ]).then(([evRes, prRes]) => {
      setEvents(evRes.data ?? []);
      setProperties(prRes.data ?? []);
      setLoading(false);
    });
  }, [user]);

  const filtered = events.filter(e => {
    if (propFilter !== "all" && e.property_id !== propFilter) return false;
    if (typeFilter !== "all" && e.event_type !== typeFilter) return false;
    return true;
  });

  const grouped = groupByDate(filtered);
  const propMap = Object.fromEntries(properties.map(p => [p.id, p]));

  const BG = "#eceae2";
  const INK = "#111111";
  const INK2 = "rgba(17,17,17,0.52)";
  const BORDER = "rgba(17,17,17,0.09)";
  const CTA = "#0f1728";

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{`body > header, body > footer { display: none !important; }`}</style>
        <p style={{ color: INK2, fontSize: 14, fontFamily: "sans-serif" }}>Loading timeline…</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "var(--font-family-body, sans-serif)", background: BG, color: INK, minHeight: "100vh" }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>

      {/* NAV */}
      <nav style={{ borderBottom: `1px solid ${BORDER}`, padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", background: BG, position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
          <Link href="/rentura/dashboard" style={{ color: INK2, textDecoration: "none", fontWeight: 500 }}>Dashboard</Link>
          <span style={{ color: INK2 }}>›</span>
          <span style={{ color: INK, fontWeight: 800 }}>Timeline</span>
        </div>
        <Link href="/rentura/dashboard" style={{ fontSize: 12, color: INK2, textDecoration: "none" }}>← Back</Link>
      </nav>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "36px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 6, fontFamily: "var(--font-family-heading, sans-serif)" }}>Portfolio Timeline</h1>
          <p style={{ fontSize: 14, color: INK2 }}>{filtered.length} event{filtered.length !== 1 ? "s" : ""} across {properties.length} propert{properties.length !== 1 ? "ies" : "y"}</p>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
          <select value={propFilter} onChange={e => setPropFilter(e.target.value)}
            style={{ padding: "8px 14px", fontSize: 13, borderRadius: 9, border: `1px solid ${BORDER}`, background: "white", color: INK, outline: "none", fontFamily: "inherit", cursor: "pointer" }}>
            <option value="all">All properties</option>
            {properties.map(p => <option key={p.id} value={p.id}>{shortAddr(p.address)}</option>)}
          </select>

          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            style={{ padding: "8px 14px", fontSize: 13, borderRadius: 9, border: `1px solid ${BORDER}`, background: "white", color: INK, outline: "none", fontFamily: "inherit", cursor: "pointer" }}>
            <option value="all">All event types</option>
            {EVENT_TYPES.filter(t => t !== "all").map(t => <option key={t} value={t}>{cfg(t).label}</option>)}
          </select>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div style={{ background: "white", borderRadius: 16, padding: "48px 32px", textAlign: "center", border: `1px solid ${BORDER}` }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>📋</p>
            <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>No events yet</p>
            <p style={{ color: INK2, fontSize: 14, marginBottom: 24 }}>Events are logged when you tell the AI what happened — payments, maintenance, tenancy changes, and more.</p>
            <Link href="/rentura/dashboard" style={{ display: "inline-block", background: CTA, color: "white", fontWeight: 700, fontSize: 13, padding: "10px 24px", borderRadius: 10, textDecoration: "none" }}>
              Go to dashboard to log an event →
            </Link>
          </div>
        )}

        {/* Grouped events */}
        {grouped.map(([date, dayEvents]) => (
          <div key={date} style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: "rgba(17,17,17,0.38)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>{date}</p>

            <div style={{ position: "relative" }}>
              {/* Vertical line */}
              <div style={{ position: "absolute", left: 15, top: 0, bottom: 0, width: 1, background: BORDER }} />

              {dayEvents.map(e => {
                const c = cfg(e.event_type);
                const prop = propMap[e.property_id];
                return (
                  <div key={e.id} style={{ display: "flex", gap: 16, marginBottom: 12, position: "relative" }}>
                    {/* Icon dot */}
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "white", border: `2px solid ${c.color}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, color: c.color, zIndex: 1 }}>
                      {c.icon}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, background: "white", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "13px 16px", marginBottom: 2 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: c.color, background: `${c.color}14`, padding: "2px 7px", borderRadius: 5 }}>{c.label}</span>
                            {prop && (
                              <Link href={`/rentura/properties/${prop.id}`} style={{ fontSize: 11, color: INK2, textDecoration: "none" }}>
                                {shortAddr(prop.address)} →
                              </Link>
                            )}
                          </div>
                          <p style={{ fontSize: 14, fontWeight: 700, color: INK, lineHeight: 1.35 }}>{e.title}</p>
                        </div>
                        {e.amount != null && (
                          <span style={{ fontSize: 15, fontWeight: 900, color: ["payment","rent_payment","bulk_payment"].includes(e.event_type) ? "#16a34a" : "#dc2626", flexShrink: 0 }}>
                            {["payment","rent_payment","bulk_payment"].includes(e.event_type) ? "+" : "-"}{fmt(e.amount)}
                          </span>
                        )}
                      </div>
                      {e.description && (
                        <p style={{ fontSize: 12, color: INK2, lineHeight: 1.55, marginTop: 4 }}>{e.description.length > 140 ? e.description.slice(0, 140) + "…" : e.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
