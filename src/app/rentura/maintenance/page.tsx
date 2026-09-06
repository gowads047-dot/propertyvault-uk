"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RenturaSidebar } from "@/components/rentura/RenturaSidebar";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import type { RenturaProperty, RenturaMaintenance, MaintenanceUrgency, MaintenanceStatus, MaintenanceCategory } from "@/lib/rentura/types";

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES: { value: MaintenanceCategory; label: string; icon: string }[] = [
  { value: "plumbing",    label: "Plumbing",    icon: "🚿" },
  { value: "electrical",  label: "Electrical",  icon: "⚡" },
  { value: "structural",  label: "Structural",  icon: "🏗" },
  { value: "appliance",   label: "Appliance",   icon: "🔌" },
  { value: "damp",        label: "Damp / Mould", icon: "💧" },
  { value: "roofing",     label: "Roofing",     icon: "🏠" },
  { value: "other",       label: "Other",       icon: "🔧" },
];

const URGENCY_CFG: Record<MaintenanceUrgency, { label: string; color: string; bg: string; border: string; detail: string }> = {
  emergency: { label: "Emergency",    color: "#b91c1c", bg: "rgba(220,38,38,0.05)", border: "rgba(220,38,38,0.25)", detail: "Within 24 hours" },
  urgent:    { label: "Urgent",       color: "#d97706", bg: "rgba(217,119,6,0.05)", border: "rgba(217,119,6,0.25)",  detail: "Within 7 days" },
  routine:   { label: "Routine",      color: "#2563eb", bg: "rgba(37,99,235,0.04)", border: "rgba(37,99,235,0.15)",  detail: "When convenient" },
};

const STATUS_CFG: Record<MaintenanceStatus, { label: string; color: string; next: MaintenanceStatus | null; nextLabel: string }> = {
  open:        { label: "Open",        color: "#d97706", next: "in_progress", nextLabel: "Mark in progress" },
  in_progress: { label: "In progress", color: "#2563eb", next: "resolved",    nextLabel: "Mark resolved" },
  resolved:    { label: "Resolved",    color: "#15803d", next: null,          nextLabel: "" },
};

