"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RenturaSidebar } from "@/components/rentura/RenturaSidebar";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

// ── Colours ────────────────────────────────────────────────────────────────────
const BG = "#eceae2";
const INK = "#111111";
const INK2 = "rgba(17,17,17,0.52)";
const INK3 = "rgba(17,17,17,0.3)";
const BORDER = "rgba(17,17,17,0.09)";
const CTA = "#0f1728";
const RED = "#dc2626";
const AMBER = "#d97706";
const GREEN = "#15803d";
const BLUE = "#2563eb";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Property {
  id: string;
  address: string;
  property_type: string | null;
  bedrooms: number | null;
}

interface Tenant {
  id: string;
  property_id: string | null;
  first_name: string;
  last_name: string;
  tenancy_start: string | null;
  tenancy_end: string | null;
  monthly_rent: number | null;
  deposit_amount: number | null;
  deposit_held: boolean | null;
  status: string;
}

interface Cert {
  id: string;
  property_id: string | null;
  certificate_type: string;
  issue_date: string | null;
  expiry_date: string | null;
}

// ── Check definitions ──────────────────────────────────────────────────────────
type Severity = "critical" | "high" | "medium";
type CheckResult = "pass" | "fail" | "unknown" | "na";

interface Check {
  key: string;
  label: string;
  detail: string;
  action: string;
  severity: Severity;
}

const PROPERTY_CHECKS: Check[] = [
  {
    key: "gas_safety",
    label: "Gas Safety Certificate is current",
    detail: "Required annually. Must be served to tenant within 28 days of check. Without it, a Section 8 notice cannot be validly served.",
    action: "Book annual Gas Safe registered engineer check. Log certificate in Compliance page.",
    severity: "critical",
  },
  {
    key: "epc",
    label: "EPC rating E or above (valid)",
    detail: "Minimum EPC E required to let legally. Certificate must be valid (10-year lifespan). Must be provided to tenant at start of tenancy.",
    action: "Commission a new EPC if expired or rating below E. Log in Compliance page.",
    severity: "critical",
  },
  {
    key: "eicr",
    label: "EICR (electrical check) in date",
    detail: "Electrical Installation Condition Report required every 5 years. Must be provided to tenants within 28 days. Prerequisite for valid Section 8 service.",
    action: "Book a registered electrician. Log the EICR in Compliance page.",
    severity: "critical",
  },
  {
    key: "how_to_rent",
    label: '"How to Rent" guide served to current tenant',
    detail: "Government guide must be served at tenancy start or whenever a new version is published. Failure invalidates Section 8 notices.",
    action: "Download latest version from GOV.UK and email or hand-deliver to tenant. Keep proof.",
    severity: "critical",
  },
  {
    key: "deposit_protected",
    label: "Deposit protected in approved scheme",
    detail: "Deposit must be protected within 30 days of receipt. Prescribed Information must be served. Unprotected deposit invalidates Section 8 (Ground 1/1A).",
    action: "Register deposit with DPS, MyDeposits, or TDS. Serve Prescribed Information to tenant.",
    severity: "critical",
  },
  {
    key: "prescribed_info",
    label: "Prescribed Information served to tenant",
    detail: "Separate to deposit protection — you must serve written Prescribed Information about the deposit scheme within 30 days of receiving the deposit.",
    action: "Obtain PI certificate from your deposit scheme portal and serve to tenant. Keep a copy.",
    severity: "critical",
  },
  {
    key: "no_s21_reliance",
    label: "Not relying on Section 21 to regain possession",
    detail: "Section 21 (no-fault eviction) is abolished under the Renters' Rights Act 2025. Any outstanding plans to use Section 21 must be reconsidered now.",
    action: "Identify which Section 8 ground applies to your situation (see grounds reference below). Take legal advice if needed.",
    severity: "critical",
  },
  {
    key: "tenancy_type_understood",
    label: "Understand tenancy will become periodic",
    detail: "All fixed-term ASTs automatically convert to periodic tenancies under the Renters' Rights Act 2025. You can no longer end a tenancy simply because the fixed term has expired.",
    action: "Note when fixed terms expire. Plan possession strategy using Section 8 grounds if needed.",
    severity: "high",
  },
  {
    key: "rent_increase_method",
    label: "Using Section 13 for rent increases (not contract clauses)",
    detail: "Contractual rent review clauses (e.g., 'rent increases annually by CPI') are unenforceable under the Renters' Rights Act 2025. Rent can only rise once per year via Section 13 with 2 months' notice.",
    action: "Stop relying on contractual rent clauses. Use Section 13 Form 4 for all future increases.",
    severity: "high",
  },
  {
    key: "smoke_alarms",
    label: "Smoke and CO alarms fitted and tested",
    detail: "Smoke alarm required on every floor, CO alarm in every room with a gas appliance. Must be tested at start of each tenancy.",
    action: "Check alarms are fitted. Test and log in Compliance page.",
    severity: "high",
  },
  {
    key: "pet_policy",
    label: "No blanket 'no pets' clause in tenancy",
    detail: "Under the Renters' Rights Act 2025, landlords cannot unreasonably refuse a tenant's request to keep a pet. A blanket ban in the tenancy agreement is unenforceable.",
    action: "Review tenancy agreement. Replace blanket ban with a 'pets permitted with written consent' clause. Consider requiring pet damage insurance.",
    severity: "medium",
  },
];

