"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { RenturaSidebar } from "@/components/rentura/RenturaSidebar";

const C = {
  bg: "#0c0f1a", card: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.07)",
  ink: "rgba(255,255,255,0.85)", ink2: "rgba(255,255,255,0.45)", ink3: "rgba(255,255,255,0.22)",
  gold: "#c9a84c", green: "#22c55e", red: "#ef4444", amber: "#f59e0b", blue: "#3b82f6",
};

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

const STATUS_COLORS: Record<string, string> = {
  active: C.green, pending: C.amber, former: C.ink3, notice: C.red,
};

function fmt(n: number | null) {
  if (!n) return "—";
  return "£" + n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const BLANK: Partial<Tenant> = {
  first_name: "", last_name: "", email: "", phone: "",
  tenancy_start: "", tenancy_end: "", monthly_rent: undefined,
  deposit_amount: undefined, deposit_held: false, status: "active",
};

export default function RenturaTenants() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Tenant>>(BLANK);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<Tenant | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "former">("all");

  useEffect(() => {
    if (!loading && !user) router.push("/rentura/auth");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("rentura_tenants").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("rentura_properties").select("id, address").eq("user_id", user.id),
    ]).then(([t, p]) => {
      setTenants(t.data || []);
      setProperties(p.data || []);
      setDataLoading(false);
    });
  }, [user]);

  async function saveTenant() {
    if (!user || !form.first_name || !form.last_name) return;
    setSaving(true);
    if (form.id) {
      const { data } = await supabase.from("rentura_tenants").update({ ...form, user_id: user.id }).eq("id", form.id).select().single();
      if (data) setTenants(ts => ts.map(t => t.id === data.id ? data : t));
    } else {
      const { data } = await supabase.from("rentura_tenants").insert({ ...form, user_id: user.id }).select().single();
      if (data) setTenants(ts => [data, ...ts]);
    }
    setSaving(false);
    setShowForm(false);
    setForm(BLANK);
    setSelected(null);
  }

  async function deleteTenant(id: string) {
    if (!confirm("Remove this tenant?")) return;
    await supabase.from("rentura_tenants").delete().eq("id", id);
    setTenants(ts => ts.filter(t => t.id !== id));
    setSelected(null);
  }

  const filtered = tenants.filter(t => filter === "all" || t.status === filter);
  const propMap = Object.fromEntries(properties.map(p => [p.id, p.address]));

  function daysLeft(dateStr: string | null) {
    if (!dateStr) return null;
    const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
    return diff;
  }

  if (loading || dataLoading) return <div style={{ background: C.bg, minHeight: "100vh", display: "flex" }}><RenturaSidebar /><div style={{ flex: 1 }} /></div>;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", fontFamily: "var(--font-family-body)", color: C.ink }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>
      <RenturaSidebar />

      <main style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Left: tenant list */}
        <div style={{ width: 340, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", overflowY: "auto" }}>
          <div style={{ padding: "28px 24px 16px", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <h1 style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em" }}>Tenants</h1>
                <p style={{ fontSize: 12, color: C.ink3, marginTop: 2 }}>{tenants.filter(t => t.status === "active").length} active</p>
              </div>
              <button onClick={() => { setForm(BLANK); setShowForm(true); setSelected(null); }} style={{ background: C.gold, color: "#0f1b36", fontWeight: 800, fontSize: 12, padding: "7px 14px", borderRadius: 7, border: "none", cursor: "pointer" }}>
                + Add
              </button>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {(["all", "active", "former"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? C.gold : C.card, color: filter === f ? "#0f1b36" : C.ink2, border: `1px solid ${filter === f ? C.gold : C.border}`, borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>{f}</button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, padding: "12px 16px", overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <p style={{ fontSize: 24, marginBottom: 8 }}>👤</p>
                <p style={{ fontSize: 13, color: C.ink3 }}>No tenants yet</p>
                <button onClick={() => { setForm(BLANK); setShowForm(true); }} style={{ marginTop: 12, background: "transparent", color: C.gold, fontWeight: 700, fontSize: 12, padding: "6px 14px", borderRadius: 7, border: `1px solid rgba(201,168,76,0.3)`, cursor: "pointer" }}>Add first tenant</button>
              </div>
            ) : filtered.map(t => {
              const end = daysLeft(t.tenancy_end ?? null);
              const isSelected = selected?.id === t.id;
              return (
                <div key={t.id} onClick={() => { setSelected(t); setShowForm(false); }} style={{ padding: "12px 14px", borderRadius: 10, marginBottom: 6, cursor: "pointer", border: `1px solid ${isSelected ? "rgba(201,168,76,0.4)" : C.border}`, background: isSelected ? "rgba(201,168,76,0.06)" : C.card }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{t.first_name} {t.last_name}</p>
                      {t.property_id && propMap[t.property_id] && (
                        <p style={{ fontSize: 11, color: C.ink3, marginTop: 2 }}>{propMap[t.property_id].split(",")[0]}</p>
                      )}
                    </div>
                    <span style={{ background: (STATUS_COLORS[t.status] || C.ink3) + "22", color: STATUS_COLORS[t.status] || C.ink3, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, textTransform: "capitalize" }}>
                      {t.status}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                    {t.monthly_rent && <span style={{ fontSize: 11, color: C.ink2 }}>{fmt(t.monthly_rent)}/mo</span>}
                    {end !== null && end > 0 && end <= 60 && (
                      <span style={{ fontSize: 11, color: end <= 30 ? C.red : C.amber }}>ends in {end}d</span>
                    )}
                    {end !== null && end <= 0 && <span style={{ fontSize: 11, color: C.red }}>tenancy ended</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: detail or form */}
        <div style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>
          {!selected && !showForm && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", flexDirection: "column", gap: 12 }}>
              <p style={{ fontSize: 32 }}>👤</p>
              <p style={{ fontSize: 14, color: C.ink3 }}>Select a tenant or add a new one</p>
            </div>
          )}

          {/* Tenant detail */}
          {selected && !showForm && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>{selected.first_name} {selected.last_name}</h2>
                  <p style={{ fontSize: 13, color: C.ink2, marginTop: 4 }}>{selected.email || "No email"} · {selected.phone || "No phone"}</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { setForm(selected); setShowForm(true); }} style={{ background: "transparent", color: C.gold, fontWeight: 700, fontSize: 12, padding: "7px 14px", borderRadius: 7, border: `1px solid rgba(201,168,76,0.3)`, cursor: "pointer" }}>Edit</button>
                  <button onClick={() => deleteTenant(selected.id)} style={{ background: "transparent", color: C.red, fontWeight: 700, fontSize: 12, padding: "7px 14px", borderRadius: 7, border: `1px solid rgba(239,68,68,0.3)`, cursor: "pointer" }}>Remove</button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
                {[
                  { label: "Monthly rent", value: fmt(selected.monthly_rent ?? null) },
                  { label: "Deposit", value: fmt(selected.deposit_amount ?? null) },
                  { label: "Deposit held", value: selected.deposit_held ? "Yes (protected)" : "No" },
                  { label: "Tenancy start", value: selected.tenancy_start ? new Date(selected.tenancy_start).toLocaleDateString("en-GB") : "—" },
                  { label: "Tenancy end", value: selected.tenancy_end ? new Date(selected.tenancy_end).toLocaleDateString("en-GB") : "Periodic" },
                  { label: "Property", value: selected.property_id ? (propMap[selected.property_id]?.split(",")[0] || "—") : "Unassigned" },
                ].map(s => (
                  <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: C.ink3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{s.label}</p>
                    <p style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <p style={{ fontSize: 11, fontWeight: 700, color: C.ink3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Quick actions</p>
              <div style={{ display: "flex", gap: 10 }}>
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
                <button
                  onClick={() => {
                    setForm({ ...selected, status: "former" });
                    saveTenant();
                  }}
                  style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 16px", fontSize: 13, color: C.ink2, cursor: "pointer" }}
                >
                  Mark as former
                </button>
              </div>
            </div>
          )}

          {/* Add / Edit form */}
          {showForm && (
            <div style={{ maxWidth: 600 }}>
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
                <Field label="Tenancy end (leave blank for periodic)">
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
                <button onClick={saveTenant} disabled={saving || !form.first_name || !form.last_name} style={{ background: C.gold, color: "#0f1b36", fontWeight: 800, fontSize: 13, padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
                  {saving ? "Saving…" : form.id ? "Save changes" : "Add tenant"}
                </button>
                <button onClick={() => { setShowForm(false); setForm(BLANK); }} style={{ background: "transparent", color: C.ink2, fontWeight: 600, fontSize: 13, padding: "10px 18px", borderRadius: 8, border: `1px solid ${C.border}`, cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 5 }}>
        {label}{required && <span style={{ color: "#ef4444", marginLeft: 2 }}>*</span>}
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
