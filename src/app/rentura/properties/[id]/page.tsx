"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import type { RenturaProperty, RenturaEvent, RenturaTenant, RenturaMortgage, RenturaCompliance, RenturaMaintenance, MaintenanceCategory, MaintenanceUrgency } from "@/lib/rentura/types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number | null | undefined, prefix = "£") {
  if (n == null) return "—";
  return prefix + n.toLocaleString("en-GB");
}

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function daysUntil(dateStr: string | null) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TrustBadge({ level }: { level: string }) {
  const cfg: Record<string, { label: string; color: string; bg: string }> = {
    verified:  { label: "✓ Verified",  color: "#16a34a", bg: "rgba(22,163,74,0.08)" },
    confirmed: { label: "◎ Confirmed", color: "#2563eb", bg: "rgba(37,99,235,0.08)" },
    suggested: { label: "~ Suggested", color: "#d97706", bg: "rgba(217,119,6,0.08)" },
  };
  const c = cfg[level] ?? cfg.suggested;
  return (
    <span style={{ fontSize: 10, fontWeight: 700, color: c.color, background: c.bg, padding: "2px 7px", borderRadius: 6, letterSpacing: "0.04em" }}>
      {c.label}
    </span>
  );
}

function ExpiryPill({ expiry }: { expiry: string | null }) {
  if (!expiry) return <span style={{ fontSize: 12, color: "rgba(17,17,17,0.4)" }}>No expiry recorded</span>;
  const days = daysUntil(expiry);
  if (days == null) return null;
  const color = days <= 0 ? "#dc2626" : days <= 14 ? "#dc2626" : days <= 45 ? "#d97706" : "#16a34a";
  const label = days <= 0 ? "EXPIRED" : `${days}d remaining`;
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color, background: color + "12", padding: "3px 8px", borderRadius: 20 }}>
      {label} · {fmtDate(expiry)}
    </span>
  );
}

const CERT_TYPES = ["gas_safety", "epc", "eicr", "pat_test", "fire_alarm", "legionella", "hmo_licence", "other"];
const CERT_LABELS: Record<string, string> = {
  gas_safety: "Gas Safety Certificate",
  epc: "EPC",
  eicr: "Electrical Installation Condition Report",
  pat_test: "PAT Test",
  fire_alarm: "Fire Alarm Inspection",
  legionella: "Legionella Risk Assessment",
  hmo_licence: "HMO Licence",
  other: "Other",
};

const EVENT_ICONS: Record<string, string> = {
  payment: "💷",
  maintenance_logged: "🔧",
  maintenance_resolved: "✅",
  maintenance_cost: "🔧",
  tenant_in: "🔑",
  tenant_out: "📦",
  compliance: "📋",
  mortgage: "🏦",
  rent_review: "📈",
  arrears: "⚠️",
  note: "📝",
  property_created: "🏠",
};

// ── Modal wrapper ─────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  const BORDER = "rgba(17,17,17,0.1)";
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "white", borderRadius: 18, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.02em" }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "rgba(17,17,17,0.4)", padding: "4px 8px" }}>✕</button>
        </div>
        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 20 }}>{children}</div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

type Tab = "overview" | "timeline" | "tenants" | "mortgage" | "compliance" | "documents" | "maintenance";

