"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { RenturaSidebar } from "@/components/rentura/RenturaSidebar";

const C = {
  bg: "#0c0f1a", card: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.07)",
  ink: "rgba(255,255,255,0.85)", ink2: "rgba(255,255,255,0.45)", ink3: "rgba(255,255,255,0.22)",
  gold: "#c9a84c", green: "#22c55e", red: "#ef4444", amber: "#f59e0b",
};

type Property = {
  id: string;
  address: string;
  city: string;
  postcode: string | null;
  property_type: string | null;
  bedrooms: number | null;
  purchase_price: number | null;
  current_value: number | null;
  monthly_rent: number | null;
  status: string | null;
  created_at: string;
};

export default function RenturaPropertiesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/rentura/auth");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("rentura_properties")
      .select("id, address, city, postcode, property_type, bedrooms, purchase_price, current_value, monthly_rent, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProperties((data || []) as Property[]);
        setDataLoading(false);
      });
  }, [user]);

  const filtered = properties.filter(p =>
    !search ||
    p.address.toLowerCase().includes(search.toLowerCase()) ||
    p.city.toLowerCase().includes(search.toLowerCase()) ||
    (p.postcode || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalRent = properties.reduce((s, p) => s + (p.monthly_rent || 0), 0);
  const totalValue = properties.reduce((s, p) => s + (p.current_value || p.purchase_price || 0), 0);

  if (loading || dataLoading) return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>
      <RenturaSidebar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: C.ink3 }}>Loading…</p>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "var(--font-family-body)", color: C.ink }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>
      <RenturaSidebar />

      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "36px 28px" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 4 }}>Properties</h1>
              <p style={{ fontSize: 13, color: C.ink2 }}>{properties.length} {properties.length === 1 ? "property" : "properties"} in your portfolio</p>
            </div>
            <Link href="/rentura/properties/new" style={{ background: C.gold, color: "#0f1b36", fontWeight: 800, fontSize: 13, padding: "10px 20px", borderRadius: 10, textDecoration: "none" }}>
              + Add property
            </Link>
          </div>

          {/* Stats */}
          {properties.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
              {[
                { label: "Properties", value: properties.length.toString(), color: C.ink },
                { label: "Monthly rent", value: `£${totalRent.toLocaleString()}`, color: C.gold },
                { label: "Portfolio value", value: totalValue ? `£${totalValue.toLocaleString()}` : "—", color: C.green },
              ].map(s => (
                <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 20px" }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: C.ink3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{s.label}</p>
                  <p style={{ fontSize: 22, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Search */}
          {properties.length > 0 && (
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by address, city or postcode…"
              style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: C.ink, outline: "none", marginBottom: 16, boxSizing: "border-box" }}
            />
          )}

          {/* Property cards */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 24px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 16 }}>
              <p style={{ fontSize: 32, marginBottom: 12 }}>🏠</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: C.ink, marginBottom: 8 }}>
                {properties.length === 0 ? "No properties yet" : "No results"}
              </p>
              <p style={{ fontSize: 13, color: C.ink2, marginBottom: 24 }}>
                {properties.length === 0 ? "Add your first property to start tracking your portfolio." : "Try a different search term."}
              </p>
              {properties.length === 0 && (
                <Link href="/rentura/properties/new" style={{ background: C.gold, color: "#0f1b36", fontWeight: 800, fontSize: 13, padding: "11px 24px", borderRadius: 10, textDecoration: "none" }}>
                  Add first property →
                </Link>
              )}
            </div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {filtered.map(p => (
                <Link key={p.id} href={`/rentura/properties/${p.id}`} style={{ textDecoration: "none" }}>
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "border-color 0.15s", cursor: "pointer" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
                      <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(201,168,76,0.08)", border: `1px solid rgba(201,168,76,0.15)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>
                        🏠
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.address}</p>
                        <p style={{ fontSize: 12, color: C.ink2 }}>{p.city}{p.postcode ? `, ${p.postcode}` : ""}{p.property_type ? ` · ${p.property_type}` : ""}{p.bedrooms ? ` · ${p.bedrooms} bed` : ""}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 24, flexShrink: 0 }}>
                      {p.monthly_rent && (
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontSize: 14, fontWeight: 700, color: C.gold }}>£{p.monthly_rent.toLocaleString()}</p>
                          <p style={{ fontSize: 10, color: C.ink3 }}>per month</p>
                        </div>
                      )}
                      {p.current_value && (
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>£{p.current_value.toLocaleString()}</p>
                          <p style={{ fontSize: 10, color: C.ink3 }}>value</p>
                        </div>
                      )}
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                        color: p.status === "active" ? C.green : C.ink3,
                        background: p.status === "active" ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.05)",
                      }}>
                        {p.status || "active"}
                      </span>
                      <span style={{ color: C.ink3, fontSize: 16 }}>›</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
