"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RenturaSidebar } from "@/components/rentura/RenturaSidebar";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import type { RenturaProperty, RenturaMortgage, RenturaTenant } from "@/lib/rentura/types";

// ── Tax year ─────────────────────────────────────────────────────────────────
interface TaxYear { start: Date; end: Date; label: string; startStr: string; endStr: string }
function getTaxYear(offset = 0): TaxYear {
  const now = new Date();
  const y = now.getFullYear(); const m = now.getMonth() + 1; const d = now.getDate();
  const base = (m > 4 || (m === 4 && d >= 6) ? y : y - 1) - offset;
  const start = new Date(base, 3, 6); const end = new Date(base + 1, 3, 5);
  return { start, end, label: `${base}/${String(base + 1).slice(2)}`, startStr: start.toISOString().split("T")[0], endStr: end.toISOString().split("T")[0] };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n: number, prefix = "£") { return prefix + Math.round(n).toLocaleString("en-GB"); }
function fmtDate(d: string | null) { if (!d) return "—"; return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
function parseAmt(v: unknown): number { return v ? parseFloat(String(v).replace(/[^0-9.-]/g, "")) || 0 : 0; }
function monthsBetween(a: Date, b: Date): number {
  return Math.max(0, (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth());
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface EventRow { id: string; property_id: string; event_type: string; title: string; amount: number | null; event_date: string; metadata: Record<string, unknown> }
interface FExpense { id: string; category: string; description: string; amount: number; date: string; property_id: string | null }
interface FIncome { id: string; amount: number; type: string; date: string; property_id: string | null; notes: string | null }
interface PropAdj { insurance: number; agent_pct: number; accountant: number; advertising: number; legal: number; repairs_extra: number; other: number }
const DEFAULT_ADJ = (): PropAdj => ({ insurance: 0, agent_pct: 0, accountant: 0, advertising: 0, legal: 0, repairs_extra: 0, other: 0 });

interface PropTaxLine {
  property: RenturaProperty;
  tenant: RenturaTenant | null;
  mortgage: RenturaMortgage | null;
  loggedIncome: number;
  estimatedIncome: number;
  incomeGap: number;
  loggedExpenses: number;
  incomeEvents: EventRow[];
  expenseEvents: EventRow[];
  fIncomeRows: FIncome[];
  fExpenseRows: FExpense[];
  adjExpenses: number;
  mortgageInterest: number;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
}

interface MissedItem { checked: boolean; amount: number }

const MISSED_ITEMS: { key: string; label: string; defaultAmt: number }[] = [
  { key: "buildings_ins", label: "Buildings insurance", defaultAmt: 400 },
  { key: "contents_ins", label: "Contents insurance", defaultAmt: 150 },
  { key: "accountant", label: "Accountant / professional fees", defaultAmt: 600 },
  { key: "advertising", label: "Advertising & listings (Rightmove etc.)", defaultAmt: 200 },
  { key: "legal", label: "Legal fees (tenancy agreements)", defaultAmt: 150 },
  { key: "cleaning", label: "Cleaning between tenancies", defaultAmt: 250 },
  { key: "gardening", label: "Gardening & grounds maintenance", defaultAmt: 300 },
  { key: "travel", label: "Property inspection travel (45p/mile)", defaultAmt: 100 },
  { key: "stationery", label: "Stationery, postage & admin", defaultAmt: 50 },
  { key: "letting_mgmt", label: "Letting agent management fees", defaultAmt: 0 },
];

const INCOME_TYPES = new Set(["payment", "rent_payment", "bulk_payment"]);
const EXPENSE_TYPES = new Set(["maintenance_cost", "maintenance_resolved"]);

// ── Core computation ──────────────────────────────────────────────────────────
function computeTax(
  props: RenturaProperty[], events: EventRow[], mortgages: RenturaMortgage[],
  tenants: RenturaTenant[], fExpenses: FExpense[], fIncome: FIncome[],
  adjustments: Record<string, PropAdj>,
  missed: Record<string, MissedItem>, whatIfSpend: number,
  taxYear: TaxYear, taxRate: number,
) {
  const inTY = (d: string) => d >= taxYear.startStr && d <= taxYear.endStr;
  const now = new Date();
  const periodEnd = now < taxYear.end ? now : taxYear.end;

  const lines: PropTaxLine[] = props.map(p => {
    // Events (from AI chat + old logging)
    const pe = events.filter(e => e.property_id === p.id && inTY(e.event_date));
    const incomeEvents = pe.filter(e => INCOME_TYPES.has(e.event_type) && (e.amount ?? 0) > 0);
    const expenseEvents = pe.filter(e => EXPENSE_TYPES.has(e.event_type) && (e.amount ?? 0) > 0);

    // Financials page dedicated tables (primary source of truth)
    const fIncomeRows = fIncome.filter(i => i.property_id === p.id && inTY(i.date));
    const fExpenseRows = fExpenses.filter(e => e.property_id === p.id && inTY(e.date));

    // Combine: financial tables are authoritative; events fill gaps
    const financialIncome = fIncomeRows.reduce((s, i) => s + (i.amount || 0), 0);
    const eventIncome = incomeEvents.reduce((s, e) => s + (e.amount ?? 0), 0);
    const loggedIncome = financialIncome + eventIncome;

    const financialExpenses = fExpenseRows.reduce((s, e) => s + (e.amount || 0), 0);
    const eventExpenses = expenseEvents.reduce((s, e) => s + (e.amount ?? 0), 0);
    const loggedExpenses = financialExpenses + eventExpenses;

    const tenant = tenants.find(t => t.property_id === p.id && t.is_current) ?? null;
    const mortgage = mortgages.find(m => m.property_id === p.id && m.is_current) ?? null;

    // Smart income estimation from tenant record
    const tenantStart = tenant?.move_in_date ?? tenant?.tenancy_start;
    const periodStart = tenantStart && new Date(tenantStart) > taxYear.start ? new Date(tenantStart) : taxYear.start;
    const months = monthsBetween(periodStart, periodEnd);
    const estimatedIncome = (tenant?.monthly_rent ?? 0) * months;
    // Gap only shown if actual logged income is less than estimate
    const incomeGap = Math.max(0, estimatedIncome - loggedIncome);

    // Manual per-property adjustments
    const adj = adjustments[p.id] ?? DEFAULT_ADJ();
    const agentFees = adj.agent_pct > 0 ? (Math.max(loggedIncome, estimatedIncome) * adj.agent_pct / 100) : 0;
    const adjExpenses = adj.insurance + agentFees + adj.accountant + adj.advertising + adj.legal + adj.repairs_extra + adj.other;

    const mortgageInterest = (mortgage?.monthly_payment ?? 0) * 12;
    // Use actual logged income as the figure — estimation only supplements if nothing logged
    const totalIncome = loggedIncome > 0 ? loggedIncome : estimatedIncome;
    const totalExpenses = loggedExpenses + adjExpenses;
    return { property: p, tenant, mortgage, loggedIncome, estimatedIncome, incomeGap, loggedExpenses, incomeEvents, expenseEvents, fIncomeRows, fExpenseRows, adjExpenses, mortgageInterest, totalIncome, totalExpenses, netProfit: totalIncome - totalExpenses };
  });

  // Also include unassigned financial entries (no property_id set)
  const unassignedFIncome = fIncome.filter(i => !i.property_id && inTY(i.date)).reduce((s, i) => s + (i.amount || 0), 0);
  const unassignedFExpenses = fExpenses.filter(e => !e.property_id && inTY(e.date)).reduce((s, e) => s + (e.amount || 0), 0);

  const missedTotal = Object.values(missed).filter(m => m.checked).reduce((s, m) => s + m.amount, 0);
  const totalIncome = lines.reduce((s, l) => s + l.totalIncome, 0) + unassignedFIncome;
  const totalExpenses = lines.reduce((s, l) => s + l.totalExpenses, 0) + unassignedFExpenses + missedTotal + whatIfSpend;
  const totalMortgage = lines.reduce((s, l) => s + l.mortgageInterest, 0);
  const netProfit = Math.max(0, totalIncome - totalExpenses);
  const taxOnProfit = netProfit * taxRate;
  const financeCredit = totalMortgage * 0.2;
  const netTaxOwed = Math.max(0, taxOnProfit - financeCredit);

  // Section 24 impact: what tax would be WITHOUT the restriction (old rules)
  const profitUnderOldRules = Math.max(0, totalIncome - totalExpenses - totalMortgage);
  const taxUnderOldRules = profitUnderOldRules * taxRate;
  const s24ExtraCost = Math.max(0, netTaxOwed - taxUnderOldRules);

  // Confidence score — now counts financial rows too
  const missing: string[] = [];
  let confidence = 100;
  const totalLoggedIncome = lines.reduce((s, l) => s + l.loggedIncome, 0) + unassignedFIncome;
  const totalLoggedExpenses = lines.reduce((s, l) => s + l.loggedExpenses, 0) + unassignedFExpenses;
  const expectedPayments = props.filter(p => tenants.some(t => t.property_id === p.id && t.is_current)).length * monthsBetween(taxYear.start, periodEnd);
  const loggedPaymentCount = lines.reduce((s, l) => s + l.incomeEvents.length + l.fIncomeRows.length, 0);
  if (expectedPayments > 0 && totalLoggedIncome === 0) { missing.push("No income logged yet — add rent payments in Financials or via chat"); confidence -= 30; }
  else if (expectedPayments > 0 && loggedPaymentCount < expectedPayments * 0.5) { missing.push(`Estimated ${expectedPayments - loggedPaymentCount} rent payments may be missing`); confidence -= 15; }
  if (totalLoggedExpenses === 0) { missing.push("No expenses logged — add via Financials page or use the checklist below"); confidence -= 20; }
  if (lines.some(l => !l.mortgage && (l.property.purchase_price ?? 0) > 0)) { missing.push("Some properties missing mortgage details — add if mortgaged"); confidence -= 10; }
  if (missedTotal === 0) { missing.push("Common expenses may be unclaimed — check the checklist below"); confidence -= 10; }
  confidence = Math.max(0, confidence);

  return { lines, totalIncome, totalExpenses, totalMortgage, netProfit, taxOnProfit, financeCredit, netTaxOwed, taxUnderOldRules, s24ExtraCost, confidence, missing, missedTotal, unassignedFIncome, unassignedFExpenses };
}

// ── CSV export ────────────────────────────────────────────────────────────────
function exportCSV(lines: PropTaxLine[], taxYear: TaxYear, missed: Record<string, MissedItem>, fExpenses: FExpense[], fIncome: FIncome[]) {
  const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
  const inTY = (d: string) => d >= taxYear.startStr && d <= taxYear.endStr;
  const rows: string[] = [
    ["Tax Year", "Property", "Date", "Type", "Category", "Description", "Amount (£)", "Source"].join(",")
  ];
  for (const l of lines) {
    const addr = esc(l.property.address);
    // Financial income rows (from Financials page)
    for (const i of l.fIncomeRows) rows.push([taxYear.label, addr, i.date, "Income", esc(i.type), esc(i.notes ?? i.type), i.amount, "Financials page"].join(","));
    // Event income rows (from chat/events)
    for (const e of l.incomeEvents) rows.push([taxYear.label, addr, e.event_date, "Income", "Rental income", esc(e.title), e.amount ?? 0, "Event log"].join(","));
    // Financial expense rows (from Financials page)
    for (const e of l.fExpenseRows) rows.push([taxYear.label, addr, e.date, "Expense", esc(e.category), esc(e.description), e.amount, "Financials page"].join(","));
    // Event expense rows (from chat/events)
    for (const e of l.expenseEvents) rows.push([taxYear.label, addr, e.event_date, "Expense", "Maintenance/repairs", esc(e.title), e.amount ?? 0, "Event log"].join(","));
    if (l.adjExpenses > 0) rows.push([taxYear.label, addr, taxYear.endStr, "Expense", "Other allowable expenses", "Manual adjustment", l.adjExpenses, "Manual"].join(","));
    if (l.mortgageInterest > 0) rows.push([taxYear.label, addr, taxYear.endStr, "Finance cost", "Mortgage interest (est.)", esc(l.mortgage?.lender ?? "Lender"), l.mortgageInterest, "Mortgage record"].join(","));
  }
  // Unassigned financial entries
  for (const i of fIncome.filter(x => !x.property_id && inTY(x.date))) rows.push([taxYear.label, '"Unassigned"', i.date, "Income", esc(i.type), esc(i.notes ?? i.type), i.amount, "Financials page"].join(","));
  for (const e of fExpenses.filter(x => !x.property_id && inTY(x.date))) rows.push([taxYear.label, '"Unassigned"', e.date, "Expense", esc(e.category), esc(e.description), e.amount, "Financials page"].join(","));
  for (const [key, item] of Object.entries(missed)) {
    if (item.checked) {
      const label = MISSED_ITEMS.find(m => m.key === key)?.label ?? key;
      rows.push([taxYear.label, '"All properties"', taxYear.endStr, "Expense", "Allowable expense", esc(label), item.amount, "Checklist"].join(","));
    }
  }
  const csv = rows.join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `rentura-tax-${taxYear.label.replace("/", "-")}.csv`; a.click();
  URL.revokeObjectURL(url);
}

// ── UI helpers ────────────────────────────────────────────────────────────────
const BG = "#eceae2"; const INK = "#111111"; const INK2 = "rgba(17,17,17,0.52)"; const BORDER = "rgba(17,17,17,0.09)"; const CTA = "#0f1728";
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: "white", borderRadius: 16, padding: "22px 26px", border: `1px solid ${BORDER}`, ...style }}>{children}</div>;
}
function SH({ title }: { title: string }) {
  return <p style={{ fontSize: 11, fontWeight: 800, color: "rgba(17,17,17,0.38)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>{title}</p>;
}
function TRow({ label, value, sub, color, large, indent }: { label: string; value: string; sub?: string; color?: string; large?: boolean; indent?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 0", borderBottom: `1px solid ${BORDER}`, paddingLeft: indent ? 12 : 0 }}>
      <div><p style={{ fontSize: large ? 15 : 13, fontWeight: large ? 800 : 600, color: INK }}>{label}</p>{sub && <p style={{ fontSize: 11, color: INK2, marginTop: 2 }}>{sub}</p>}</div>
      <p style={{ fontSize: large ? 17 : 14, fontWeight: large ? 900 : 700, color: color ?? INK }}>{value}</p>
    </div>
  );
}
function NumInput({ value, onChange, prefix = "£" }: { value: number; onChange: (n: number) => void; prefix?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <span style={{ fontSize: 12, color: INK2 }}>{prefix}</span>
      <input type="number" value={value || ""} min={0} onChange={e => onChange(parseFloat(e.target.value) || 0)}
        style={{ width: 80, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "4px 8px", fontSize: 12, fontFamily: "inherit", background: "white", color: INK, textAlign: "right" }} />
    </div>
  );
}
function ConfBar({ score }: { score: number }) {
  const c = score >= 80 ? "#16a34a" : score >= 60 ? "#d97706" : "#dc2626";
  const l = score >= 80 ? "High confidence" : score >= 60 ? "Medium confidence" : "Low confidence";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: c, textTransform: "uppercase", letterSpacing: "0.08em" }}>{l}</span>
        <span style={{ fontSize: 13, fontWeight: 900, color: c }}>{score}%</span>
      </div>
      <div style={{ height: 6, background: BORDER, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${score}%`, background: c, borderRadius: 3 }} />
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function TaxIntelligence() {
  const { user } = useAuth();
  const router = useRouter();

  const [properties, setProperties] = useState<RenturaProperty[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [mortgages, setMortgages] = useState<RenturaMortgage[]>([]);
  const [tenants, setTenants] = useState<RenturaTenant[]>([]);
  const [fExpenses, setFExpenses] = useState<FExpense[]>([]);
  const [fIncome, setFIncome] = useState<FIncome[]>([]);
  const [loading, setLoading] = useState(true);

  const [taxYearOffset, setTaxYearOffset] = useState(0);
  const [taxRate, setTaxRate] = useState(0.4);
  const [expandedProp, setExpandedProp] = useState<string | null>(null);
  const [adjustments, setAdjustments] = useState<Record<string, PropAdj>>({});
  const [missed, setMissed] = useState<Record<string, MissedItem>>(() =>
    Object.fromEntries(MISSED_ITEMS.map(m => [m.key, { checked: false, amount: m.defaultAmt }]))
  );
  const [whatIfSpend, setWhatIfSpend] = useState(0);
  const [showSA105, setShowSA105] = useState(false);
  const [showWhatIf, setShowWhatIf] = useState(false);

  const taxYear = getTaxYear(taxYearOffset);
  const now = new Date();

  useEffect(() => {
    if (!user) { router.push("/rentura/auth?next=/rentura/tax"); return; }
    async function load() {
      setLoading(true);
      const [pR, eR, mR, tR, exR, incR] = await Promise.all([
        supabase.from("rentura_properties").select("*").eq("user_id", user!.id),
        supabase.from("rentura_events").select("id,property_id,event_type,title,amount,event_date,metadata").eq("user_id", user!.id).not("amount", "is", null).order("event_date", { ascending: false }),
        supabase.from("rentura_mortgages").select("*").eq("user_id", user!.id).eq("is_current", true),
        supabase.from("rentura_tenants").select("*").eq("user_id", user!.id).eq("is_current", true),
        supabase.from("rentura_expenses").select("id,category,description,amount,date,property_id").eq("user_id", user!.id).order("date", { ascending: false }),
        supabase.from("rentura_income").select("id,amount,type,date,property_id,notes").eq("user_id", user!.id).order("date", { ascending: false }),
      ]);
      const props = pR.data ?? [];
      setProperties(props);
      setEvents((eR.data ?? []) as EventRow[]);
      setMortgages(mR.data ?? []);
      setTenants((tR.data ?? []) as RenturaTenant[]);
      setFExpenses((exR.data ?? []) as FExpense[]);
      setFIncome((incR.data ?? []) as FIncome[]);
      // Init adjustments per property
      const adj: Record<string, PropAdj> = {};
      for (const p of props) adj[p.id] = DEFAULT_ADJ();
      setAdjustments(adj);
      setLoading(false);
    }
    load();
  }, [user, router]);

  const result = loading ? null : computeTax(properties, events, mortgages, tenants, fExpenses, fIncome, adjustments, missed, whatIfSpend, taxYear, taxRate);

  const updateAdj = useCallback((propId: string, field: keyof PropAdj, val: number) => {
    setAdjustments(prev => ({ ...prev, [propId]: { ...(prev[propId] ?? DEFAULT_ADJ()), [field]: val } }));
  }, []);

  const toggleMissed = useCallback((key: string) => {
    setMissed(prev => ({ ...prev, [key]: { ...prev[key], checked: !prev[key].checked } }));
  }, []);
  const updateMissedAmt = useCallback((key: string, val: number) => {
    setMissed(prev => ({ ...prev, [key]: { ...prev[key], amount: val } }));
  }, []);

  const daysUntilApr5 = Math.ceil((new Date(taxYear.end.getFullYear(), 3, 5).getTime() - now.getTime()) / 86400000);
  const isCurrentYear = taxYearOffset === 0;
  const yearProgress = Math.min(100, Math.round(((now.getTime() - taxYear.start.getTime()) / (taxYear.end.getTime() - taxYear.start.getTime())) * 100));

  // Payments on account dates
  const poaYear = parseInt(taxYear.label.split("/")[0]) + 1;
  const poa1 = `31 January ${poaYear + 1}`;
  const poa2 = `31 July ${poaYear + 1}`;

  // MTD threshold check
  const totalIncomeMTD = result?.totalIncome ?? 0;
  const mtdRequired2026 = totalIncomeMTD >= 50000;
  const mtdRequired2027 = totalIncomeMTD >= 30000;

  if (loading || !result) {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{`body > header, body > footer { display: none !important; }`}</style>
        <p style={{ color: INK2, fontSize: 14 }}>Calculating tax position…</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "var(--font-family-body, sans-serif)", background: BG, color: INK, minHeight: "100vh", display: "flex" }}>
      <style>{`body > header, body > footer { display: none !important; } @media print { nav, .no-print { display: none !important; } }`}</style>
      <RenturaSidebar />

      <div style={{ flex: 1, overflowY: "auto" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* MTD Alert */}
        {isCurrentYear && (mtdRequired2026 || mtdRequired2027) && (
          <div className="no-print" style={{ marginTop: 24, padding: "13px 18px", background: "#fef3c7", border: "1px solid #d97706", borderRadius: 12, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>⚠</span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#92400e" }}>Making Tax Digital — {mtdRequired2026 ? "April 2026" : "April 2027"}</p>
              <p style={{ fontSize: 12, color: "#78350f", marginTop: 2, lineHeight: 1.5 }}>
                {mtdRequired2026
                  ? `Your rental income (${fmt(totalIncomeMTD)}) exceeds the £50,000 MTD threshold. You must file quarterly digital returns to HMRC from April 2026.`
                  : `Your rental income (${fmt(totalIncomeMTD)}) exceeds the £30,000 threshold. MTD applies from April 2027.`}
                {" "}Speak to your accountant about compatible software.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div style={{ padding: "36px 0 24px" }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: "rgba(17,17,17,0.38)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Tax position</p>
          <h1 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, fontFamily: "var(--font-family-heading, sans-serif)", marginBottom: 6 }}>
            {taxYear.label} Tax Year
          </h1>
          <p style={{ fontSize: 14, color: INK2 }}>
            {fmtDate(taxYear.startStr)} – {fmtDate(taxYear.endStr)}
            {isCurrentYear && ` · ${yearProgress}% of year complete`}
          </p>
        </div>

        {/* Pre-April 5 countdown — current year only */}
        {isCurrentYear && daysUntilApr5 > 0 && daysUntilApr5 < 365 && (
          <div style={{ background: daysUntilApr5 < 60 ? "#fef2f2" : "white", border: `1px solid ${daysUntilApr5 < 60 ? "#fca5a5" : BORDER}`, borderRadius: 14, padding: "18px 22px", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 800, color: daysUntilApr5 < 60 ? "#dc2626" : "rgba(17,17,17,0.38)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {daysUntilApr5 < 60 ? "⚠ Urgent" : "📅"} Tax year end countdown
                </p>
                <p style={{ fontSize: 20, fontWeight: 900, color: daysUntilApr5 < 60 ? "#dc2626" : INK, marginTop: 4 }}>{daysUntilApr5} days until 5 April {taxYear.end.getFullYear()}</p>
              </div>
              <div style={{ width: 60, height: 60, borderRadius: "50%", border: `4px solid ${daysUntilApr5 < 60 ? "#dc2626" : "#2563eb"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 900, color: daysUntilApr5 < 60 ? "#dc2626" : "#2563eb" }}>{yearProgress}%</p>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[
                result.totalIncome === 0 && { color: "#dc2626", text: "Log outstanding rent before year end" },
                result.totalExpenses === 0 && { color: "#d97706", text: "No expenses logged — claim what you can now" },
                result.netTaxOwed > 0 && { color: "#d97706", text: `Spend on qualifying repairs to reduce your £${Math.round(result.netTaxOwed).toLocaleString()} bill` },
                result.lines.some(l => !l.mortgage) && { color: "#2563eb", text: "Add mortgage details to claim finance cost credit" },
                { color: "#16a34a", text: "Collect receipts for all expenses this year" },
              ].filter(Boolean).slice(0, 4).map((item, i) => item && (
                <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", background: `${item.color}10`, border: `1px solid ${item.color}30`, borderRadius: 8, padding: "6px 12px" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                  <p style={{ fontSize: 12, color: item.color, fontWeight: 600 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
          <div style={{ display: "flex", background: "rgba(17,17,17,0.06)", borderRadius: 9, padding: 3 }}>
            {[0, 1].map(off => (
              <button key={off} onClick={() => setTaxYearOffset(off)}
                style={{ padding: "7px 16px", fontSize: 13, fontWeight: 700, borderRadius: 7, border: "none", cursor: "pointer", fontFamily: "inherit", background: taxYearOffset === off ? "white" : "transparent", color: taxYearOffset === off ? INK : INK2, boxShadow: taxYearOffset === off ? "0 1px 4px rgba(0,0,0,0.1)" : "none" }}>
                {getTaxYear(off).label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", background: "rgba(17,17,17,0.06)", borderRadius: 9, padding: 3 }}>
            {([["20% basic rate", 0.2], ["40% higher rate", 0.4], ["45% additional rate", 0.45]] as [string, number][]).map(([label, rate]) => (
              <button key={rate} onClick={() => setTaxRate(rate)}
                style={{ padding: "7px 16px", fontSize: 13, fontWeight: 700, borderRadius: 7, border: "none", cursor: "pointer", fontFamily: "inherit", background: taxRate === rate ? "white" : "transparent", color: taxRate === rate ? INK : INK2, boxShadow: taxRate === rate ? "0 1px 4px rgba(0,0,0,0.1)" : "none" }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>

          {/* ── LEFT COLUMN ────────────────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Main summary card */}
            <Card>
              <SH title={`Estimated Tax Position — ${taxYear.label}`} />
              <TRow label="Gross rental income" value={fmt(result.totalIncome)}
                sub={`${result.lines.reduce((s, l) => s + l.incomeEvents.length, 0)} payments logged · ${result.lines.filter(l => l.estimatedIncome > 0).length} properties with tenants`} />
              <TRow label="Total allowable expenses" value={`−${fmt(result.totalExpenses)}`} color="#dc2626" indent
                sub={`Repairs, maintenance + manual adjustments${result.missedTotal > 0 ? ` + £${Math.round(result.missedTotal).toLocaleString()} from checklist` : ""}`} />
              <TRow label="Net rental profit" value={fmt(result.netProfit)} large />
              <div style={{ height: 1, background: BORDER, margin: "4px 0" }} />
              <TRow label={`Tax at ${taxRate * 100}%`} value={fmt(result.taxOnProfit)} color="#d97706"
                sub={`${taxRate * 100}% × £${Math.round(result.netProfit).toLocaleString()} net profit`} />
              <TRow label="Finance cost credit (Section 24)" value={`−${fmt(result.financeCredit)}`} color="#16a34a" indent
                sub={`20% of £${Math.round(result.totalMortgage).toLocaleString()} estimated mortgage interest`} />
              <div style={{ height: 1, background: "#111", margin: "4px 0" }} />
              <TRow label="Estimated tax owed" value={fmt(result.netTaxOwed)} color={result.netTaxOwed > 0 ? "#dc2626" : "#16a34a"} large />
              {whatIfSpend > 0 && (
                <div style={{ marginTop: 10, padding: "9px 12px", background: "#16a34a10", borderRadius: 8, borderLeft: "3px solid #16a34a" }}>
                  <p style={{ fontSize: 12, color: "#16a34a", fontWeight: 700 }}>
                    What-if included: £{Math.round(whatIfSpend).toLocaleString()} extra spend → saves £{Math.round(whatIfSpend * taxRate).toLocaleString()} in tax
                  </p>
                </div>
              )}
              <p style={{ fontSize: 11, color: INK2, marginTop: 12, lineHeight: 1.6, fontStyle: "italic" }}>
                Estimate only. Mortgage interest shown as monthly payment × 12 — actual interest portion may differ. Share with your accountant. Not financial advice.
              </p>
            </Card>

            {/* Section 24 impact */}
            {result.totalMortgage > 0 && (
              <Card>
                <SH title="Section 24 Impact — Finance Cost Restriction" />
                <TRow label="Tax under old rules (pre-2020)" value={fmt(result.taxUnderOldRules)} color="#16a34a"
                  sub="Mortgage interest was fully deductible from profit" />
                <TRow label="Tax under current rules (Section 24)" value={fmt(result.netTaxOwed)} color={result.netTaxOwed > result.taxUnderOldRules ? "#dc2626" : INK}
                  sub="Only a 20% tax credit on mortgage interest" />
                <TRow label="Extra tax due to restriction" value={result.s24ExtraCost > 0 ? `+${fmt(result.s24ExtraCost)}` : "£0"} color={result.s24ExtraCost > 0 ? "#dc2626" : "#16a34a"} large />
                {result.s24ExtraCost > 0 && (
                  <div style={{ marginTop: 10, padding: "10px 14px", background: "#fef2f2", borderRadius: 9, borderLeft: "3px solid #dc2626" }}>
                    <p style={{ fontSize: 12, color: "#991b1b", lineHeight: 1.6 }}>
                      Section 24 costs you an extra {fmt(result.s24ExtraCost)}/yr. Higher-rate taxpayers with large mortgages are most affected.
                      If you&apos;re considering incorporating into a limited company, speak to an accountant — the comparison depends on your full personal tax position.
                    </p>
                  </div>
                )}
              </Card>
            )}

            {/* Per-property smart breakdown */}
            <Card>
              <SH title="Per-property breakdown — from property passports" />
              {result.lines.length === 0 ? (
                <p style={{ fontSize: 14, color: INK2 }}>No properties added yet.</p>
              ) : result.lines.map(l => (
                <div key={l.property.id} style={{ borderBottom: `1px solid ${BORDER}`, paddingBottom: 14, marginBottom: 14 }}>
                  {/* Property header row */}
                  <button onClick={() => setExpandedProp(expandedProp === l.property.id ? null : l.property.id)}
                    style={{ width: "100%", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: "6px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <p style={{ fontSize: 14, fontWeight: 800 }}>{l.property.address.split(",")[0]}</p>
                        {l.tenant && <span style={{ fontSize: 11, background: "#16a34a15", color: "#16a34a", padding: "2px 7px", borderRadius: 6, fontWeight: 700 }}>Tenant: {l.tenant.name ?? `${l.tenant.first_name ?? ""} ${l.tenant.last_name ?? ""}`.trim()}</span>}
                        {!l.tenant && <span style={{ fontSize: 11, background: "#d9770615", color: "#d97706", padding: "2px 7px", borderRadius: 6, fontWeight: 700 }}>Vacant</span>}
                        {l.mortgage && <span style={{ fontSize: 11, background: "#2563eb15", color: "#2563eb", padding: "2px 7px", borderRadius: 6, fontWeight: 700 }}>{l.mortgage.lender ?? "Mortgaged"}</span>}
                      </div>
                      <p style={{ fontSize: 12, color: INK2, marginTop: 4 }}>
                        {fmt(l.totalIncome)} income · {fmt(l.totalExpenses)} expenses · {fmt(l.netProfit)} profit
                        {l.incomeGap > 0 && <span style={{ color: "#d97706", fontWeight: 700 }}> · {fmt(l.incomeGap)} est. gap</span>}
                      </p>
                    </div>
                    <span style={{ fontSize: 12, color: INK2, flexShrink: 0, marginTop: 4 }}>{expandedProp === l.property.id ? "▲" : "▼"}</span>
                  </button>

                  {expandedProp === l.property.id && (
                    <div style={{ marginTop: 12 }}>
                      {/* Passport data summary */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
                        {[
                          { label: "Purchase price", value: fmt(l.property.purchase_price ?? 0) },
                          { label: "Monthly rent", value: l.tenant?.monthly_rent ? fmt(l.tenant.monthly_rent) : "Vacant" },
                          { label: "Gross yield", value: l.property.purchase_price && l.tenant?.monthly_rent ? `${((l.tenant.monthly_rent * 12 / l.property.purchase_price) * 100).toFixed(1)}%` : "—" },
                          { label: "Mortgage rate", value: l.mortgage?.interest_rate ? `${l.mortgage.interest_rate}%` : "—" },
                          { label: "Monthly payment", value: l.mortgage?.monthly_payment ? fmt(l.mortgage.monthly_payment) : "—" },
                          { label: "Fix expiry", value: l.mortgage?.fixed_term_expiry ? fmtDate(l.mortgage.fixed_term_expiry) : "—" },
                        ].map(s => (
                          <div key={s.label} style={{ background: "#fafaf9", borderRadius: 8, padding: "9px 12px" }}>
                            <p style={{ fontSize: 10, color: INK2, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{s.label}</p>
                            <p style={{ fontSize: 13, fontWeight: 800, color: INK }}>{s.value}</p>
                          </div>
                        ))}
                      </div>

                      {/* Income section */}
                      <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(17,17,17,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Income — logged</p>
                      {l.fIncomeRows.length === 0 && l.incomeEvents.length === 0 ? (
                        <p style={{ fontSize: 12, color: INK2, marginBottom: 8 }}>No income logged for this property this tax year. Add via the Financials page.</p>
                      ) : (
                        <>
                          {l.fIncomeRows.map(i => (
                            <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "5px 0", borderBottom: `1px solid ${BORDER}` }}>
                              <span style={{ color: INK2 }}>{fmtDate(i.date)} · {i.notes || i.type} <span style={{ fontSize: 10, background: "#dcfce7", color: "#16a34a", padding: "1px 5px", borderRadius: 4, marginLeft: 4 }}>Financials</span></span>
                              <span style={{ fontWeight: 700, color: "#16a34a" }}>+{fmt(i.amount)}</span>
                            </div>
                          ))}
                          {l.incomeEvents.map(e => (
                            <div key={e.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "5px 0", borderBottom: `1px solid ${BORDER}` }}>
                              <span style={{ color: INK2 }}>{fmtDate(e.event_date)} · {e.title} <span style={{ fontSize: 10, background: "#e0e7ff", color: "#4338ca", padding: "1px 5px", borderRadius: 4, marginLeft: 4 }}>Chat</span></span>
                              <span style={{ fontWeight: 700, color: "#16a34a" }}>+{fmt(e.amount ?? 0)}</span>
                            </div>
                          ))}
                        </>
                      )}

                      {/* Estimated income gap — only show if actual logged income is less than estimate */}
                      {l.incomeGap > 0 && l.estimatedIncome > 0 && (
                        <div style={{ marginTop: 8, padding: "8px 12px", background: "#fef3c7", borderRadius: 8, borderLeft: "3px solid #d97706" }}>
                          <p style={{ fontSize: 12, color: "#92400e", fontWeight: 600 }}>
                            Tenant record suggests {fmt(l.estimatedIncome)} expected · {fmt(l.incomeGap)} may not yet be logged
                          </p>
                        </div>
                      )}

                      {/* Expenses — logged */}
                      {(l.fExpenseRows.length > 0 || l.expenseEvents.length > 0) && (
                        <>
                          <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(17,17,17,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, marginTop: 14 }}>Expenses — logged</p>
                          {l.fExpenseRows.map(e => (
                            <div key={e.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "5px 0", borderBottom: `1px solid ${BORDER}` }}>
                              <span style={{ color: INK2 }}>{fmtDate(e.date)} · {e.description} <span style={{ fontSize: 10, background: "#fee2e2", color: "#dc2626", padding: "1px 5px", borderRadius: 4, marginLeft: 4 }}>{e.category}</span> <span style={{ fontSize: 10, background: "#dcfce7", color: "#16a34a", padding: "1px 5px", borderRadius: 4 }}>Financials</span></span>
                              <span style={{ fontWeight: 700, color: "#dc2626" }}>−{fmt(e.amount)}</span>
                            </div>
                          ))}
                          {l.expenseEvents.map(e => (
                            <div key={e.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "5px 0", borderBottom: `1px solid ${BORDER}` }}>
                              <span style={{ color: INK2 }}>{fmtDate(e.event_date)} · {e.title} <span style={{ fontSize: 10, background: "#e0e7ff", color: "#4338ca", padding: "1px 5px", borderRadius: 4, marginLeft: 4 }}>Chat</span></span>
                              <span style={{ fontWeight: 700, color: "#dc2626" }}>−{fmt(e.amount ?? 0)}</span>
                            </div>
                          ))}
                        </>
                      )}

                      {/* Manual expense adjustments */}
                      <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(17,17,17,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, marginTop: 16 }}>
                        Manual expense adjustments — modify to match your records
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {([
                          ["insurance", "Buildings / contents insurance"],
                          ["agent_pct", "Letting agent fee (% of annual rent)"],
                          ["accountant", "Accountant / professional fees"],
                          ["advertising", "Advertising & listings"],
                          ["legal", "Legal fees"],
                          ["repairs_extra", "Additional repairs / maintenance"],
                          ["other", "Other allowable expenses"],
                        ] as [keyof PropAdj, string][]).map(([field, label]) => {
                          const adj = adjustments[l.property.id] ?? DEFAULT_ADJ();
                          return (
                            <div key={field} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${BORDER}` }}>
                              <p style={{ fontSize: 12, color: INK2 }}>{label}</p>
                              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <span style={{ fontSize: 12, color: INK2 }}>{field === "agent_pct" ? "" : "£"}</span>
                                <input type="number" value={adj[field] || ""} min={0} onChange={e => updateAdj(l.property.id, field, parseFloat(e.target.value) || 0)}
                                  placeholder="0"
                                  style={{ width: 80, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "4px 8px", fontSize: 12, fontFamily: "inherit", background: "white", color: INK, textAlign: "right" }} />
                                {field === "agent_pct" && <span style={{ fontSize: 11, color: INK2 }}>%</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Mortgage interest note */}
                      {l.mortgageInterest > 0 && (
                        <div style={{ marginTop: 12, padding: "8px 12px", background: "#eff6ff", borderRadius: 8 }}>
                          <p style={{ fontSize: 12, color: "#1e40af", fontWeight: 600 }}>
                            Mortgage interest (est.): {fmt(l.mortgageInterest)} → Section 24 credit: {fmt(l.mortgageInterest * 0.2)}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </Card>

            {/* SA105 Summary */}
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <SH title="SA105 — HMRC Self-Assessment Property Supplement" />
                <button onClick={() => setShowSA105(!showSA105)}
                  style={{ fontSize: 12, fontWeight: 700, background: "none", border: `1px solid ${BORDER}`, borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontFamily: "inherit", color: INK2 }}>
                  {showSA105 ? "Hide" : "Show"} boxes
                </button>
              </div>
              {showSA105 ? (
                <div>
                  <p style={{ fontSize: 12, color: "#2563eb", fontWeight: 700, marginBottom: 14, background: "#eff6ff", padding: "8px 12px", borderRadius: 8 }}>
                    Copy these figures directly into your self-assessment return (Property Income supplementary pages)
                  </p>
                  {([
                    ["Box 20", "Total rents and other receipts", fmt(result.totalIncome), INK],
                    ["Box 24", "Rent a room exempt amount", "£0", INK2],
                    ["Box 26", "Total allowable expenses (ex. finance costs)", fmt(result.totalExpenses), "#dc2626"],
                    ["Box 36", "Net profit / (loss) — Box 20 minus Box 26", fmt(result.netProfit), result.netProfit >= 0 ? INK : "#dc2626"],
                    ["Box 44", "Residential finance costs", fmt(result.totalMortgage), INK],
                    ["Box 45", "Unused finance costs brought forward", "£0", INK2],
                    ["Box 46", "Finance costs (25% of Box 44 if partially unused)", "£0", INK2],
                  ] as [string, string, string, string][]).map(([box, label, value, color]) => (
                    <div key={box} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${BORDER}`, gap: 12 }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: "white", background: CTA, padding: "2px 6px", borderRadius: 5, flexShrink: 0 }}>{box}</span>
                        <span style={{ fontSize: 13, color: INK2 }}>{label}</span>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 800, color }}>{value}</span>
                    </div>
                  ))}
                  <p style={{ fontSize: 11, color: INK2, marginTop: 12, fontStyle: "italic", lineHeight: 1.6 }}>
                    Note: Box 44 uses estimated monthly payment × 12. The interest-only portion may differ — use your lender&apos;s annual statement for the exact figure. Always confirm with your accountant.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {[
                    { box: "Box 20", val: fmt(result.totalIncome), label: "Total income" },
                    { box: "Box 26", val: fmt(result.totalExpenses), label: "Total expenses" },
                    { box: "Box 36", val: fmt(result.netProfit), label: "Net profit" },
                    { box: "Box 44", val: fmt(result.totalMortgage), label: "Finance costs" },
                  ].map(s => (
                    <div key={s.box} style={{ background: "#fafaf9", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "10px 14px", minWidth: 120 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: "white", background: CTA, padding: "2px 6px", borderRadius: 5 }}>{s.box}</span>
                      <p style={{ fontSize: 16, fontWeight: 900, color: INK, marginTop: 6 }}>{s.val}</p>
                      <p style={{ fontSize: 11, color: INK2 }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* What-if simulator */}
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showWhatIf ? 16 : 0 }}>
                <SH title="What-if simulator" />
                <button onClick={() => setShowWhatIf(!showWhatIf)}
                  style={{ fontSize: 12, fontWeight: 700, background: "none", border: `1px solid ${BORDER}`, borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontFamily: "inherit", color: INK2 }}>
                  {showWhatIf ? "Hide" : "Open"}
                </button>
              </div>
              {showWhatIf && (
                <div>
                  <p style={{ fontSize: 13, color: INK2, marginBottom: 16 }}>
                    See the tax impact of spending more on repairs before 5 April — or of raising rent next year.
                  </p>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <label style={{ fontSize: 13, fontWeight: 700, color: INK }}>Additional repair spend before April 5</label>
                      <span style={{ fontSize: 14, fontWeight: 900, color: INK }}>{fmt(whatIfSpend)}</span>
                    </div>
                    <input type="range" min={0} max={20000} step={500} value={whatIfSpend} onChange={e => setWhatIfSpend(Number(e.target.value))}
                      style={{ width: "100%", accentColor: CTA }} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: INK2, marginTop: 4 }}>
                      <span>£0</span><span>£20,000</span>
                    </div>
                  </div>
                  {whatIfSpend > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {[
                        { label: "Tax saving", value: fmt(whatIfSpend * taxRate), color: "#16a34a" },
                        { label: "Net cost to you", value: fmt(whatIfSpend - whatIfSpend * taxRate), color: INK },
                        { label: "New tax owed", value: fmt(Math.max(0, result.netTaxOwed - whatIfSpend * taxRate)), color: "#dc2626" },
                        { label: "vs. current estimate", value: `−${fmt(whatIfSpend * taxRate)}`, color: "#16a34a" },
                      ].map(s => (
                        <div key={s.label} style={{ background: "#fafaf9", borderRadius: 10, padding: "12px 14px" }}>
                          <p style={{ fontSize: 11, color: INK2, marginBottom: 4 }}>{s.label}</p>
                          <p style={{ fontSize: 18, fontWeight: 900, color: s.color }}>{s.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* UK tax reference */}
            <div style={{ background: "white", borderRadius: 14, padding: "20px 24px", border: `1px solid ${BORDER}` }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: "rgba(17,17,17,0.38)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>How rental income is taxed (UK {taxYear.label})</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 10 }}>
                {[
                  ["Personal allowance", "£12,570 — no tax on income below this"],
                  ["Basic rate (20%)", "Income £12,571 – £50,270"],
                  ["Higher rate (40%)", "Income £50,271 – £125,140"],
                  ["Additional rate (45%)", "Income above £125,140"],
                  ["Section 24 restriction", "Mortgage interest gives 20% credit only — not a profit deduction"],
                  ["Property allowance", "£1,000 tax-free if total rental income below £1,000"],
                  ["Capital gains", "18% (basic rate) / 24% (higher rate) on residential property gains; 60-day CGT report to HMRC on sale"],
                  ["MTD for Income Tax", ">£50k: April 2026; >£30k: April 2027 — quarterly digital filing required"],
                ].map(([label, desc]) => (
                  <div key={label} style={{ padding: "11px 14px", background: "#fafaf9", borderRadius: 9 }}>
                    <p style={{ fontSize: 12, fontWeight: 800, marginBottom: 4 }}>{label}</p>
                    <p style={{ fontSize: 12, color: INK2, lineHeight: 1.5 }}>{desc}</p>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: INK2, marginTop: 12, fontStyle: "italic" }}>Source: HMRC. Confirm rates with a qualified accountant.</p>
            </div>
          </div>

          {/* ── RIGHT COLUMN ───────────────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Confidence */}
            <Card>
              <SH title="Tax confidence" />
              <ConfBar score={result.confidence} />
              <p style={{ fontSize: 12, color: INK2, marginTop: 10, lineHeight: 1.6 }}>
                {result.confidence >= 80 ? "Good coverage. Share with your accountant to finalise." : result.confidence >= 60 ? "Reasonable estimate. Add missing expenses to improve accuracy." : "Too many gaps. Log income and expenses, then complete the checklist below."}
              </p>
            </Card>

            {/* Missing items */}
            {result.missing.length > 0 && (
              <Card>
                <SH title="Improve your estimate" />
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {result.missing.map((m, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{ color: "#d97706", flexShrink: 0, marginTop: 2, fontSize: 11 }}>○</span>
                      <p style={{ fontSize: 12, color: INK, lineHeight: 1.5 }}>{m}</p>
                    </div>
                  ))}
                </div>
                <Link href="/rentura/dashboard" style={{ display: "block", marginTop: 14, textAlign: "center", fontSize: 13, fontWeight: 700, color: CTA, textDecoration: "none", background: BG, padding: "9px 0", borderRadius: 8 }}>
                  Log transactions →
                </Link>
              </Card>
            )}

            {/* Key figures */}
            <Card>
              <SH title="Key figures" />
              {[
                ["Gross income", fmt(result.totalIncome)],
                ["Allowable expenses", fmt(result.totalExpenses)],
                ["Mortgage interest", fmt(result.totalMortgage)],
                ["Finance cost credit", fmt(result.financeCredit)],
                ["S24 extra cost", result.s24ExtraCost > 0 ? fmt(result.s24ExtraCost) : "None"],
                ["Net tax estimate", fmt(result.netTaxOwed)],
                ["Effective yield", (() => {
                  const total = properties.reduce((s, p) => s + (p.purchase_price ?? 0), 0);
                  return total > 0 ? `${((result.totalIncome / total) * 100).toFixed(1)}%` : "—";
                })()],
                ["Post-tax yield", (() => {
                  const total = properties.reduce((s, p) => s + (p.purchase_price ?? 0), 0);
                  const afterTax = result.totalIncome - result.netTaxOwed;
                  return total > 0 ? `${((afterTax / total) * 100).toFixed(1)}%` : "—";
                })()],
              ].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${BORDER}` }}>
                  <span style={{ fontSize: 12, color: INK2 }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: INK }}>{val}</span>
                </div>
              ))}
            </Card>

            {/* Payments on account */}
            <Card>
              <SH title="HMRC payment schedule" />
              <div style={{ padding: "10px 12px", background: "#eff6ff", borderRadius: 9, marginBottom: 10 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#1e40af", marginBottom: 2 }}>31 January {poaYear + 1}</p>
                <p style={{ fontSize: 11, color: "#3730a3" }}>Balancing payment for {taxYear.label} + 1st payment on account</p>
                <p style={{ fontSize: 14, fontWeight: 900, color: "#1e40af", marginTop: 4 }}>{fmt(result.netTaxOwed * 1.5)} est.</p>
              </div>
              <div style={{ padding: "10px 12px", background: "#f0fdf4", borderRadius: 9 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBottom: 2 }}>31 July {poaYear + 1}</p>
                <p style={{ fontSize: 11, color: "#15803d" }}>2nd payment on account</p>
                <p style={{ fontSize: 14, fontWeight: 900, color: "#166534", marginTop: 4 }}>{fmt(result.netTaxOwed * 0.5)} est.</p>
              </div>
              <p style={{ fontSize: 11, color: INK2, marginTop: 10, lineHeight: 1.5 }}>Payments on account = 50% of current year estimate. Actual amounts set by HMRC after submission. Based on tax estimate above.</p>
            </Card>

            {/* Missed expenses checklist */}
            <Card>
              <SH title="Expenses checklist — commonly missed" />
              <p style={{ fontSize: 12, color: INK2, marginBottom: 12, lineHeight: 1.5 }}>Tick any you have — update the amounts to match your receipts. These update your tax estimate live.</p>
              {MISSED_ITEMS.map(item => {
                const state = missed[item.key];
                return (
                  <div key={item.key} style={{ borderBottom: `1px solid ${BORDER}`, paddingBottom: 8, marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input type="checkbox" checked={state?.checked ?? false} onChange={() => toggleMissed(item.key)}
                        style={{ width: 15, height: 15, accentColor: CTA, cursor: "pointer", flexShrink: 0 }} />
                      <label style={{ fontSize: 12, color: state?.checked ? INK : INK2, fontWeight: state?.checked ? 700 : 400, cursor: "pointer", flex: 1 }}
                        onClick={() => toggleMissed(item.key)}>
                        {item.label}
                      </label>
                      {state?.checked && (
                        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                          <span style={{ fontSize: 11, color: INK2 }}>£</span>
                          <input type="number" value={state.amount || ""} min={0} onChange={e => updateMissedAmt(item.key, parseFloat(e.target.value) || 0)}
                            style={{ width: 70, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "3px 6px", fontSize: 12, fontFamily: "inherit", textAlign: "right" }} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {result.missedTotal > 0 && (
                <div style={{ marginTop: 8, padding: "8px 12px", background: "#16a34a10", borderRadius: 8, borderLeft: "3px solid #16a34a" }}>
                  <p style={{ fontSize: 12, color: "#16a34a", fontWeight: 700 }}>
                    {fmt(result.missedTotal)} additional expenses → saves approx. {fmt(result.missedTotal * taxRate)} in tax
                  </p>
                </div>
              )}
            </Card>

            {/* Accountant export */}
            <div style={{ background: CTA, borderRadius: 14, padding: "20px 22px", color: "white" }}>
              <p style={{ fontSize: 14, fontWeight: 800, marginBottom: 6 }}>Ready for your accountant</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: 14 }}>
                Export a CSV with all transactions categorised by HMRC type, or print this page as a PDF with all figures and confidence ratings.
              </p>
              <button onClick={() => exportCSV(result.lines, taxYear, missed, fExpenses, fIncome)}
                style={{ background: "white", color: CTA, fontWeight: 800, fontSize: 13, padding: "10px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "inherit", width: "100%", marginBottom: 8 }}>
                Download CSV for accountant →
              </button>
              <button onClick={() => window.print()}
                style={{ background: "transparent", color: "rgba(255,255,255,0.7)", fontWeight: 700, fontSize: 13, padding: "9px 18px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.25)", cursor: "pointer", fontFamily: "inherit", width: "100%" }}>
                Save as PDF
              </button>
            </div>

          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
