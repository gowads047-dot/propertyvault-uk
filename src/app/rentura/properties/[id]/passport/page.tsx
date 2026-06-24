"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import type { RenturaProperty, RenturaEvent, RenturaTenant, RenturaMortgage, RenturaCompliance } from "@/lib/rentura/types";

function fmt(n: number | null | undefined, prefix = "£") {
  if (n == null) return "—";
  return prefix + n.toLocaleString("en-GB");
}

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function daysUntil(dateStr: string | null) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

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

function TrustBadge({ level }: { level: string }) {
  const cfg: Record<string, { label: string; color: string }> = {
    verified:  { label: "✓ VERIFIED",  color: "#16a34a" },
    confirmed: { label: "◎ CONFIRMED", color: "#2563eb" },
    suggested: { label: "~ SUGGESTED", color: "#d97706" },
  };
  const c = cfg[level] ?? cfg.suggested;
  return <span style={{ fontSize: 9, fontWeight: 800, color: c.color, letterSpacing: "0.08em" }}>{c.label}</span>;
}

export default function PassportExport() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();

  const [property, setProperty] = useState<RenturaProperty | null>(null);
  const [events, setEvents] = useState<RenturaEvent[]>([]);
  const [tenants, setTenants] = useState<RenturaTenant[]>([]);
  const [mortgages, setMortgages] = useState<RenturaMortgage[]>([]);
  const [compliance, setCompliance] = useState<RenturaCompliance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push("/rentura/auth"); return; }
    async function load() {
      const [propRes, evtRes, tenRes, mortRes, compRes] = await Promise.all([
        supabase.from("rentura_properties").select("*").eq("id", id).eq("user_id", user!.id).single(),
        supabase.from("rentura_events").select("*").eq("property_id", id).order("event_date", { ascending: false }).limit(20),
        supabase.from("rentura_tenants").select("*").eq("property_id", id).order("move_in_date", { ascending: false }),
        supabase.from("rentura_mortgages").select("*").eq("property_id", id).order("created_at", { ascending: false }),
        supabase.from("rentura_compliance").select("*").eq("property_id", id).order("expiry_date", { ascending: true }),
      ]);
      if (!propRes.data) { router.push("/rentura/dashboard"); return; }
      setProperty(propRes.data);
      setEvents(evtRes.data ?? []);
      setTenants(tenRes.data ?? []);
      setMortgages(mortRes.data ?? []);
      setCompliance(compRes.data ?? []);
      setLoading(false);
    }
    load();
  }, [id, user, router]);

  if (loading || !property) {
    return (
      <div style={{ minHeight: "100vh", background: "#eceae2", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "rgba(17,17,17,0.5)", fontSize: 14 }}>Generating Passport…</p>
      </div>
    );
  }

  const currentTenant = tenants.find(t => t.is_current);
  const currentMortgage = mortgages.find(m => m.is_current);
  const annualRent = (currentTenant?.monthly_rent ?? 0) * 12;
  const annualYield = property.purchase_price && annualRent
    ? ((annualRent / property.purchase_price) * 100).toFixed(2)
    : null;
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  // Compliance score
  const certTypes = ["gas_safety", "eicr", "epc", "fire_alarm", "legionella"];
  const passedCerts = certTypes.filter(t => {
    const cert = compliance.find(c => c.certificate_type === t);
    if (!cert) return false;
    const days = daysUntil(cert.expiry_date);
    return days == null || days > 0;
  });
  const complianceScore = Math.round((passedCerts.length / certTypes.length) * 100);

  // Health score
  const hasCurrentTenant = !!currentTenant;
  let healthScore = 100;
  if (!hasCurrentTenant) healthScore -= 15;
  for (const cert of compliance) {
    const days = daysUntil(cert.expiry_date);
    if (days != null && days <= 0) healthScore -= 20;
    else if (days != null && days <= 14) healthScore -= 12;
    else if (days != null && days <= 45) healthScore -= 5;
  }
  if (currentMortgage?.fixed_term_expiry) {
    const days = daysUntil(currentMortgage.fixed_term_expiry);
    if (days != null && days <= 30) healthScore -= 20;
    else if (days != null && days <= 90) healthScore -= 10;
  }
  if (!property.purchase_price) healthScore -= 5;
  healthScore = Math.max(0, Math.min(100, healthScore));

  // Verified fields count
  const verifiedCount = compliance.filter(c => c.trust_level === "verified").length +
    mortgages.filter(m => m.trust_level === "verified").length;
  const totalFields = compliance.length + mortgages.length + (currentTenant ? 1 : 0) + (property.purchase_price ? 1 : 0);
  const completeness = totalFields > 0 ? Math.round((verifiedCount / totalFields) * 100) : 0;

  const INK = "#111111";
  const INK2 = "rgba(17,17,17,0.5)";
  const BORDER = "rgba(17,17,17,0.1)";
  const CTA = "#0f1728";

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; }
          .passport-page { padding: 0 !important; }
        }
        @page { margin: 20mm; size: A4; }
        * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      `}</style>

      {/* Print toolbar — hidden on print */}
      <div className="no-print" style={{ background: CTA, padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <Link href={`/rentura/properties/${id}`} style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>← Back to Passport</Link>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => window.print()}
            style={{ background: "white", color: CTA, fontWeight: 800, fontSize: 14, padding: "9px 22px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
            Save as PDF →
          </button>
        </div>
      </div>

      {/* Passport document */}
      <div className="passport-page" style={{ maxWidth: 860, margin: "0 auto", padding: "48px 40px 80px", fontFamily: "Georgia, serif", color: INK, background: "white", minHeight: "100vh" }}>

        {/* Header */}
        <div style={{ borderBottom: `2px solid ${INK}`, paddingBottom: 20, marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: INK2, marginBottom: 8, fontFamily: "system-ui, sans-serif" }}>
                Property Passport™ · Rentura
              </p>
              <h1 style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 6 }}>
                {property.address.split(",")[0]}
              </h1>
              <p style={{ fontSize: 14, color: INK2 }}>
                {property.address.split(",").slice(1).join(",").trim()}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 10, fontFamily: "system-ui, sans-serif", color: INK2, marginBottom: 4 }}>Generated</p>
              <p style={{ fontSize: 12, fontFamily: "system-ui, sans-serif", fontWeight: 600 }}>{today}</p>
              <div style={{ marginTop: 12, background: healthScore >= 80 ? "#dcfce7" : healthScore >= 60 ? "#fef3c7" : "#fee2e2", borderRadius: 8, padding: "8px 14px", textAlign: "center" }}>
                <p style={{ fontSize: 22, fontWeight: 700, color: healthScore >= 80 ? "#16a34a" : healthScore >= 60 ? "#d97706" : "#dc2626", fontFamily: "system-ui, sans-serif" }}>{healthScore}</p>
                <p style={{ fontSize: 9, color: INK2, fontFamily: "system-ui, sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>Health Score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Three-column identity block */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, marginBottom: 32, borderBottom: `1px solid ${BORDER}` }}>
          {[
            ["Type", property.property_type.replace(/\b\w/g, c => c.toUpperCase())],
            ["Bedrooms", property.bedrooms?.toString() ?? "—"],
            ["Purchase date", property.purchase_date ? fmtDate(property.purchase_date) : "—"],
            ["Purchase price", fmt(property.purchase_price)],
            ["Current value", property.current_value ? fmt(property.current_value) + " (est.)" : "—"],
            ["Annual yield", annualYield ? annualYield + "%" : "—"],
          ].map(([label, val], i) => (
            <div key={label} style={{ padding: "14px 0", borderTop: `1px solid ${BORDER}`, paddingRight: 16, paddingLeft: i % 3 === 0 ? 0 : 16, borderLeft: i % 3 !== 0 ? `1px solid ${BORDER}` : "none" }}>
              <p style={{ fontSize: 9, fontFamily: "system-ui, sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, marginBottom: 4 }}>{label}</p>
              <p style={{ fontSize: 14, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>{val}</p>
            </div>
          ))}
        </div>

        {/* Current tenancy */}
        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 13, fontFamily: "system-ui, sans-serif", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, marginBottom: 14 }}>Current Tenancy</h2>
          {currentTenant ? (
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: "16px 20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
                <div>
                  <p style={{ fontSize: 9, fontFamily: "system-ui, sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, marginBottom: 4 }}>Tenant</p>
                  <p style={{ fontSize: 13, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>{currentTenant.name}</p>
                </div>
                <div>
                  <p style={{ fontSize: 9, fontFamily: "system-ui, sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, marginBottom: 4 }}>Monthly rent</p>
                  <p style={{ fontSize: 13, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>{fmt(currentTenant.monthly_rent)}</p>
                </div>
                <div>
                  <p style={{ fontSize: 9, fontFamily: "system-ui, sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, marginBottom: 4 }}>Move-in date</p>
                  <p style={{ fontSize: 13, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>{fmtDate(currentTenant.move_in_date)}</p>
                </div>
                <div>
                  <p style={{ fontSize: 9, fontFamily: "system-ui, sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, marginBottom: 4 }}>Deposit</p>
                  <p style={{ fontSize: 13, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>{currentTenant.deposit_amount ? fmt(currentTenant.deposit_amount) : "—"}{currentTenant.deposit_scheme ? ` · ${currentTenant.deposit_scheme}` : ""}</p>
                </div>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: 13, color: INK2, fontFamily: "system-ui, sans-serif" }}>No current tenant recorded.</p>
          )}
        </section>

        {/* Mortgage */}
        {currentMortgage && (
          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 13, fontFamily: "system-ui, sans-serif", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, marginBottom: 14 }}>Mortgage</h2>
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: "16px 20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
                {[
                  ["Lender", currentMortgage.lender ?? "—"],
                  ["Product", currentMortgage.product_name ?? "—"],
                  ["Rate", currentMortgage.interest_rate ? currentMortgage.interest_rate + "%" : "—"],
                  ["Monthly payment", fmt(currentMortgage.monthly_payment)],
                  ["Remaining balance", fmt(currentMortgage.remaining_balance)],
                  ["Fixed term expiry", fmtDate(currentMortgage.fixed_term_expiry)],
                  ["SVR rate", currentMortgage.svr_rate ? currentMortgage.svr_rate + "%" : "—"],
                  ["Data source", ""],
                ].map(([label, val]) => (
                  <div key={label}>
                    <p style={{ fontSize: 9, fontFamily: "system-ui, sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, marginBottom: 4 }}>{label}</p>
                    {label === "Data source" ? <TrustBadge level={currentMortgage.trust_level} /> : <p style={{ fontSize: 13, fontWeight: 700, fontFamily: "system-ui, sans-serif" }}>{val}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Compliance */}
        <section style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h2 style={{ fontSize: 13, fontFamily: "system-ui, sans-serif", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2 }}>Compliance</h2>
            <p style={{ fontSize: 11, fontFamily: "system-ui, sans-serif", color: passedCerts.length === certTypes.length ? "#16a34a" : "#d97706", fontWeight: 700 }}>{passedCerts.length}/{certTypes.length} certificates valid</p>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {["Certificate", "Issue date", "Expiry date", "Status", "Source"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px 8px 0", fontSize: 9, fontFamily: "system-ui, sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {["gas_safety", "eicr", "epc", "fire_alarm", "legionella", "hmo_licence"].map(type => {
                const cert = compliance.find(c => c.certificate_type === type);
                const days = daysUntil(cert?.expiry_date ?? null);
                const status = !cert ? "Not recorded" : days == null ? "No expiry" : days <= 0 ? "EXPIRED" : days <= 14 ? `Expires in ${days}d` : days <= 45 ? `Due in ${days}d` : "Valid";
                const statusColor = !cert ? INK2 : days == null ? INK2 : days <= 0 ? "#dc2626" : days <= 45 ? "#d97706" : "#16a34a";
                return (
                  <tr key={type} style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <td style={{ padding: "10px 12px 10px 0", fontSize: 12, fontFamily: "system-ui, sans-serif", fontWeight: 600 }}>{CERT_LABELS[type]}</td>
                    <td style={{ padding: "10px 12px 10px 0", fontSize: 12, fontFamily: "system-ui, sans-serif", color: INK2 }}>{fmtDate(cert?.issue_date ?? null)}</td>
                    <td style={{ padding: "10px 12px 10px 0", fontSize: 12, fontFamily: "system-ui, sans-serif", color: INK2 }}>{fmtDate(cert?.expiry_date ?? null)}</td>
                    <td style={{ padding: "10px 12px 10px 0", fontSize: 12, fontFamily: "system-ui, sans-serif", fontWeight: 700, color: statusColor }}>{status}</td>
                    <td style={{ padding: "10px 12px 10px 0" }}>{cert ? <TrustBadge level={cert.trust_level} /> : <span style={{ fontSize: 9, color: INK2, fontFamily: "system-ui, sans-serif" }}>—</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* Timeline — last 10 events */}
        {events.length > 0 && (
          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 13, fontFamily: "system-ui, sans-serif", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, marginBottom: 14 }}>Recent History</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                  {["Date", "Event", "Amount", "Source"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 12px 8px 0", fontSize: 9, fontFamily: "system-ui, sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 10).map(evt => (
                  <tr key={evt.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <td style={{ padding: "9px 12px 9px 0", fontSize: 11, fontFamily: "system-ui, sans-serif", color: INK2, whiteSpace: "nowrap" }}>{fmtDate(evt.event_date)}</td>
                    <td style={{ padding: "9px 12px 9px 0", fontSize: 12, fontFamily: "system-ui, sans-serif" }}>{evt.title}</td>
                    <td style={{ padding: "9px 12px 9px 0", fontSize: 12, fontFamily: "system-ui, sans-serif", fontWeight: 600 }}>{evt.amount ? fmt(evt.amount) : "—"}</td>
                    <td style={{ padding: "9px 12px 9px 0" }}><TrustBadge level={evt.trust_level} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Footer */}
        <div style={{ borderTop: `2px solid ${INK}`, paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 10, fontFamily: "system-ui, sans-serif", fontWeight: 700, color: INK }}>Rentura · Property Passport™</p>
            <p style={{ fontSize: 9, fontFamily: "system-ui, sans-serif", color: INK2, marginTop: 2 }}>rentura.propertyvault.co.uk · Generated {today}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 9, fontFamily: "system-ui, sans-serif", color: INK2, lineHeight: 1.6 }}>
              Trust levels: ✓ VERIFIED (from official document) · ◎ CONFIRMED (landlord confirmed) · ~ SUGGESTED (AI estimate)<br />
              This document is for information only. Not legal or financial advice.
            </p>
          </div>
        </div>

        {/* Completeness watermark if low */}
        {completeness < 50 && (
          <div className="no-print" style={{ marginTop: 24, background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.2)", borderRadius: 8, padding: "12px 16px", fontSize: 12, color: "#d97706", fontFamily: "system-ui, sans-serif" }}>
            ◎ {completeness}% of fields are Verified. Upload documents to increase passport credibility before sharing.
          </div>
        )}
      </div>
    </>
  );
}
