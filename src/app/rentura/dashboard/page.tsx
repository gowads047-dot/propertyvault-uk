"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import type { RenturaProperty, RenturaCompliance, RenturaMortgage, RenturaTenant, Alert } from "@/lib/rentura/types";

// ── Chat types ────────────────────────────────────────────────────────────────

type Action = { type: string; label: string; value: string; color: string };
type Message = {
  role: "user" | "ai";
  text: string;
  actions?: Action[];
  ts?: string;
  awaitingConfirm?: boolean;
  followUp?: string | null;
  saved?: boolean;
  savedTo?: string;
};
type APIHistory = { role: "user" | "assistant"; content: string }[];

// ── Helpers ───────────────────────────────────────────────────────────────────

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function fmt(n: number | null | undefined, prefix = "£") {
  if (n == null) return "—";
  return prefix + n.toLocaleString("en-GB");
}

function shortAddress(addr: string) {
  return addr.split(",")[0];
}

function computeAlerts(
  properties: RenturaProperty[],
  compliance: Record<string, RenturaCompliance[]>,
  mortgages: Record<string, RenturaMortgage[]>,
  tenants: Record<string, RenturaTenant[]>,
): Alert[] {
  const alerts: Alert[] = [];

  for (const p of properties) {
    const certs = compliance[p.id] ?? [];
    const morts = mortgages[p.id] ?? [];
    const tens = tenants[p.id] ?? [];
    const hasCurrentTenant = tens.some(t => t.is_current);
    const currentMortgage = morts.find(m => m.is_current);

    // Compliance alerts
    for (const cert of certs) {
      const days = daysUntil(cert.expiry_date);
      if (days == null) continue;
      const label = cert.certificate_type.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      if (days <= 0) {
        alerts.push({ property_id: p.id, property_address: p.address, type: "compliance", urgency: "urgent", title: `${label} EXPIRED at ${shortAddress(p.address)}`, detail: "This certificate has expired. You may not be legally compliant. Action required immediately.", days_remaining: days, action_label: "Renew now" });
      } else if (days <= 14) {
        alerts.push({ property_id: p.id, property_address: p.address, type: "compliance", urgency: "urgent", title: `${label} expires in ${days} days — ${shortAddress(p.address)}`, detail: `Renew before ${new Date(cert.expiry_date!).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}.`, days_remaining: days, action_label: "Book renewal" });
      } else if (days <= 45) {
        alerts.push({ property_id: p.id, property_address: p.address, type: "compliance", urgency: "action", title: `${label} due in ${days} days — ${shortAddress(p.address)}`, detail: `Schedule renewal before expiry on ${new Date(cert.expiry_date!).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}.`, days_remaining: days, action_label: "Schedule" });
      }
    }

    // Mortgage alerts
    if (currentMortgage?.fixed_term_expiry) {
      const days = daysUntil(currentMortgage.fixed_term_expiry);
      if (days != null) {
        if (days <= 30) {
          alerts.push({ property_id: p.id, property_address: p.address, type: "mortgage", urgency: "urgent", title: `Mortgage expires in ${days} days — ${shortAddress(p.address)}`, detail: `${currentMortgage.lender ?? "Lender"} fixed rate ends. SVR reversion could cost significantly more per month.`, days_remaining: days, action_label: "Act now" });
        } else if (days <= 90) {
          alerts.push({ property_id: p.id, property_address: p.address, type: "mortgage", urgency: "action", title: `Mortgage renews in ${days} days — ${shortAddress(p.address)}`, detail: `${currentMortgage.lender ?? "Lender"} fixed rate ends ${new Date(currentMortgage.fixed_term_expiry).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}. Start broker conversations now.`, days_remaining: days, action_label: "Prepare brief" });
        }
      }
    }

    // Void property alert
    if (!hasCurrentTenant && p.purchase_date) {
      alerts.push({ property_id: p.id, property_address: p.address, type: "void", urgency: "info", title: `${shortAddress(p.address)} — no current tenant recorded`, detail: "Add a tenant record to track rent income and tenancy compliance.", action_label: "Add tenant" });
    }
  }

  // Sort: urgent first
  return alerts.sort((a, b) => {
    const order = { urgent: 0, action: 1, info: 2 };
    return order[a.urgency] - order[b.urgency];
  });
}