const PORTFOLIO_CHECKS: Check[] = [
  {
    key: "ombudsman",
    label: "Joined the PRS Ombudsman scheme",
    detail: "All private landlords in England must join the mandatory PRS Ombudsman scheme — now in force. Failure to join is a criminal offence (fine up to £5,000 per property).",
    action: "Register at the government's landlord registration portal. Do not delay — enforcement is active.",
    severity: "high",
  },
  {
    key: "property_portal",
    label: "Properties registered on the new Rented Property Portal",
    detail: "All private landlords must register each property on the new government Rented Sector Property Portal. Failure to register means you cannot legally let the property.",
    action: "Register each property on the Rented Property Portal when your registration window opens. Monitor GOV.UK for your area's rollout date.",
    severity: "high",
  },
  {
    key: "decent_homes",
    label: "Aware of Decent Homes Standard applying to PRS",
    detail: "The Decent Homes Standard now extends to the private rented sector. Properties must be structurally sound, free from Category 1 HHSRS hazards, with modern facilities.",
    action: "Assess each property against the DHS criteria. Address outstanding maintenance. Log in Maintenance page.",
    severity: "medium",
  },
];

// Severity helpers
const SEV_COLOR: Record<Severity, string> = { critical: RED, high: AMBER, medium: BLUE };
const SEV_BG: Record<Severity, string> = { critical: "#fef2f2", high: "#fffbeb", medium: "#eff6ff" };
const SEV_LABEL: Record<Severity, string> = { critical: "Critical", high: "High", medium: "Medium" };

// ── Automatic check derivation ─────────────────────────────────────────────────
function deriveAutoChecks(
  property: Property,
  tenant: Tenant | null,
  certs: Cert[],
): Record<string, CheckResult> {
  const propCerts = certs.filter(c => c.property_id === property.id);
  const today = new Date().toISOString().split("T")[0];

  const certValid = (type: string) => {
    const c = propCerts.find(c => c.certificate_type === type && c.expiry_date && c.expiry_date >= today);
    return c ? "pass" : propCerts.some(c => c.certificate_type === type) ? "fail" : "unknown";
  };

  const gas = certValid("Gas Safety Certificate") as CheckResult;
  const epc = certValid("Energy Performance Certificate (EPC)") as CheckResult;
  const eicr = certValid("Electrical Installation Condition Report (EICR)") as CheckResult;

  let depositProtected: CheckResult = "unknown";
  if (tenant) {
    if (tenant.deposit_held === true) depositProtected = "pass";
    else if (tenant.deposit_held === false) depositProtected = "fail";
  } else {
    depositProtected = "na";
  }

  let tenancyTypeUnderstood: CheckResult = "unknown";
  if (tenant) {
    // If tenancy_end is set and in the future, it's still fixed-term — mark as needing action
    if (tenant.tenancy_end && tenant.tenancy_end > today) tenancyTypeUnderstood = "fail";
    else tenancyTypeUnderstood = "pass"; // already periodic or no end date
  } else {
    tenancyTypeUnderstood = "na";
  }

  const smokeAlarmsCheck = certValid("Smoke Alarm Check") as CheckResult;

  return {
    gas_safety: gas,
    epc: epc,
    eicr: eicr,
    deposit_protected: depositProtected,
    tenancy_type_understood: tenancyTypeUnderstood,
    smoke_alarms: smokeAlarmsCheck,
  };
}

