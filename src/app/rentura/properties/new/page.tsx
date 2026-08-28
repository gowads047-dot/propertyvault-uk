"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { RenturaSidebar } from "@/components/rentura/RenturaSidebar";

const PROPERTY_TYPES = [
  { value: "house", label: "House", icon: "🏠" },
  { value: "flat", label: "Flat / Apartment", icon: "🏢" },
  { value: "hmo", label: "HMO", icon: "🏘" },
  { value: "commercial", label: "Commercial", icon: "🏬" },
  { value: "other", label: "Other", icon: "🏗" },
];

export default function NewProperty() {
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    address: "",
    nickname: "",
    property_type: "house",
    bedrooms: "",
    purchase_date: "",
    purchase_price: "",
    current_value: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return router.push("/rentura/auth?next=/rentura/properties/new");
    if (!form.address.trim()) { setError("Address is required."); return; }

    setSaving(true);
    setError(null);

    const { data, error: err } = await supabase.from("rentura_properties").insert({
      user_id: user.id,
      address: form.address.trim(),
      nickname: form.nickname.trim() || null,
      property_type: form.property_type,
      bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
      purchase_date: form.purchase_date || null,
      purchase_price: form.purchase_price ? parseFloat(form.purchase_price.replace(/,/g, "")) : null,
      current_value: form.current_value ? parseFloat(form.current_value.replace(/,/g, "")) : null,
    }).select().single();

    if (err) { setError(err.message); setSaving(false); return; }

    // Log the creation event
    if (data?.id) {
      await supabase.from("rentura_events").insert({
        property_id: data.id,
        user_id: user.id,
        event_type: "property_created",
        title: "Property Passport created",
        description: `${form.address} added to portfolio.`,
        trust_level: "confirmed",
        metadata: { initial_setup: true },
        event_date: new Date().toISOString().split("T")[0],
      });
    }

    router.push(data?.id ? `/rentura/properties/${data.id}` : "/rentura/dashboard");
  }

  const BG = "#eceae2";
  const INK = "#111111";
  const INK2 = "rgba(17,17,17,0.72)";
  const BORDER = "rgba(17,17,17,0.1)";
  const CTA = "#0f1728";

  const inputStyle = {
    width: "100%", boxSizing: "border-box" as const,
    padding: "12px 16px", fontSize: 15, color: INK,
    border: `1px solid ${BORDER}`, borderRadius: 10, outline: "none",
    background: "white", fontFamily: "inherit",
    transition: "border-color 0.15s",
  };

  const labelStyle = {
    display: "block", fontSize: 12, fontWeight: 700,
    color: "rgba(17,17,17,0.45)", textTransform: "uppercase" as const,
    letterSpacing: "0.08em", marginBottom: 8,
  };

  return (
    <div style={{ fontFamily: "var(--font-family-body)", background: BG, color: INK, minHeight: "100vh", display: "flex" }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>
      <RenturaSidebar />

      <div style={{ flex: 1, overflowY: "auto" }}>
      {/* Nav */}
      <nav style={{ borderBottom: `1px solid ${BORDER}`, padding: "12px 28px", display: "flex", alignItems: "center", gap: 8, fontSize: 13, background: BG }}>
        <Link href="/rentura/properties" style={{ color: INK2, textDecoration: "none", fontWeight: 500 }}>Properties</Link>
        <span style={{ color: INK2 }}>›</span>
        <span style={{ color: INK, fontWeight: 700 }}>Add Property</span>
      </nav>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px 80px" }}>
        {/* Heading */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: "clamp(30px,5vw,48px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, fontFamily: "var(--font-family-heading)", marginBottom: 10 }}>
            Create a Property Passport.
          </h1>
          <p style={{ fontSize: 15, color: INK2, lineHeight: 1.6 }}>
            Start with the basics. You can add tenants, mortgage details, and compliance records from the property page once created.
          </p>
        </div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 28 }}>

          {/* Address */}
          <div>
            <label style={labelStyle}>Full address *</label>
            <input
              type="text"
              value={form.address}
              onChange={e => set("address", e.target.value)}
              placeholder="e.g. 47 Oak Street, Manchester, M1 2AB"
              required
              style={inputStyle}
            />
          </div>

          {/* Nickname */}
          <div>
            <label style={labelStyle}>Nickname <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional — e.g. "The Manchester Flat")</span></label>
            <input
              type="text"
              value={form.nickname}
              onChange={e => set("nickname", e.target.value)}
              placeholder="Your shorthand name for this property"
              style={inputStyle}
            />
          </div>

          {/* Property type */}
          <div>
            <label style={labelStyle}>Property type</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {PROPERTY_TYPES.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => set("property_type", t.value)}
                  style={{
                    padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6,
                    background: form.property_type === t.value ? CTA : "white",
                    color: form.property_type === t.value ? "white" : INK2,
                    border: `1px solid ${form.property_type === t.value ? CTA : BORDER}`,
                    transition: "all 0.15s",
                  }}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <label style={labelStyle}>Bedrooms</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["1", "2", "3", "4", "5", "6+"].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => set("bedrooms", n === "6+" ? "6" : n)}
                  style={{
                    width: 48, height: 48, borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                    background: form.bedrooms === (n === "6+" ? "6" : n) ? CTA : "white",
                    color: form.bedrooms === (n === "6+" ? "6" : n) ? "white" : INK2,
                    border: `1px solid ${form.bedrooms === (n === "6+" ? "6" : n) ? CTA : BORDER}`,
                    transition: "all 0.15s",
                  }}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Purchase */}
          <div style={{ background: "white", borderRadius: 14, padding: 22, border: `1px solid ${BORDER}` }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(17,17,17,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Purchase details</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 16 }}>
              <div>
                <label style={labelStyle}>Purchase date</label>
                <input type="date" value={form.purchase_date} onChange={e => set("purchase_date", e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Purchase price (£)</label>
                <input type="text" value={form.purchase_price} onChange={e => set("purchase_price", e.target.value)} placeholder="250,000" style={inputStyle} />
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={labelStyle}>Estimated current value (£)</label>
              <input type="text" value={form.current_value} onChange={e => set("current_value", e.target.value)} placeholder="280,000" style={inputStyle} />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 10, padding: "12px 16px", color: "#b91c1c", fontSize: 13, fontWeight: 600 }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={saving || !form.address.trim()}
            style={{ background: CTA, color: "white", fontWeight: 800, fontSize: 16, padding: "16px 0", borderRadius: 12, border: "none", cursor: "pointer", fontFamily: "inherit", letterSpacing: "-0.02em", opacity: (saving || !form.address.trim()) ? 0.5 : 1, transition: "opacity 0.15s" }}>
            {saving ? "Creating Passport…" : "Create Property Passport →"}
          </button>

          <p style={{ fontSize: 12, color: INK2, textAlign: "center" }}>
            You can add tenants, mortgage details, and compliance certificates after creating the passport.
          </p>
        </form>
      </div>
      </div>
    </div>
  );
}