function fmtDate(d: string | null) {
  if (!d) return "—";
  const diff = Math.ceil((Date.now() - new Date(d).getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff} days ago`;
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function fmt(n: number | null | undefined) {
  if (n == null) return "—";
  return "£" + n.toLocaleString("en-GB");
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  const BORDER = "rgba(17,17,17,0.1)";
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "white", borderRadius: 18, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.02em" }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "rgba(17,17,17,0.4)", padding: "4px 8px" }}>✕</button>
        </div>
        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 20 }}>{children}</div>
      </div>
    </div>
  );
}

// ── Issue card ────────────────────────────────────────────────────────────────

function IssueCard({
  issue, propertyAddress, onUpdate, onLogCost, onEdit,
}: {
  issue: RenturaMaintenance;
  propertyAddress: string;
  onUpdate: (id: string, status: MaintenanceStatus) => void;
  onLogCost: (issue: RenturaMaintenance) => void;
  onEdit: (issue: RenturaMaintenance) => void;
}) {
  const BG = "#eceae2";
  const INK = "#111111";
  const INK2 = "rgba(17,17,17,0.52)";
  const BORDER = "rgba(17,17,17,0.09)";
  const urg = URGENCY_CFG[issue.urgency];
  const sta = STATUS_CFG[issue.status];
  const cat = CATEGORIES.find(c => c.value === issue.category);

  return (
    <div style={{ background: "white", borderRadius: 14, padding: "18px 20px", border: `1px solid ${issue.urgency === "emergency" ? "rgba(220,38,38,0.3)" : BORDER}`, marginBottom: 10 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{cat?.icon ?? "🔧"}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: INK, lineHeight: 1.3 }}>{issue.title}</p>
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: urg.color, background: urg.bg, border: `1px solid ${urg.border}`, padding: "2px 7px", borderRadius: 20 }}>{urg.label}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: sta.color, background: `${sta.color}10`, padding: "2px 7px", borderRadius: 20 }}>{sta.label}</span>
            </div>
          </div>

          <p style={{ fontSize: 12, color: INK2, marginBottom: 6 }}>
            {propertyAddress.split(",")[0]} · {cat?.label} · Reported {fmtDate(issue.reported_date)}
          </p>

          {issue.description && <p style={{ fontSize: 13, color: INK, lineHeight: 1.5, marginBottom: 8 }}>{issue.description}</p>}

          {/* Contractor */}
          {issue.contractor_name && (
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: INK2 }}>👷 {issue.contractor_name}</span>
              {issue.contractor_phone && <span style={{ fontSize: 12, color: "#2563eb", fontWeight: 600 }}>{issue.contractor_phone}</span>}
            </div>
          )}

          {/* Cost */}
          {(issue.estimated_cost || issue.actual_cost) && (
            <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
              {issue.estimated_cost && <span style={{ fontSize: 12, color: INK2 }}>Est. {fmt(issue.estimated_cost)}</span>}
              {issue.actual_cost && <span style={{ fontSize: 12, fontWeight: 700, color: INK }}>Actual {fmt(issue.actual_cost)}</span>}
              {issue.is_improvement && <span style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", background: "rgba(124,58,237,0.08)", padding: "2px 7px", borderRadius: 20 }}>Capital improvement</span>}
            </div>
          )}

          {/* Scheduled date */}
          {issue.scheduled_date && issue.status !== "resolved" && (
            <p style={{ fontSize: 12, color: "#2563eb", fontWeight: 600, marginBottom: 8 }}>
              📅 Scheduled: {new Date(issue.scheduled_date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
            </p>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8, paddingTop: 10, borderTop: `1px solid ${BORDER}` }}>
            {sta.next && (
              <button onClick={() => onUpdate(issue.id, sta.next!)}
                style={{ fontSize: 12, fontWeight: 700, padding: "6px 14px", borderRadius: 7, border: "none", cursor: "pointer", fontFamily: "inherit", background: sta.next === "resolved" ? "#15803d" : "#0f1728", color: "white" }}>
                {sta.nextLabel}
              </button>
            )}
            {issue.status !== "resolved" && (
              <button onClick={() => onLogCost(issue)}
                style={{ fontSize: 12, fontWeight: 700, padding: "6px 14px", borderRadius: 7, border: `1px solid ${BORDER}`, cursor: "pointer", fontFamily: "inherit", background: BG, color: INK }}>
                Log cost
              </button>
            )}
            <button onClick={() => onEdit(issue)}
              style={{ fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 7, border: `1px solid ${BORDER}`, cursor: "pointer", fontFamily: "inherit", background: "none", color: "rgba(17,17,17,0.72)" }}>
              Edit
            </button>
            <Link href={`/rentura/properties/${issue.property_id}`}
              style={{ fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 7, color: "rgba(17,17,17,0.72)", textDecoration: "none", border: `1px solid ${BORDER}` }}>
              View Passport →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

type IssueForm = {
  property_id: string; title: string; description: string; category: MaintenanceCategory;
  urgency: MaintenanceUrgency; contractor_name: string; contractor_phone: string;
  contractor_email: string; estimated_cost: string; scheduled_date: string;
  is_improvement: boolean; notes: string;
};

const BLANK_FORM: IssueForm = {
  property_id: "", title: "", description: "", category: "other",
  urgency: "routine", contractor_name: "", contractor_phone: "",
  contractor_email: "", estimated_cost: "", scheduled_date: "",
  is_improvement: false, notes: "",
};

export default function MaintenancePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [properties, setProperties] = useState<RenturaProperty[]>([]);
  const [issues, setIssues] = useState<RenturaMaintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | MaintenanceStatus>("all");
  const [saving, setSaving] = useState(false);

  const [showAdd, setShowAdd] = useState(false);
  const [editIssue, setEditIssue] = useState<RenturaMaintenance | null>(null);
  const [costIssue, setCostIssue] = useState<RenturaMaintenance | null>(null);
  const [costAmount, setCostAmount] = useState("");
  const [costIsImprovement, setCostIsImprovement] = useState(false);

  const [form, setForm] = useState<IssueForm>(BLANK_FORM);
  const setF = (k: keyof IssueForm, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  async function load() {
    setLoading(true);
    const [propRes, issueRes] = await Promise.all([
      supabase.from("rentura_properties").select("*").eq("user_id", user!.id),
      supabase.from("rentura_maintenance").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }),
    ]);
    setProperties(propRes.data ?? []);
    setIssues((issueRes.data ?? []) as RenturaMaintenance[]);
    setLoading(false);
  }

  useEffect(() => {
    if (!user) { router.push("/rentura/auth?next=/rentura/maintenance"); return; }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load is an async fetch; its setState calls run after the await, not during render
    load();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  async function saveIssue() {
    if (!user || !form.title.trim() || !form.property_id) return;
    setSaving(true);
    const payload = {
      property_id: form.property_id, user_id: user.id,
      title: form.title.trim(), description: form.description.trim() || null,
      category: form.category, urgency: form.urgency, status: (editIssue?.status ?? "open") as MaintenanceStatus,
      contractor_name: form.contractor_name.trim() || null,
      contractor_phone: form.contractor_phone.trim() || null,
      contractor_email: form.contractor_email.trim() || null,
      estimated_cost: form.estimated_cost ? parseFloat(form.estimated_cost) : null,
      scheduled_date: form.scheduled_date || null,
      is_improvement: form.is_improvement,
      notes: form.notes.trim() || null,
      updated_at: new Date().toISOString(),
    };

    if (editIssue) {
      const { data } = await supabase.from("rentura_maintenance").update(payload).eq("id", editIssue.id).select().single();
      if (data) setIssues(prev => prev.map(i => i.id === editIssue.id ? data as RenturaMaintenance : i));
    } else {
      const { data } = await supabase.from("rentura_maintenance").insert({ ...payload, reported_date: new Date().toISOString().split("T")[0] }).select().single();
      if (data) {
        setIssues(prev => [data as RenturaMaintenance, ...prev]);
        // Log to events timeline
        await supabase.from("rentura_events").insert({
          property_id: form.property_id, user_id: user.id,
          event_type: "maintenance_logged",
          title: `Issue logged — ${form.title.trim()}`,
          description: `${URGENCY_CFG[form.urgency].label} · ${form.category}`,
          trust_level: "confirmed", metadata: { maintenance_id: data.id },
          event_date: new Date().toISOString().split("T")[0],
        });
      }
    }

    setShowAdd(false); setEditIssue(null);
    setForm(BLANK_FORM);
    setSaving(false);
  }

  async function updateStatus(id: string, status: MaintenanceStatus) {
    const update: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
    if (status === "resolved") update.resolved_date = new Date().toISOString().split("T")[0];
    const { data } = await supabase.from("rentura_maintenance").update(update).eq("id", id).select().single();
    if (data) {
      const issue = data as RenturaMaintenance;
      setIssues(prev => prev.map(i => i.id === id ? issue : i));
      if (status === "resolved") {
        await supabase.from("rentura_events").insert({
          property_id: issue.property_id, user_id: user!.id,
          event_type: "maintenance_resolved",
          title: `Issue resolved — ${issue.title}`,
          description: issue.actual_cost ? `Cost: £${issue.actual_cost}` : null,
          amount: issue.actual_cost, trust_level: "confirmed", metadata: {},
          event_date: new Date().toISOString().split("T")[0],
        });
      }
    }
  }

  async function logCost() {
    if (!costIssue || !costAmount) return;
    setSaving(true);
    const cost = parseFloat(costAmount);
    const { data } = await supabase.from("rentura_maintenance").update({ actual_cost: cost, is_improvement: costIsImprovement, updated_at: new Date().toISOString() }).eq("id", costIssue.id).select().single();
    if (data) {
      setIssues(prev => prev.map(i => i.id === costIssue.id ? data as RenturaMaintenance : i));
      await supabase.from("rentura_events").insert({
        property_id: costIssue.property_id, user_id: user!.id,
        event_type: "maintenance_cost",
        title: `${costIsImprovement ? "Improvement" : "Repair"} cost — ${costIssue.title}`,
        description: costIsImprovement ? "Capital improvement — not tax deductible as repair" : "Allowable repair expense",
        amount: cost, trust_level: "confirmed", metadata: { maintenance_id: costIssue.id },
        event_date: new Date().toISOString().split("T")[0],
      });
    }
    setCostIssue(null); setCostAmount(""); setCostIsImprovement(false);
    setSaving(false);
  }

  function openEdit(issue: RenturaMaintenance) {
    setForm({
      property_id: issue.property_id, title: issue.title, description: issue.description ?? "",
      category: issue.category, urgency: issue.urgency,
      contractor_name: issue.contractor_name ?? "", contractor_phone: issue.contractor_phone ?? "",
      contractor_email: issue.contractor_email ?? "", estimated_cost: issue.estimated_cost?.toString() ?? "",
      scheduled_date: issue.scheduled_date ?? "", is_improvement: issue.is_improvement, notes: issue.notes ?? "",
    });
    setEditIssue(issue);
    setShowAdd(true);
  }

  const BG = "#eceae2";
  const INK = "#111111";
  const INK2 = "rgba(17,17,17,0.52)";
  const BORDER = "rgba(17,17,17,0.09)";
  const CTA = "#0f1728";

  const inputStyle = { width: "100%", boxSizing: "border-box" as const, padding: "11px 14px", fontSize: 14, color: INK, border: `1px solid ${BORDER}`, borderRadius: 9, outline: "none", background: "#fafaf9", fontFamily: "inherit" };
  const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, color: "rgba(17,17,17,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 6 };

  const filtered = issues.filter(i => filter === "all" ? i.status !== "resolved" : i.status === filter);
  const openCount = issues.filter(i => i.status === "open").length;
  const inProgressCount = issues.filter(i => i.status === "in_progress").length;
  const emergencyCount = issues.filter(i => i.urgency === "emergency" && i.status !== "resolved").length;
  const resolvedCount = issues.filter(i => i.status === "resolved").length;
  const totalCost = issues.filter(i => i.actual_cost).reduce((s, i) => s + (i.actual_cost ?? 0), 0);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: INK2, fontSize: 14 }}>Loading maintenance…</p>
    </div>
  );

  return (
    <div style={{ fontFamily: "var(--font-family-body)", background: BG, color: INK, minHeight: "100vh", display: "flex" }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>
      <RenturaSidebar />

      <div style={{ flex: 1, overflowY: "auto" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* Header */}
        <div style={{ padding: "36px 0 28px" }}>
          <h1 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 900, letterSpacing: "-0.03em", fontFamily: "var(--font-family-heading)", marginBottom: 6 }}>
            Maintenance
          </h1>
          {emergencyCount > 0 && (
            <p style={{ fontSize: 14, color: "#b91c1c", fontWeight: 700 }}>
              ⚠ {emergencyCount} emergency issue{emergencyCount > 1 ? "s" : ""} requiring immediate attention
            </p>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 0, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, marginBottom: 28 }}>
          {[
            ["Open", openCount.toString(), openCount > 0 ? "#d97706" : undefined],
            ["In progress", inProgressCount.toString(), inProgressCount > 0 ? "#2563eb" : undefined],
            ["Resolved", resolvedCount.toString()],
            ["Total cost logged", totalCost > 0 ? "£" + totalCost.toLocaleString("en-GB") : "—"],
          ].map(([label, val, color], i, arr) => (
            <div key={label} style={{ flex: 1, padding: "16px 18px", borderRight: i < arr.length - 1 ? `1px solid ${BORDER}` : "none" }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(17,17,17,0.38)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5 }}>{label}</p>
              <p style={{ fontSize: 24, fontWeight: 900, color: (color as string | undefined) ?? INK, letterSpacing: "-0.02em" }}>{val}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {(["all", "open", "in_progress", "resolved"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "7px 16px", fontSize: 13, fontWeight: 700, borderRadius: 20, border: `1px solid ${filter === f ? CTA : BORDER}`, background: filter === f ? CTA : "white", color: filter === f ? "white" : INK2, cursor: "pointer", fontFamily: "inherit" }}>
              {f === "all" ? "Active" : f === "in_progress" ? "In progress" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Issue list */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: 32, marginBottom: 16 }}>✅</p>
            <p style={{ fontSize: 15, fontWeight: 700 }}>
              {filter === "all" ? "No open maintenance issues." : `No ${filter.replace("_", " ")} issues.`}
            </p>
            {filter === "all" && (
              <button onClick={() => { setForm(BLANK_FORM); setEditIssue(null); setShowAdd(true); }}
                style={{ marginTop: 16, background: CTA, color: "white", fontWeight: 700, fontSize: 14, padding: "10px 22px", borderRadius: 9, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                Log your first issue →
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Group by urgency when showing active */}
            {filter === "all" ? (
              (["emergency", "urgent", "routine"] as MaintenanceUrgency[]).map(urg => {
                const group = filtered.filter(i => i.urgency === urg);
                if (group.length === 0) return null;
                const cfg = URGENCY_CFG[urg];
                return (
                  <div key={urg} style={{ marginBottom: 24 }}>
                    <p style={{ fontSize: 11, fontWeight: 800, color: cfg.color, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
                      {cfg.label} — {cfg.detail}
                    </p>
                    {group.map(issue => (
                      <IssueCard key={issue.id} issue={issue}
                        propertyAddress={properties.find(p => p.id === issue.property_id)?.address ?? "Unknown"}
                        onUpdate={updateStatus} onLogCost={setCostIssue} onEdit={openEdit} />
                    ))}
                  </div>
                );
              })
            ) : (
              filtered.map(issue => (
                <IssueCard key={issue.id} issue={issue}
                  propertyAddress={properties.find(p => p.id === issue.property_id)?.address ?? "Unknown"}
                  onUpdate={updateStatus} onLogCost={setCostIssue} onEdit={openEdit} />
              ))
            )}
          </>
        )}
      </div>

      {/* ── ADD / EDIT MODAL ── */}
      {showAdd && (
        <Modal title={editIssue ? "Edit Issue" : "Log Maintenance Issue"} onClose={() => { setShowAdd(false); setEditIssue(null); setForm(BLANK_FORM); }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            <div>
              <label htmlFor="maintenance-property" style={labelStyle}>Property *</label>
              <select id="maintenance-property" value={form.property_id} onChange={e => setF("property_id", e.target.value)} style={inputStyle}>
                <option value="">Select property…</option>
                {properties.map(p => <option key={p.id} value={p.id}>{p.address.split(",")[0]}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="maintenance-issue-title" style={labelStyle}>Issue title *</label>
              <input id="maintenance-issue-title" type="text" placeholder="e.g. Boiler not heating water" value={form.title} onChange={e => setF("title", e.target.value)} style={inputStyle} />
            </div>

            <div>
              <label htmlFor="maintenance-description" style={labelStyle}>Description</label>
              <textarea id="maintenance-description" placeholder="What happened? What needs doing?" value={form.description} onChange={e => setF("description", e.target.value)}
                style={{ ...inputStyle, minHeight: 80, resize: "vertical" as const }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 12 }}>
              <div>
                <label htmlFor="maintenance-category" style={labelStyle}>Category</label>
                <select id="maintenance-category" value={form.category} onChange={e => setF("category", e.target.value as MaintenanceCategory)} style={inputStyle}>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="maintenance-urgency" style={labelStyle}>Urgency</label>
                <select id="maintenance-urgency" value={form.urgency} onChange={e => setF("urgency", e.target.value as MaintenanceUrgency)} style={inputStyle}>
                  <option value="emergency">⚠ Emergency (24h)</option>
                  <option value="urgent">◎ Urgent (7 days)</option>
                  <option value="routine">○ Routine</option>
                </select>
              </div>
            </div>

            <div style={{ background: "#fafaf9", borderRadius: 10, padding: "14px 16px" }}>
              <p style={{ ...labelStyle, marginBottom: 12 }}>Contractor</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input type="text" placeholder="Contractor name" value={form.contractor_name} onChange={e => setF("contractor_name", e.target.value)} style={inputStyle} />
                <input type="tel" placeholder="Phone number" value={form.contractor_phone} onChange={e => setF("contractor_phone", e.target.value)} style={inputStyle} />
                <input type="email" placeholder="Email (optional)" value={form.contractor_email} onChange={e => setF("contractor_email", e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 12 }}>
              <div>
                <label htmlFor="maintenance-estimated-cost" style={labelStyle}>Estimated cost (£)</label>
                <input id="maintenance-estimated-cost" type="text" placeholder="500" value={form.estimated_cost} onChange={e => setF("estimated_cost", e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label htmlFor="maintenance-scheduled-date" style={labelStyle}>Scheduled date</label>
                <input id="maintenance-scheduled-date" type="date" value={form.scheduled_date} onChange={e => setF("scheduled_date", e.target.value)} style={inputStyle} />
              </div>
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
              <input type="checkbox" checked={form.is_improvement} onChange={e => setF("is_improvement", e.target.checked)} style={{ width: 16, height: 16 }} />
              Capital improvement <span style={{ fontSize: 12, color: INK2, fontWeight: 400 }}>(not deductible as repair for tax)</span>
            </label>

            <button onClick={saveIssue} disabled={saving || !form.title.trim() || !form.property_id}
              style={{ background: CTA, color: "white", fontWeight: 800, fontSize: 15, padding: "13px 0", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit", marginTop: 4, opacity: (saving || !form.title.trim() || !form.property_id) ? 0.5 : 1 }}>
              {saving ? "Saving…" : editIssue ? "Save changes" : "Log issue"}
            </button>
          </div>
        </Modal>
      )}

      {/* ── LOG COST MODAL ── */}
      {costIssue && (
        <Modal title="Log Cost" onClose={() => { setCostIssue(null); setCostAmount(""); }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 14, color: INK2 }}>{costIssue.title}</p>
            <div>
              <label htmlFor="maintenance-actual-cost" style={labelStyle}>Actual cost (£) *</label>
              <input id="maintenance-actual-cost" type="text" placeholder="320" value={costAmount} onChange={e => setCostAmount(e.target.value)} style={inputStyle} autoFocus />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
              <input type="checkbox" checked={costIsImprovement} onChange={e => setCostIsImprovement(e.target.checked)} style={{ width: 16, height: 16 }} />
              Capital improvement <span style={{ fontSize: 12, color: INK2, fontWeight: 400 }}>(not deductible as repair)</span>
            </label>
            <div style={{ background: "rgba(37,99,235,0.05)", border: "1px solid rgba(37,99,235,0.15)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#2563eb" }}>
              This will be logged to the property timeline and counted in Tax Intelligence.
            </div>
            <button onClick={logCost} disabled={saving || !costAmount}
              style={{ background: "#16a34a", color: "white", fontWeight: 800, fontSize: 15, padding: "13px 0", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit", opacity: (saving || !costAmount) ? 0.5 : 1 }}>
              {saving ? "Saving…" : "Save cost"}
            </button>
          </div>
        </Modal>
      )}
      </div>
    </div>
  );
}
