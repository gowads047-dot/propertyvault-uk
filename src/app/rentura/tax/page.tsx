"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RenturaSidebar } from "@/components/rentura/RenturaSidebar";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import type { RenturaProperty, RenturaMortgage } from "@/lib/rentura/types";

// ── Tax year utilities ────────────────────────────────────────────────────────

interface TaxYear {
  start: Date;
  end: Date;
  label: string;
  startStr: string;
  endStr: string;
}

function getTaxYear(offset = 0): TaxYear {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const isAfterStart = month > 4 || (month === 4 && day >= 6);
  const baseYear = (isAfterStart ? year : year - 1) - offset;
  const start = new Date(baseYear, 3, 6);
  const end = new Date(baseYear + 1, 3, 5);
  return {
    start, end,
    label: `${baseYear}/${String(baseYear + 1).slice(2)}`,
    startStr: start.toISOString().split("T")[0],
    endStr: end.toISOString().split("T")[0],
  };
}

function fmt(n: number, prefix = "£") {
  return prefix + Math.round(n).toLocaleString("en-GB");
}

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ── Tax computation ───────────────────────────────────────────────────────────

interface EventRow {
  id: string;
  property_id: string;
  event_type: string;
  title: string;
  amount: number | null;
  event_date: string;
  metadata: Record<string, unknown>;
}

interface PropertyTax {
  property: RenturaProperty;
  income: number;
  expenses: number;
  mortgageInterest: number;
  netProfit: number;
  incomeEvents: EventRow[];
  expenseEvents: EventRow[];
}

function computeTax(
  props: RenturaProperty[],
  events: EventRow[],
  mortgages: RenturaMortgage[],
  taxYear: TaxYear,
  taxRate: number,
): {
  byProperty: PropertyTax[];
  totalIncome: number;
  totalExpenses: number;
  totalMortgageInterest: number;
  totalNetProfit: number;
  taxOnProfit: number;
  financeCredit: number;
  netTaxOwed: number;
  confidence: number;
  missing: string[];
} {
  const INCOME_TYPES = ["payment"];
  const EXPENSE_TYPES = ["maintenance_cost", "maintenance_resolved"];

  const inTaxYear = (d: string) => d >= taxYear.startStr && d <= taxYear.endStr;

  const byProperty: PropertyTax[] = props.map(p => {
    const propEvents = events.filter(e => e.property_id === p.id && inTaxYear(e.event_date));
    const incomeEvents = propEvents.filter(e => INCOME_TYPES.includes(e.event_type) && (e.amount ?? 0) > 0);
    const expenseEvents = propEvents.filter(e => EXPENSE_TYPES.includes(e.event_type) && (e.amount ?? 0) > 0);

    const income = incomeEvents.reduce((s, e) => s + (e.amount ?? 0), 0);
    const expenses = expenseEvents.reduce((s, e) => s + (e.amount ?? 0), 0);

    // Mortgage interest: monthly_payment * 12 (simplified — in reality should be interest-only portion)
    const currentMortgage = mortgages.find(m => m.property_id === p.id && m.is_current);
    const mortgageInterest = currentMortgage?.monthly_payment ? currentMortgage.monthly_payment * 12 : 0;

    return { property: p, income, expenses, mortgageInterest, netProfit: income - expenses, incomeEvents, expenseEvents };
  });

  const totalIncome = byProperty.reduce((s, p) => s + p.income, 0);
  const totalExpenses = byProperty.reduce((s, p) => s + p.expenses, 0);
  const totalMortgageInterest = byProperty.reduce((s, p) => s + p.mortgageInterest, 0);
  const totalNetProfit = totalIncome - totalExpenses;
  const taxOnProfit = Math.max(0, totalNetProfit) * taxRate;
  const financeCredit = totalMortgageInterest * 0.2;
  const netTaxOwed = Math.max(0, taxOnProfit - financeCredit);

  // Confidence: based on data completeness
  const missing: string[] = [];
  let confidence = 100;

  // Expected 12 months of rent per property
  const expectedRentPayments = props.length * 12;
  const actualRentPayments = byProperty.reduce((s, p) => s + p.incomeEvents.length, 0);
  if (actualRentPayments < expectedRentPayments * 0.5) {
    const diff = expectedRentPayments - actualRentPayments;
    missing.push(`${diff} rent payment${diff > 1 ? "s" : ""} not logged — income may be understated`);
    confidence -= 30;
  } else if (actualRentPayments < expectedRentPayments * 0.8) {
    missing.push(`Some rent payments appear unlogged — tell Rentura each time rent arrives`);
    confidence -= 15;
  }

  // Check for any expenses
  if (totalExpenses === 0) {
    missing.push("No expenses logged — most landlords have insurance, repairs, management fees");
    confidence -= 20;
  }

  // Check mortgage interest recorded
  const propsWithMortgage = props.filter(p => mortgages.some(m => m.property_id === p.id && m.is_current));
  const propsWithoutMortgage = props.filter(p => !mortgages.some(m => m.property_id === p.id && m.is_current));
  if (propsWithoutMortgage.length > 0) {
    missing.push(`${propsWithoutMortgage.length} propert${propsWithoutMortgage.length > 1 ? "ies" : "y"} without a mortgage record — add if mortgaged`);
    confidence -= 10;
  }

  // Check current values for yield comparison
  const propsWithoutValue = props.filter(p => !p.current_value && !p.purchase_price);
  if (propsWithoutValue.length > 0) {
    missing.push(`${propsWithoutValue.length} propert${propsWithoutValue.length > 1 ? "ies" : "y"} missing valuation data`);
    confidence -= 5;
  }

  confidence = Math.max(0, confidence);

  return { byProperty, totalIncome, totalExpenses, totalMortgageInterest, totalNetProfit, taxOnProfit, financeCredit, netTaxOwed, confidence, missing };
}