function computeHealthScore(
  property: RenturaProperty,
  certs: RenturaCompliance[],
  morts: RenturaMortgage[],
  tens: RenturaTenant[],
): number {
  let score = 100;
  const hasCurrentTenant = tens.some(t => t.is_current);
  const currentMortgage = morts.find(m => m.is_current);

  if (!hasCurrentTenant) score -= 15;

  for (const cert of certs) {
    const days = daysUntil(cert.expiry_date);
    if (days == null) { score -= 5; continue; }
    if (days <= 0) score -= 20;
    else if (days <= 14) score -= 12;
    else if (days <= 45) score -= 5;
  }

  if (currentMortgage?.fixed_term_expiry) {
    const days = daysUntil(currentMortgage.fixed_term_expiry);
    if (days != null) {
      if (days <= 30) score -= 20;
      else if (days <= 90) score -= 10;
    }
  }

  if (!property.purchase_price) score -= 5;
  if (!property.bedrooms) score -= 3;

  return Math.max(0, Math.min(100, score));
}

// ── TrustBadge ────────────────────────────────────────────────────────────────

function TrustBadge({ level }: { level: string }) {
  const cfg: Record<string, { label: string; color: string; bg: string }> = {
    verified:  { label: "✓ Verified",  color: "#16a34a", bg: "rgba(22,163,74,0.08)" },
    confirmed: { label: "◎ Confirmed", color: "#2563eb", bg: "rgba(37,99,235,0.08)" },
    suggested: { label: "~ Suggested", color: "#d97706", bg: "rgba(217,119,6,0.08)" },
  };
  const c = cfg[level] ?? cfg.suggested;
  return <span style={{ fontSize: 10, fontWeight: 700, color: c.color, background: c.bg, padding: "2px 7px", borderRadius: 6, letterSpacing: "0.04em", flexShrink: 0 }}>{c.label}</span>;
}

// ── Property Card ─────────────────────────────────────────────────────────────

function PropertyCard({
  property, tenant, mortgage, compliance, onChat,
}: {
  property: RenturaProperty;
  tenant?: RenturaTenant;
  mortgage?: RenturaMortgage;
  compliance: RenturaCompliance[];
  onChat: (text: string) => void;
}) {
  const BG = "#eceae2";
  const INK = "#111111";
  const INK2 = "rgba(17,17,17,0.55)";
  const BORDER = "rgba(17,17,17,0.09)";
  const daysToMortgage = daysUntil(mortgage?.fixed_term_expiry ?? null);
  const urgentCert = compliance.find(c => {
    const d = daysUntil(c.expiry_date);
    return d != null && d <= 45;
  });
  const healthScore = computeHealthScore(property, compliance, mortgage ? [mortgage] : [], tenant ? [tenant] : []);
  const healthColor = healthScore >= 80 ? "#16a34a" : healthScore >= 60 ? "#d97706" : "#dc2626";

  return (
    <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 16, padding: "22px 24px", display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <p style={{ fontSize: 15, fontWeight: 800, color: INK, lineHeight: 1.25, marginBottom: 3 }}>{shortAddress(property.address)}</p>
          <p style={{ fontSize: 12, color: INK2 }}>{property.address.split(",").slice(1).join(",").trim() || property.property_type}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: healthColor }}>{healthScore}</span>
          <span style={{ fontSize: 10, color: INK2 }}>/100</span>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(17,17,17,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>Rent</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: INK }}>{tenant?.monthly_rent ? fmt(tenant.monthly_rent) + "/mo" : "—"}</p>
        </div>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(17,17,17,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>Tenant</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: tenant ? INK : "#d97706" }}>{tenant?.name ?? "Vacant"}</p>
        </div>
        {property.purchase_price && (
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(17,17,17,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>Yield</p>
            <p style={{ fontSize: 14, fontWeight: 700, color: INK }}>
              {tenant?.monthly_rent ? ((tenant.monthly_rent * 12 / property.purchase_price) * 100).toFixed(1) + "%" : "—"}
            </p>
          </div>
        )}
      </div>

      {/* Alerts */}
      {urgentCert && (
        <div style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.18)", borderRadius: 8, padding: "8px 12px", marginBottom: 10, fontSize: 12, color: "#dc2626", fontWeight: 600 }}>
          ⚠ {urgentCert.certificate_type.replace(/_/g, " ").toUpperCase()} — {daysUntil(urgentCert.expiry_date) ?? 0} days
        </div>
      )}
      {daysToMortgage != null && daysToMortgage <= 90 && !urgentCert && (
        <div style={{ background: "rgba(217,119,6,0.06)", border: "1px solid rgba(217,119,6,0.18)", borderRadius: 8, padding: "8px 12px", marginBottom: 10, fontSize: 12, color: "#d97706", fontWeight: 600 }}>
          ◎ Mortgage renews in {daysToMortgage} days
        </div>
      )}

      {/* Footer */}
      <div style={{ display: "flex", gap: 8, marginTop: "auto", paddingTop: 14, borderTop: `1px solid ${BORDER}` }}>
        <Link href={`/rentura/properties/${property.id}`} style={{ flex: 1, display: "block", textAlign: "center", background: "#0f1728", color: "white", fontWeight: 700, fontSize: 13, padding: "9px 0", borderRadius: 8, textDecoration: "none" }}>
          View Passport →
        </Link>
        <button onClick={() => onChat(`Tell me about ${shortAddress(property.address)}`)}
          style={{ background: BG, border: `1px solid ${BORDER}`, color: INK2, fontWeight: 600, fontSize: 13, padding: "9px 14px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit" }}>
          Ask
        </button>
      </div>
    </div>
  );
}