// ── LocalStorage persistence ───────────────────────────────────────────────────
function lsKey(propertyId: string) { return `rrb_manual_${propertyId}`; }
function lsPortfolioKey() { return "rrb_portfolio"; }

function loadManual(propertyId: string): Record<string, CheckResult> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(lsKey(propertyId)) ?? "{}"); } catch { return {}; }
}
function saveManual(propertyId: string, state: Record<string, CheckResult>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(lsKey(propertyId), JSON.stringify(state));
}
function loadPortfolio(): Record<string, CheckResult> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(lsPortfolioKey()) ?? "{}"); } catch { return {}; }
}
function savePortfolio(state: Record<string, CheckResult>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(lsPortfolioKey(), JSON.stringify(state));
}

// ── Score helpers ──────────────────────────────────────────────────────────────
function score(results: Record<string, CheckResult>, checks: Check[]): { passed: number; total: number; pct: number; critical: number } {
  const applicable = checks.filter(c => results[c.key] !== "na");
  const passed = applicable.filter(c => results[c.key] === "pass").length;
  const critical = applicable.filter(c => results[c.key] !== "pass" && c.severity === "critical").length;
  const total = applicable.length;
  return { passed, total, pct: total === 0 ? 100 : Math.round((passed / total) * 100), critical };
}

function scoreColor(pct: number) { return pct >= 80 ? GREEN : pct >= 50 ? AMBER : RED; }
function scoreLabel(pct: number) { return pct >= 80 ? "Well prepared" : pct >= 50 ? "Action needed" : "At risk"; }

// ── Result icon ────────────────────────────────────────────────────────────────
function ResultIcon({ result }: { result: CheckResult }) {
  if (result === "pass") return <span style={{ color: GREEN, fontWeight: 900, fontSize: 15, flexShrink: 0 }}>✓</span>;
  if (result === "fail") return <span style={{ color: RED, fontWeight: 900, fontSize: 15, flexShrink: 0 }}>✕</span>;
  if (result === "na") return <span style={{ color: INK3, fontWeight: 700, fontSize: 12, flexShrink: 0 }}>—</span>;
  return <span style={{ color: AMBER, fontWeight: 900, fontSize: 14, flexShrink: 0 }}>?</span>;
}

// ── Toggle button ──────────────────────────────────────────────────────────────
function ManualToggle({ result, onChange }: { result: CheckResult; onChange: (r: CheckResult) => void }) {
  return (
    <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
      {(["pass", "fail", "unknown"] as CheckResult[]).map(v => (
        <button key={v} onClick={() => onChange(v)}
          style={{
            fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 5, cursor: "pointer", fontFamily: "inherit",
            border: `1px solid ${result === v ? (v === "pass" ? GREEN : v === "fail" ? RED : AMBER) : BORDER}`,
            background: result === v ? (v === "pass" ? `${GREEN}18` : v === "fail" ? `${RED}18` : `${AMBER}18`) : "white",
            color: result === v ? (v === "pass" ? GREEN : v === "fail" ? RED : AMBER) : INK2,
          }}>
          {v === "pass" ? "Done" : v === "fail" ? "Not done" : "?"}
        </button>
      ))}
    </div>
  );
}

