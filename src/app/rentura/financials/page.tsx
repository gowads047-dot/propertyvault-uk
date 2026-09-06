"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { RenturaSidebar } from "@/components/rentura/RenturaSidebar";

const C = {
  bg: "#0c0f1a", card: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.07)",
  ink: "rgba(255,255,255,0.85)", ink2: "rgba(255,255,255,0.62)", ink3: "rgba(255,255,255,0.62)",
  gold: "#c9a84c", green: "#22c55e", red: "#ef4444", amber: "#f59e0b",
};

type Expense = { id: string; category: string; description: string; amount: number; date: string; property_id: string | null };
type Income = { id: string; amount: number; type: string; date: string; property_id: string | null; notes: string | null };
type Property = { id: string; address: string };

const EXP_CATS = ["mortgage", "insurance", "maintenance", "management", "utilities", "council_tax", "compliance", "professional_fees", "other"] as const;

function fmt(n: number) { return "£" + n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

function getTaxYearStartFor(date: Date): number {
  const m = date.getMonth(); // 0-indexed
  const d = date.getDate();
  return (m > 3 || (m === 3 && d >= 6)) ? date.getFullYear() : date.getFullYear() - 1;
}

function taxYearLabel(startYear: number) { return `${startYear}/${String(startYear + 1).slice(2)}`; }
function taxYearRange(startYear: number) { return { start: `${startYear}-04-06`, end: `${startYear + 1}-04-05` }; }

const CURRENT_TAX_YEAR_START = getTaxYearStartFor(new Date());
const TAX_YEAR_OPTIONS = [2022, 2023, 2024, 2025, 2026].map(y => ({ value: y, label: taxYearLabel(y) }));

export default function RenturaFinancials() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"overview" | "income" | "expenses">("overview");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [taxYearStart, setTaxYearStart] = useState(CURRENT_TAX_YEAR_START);

  // Add expense form
  const [expForm, setExpForm] = useState({ category: "maintenance", description: "", amount: "", date: new Date().toISOString().slice(0, 10), property_id: "" });
  const [incForm, setIncForm] = useState({ amount: "", type: "rent", date: new Date().toISOString().slice(0, 10), property_id: "", notes: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/rentura/auth");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("rentura_properties").select("id, address").eq("user_id", user.id),
      supabase.from("rentura_expenses").select("*").eq("user_id", user.id).order("date", { ascending: false }),
      supabase.from("rentura_income").select("*").eq("user_id", user.id).order("date", { ascending: false }),
    ]).then(([props, exps, inc]) => {
      setProperties(props.data || []);
      setExpenses(exps.data || []);
      setIncome(inc.data || []);
      setDataLoading(false);
    });
  }, [user]);

  const { start: tyStart, end: tyEnd } = taxYearRange(taxYearStart);
  const tyLabel = taxYearLabel(taxYearStart);
  const filteredExp = expenses.filter(e => e.date >= tyStart && e.date <= tyEnd);
  const filteredInc = income.filter(i => i.date >= tyStart && i.date <= tyEnd);
  const totalIncome = filteredInc.reduce((s, i) => s + (i.amount || 0), 0);
  const totalExpenses = filteredExp.reduce((s, e) => s + (e.amount || 0), 0);
  const netProfit = totalIncome - totalExpenses;

  // By category
  const expByCategory = EXP_CATS.map(cat => ({
    cat,
    total: filteredExp.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter(x => x.total > 0).sort((a, b) => b.total - a.total);

  async function addExpense() {
    if (!user || !expForm.description || !expForm.amount) return;
    setSaving(true);
    const { data } = await supabase.from("rentura_expenses").insert({
      user_id: user.id,
      category: expForm.category,
      description: expForm.description,
      amount: parseFloat(expForm.amount),
      date: expForm.date,
      property_id: expForm.property_id || null,
      tax_year: taxYearLabel(getTaxYearStartFor(new Date(expForm.date))),
    }).select().single();
    if (data) setExpenses(prev => [data, ...prev]);
    setExpForm(f => ({ ...f, description: "", amount: "" }));
    setSaving(false);
  }

  async function addIncome() {
    if (!user || !incForm.amount) return;
    setSaving(true);
    const { data } = await supabase.from("rentura_income").insert({
      user_id: user.id,
      amount: parseFloat(incForm.amount),
      type: incForm.type,
      date: incForm.date,
      property_id: incForm.property_id || null,
      notes: incForm.notes || null,
    }).select().single();
    if (data) setIncome(prev => [data, ...prev]);
    setIncForm(f => ({ ...f, amount: "", notes: "" }));
    setSaving(false);
  }

  if (loading || dataLoading) return <div style={{ background: C.bg, minHeight: "100vh", display: "flex" }}><RenturaSidebar /><div style={{ flex: 1 }} /></div>;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", fontFamily: "var(--font-family-body)", color: C.ink }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>
      <RenturaSidebar />

      <main style={{ flex: 1, padding: "36px 40px", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 4 }}>Financials</h1>
            <p style={{ fontSize: 13, color: C.ink2 }}>Income, expenses and profitability</p>
          </div>
          <select value={taxYearStart} onChange={e => setTaxYearStart(parseInt(e.target.value))} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 14px", fontSize: 13, color: C.ink, outline: "none" }}>
            {TAX_YEAR_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))", gap: 14, marginBottom: 28 }}>
          {[
            { label: "Total income", value: fmt(totalIncome), color: C.green, sub: `${filteredInc.length} transactions` },
            { label: "Total expenses", value: fmt(totalExpenses), color: C.red, sub: `${filteredExp.length} transactions` },
            { label: "Net profit", value: fmt(netProfit), color: netProfit >= 0 ? C.green : C.red, sub: netProfit >= 0 ? "Positive" : "Negative" },
          ].map(s => (
            <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px 22px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: C.ink3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{s.label}</p>
              <p style={{ fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: 4 }}>{s.value}</p>
              <p style={{ fontSize: 11, color: C.ink3 }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: `1px solid ${C.border}` }}>
          {(["overview", "income", "expenses"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
              padding: "8px 16px", fontSize: 13, fontWeight: tab === t ? 700 : 500,
              color: tab === t ? C.gold : C.ink2,
              borderBottom: tab === t ? `2px solid ${C.gold}` : "2px solid transparent",
              textTransform: "capitalize",
            }}>{t}</button>
          ))}
        </div>

        {/* Overview tab */}
        {tab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 20 }}>
            {/* Expense breakdown */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "22px 24px" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 18 }}>Expense breakdown {tyLabel}</p>
              {expByCategory.length === 0 ? (
                <p style={{ fontSize: 13, color: C.ink3 }}>No expenses recorded for {tyLabel}.</p>
              ) : expByCategory.map(({ cat, total }) => (
                <div key={cat} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: C.ink2, textTransform: "capitalize" }}>{cat.replace(/_/g, " ")}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.ink }}>{fmt(total)}</span>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${Math.min(100, (total / totalExpenses) * 100)}%`, background: C.amber, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Monthly income vs expenses */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "22px 24px" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 18 }}>Monthly overview</p>
              {Array.from({ length: 12 }, (_, i) => {
                // Tax year starts April (month index 3) — iterate Apr→Mar
                const calMonth = (3 + i) % 12; // 0-indexed: 3=Apr,4=May…11=Dec,0=Jan,1=Feb,2=Mar
                const calYear = calMonth < 3 ? taxYearStart + 1 : taxYearStart;
                const prefix = `${calYear}-${String(calMonth + 1).padStart(2, "0")}`;
                const inc = filteredInc.filter(x => x.date?.startsWith(prefix)).reduce((s, x) => s + x.amount, 0);
                const exp = filteredExp.filter(x => x.date?.startsWith(prefix)).reduce((s, x) => s + x.amount, 0);
                const name = new Date(calYear, calMonth, 1).toLocaleString("en-GB", { month: "short" });
                if (inc === 0 && exp === 0) return null;
                return (
                  <div key={prefix} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: C.ink3, width: 28, flexShrink: 0 }}>{name}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ height: 5, background: "rgba(34,197,94,0.2)", borderRadius: 2, marginBottom: 3 }}>
                        <div style={{ height: "100%", width: `${Math.min(100, (inc / (totalIncome || 1)) * 100)}%`, background: C.green, borderRadius: 2 }} />
                      </div>
                      <div style={{ height: 5, background: "rgba(239,68,68,0.2)", borderRadius: 2 }}>
                        <div style={{ height: "100%", width: `${Math.min(100, (exp / (totalExpenses || 1)) * 100)}%`, background: C.red, borderRadius: 2 }} />
                      </div>
                    </div>
                    <span style={{ fontSize: 10, color: C.green, width: 70, textAlign: "right" }}>{inc > 0 ? fmt(inc) : ""}</span>
                  </div>
                );
              })}
              <div style={{ display: "flex", gap: 14, marginTop: 12 }}>
                <span style={{ fontSize: 10, color: C.green }}>■ Income</span>
                <span style={{ fontSize: 10, color: C.red }}>■ Expenses</span>
              </div>
            </div>
          </div>
        )}

        {/* Income tab */}
        {tab === "income" && (
          <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 24 }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "22px 24px", alignSelf: "start" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 18 }}>Log income</p>
              <FormRow label="Amount (£)"><input type="number" value={incForm.amount} onChange={e => setIncForm(f => ({ ...f, amount: e.target.value }))} placeholder="1200" style={inputStyle} /></FormRow>
              <FormRow label="Type">
                <select value={incForm.type} onChange={e => setIncForm(f => ({ ...f, type: e.target.value }))} style={inputStyle}>
                  <option value="rent">Rent</option>
                  <option value="deposit">Deposit</option>
                  <option value="other">Other</option>
                </select>
              </FormRow>
              <FormRow label="Date"><input type="date" value={incForm.date} onChange={e => setIncForm(f => ({ ...f, date: e.target.value }))} style={inputStyle} /></FormRow>
              <FormRow label="Property">
                <select value={incForm.property_id} onChange={e => setIncForm(f => ({ ...f, property_id: e.target.value }))} style={inputStyle}>
                  <option value="">Unassigned</option>
                  {properties.map(p => <option key={p.id} value={p.id}>{p.address.split(",")[0]}</option>)}
                </select>
              </FormRow>
              <FormRow label="Notes"><input value={incForm.notes} onChange={e => setIncForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional note" style={inputStyle} /></FormRow>
              <button onClick={addIncome} disabled={saving || !incForm.amount} style={{ width: "100%", background: C.green, color: "white", fontWeight: 800, fontSize: 13, padding: "10px", borderRadius: 8, border: "none", cursor: "pointer", marginTop: 4, opacity: saving ? 0.6 : 1 }}>
                + Log income
              </button>
            </div>
            <div>
              {filteredInc.length === 0 ? (
                <p style={{ color: C.ink3, fontSize: 13 }}>No income recorded for {tyLabel}.</p>
              ) : filteredInc.map(inc => (
                <div key={inc.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", marginBottom: 8 }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{inc.notes || inc.type.charAt(0).toUpperCase() + inc.type.slice(1)}</p>
                    <p style={{ fontSize: 11, color: C.ink3 }}>{new Date(inc.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} · {inc.type}</p>
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 800, color: C.green }}>{fmt(inc.amount)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expenses tab */}
        {tab === "expenses" && (
          <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 24 }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "22px 24px", alignSelf: "start" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 18 }}>Log expense</p>
              <FormRow label="Category">
                <select value={expForm.category} onChange={e => setExpForm(f => ({ ...f, category: e.target.value }))} style={inputStyle}>
                  {EXP_CATS.map(c => <option key={c} value={c}>{c.replace(/_/g, " ").replace(/\b\w/g, x => x.toUpperCase())}</option>)}
                </select>
              </FormRow>
              <FormRow label="Description"><input value={expForm.description} onChange={e => setExpForm(f => ({ ...f, description: e.target.value }))} placeholder="e.g. Boiler repair" style={inputStyle} /></FormRow>
              <FormRow label="Amount (£)"><input type="number" value={expForm.amount} onChange={e => setExpForm(f => ({ ...f, amount: e.target.value }))} placeholder="450" style={inputStyle} /></FormRow>
              <FormRow label="Date"><input type="date" value={expForm.date} onChange={e => setExpForm(f => ({ ...f, date: e.target.value }))} style={inputStyle} /></FormRow>
              <FormRow label="Property">
                <select value={expForm.property_id} onChange={e => setExpForm(f => ({ ...f, property_id: e.target.value }))} style={inputStyle}>
                  <option value="">Unassigned</option>
                  {properties.map(p => <option key={p.id} value={p.id}>{p.address.split(",")[0]}</option>)}
                </select>
              </FormRow>
              <button onClick={addExpense} disabled={saving || !expForm.description || !expForm.amount} style={{ width: "100%", background: C.amber, color: "#0f1b36", fontWeight: 800, fontSize: 13, padding: "10px", borderRadius: 8, border: "none", cursor: "pointer", marginTop: 4, opacity: saving ? 0.6 : 1 }}>
                + Log expense
              </button>
            </div>
            <div>
              {filteredExp.length === 0 ? (
                <p style={{ color: C.ink3, fontSize: 13 }}>No expenses recorded for {tyLabel}.</p>
              ) : filteredExp.map(exp => (
                <div key={exp.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", marginBottom: 8 }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{exp.description}</p>
                    <p style={{ fontSize: 11, color: C.ink3 }}>{new Date(exp.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} · {exp.category.replace(/_/g, " ")}</p>
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 800, color: C.red }}>-{fmt(exp.amount)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  // The label wraps the control rather than sitting next to it. As siblings
  // with no htmlFor, nothing associated the two, and every field in this form
  // was announced with no name at all — eleven of them. Wrapping makes the
  // association implicit, needs no ids, and costs nothing visually because the
  // span keeps the block layout the label had.
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.62)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 5 }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 7, padding: "8px 10px", fontSize: 12, color: "rgba(255,255,255,0.85)",
  outline: "none", boxSizing: "border-box",
};
