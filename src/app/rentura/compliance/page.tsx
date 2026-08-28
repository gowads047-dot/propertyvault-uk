"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { RenturaSidebar } from "@/components/rentura/RenturaSidebar";

const BG = "#0c0f1a";
const BORDER = "rgba(255,255,255,0.08)";
const INK = "rgba(255,255,255,0.88)";
const INK2 = "rgba(255,255,255,0.5)";
const INK3 = "rgba(255,255,255,0.25)";
const CTA = "#c9a84c";
const GREEN = "#22c55e";
const RED = "#ef4444";
const AMBER = "#f59e0b";

const CERT_TYPES = [
  "Gas Safety Certificate",
  "Electrical Installation Condition Report (EICR)",
  "Energy Performance Certificate (EPC)",
  "Smoke Alarm Check",
  "Carbon Monoxide Alarm Check",
  "Legionella Risk Assessment",
  "HMO Licence",
  "Selective Licence",
  "PAT Testing",
  "Fire Risk Assessment",
  "Other",
];

type Cert = {
  id: string;
  property_id: string | null;
  certificate_type: string;
  issue_date: string | null;
  expiry_date: string | null;
  notes: string | null;
  created_at: string;
  property?: { address: string } | null;
};

type Property = { id: string; address: string; nickname: string | null };

const BLANK = {
  property_id: "",
  certificate_type: "Gas Safety Certificate",
  issue_date: "",
  expiry_date: "",
  notes: "",
};

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function StatusBadge({ days }: { days: number | null }) {
  if (days === null) return <span style={{ fontSize: 11, color: INK3 }}>No expiry</span>;
  if (days < 0) return <span style={{ fontSize: 11, fontWeight: 700, color: RED, background: "rgba(239,68,68,0.1)", padding: "2px 8px", borderRadius: 10 }}>Expired {Math.abs(days)}d ago</span>;
  if (days <= 14) return <span style={{ fontSize: 11, fontWeight: 700, color: RED, background: "rgba(239,68,68,0.1)", padding: "2px 8px", borderRadius: 10 }}>Due in {days}d</span>;
  if (days <= 45) return <span style={{ fontSize: 11, fontWeight: 700, color: AMBER, background: "rgba(245,158,11,0.1)", padding: "2px 8px", borderRadius: 10 }}>Due in {days}d</span>;
  return <span style={{ fontSize: 11, fontWeight: 700, color: GREEN, background: "rgba(34,197,94,0.1)", padding: "2px 8px", borderRadius: 10 }}>Valid — {days}d left</span>;
}

