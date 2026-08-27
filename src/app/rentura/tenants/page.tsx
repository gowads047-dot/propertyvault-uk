"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { RenturaSidebar } from "@/components/rentura/RenturaSidebar";

const C = {
  bg: "#0c0f1a", card: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.07)",
  ink: "rgba(255,255,255,0.85)", ink2: "rgba(255,255,255,0.62)", ink3: "rgba(255,255,255,0.62)",
  gold: "#c9a84c", green: "#22c55e", red: "#ef4444", amber: "#f59e0b", blue: "#3b82f6",
};

// ── Types ──────────────────────────────────────────────────────────────────────
type Tenant = {
  id: string;
  property_id?: string | null;
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  tenancy_start?: string | null;
  tenancy_end?: string | null;
  monthly_rent?: number | null;
  deposit_amount?: number | null;
  deposit_held?: boolean;
  status: string;
  created_at: string;
};

type Property = { id: string; address: string };

type RtRCheck = {
  id: string;
  tenant_id: string;
  document_type: string;
  document_ref: string | null;
  check_date: string;
  time_limited: boolean;
  expiry_date: string | null;
  notes: string | null;
  created_at: string;
};

// ── Document types ─────────────────────────────────────────────────────────────
const DOC_TYPES: { value: string; label: string; timeLimited: boolean }[] = [
  { value: "uk_passport",         label: "UK Passport",                            timeLimited: false },
  { value: "irish_passport",      label: "Irish Passport",                         timeLimited: false },
  { value: "euss_settled",        label: "EU Settlement Scheme — Settled Status",  timeLimited: false },
  { value: "euss_presettled",     label: "EU Settlement Scheme — Pre-Settled",     timeLimited: true  },
  { value: "brp",                 label: "Biometric Residence Permit (BRP)",       timeLimited: true  },
  { value: "student_visa",        label: "Student Visa",                           timeLimited: true  },
  { value: "work_visa",           label: "Work Visa / Skilled Worker",             timeLimited: true  },
  { value: "family_visa",         label: "Family / Spouse Visa",                   timeLimited: true  },
  { value: "ilr",                 label: "Indefinite Leave to Remain (ILR)",       timeLimited: false },
  { value: "british_citizenship", label: "British Citizenship Certificate",        timeLimited: false },
  { value: "share_code",          label: "Online Right to Rent Share Code",        timeLimited: true  },
  { value: "other_unlimited",     label: "Other — Unlimited right to rent",        timeLimited: false },
  { value: "other_limited",       label: "Other — Time-limited right to rent",     timeLimited: true  },
];

function docLabel(value: string) {
  return DOC_TYPES.find(d => d.value === value)?.label ?? value;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  active: C.green, pending: C.amber, former: C.ink3, notice: C.red,
};

