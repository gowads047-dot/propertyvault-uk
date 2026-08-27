"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import type { RenturaProperty, RenturaTenant, RenturaMortgage, RenturaCompliance, RenturaEvent } from "@/lib/rentura/types";

function fmt(n: number | null | undefined, prefix = "£") {
  if (n == null) return "—";
  return prefix + n.toLocaleString("en-GB");
}

function fmtDate(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function daysUntil(d: string | null | undefined) {
  if (!d) return null;
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
}

function yieldPct(rent: number | null | undefined, price: number | null | undefined) {
  if (!rent || !price) return null;
  return ((rent * 12 / price) * 100).toFixed(2);
}

const CERT_LABELS: Record<string, string> = {
  gas_safety: "Gas Safety Certificate",
  epc: "EPC",
  eicr: "EICR (Electrical)",
  pat_test: "PAT Test",
  fire_alarm: "Fire Alarm Inspection",
  legionella: "Legionella Risk Assessment",
  hmo_licence: "HMO Licence",
  other: "Other Certificate",
};

const EVENT_ICONS: Record<string, string> = {
  payment: "£", rent_payment: "£", bulk_payment: "£",
  maintenance_logged: "⚒", maintenance_resolved: "✓", maintenance_cost: "⚒",
  tenant_in: "→", tenant_out: "←",
  compliance: "✓", mortgage: "🏦", rent_review: "↑",
  arrears: "!", note: "●", property_created: "⌂", new_property: "⌂",
};

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, paddingBottom: 10, borderBottom: "2px solid #0f1728" }}>
        <span>{icon}</span>
        <h3 style={{ fontSize: 11, fontWeight: 800, color: "#0f1728", textTransform: "uppercase", letterSpacing: "0.08em" }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Row({ label, value, highlight, mono }: { label: string; value: string; highlight?: boolean; mono?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "7px 0", borderBottom: "1px solid #f3f4f6", gap: 16 }}>
      <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 500, flexShrink: 0 }}>{label}</p>
      <p style={{ fontSize: 13, fontWeight: highlight ? 800 : 600, color: highlight ? "#0f1728" : "#1a1a1a", textAlign: "right", fontFamily: mono ? "monospace" : "inherit" }}>{value}</p>
    </div>
  );
}

