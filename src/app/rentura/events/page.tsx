"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { RenturaSidebar } from "@/components/rentura/RenturaSidebar";
import type { EventType } from "@/lib/rentura/types";

const BG = "#0c0f1a";
const BORDER = "rgba(255,255,255,0.08)";
const INK = "rgba(255,255,255,0.88)";
const INK2 = "rgba(255,255,255,0.5)";
const INK3 = "rgba(255,255,255,0.25)";
const CTA = "#c9a84c";

type Event = {
  id: string;
  property_id: string | null;
  event_type: EventType;
  title: string;
  description: string | null;
  amount: number | null;
  event_date: string;
  created_at: string;
  trust_level: string;
  property?: { address: string; nickname: string | null } | null;
};

type Property = { id: string; address: string; nickname: string | null };

const EVENT_META: Record<string, { icon: string; color: string; label: string }> = {
  payment:               { icon: "£",  color: "#22c55e", label: "Rent received" },
  rent_payment:          { icon: "£",  color: "#22c55e", label: "Rent received" },
  bulk_payment:          { icon: "£",  color: "#22c55e", label: "Bulk rent" },
  maintenance_logged:    { icon: "🔧", color: "#f59e0b", label: "Maintenance" },
  maintenance_issue:     { icon: "🔧", color: "#f59e0b", label: "Maintenance" },
  maintenance_resolved:  { icon: "✓",  color: "#22c55e", label: "Resolved" },
  maintenance_cost:      { icon: "💸", color: "#ef4444", label: "Repair cost" },
  tenant_in:             { icon: "👤", color: "#3b82f6", label: "Tenant in" },
  new_tenant:            { icon: "👤", color: "#3b82f6", label: "New tenant" },
  tenant_out:            { icon: "🚪", color: "#8b5cf6", label: "Tenant out" },
  tenant_leaving:        { icon: "📦", color: "#8b5cf6", label: "Tenant leaving" },
  compliance:            { icon: "📋", color: "var(--gold-ink)", label: "Compliance" },
  deposit_protection:    { icon: "🔒", color: "#0891b2", label: "Deposit protected" },
  mortgage:              { icon: "🏦", color: "#3b82f6", label: "Mortgage" },
  mortgage_renewal:      { icon: "🏦", color: "#b8962e", label: "Mortgage renewal" },
  insurance_renewal:     { icon: "🛡", color: "#0891b2", label: "Insurance" },
  rent_review:           { icon: "📈", color: "var(--gold-ink)", label: "Rent review" },
  arrears:               { icon: "⚠",  color: "#ef4444", label: "Arrears" },
  void_period:           { icon: "⬜", color: "#6b7280", label: "Void period" },
  note:                  { icon: "📝", color: INK2,      label: "Note" },
  property_created:      { icon: "🏠", color: "var(--gold-ink)", label: "Property added" },
  new_property:          { icon: "🏠", color: "var(--gold-ink)", label: "Property added" },
};

const EVENT_TYPES: EventType[] = [
  "payment","rent_payment","bulk_payment",
  "maintenance_logged","maintenance_resolved","maintenance_cost",
  "tenant_in","tenant_out","compliance","mortgage","rent_review",
  "arrears","void_period","deposit_protection","note","property_created",
];

const BLANK = { property_id: "", event_type: "note" as EventType, title: "", description: "", amount: "", event_date: new Date().toISOString().slice(0,10) };

function groupByMonth(events: Event[]): { label: string; events: Event[] }[] {
  const map: Record<string, Event[]> = {};
  for (const e of events) {
    const d = new Date(e.event_date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!map[key]) map[key] = [];
    map[key].push(e);
  }
  return Object.entries(map)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, evts]) => ({
      label: new Date(key + "-01").toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
      events: evts.sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime()),
    }));
}