function fmt(n: number | null) {
  if (!n) return "—";
  return "£" + n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function daysFromNow(dateStr: string | null): number | null {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ── R2R status derived from latest check ──────────────────────────────────────
type RtRStatus = "valid" | "renewal_soon" | "renewal_urgent" | "expired" | "missing";

function getRtRStatus(checks: RtRCheck[]): RtRStatus {
  if (checks.length === 0) return "missing";
  const latest = checks.sort((a, b) => b.check_date.localeCompare(a.check_date))[0];
  if (!latest.time_limited || !latest.expiry_date) return "valid";
  const days = daysFromNow(latest.expiry_date);
  if (days === null) return "valid";
  if (days < 0) return "expired";
  if (days <= 28) return "renewal_urgent";
  if (days <= 90) return "renewal_soon";
  return "valid";
}

const RTR_STATUS_STYLES: Record<RtRStatus, { label: string; color: string; bg: string }> = {
  valid:          { label: "R2R ✓",      color: C.green,  bg: "rgba(34,197,94,0.12)"  },
  renewal_soon:   { label: "R2R soon",   color: C.amber,  bg: "rgba(245,158,11,0.12)" },
  renewal_urgent: { label: "R2R urgent", color: C.red,    bg: "rgba(239,68,68,0.12)"  },
  expired:        { label: "R2R expired",color: C.red,    bg: "rgba(239,68,68,0.18)"  },
  missing:        { label: "R2R needed", color: C.amber,  bg: "rgba(245,158,11,0.12)" },
};

// ── Blank forms ────────────────────────────────────────────────────────────────
const BLANK_TENANT: Partial<Tenant> = {
  first_name: "", last_name: "", email: "", phone: "",
  tenancy_start: "", tenancy_end: "", monthly_rent: undefined,
  deposit_amount: undefined, deposit_held: false, status: "active",
};

const BLANK_RTR: Partial<RtRCheck> = {
  document_type: "uk_passport",
  document_ref: "",
  check_date: new Date().toISOString().split("T")[0],
  time_limited: false,
  expiry_date: "",
  notes: "",
};

// ── Sub-components ─────────────────────────────────────────────────────────────
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.62)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 5 }}>
        {label}{required && <span style={{ color: C.red, marginLeft: 2 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inp: React.CSSProperties = {
  width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 7, padding: "9px 11px", fontSize: 13, color: "rgba(255,255,255,0.85)",
  outline: "none", boxSizing: "border-box", fontFamily: "inherit",
};

const inpSm: React.CSSProperties = { ...inp, padding: "7px 10px", fontSize: 12 };

// ── Main page ──────────────────────────────────────────────────────────────────
export default function RenturaTenants() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [rtrChecks, setRtrChecks] = useState<Record<string, RtRCheck[]>>({});
  const [dataLoading, setDataLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Tenant>>(BLANK_TENANT);
  const [saving, setSaving] = useState(false);

  const [selected, setSelected] = useState<Tenant | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "former">("all");

  // R2R panel state
  const [showRtrForm, setShowRtrForm] = useState(false);
  const [rtrForm, setRtrForm] = useState<Partial<RtRCheck>>(BLANK_RTR);
  const [savingRtr, setSavingRtr] = useState(false);
  const [rtrTab, setRtrTab] = useState<"status" | "history">("status");

  useEffect(() => {
    if (!loading && !user) router.push("/rentura/auth");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("rentura_tenants").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("rentura_properties").select("id, address").eq("user_id", user.id),
      supabase.from("rentura_right_to_rent").select("*").eq("user_id", user.id).order("check_date", { ascending: false }),
    ]).then(([t, p, rtr]) => {
      setTenants(t.data || []);
      setProperties(p.data || []);
      // Group R2R checks by tenant_id
      const grouped: Record<string, RtRCheck[]> = {};
      for (const r of (rtr.data || []) as RtRCheck[]) {
        if (!grouped[r.tenant_id]) grouped[r.tenant_id] = [];
        grouped[r.tenant_id].push(r);
      }
      setRtrChecks(grouped);
      setDataLoading(false);
    });
  }, [user]);

  // ── Tenant CRUD ──────────────────────────────────────────────────────────────
  async function saveTenant() {
    if (!user || !form.first_name || !form.last_name) return;
    setSaving(true);
    if (form.id) {
      const { data } = await supabase.from("rentura_tenants").update({ ...form, user_id: user.id }).eq("id", form.id).select().single();
      if (data) { setTenants(ts => ts.map(t => t.id === data.id ? data : t)); setSelected(data); }
    } else {
      const { data } = await supabase.from("rentura_tenants").insert({ ...form, user_id: user.id }).select().single();
      if (data) setTenants(ts => [data, ...ts]);
    }
    setSaving(false);
    setShowForm(false);
    setForm(BLANK_TENANT);
  }

  async function deleteTenant(id: string) {
    if (!confirm("Remove this tenant? This will also delete their Right to Rent checks.")) return;
    await supabase.from("rentura_tenants").delete().eq("id", id);
    setTenants(ts => ts.filter(t => t.id !== id));
    setSelected(null);
  }

  // ── R2R CRUD ─────────────────────────────────────────────────────────────────
  const saveRtr = useCallback(async () => {
    if (!user || !selected || !rtrForm.document_type || !rtrForm.check_date) return;
    setSavingRtr(true);

    const payload = {
      user_id: user.id,
      tenant_id: selected.id,
      document_type: rtrForm.document_type,
      document_ref: rtrForm.document_ref || null,
      check_date: rtrForm.check_date,
      time_limited: rtrForm.time_limited ?? false,
      expiry_date: rtrForm.time_limited && rtrForm.expiry_date ? rtrForm.expiry_date : null,
      notes: rtrForm.notes || null,
    };

    if (rtrForm.id) {
      const { data } = await supabase.from("rentura_right_to_rent").update(payload).eq("id", rtrForm.id).select().single();
      if (data) {
        setRtrChecks(prev => ({
          ...prev,
          [selected.id]: (prev[selected.id] ?? []).map(r => r.id === data.id ? data as RtRCheck : r),
        }));
      }
    } else {
      const { data } = await supabase.from("rentura_right_to_rent").insert(payload).select().single();
      if (data) {
        setRtrChecks(prev => ({
          ...prev,
          [selected.id]: [data as RtRCheck, ...(prev[selected.id] ?? [])],
        }));
      }
    }
    setSavingRtr(false);
    setShowRtrForm(false);
    setRtrForm(BLANK_RTR);
    setRtrTab("status");
  }, [user, selected, rtrForm]);

  async function deleteRtr(checkId: string, tenantId: string) {
    if (!confirm("Delete this Right to Rent check?")) return;
    await supabase.from("rentura_right_to_rent").delete().eq("id", checkId);
    setRtrChecks(prev => ({ ...prev, [tenantId]: (prev[tenantId] ?? []).filter(r => r.id !== checkId) }));
  }

  // ── Derived state ─────────────────────────────────────────────────────────────
  const filtered = tenants.filter(t => filter === "all" || t.status === filter);
  const propMap = Object.fromEntries(properties.map(p => [p.id, p.address]));

  // When document type changes, auto-set time_limited
  function handleDocTypeChange(value: string) {
    const def = DOC_TYPES.find(d => d.value === value);
    setRtrForm(f => ({ ...f, document_type: value, time_limited: def?.timeLimited ?? false, expiry_date: def?.timeLimited ? f.expiry_date : "" }));
  }

  const selectedChecks = selected ? (rtrChecks[selected.id] ?? []) : [];
  const latestCheck = selectedChecks.length > 0 ? [...selectedChecks].sort((a, b) => b.check_date.localeCompare(a.check_date))[0] : null;

  if (loading || dataLoading) return <div style={{ background: C.bg, minHeight: "100vh", display: "flex" }}><RenturaSidebar /><div style={{ flex: 1 }} /></div>;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", fontFamily: "var(--font-family-body)", color: C.ink }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>
      <RenturaSidebar />

      <main style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ── Left: tenant list ─────────────────────────────────────────────── */}
        <div style={{ width: 340, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", overflowY: "auto" }}>
          <div style={{ padding: "28px 24px 16px", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <h1 style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em" }}>Tenants</h1>
                <p style={{ fontSize: 12, color: C.ink3, marginTop: 2 }}>{tenants.filter(t => t.status === "active").length} active</p>
              </div>
              <button onClick={() => { setForm(BLANK_TENANT); setShowForm(true); setSelected(null); }}
                style={{ background: C.gold, color: "#0f1b36", fontWeight: 800, fontSize: 12, padding: "7px 14px", borderRadius: 7, border: "none", cursor: "pointer" }}>
                + Add
              </button>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {(["all", "active", "former"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ background: filter === f ? C.gold : C.card, color: filter === f ? "#0f1b36" : C.ink2, border: `1px solid ${filter === f ? C.gold : C.border}`, borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, padding: "12px 16px", overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <p style={{ fontSize: 24, marginBottom: 8 }}>👤</p>
                <p style={{ fontSize: 13, color: C.ink3 }}>No tenants yet</p>
                <button onClick={() => { setForm(BLANK_TENANT); setShowForm(true); }}
                  style={{ marginTop: 12, background: "transparent", color: C.gold, fontWeight: 700, fontSize: 12, padding: "6px 14px", borderRadius: 7, border: `1px solid rgba(201,168,76,0.3)`, cursor: "pointer" }}>
                  Add first tenant
                </button>
              </div>
            ) : filtered.map(t => {
              const end = daysFromNow(t.tenancy_end ?? null);
              const isSelected = selected?.id === t.id;
              const rtrStatus = getRtRStatus(rtrChecks[t.id] ?? []);
              const rtrStyle = RTR_STATUS_STYLES[rtrStatus];
              return (
                <div key={t.id} onClick={() => { setSelected(t); setShowForm(false); setShowRtrForm(false); setRtrTab("status"); }}
                  style={{ padding: "12px 14px", borderRadius: 10, marginBottom: 6, cursor: "pointer", border: `1px solid ${isSelected ? "rgba(201,168,76,0.4)" : C.border}`, background: isSelected ? "rgba(201,168,76,0.06)" : C.card }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{t.first_name} {t.last_name}</p>
                      {t.property_id && propMap[t.property_id] && (
                        <p style={{ fontSize: 11, color: C.ink3, marginTop: 2 }}>{propMap[t.property_id].split(",")[0]}</p>
                      )}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                      <span style={{ background: (STATUS_COLORS[t.status] || C.ink3) + "22", color: STATUS_COLORS[t.status] || C.ink3, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, textTransform: "capitalize" }}>
                        {t.status}
                      </span>
                      {t.status === "active" && (
                        <span style={{ background: rtrStyle.bg, color: rtrStyle.color, fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 10 }}>
                          {rtrStyle.label}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                    {t.monthly_rent && <span style={{ fontSize: 11, color: C.ink2 }}>{fmt(t.monthly_rent)}/mo</span>}
                    {end !== null && end > 0 && end <= 60 && <span style={{ fontSize: 11, color: end <= 30 ? C.red : C.amber }}>ends in {end}d</span>}
                    {end !== null && end <= 0 && <span style={{ fontSize: 11, color: C.red }}>tenancy ended</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right: detail / form ─────────────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {!selected && !showForm && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", flexDirection: "column", gap: 12 }}>
              <p style={{ fontSize: 32 }}>👤</p>
              <p style={{ fontSize: 14, color: C.ink3 }}>Select a tenant or add a new one</p>
            </div>
          )}

          {/* ── Tenant detail ──────────────────────────────────────────────── */}
          {selected && !showForm && (
            <div style={{ padding: "32px 36px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>{selected.first_name} {selected.last_name}</h2>
                  <p style={{ fontSize: 13, color: C.ink2, marginTop: 4 }}>{selected.email || "No email"} · {selected.phone || "No phone"}</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { setForm(selected); setShowForm(true); }}
                    style={{ background: "transparent", color: C.gold, fontWeight: 700, fontSize: 12, padding: "7px 14px", borderRadius: 7, border: `1px solid rgba(201,168,76,0.3)`, cursor: "pointer" }}>Edit</button>
                  <button onClick={() => deleteTenant(selected.id)}
                    style={{ background: "transparent", color: C.red, fontWeight: 700, fontSize: 12, padding: "7px 14px", borderRadius: 7, border: `1px solid rgba(239,68,68,0.3)`, cursor: "pointer" }}>Remove</button>
                </div>
              </div>

              {/* Stats grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
                {[
                  { label: "Monthly rent",  value: fmt(selected.monthly_rent ?? null) },
                  { label: "Deposit",        value: fmt(selected.deposit_amount ?? null) },
                  { label: "Deposit held",   value: selected.deposit_held ? "Yes (protected)" : "No" },
                  { label: "Tenancy start",  value: fmtDate(selected.tenancy_start ?? null) },
                  { label: "Tenancy end",    value: selected.tenancy_end ? fmtDate(selected.tenancy_end) : "Periodic" },
                  { label: "Property",       value: selected.property_id ? (propMap[selected.property_id]?.split(",")[0] || "—") : "Unassigned" },
                ].map(s => (
                  <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: C.ink3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{s.label}</p>
                    <p style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <p style={{ fontSize: 11, fontWeight: 700, color: C.ink3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Quick actions</p>
              <div style={{ display: "flex", gap: 10, marginBottom: 32 }}>
                {selected.email && (
                  <a href={`mailto:${selected.email}`} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 16px", fontSize: 13, color: C.ink2, textDecoration: "none" }}>
                    ✉ Email tenant
                  </a>
                )}
                {selected.phone && (
                  <a href={`tel:${selected.phone}`} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 16px", fontSize: 13, color: C.ink2, textDecoration: "none" }}>
                    📞 Call tenant
                  </a>
                )}
              </div>

              {/* ── Right to Rent section ────────────────────────────────── */}
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 800, color: C.ink }}>Right to Rent</p>
                    <p style={{ fontSize: 12, color: C.ink3, marginTop: 2 }}>
                      Legal check required before tenancy starts · Fines up to £20,000 per occupant
                    </p>
                  </div>
                  <button onClick={() => { setRtrForm({ ...BLANK_RTR, check_date: new Date().toISOString().split("T")[0] }); setShowRtrForm(true); }}
                    style={{ background: C.blue, color: "white", fontWeight: 700, fontSize: 12, padding: "7px 14px", borderRadius: 7, border: "none", cursor: "pointer", flexShrink: 0 }}>
                    + Log check
                  </button>
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${C.border}`, marginBottom: 20 }}>
                  {(["status", "history"] as const).map(tab => (
                    <button key={tab} onClick={() => setRtrTab(tab)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: "8px 18px", fontSize: 12, fontWeight: rtrTab === tab ? 700 : 500, color: rtrTab === tab ? C.gold : C.ink3, borderBottom: rtrTab === tab ? `2px solid ${C.gold}` : "2px solid transparent", textTransform: "capitalize" }}>
                      {tab} {tab === "history" && selectedChecks.length > 0 ? `(${selectedChecks.length})` : ""}
                    </button>
                  ))}
                </div>

                {/* Status tab */}
                {rtrTab === "status" && !showRtrForm && (
                  <RtRStatusPanel
                    checks={selectedChecks}
                    latestCheck={latestCheck}
                    onEdit={(c) => { setRtrForm(c); setShowRtrForm(true); }}
                    onLogNew={() => { setRtrForm({ ...BLANK_RTR, check_date: new Date().toISOString().split("T")[0] }); setShowRtrForm(true); }}
                  />
                )}

                {/* History tab */}
                {rtrTab === "history" && !showRtrForm && (
                  <RtRHistory
                    checks={selectedChecks}
                    tenantId={selected.id}
                    onEdit={(c) => { setRtrForm(c); setShowRtrForm(true); setRtrTab("status"); }}
                    onDelete={(id) => deleteRtr(id, selected.id)}
                  />
                )}

                {/* R2R form */}
                {showRtrForm && (
                  <RtRForm
                    form={rtrForm}
                    setForm={setRtrForm}
                    onDocTypeChange={handleDocTypeChange}
                    onSave={saveRtr}
                    onCancel={() => { setShowRtrForm(false); setRtrForm(BLANK_RTR); }}
                    saving={savingRtr}
                  />
                )}
              </div>
            </div>
          )}

          {/* ── Add / Edit tenant form ─────────────────────────────────────── */}
          {showForm && (
            <div style={{ padding: "32px 36px", maxWidth: 640 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 24 }}>
                {form.id ? "Edit tenant" : "Add tenant"}
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <Field label="First name" required>
                  <input value={form.first_name || ""} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} placeholder="James" style={inp} />
                </Field>
                <Field label="Last name" required>
                  <input value={form.last_name || ""} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} placeholder="Parker" style={inp} />
                </Field>
                <Field label="Email">
                  <input type="email" value={form.email || ""} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="james@email.com" style={inp} />
                </Field>
                <Field label="Phone">
                  <input value={form.phone || ""} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+44 7700 000000" style={inp} />
                </Field>
                <Field label="Monthly rent (£)">
                  <input type="number" value={form.monthly_rent || ""} onChange={e => setForm(f => ({ ...f, monthly_rent: parseFloat(e.target.value) || undefined }))} placeholder="950" style={inp} />
                </Field>
                <Field label="Deposit (£)">
                  <input type="number" value={form.deposit_amount || ""} onChange={e => setForm(f => ({ ...f, deposit_amount: parseFloat(e.target.value) || undefined }))} placeholder="1900" style={inp} />
                </Field>
                <Field label="Tenancy start">
                  <input type="date" value={form.tenancy_start || ""} onChange={e => setForm(f => ({ ...f, tenancy_start: e.target.value }))} style={inp} />
                </Field>
                <Field label="Tenancy end (blank = periodic)">
                  <input type="date" value={form.tenancy_end || ""} onChange={e => setForm(f => ({ ...f, tenancy_end: e.target.value }))} style={inp} />
                </Field>
                <Field label="Property">
                  <select value={form.property_id || ""} onChange={e => setForm(f => ({ ...f, property_id: e.target.value }))} style={inp}>
                    <option value="">Unassigned</option>
                    {properties.map(p => <option key={p.id} value={p.id}>{p.address.split(",")[0]}</option>)}
                  </select>
                </Field>
                <Field label="Status">
                  <select value={form.status || "active"} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={inp}>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="notice">Notice</option>
                    <option value="former">Former</option>
                  </select>
                </Field>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                <input type="checkbox" id="dep" checked={!!form.deposit_held} onChange={e => setForm(f => ({ ...f, deposit_held: e.target.checked }))} />
                <label htmlFor="dep" style={{ fontSize: 13, color: C.ink2 }}>Deposit protected in government scheme</label>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={saveTenant} disabled={saving || !form.first_name || !form.last_name}
                  style={{ background: C.gold, color: "#0f1b36", fontWeight: 800, fontSize: 13, padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
                  {saving ? "Saving…" : form.id ? "Save changes" : "Add tenant"}
                </button>
                <button onClick={() => { setShowForm(false); setForm(BLANK_TENANT); }}
                  style={{ background: "transparent", color: C.ink2, fontWeight: 600, fontSize: 13, padding: "10px 18px", borderRadius: 8, border: `1px solid ${C.border}`, cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ── R2R Status Panel ───────────────────────────────────────────────────────────
function RtRStatusPanel({ checks, latestCheck, onEdit, onLogNew }: {
  checks: RtRCheck[];
  latestCheck: RtRCheck | null;
  onEdit: (c: RtRCheck) => void;
  onLogNew: () => void;
}) {
  const status = getRtRStatus(checks);
  const style = RTR_STATUS_STYLES[status];

  if (!latestCheck) {
    return (
      <div style={{ padding: "24px", background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 12 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: C.amber, marginBottom: 6 }}>No Right to Rent check logged</p>
        <p style={{ fontSize: 13, color: C.ink2, lineHeight: 1.6, marginBottom: 16 }}>
          You must check a tenant&apos;s right to rent in England before the tenancy starts. Failure to do so can result in a fine of up to £20,000 per tenant.
        </p>
        <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 8, marginBottom: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 6 }}>What to check:</p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {["Verify the document is genuine and belongs to the tenant", "Check the tenant is allowed to rent (unlimited or time-limited)", "Copy both sides of the document and keep securely", "For time-limited right to rent, schedule a follow-up check before expiry"].map((item, i) => (
              <li key={i} style={{ fontSize: 12, color: C.ink2, padding: "3px 0", display: "flex", gap: 8 }}>
                <span style={{ color: C.amber }}>•</span>{item}
              </li>
            ))}
          </ul>
        </div>
        <button onClick={onLogNew} style={{ background: C.blue, color: "white", fontWeight: 700, fontSize: 13, padding: "9px 18px", borderRadius: 8, border: "none", cursor: "pointer" }}>
          Log Right to Rent check →
        </button>
      </div>
    );
  }

  const days = latestCheck.time_limited ? daysFromNow(latestCheck.expiry_date) : null;
  const needsRenewal = days !== null && days <= 90;

  return (
    <div>
      {/* Status banner */}
      <div style={{ padding: "16px 20px", background: `${style.color}10`, border: `1px solid ${style.color}30`, borderRadius: 12, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 16 }}>
              {status === "valid" ? "✓" : status === "missing" ? "⚠" : "⚠"}
            </span>
            <p style={{ fontSize: 13, fontWeight: 800, color: style.color }}>
              {status === "valid" ? "Right to Rent confirmed" :
               status === "renewal_soon" ? "Renewal check due within 90 days" :
               status === "renewal_urgent" ? "Renewal check urgent — due within 28 days" :
               status === "expired" ? "Right to Rent has expired — check required NOW" :
               "No check recorded"}
            </p>
          </div>
          {days !== null && (
            <p style={{ fontSize: 12, color: style.color, fontWeight: 600 }}>
              {days < 0 ? `Expired ${Math.abs(days)} days ago` : `Expires in ${days} days — ${fmtDate(latestCheck.expiry_date)}`}
            </p>
          )}
        </div>
        <button onClick={() => onEdit(latestCheck)} style={{ background: "rgba(255,255,255,0.05)", color: C.ink2, fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 6, border: `1px solid ${C.border}`, cursor: "pointer" }}>
          Edit →
        </button>
      </div>

      {/* Current check details */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Document type", value: docLabel(latestCheck.document_type) },
          { label: "Document ref.", value: latestCheck.document_ref || "Not recorded" },
          { label: "Check performed", value: fmtDate(latestCheck.check_date) },
          { label: "Right to rent type", value: latestCheck.time_limited ? "Time-limited" : "Unlimited" },
          ...(latestCheck.time_limited ? [{ label: "Permission expires", value: fmtDate(latestCheck.expiry_date) }] : []),
          ...(latestCheck.notes ? [{ label: "Notes", value: latestCheck.notes }] : []),
        ].map(s => (
          <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.ink3, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>{s.label}</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: C.ink, lineHeight: 1.4 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Renewal action box */}
      {needsRenewal && (
        <div style={{ padding: "14px 18px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: C.red, marginBottom: 6 }}>
            Follow-up check required
          </p>
          <p style={{ fontSize: 12, color: C.ink2, lineHeight: 1.6, marginBottom: 12 }}>
            This tenant has a time-limited right to rent. You must carry out a follow-up check before their permission expires. Keep a copy of the new document and log the check here.
          </p>
          <div style={{ padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 8, marginBottom: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.ink, marginBottom: 4 }}>HMRC Right to Rent online check:</p>
            <p style={{ fontSize: 11, color: C.blue }}>gov.uk/landlord-immigration-check</p>
          </div>
          <button onClick={onLogNew} style={{ background: C.red, color: "white", fontWeight: 700, fontSize: 12, padding: "8px 16px", borderRadius: 7, border: "none", cursor: "pointer" }}>
            Log renewal check →
          </button>
        </div>
      )}

      {/* Legal reference */}
      <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.02)", borderRadius: 9, border: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: C.ink3, marginBottom: 6 }}>Legal reference</p>
        <p style={{ fontSize: 11, color: C.ink3, lineHeight: 1.6 }}>
          Immigration Act 2014 (as amended by the Immigration Act 2016). Landlords in England must verify all adult occupants&apos; right to rent before tenancy commences, and carry out follow-up checks for time-limited rights. Civil penalty: up to £20,000 per occupant; criminal offence if knowingly letting to illegal immigrants.
        </p>
      </div>
    </div>
  );
}

// ── R2R History Panel ──────────────────────────────────────────────────────────
function RtRHistory({ checks, tenantId, onEdit, onDelete }: {
  checks: RtRCheck[];
  tenantId: string;
  onEdit: (c: RtRCheck) => void;
  onDelete: (id: string) => void;
}) {
  void tenantId;
  if (checks.length === 0) {
    return <p style={{ fontSize: 13, color: C.ink3, padding: "20px 0" }}>No checks logged yet.</p>;
  }
  const sorted = [...checks].sort((a, b) => b.check_date.localeCompare(a.check_date));
  return (
    <div>
      {sorted.map((c, i) => {
        const days = c.time_limited ? daysFromNow(c.expiry_date) : null;
        const isLatest = i === 0;
        return (
          <div key={c.id} style={{ padding: "14px 16px", background: C.card, border: `1px solid ${isLatest ? "rgba(201,168,76,0.3)" : C.border}`, borderRadius: 10, marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{docLabel(c.document_type)}</p>
                  {isLatest && <span style={{ fontSize: 10, background: "rgba(201,168,76,0.15)", color: C.gold, padding: "1px 7px", borderRadius: 10, fontWeight: 700 }}>Latest</span>}
                  <span style={{ fontSize: 10, background: c.time_limited ? "rgba(245,158,11,0.1)" : "rgba(34,197,94,0.1)", color: c.time_limited ? C.amber : C.green, padding: "1px 7px", borderRadius: 10, fontWeight: 700 }}>
                    {c.time_limited ? "Time-limited" : "Unlimited"}
                  </span>
                </div>
                <p style={{ fontSize: 11, color: C.ink3, marginTop: 3 }}>Check performed: {fmtDate(c.check_date)}</p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => onEdit(c)} style={{ fontSize: 11, color: C.ink3, background: "transparent", border: `1px solid ${C.border}`, borderRadius: 5, padding: "3px 9px", cursor: "pointer" }}>Edit</button>
                <button onClick={() => onDelete(c.id)} style={{ fontSize: 11, color: C.red, background: "transparent", border: `1px solid rgba(239,68,68,0.3)`, borderRadius: 5, padding: "3px 9px", cursor: "pointer" }}>Del</button>
              </div>
            </div>
            {c.document_ref && <p style={{ fontSize: 11, color: C.ink2 }}>Ref: {c.document_ref}</p>}
            {c.time_limited && c.expiry_date && (
              <p style={{ fontSize: 11, color: days !== null && days < 28 ? C.red : days !== null && days < 90 ? C.amber : C.green, marginTop: 4 }}>
                Expires: {fmtDate(c.expiry_date)}{days !== null ? ` (${days < 0 ? `${Math.abs(days)}d ago` : `in ${days}d`})` : ""}
              </p>
            )}
            {c.notes && <p style={{ fontSize: 11, color: C.ink3, marginTop: 6, fontStyle: "italic" }}>{c.notes}</p>}
          </div>
        );
      })}
    </div>
  );
}

// ── R2R Form ───────────────────────────────────────────────────────────────────
function RtRForm({ form, setForm, onDocTypeChange, onSave, onCancel, saving }: {
  form: Partial<RtRCheck>;
  setForm: React.Dispatch<React.SetStateAction<Partial<RtRCheck>>>;
  onDocTypeChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 22px" }}>
      <p style={{ fontSize: 14, fontWeight: 800, color: C.ink, marginBottom: 18 }}>
        {form.id ? "Edit R2R check" : "Log Right to Rent check"}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: C.ink3, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 5 }}>Document type *</label>
          <select value={form.document_type || "uk_passport"} onChange={e => onDocTypeChange(e.target.value)} style={inpSm}>
            {DOC_TYPES.map(d => <option key={d.value} value={d.value}>{d.label}{d.timeLimited ? " ⏱" : ""}</option>)}
          </select>
        </div>

        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: C.ink3, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 5 }}>Check date *</label>
          <input type="date" value={form.check_date || ""} onChange={e => setForm(f => ({ ...f, check_date: e.target.value }))} style={inpSm} />
        </div>

        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: C.ink3, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 5 }}>Document ref. (optional)</label>
          <input value={form.document_ref || ""} onChange={e => setForm(f => ({ ...f, document_ref: e.target.value }))} placeholder="Last 4 digits / BRP ref" style={inpSm} />
        </div>

        {/* Time-limited toggle */}
        <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 10 }}>
          <input type="checkbox" id="timelimited" checked={!!form.time_limited} onChange={e => setForm(f => ({ ...f, time_limited: e.target.checked, expiry_date: e.target.checked ? f.expiry_date : "" }))} />
          <label htmlFor="timelimited" style={{ fontSize: 13, color: C.ink2 }}>Time-limited right to rent (visa expires)</label>
        </div>

        {form.time_limited && (
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: C.red, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 5 }}>Permission / visa expiry date *</label>
            <input type="date" value={form.expiry_date || ""} onChange={e => setForm(f => ({ ...f, expiry_date: e.target.value }))} style={{ ...inpSm, borderColor: "rgba(239,68,68,0.3)" }} />
            <p style={{ fontSize: 11, color: C.ink3, marginTop: 5 }}>
              You must carry out a follow-up check before this date. We will alert you at 90 days and 28 days before expiry.
            </p>
          </div>
        )}

        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: C.ink3, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 5 }}>Notes (optional)</label>
          <textarea value={form.notes || ""} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="e.g. Document verified in person, copy filed in docs folder" rows={2} style={{ ...inpSm, resize: "vertical" }} />
        </div>
      </div>

      <div style={{ padding: "10px 14px", background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 8, marginBottom: 16 }}>
        <p style={{ fontSize: 11, color: C.blue, lineHeight: 1.6 }}>
          <strong>Reminder:</strong> Keep a copy of the document (both sides for ID documents, front page for passports). Store securely in line with GDPR — do not retain longer than tenancy + 1 year.
        </p>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onSave} disabled={saving || !form.check_date || !form.document_type || (!!form.time_limited && !form.expiry_date)}
          style={{ background: C.blue, color: "white", fontWeight: 700, fontSize: 13, padding: "9px 20px", borderRadius: 8, border: "none", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
          {saving ? "Saving…" : form.id ? "Save changes" : "Log check"}
        </button>
        <button onClick={onCancel}
          style={{ background: "transparent", color: C.ink2, fontWeight: 600, fontSize: 13, padding: "9px 18px", borderRadius: 8, border: `1px solid ${C.border}`, cursor: "pointer" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