export default function PropertyPassport() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();

  const [property, setProperty] = useState<RenturaProperty | null>(null);
  const [events, setEvents] = useState<RenturaEvent[]>([]);
  const [tenants, setTenants] = useState<RenturaTenant[]>([]);
  const [mortgages, setMortgages] = useState<RenturaMortgage[]>([]);
  const [compliance, setCompliance] = useState<RenturaCompliance[]>([]);
  const [maintenance, setMaintenance] = useState<RenturaMaintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");
  const [showAddMaint, setShowAddMaint] = useState(false);
  const [maintForm, setMaintForm] = useState({ title: "", description: "", category: "other" as MaintenanceCategory, urgency: "routine" as MaintenanceUrgency, contractor_name: "", contractor_phone: "", estimated_cost: "" });
  const [maintSaving, setMaintSaving] = useState(false);

  // Modals
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [showAddMortgage, setShowAddMortgage] = useState(false);
  const [showAddCert, setShowAddCert] = useState(false);
  const [saving, setSaving] = useState(false);

  // Document upload
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ summary: string; document_type: string; extracted: Record<string, unknown>; warnings: string[]; confidence?: number } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pendingExtract, setPendingExtract] = useState<Record<string, unknown> | null>(null);

  // Forms
  const [tenantForm, setTenantForm] = useState({ name: "", email: "", phone: "", monthly_rent: "", move_in_date: "", deposit_amount: "", deposit_scheme: "" });
  const [mortgageForm, setMortgageForm] = useState({ lender: "", product_name: "", interest_rate: "", monthly_payment: "", remaining_balance: "", fixed_term_expiry: "", svr_rate: "" });
  const [certForm, setCertForm] = useState({ certificate_type: "gas_safety", issue_date: "", expiry_date: "", notes: "" });

  useEffect(() => {
    if (!user) { router.push("/rentura/auth?next=/rentura/dashboard"); return; }
    async function load() {
      setLoading(true);
      const [propRes, evtRes, tenRes, mortRes, compRes, maintRes] = await Promise.all([
        supabase.from("rentura_properties").select("*").eq("id", id).eq("user_id", user!.id).single(),
        supabase.from("rentura_events").select("*").eq("property_id", id).order("event_date", { ascending: false }),
        supabase.from("rentura_tenants").select("*").eq("property_id", id).order("move_in_date", { ascending: false }),
        supabase.from("rentura_mortgages").select("*").eq("property_id", id).order("created_at", { ascending: false }),
        supabase.from("rentura_compliance").select("*").eq("property_id", id).order("expiry_date", { ascending: true }),
        supabase.from("rentura_maintenance").select("*").eq("property_id", id).order("created_at", { ascending: false }),
      ]);
      if (!propRes.data) { router.push("/rentura/dashboard"); return; }
      setProperty(propRes.data);
      setEvents(evtRes.data ?? []);
      setTenants(tenRes.data ?? []);
      setMortgages(mortRes.data ?? []);
      setCompliance(compRes.data ?? []);
      setMaintenance((maintRes.data ?? []) as RenturaMaintenance[]);
      setLoading(false);
    }
    load();
  }, [id, user, router]);

  async function addTenant() {
    if (!user || !property || !tenantForm.name.trim()) return;
    setSaving(true);
    // Mark existing tenants as not current
    await supabase.from("rentura_tenants").update({ is_current: false }).eq("property_id", id).eq("is_current", true);
    const { data } = await supabase.from("rentura_tenants").insert({
      property_id: id, user_id: user.id,
      name: tenantForm.name.trim(),
      email: tenantForm.email || null,
      phone: tenantForm.phone || null,
      monthly_rent: tenantForm.monthly_rent ? parseFloat(tenantForm.monthly_rent) : null,
      move_in_date: tenantForm.move_in_date || null,
      deposit_amount: tenantForm.deposit_amount ? parseFloat(tenantForm.deposit_amount) : null,
      deposit_scheme: tenantForm.deposit_scheme || null,
      is_current: true,
    }).select().single();
    if (data) {
      setTenants(prev => [data, ...prev.map(t => ({ ...t, is_current: false }))]);
      await supabase.from("rentura_events").insert({ property_id: id, user_id: user.id, event_type: "tenant_in", title: `Tenant moved in — ${tenantForm.name.trim()}`, description: `Monthly rent: ${fmt(tenantForm.monthly_rent ? parseFloat(tenantForm.monthly_rent) : null)}`, amount: tenantForm.monthly_rent ? parseFloat(tenantForm.monthly_rent) : null, trust_level: "confirmed", metadata: {}, event_date: tenantForm.move_in_date || new Date().toISOString().split("T")[0] });
      const evtRes = await supabase.from("rentura_events").select("*").eq("property_id", id).order("event_date", { ascending: false });
      setEvents(evtRes.data ?? []);
    }
    setShowAddTenant(false);
    setTenantForm({ name: "", email: "", phone: "", monthly_rent: "", move_in_date: "", deposit_amount: "", deposit_scheme: "" });
    setSaving(false);
  }

  async function addMortgage() {
    if (!user || !property) return;
    setSaving(true);
    await supabase.from("rentura_mortgages").update({ is_current: false }).eq("property_id", id).eq("is_current", true);
    const { data } = await supabase.from("rentura_mortgages").insert({
      property_id: id, user_id: user.id,
      lender: mortgageForm.lender || null,
      product_name: mortgageForm.product_name || null,
      interest_rate: mortgageForm.interest_rate ? parseFloat(mortgageForm.interest_rate) : null,
      monthly_payment: mortgageForm.monthly_payment ? parseFloat(mortgageForm.monthly_payment) : null,
      remaining_balance: mortgageForm.remaining_balance ? parseFloat(mortgageForm.remaining_balance) : null,
      fixed_term_expiry: mortgageForm.fixed_term_expiry || null,
      svr_rate: mortgageForm.svr_rate ? parseFloat(mortgageForm.svr_rate) : null,
      trust_level: "confirmed",
      is_current: true,
    }).select().single();
    if (data) {
      setMortgages(prev => [data, ...prev.map(m => ({ ...m, is_current: false }))]);
      await supabase.from("rentura_events").insert({ property_id: id, user_id: user.id, event_type: "mortgage", title: `Mortgage recorded — ${mortgageForm.lender || "lender"}`, description: `${mortgageForm.interest_rate || "?"}% fixed until ${fmtDate(mortgageForm.fixed_term_expiry)}`, trust_level: "confirmed", metadata: {}, event_date: new Date().toISOString().split("T")[0] });
      const evtRes = await supabase.from("rentura_events").select("*").eq("property_id", id).order("event_date", { ascending: false });
      setEvents(evtRes.data ?? []);
    }
    setShowAddMortgage(false);
    setMortgageForm({ lender: "", product_name: "", interest_rate: "", monthly_payment: "", remaining_balance: "", fixed_term_expiry: "", svr_rate: "" });
    setSaving(false);
  }

  async function addCert() {
    if (!user || !property || !certForm.certificate_type) return;
    setSaving(true);
    const existing = compliance.find(c => c.certificate_type === certForm.certificate_type);
    let data;
    if (existing) {
      const res = await supabase.from("rentura_compliance").update({ issue_date: certForm.issue_date || null, expiry_date: certForm.expiry_date || null, notes: certForm.notes || null, updated_at: new Date().toISOString() }).eq("id", existing.id).select().single();
      data = res.data;
      if (data) setCompliance(prev => prev.map(c => c.id === existing.id ? data! : c));
    } else {
      const res = await supabase.from("rentura_compliance").insert({ property_id: id, user_id: user.id, certificate_type: certForm.certificate_type, issue_date: certForm.issue_date || null, expiry_date: certForm.expiry_date || null, notes: certForm.notes || null, trust_level: "confirmed" }).select().single();
      data = res.data;
      if (data) setCompliance(prev => [...prev, data!].sort((a, b) => (a.expiry_date ?? "").localeCompare(b.expiry_date ?? "")));
    }
    if (data) {
      await supabase.from("rentura_events").insert({ property_id: id, user_id: user.id, event_type: "compliance", title: `${CERT_LABELS[certForm.certificate_type] ?? certForm.certificate_type} recorded`, description: certForm.notes || null, trust_level: "confirmed", metadata: {}, event_date: certForm.issue_date || new Date().toISOString().split("T")[0] });
      const evtRes = await supabase.from("rentura_events").select("*").eq("property_id", id).order("event_date", { ascending: false });
      setEvents(evtRes.data ?? []);
    }
    setShowAddCert(false);
    setCertForm({ certificate_type: "gas_safety", issue_date: "", expiry_date: "", notes: "" });
    setSaving(false);
  }

  // ── Document upload + extraction ─────────────────────────────────────────────

  async function uploadDocument(file: File) {
    if (!user || !property) return;
    setUploading(true);
    setUploadError(null);
    setUploadResult(null);
    setPendingExtract(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("property_id", id as string);

    try {
      const res = await fetch("/api/rentura/extract", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || data.error) { setUploadError(data.error ?? "Extraction failed"); return; }
      setUploadResult(data);
      setPendingExtract(data.extracted);
    } catch {
      setUploadError("Upload failed — please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function saveExtracted() {
    if (!user || !property || !uploadResult || !pendingExtract) return;
    setSaving(true);
    const type = uploadResult.document_type;
    const ex = pendingExtract;

    try {
      if (["gas_safety", "eicr", "epc", "fire_alarm", "pat_test", "legionella"].includes(type)) {
        const existing = compliance.find(c => c.certificate_type === type);
        const certData = {
          property_id: id, user_id: user.id,
          certificate_type: type,
          issue_date: (ex.issue_date as string) ?? null,
          expiry_date: (ex.expiry_date as string) ?? null,
          notes: [ex.engineer_name, ex.cert_number, ex.inspector_name].filter(Boolean).join(" · ") || null,
          trust_level: "verified",
          updated_at: new Date().toISOString(),
        };
        if (existing) {
          const { data } = await supabase.from("rentura_compliance").update(certData).eq("id", existing.id).select().single();
          if (data) setCompliance(prev => prev.map(c => c.id === existing.id ? data : c));
        } else {
          const { data } = await supabase.from("rentura_compliance").insert(certData).select().single();
          if (data) setCompliance(prev => [...prev, data].sort((a, b) => (a.expiry_date ?? "").localeCompare(b.expiry_date ?? "")));
        }
        await supabase.from("rentura_events").insert({ property_id: id, user_id: user.id, event_type: "compliance", title: `${CERT_LABELS[type] ?? type} uploaded & verified`, description: `Expiry: ${ex.expiry_date ?? "not found"}`, trust_level: "verified", metadata: ex, event_date: (ex.issue_date as string) ?? new Date().toISOString().split("T")[0] });
      } else if (type === "mortgage_statement") {
        await supabase.from("rentura_mortgages").update({ is_current: false }).eq("property_id", id).eq("is_current", true);
        const { data } = await supabase.from("rentura_mortgages").insert({ property_id: id, user_id: user.id, lender: ex.lender ?? null, interest_rate: ex.interest_rate ?? null, monthly_payment: ex.monthly_payment ?? null, remaining_balance: ex.remaining_balance ?? null, fixed_term_expiry: ex.fixed_term_expiry ?? null, product_name: ex.product_name ?? null, trust_level: "verified", is_current: true }).select().single();
        if (data) setMortgages(prev => [data, ...prev.map(m => ({ ...m, is_current: false }))]);
        await supabase.from("rentura_events").insert({ property_id: id, user_id: user.id, event_type: "mortgage", title: `Mortgage statement uploaded — ${ex.lender ?? "lender"}`, description: `${ex.interest_rate ?? "?"}% · Balance ${ex.remaining_balance ? "£" + ex.remaining_balance : "?"}`, trust_level: "verified", metadata: ex, event_date: (ex.statement_date as string) ?? new Date().toISOString().split("T")[0] });
      }

      const evtRes = await supabase.from("rentura_events").select("*").eq("property_id", id).order("event_date", { ascending: false });
      setEvents(evtRes.data ?? []);
      setUploadResult(null);
      setPendingExtract(null);
    } finally {
      setSaving(false);
    }
  }

  // ── Section 21 readiness ──────────────────────────────────────────────────────

  function getSection21Checks() {
    const currentTenantLocal = tenants.find(t => t.is_current);
    const gasCert = compliance.find(c => c.certificate_type === "gas_safety");
    const epc = compliance.find(c => c.certificate_type === "epc");
    const eicr = compliance.find(c => c.certificate_type === "eicr");

    const gasValid = gasCert && (daysUntil(gasCert.expiry_date) ?? 1) > 0;
    const epcValid = epc && (daysUntil(epc.expiry_date) ?? 1) > 0;
    const eicrValid = eicr && (daysUntil(eicr.expiry_date) ?? 1) > 0;
    const depositProtected = !!currentTenantLocal?.deposit_scheme;

    return [
      { label: "Gas Safety Certificate", pass: !!gasValid, detail: gasValid ? `Valid · expires ${epc?.expiry_date ?? "?"}` : (gasCert ? "Certificate expired" : "Not recorded"), required: true, fixTab: "compliance" as Tab },
      { label: "EPC (min E rating)", pass: !!epcValid, detail: epcValid ? "Recorded and valid" : (epc ? "Certificate expired" : "Not recorded"), required: true, fixTab: "compliance" as Tab },
      { label: "EICR", pass: !!eicrValid, detail: eicrValid ? "Recorded and valid" : (eicr ? "Certificate expired" : "Not recorded"), required: true, fixTab: "compliance" as Tab },
      { label: "Deposit protected", pass: depositProtected, detail: depositProtected ? `Scheme: ${currentTenantLocal?.deposit_scheme}` : "No deposit scheme recorded", required: true, fixTab: "tenants" as Tab },
      { label: "Prescribed Information served", pass: null, detail: "Confirm manually — must be served same day deposit received", required: true, fixTab: null },
      { label: "How to Rent guide served", pass: null, detail: "Confirm manually — must be current version at start of tenancy", required: true, fixTab: null },
      { label: "No improvement notice", pass: null, detail: "Confirm no outstanding improvement notices from council", required: true, fixTab: null },
    ];
  }

  const BG = "#eceae2";
  const INK = "#111111";
  const INK2 = "rgba(17,17,17,0.52)";
  const BORDER = "rgba(17,17,17,0.09)";
  const CTA = "#0f1728";

  const inputStyle = { width: "100%", boxSizing: "border-box" as const, padding: "11px 14px", fontSize: 14, color: INK, border: `1px solid ${BORDER}`, borderRadius: 9, outline: "none", background: "#fafaf9", fontFamily: "inherit" };
  const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, color: "rgba(17,17,17,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 6 };

  const currentTenant = tenants.find(t => t.is_current);
  const currentMortgage = mortgages.find(m => m.is_current);
  const totalMonthlyIncome = currentTenant?.monthly_rent ?? 0;
  const annualYield = property?.purchase_price && totalMonthlyIncome
    ? ((totalMonthlyIncome * 12 / property.purchase_price) * 100).toFixed(2)
    : null;

  const TABS: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "timeline", label: `Timeline (${events.length})` },
    { key: "tenants", label: `Tenants (${tenants.length})` },
    { key: "mortgage", label: "Mortgage" },
    { key: "compliance", label: `Compliance (${compliance.length})` },
    { key: "maintenance", label: `Maintenance (${maintenance.filter(m => m.status !== "resolved").length})` },
    { key: "documents", label: "Documents" },
  ];

  const MAINT_URGENCY: Record<string, { label: string; color: string }> = {
    emergency: { label: "Emergency", color: "#dc2626" },
    urgent:    { label: "Urgent",    color: "#d97706" },
    routine:   { label: "Routine",   color: "#2563eb" },
  };

  const MAINT_STATUS: Record<string, { label: string; color: string }> = {
    open:        { label: "Open",        color: "#d97706" },
    in_progress: { label: "In progress", color: "#2563eb" },
    resolved:    { label: "Resolved",    color: "#16a34a" },
  };

  async function saveMaintIssue() {
    if (!user || !property || !maintForm.title.trim()) return;
    setMaintSaving(true);
    const { data } = await supabase.from("rentura_maintenance").insert({
      property_id: id, user_id: user.id,
      title: maintForm.title.trim(),
      description: maintForm.description.trim() || null,
      category: maintForm.category, urgency: maintForm.urgency, status: "open",
      contractor_name: maintForm.contractor_name.trim() || null,
      contractor_phone: maintForm.contractor_phone.trim() || null,
      estimated_cost: maintForm.estimated_cost ? parseFloat(maintForm.estimated_cost) : null,
      reported_date: new Date().toISOString().split("T")[0],
    }).select().single();
    if (data) {
      setMaintenance(prev => [data as RenturaMaintenance, ...prev]);
      await supabase.from("rentura_events").insert({
        property_id: id, user_id: user.id, event_type: "maintenance_logged",
        title: `Issue logged — ${maintForm.title.trim()}`,
        description: `${MAINT_URGENCY[maintForm.urgency].label} · ${maintForm.category}`,
        trust_level: "confirmed", metadata: {}, event_date: new Date().toISOString().split("T")[0],
      });
      const evtRes = await supabase.from("rentura_events").select("*").eq("property_id", id).order("event_date", { ascending: false });
      setEvents(evtRes.data ?? []);
    }
    setMaintForm({ title: "", description: "", category: "other", urgency: "routine", contractor_name: "", contractor_phone: "", estimated_cost: "" });
    setShowAddMaint(false);
    setMaintSaving(false);
  }

  async function updateMaintStatus(issueId: string, status: string) {
    const update: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
    if (status === "resolved") update.resolved_date = new Date().toISOString().split("T")[0];
    const { data } = await supabase.from("rentura_maintenance").update(update).eq("id", issueId).select().single();
    if (data) setMaintenance(prev => prev.map(m => m.id === issueId ? data as RenturaMaintenance : m));
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: INK2, fontSize: 14 }}>Loading Passport…</p>
      </div>
    );
  }

  if (!property) return null;

  return (
    <div style={{ fontFamily: "var(--font-family-body)", background: BG, color: INK, minHeight: "100vh" }}>

      {/* Nav */}
      <nav style={{ borderBottom: `1px solid ${BORDER}`, padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", background: BG, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
          <Link href="/rentura/dashboard" style={{ color: INK2, textDecoration: "none", fontWeight: 500 }}>Dashboard</Link>
          <span style={{ color: INK2 }}>›</span>
          <span style={{ color: INK, fontWeight: 700 }}>{property.nickname ?? property.address.split(",")[0]}</span>
        </div>
        <Link href="/rentura/dashboard" style={{ fontSize: 12, color: INK2, textDecoration: "none", fontWeight: 600 }}>← Back</Link>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* ── HEADER ── */}
        <div style={{ padding: "36px 0 24px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "rgba(17,17,17,0.35)", textTransform: "uppercase", letterSpacing: "0.12em", background: "rgba(17,17,17,0.06)", padding: "3px 10px", borderRadius: 20 }}>
                  Property Passport™
                </span>
              </div>
              <h1 style={{ fontSize: "clamp(24px,4vw,38px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, fontFamily: "var(--font-family-heading)" }}>
                {property.address.split(",")[0]}
              </h1>
              <p style={{ fontSize: 14, color: INK2, marginTop: 4 }}>
                {property.address.split(",").slice(1).join(",").trim()} · {property.property_type} · {property.bedrooms ? `${property.bedrooms} bed` : "?"}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => { setShowAddMaint(true); setTab("maintenance"); }}
                style={{ background: "white", border: `1px solid ${BORDER}`, color: INK2, fontWeight: 700, fontSize: 13, padding: "9px 16px", borderRadius: 9, cursor: "pointer", fontFamily: "inherit" }}>
                🔧 Log issue
              </button>
              <button onClick={() => setTab("documents")}
                style={{ background: "white", border: `1px solid ${BORDER}`, color: INK2, fontWeight: 700, fontSize: 13, padding: "9px 16px", borderRadius: 9, cursor: "pointer", fontFamily: "inherit" }}>
                ↑ Upload doc
              </button>
              <button onClick={() => { setShowAddCert(true); setTab("compliance"); }}
                style={{ background: "white", border: `1px solid ${BORDER}`, color: INK2, fontWeight: 700, fontSize: 13, padding: "9px 16px", borderRadius: 9, cursor: "pointer", fontFamily: "inherit" }}>
                + Cert
              </button>
              <button onClick={() => { setShowAddTenant(true); setTab("tenants"); }}
                style={{ background: "white", border: `1px solid ${BORDER}`, color: INK2, fontWeight: 700, fontSize: 13, padding: "9px 16px", borderRadius: 9, cursor: "pointer", fontFamily: "inherit" }}>
                + Tenant
              </button>
              <button onClick={() => { setShowAddMortgage(true); setTab("mortgage"); }}
                style={{ background: "white", border: `1px solid ${BORDER}`, color: INK2, fontWeight: 700, fontSize: 13, padding: "9px 16px", borderRadius: 9, cursor: "pointer", fontFamily: "inherit" }}>
                + Mortgage
              </button>
              <Link href={`/rentura/properties/${id}/passport`}
                style={{ background: CTA, color: "white", fontWeight: 700, fontSize: 13, padding: "9px 16px", borderRadius: 9, textDecoration: "none", display: "inline-block" }}>
                Export PDF →
              </Link>
            </div>
          </div>

          {/* Key stats */}
          <div style={{ display: "flex", gap: 0, marginTop: 24, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
            {[
              ["Rent / mo", fmt(currentTenant?.monthly_rent)],
              ["Annual yield", annualYield ? annualYield + "%" : "—"],
              ["Purchase price", fmt(property.purchase_price)],
              ["Current value", fmt(property.current_value)],
              ["Mortgage rate", currentMortgage?.interest_rate ? currentMortgage.interest_rate + "%" : "—"],
            ].map(([label, val], i, arr) => (
              <div key={label} style={{ flex: 1, padding: "14px 16px", borderRight: i < arr.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(17,17,17,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{label}</p>
                <p style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.02em" }}>{val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── TABS ── */}
        <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${BORDER}`, marginBottom: 28, overflowX: "auto" }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ padding: "12px 18px", fontSize: 13, fontWeight: tab === t.key ? 800 : 600, color: tab === t.key ? INK : INK2, borderBottom: tab === t.key ? `2px solid ${INK}` : "2px solid transparent", background: "none", borderTop: "none", borderLeft: "none", borderRight: "none", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0 }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Current tenant */}
            <div style={{ background: "white", borderRadius: 14, padding: 22, border: `1px solid ${BORDER}` }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: "rgba(17,17,17,0.38)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Current Tenant</p>
              {currentTenant ? (
                <div>
                  <p style={{ fontSize: 18, fontWeight: 900, marginBottom: 4 }}>{currentTenant.name}</p>
                  <p style={{ fontSize: 13, color: INK2, marginBottom: 2 }}>{fmt(currentTenant.monthly_rent)}/mo</p>
                  {currentTenant.move_in_date && <p style={{ fontSize: 12, color: INK2 }}>Since {fmtDate(currentTenant.move_in_date)}</p>}
                  {currentTenant.deposit_amount && <p style={{ fontSize: 12, color: INK2 }}>Deposit {fmt(currentTenant.deposit_amount)}{currentTenant.deposit_scheme ? ` · ${currentTenant.deposit_scheme}` : ""}</p>}
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: 14, color: "#d97706", fontWeight: 700 }}>Vacant</p>
                  <button onClick={() => { setShowAddTenant(true); }} style={{ marginTop: 12, fontSize: 12, fontWeight: 700, color: INK2, background: BG, border: `1px solid ${BORDER}`, borderRadius: 7, padding: "7px 14px", cursor: "pointer", fontFamily: "inherit" }}>
                    Add tenant →
                  </button>
                </div>
              )}
            </div>

            {/* Mortgage */}
            <div style={{ background: "white", borderRadius: 14, padding: 22, border: `1px solid ${BORDER}` }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: "rgba(17,17,17,0.38)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Mortgage</p>
              {currentMortgage ? (
                <div>
                  <p style={{ fontSize: 18, fontWeight: 900, marginBottom: 4 }}>{currentMortgage.lender ?? "—"}</p>
                  <p style={{ fontSize: 13, color: INK2, marginBottom: 2 }}>{currentMortgage.interest_rate}% · {fmt(currentMortgage.monthly_payment)}/mo</p>
                  {currentMortgage.fixed_term_expiry && (
                    <div style={{ marginTop: 8 }}>
                      <ExpiryPill expiry={currentMortgage.fixed_term_expiry} />
                    </div>
                  )}
                  {currentMortgage.remaining_balance && <p style={{ fontSize: 12, color: INK2, marginTop: 6 }}>Balance {fmt(currentMortgage.remaining_balance)}</p>}
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: 14, color: INK2 }}>No mortgage recorded</p>
                  <button onClick={() => { setShowAddMortgage(true); }} style={{ marginTop: 12, fontSize: 12, fontWeight: 700, color: INK2, background: BG, border: `1px solid ${BORDER}`, borderRadius: 7, padding: "7px 14px", cursor: "pointer", fontFamily: "inherit" }}>
                    Add mortgage →
                  </button>
                </div>
              )}
            </div>

            {/* Compliance summary */}
            <div style={{ background: "white", borderRadius: 14, padding: 22, border: `1px solid ${BORDER}`, gridColumn: "1 / -1" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <p style={{ fontSize: 11, fontWeight: 800, color: "rgba(17,17,17,0.38)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Compliance</p>
                <button onClick={() => setShowAddCert(true)} style={{ fontSize: 12, fontWeight: 700, color: INK2, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>+ Add cert</button>
              </div>
              {compliance.length === 0 ? (
                <p style={{ fontSize: 14, color: INK2 }}>No certificates recorded.</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10 }}>
                  {compliance.map(cert => {
                    const days = daysUntil(cert.expiry_date);
                    const urgent = days != null && days <= 45;
                    return (
                      <div key={cert.id} style={{ padding: "12px 14px", borderRadius: 10, background: urgent ? "rgba(220,38,38,0.04)" : "#fafaf9", border: `1px solid ${urgent ? "rgba(220,38,38,0.2)" : BORDER}` }}>
                        <p style={{ fontSize: 12, fontWeight: 800, marginBottom: 4 }}>{CERT_LABELS[cert.certificate_type] ?? cert.certificate_type}</p>
                        <ExpiryPill expiry={cert.expiry_date} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent events */}
            {events.length > 0 && (
              <div style={{ background: "white", borderRadius: 14, padding: 22, border: `1px solid ${BORDER}`, gridColumn: "1 / -1" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: "rgba(17,17,17,0.38)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Recent Activity</p>
                  <button onClick={() => setTab("timeline")} style={{ fontSize: 12, fontWeight: 700, color: INK2, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>View all →</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {events.slice(0, 5).map((evt, i) => (
                    <div key={evt.id} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < Math.min(events.length, 5) - 1 ? `1px solid ${BORDER}` : "none" }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{EVENT_ICONS[evt.event_type] ?? "📝"}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{evt.title}</p>
                        {evt.description && <p style={{ fontSize: 12, color: INK2 }}>{evt.description}</p>}
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        {evt.amount && <p style={{ fontSize: 13, fontWeight: 700 }}>{fmt(evt.amount)}</p>}
                        <p style={{ fontSize: 11, color: INK2 }}>{fmtDate(evt.event_date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TIMELINE ── */}
        {tab === "timeline" && (
          <div>
            {events.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: INK2 }}>
                <p style={{ fontSize: 32, marginBottom: 16 }}>📋</p>
                <p style={{ fontSize: 15, fontWeight: 700 }}>No events yet.</p>
                <p style={{ fontSize: 13, marginTop: 6 }}>Use the chat on the dashboard to log payments, maintenance, and more.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {events.map((evt, i) => (
                  <div key={evt.id} style={{ display: "flex", gap: 16, padding: "16px 0", borderBottom: i < events.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 22 }}>{EVENT_ICONS[evt.event_type] ?? "📝"}</span>
                      {i < events.length - 1 && <div style={{ flex: 1, width: 1, background: BORDER, marginTop: 8 }} />}
                    </div>
                    <div style={{ flex: 1, paddingBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 800, marginBottom: 2 }}>{evt.title}</p>
                          {evt.description && <p style={{ fontSize: 13, color: INK2, lineHeight: 1.5 }}>{evt.description}</p>}
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          {evt.amount && <p style={{ fontSize: 14, fontWeight: 800 }}>{fmt(evt.amount)}</p>}
                          <p style={{ fontSize: 11, color: INK2 }}>{fmtDate(evt.event_date)}</p>
                          <div style={{ marginTop: 4 }}><TrustBadge level={evt.trust_level} /></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TENANTS ── */}
        {tab === "tenants" && (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
              <button onClick={() => setShowAddTenant(true)} style={{ background: CTA, color: "white", fontWeight: 700, fontSize: 13, padding: "10px 20px", borderRadius: 9, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                + Add tenant
              </button>
            </div>
            {tenants.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: INK2 }}>
                <p style={{ fontSize: 32, marginBottom: 16 }}>🔑</p>
                <p style={{ fontSize: 15, fontWeight: 700 }}>No tenants recorded.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {tenants.map(t => (
                  <div key={t.id} style={{ background: "white", borderRadius: 13, padding: "18px 20px", border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 40, height: 40, background: t.is_current ? CTA : "rgba(17,17,17,0.08)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: t.is_current ? "white" : INK2, flexShrink: 0 }}>
                      {(t.name || t.first_name || "?")[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                        <p style={{ fontSize: 15, fontWeight: 800 }}>{t.name}</p>
                        {t.is_current && <span style={{ fontSize: 10, fontWeight: 700, color: "#16a34a", background: "rgba(22,163,74,0.08)", padding: "2px 8px", borderRadius: 20 }}>Current</span>}
                      </div>
                      <p style={{ fontSize: 13, color: INK2 }}>
                        {fmt(t.monthly_rent)}/mo{t.move_in_date ? ` · from ${fmtDate(t.move_in_date)}` : ""}
                        {t.move_out_date ? ` → ${fmtDate(t.move_out_date)}` : ""}
                      </p>
                      {t.deposit_amount && <p style={{ fontSize: 12, color: INK2, marginTop: 2 }}>Deposit {fmt(t.deposit_amount)}{t.deposit_scheme ? ` · ${t.deposit_scheme}` : ""}</p>}
                    </div>
                    {t.email && <p style={{ fontSize: 12, color: INK2 }}>{t.email}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── MORTGAGE ── */}
        {tab === "mortgage" && (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
              <button onClick={() => setShowAddMortgage(true)} style={{ background: CTA, color: "white", fontWeight: 700, fontSize: 13, padding: "10px 20px", borderRadius: 9, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                + Add / update mortgage
              </button>
            </div>
            {mortgages.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: INK2 }}>
                <p style={{ fontSize: 32, marginBottom: 16 }}>🏦</p>
                <p style={{ fontSize: 15, fontWeight: 700 }}>No mortgage recorded.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {mortgages.map(m => (
                  <div key={m.id} style={{ background: "white", borderRadius: 14, padding: "20px 22px", border: `1px solid ${BORDER}` }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <p style={{ fontSize: 17, fontWeight: 900 }}>{m.lender ?? "Unknown lender"}</p>
                        {m.is_current && <span style={{ fontSize: 10, fontWeight: 700, color: "#2563eb", background: "rgba(37,99,235,0.08)", padding: "2px 8px", borderRadius: 20 }}>Current</span>}
                      </div>
                      <TrustBadge level={m.trust_level} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 14 }}>
                      {[
                        ["Product", m.product_name],
                        ["Rate", m.interest_rate ? m.interest_rate + "%" : null],
                        ["Monthly", fmt(m.monthly_payment)],
                        ["Balance", fmt(m.remaining_balance)],
                        ["SVR", m.svr_rate ? m.svr_rate + "%" : null],
                      ].map(([label, val]) => val && (
                        <div key={label as string}>
                          <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(17,17,17,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{label}</p>
                          <p style={{ fontSize: 14, fontWeight: 700 }}>{val}</p>
                        </div>
                      ))}
                    </div>
                    {m.fixed_term_expiry && (
                      <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${BORDER}` }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(17,17,17,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Fixed term expiry</p>
                        <ExpiryPill expiry={m.fixed_term_expiry} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── COMPLIANCE ── */}
        {tab === "compliance" && (
          <div>
            {/* Section 21 readiness check */}
            <div style={{ background: "white", borderRadius: 14, padding: "20px 22px", border: `1px solid ${BORDER}`, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, background: "#0f1728", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚖️</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 900, letterSpacing: "-0.01em" }}>Section 21 Readiness Check</p>
                  <p style={{ fontSize: 12, color: INK2 }}>Can you legally serve a Section 21 notice right now?</p>
                </div>
              </div>
              {(() => {
                const checks = getSection21Checks();
                const failCount = checks.filter(c => c.pass === false).length;
                const unknownCount = checks.filter(c => c.pass === null).length;
                const allPass = failCount === 0 && unknownCount === 0;
                return (
                  <>
                    <div style={{ marginBottom: 14, padding: "10px 14px", borderRadius: 8, background: failCount > 0 ? "rgba(220,38,38,0.06)" : allPass ? "rgba(22,163,74,0.06)" : "rgba(217,119,6,0.06)", border: `1px solid ${failCount > 0 ? "rgba(220,38,38,0.2)" : allPass ? "rgba(22,163,74,0.2)" : "rgba(217,119,6,0.2)"}` }}>
                      <p style={{ fontSize: 13, fontWeight: 800, color: failCount > 0 ? "#dc2626" : allPass ? "#16a34a" : "#d97706" }}>
                        {failCount > 0 ? `${failCount} issue${failCount > 1 ? "s" : ""} must be resolved before serving` : allPass ? "Ready to serve Section 21" : `${unknownCount} item${unknownCount > 1 ? "s" : ""} need manual confirmation`}
                      </p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {checks.map(check => (
                        <div key={check.label} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: `1px solid ${BORDER}` }}>
                          <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>
                            {check.pass === true ? "✅" : check.pass === false ? "❌" : "○"}
                          </span>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{check.label}</p>
                            <p style={{ fontSize: 12, color: check.pass === false ? "#dc2626" : INK2 }}>{check.detail}</p>
                          </div>
                          {check.pass === false && check.fixTab && (
                            <button onClick={() => setTab(check.fixTab!)} style={{ fontSize: 11, fontWeight: 700, color: "#dc2626", background: "none", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
                              Fix →
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
              <button onClick={() => setShowAddCert(true)} style={{ background: CTA, color: "white", fontWeight: 700, fontSize: 13, padding: "10px 20px", borderRadius: 9, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                + Add / update certificate
              </button>
            </div>
            {CERT_TYPES.map(type => {
              const cert = compliance.find(c => c.certificate_type === type);
              const days = daysUntil(cert?.expiry_date ?? null);
              const urgent = days != null && days <= 45;
              return (
                <div key={type} style={{ background: "white", borderRadius: 13, padding: "16px 20px", border: `1px solid ${urgent ? "rgba(220,38,38,0.25)" : BORDER}`, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>{CERT_LABELS[type]}</p>
                    {cert ? (
                      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                        <ExpiryPill expiry={cert.expiry_date} />
                        <TrustBadge level={cert.trust_level} />
                        {cert.notes && <span style={{ fontSize: 12, color: INK2 }}>{cert.notes}</span>}
                      </div>
                    ) : (
                      <p style={{ fontSize: 12, color: "rgba(17,17,17,0.38)" }}>Not recorded</p>
                    )}
                  </div>
                  <button
                    onClick={() => { setCertForm({ certificate_type: type, issue_date: cert?.issue_date ?? "", expiry_date: cert?.expiry_date ?? "", notes: cert?.notes ?? "" }); setShowAddCert(true); }}
                    style={{ fontSize: 12, fontWeight: 700, color: INK2, background: BG, border: `1px solid ${BORDER}`, borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
                    {cert ? "Update" : "Add"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
        {/* ── MAINTENANCE ── */}
        {tab === "maintenance" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: INK2 }}>
                {maintenance.filter(m => m.status !== "resolved").length} open · {maintenance.filter(m => m.status === "resolved").length} resolved
              </p>
              <button onClick={() => setShowAddMaint(true)}
                style={{ background: CTA, color: "white", fontWeight: 700, fontSize: 13, padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                + Log issue
              </button>
            </div>

            {maintenance.length === 0 ? (
              <div style={{ textAlign: "center", padding: "50px 0" }}>
                <p style={{ fontSize: 32, marginBottom: 12 }}>✅</p>
                <p style={{ fontWeight: 700 }}>No maintenance issues logged.</p>
              </div>
            ) : (
              maintenance.map(issue => {
                const urg = MAINT_URGENCY[issue.urgency] ?? { label: issue.urgency, color: "#111" };
                const sta = MAINT_STATUS[issue.status] ?? { label: issue.status, color: "#111" };
                return (
                  <div key={issue.id} style={{ background: "white", borderRadius: 12, padding: "16px 18px", border: `1px solid ${issue.urgency === "emergency" ? "rgba(220,38,38,0.3)" : BORDER}`, marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                      <p style={{ fontSize: 14, fontWeight: 800, color: INK }}>{issue.title}</p>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: urg.color, background: `${urg.color}12`, padding: "2px 8px", borderRadius: 20 }}>{urg.label}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: sta.color, background: `${sta.color}12`, padding: "2px 8px", borderRadius: 20 }}>{sta.label}</span>
                      </div>
                    </div>
                    {issue.description && <p style={{ fontSize: 13, color: INK2, lineHeight: 1.5, marginBottom: 8 }}>{issue.description}</p>}
                    {issue.contractor_name && <p style={{ fontSize: 12, color: INK2, marginBottom: 6 }}>👷 {issue.contractor_name}{issue.contractor_phone ? ` · ${issue.contractor_phone}` : ""}</p>}
                    {issue.actual_cost && <p style={{ fontSize: 12, fontWeight: 700, color: INK, marginBottom: 6 }}>Cost: £{issue.actual_cost.toLocaleString("en-GB")}</p>}
                    {issue.status !== "resolved" && (
                      <div style={{ display: "flex", gap: 8, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${BORDER}` }}>
                        {issue.status === "open" && (
                          <button onClick={() => updateMaintStatus(issue.id, "in_progress")}
                            style={{ fontSize: 12, fontWeight: 700, padding: "6px 14px", borderRadius: 7, border: "none", background: "#0f1728", color: "white", cursor: "pointer", fontFamily: "inherit" }}>
                            Mark in progress
                          </button>
                        )}
                        <button onClick={() => updateMaintStatus(issue.id, "resolved")}
                          style={{ fontSize: 12, fontWeight: 700, padding: "6px 14px", borderRadius: 7, border: "none", background: "#16a34a", color: "white", cursor: "pointer", fontFamily: "inherit" }}>
                          Mark resolved
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Add issue inline modal */}
            {showAddMaint && (
              <div style={{ background: "white", borderRadius: 14, padding: "20px", border: `1px solid ${BORDER}`, marginTop: 16 }}>
                <p style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>Log Issue</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input type="text" placeholder="Issue title *" value={maintForm.title} onChange={e => setMaintForm(f => ({ ...f, title: e.target.value }))}
                    style={{ padding: "10px 14px", fontSize: 14, borderRadius: 8, border: `1px solid ${BORDER}`, outline: "none", fontFamily: "inherit" }} />
                  <textarea placeholder="Description (optional)" value={maintForm.description} onChange={e => setMaintForm(f => ({ ...f, description: e.target.value }))}
                    style={{ padding: "10px 14px", fontSize: 14, borderRadius: 8, border: `1px solid ${BORDER}`, outline: "none", fontFamily: "inherit", minHeight: 70, resize: "vertical" as const }} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <select value={maintForm.category} onChange={e => setMaintForm(f => ({ ...f, category: e.target.value as MaintenanceCategory }))}
                      style={{ padding: "10px 14px", fontSize: 14, borderRadius: 8, border: `1px solid ${BORDER}`, fontFamily: "inherit" }}>
                      {[["plumbing","Plumbing"],["electrical","Electrical"],["structural","Structural"],["appliance","Appliance"],["damp","Damp / Mould"],["roofing","Roofing"],["other","Other"]].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                    <select value={maintForm.urgency} onChange={e => setMaintForm(f => ({ ...f, urgency: e.target.value as MaintenanceUrgency }))}
                      style={{ padding: "10px 14px", fontSize: 14, borderRadius: 8, border: `1px solid ${BORDER}`, fontFamily: "inherit" }}>
                      <option value="emergency">⚠ Emergency</option>
                      <option value="urgent">◎ Urgent</option>
                      <option value="routine">○ Routine</option>
                    </select>
                  </div>
                  <input type="text" placeholder="Contractor name (optional)" value={maintForm.contractor_name} onChange={e => setMaintForm(f => ({ ...f, contractor_name: e.target.value }))}
                    style={{ padding: "10px 14px", fontSize: 14, borderRadius: 8, border: `1px solid ${BORDER}`, outline: "none", fontFamily: "inherit" }} />
                  <input type="tel" placeholder="Contractor phone (optional)" value={maintForm.contractor_phone} onChange={e => setMaintForm(f => ({ ...f, contractor_phone: e.target.value }))}
                    style={{ padding: "10px 14px", fontSize: 14, borderRadius: 8, border: `1px solid ${BORDER}`, outline: "none", fontFamily: "inherit" }} />
                  <input type="text" placeholder="Estimated cost e.g. 300" value={maintForm.estimated_cost} onChange={e => setMaintForm(f => ({ ...f, estimated_cost: e.target.value }))}
                    style={{ padding: "10px 14px", fontSize: 14, borderRadius: 8, border: `1px solid ${BORDER}`, outline: "none", fontFamily: "inherit" }} />
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={saveMaintIssue} disabled={maintSaving || !maintForm.title.trim()}
                      style={{ flex: 1, background: CTA, color: "white", fontWeight: 800, fontSize: 14, padding: "12px", borderRadius: 9, border: "none", cursor: "pointer", fontFamily: "inherit", opacity: (maintSaving || !maintForm.title.trim()) ? 0.5 : 1 }}>
                      {maintSaving ? "Saving…" : "Log issue"}
                    </button>
                    <button onClick={() => setShowAddMaint(false)}
                      style={{ padding: "12px 18px", fontSize: 14, borderRadius: 9, border: `1px solid ${BORDER}`, background: "none", cursor: "pointer", fontFamily: "inherit", color: INK2 }}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── DOCUMENTS ── */}
        {tab === "documents" && (
          <div>
            {/* Upload area */}
            <div style={{ background: "white", borderRadius: 14, padding: "28px 24px", border: `2px dashed ${BORDER}`, marginBottom: 20, textAlign: "center" }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (file) uploadDocument(file); }}>
              <p style={{ fontSize: 28, marginBottom: 12 }}>📄</p>
              <p style={{ fontSize: 15, fontWeight: 800, marginBottom: 6, letterSpacing: "-0.01em" }}>Upload a document</p>
              <p style={{ fontSize: 13, color: INK2, marginBottom: 20, lineHeight: 1.6 }}>
                Gas Safety, EICR, EPC, mortgage statement, insurance, tenancy agreement.<br />
                Rentura reads it and updates the Passport automatically — data marked{" "}
                <span style={{ color: "#16a34a", fontWeight: 700 }}>✓ VERIFIED</span>.
              </p>
              <label style={{ display: "inline-block", background: CTA, color: "white", fontWeight: 700, fontSize: 14, padding: "11px 24px", borderRadius: 9, cursor: "pointer" }}>
                {uploading ? "Extracting…" : "Choose file (PDF or image)"}
                <input type="file" accept=".pdf,image/*" style={{ display: "none" }} disabled={uploading}
                  onChange={e => { const file = e.target.files?.[0]; if (file) uploadDocument(file); e.target.value = ""; }} />
              </label>
              <p style={{ fontSize: 11, color: INK2, marginTop: 12 }}>Or drag and drop · Max 10MB</p>
            </div>

            {/* Upload error */}
            {uploadError && (
              <div style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 10, padding: "12px 16px", color: "#dc2626", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
                {uploadError}
              </div>
            )}

            {/* Extraction result */}
            {uploadResult && pendingExtract && (
              <div style={{ background: "white", borderRadius: 14, padding: "22px 24px", border: "1px solid rgba(22,163,74,0.3)", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 18 }}>✅</span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 800 }}>Document read successfully</p>
                    <p style={{ fontSize: 12, color: INK2 }}>{uploadResult.summary}</p>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: "#16a34a", background: "rgba(22,163,74,0.08)", padding: "3px 8px", borderRadius: 20 }}>
                    {Math.round((uploadResult.confidence ?? 0) * 100)}% confidence
                  </span>
                </div>

                {/* Extracted fields */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12, marginBottom: 16, background: "#fafaf9", borderRadius: 10, padding: 16 }}>
                  {Object.entries(pendingExtract).filter(([, v]) => v != null).map(([k, v]) => (
                    <div key={k}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(17,17,17,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>
                        {k.replace(/_/g, " ")}
                      </p>
                      <p style={{ fontSize: 13, fontWeight: 600 }}>{String(v)}</p>
                    </div>
                  ))}
                </div>

                {uploadResult.warnings?.length > 0 && (
                  <div style={{ background: "rgba(217,119,6,0.06)", border: "1px solid rgba(217,119,6,0.2)", borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
                    {uploadResult.warnings.map((w, i) => (
                      <p key={i} style={{ fontSize: 12, color: "#d97706", fontWeight: 600 }}>⚠ {w}</p>
                    ))}
                  </div>
                )}

                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={saveExtracted} disabled={saving}
                    style={{ background: "#16a34a", color: "white", fontWeight: 800, fontSize: 14, padding: "11px 22px", borderRadius: 9, border: "none", cursor: "pointer", fontFamily: "inherit", opacity: saving ? 0.6 : 1 }}>
                    {saving ? "Saving…" : "Save to Passport — mark Verified ✓"}
                  </button>
                  <button onClick={() => { setUploadResult(null); setPendingExtract(null); }}
                    style={{ background: "none", border: `1px solid ${BORDER}`, color: INK2, fontWeight: 600, fontSize: 14, padding: "11px 18px", borderRadius: 9, cursor: "pointer", fontFamily: "inherit" }}>
                    Discard
                  </button>
                </div>
              </div>
            )}

            {/* What gets extracted */}
            <div style={{ background: "white", borderRadius: 14, padding: "20px 22px", border: `1px solid ${BORDER}` }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: "rgba(17,17,17,0.38)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>What Rentura can read</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 10 }}>
                {[
                  ["📋", "Gas Safety Certificate", "Expiry, engineer, cert number → Compliance"],
                  ["⚡", "EICR", "Expiry, inspector, outcome → Compliance"],
                  ["🏠", "EPC", "Expiry, rating, score → Compliance"],
                  ["🏦", "Mortgage statement", "Rate, balance, lender, expiry → Mortgage"],
                  ["📝", "Tenancy agreement", "Tenant name, rent, dates → Tenants"],
                  ["🧾", "Invoice / receipt", "Amount, date, description → Timeline"],
                ].map(([icon, label, dest]) => (
                  <div key={label} style={{ display: "flex", gap: 10, padding: "10px 12px", background: "#fafaf9", borderRadius: 9 }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 2 }}>{label}</p>
                      <p style={{ fontSize: 11, color: INK2 }}>{dest}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── MODALS ── */}

      {showAddTenant && (
        <Modal title="Add Tenant" onClose={() => setShowAddTenant(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              ["Name *", "name", "text", "Full name"],
              ["Email", "email", "email", "tenant@email.com"],
              ["Phone", "phone", "tel", "07700 000000"],
              ["Monthly rent (£)", "monthly_rent", "text", "1200"],
              ["Move-in date", "move_in_date", "date", ""],
              ["Deposit amount (£)", "deposit_amount", "text", "1200"],
              ["Deposit scheme", "deposit_scheme", "text", "DPS / TDS / mydeposits"],
            ].map(([label, key, type, placeholder]) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input type={type} placeholder={placeholder} value={(tenantForm as Record<string, string>)[key]} onChange={e => setTenantForm(f => ({ ...f, [key]: e.target.value }))} style={inputStyle} />
              </div>
            ))}
            <button onClick={addTenant} disabled={saving || !tenantForm.name.trim()} style={{ background: CTA, color: "white", fontWeight: 800, fontSize: 15, padding: "13px 0", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit", marginTop: 8, opacity: saving ? 0.6 : 1 }}>
              {saving ? "Saving…" : "Add Tenant"}
            </button>
          </div>
        </Modal>
      )}

      {showAddMortgage && (
        <Modal title="Add / Update Mortgage" onClose={() => setShowAddMortgage(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              ["Lender", "lender", "text", "Barclays"],
              ["Product name", "product_name", "text", "Buy-to-let 2yr Fixed"],
              ["Interest rate (%)", "interest_rate", "text", "4.89"],
              ["Monthly payment (£)", "monthly_payment", "text", "850"],
              ["Remaining balance (£)", "remaining_balance", "text", "180000"],
              ["Fixed term expiry", "fixed_term_expiry", "date", ""],
              ["SVR rate (%)", "svr_rate", "text", "8.99"],
            ].map(([label, key, type, placeholder]) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input type={type} placeholder={placeholder} value={(mortgageForm as Record<string, string>)[key]} onChange={e => setMortgageForm(f => ({ ...f, [key]: e.target.value }))} style={inputStyle} />
              </div>
            ))}
            <button onClick={addMortgage} disabled={saving} style={{ background: CTA, color: "white", fontWeight: 800, fontSize: 15, padding: "13px 0", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit", marginTop: 8, opacity: saving ? 0.6 : 1 }}>
              {saving ? "Saving…" : "Save Mortgage"}
            </button>
          </div>
        </Modal>
      )}

      {showAddCert && (
        <Modal title="Add / Update Certificate" onClose={() => setShowAddCert(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={labelStyle}>Certificate type</label>
              <select value={certForm.certificate_type} onChange={e => setCertForm(f => ({ ...f, certificate_type: e.target.value }))}
                style={{ ...inputStyle, cursor: "pointer" }}>
                {CERT_TYPES.map(t => <option key={t} value={t}>{CERT_LABELS[t]}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Issue date</label>
              <input type="date" value={certForm.issue_date} onChange={e => setCertForm(f => ({ ...f, issue_date: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Expiry date</label>
              <input type="date" value={certForm.expiry_date} onChange={e => setCertForm(f => ({ ...f, expiry_date: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Notes</label>
              <input type="text" placeholder="e.g. Engineer: John Smith, cert no. GSC-12345" value={certForm.notes} onChange={e => setCertForm(f => ({ ...f, notes: e.target.value }))} style={inputStyle} />
            </div>
            <button onClick={addCert} disabled={saving} style={{ background: CTA, color: "white", fontWeight: 800, fontSize: 15, padding: "13px 0", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit", marginTop: 8, opacity: saving ? 0.6 : 1 }}>
              {saving ? "Saving…" : "Save Certificate"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
