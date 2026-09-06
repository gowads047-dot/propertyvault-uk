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
const BLUE = "#3b82f6";

type Mortgage = {
  id: string;
  property_id: string | null;
  lender: string | null;
  product_name: string | null;
  interest_rate: number | null;
  monthly_payment: number | null;
  remaining_balance: number | null;
  fixed_term_expiry: string | null;
  erc_expiry: string | null;
  svr_rate: number | null;
  is_current: boolean;
  created_at: string;
  property?: { address: string; nickname: string | null } | null;
};

type Property = { id: string; address: string; nickname: string | null };

const BLANK = {
  property_id: "",
  lender: "",
  product_name: "",
  interest_rate: "",
  monthly_payment: "",
  remaining_balance: "",
  fixed_term_expiry: "",
  erc_expiry: "",
  svr_rate: "",
  is_current: true,
};

function daysUntil(d: string | null): number | null {
  if (!d) return null;
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
}

function fmt(n: number | null, prefix = "£") {
  if (n == null) return "—";
  return prefix + n.toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function ExpiryBadge({ label, days }: { label: string; days: number | null }) {
  if (days === null) return null;
  const color = days < 0 ? RED : days <= 90 ? AMBER : GREEN;
  const bg = days < 0 ? "rgba(239,68,68,0.1)" : days <= 90 ? "rgba(245,158,11,0.1)" : "rgba(34,197,94,0.1)";
  const text = days < 0 ? `${label} expired ${Math.abs(days)}d ago` : days <= 90 ? `${label} in ${days}d` : `${label} in ${Math.round(days / 30)}mo`;
  return <span style={{ fontSize: 10, fontWeight: 700, color, background: bg, padding: "2px 8px", borderRadius: 10 }}>{text}</span>;
}

export default function MortgagesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [mortgages, setMortgages] = useState<Mortgage[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/rentura/auth"); return; }
    load();
  }, [user, authLoading]); // eslint-disable-line

  async function load() {
    const [{ data: m }, { data: p }] = await Promise.all([
      supabase.from("rentura_mortgages").select("*, property:rentura_properties(address, nickname)").eq("user_id", user!.id).order("is_current", { ascending: false }),
      supabase.from("rentura_properties").select("id, address, nickname").eq("user_id", user!.id).order("created_at"),
    ]);
    setMortgages(m || []);
    setProperties(p || []);
    setLoading(false);
  }

  function setF(k: string, v: string | boolean) { setForm(f => ({ ...f, [k]: v })); }

  function openAdd() { setForm(BLANK); setEditId(null); setShowForm(true); }
  function openEdit(m: Mortgage) {
    setForm({
      property_id: m.property_id || "",
      lender: m.lender || "",
      product_name: m.product_name || "",
      interest_rate: m.interest_rate?.toString() || "",
      monthly_payment: m.monthly_payment?.toString() || "",
      remaining_balance: m.remaining_balance?.toString() || "",
      fixed_term_expiry: m.fixed_term_expiry || "",
      erc_expiry: m.erc_expiry || "",
      svr_rate: m.svr_rate?.toString() || "",
      is_current: m.is_current,
    });
    setEditId(m.id);
    setShowForm(true);
  }

  async function save() {
    if (!user || !form.lender) return;
    setSaving(true);
    const payload = {
      user_id: user.id,
      property_id: form.property_id || null,
      lender: form.lender.trim(),
      product_name: form.product_name.trim() || null,
      interest_rate: form.interest_rate ? parseFloat(form.interest_rate as string) : null,
      monthly_payment: form.monthly_payment ? parseFloat(form.monthly_payment as string) : null,
      remaining_balance: form.remaining_balance ? parseFloat(form.remaining_balance as string) : null,
      fixed_term_expiry: form.fixed_term_expiry || null,
      erc_expiry: form.erc_expiry || null,
      svr_rate: form.svr_rate ? parseFloat(form.svr_rate as string) : null,
      is_current: form.is_current,
      trust_level: "confirmed",
    };
    if (editId) {
      await supabase.from("rentura_mortgages").update(payload).eq("id", editId);
    } else {
      await supabase.from("rentura_mortgages").insert(payload);
    }
    setShowForm(false);
    setSaving(false);
    load();
  }

  async function remove(id: string) {
    await supabase.from("rentura_mortgages").delete().eq("id", id);
    setMortgages(ms => ms.filter(m => m.id !== id));
  }

  const current = mortgages.filter(m => m.is_current);
  const totalDebt = current.reduce((s, m) => s + (m.remaining_balance || 0), 0);
  const totalPayments = current.reduce((s, m) => s + (m.monthly_payment || 0), 0);
  const avgRate = current.length > 0 ? current.reduce((s, m) => s + (m.interest_rate || 0), 0) / current.filter(m => m.interest_rate).length : 0;
  const expiringWithin90 = current.filter(m => { const d = daysUntil(m.fixed_term_expiry); return d !== null && d <= 90; }).length;

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
          <div style={{ padding: "36px 0 24px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 900, letterSpacing: "-0.03em", fontFamily: "var(--font-family-heading)", marginBottom: 6 }}>
                Mortgages
              </h1>
              <p style={{ fontSize: 14, color: INK2 }}>Track your BTL mortgage products, fixed-rate expiries, and ERC windows.</p>
            </div>
            <button onClick={openAdd} style={{ background: CTA, color: "#0f1b36", fontWeight: 800, fontSize: 13, padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer", flexShrink: 0 }}>
              + Add mortgage
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(160px, 100%), 1fr))", gap: 14, marginBottom: 32 }}>
            {[
              { label: "Total debt", value: fmt(totalDebt), color: INK },
              { label: "Monthly payments", value: fmt(totalPayments), color: RED },
              { label: "Avg. rate", value: avgRate > 0 ? `${avgRate.toFixed(2)}%` : "—", color: BLUE },
              { label: "Expiring <90 days", value: expiringWithin90.toString(), color: expiringWithin90 > 0 ? AMBER : GREEN },
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "16px 18px" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: INK3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{s.label}</p>
                <p style={{ fontSize: 20, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Mortgages */}
          {mortgages.length === 0 ? (
            <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}`, borderRadius: 16, padding: "48px 24px", textAlign: "center" }}>
              <p style={{ fontSize: 24, marginBottom: 12 }}>🏦</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: INK, marginBottom: 6 }}>No mortgages tracked yet</p>
              <p style={{ fontSize: 13, color: INK2, marginBottom: 20 }}>Add your BTL mortgage products to track fixed-rate expiries and ERC windows.</p>
              <button onClick={openAdd} style={{ background: CTA, color: "#0f1b36", fontWeight: 800, fontSize: 13, padding: "10px 22px", borderRadius: 8, border: "none", cursor: "pointer" }}>
                Add first mortgage
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {mortgages.map(m => {
                const fixedDays = daysUntil(m.fixed_term_expiry);
                const ercDays = daysUntil(m.erc_expiry);
                const isExpiringSoon = (fixedDays !== null && fixedDays <= 90) || (ercDays !== null && ercDays <= 90);
                return (
                  <div key={m.id} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${isExpiringSoon ? "rgba(245,158,11,0.25)" : BORDER}`, borderRadius: 14, padding: "18px 22px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                          <p style={{ fontSize: 15, fontWeight: 800, color: INK }}>{m.lender}</p>
                          {m.product_name && <span style={{ fontSize: 12, color: INK2 }}>{m.product_name}</span>}
                          {!m.is_current && <span style={{ fontSize: 10, fontWeight: 700, color: INK3, background: "rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: 10 }}>Historic</span>}
                          {m.property?.address && <span style={{ fontSize: 11, color: INK3 }}>🏠 {(m.property.nickname || m.property.address).split(",")[0]}</span>}
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px,1fr))", gap: "8px 20px", marginBottom: 10 }}>
                          {m.interest_rate != null && (
                            <div>
                              <p style={{ fontSize: 10, color: INK3, marginBottom: 2 }}>Rate</p>
                              <p style={{ fontSize: 14, fontWeight: 700, color: BLUE }}>{m.interest_rate}%</p>
                            </div>
                          )}
                          {m.monthly_payment != null && (
                            <div>
                              <p style={{ fontSize: 10, color: INK3, marginBottom: 2 }}>Monthly</p>
                              <p style={{ fontSize: 14, fontWeight: 700, color: INK }}>{fmt(m.monthly_payment)}</p>
                            </div>
                          )}
                          {m.remaining_balance != null && (
                            <div>
                              <p style={{ fontSize: 10, color: INK3, marginBottom: 2 }}>Balance</p>
                              <p style={{ fontSize: 14, fontWeight: 700, color: INK }}>{fmt(m.remaining_balance)}</p>
                            </div>
                          )}
                          {m.svr_rate != null && (
                            <div>
                              <p style={{ fontSize: 10, color: INK3, marginBottom: 2 }}>SVR</p>
                              <p style={{ fontSize: 14, fontWeight: 700, color: AMBER }}>{m.svr_rate}%</p>
                            </div>
                          )}
                        </div>

                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <ExpiryBadge label="Fixed rate ends" days={fixedDays} />
                          <ExpiryBadge label="ERC ends" days={ercDays} />
                          {m.fixed_term_expiry && <span style={{ fontSize: 11, color: INK3 }}>Fixed until {new Date(m.fixed_term_expiry).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</span>}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                        <button onClick={() => openEdit(m)} style={{ fontSize: 12, color: INK2, background: "rgba(255,255,255,0.06)", border: `1px solid ${BORDER}`, borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
                        <button onClick={() => remove(m.id)} style={{ fontSize: 12, color: RED, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#111827", border: `1px solid ${BORDER}`, borderRadius: 20, width: "100%", maxWidth: 540, maxHeight: "90vh", overflowY: "auto", padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>{editId ? "Edit mortgage" : "Add mortgage"}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", color: INK2, cursor: "pointer", fontSize: 20 }}>×</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {properties.length > 0 && (
                <div>
                  <label htmlFor="mortgages-property" style={labelStyle}>Property</label>
                  <select id="mortgages-property" value={form.property_id} onChange={e => setF("property_id", e.target.value)} style={inputStyle}>
                    <option value="">Portfolio-wide / unassigned</option>
                    {properties.map(p => <option key={p.id} value={p.id}>{p.nickname || p.address.split(",")[0]}</option>)}
                  </select>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 12 }}>
                <div>
                  <label htmlFor="mortgages-lender" style={labelStyle}>Lender *</label>
                  <input id="mortgages-lender" value={form.lender as string} onChange={e => setF("lender", e.target.value)} placeholder="e.g. Barclays" style={inputStyle} />
                </div>
                <div>
                  <label htmlFor="mortgages-product-name" style={labelStyle}>Product name</label>
                  <input id="mortgages-product-name" value={form.product_name as string} onChange={e => setF("product_name", e.target.value)} placeholder="e.g. 5yr fixed 4.29%" style={inputStyle} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))", gap: 12 }}>
                <div>
                  <label htmlFor="mortgages-rate" style={labelStyle}>Rate (%)</label>
                  <input id="mortgages-rate" type="number" step="0.01" value={form.interest_rate as string} onChange={e => setF("interest_rate", e.target.value)} placeholder="4.29" style={inputStyle} />
                </div>
                <div>
                  <label htmlFor="mortgages-monthly" style={labelStyle}>Monthly (£)</label>
                  <input id="mortgages-monthly" type="number" value={form.monthly_payment as string} onChange={e => setF("monthly_payment", e.target.value)} placeholder="650" style={inputStyle} />
                </div>
                <div>
                  <label htmlFor="mortgages-balance" style={labelStyle}>Balance (£)</label>
                  <input id="mortgages-balance" type="number" value={form.remaining_balance as string} onChange={e => setF("remaining_balance", e.target.value)} placeholder="125000" style={inputStyle} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 12 }}>
                <div>
                  <label htmlFor="mortgages-fixed-term-ends" style={labelStyle}>Fixed term ends</label>
                  <input id="mortgages-fixed-term-ends" type="date" value={form.fixed_term_expiry as string} onChange={e => setF("fixed_term_expiry", e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label htmlFor="mortgages-erc-window-ends" style={labelStyle}>ERC window ends</label>
                  <input id="mortgages-erc-window-ends" type="date" value={form.erc_expiry as string} onChange={e => setF("erc_expiry", e.target.value)} style={inputStyle} />
                </div>
              </div>

              <div>
                <label htmlFor="mortgages-lender-svr" style={labelStyle}>Lender SVR (%)</label>
                <input id="mortgages-lender-svr" type="number" step="0.01" value={form.svr_rate as string} onChange={e => setF("svr_rate", e.target.value)} placeholder="7.99" style={inputStyle} />
                <p style={{ fontSize: 11, color: INK3, marginTop: 4 }}>The rate you'll revert to when the fixed term ends.</p>
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                <input type="checkbox" checked={form.is_current as boolean} onChange={e => setF("is_current", e.target.checked)} style={{ width: 16, height: 16 }} />
                This is a current/active mortgage
              </label>

              <button onClick={save} disabled={saving || !(form.lender as string).trim()} style={{ background: CTA, color: "#0f1b36", fontWeight: 800, fontSize: 15, padding: "13px 0", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit", marginTop: 4, opacity: saving || !(form.lender as string).trim() ? 0.5 : 1 }}>
                {saving ? "Saving…" : editId ? "Save changes" : "Add mortgage"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