// ── Card ───────────────────────────────────────────────────────────────────────
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 16, padding: "22px 26px", ...style }}>{children}</div>;
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function RRBPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Stable "now" for the life of the mount. Calling Date.now() during render is
  // impure and made the expiry countdown drift between renders.
  const [now] = useState(() => Date.now());
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [certs, setCerts] = useState<Cert[]>([]);
  const [loading, setLoading] = useState(true);

  // manual check states
  const [manualStates, setManualStates] = useState<Record<string, Record<string, CheckResult>>>({});
  const [portfolioState, setPortfolioState] = useState<Record<string, CheckResult>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!user) { router.push("/rentura/auth?next=/rentura/rrb"); return; }
    async function load() {
      const [pR, tR, cR] = await Promise.all([
        supabase.from("rentura_properties").select("id,address,property_type,bedrooms").eq("user_id", user!.id),
        supabase.from("rentura_tenants").select("id,property_id,first_name,last_name,tenancy_start,tenancy_end,monthly_rent,deposit_amount,deposit_held,status").eq("user_id", user!.id).eq("status", "active"),
        supabase.from("rentura_compliance").select("id,property_id,certificate_type,issue_date,expiry_date"),
      ]);
      setProperties(pR.data ?? []);
      setTenants((tR.data ?? []) as Tenant[]);
      setCerts((cR.data ?? []) as Cert[]);
      setLoading(false);
    }
    load();
  }, [user, router]);

  // Hydrate from localStorage after first render
  useEffect(() => {
    if (loading || hydrated) return;
    const pm: Record<string, Record<string, CheckResult>> = {};
    for (const p of properties) pm[p.id] = loadManual(p.id);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrates saved check state from localStorage, which is unavailable during render
    setManualStates(pm);
    setPortfolioState(loadPortfolio());
    setHydrated(true);
  }, [loading, properties, hydrated]);

  const updateManual = useCallback((propId: string, key: string, val: CheckResult) => {
    setManualStates(prev => {
      const next = { ...prev, [propId]: { ...(prev[propId] ?? {}), [key]: val } };
      saveManual(propId, next[propId]);
      return next;
    });
  }, []);

  const updatePortfolio = useCallback((key: string, val: CheckResult) => {
    setPortfolioState(prev => {
      const next = { ...prev, [key]: val };
      savePortfolio(next);
      return next;
    });
  }, []);

  // Build combined results per property
  const propResults = properties.map(p => {
    const tenant = tenants.find(t => t.property_id === p.id) ?? null;
    const auto = deriveAutoChecks(p, tenant, certs);
    const manual = manualStates[p.id] ?? {};
    // Merge: auto takes precedence for automated keys; manual fills the rest
    const all: Record<string, CheckResult> = {};
    for (const c of PROPERTY_CHECKS) {
      if (auto[c.key] !== undefined) all[c.key] = auto[c.key];
      else all[c.key] = manual[c.key] ?? "unknown";
    }
    const s = score(all, PROPERTY_CHECKS);
    return { property: p, tenant, all, auto, manual, ...s };
  });

  const portfolioResults: Record<string, CheckResult> = {};
  for (const c of PORTFOLIO_CHECKS) portfolioResults[c.key] = portfolioState[c.key] ?? "unknown";
  const portScore = score(portfolioResults, PORTFOLIO_CHECKS);

  const overallPct = Math.round(
    (propResults.reduce((s, r) => s + r.pct, 0) + portScore.pct) / (propResults.length + 1)
  ) || 0;
  const totalCritical = propResults.reduce((s, r) => s + r.critical, 0) + portScore.critical;
  const totalActions = propResults.reduce((s, r) => s + (r.total - r.passed), 0) + (portScore.total - portScore.passed);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{`body > header, body > footer { display: none !important; }`}</style>
        <p style={{ color: INK2, fontSize: 14 }}>Loading readiness checker…</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "var(--font-family-body, sans-serif)", background: BG, color: INK, minHeight: "100vh", display: "flex" }}>
      <style>{`body > header, body > footer { display: none !important; } @media print { nav, .no-print { display: none !important; } }`}</style>
      <RenturaSidebar />

      <div style={{ flex: 1, overflowY: "auto" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* Header */}
        <div style={{ padding: "36px 0 0" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${RED}15`, border: `1px solid ${RED}30`, borderRadius: 8, padding: "5px 12px", marginBottom: 14 }}>
            <span style={{ fontSize: 12 }}>⚖</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: RED, textTransform: "uppercase", letterSpacing: "0.08em" }}>Royal Assent 2025 — Action Required</span>
          </div>
          <h1 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, fontFamily: "var(--font-family-heading, sans-serif)", marginBottom: 8 }}>
            Renters' Rights Act 2025<br />Compliance Checker
          </h1>
          <p style={{ fontSize: 14, color: INK2, maxWidth: 560, lineHeight: 1.6 }}>
            Now in force. Section 21 is abolished, all tenancies are periodic, and new obligations apply to every landlord in England. Check your compliance status below.
          </p>
        </div>

        {/* Portfolio banner */}
        <div style={{ margin: "28px 0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(160px, 100%), 1fr))", gap: 12 }}>
          {[
            { label: "Portfolio readiness", value: `${overallPct}%`, color: scoreColor(overallPct), sub: scoreLabel(overallPct) },
            { label: "Critical gaps", value: String(totalCritical), color: totalCritical > 0 ? RED : GREEN, sub: totalCritical > 0 ? "Need immediate action" : "None found" },
            { label: "Actions needed", value: String(totalActions), color: totalActions > 0 ? AMBER : GREEN, sub: `across ${properties.length} properties` },
            { label: "Properties checked", value: String(properties.length), color: CTA, sub: `${tenants.length} with active tenants` },
          ].map(s => (
            <div key={s.label} style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, padding: "16px 18px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: INK3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{s.label}</p>
              <p style={{ fontSize: 24, fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: 4 }}>{s.value}</p>
              <p style={{ fontSize: 11, color: INK2 }}>{s.sub}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}>

          {/* ── LEFT ──────────────────────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Per-property cards */}
            {propResults.length === 0 ? (
              <Card>
                <p style={{ fontSize: 14, color: INK2 }}>No properties found. <Link href="/rentura/properties/new" style={{ color: BLUE }}>Add a property</Link> to get started.</p>
              </Card>
            ) : propResults.map(r => {
              const isOpen = expanded === r.property.id;
              const tenant = r.tenant;
              const tenantName = tenant ? `${tenant.first_name} ${tenant.last_name}`.trim() : null;

              // Fixed-term check: tenancy_end in the future
              const today = new Date().toISOString().split("T")[0];
              const isFixedTerm = tenant?.tenancy_end && tenant.tenancy_end > today;
              const daysToExpiry = isFixedTerm ? Math.ceil((new Date(tenant!.tenancy_end!).getTime() - now) / 86400000) : null;

              return (
                <Card key={r.property.id} style={{ padding: "0" }}>
                  {/* Property header */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : r.property.id)}
                    style={{ width: "100%", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, textAlign: "left" }}>
                    {/* Score ring */}
                    <div style={{ width: 52, height: 52, borderRadius: "50%", border: `3px solid ${scoreColor(r.pct)}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: `${scoreColor(r.pct)}10` }}>
                      <span style={{ fontSize: 14, fontWeight: 900, color: scoreColor(r.pct) }}>{r.pct}%</span>
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                        <p style={{ fontSize: 14, fontWeight: 800, color: INK }}>{r.property.address.split(",")[0]}</p>
                        {isFixedTerm && (
                          <span style={{ fontSize: 10, fontWeight: 700, background: `${AMBER}20`, color: AMBER, padding: "2px 7px", borderRadius: 5 }}>
                            Fixed term — {daysToExpiry}d left
                          </span>
                        )}
                        {!tenant && <span style={{ fontSize: 10, fontWeight: 700, background: `${INK3}30`, color: INK2, padding: "2px 7px", borderRadius: 5 }}>Vacant</span>}
                        {tenant && !isFixedTerm && <span style={{ fontSize: 10, fontWeight: 700, background: `${GREEN}15`, color: GREEN, padding: "2px 7px", borderRadius: 5 }}>Periodic</span>}
                      </div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                        {tenantName && <p style={{ fontSize: 12, color: INK2 }}>Tenant: {tenantName}</p>}
                        {r.critical > 0 && <span style={{ fontSize: 11, color: RED, fontWeight: 700 }}>· {r.critical} critical gap{r.critical > 1 ? "s" : ""}</span>}
                        {r.critical === 0 && r.passed === r.total && <span style={{ fontSize: 11, color: GREEN, fontWeight: 700 }}>· All checks passed</span>}
                      </div>
                    </div>

                    {/* Check summary pills */}
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <div style={{ textAlign: "center" }}>
                        <p style={{ fontSize: 14, fontWeight: 900, color: GREEN }}>{r.passed}</p>
                        <p style={{ fontSize: 10, color: INK3 }}>Pass</p>
                      </div>
                      <div style={{ width: 1, background: BORDER }} />
                      <div style={{ textAlign: "center" }}>
                        <p style={{ fontSize: 14, fontWeight: 900, color: RED }}>{r.total - r.passed}</p>
                        <p style={{ fontSize: 10, color: INK3 }}>Action</p>
                      </div>
                    </div>

                    <span style={{ color: INK3, fontSize: 12, flexShrink: 0 }}>{isOpen ? "▲" : "▼"}</span>
                  </button>

                  {/* Fixed-term warning banner */}
                  {isFixedTerm && (
                    <div style={{ margin: "0 24px 16px", padding: "10px 14px", background: `${AMBER}12`, border: `1px solid ${AMBER}30`, borderRadius: 10 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#92400e" }}>
                        Fixed-term expires {new Date(tenant!.tenancy_end!).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} ({daysToExpiry} days)
                      </p>
                      <p style={{ fontSize: 12, color: "#78350f", marginTop: 3, lineHeight: 1.5 }}>
                        Under the Renters' Rights Act 2025, this has automatically converted to a periodic tenancy — you cannot use expiry of the fixed term as a basis for possession. If you need possession, identify which Section 8 ground applies and serve notice in advance.
                      </p>
                    </div>
                  )}

                  {/* Expanded checks */}
                  {isOpen && (
                    <div style={{ borderTop: `1px solid ${BORDER}`, padding: "20px 24px" }}>
                      {PROPERTY_CHECKS.map(check => {
                        const result = r.all[check.key];
                        const isAuto = r.auto[check.key] !== undefined;
                        const isNA = result === "na";

                        return (
                          <div key={check.key} style={{
                            padding: "12px 0", borderBottom: `1px solid ${BORDER}`,
                            opacity: isNA ? 0.45 : 1,
                          }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                              <ResultIcon result={result} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                                  <p style={{ fontSize: 13, fontWeight: 700, color: INK }}>{check.label}</p>
                                  <span style={{
                                    fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4,
                                    background: SEV_BG[check.severity], color: SEV_COLOR[check.severity]
                                  }}>{SEV_LABEL[check.severity]}</span>
                                  {isAuto && <span style={{ fontSize: 10, color: INK3, fontWeight: 600 }}>Auto-detected</span>}
                                  {isNA && <span style={{ fontSize: 10, color: INK3 }}>Not applicable (no tenant)</span>}
                                </div>
                                <p style={{ fontSize: 12, color: INK2, lineHeight: 1.55 }}>{check.detail}</p>
                                {result !== "pass" && !isNA && (
                                  <div style={{ marginTop: 8, padding: "7px 10px", background: "#f9f8f6", borderRadius: 7, borderLeft: `2px solid ${SEV_COLOR[check.severity]}` }}>
                                    <p style={{ fontSize: 11, color: INK, fontWeight: 600 }}>→ {check.action}</p>
                                  </div>
                                )}
                              </div>
                              {!isAuto && !isNA && (
                                <ManualToggle result={result} onChange={v => updateManual(r.property.id, check.key, v)} />
                              )}
                              {isAuto && !isNA && (
                                <div style={{ flexShrink: 0 }}>
                                  {result === "pass" && <span style={{ fontSize: 11, color: GREEN, fontWeight: 700 }}>Valid ✓</span>}
                                  {result === "fail" && (
                                    <Link href="/rentura/compliance" style={{ fontSize: 11, color: BLUE, fontWeight: 700, textDecoration: "none" }}>
                                      Update →
                                    </Link>
                                  )}
                                  {result === "unknown" && (
                                    <Link href="/rentura/compliance" style={{ fontSize: 11, color: AMBER, fontWeight: 700, textDecoration: "none" }}>
                                      Add cert →
                                    </Link>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Per-property actions summary */}
                      {r.total - r.passed > 0 && (
                        <div style={{ marginTop: 16, padding: "12px 14px", background: `${RED}08`, border: `1px solid ${RED}20`, borderRadius: 10 }}>
                          <p style={{ fontSize: 12, fontWeight: 800, color: RED, marginBottom: 6 }}>Action summary for this property</p>
                          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {PROPERTY_CHECKS.filter(c => r.all[c.key] !== "pass" && r.all[c.key] !== "na").map(c => (
                              <li key={c.key} style={{ fontSize: 12, color: INK, padding: "3px 0", display: "flex", gap: 6 }}>
                                <span style={{ color: SEV_COLOR[c.severity], flexShrink: 0 }}>•</span>
                                {c.action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}

            {/* Portfolio-wide checks */}
            <Card>
              <p style={{ fontSize: 11, fontWeight: 800, color: INK3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
                Portfolio-wide obligations — tick when done
              </p>
              {PORTFOLIO_CHECKS.map(check => {
                const result = portfolioResults[check.key];
                return (
                  <div key={check.key} style={{ padding: "14px 0", borderBottom: `1px solid ${BORDER}` }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <ResultIcon result={result} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: INK }}>{check.label}</p>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: SEV_BG[check.severity], color: SEV_COLOR[check.severity] }}>
                            {SEV_LABEL[check.severity]}
                          </span>
                        </div>
                        <p style={{ fontSize: 12, color: INK2, lineHeight: 1.55 }}>{check.detail}</p>
                        {result !== "pass" && (
                          <div style={{ marginTop: 8, padding: "7px 10px", background: "#f9f8f6", borderRadius: 7, borderLeft: `2px solid ${SEV_COLOR[check.severity]}` }}>
                            <p style={{ fontSize: 11, color: INK, fontWeight: 600 }}>→ {check.action}</p>
                          </div>
                        )}
                      </div>
                      <ManualToggle result={result} onChange={v => updatePortfolio(check.key, v)} />
                    </div>
                  </div>
                );
              })}
            </Card>

          </div>

          {/* ── RIGHT SIDEBAR ─────────────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Key dates */}
            <Card>
              <p style={{ fontSize: 11, fontWeight: 800, color: INK3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Key dates</p>
              {[
                { label: "Royal Assent", date: "March 2025", note: "Renters' Rights Act 2025 becomes law", color: RED },
                { label: "Commencement", date: "June 2025", note: "All provisions now in force", color: RED },
                { label: "Section 21 abolished", date: "June 2025", note: "No more no-fault evictions — in force now", color: RED },
                { label: "All tenancies periodic", date: "June 2025", note: "Fixed terms expired into periodic", color: AMBER },
                { label: "PRS Ombudsman", date: "In force", note: "Mandatory now — fine up to £5,000/property", color: AMBER },
                { label: "Property Portal", date: "Rolling rollout", note: "Registration required when your area goes live", color: AMBER },
                { label: "Decent Homes Standard", date: "In force", note: "PRS properties must meet DHS", color: BLUE },
              ].map(d => (
                <div key={d.label} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: `1px solid ${BORDER}` }}>
                  <div style={{ width: 3, background: d.color, borderRadius: 2, flexShrink: 0, alignSelf: "stretch" }} />
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 800, color: INK }}>{d.label}</p>
                    <p style={{ fontSize: 11, fontWeight: 700, color: d.color, marginTop: 1 }}>{d.date}</p>
                    <p style={{ fontSize: 11, color: INK2 }}>{d.note}</p>
                  </div>
                </div>
              ))}
            </Card>

            {/* Section 8 grounds reference */}
            <Card>
              <p style={{ fontSize: 11, fontWeight: 800, color: INK3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Section 8 grounds — replacing Section 21</p>
              <p style={{ fontSize: 11, color: INK2, marginBottom: 12, lineHeight: 1.55 }}>When you need possession, you must now cite a Section 8 ground. Key grounds:</p>
              {[
                { ground: "Ground 1B", name: "Owner-occupier", notice: "4 months", type: "Mandatory", desc: "You or a close family member needs to move into the property. Cannot be used in first 12 months." },
                { ground: "Ground 1A", name: "Landlord selling", notice: "4 months", type: "Mandatory", desc: "You intend to sell the property. Cannot be used in first 12 months. Must actually sell." },
                { ground: "Ground 8", name: "Serious arrears", notice: "4 weeks", type: "Mandatory", desc: "At least 3 months rent in arrears at notice AND at hearing date. Court must grant possession." },
                { ground: "Ground 10", name: "Some arrears", notice: "2 weeks", type: "Discretionary", desc: "Any rent arrears at time of notice and hearing. Court has discretion." },
                { ground: "Ground 11", name: "Persistent late pay", notice: "2 weeks", type: "Discretionary", desc: "Persistent late payment even if not in arrears at notice date." },
                { ground: "Ground 12", name: "Breach of tenancy", notice: "2 weeks", type: "Discretionary", desc: "Breach of tenancy term other than rent (e.g. subletting, damage, pets without consent)." },
                { ground: "Ground 14", name: "Nuisance", notice: "Immediate", type: "Discretionary", desc: "Antisocial behaviour, criminal activity, nuisance to neighbours." },
              ].map(g => (
                <div key={g.ground} style={{ borderBottom: `1px solid ${BORDER}`, paddingBottom: 10, marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, background: CTA, color: "white", padding: "1px 6px", borderRadius: 4 }}>{g.ground}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: INK }}>{g.name}</span>
                    <span style={{ fontSize: 10, background: g.type === "Mandatory" ? `${RED}15` : g.type === "No-fault" ? `${BLUE}15` : `${AMBER}15`, color: g.type === "Mandatory" ? RED : g.type === "No-fault" ? BLUE : AMBER, padding: "1px 5px", borderRadius: 4 }}>{g.type}</span>
                  </div>
                  <p style={{ fontSize: 11, color: INK2, lineHeight: 1.5 }}>{g.desc}</p>
                  <p style={{ fontSize: 10, color: INK3, marginTop: 3 }}>Notice: {g.notice}</p>
                </div>
              ))}
              <p style={{ fontSize: 10, color: INK3, marginTop: 8, fontStyle: "italic" }}>Note periods may change at commencement. Always take legal advice before serving notice.</p>
            </Card>

            {/* Print */}
            <button onClick={() => window.print()}
              className="no-print"
              style={{ background: CTA, color: "white", fontWeight: 800, fontSize: 13, padding: "12px 18px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit", width: "100%" }}>
              Save report as PDF
            </button>

            {/* Disclaimer */}
            <div style={{ padding: "14px 16px", background: "rgba(17,17,17,0.04)", borderRadius: 10 }}>
              <p style={{ fontSize: 11, color: INK3, lineHeight: 1.6, fontStyle: "italic" }}>
                This checker is for guidance only and does not constitute legal advice. The Renters' Rights Act 2025 is in force — always verify with a qualified solicitor or letting agent before taking action.
              </p>
            </div>

          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