// ── Alert Card ────────────────────────────────────────────────────────────────

function AlertCard({ alert }: { alert: Alert }) {
  const cfg = {
    urgent: { border: "rgba(220,38,38,0.3)", bg: "rgba(220,38,38,0.05)", dot: "#dc2626", label: "Urgent" },
    action: { border: "rgba(217,119,6,0.3)", bg: "rgba(217,119,6,0.05)", dot: "#d97706", label: "Action needed" },
    info:   { border: "rgba(37,99,235,0.2)", bg: "rgba(37,99,235,0.04)", dot: "#2563eb", label: "Info" },
  }[alert.urgency];

  return (
    <div style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 12, padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, flexShrink: 0, display: "inline-block" }} />
        <span style={{ fontSize: 10, fontWeight: 800, color: cfg.dot, textTransform: "uppercase", letterSpacing: "0.1em" }}>{cfg.label}</span>
      </div>
      <p style={{ fontSize: 13, fontWeight: 700, color: "#111", lineHeight: 1.4, marginBottom: 4 }}>{alert.title}</p>
      <p style={{ fontSize: 12, color: "rgba(17,17,17,0.55)", lineHeight: 1.5 }}>{alert.detail}</p>
      {alert.action_label && (
        <Link href={`/rentura/properties/${alert.property_id}`} style={{ display: "inline-block", marginTop: 10, fontSize: 12, fontWeight: 700, color: cfg.dot, textDecoration: "none" }}>
          {alert.action_label} →
        </Link>
      )}
    </div>
  );
}