export default function CompliancePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [certs, setCerts] = useState<Cert[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<"all" | "urgent" | "expired">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/rentura/auth"); return; }
    load();
  }, [user, authLoading]); // eslint-disable-line

  async function load() {
    const [{ data: c }, { data: p }] = await Promise.all([
      supabase.from("rentura_compliance").select("*, property:rentura_properties(address)").eq("user_id", user!.id).order("expiry_date", { ascending: true, nullsFirst: false }),
      supabase.from("rentura_properties").select("id, address, nickname").eq("user_id", user!.id).order("created_at"),
    ]);
    setCerts(c || []);
    setProperties(p || []);
    setLoading(false);
  }

  function setF(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  function openAdd() { setForm(BLANK); setEditId(null); setShowForm(true); }
  function openEdit(c: Cert) {
    setForm({ property_id: c.property_id || "", certificate_type: c.certificate_type, issue_date: c.issue_date || "", expiry_date: c.expiry_date || "", notes: c.notes || "" });
    setEditId(c.id);
    setShowForm(true);
  }

  async function save() {
    if (!user || !form.certificate_type) return;
    setSaving(true);
    const payload = { user_id: user.id, property_id: form.property_id || null, certificate_type: form.certificate_type, issue_date: form.issue_date || null, expiry_date: form.expiry_date || null, notes: form.notes || null };
    if (editId) {
      await supabase.from("rentura_compliance").update(payload).eq("id", editId);
    } else {
      await supabase.from("rentura_compliance").insert(payload);
    }
    setShowForm(false);
    setSaving(false);
    load();
  }

  async function remove(id: string) {
    await supabase.from("rentura_compliance").delete().eq("id", id);
    setCerts(cs => cs.filter(c => c.id !== id));
  }

  const filtered = certs.filter(c => {
    const d = daysUntil(c.expiry_date);
    if (filter === "urgent") return d !== null && d <= 45;
    if (filter === "expired") return d !== null && d < 0;
    return true;
  });

  const urgentCount = certs.filter(c => { const d = daysUntil(c.expiry_date); return d !== null && d <= 45; }).length;
  const expiredCount = certs.filter(c => { const d = daysUntil(c.expiry_date); return d !== null && d < 0; }).length;

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
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>

          {/* Header */}
          <div style={{ padding: "36px 0 28px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 900, letterSpacing: "-0.03em", fontFamily: "var(--font-family-heading)", marginBottom: 6 }}>
                Compliance
              </h1>
              <p style={{ fontSize: 14, color: INK2 }}>Track certificates, licences, and legal obligations across your portfolio.</p>
            </div>
            <button onClick={openAdd} style={{ background: CTA, color: "#0f1b36", fontWeight: 800, fontSize: 13, padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer", flexShrink: 0 }}>
              + Add certificate
            </button>
          </div>

          {/* Summary cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))", gap: 14, marginBottom: 28 }}>
            {[
              { label: "Total certificates", value: certs.length, color: INK },
              { label: "Expiring within 45 days", value: urgentCount, color: urgentCount > 0 ? AMBER : GREEN },
              { label: "Expired / overdue", value: expiredCount, color: expiredCount > 0 ? RED : GREEN },
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "16px 18px" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: INK3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{s.label}</p>
                <p style={{ fontSize: 28, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${BORDER}`, marginBottom: 20 }}>
            {([["all", "All"], ["urgent", `Urgent (${urgentCount})`], ["expired", `Expired (${expiredCount})`]] as const).map(([k, label]) => (
              <button key={k} onClick={() => setFilter(k)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: "8px 14px", fontSize: 13, fontWeight: filter === k ? 700 : 500, color: filter === k ? CTA : INK2, borderBottom: filter === k ? `2px solid ${CTA}` : "2px solid transparent" }}>
                {label}
              </button>
            ))}
          </div>

          {/* Certificates list */}
          {filtered.length === 0 ? (
            <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}`, borderRadius: 16, padding: "48px 24px", textAlign: "center" }}>
              <p style={{ fontSize: 24, marginBottom: 12 }}>✓</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: INK, marginBottom: 6 }}>
                {filter === "all" ? "No certificates yet" : `No ${filter} certificates`}
              </p>
              <p style={{ fontSize: 13, color: INK2, marginBottom: 20 }}>
                {filter === "all" ? "Add your first compliance certificate to start tracking." : "All clear."}
              </p>
              {filter === "all" && (
                <button onClick={openAdd} style={{ background: CTA, color: "#0f1b36", fontWeight: 800, fontSize: 13, padding: "10px 22px", borderRadius: 8, border: "none", cursor: "pointer" }}>
                  Add certificate
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.map(cert => {
                const days = daysUntil(cert.expiry_date);
                const isExpired = days !== null && days < 0;
                const isUrgent = days !== null && days <= 14;
                return (
                  <div key={cert.id} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${isExpired ? "rgba(239,68,68,0.25)" : isUrgent ? "rgba(245,158,11,0.2)" : BORDER}`, borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: INK }}>{cert.certificate_type}</p>
                        <StatusBadge days={days} />
                      </div>
                      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                        {cert.property?.address && (
                          <span style={{ fontSize: 12, color: INK2 }}>🏠 {cert.property.address.split(",")[0]}</span>
                        )}
                        {cert.issue_date && (
                          <span style={{ fontSize: 12, color: INK3 }}>Issued: {new Date(cert.issue_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                        )}
                        {cert.expiry_date && (
                          <span style={{ fontSize: 12, color: isExpired ? RED : INK3 }}>Expires: {new Date(cert.expiry_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                        )}
                        {cert.notes && (
                          <span style={{ fontSize: 12, color: INK3, fontStyle: "italic" }}>{cert.notes}</span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button onClick={() => openEdit(cert)} style={{ fontSize: 12, color: INK2, background: "rgba(255,255,255,0.06)", border: `1px solid ${BORDER}`, borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontFamily: "inherit" }}>
                        Edit
                      </button>
                      <button onClick={() => remove(cert.id)} style={{ fontSize: 12, color: RED, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontFamily: "inherit" }}>
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#111827", border: `1px solid ${BORDER}`, borderRadius: 20, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>{editId ? "Edit certificate" : "Add certificate"}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", color: INK2, cursor: "pointer", fontSize: 20 }}>×</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>Certificate type *</label>
                <select value={form.certificate_type} onChange={e => setF("certificate_type", e.target.value)} style={inputStyle}>
                  {CERT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {properties.length > 0 && (
                <div>
                  <label style={labelStyle}>Property</label>
                  <select value={form.property_id} onChange={e => setF("property_id", e.target.value)} style={inputStyle}>
                    <option value="">Portfolio-wide / unassigned</option>
                    {properties.map(p => <option key={p.id} value={p.id}>{p.nickname || p.address.split(",")[0]}</option>)}
                  </select>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Issue date</label>
                  <input type="date" value={form.issue_date} onChange={e => setF("issue_date", e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Expiry date</label>
                  <input type="date" value={form.expiry_date} onChange={e => setF("expiry_date", e.target.value)} style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Notes</label>
                <textarea value={form.notes} onChange={e => setF("notes", e.target.value)} rows={2} placeholder="Contractor name, reference number, etc." style={{ ...inputStyle, resize: "vertical" }} />
              </div>

              <button onClick={save} disabled={saving || !form.certificate_type} style={{ background: CTA, color: "#0f1b36", fontWeight: 800, fontSize: 15, padding: "13px 0", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit", marginTop: 4, opacity: saving ? 0.6 : 1 }}>
                {saving ? "Saving…" : editId ? "Save changes" : "Add certificate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