// ── UI components ─────────────────────────────────────────────────────────────

function Row({ label, value, sub, color, indent = false, large = false }: { label: string; value: string; sub?: string; color?: string; indent?: boolean; large?: boolean }) {
  const BORDER = "rgba(17,17,17,0.08)";
  const INK = "#111111";
  const INK2 = "rgba(17,17,17,0.5)";
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "11px 0", borderBottom: `1px solid ${BORDER}` }}>
      <div style={{ paddingLeft: indent ? 16 : 0 }}>
        <p style={{ fontSize: large ? 15 : 13, fontWeight: large ? 800 : 600, color: INK, letterSpacing: large ? "-0.01em" : 0 }}>{label}</p>
        {sub && <p style={{ fontSize: 11, color: INK2, marginTop: 2 }}>{sub}</p>}
      </div>
      <p style={{ fontSize: large ? 17 : 14, fontWeight: large ? 900 : 700, color: color ?? INK }}>{value}</p>
    </div>
  );
}

function ConfidenceBar({ score }: { score: number }) {
  const color = score >= 80 ? "#16a34a" : score >= 60 ? "#d97706" : "#dc2626";
  const label = score >= 80 ? "High confidence" : score >= 60 ? "Medium confidence" : "Low confidence";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 900, color }}>{score}%</span>
      </div>
      <div style={{ height: 6, background: "rgba(17,17,17,0.08)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${score}%`, background: color, borderRadius: 3, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function TaxIntelligence() {
  const { user, profile } = useAuth();
  const router = useRouter();

  const [properties, setProperties] = useState<RenturaProperty[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [mortgages, setMortgages] = useState<RenturaMortgage[]>([]);
  const [loading, setLoading] = useState(true);
  const [taxYearOffset, setTaxYearOffset] = useState(0);
  const [taxRate, setTaxRate] = useState(0.4); // default higher rate
  const [expandedProp, setExpandedProp] = useState<string | null>(null);

  const taxYear = getTaxYear(taxYearOffset);

  useEffect(() => {
    if (!user) { router.push("/rentura/auth?next=/rentura/tax"); return; }
    async function load() {
      setLoading(true);
      const [propRes, evtRes, mortRes] = await Promise.all([
        supabase.from("rentura_properties").select("*").eq("user_id", user!.id),
        supabase.from("rentura_events").select("id,property_id,event_type,title,amount,event_date,metadata").eq("user_id", user!.id).not("amount", "is", null).order("event_date", { ascending: false }),
        supabase.from("rentura_mortgages").select("*").eq("user_id", user!.id).eq("is_current", true),
      ]);
      setProperties(propRes.data ?? []);
      setEvents((evtRes.data ?? []) as EventRow[]);
      setMortgages(mortRes.data ?? []);
      setLoading(false);
    }
    load();
  }, [user, router]);

  const BG = "#eceae2";
  const INK = "#111111";
  const INK2 = "rgba(17,17,17,0.52)";
  const BORDER = "rgba(17,17,17,0.09)";
  const CTA = "#0f1728";

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: INK2, fontSize: 14 }}>Calculating tax position…</p>
      </div>
    );
  }

  const result = computeTax(properties, events, mortgages, taxYear, taxRate);
  const isCurrentYear = taxYearOffset === 0;
  const now = new Date();
  const daysIntoYear = Math.max(0, Math.floor((now.getTime() - taxYear.start.getTime()) / 86400000));
  const daysInYear = 365;
  const yearProgress = Math.min(100, Math.round((daysIntoYear / daysInYear) * 100));

  return (
    <div style={{ fontFamily: "var(--font-family-body)", background: BG, color: INK, minHeight: "100vh", display: "flex" }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>
      <RenturaSidebar />

      <div style={{ flex: 1, overflowY: "auto" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* Header */}
        <div style={{ padding: "40px 0 28px" }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: "rgba(17,17,17,0.38)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Tax position</p>
          <h1 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, fontFamily: "var(--font-family-heading)", marginBottom: 6 }}>
            {taxYear.label} Tax Year
          </h1>
          <p style={{ fontSize: 14, color: INK2 }}>
            {fmtDate(taxYear.startStr)} – {fmtDate(taxYear.endStr)}
            {isCurrentYear && ` · ${yearProgress}% of year complete`}
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
          {/* Tax year toggle */}
          <div style={{ display: "flex", background: "rgba(17,17,17,0.06)", borderRadius: 9, padding: 3 }}>
            {[0, 1].map(offset => (
              <button key={offset} onClick={() => setTaxYearOffset(offset)}
                style={{ padding: "7px 16px", fontSize: 13, fontWeight: 700, borderRadius: 7, border: "none", cursor: "pointer", fontFamily: "inherit", background: taxYearOffset === offset ? "white" : "transparent", color: taxYearOffset === offset ? INK : INK2, boxShadow: taxYearOffset === offset ? "0 1px 4px rgba(0,0,0,0.1)" : "none", transition: "all 0.15s" }}>
                {getTaxYear(offset).label}
              </button>
            ))}
          </div>

          {/* Tax rate toggle */}
          <div style={{ display: "flex", background: "rgba(17,17,17,0.06)", borderRadius: 9, padding: 3 }}>
            <button onClick={() => setTaxRate(0.2)}
              style={{ padding: "7px 16px", fontSize: 13, fontWeight: 700, borderRadius: 7, border: "none", cursor: "pointer", fontFamily: "inherit", background: taxRate === 0.2 ? "white" : "transparent", color: taxRate === 0.2 ? INK : INK2, boxShadow: taxRate === 0.2 ? "0 1px 4px rgba(0,0,0,0.1)" : "none" }}>
              20% basic rate
            </button>
            <button onClick={() => setTaxRate(0.4)}
              style={{ padding: "7px 16px", fontSize: 13, fontWeight: 700, borderRadius: 7, border: "none", cursor: "pointer", fontFamily: "inherit", background: taxRate === 0.4 ? "white" : "transparent", color: taxRate === 0.4 ? INK : INK2, boxShadow: taxRate === 0.4 ? "0 1px 4px rgba(0,0,0,0.1)" : "none" }}>
              40% higher rate
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, alignItems: "start" }}>

          {/* Left column — main calculation */}
          <div>
            {/* Summary card */}
            <div style={{ background: "white", borderRadius: 16, padding: "24px 26px", border: `1px solid ${BORDER}`, marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: "rgba(17,17,17,0.38)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
                Estimated Tax Position — {taxYear.label}
              </p>

              <Row label="Gross rental income" value={fmt(result.totalIncome)}
                sub={`${result.byProperty.reduce((s, p) => s + p.incomeEvents.length, 0)} payments logged`} />
              <Row label="Allowable expenses" value={`−${fmt(result.totalExpenses)}`} color="#dc2626"
                sub="Repairs, maintenance, management fees" indent />
              <Row label="Net rental profit" value={fmt(result.totalNetProfit)} large />

              <div style={{ height: 1, background: BORDER, margin: "4px 0" }} />

              <Row label={`Tax at ${taxRate * 100}%`} value={`${fmt(result.taxOnProfit)}`} color="#d97706"
                sub={`${taxRate * 100}% × £${Math.round(result.totalNetProfit).toLocaleString("en-GB")} net profit`} />
              <Row label="Finance cost credit" value={`−${fmt(result.financeCredit)}`} color="#16a34a"
                sub={`20% of £${Math.round(result.totalMortgageInterest).toLocaleString("en-GB")} mortgage interest`} indent />

              <div style={{ height: 1, background: "#111", margin: "4px 0" }} />

              <Row label="Estimated tax owed"
                value={fmt(result.netTaxOwed)}
                color={result.netTaxOwed > 0 ? "#dc2626" : "#16a34a"}
                large />

              <p style={{ fontSize: 11, color: INK2, marginTop: 14, lineHeight: 1.6, fontStyle: "italic" }}>
                ~ This is an estimate only. Mortgage interest shown is monthly payment × 12 — the actual interest portion may differ. Share with your accountant to confirm. Not financial advice.
              </p>
            </div>

            {/* Per property breakdown */}
            <div style={{ background: "white", borderRadius: 16, padding: "22px 26px", border: `1px solid ${BORDER}` }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: "rgba(17,17,17,0.38)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>By property</p>

              {properties.length === 0 ? (
                <p style={{ fontSize: 14, color: INK2 }}>No properties added yet.</p>
              ) : (
                result.byProperty.map(pb => (
                  <div key={pb.property.id} style={{ borderBottom: `1px solid ${BORDER}`, paddingBottom: 12, marginBottom: 12 }}>
                    <button onClick={() => setExpandedProp(expandedProp === pb.property.id ? null : pb.property.id)}
                      style={{ width: "100%", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: expandedProp === pb.property.id ? 12 : 0 }}>
                      <div style={{ textAlign: "left" }}>
                        <p style={{ fontSize: 14, fontWeight: 800 }}>{pb.property.address.split(",")[0]}</p>
                        <p style={{ fontSize: 12, color: INK2 }}>
                          {fmt(pb.income)} income · {fmt(pb.expenses)} expenses · {fmt(pb.netProfit)} profit
                        </p>
                      </div>
                      <span style={{ fontSize: 12, color: INK2, flexShrink: 0 }}>{expandedProp === pb.property.id ? "▲" : "▼"}</span>
                    </button>

                    {expandedProp === pb.property.id && (
                      <div style={{ background: "#fafaf9", borderRadius: 10, padding: "14px 16px" }}>
                        {pb.incomeEvents.length === 0 && pb.expenseEvents.length === 0 ? (
                          <p style={{ fontSize: 13, color: INK2 }}>No transactions logged for this tax year.</p>
                        ) : (
                          <>
                            {pb.incomeEvents.length > 0 && (
                              <div style={{ marginBottom: 12 }}>
                                <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(17,17,17,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Income</p>
                                {pb.incomeEvents.map(e => (
                                  <div key={e.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "5px 0", borderBottom: `1px solid ${BORDER}` }}>
                                    <span style={{ color: INK2 }}>{fmtDate(e.event_date)} · {e.title}</span>
                                    <span style={{ fontWeight: 700, color: "#16a34a" }}>{fmt(e.amount ?? 0)}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            {pb.expenseEvents.length > 0 && (
                              <div>
                                <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(17,17,17,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Expenses</p>
                                {pb.expenseEvents.map(e => (
                                  <div key={e.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "5px 0", borderBottom: `1px solid ${BORDER}` }}>
                                    <span style={{ color: INK2 }}>{fmtDate(e.event_date)} · {e.title}</span>
                                    <span style={{ fontWeight: 700, color: "#dc2626" }}>−{fmt(e.amount ?? 0)}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            {pb.mortgageInterest > 0 && (
                              <div style={{ marginTop: 12, padding: "8px 10px", background: "rgba(37,99,235,0.05)", borderRadius: 7 }}>
                                <p style={{ fontSize: 12, color: "#2563eb", fontWeight: 600 }}>
                                  Mortgage interest (est.) {fmt(pb.mortgageInterest)} — 20% credit = {fmt(pb.mortgageInterest * 0.2)}
                                </p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right column — confidence + actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Confidence score */}
            <div style={{ background: "white", borderRadius: 14, padding: "22px 22px", border: `1px solid ${BORDER}` }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: "rgba(17,17,17,0.38)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Tax confidence</p>
              <ConfidenceBar score={result.confidence} />
              <p style={{ fontSize: 12, color: INK2, marginTop: 12, lineHeight: 1.6 }}>
                {result.confidence >= 80
                  ? "Good coverage. Share with your accountant to finalise."
                  : result.confidence >= 60
                    ? "Reasonable estimate. Log more transactions to improve accuracy."
                    : "Too many gaps for a reliable estimate. Log income and expenses regularly."}
              </p>
            </div>

            {/* Missing items */}
            {result.missing.length > 0 && (
              <div style={{ background: "white", borderRadius: 14, padding: "20px 22px", border: `1px solid ${BORDER}` }}>
                <p style={{ fontSize: 11, fontWeight: 800, color: "rgba(17,17,17,0.38)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Improve your estimate</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {result.missing.map((m, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 12, color: "#d97706", flexShrink: 0, marginTop: 1 }}>○</span>
                      <p style={{ fontSize: 13, color: INK, lineHeight: 1.5 }}>{m}</p>
                    </div>
                  ))}
                </div>
                <Link href="/rentura/dashboard" style={{ display: "block", marginTop: 16, textAlign: "center", fontSize: 13, fontWeight: 700, color: CTA, textDecoration: "none", background: BG, padding: "9px 0", borderRadius: 8 }}>
                  Log transactions →
                </Link>
              </div>
            )}

            {/* Key figures */}
            <div style={{ background: "white", borderRadius: 14, padding: "20px 22px", border: `1px solid ${BORDER}` }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: "rgba(17,17,17,0.38)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Key figures</p>
              {[
                ["Gross income", fmt(result.totalIncome)],
                ["Allowable expenses", fmt(result.totalExpenses)],
                ["Mortgage interest", fmt(result.totalMortgageInterest)],
                ["Finance cost credit", fmt(result.financeCredit)],
                ["Net tax estimate", fmt(result.netTaxOwed)],
                ["Effective yield", properties.length > 0 ? (() => {
                  const totalPurchasePrice = properties.reduce((s, p) => s + (p.purchase_price ?? 0), 0);
                  return totalPurchasePrice > 0 ? ((result.totalIncome / totalPurchasePrice) * 100).toFixed(1) + "%" : "—";
                })() : "—"],
              ].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${BORDER}` }}>
                  <span style={{ fontSize: 13, color: INK2 }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: INK }}>{val}</span>
                </div>
              ))}
            </div>

            {/* Accountant export note */}
            <div style={{ background: CTA, borderRadius: 14, padding: "20px 22px", color: "white" }}>
              <p style={{ fontSize: 14, fontWeight: 800, marginBottom: 8 }}>Share with your accountant</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, marginBottom: 14 }}>
                Use your browser&apos;s print function to save this page as a PDF for your accountant. All figures include source details and confidence ratings.
              </p>
              <button onClick={() => window.print()}
                style={{ background: "white", color: CTA, fontWeight: 800, fontSize: 13, padding: "10px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "inherit", width: "100%" }}>
                Save as PDF →
              </button>
            </div>
          </div>
        </div>

        {/* UK tax reference */}
        <div style={{ marginTop: 32, background: "white", borderRadius: 14, padding: "20px 24px", border: `1px solid ${BORDER}` }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: "rgba(17,17,17,0.38)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>How rental income is taxed (UK 2025/26)</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 14 }}>
            {[
              ["Personal allowance", "£12,570 — no tax on income below this"],
              ["Basic rate (20%)", "Income £12,571 – £50,270"],
              ["Higher rate (40%)", "Income £50,271 – £125,140"],
              ["Additional rate (45%)", "Income above £125,140"],
              ["Finance cost restriction", "Mortgage interest gives 20% tax credit, not a deduction from profit"],
              ["Property allowance", "£1,000 tax-free if total rental income below £1,000"],
            ].map(([label, desc]) => (
              <div key={label} style={{ padding: "12px 14px", background: "#fafaf9", borderRadius: 9 }}>
                <p style={{ fontSize: 12, fontWeight: 800, marginBottom: 4 }}>{label}</p>
                <p style={{ fontSize: 12, color: INK2, lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: INK2, marginTop: 14, fontStyle: "italic" }}>
            Source: HMRC. Rates correct for 2025/26. Always confirm with a qualified accountant.
          </p>
        </div>
      </div>

      <style>{`@media print { nav, .no-print { display: none !important; } }`}</style>
      </div>
    </div>
  );
}