export default function PassportPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [property, setProperty] = useState<RenturaProperty | null>(null);
  const [tenants, setTenants] = useState<RenturaTenant[]>([]);
  const [mortgages, setMortgages] = useState<RenturaMortgage[]>([]);
  const [compliance, setCompliance] = useState<RenturaCompliance[]>([]);
  const [events, setEvents] = useState<RenturaEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/rentura/auth"); return; }
    Promise.all([
      supabase.from("rentura_properties").select("*").eq("id", id).eq("user_id", user.id).single(),
      supabase.from("rentura_tenants").select("*").eq("property_id", id).order("move_in_date", { ascending: false }),
      supabase.from("rentura_mortgages").select("*").eq("property_id", id).eq("is_current", true).limit(1),
      supabase.from("rentura_compliance").select("*").eq("property_id", id).order("expiry_date", { ascending: true }),
      supabase.from("rentura_events").select("*").eq("property_id", id).order("event_date", { ascending: false }).limit(20),
    ]).then(([p, t, m, c, e]) => {
      if (!p.data) { router.push("/rentura/dashboard"); return; }
      setProperty(p.data);
      setTenants(t.data ?? []);
      setMortgages(m.data ?? []);
      setCompliance(c.data ?? []);
      setEvents(e.data ?? []);
      setLoading(false);
    });
  }, [id, user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
        <style>{`body > header, body > footer { display: none !important; }`}</style>
        <p style={{ color: "#999", fontSize: 14 }}>Preparing passport…</p>
      </div>
    );
  }

  if (!property) return null;

  const currentTenant = tenants.find(t => t.is_current);
  const mortgage = mortgages[0] ?? null;
  const grossYield = yieldPct(currentTenant?.monthly_rent, property.purchase_price);
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const certMap: Record<string, RenturaCompliance> = {};
  for (const c of compliance) certMap[c.certificate_type] = c;

  const CORE_CERTS = ["gas_safety", "epc", "eicr", "pat_test", "fire_alarm", "legionella"];
  if (property.property_type === "hmo") CORE_CERTS.push("hmo_licence");

  function certStatus(cert: RenturaCompliance | undefined): { label: string; color: string } {
    if (!cert) return { label: "Not recorded", color: "#9ca3af" };
    const d = daysUntil(cert.expiry_date);
    if (d == null) return { label: "Recorded (no expiry)", color: "#6b7280" };
    if (d <= 0) return { label: `EXPIRED — ${fmtDate(cert.expiry_date)}`, color: "#b91c1c" };
    if (d <= 30) return { label: `Expires ${fmtDate(cert.expiry_date)} (${d}d)`, color: "#b91c1c" };
    if (d <= 90) return { label: `Expires ${fmtDate(cert.expiry_date)} (${d}d)`, color: "#d97706" };
    return { label: `Valid — ${fmtDate(cert.expiry_date)}`, color: "#15803d" };
  }

  const s21Checks = [
    { label: "Gas Safety cert valid", pass: !!certMap.gas_safety && (daysUntil(certMap.gas_safety.expiry_date) ?? 1) > 0 },
    { label: "EPC min E (served to tenant)", pass: !!certMap.epc && (daysUntil(certMap.epc.expiry_date) ?? 1) > 0 },
    { label: "EICR valid", pass: !!certMap.eicr && (daysUntil(certMap.eicr.expiry_date) ?? 1) > 0 },
    { label: "Deposit protected", pass: !!(currentTenant?.deposit_scheme) },
    { label: "Deposit PI served", pass: false, unknown: true },
    { label: "How to Rent guide served", pass: false, unknown: true },
  ];

  const NAVY = "#0f1728";
  const GOLD = "#b8962e";
  const INK = "#1a1a1a";
  const INK2 = "#6b7280";
  const BORDER = "#e5e7eb";
  const BG2 = "#f9f9f7";

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body > header, body > footer { display: none !important; }
        body { font-family: -apple-system, 'Segoe UI', sans-serif; background: #f0efe9; color: ${INK}; }
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .passport-doc { box-shadow: none !important; margin: 0 !important; border-radius: 0 !important; max-width: 100% !important; }
        }
      `}</style>

      {/* Screen nav — hidden on print */}
      <div className="no-print" style={{ background: NAVY, padding: "11px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 20 }}>
        <Link href={`/rentura/properties/${id}`} style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, textDecoration: "none", fontWeight: 500 }}>
          ← Back to property
        </Link>
        <button onClick={() => window.print()}
          style={{ background: GOLD, color: "white", border: "none", borderRadius: 8, padding: "9px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: "0.01em" }}>
          Print / Save as PDF
        </button>
      </div>

      {/* Passport document */}
      <div style={{ padding: "28px 20px 60px", maxWidth: 920, margin: "0 auto" }}>
        <div className="passport-doc" style={{ background: "white", borderRadius: 16, boxShadow: "0 4px 30px rgba(0,0,0,0.1)", overflow: "hidden" }}>

          {/* Header band */}
          <div style={{ background: NAVY, padding: "28px 40px 32px", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                  <div style={{ width: 28, height: 28, background: GOLD, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: NAVY, flexShrink: 0 }}>R</div>
                  <span style={{ color: GOLD, fontWeight: 800, fontSize: 13, letterSpacing: "0.06em" }}>RENTURA</span>
                  <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>· PropertyVault UK</span>
                </div>
                <h1 style={{ color: "white", fontSize: 28, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 6 }}>
                  {property.address.split(",")[0]}
                </h1>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, letterSpacing: "0.01em" }}>
                  {property.address.split(",").slice(1).join(",").trim()}
                </p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 24 }}>
                <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "14px 20px" }}>
                  <p style={{ color: GOLD, fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>Property Passport</p>
                  <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, marginBottom: 2 }}>{today}</p>
                  <p style={{ color: "rgba(255,255,255,0.58)", fontSize: 11 }}>
                    {(property.property_type ?? "Property").toUpperCase()} · {property.bedrooms ?? "?"}BED
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: `2px solid ${BORDER}` }}>
            {[
              { label: "Purchase Price", value: fmt(property.purchase_price) },
              { label: "Monthly Rent", value: currentTenant?.monthly_rent ? fmt(currentTenant.monthly_rent) : "Vacant" },
              { label: "Gross Yield", value: grossYield ? `${grossYield}%` : "—" },
              { label: "Mortgage Rate", value: mortgage?.interest_rate ? `${mortgage.interest_rate}%` : (mortgage ? "0%" : "Cash") },
            ].map((stat, i) => (
              <div key={i} style={{ padding: "18px 24px", borderRight: i < 3 ? `1px solid ${BORDER}` : "none" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: INK2, textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 6 }}>{stat.label}</p>
                <p style={{ fontSize: 22, fontWeight: 900, color: NAVY, letterSpacing: "-0.02em" }}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div style={{ padding: "32px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36 }}>

            <Section title="Property Details" icon="⌂">
              <Row label="Full Address" value={property.address} />
              <Row label="Property Type" value={property.property_type ? property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1) : "—"} />
              <Row label="Bedrooms" value={property.bedrooms != null ? `${property.bedrooms} bedroom${property.bedrooms !== 1 ? "s" : ""}` : "—"} />
              <Row label="Purchase Price" value={fmt(property.purchase_price)} highlight />
              <Row label="Purchase Date" value={fmtDate(property.purchase_date)} />
              <Row label="Current Value" value={fmt(property.current_value)} />
              {property.purchase_price && property.current_value && property.current_value !== property.purchase_price && (
                <Row
                  label="Capital Growth"
                  value={`${property.current_value > property.purchase_price ? "+" : ""}${fmt(property.current_value - property.purchase_price)} (${((property.current_value - property.purchase_price) / property.purchase_price * 100).toFixed(1)}%)`}
                  highlight
                />
              )}
            </Section>

            <Section title="Current Tenancy" icon="👤">
              {currentTenant ? (
                <>
                  <Row label="Tenant Name" value={(currentTenant.name ?? `${currentTenant.first_name ?? ""} ${currentTenant.last_name ?? ""}`.trim()) || "—"} highlight />
                  <Row label="Monthly Rent" value={fmt(currentTenant.monthly_rent)} />
                  <Row label="Annual Rent" value={currentTenant.monthly_rent ? fmt(currentTenant.monthly_rent * 12) : "—"} />
                  <Row label="Move-in Date" value={fmtDate(currentTenant.move_in_date ?? currentTenant.tenancy_start)} />
                  <Row label="Deposit Amount" value={fmt(currentTenant.deposit_amount)} />
                  <Row label="Deposit Scheme" value={currentTenant.deposit_scheme ?? "— Not recorded"} />
                  {currentTenant.email && <Row label="Email" value={currentTenant.email} />}
                  {currentTenant.phone && <Row label="Phone" value={currentTenant.phone} />}
                </>
              ) : (
                <div style={{ padding: "24px 0", textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>⚠</div>
                  <p style={{ color: "#d97706", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Currently Vacant</p>
                  <p style={{ color: INK2, fontSize: 12 }}>No active tenant on record</p>
                </div>
              )}
            </Section>

            <Section title="Mortgage Details" icon="🏦">
              {mortgage ? (
                <>
                  <Row label="Lender" value={mortgage.lender ?? "—"} highlight />
                  <Row label="Product Name" value={mortgage.product_name ?? "—"} />
                  <Row label="Interest Rate" value={mortgage.interest_rate ? `${mortgage.interest_rate}% p.a.` : "—"} />
                  <Row label="Monthly Payment" value={fmt(mortgage.monthly_payment)} />
                  <Row label="Remaining Balance" value={fmt(mortgage.remaining_balance)} />
                  <Row label="Fixed Term Expiry" value={fmtDate(mortgage.fixed_term_expiry)} />
                  {mortgage.svr_rate && <Row label="SVR (revert rate)" value={`${mortgage.svr_rate}%`} />}
                  {mortgage.fixed_term_expiry && (() => {
                    const d = daysUntil(mortgage.fixed_term_expiry);
                    if (!d) return null;
                    const color = d <= 0 ? "#dc2626" : d <= 90 ? "#d97706" : "#15803d";
                    return (
                      <div style={{ marginTop: 10, padding: "9px 12px", background: color + "12", borderRadius: 8, borderLeft: `3px solid ${color}` }}>
                        <p style={{ fontSize: 12, color, fontWeight: 700 }}>
                          {d <= 0 ? "Fixed term expired — likely on SVR" : `${d} days until fixed term ends — start remortgage process`}
                        </p>
                      </div>
                    );
                  })()}
                </>
              ) : (
                <div style={{ padding: "20px 0" }}>
                  <p style={{ color: INK2, fontSize: 13 }}>No mortgage recorded — cash purchase or details not yet added.</p>
                </div>
              )}
            </Section>

            <Section title="Compliance Status" icon="✓">
              <div>
                {CORE_CERTS.map(type => {
                  const cert = certMap[type];
                  const status = certStatus(cert);
                  return (
                    <div key={type} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${BORDER}` }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: INK }}>{CERT_LABELS[type] ?? type}</p>
                      <p style={{ fontSize: 11, fontWeight: 700, color: status.color, textAlign: "right", marginLeft: 8 }}>{status.label}</p>
                    </div>
                  );
                })}
              </div>
              {(() => {
                const expired = CORE_CERTS.filter(t => {
                  const c = certMap[t];
                  if (!c) return true;
                  const d = daysUntil(c.expiry_date);
                  return d != null && d <= 0;
                });
                const color = expired.length === 0 ? "#15803d" : "#dc2626";
                return (
                  <div style={{ marginTop: 12, padding: "8px 12px", background: color + "10", borderRadius: 8, borderLeft: `3px solid ${color}` }}>
                    <p style={{ fontSize: 12, color, fontWeight: 700 }}>
                      {expired.length === 0 ? "All compliance certificates recorded and valid ✓" : `${expired.length} certificate${expired.length > 1 ? "s" : ""} expired or not on record`}
                    </p>
                  </div>
                );
              })()}
            </Section>
          </div>

          {/* Section 21 readiness */}
          <div style={{ padding: "0 40px 32px" }}>
            <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "22px 28px" }}>
              <h3 style={{ fontSize: 11, fontWeight: 800, color: NAVY, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                📋 Section 21 Readiness Check
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {s21Checks.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 12px", background: "white", borderRadius: 8, border: `1px solid ${item.unknown ? BORDER : item.pass ? "#15803d30" : "#dc262630"}` }}>
                    <span style={{ fontSize: 14, flexShrink: 0, color: item.unknown ? "#9ca3af" : item.pass ? "#15803d" : "#dc2626", fontWeight: 900 }}>
                      {item.unknown ? "?" : item.pass ? "✓" : "✗"}
                    </span>
                    <p style={{ fontSize: 11, color: item.unknown ? "#9ca3af" : item.pass ? "#15803d" : "#dc2626", fontWeight: 600, lineHeight: 1.4 }}>
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 10, color: INK2, marginTop: 14, lineHeight: 1.6 }}>
                Note: Section 21 (no-fault eviction) is abolished under the Renters' Rights Act 2025 — now in force. &quot;?&quot; items cannot be auto-verified — confirm manually.
              </p>
            </div>
          </div>

          {/* Recent activity */}
          {events.length > 0 && (
            <div style={{ padding: "0 40px 36px" }}>
              <h3 style={{ fontSize: 11, fontWeight: 800, color: NAVY, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
                📅 Recent Activity
              </h3>
              <div style={{ border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
                {events.slice(0, 10).map((e, i) => (
                  <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "11px 18px", borderBottom: i < Math.min(events.length, 10) - 1 ? `1px solid ${BORDER}` : "none", background: i % 2 === 0 ? "white" : BG2 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: INK2, flexShrink: 0 }}>
                      {EVENT_ICONS[e.event_type] ?? "●"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: INK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.title}</p>
                      <p style={{ fontSize: 11, color: INK2 }}>{fmtDate(e.event_date)}</p>
                    </div>
                    {e.amount != null && (
                      <p style={{ fontSize: 14, fontWeight: 800, color: ["payment","rent_payment","bulk_payment"].includes(e.event_type) ? "#15803d" : "#dc2626", flexShrink: 0 }}>
                        {["payment","rent_payment","bulk_payment"].includes(e.event_type) ? "+" : "−"}{fmt(e.amount)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Passport footer */}
          <div style={{ background: NAVY, padding: "18px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ color: GOLD, fontSize: 11, fontWeight: 700 }}>Rentura · PropertyVault UK</p>
              <p style={{ color: "rgba(255,255,255,0.58)", fontSize: 10, marginTop: 2 }}>Generated {today} · propertyvaultuk.co.uk/rentura</p>
            </div>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 10 }}>Confidential — not for public distribution</p>
          </div>

        </div>
      </div>
    </>
  );
}