export default function EventsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [form, setForm] = useState(BLANK);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/rentura/auth"); return; }
    load();
  }, [user, authLoading]); // eslint-disable-line

  async function load() {
    const [{ data: ev }, { data: pr }] = await Promise.all([
      supabase.from("rentura_events")
        .select("*, property:rentura_properties(address, nickname)")
        .eq("user_id", user!.id)
        .order("event_date", { ascending: false })
        .limit(300),
      supabase.from("rentura_properties").select("id, address, nickname").eq("user_id", user!.id).order("created_at"),
    ]);
    setEvents(ev || []);
    setProperties(pr || []);
    setLoading(false);
  }

  function setF(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function save() {
    if (!user || !form.title.trim()) return;
    setSaving(true);
    await supabase.from("rentura_events").insert({
      user_id: user.id,
      property_id: form.property_id || null,
      event_type: form.event_type,
      title: form.title.trim(),
      description: form.description.trim() || null,
      amount: form.amount ? parseFloat(form.amount) : null,
      event_date: form.event_date,
      trust_level: "confirmed",
      metadata: {},
    });
    setShowForm(false);
    setSaving(false);
    setForm(BLANK);
    load();
  }

  async function remove(id: string) {
    await supabase.from("rentura_events").delete().eq("id", id);
    setEvents(es => es.filter(e => e.id !== id));
  }

  const filtered = events.filter(e => {
    if (propertyFilter !== "all" && e.property_id !== propertyFilter) return false;
    if (typeFilter !== "all" && e.event_type !== typeFilter) return false;
    return true;
  });

  const grouped = groupByMonth(filtered);
  const totalIncome = events.filter(e => e.event_type === "payment" && (e.amount ?? 0) > 0).reduce((s, e) => s + (e.amount ?? 0), 0);
  const totalCosts = events.filter(e => e.event_type === "maintenance_cost" && (e.amount ?? 0) > 0).reduce((s, e) => s + (e.amount ?? 0), 0);

  const inputStyle: React.CSSProperties = { width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "9px 12px", fontSize: 14, color: INK, outline: "none", fontFamily: "inherit" };
  const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: INK3, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 };

  if (loading || authLoading) return (
    <div style={{ background: BG, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: INK3 }}>Loading…</p>
    </div>
  );

  return (
    <div style={{ fontFamily: "var(--font-family-body)", background: BG, color: INK, minHeight: "100vh", display: "flex" }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>
      <RenturaSidebar />

      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 80px" }}>

          {/* Header */}
          <div style={{ padding: "36px 0 24px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 900, letterSpacing: "-0.03em", fontFamily: "var(--font-family-heading)", marginBottom: 6 }}>
                Timeline
              </h1>
              <p style={{ fontSize: 14, color: INK2 }}>Every event across your portfolio, in one place.</p>
            </div>
            <button onClick={() => setShowForm(true)} style={{ background: CTA, color: "#0f1b36", fontWeight: 800, fontSize: 13, padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer", flexShrink: 0 }}>
              + Log event
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 28 }}>
            {[
              { label: "Total events", value: events.length.toString(), color: INK },
              { label: "Income logged", value: `£${totalIncome.toLocaleString("en-GB")}`, color: "#22c55e" },
              { label: "Costs logged", value: `£${totalCosts.toLocaleString("en-GB")}`, color: "#ef4444" },
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "16px 18px" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: INK3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{s.label}</p>
                <p style={{ fontSize: 22, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
            <select value={propertyFilter} onChange={e => setPropertyFilter(e.target.value)}
              style={{ ...inputStyle, width: "auto", fontSize: 13, padding: "7px 12px" }}>
              <option value="all">All properties</option>
              {properties.map(p => <option key={p.id} value={p.id}>{p.nickname || p.address.split(",")[0]}</option>)}
            </select>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
              style={{ ...inputStyle, width: "auto", fontSize: 13, padding: "7px 12px" }}>
              <option value="all">All types</option>
              {EVENT_TYPES.map(t => <option key={t} value={t}>{EVENT_META[t]?.label || t}</option>)}
            </select>
          </div>

          {/* Timeline */}
          {grouped.length === 0 ? (
            <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}`, borderRadius: 16, padding: "48px 24px", textAlign: "center" }}>
              <p style={{ fontSize: 24, marginBottom: 12 }}>📋</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: INK, marginBottom: 6 }}>No events yet</p>
              <p style={{ fontSize: 13, color: INK2, marginBottom: 20 }}>Events are logged automatically when you add tenants, maintenance, compliance, and financials. You can also log manual notes here.</p>
              <button onClick={() => setShowForm(true)} style={{ background: CTA, color: "#0f1b36", fontWeight: 800, fontSize: 13, padding: "10px 22px", borderRadius: 8, border: "none", cursor: "pointer" }}>
                Log first event
              </button>
            </div>
          ) : (
            grouped.map(group => (
              <div key={group.label} style={{ marginBottom: 32 }}>
                <p style={{ fontSize: 11, fontWeight: 800, color: INK3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14, paddingLeft: 4 }}>
                  {group.label}
                </p>
                <div style={{ position: "relative", paddingLeft: 28 }}>
                  {/* Timeline line */}
                  <div style={{ position: "absolute", left: 9, top: 0, bottom: 0, width: 1, background: BORDER }} />

                  {group.events.map((evt, i) => {
                    const meta = EVENT_META[evt.event_type] || { icon: "•", color: INK2, label: evt.event_type };
                    return (
                      <div key={evt.id} style={{ position: "relative", marginBottom: i < group.events.length - 1 ? 12 : 0 }}>
                        {/* Dot */}
                        <div style={{ position: "absolute", left: -28, top: 14, width: 18, height: 18, borderRadius: "50%", background: BG, border: `2px solid ${meta.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>
                          {meta.icon.length === 1 && meta.icon !== "£" ? meta.icon : ""}
                        </div>

                        <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: 14 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 10, fontWeight: 700, color: meta.color, background: meta.color + "18", padding: "2px 8px", borderRadius: 10 }}>
                                {meta.icon} {meta.label}
                              </span>
                              {evt.property?.address && (
                                <span style={{ fontSize: 11, color: INK3 }}>
                                  {evt.property.nickname || evt.property.address.split(",")[0]}
                                </span>
                              )}
                              <span style={{ fontSize: 11, color: INK3, marginLeft: "auto" }}>
                                {new Date(evt.event_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                              </span>
                            </div>
                            <p style={{ fontSize: 14, fontWeight: 600, color: INK, marginBottom: evt.description ? 4 : 0 }}>{evt.title}</p>
                            {evt.description && <p style={{ fontSize: 12, color: INK2, lineHeight: 1.5 }}>{evt.description}</p>}
                            {evt.amount != null && (
                              <p style={{ fontSize: 13, fontWeight: 700, color: evt.event_type === "maintenance_cost" || evt.event_type === "arrears" ? "#ef4444" : "#22c55e", marginTop: 6 }}>
                                {evt.event_type === "maintenance_cost" || evt.event_type === "arrears" ? "−" : "+"}£{Math.abs(evt.amount).toLocaleString("en-GB")}
                              </p>
                            )}
                          </div>
                          <button onClick={() => remove(evt.id)} style={{ fontSize: 11, color: INK3, background: "none", border: "none", cursor: "pointer", padding: "2px 6px", flexShrink: 0, opacity: 0.5 }} title="Delete event">
                            ×
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Log event modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#111827", border: `1px solid ${BORDER}`, borderRadius: 20, width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto", padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>Log event</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", color: INK2, cursor: "pointer", fontSize: 20 }}>×</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>Event type *</label>
                <select value={form.event_type} onChange={e => setF("event_type", e.target.value)} style={inputStyle}>
                  {EVENT_TYPES.map(t => <option key={t} value={t}>{EVENT_META[t]?.icon} {EVENT_META[t]?.label || t}</option>)}
                </select>
              </div>

              {properties.length > 0 && (
                <div>
                  <label style={labelStyle}>Property</label>
                  <select value={form.property_id} onChange={e => setF("property_id", e.target.value)} style={inputStyle}>
                    <option value="">Portfolio-wide</option>
                    {properties.map(p => <option key={p.id} value={p.id}>{p.nickname || p.address.split(",")[0]}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label style={labelStyle}>Title *</label>
                <input value={form.title} onChange={e => setF("title", e.target.value)} placeholder="e.g. Rent received — October" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Description</label>
                <textarea value={form.description} onChange={e => setF("description", e.target.value)} rows={2} placeholder="Optional details…" style={{ ...inputStyle, resize: "vertical" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Amount (£)</label>
                  <input type="number" value={form.amount} onChange={e => setF("amount", e.target.value)} placeholder="0.00" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Date</label>
                  <input type="date" value={form.event_date} onChange={e => setF("event_date", e.target.value)} style={inputStyle} />
                </div>
              </div>

              <button onClick={save} disabled={saving || !form.title.trim()} style={{ background: CTA, color: "#0f1b36", fontWeight: 800, fontSize: 15, padding: "13px 0", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit", marginTop: 4, opacity: saving || !form.title.trim() ? 0.5 : 1 }}>
                {saving ? "Saving…" : "Log event"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