function RenturaTrialBanner({ userId }: { userId: string }) {
  const [trialEnd, setTrialEnd] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("rentura_subscriptions").select("status,trial_end").eq("user_id", userId).maybeSingle()
      .then(({ data }) => { if (data) { setStatus(data.status); setTrialEnd(data.trial_end); } });
  }, [userId]);

  if (status !== "trialing" || !trialEnd) return null;
  const chargeDate = new Date(trialEnd).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  return (
    <div style={{ background: "rgba(201,168,76,0.08)", borderBottom: "1px solid rgba(201,168,76,0.2)", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
      <span style={{ fontSize: 14, color: "#c9a84c" }}>
        🎁 Free trial active — your first payment of <strong>£9.99</strong> will be taken on <strong>{chargeDate}</strong>.
      </span>
    </div>
  );
}

function SubscribedBanner() {
  const searchParams = useSearchParams();
  const isNew = searchParams.get("subscribed") === "1" || searchParams.get("success") === "1";
  if (!isNew) return null;
  return (
    <div style={{ background: "linear-gradient(135deg,rgba(201,168,76,0.12),rgba(201,168,76,0.05))", borderBottom: "1px solid rgba(201,168,76,0.2)", padding: "16px 28px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
      <span style={{ fontSize: 24 }}>🎉</span>
      <div>
        <p style={{ fontSize: 15, fontWeight: 800, color: "#0f1b2d", marginBottom: 2 }}>Welcome to Rentura — your Property Passport platform is ready.</p>
        <p style={{ fontSize: 13, color: "rgba(15,27,45,0.5)" }}>Start by adding your first property. Your invoice has been sent to your email.</p>
      </div>
      <Link href="/rentura/properties/new" style={{ marginLeft: "auto", background: "#0f1b2d", color: "white", fontWeight: 700, fontSize: 13, padding: "9px 20px", borderRadius: 10, textDecoration: "none", whiteSpace: "nowrap" }}>
        Add first property →
      </Link>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function RenturaDashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  const [properties, setProperties] = useState<RenturaProperty[]>([]);
  const [tenants, setTenants] = useState<Record<string, RenturaTenant[]>>({});
  const [mortgages, setMortgages] = useState<Record<string, RenturaMortgage[]>>({});
  const [compliance, setCompliance] = useState<Record<string, RenturaCompliance[]>>({});
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [memberName, setMemberName] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [nameSaving, setNameSaving] = useState(false);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // Chat state — greeting matches time of day
  const INIT: Message = { role: "ai", text: `${greeting}. Tell me what happened today — or ask anything about your portfolio.`, ts: "now" };
  const [messages, setMessages] = useState<Message[]>([INIT]);
  const [apiHistory, setApiHistory] = useState<APIHistory>([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) router.push("/rentura/auth?next=/rentura/dashboard");
  }, [authLoading, user, router]);

  // Fetch name from rentura_subscriptions (not profiles)
  useEffect(() => {
    if (!user) return;
    supabase.from("rentura_subscriptions").select("name").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => { if (data?.name) setMemberName(data.name); });
  }, [user]);

  async function saveName() {
    if (!nameInput.trim() || !user) return;
    setNameSaving(true);
    await supabase.from("rentura_subscriptions").update({ name: nameInput.trim() }).eq("user_id", user.id);
    setMemberName(nameInput.trim());
    setNameInput("");
    setNameSaving(false);
  }

  // Load all portfolio data
  useEffect(() => {
    if (!user) return;
    async function loadData() {
      setDataLoading(true);
      try {
        const [propRes, tenantRes, mortRes, compRes] = await Promise.all([
          supabase.from("rentura_properties").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }),
          supabase.from("rentura_tenants").select("*").eq("user_id", user!.id).eq("is_current", true),
          supabase.from("rentura_mortgages").select("*").eq("user_id", user!.id).eq("is_current", true),
          supabase.from("rentura_compliance").select("*").eq("user_id", user!.id),
        ]);

        const props: RenturaProperty[] = propRes.data ?? [];
        setProperties(props);

        const tenantMap: Record<string, RenturaTenant[]> = {};
        const mortMap: Record<string, RenturaMortgage[]> = {};
        const compMap: Record<string, RenturaCompliance[]> = {};

        for (const t of (tenantRes.data ?? [])) {
          if (!tenantMap[t.property_id]) tenantMap[t.property_id] = [];
          tenantMap[t.property_id].push(t);
        }
        for (const m of (mortRes.data ?? [])) {
          if (!mortMap[m.property_id]) mortMap[m.property_id] = [];
          mortMap[m.property_id].push(m);
        }
        for (const c of (compRes.data ?? [])) {
          if (!compMap[c.property_id]) compMap[c.property_id] = [];
          compMap[c.property_id].push(c);
        }

        setTenants(tenantMap);
        setMortgages(mortMap);
        setCompliance(compMap);
        setAlerts(computeAlerts(props, compMap, mortMap, tenantMap));
      } finally {
        setDataLoading(false);
      }
    }
    loadData();
  }, [user]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, chatLoading]);

  // Find matching property from a text string (fuzzy)
  function matchProperty(text: string | null): RenturaProperty | null {
    if (!text || properties.length === 0) return null;
    const t = text.toLowerCase();
    return properties.find(p =>
      p.address.toLowerCase().includes(t) ||
      t.includes(p.address.split(",")[0].toLowerCase()) ||
      (p.nickname && t.includes(p.nickname.toLowerCase()))
    ) ?? null;
  }

  const send = useCallback(async (text: string) => {
    if (!text.trim() || chatLoading || !user) return;
    setMessages(m => [...m, { role: "user", text: text.trim(), ts: "just now" }]);
    setInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/rentura/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: apiHistory,
          userInput: text.trim(),
          properties: properties.map(p => ({ id: p.id, address: p.address, nickname: p.nickname, property_type: p.property_type, bedrooms: p.bedrooms })),
          context: {
            today: new Date().toISOString().split("T")[0],
            landlordName: memberName || null,
            totalMonthlyIncome: totalIncome,
            totalMortgagePayments: totalMortgage,
            netMonthlyCashflow: netCashflow,
            alerts: alerts.slice(0, 10).map(a => ({ title: a.title, urgency: a.urgency, type: a.type, property: a.property_address })),
            tenants: properties.map(p => {
              const t = tenants[p.id]?.[0];
              return t
                ? { property: shortAddress(p.address), name: t.name ?? `${t.first_name ?? ""} ${t.last_name ?? ""}`.trim(), rent: t.monthly_rent, moveIn: t.move_in_date ?? t.tenancy_start }
                : { property: shortAddress(p.address), name: "Vacant", rent: null };
            }),
            mortgages: properties.map(p => {
              const m = mortgages[p.id]?.[0];
              return m ? { property: shortAddress(p.address), lender: m.lender, rate: m.interest_rate, monthly: m.monthly_payment, fixedExpiry: m.fixed_term_expiry } : null;
            }).filter(Boolean),
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error || "API error");
      }
      const result = await res.json();

      const newHistory: APIHistory = [
        ...apiHistory,
        { role: "user", content: text.trim() },
        { role: "assistant", content: result.reply },
      ];
      setApiHistory(newHistory);

      // If completed, save to Supabase
      let savedTo: string | undefined;
      if (result.completed && result.intent && result.intent !== "unknown") {
        const matchedProp = matchProperty(result.property_match ?? result.gathered?.property ?? null);
        if (matchedProp) {
          savedTo = shortAddress(matchedProp.address);
          await supabase.from("rentura_events").insert({
            property_id: matchedProp.id,
            user_id: user.id,
            event_type: result.intent,
            title: result.actions?.[0]?.label ?? result.intent.replace(/_/g, " "),
            description: result.reply,
            amount: result.gathered?.amount ? parseFloat(String(result.gathered.amount).replace(/[£,]/g, "")) : null,
            trust_level: "confirmed",
            metadata: result.gathered ?? {},
            event_date: new Date().toISOString().split("T")[0],
          });
        }
      }

      setMessages(m => [...m, {
        role: "ai",
        text: result.reply,
        actions: result.actions ?? [],
        ts: "just now",
        awaitingConfirm: result.needsConfirmation === true,
        followUp: result.completed ? result.followUp : null,
        saved: !!savedTo,
        savedTo,
      }]);
    } catch (err) {
      const msg = err instanceof Error && err.message === "Chat unavailable"
        ? "The AI assistant isn't available right now — the API key may not be configured in the deployment. Try again shortly or contact support."
        : "Connection issue — please try again.";
      setMessages(m => [...m, { role: "ai", text: msg, ts: "just now" }]);
    }
    setChatLoading(false);
  }, [chatLoading, apiHistory, user, properties]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalIncome = Object.values(tenants)
    .flat()
    .filter(t => t.is_current)
    .reduce((sum, t) => sum + (t.monthly_rent ?? 0), 0);

  const totalMortgage = Object.values(mortgages)
    .flat()
    .reduce((sum, m) => sum + (m.monthly_payment ?? 0), 0);

  const netCashflow = totalIncome - totalMortgage;

  const urgentCount = alerts.filter(a => a.urgency === "urgent").length;

  const BG = "#eceae2";
  const INK = "#111111";
  const INK2 = "rgba(17,17,17,0.52)";
  const BORDER = "rgba(17,17,17,0.09)";
  const CTA = "#0f1728";
  const firstName = memberName?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "there";

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: INK2, fontSize: 14 }}>Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ fontFamily: "var(--font-family-body)", background: BG, color: INK, minHeight: "100vh" }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>

      <Suspense fallback={null}>
        <SubscribedBanner />
      </Suspense>

      {/* Trial active banner — shown when Stripe subscription is trialing */}
      <RenturaTrialBanner userId={user.id} />

      {/* ── NAV ── */}
      <nav style={{ borderBottom: `1px solid ${BORDER}`, padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", background: BG, position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
          <Link href="/" style={{ color: INK2, textDecoration: "none", fontWeight: 500 }}>PropertyVault</Link>
          <span style={{ color: INK2 }}>›</span>
          <Link href="/rentura/dashboard" style={{ color: INK, fontWeight: 800, textDecoration: "none", letterSpacing: "-0.02em" }}>Rentura</Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/rentura/maintenance" style={{ fontSize: 13, fontWeight: 700, color: INK2, textDecoration: "none", padding: "8px 14px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "white" }}>
            Maintenance
          </Link>
          <Link href="/rentura/tax" style={{ fontSize: 13, fontWeight: 700, color: INK2, textDecoration: "none", padding: "8px 14px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "white" }}>
            Tax
          </Link>
          <Link href="/rentura/properties/new" style={{ background: CTA, color: "white", fontSize: 13, fontWeight: 700, padding: "8px 18px", borderRadius: 8, textDecoration: "none" }}>
            + Add Property
          </Link>
          <span style={{ fontSize: 12, color: INK2 }}>{memberName ?? user.email}</span>
          <button onClick={async () => { await signOut(); router.push("/rentura"); }}
            style={{ fontSize: 12, fontWeight: 600, color: "rgba(17,17,17,0.4)", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", fontFamily: "inherit" }}>
            Sign out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* ── GREETING ── */}
        <div style={{ padding: "40px 0 28px" }}>
          {!dataLoading && !memberName ? (
            <div>
              <p style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, fontFamily: "var(--font-family-heading)", marginBottom: 14 }}>
                {greeting}. What should we call you?
              </p>
              <div style={{ display: "flex", gap: 8, alignItems: "center", maxWidth: 360 }}>
                <input
                  type="text" value={nameInput} onChange={e => setNameInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && saveName()}
                  placeholder="Your first name" autoFocus
                  style={{ flex: 1, padding: "10px 14px", fontSize: 15, borderRadius: 10, border: `1px solid ${BORDER}`, outline: "none", fontFamily: "inherit", background: "white" }}
                />
                <button onClick={saveName} disabled={nameSaving || !nameInput.trim()}
                  style={{ padding: "10px 20px", background: CTA, color: "white", fontWeight: 800, fontSize: 14, borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit", opacity: !nameInput.trim() ? 0.5 : 1 }}>
                  {nameSaving ? "…" : "Save →"}
                </button>
              </div>
              <p style={{ fontSize: 12, color: INK2, marginTop: 8 }}>This is how Rentura will address you across your dashboard.</p>
            </div>
          ) : (
            <p style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, fontFamily: "var(--font-family-heading)" }}>
              {greeting}, {firstName}.
            </p>
          )}
          <p style={{ fontSize: 14, color: INK2, marginTop: 6 }}>
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        {/* ── PORTFOLIO SUMMARY — always visible ── */}
        {!dataLoading && (
          <div style={{ display: "flex", gap: 0, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, marginBottom: 36, overflowX: "auto" }}>
            {([
              ["Properties", properties.length.toString(), undefined],
              ["Monthly income", properties.length ? fmt(totalIncome) : "£0", undefined],
              ["Net cashflow", properties.length ? fmt(netCashflow) : "—", netCashflow < 0 ? "#dc2626" : netCashflow > 0 ? "#16a34a" : undefined],
              ["Urgent alerts", urgentCount.toString(), urgentCount > 0 ? "#dc2626" : undefined],
              ["Compliance items", alerts.filter(a => a.type === "compliance").length.toString(), undefined],
            ] as [string, string, string?][]).map(([label, val, color], i, arr) => (
              <div key={label} style={{ flex: 1, minWidth: 120, padding: "18px 20px", borderRight: i < arr.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(17,17,17,0.38)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{label}</p>
                <p style={{ fontSize: 26, fontWeight: 900, color: color ?? INK, letterSpacing: "-0.02em" }}>{val}</p>
              </div>
            ))}
          </div>
        )}

        {!dataLoading && properties.length === 0 ? (
          /* ── SMART ONBOARDING ── */
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 48 }}>

            {/* Left: what you're building */}
            <div style={{ background: "white", borderRadius: 20, padding: "28px 28px", border: `1px solid ${BORDER}` }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: "rgba(17,17,17,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Getting started</p>
              <h3 style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 8 }}>Build your Property Passport</h3>
              <p style={{ fontSize: 13, color: INK2, lineHeight: 1.7, marginBottom: 24 }}>
                Each property you add gets a living digital record — compliance dates, mortgage, tenant history, maintenance log, and finances. Everything in one place, forever.
              </p>
              {[
                ["Add your first property", "/rentura/properties/new", true],
                ["Set compliance certificates", "/rentura/properties/new", false],
                ["Record your mortgage", "/rentura/properties/new", false],
                ["Add a tenant", "/rentura/properties/new", false],
                ["Tell the AI what happened", null, false],
              ].map(([step, href, done]) => (
                <div key={step as string} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${done ? "#16a34a" : BORDER}`, background: done ? "#16a34a" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {done && <span style={{ color: "white", fontSize: 10, fontWeight: 900 }}>✓</span>}
                  </div>
                  {href ? (
                    <Link href={href as string} style={{ fontSize: 13, color: done ? "#16a34a" : INK, fontWeight: done ? 700 : 500, textDecoration: "none" }}>{step as string}</Link>
                  ) : (
                    <span style={{ fontSize: 13, color: INK2 }}>{step as string}</span>
                  )}
                </div>
              ))}
              <Link href="/rentura/properties/new" style={{ display: "inline-block", marginTop: 8, background: CTA, color: "white", fontWeight: 800, fontSize: 14, padding: "12px 28px", borderRadius: 10, textDecoration: "none" }}>
                Add first property →
              </Link>
            </div>

            {/* Right: what you unlock */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: "rgba(17,17,17,0.35)", textTransform: "uppercase", letterSpacing: "0.1em" }}>What you&apos;ll unlock</p>
              {[
                ["🏠", "Property Passport", "A permanent digital record for every property — EPC, gas, electric, AST, mortgage, maintenance."],
                ["⚠️", "Compliance alerts", "Never miss a gas safety or EPC expiry. Automated alerts 45, 14, and 0 days before expiry."],
                ["💰", "Financial centre", "Yield, P&L, cashflow, and mortgage tracker per property. Export for your accountant."],
                ["🤖", "AI assistant", "Log rent payments, maintenance calls, and tenant issues in plain English. Rentura records everything."],
              ].map(([icon, title, desc]) => (
                <div key={title as string} style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, padding: "16px 18px", display: "flex", gap: 14 }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{icon as string}</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 800, marginBottom: 3 }}>{title as string}</p>
                    <p style={{ fontSize: 12, color: INK2, lineHeight: 1.6 }}>{desc as string}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : properties.length > 0 ? (
          <>
            {/* ── DAILY BRIEFING ── */}
            {alerts.length > 0 && (
              <div style={{ marginBottom: 40 }}>
                <p style={{ fontSize: 11, fontWeight: 800, color: "rgba(17,17,17,0.38)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Today&apos;s Briefing</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
                  {alerts.slice(0, 6).map((alert, i) => <AlertCard key={i} alert={alert} />)}
                </div>
              </div>
            )}

            {/* ── PROPERTIES ── */}
            <div style={{ marginBottom: 48 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <p style={{ fontSize: 11, fontWeight: 800, color: "rgba(17,17,17,0.38)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Your Portfolio</p>
                <Link href="/rentura/properties/new" style={{ fontSize: 12, fontWeight: 700, color: INK2, textDecoration: "none" }}>+ Add property</Link>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
                {properties.map(p => (
                  <PropertyCard
                    key={p.id}
                    property={p}
                    tenant={tenants[p.id]?.[0]}
                    mortgage={mortgages[p.id]?.[0]}
                    compliance={compliance[p.id] ?? []}
                    onChat={(text) => { setInput(text); inputRef.current?.focus(); }}
                  />
                ))}
              </div>
            </div>
          </>
        ) : null}

        {/* ── CHAT ── */}
        <div style={{ borderRadius: 20, overflow: "hidden", border: `1px solid ${BORDER}` }}>
          <div style={{ background: CTA, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ color: "white", fontWeight: 800, fontSize: 15, letterSpacing: "-0.01em" }}>Tell Rentura what happened</p>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>Log events, ask questions, get insights</p>
            </div>
            {messages.length > 1 && (
              <button onClick={() => { setMessages([INIT]); setApiHistory([]); }} style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Clear</button>
            )}
          </div>

          {/* Messages */}
          <div style={{ background: "#0c0f1a", padding: "20px 24px", minHeight: 220, maxHeight: 420, overflowY: "auto" }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: 18 }}>
                {msg.role === "user" ? (
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "14px 14px 2px 14px", padding: "10px 14px", maxWidth: "75%" }}>
                      <p style={{ color: "white", fontSize: 14, lineHeight: 1.5 }}>{msg.text}</p>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 28, height: 28, background: "#1e293b", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.6)" }}>R</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 14, lineHeight: 1.65, whiteSpace: "pre-line" }}>{msg.text}</p>

                      {/* Action chips */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                          {msg.actions.map((a, i) => (
                            <span key={i} style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: `${a.color}20`, color: a.color, border: `1px solid ${a.color}40` }}>
                              {a.label}{a.value ? ` · ${a.value}` : ""}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Saved confirmation */}
                      {msg.saved && msg.savedTo && (
                        <p style={{ fontSize: 11, color: "#16a34a", fontWeight: 700, marginTop: 8 }}>✓ Saved to {msg.savedTo}&apos;s Passport</p>
                      )}

                      {/* Follow-up suggestion */}
                      {msg.followUp && (
                        <button onClick={() => send(msg.followUp!)} style={{ marginTop: 10, background: "none", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "5px 12px", color: "rgba(255,255,255,0.55)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                          {msg.followUp} →
                        </button>
                      )}

                      {/* Confirm/Edit buttons */}
                      {msg.awaitingConfirm && idx === messages.length - 1 && (
                        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                          <button onClick={() => send("Confirmed")} style={{ background: "#16a34a", color: "white", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                            Confirm & Save
                          </button>
                          <button onClick={() => send("Let me edit that")} style={{ background: "none", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "8px 18px", fontSize: 13, color: "rgba(255,255,255,0.55)", cursor: "pointer", fontFamily: "inherit" }}>
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading */}
            {chatLoading && (
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 28, height: 28, background: "#1e293b", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.6)" }}>R</div>
                <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "10px 0" }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.3)", animation: `pulse 1.2s ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts — contextual */}
          {messages.length === 1 && (
            <div style={{ background: "#0c0f1a", padding: "0 24px 16px", display: "flex", flexWrap: "wrap", gap: 6 }}>
              {(() => {
                if (properties.length === 0) {
                  return ["Help me add my first property", "What is a Property Passport?", "How does Rentura track compliance?", "What do I need to be legally compliant as a landlord?"];
                }
                const prompts: string[] = [];
                // First urgent alert → specific action
                const urgent = alerts.find(a => a.urgency === "urgent");
                if (urgent) prompts.push(`What do I do about: ${urgent.title}?`);
                // Tenant-specific
                const firstTenant = Object.values(tenants).flat().find(t => t.is_current);
                if (firstTenant) {
                  const name = firstTenant.name ?? `${firstTenant.first_name ?? ""} ${firstTenant.last_name ?? ""}`.trim();
                  prompts.push(`Log rent received from ${name}`);
                }
                // Generic smart prompts
                if (netCashflow < 0) prompts.push("How can I improve my cashflow?");
                prompts.push("What should I focus on today?");
                prompts.push("Log a maintenance issue");
                if (alerts.some(a => a.type === "compliance")) prompts.push("Walk me through my compliance checklist");
                return prompts.slice(0, 4);
              })().map(p => (
                <button key={p} onClick={() => send(p)} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "6px 14px", fontSize: 12, color: "rgba(255,255,255,0.65)", cursor: "pointer", fontFamily: "inherit" }}>
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ background: "#111827", padding: "14px 16px", display: "flex", gap: 10 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder={properties.length === 0 ? "Add a property first to start logging events…" : "Tell me what happened…"}
              disabled={chatLoading}
              style={{ flex: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 16px", color: "white", fontSize: 14, outline: "none", fontFamily: "inherit" }}
            />
            <button
              onClick={() => send(input)}
              disabled={chatLoading || !input.trim()}
              style={{ background: "#0f1728", color: "white", border: "none", borderRadius: 10, padding: "11px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: (!input.trim() || chatLoading) ? 0.4 : 1 }}>
              Send
            </button>
          </div>
        </div>

      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }`}</style>
    </div>
  );
}
