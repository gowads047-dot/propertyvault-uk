"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL = "gowads047@gmail.com";

type Tab = "listings" | "enquiries" | "verifications";

type Listing = {
  id: string; title: string; city: string; property_type: string;
  price: number; status: string; created_at: string;
  verified: boolean; listing_type: string; user_id: string;
  view_count: number | null;
};

type Enquiry = {
  id: string; message: string; created_at: string; read: boolean;
  listing: { title: string } | null;
};

export default function MakanAdmin() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("listings");
  const [listings, setListings] = useState<Listing[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dataLoading, setDataLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, verified: 0, enquiries: 0 });

  useEffect(() => {
    if (!loading && !user) router.push("/makan/auth");
    if (!loading && user && user.email !== ADMIN_EMAIL) router.push("/makan");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL) return;
    Promise.all([
      supabase.from("listings").select("*").order("created_at", { ascending: false }),
      supabase.from("enquiries").select("id, message, created_at, read, listing:listings(title)").order("created_at", { ascending: false }).limit(200),
    ]).then(([{ data: l }, { data: e }]) => {
      const ls = (l || []) as Listing[];
      setListings(ls);
      const enqs: Enquiry[] = (e || []).map((x: any) => ({
        ...x,
        listing: Array.isArray(x.listing) ? x.listing[0] ?? null : x.listing ?? null,
      }));
      setEnquiries(enqs);
      setStats({
        total: ls.length,
        active: ls.filter(x => x.status === "active").length,
        verified: ls.filter(x => x.verified).length,
        enquiries: enqs.filter(x => !x.read).length,
      });
      setDataLoading(false);
    });
  }, [user]);

  async function toggleStatus(id: string, current: string) {
    const next = current === "active" ? "inactive" : "active";
    await supabase.from("listings").update({ status: next }).eq("id", id);
    setListings(ls => ls.map(l => l.id === id ? { ...l, status: next } : l));
  }

  async function toggleVerified(id: string, current: boolean) {
    await supabase.from("listings").update({ verified: !current, verified_at: !current ? new Date().toISOString() : null }).eq("id", id);
    setListings(ls => ls.map(l => l.id === id ? { ...l, verified: !current } : l));
    setStats(s => ({ ...s, verified: s.verified + (!current ? 1 : -1) }));
  }

  async function deleteListing(id: string) {
    if (!confirm("Delete this listing permanently?")) return;
    await supabase.from("listings").delete().eq("id", id);
    setListings(ls => ls.filter(l => l.id !== id));
  }

  const filtered = listings.filter(l => {
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (search && !l.title.toLowerCase().includes(search.toLowerCase()) && !l.city.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading || dataLoading) return (
    <div style={{ minHeight: "100vh", background: "var(--h-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "var(--h-muted)" }}>Loading…</p>
    </div>
  );
  if (!user || user.email !== ADMIN_EMAIL) return null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--h-bg)", fontFamily: "var(--font-family-body)", color: "var(--h-text)" }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>

      <header style={{ borderBottom: "1px solid var(--h-border)", padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link href="/makan" style={{ fontSize: 16, fontWeight: 800, color: "var(--h-accent)", textDecoration: "none" }}>Makan</Link>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#ef4444", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 20, padding: "2px 10px" }}>Admin</span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <Link href="/makan/dashboard" style={{ fontSize: 12, color: "var(--h-muted)", textDecoration: "none" }}>← Dashboard</Link>
          <Link href="/academy/admin" style={{ fontSize: 12, color: "var(--h-muted)", textDecoration: "none" }}>Academy admin</Link>
          <Link href="/rentura/admin" style={{ fontSize: 12, color: "var(--h-muted)", textDecoration: "none" }}>Rentura admin</Link>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 28 }}>
          {[
            { label: "Total listings", value: stats.total, color: "var(--h-text)" },
            { label: "Active", value: stats.active, color: "#22c55e" },
            { label: "Verified", value: stats.verified, color: "var(--h-accent)" },
            { label: "Unread enquiries", value: stats.enquiries, color: "#f59e0b" },
          ].map(s => (
            <div key={s.label} style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)", borderRadius: 12, padding: "16px 18px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "var(--h-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{s.label}</p>
              <p style={{ fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--h-border)", marginBottom: 20 }}>
          {(["listings", "enquiries"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: "8px 16px", fontSize: 13, fontWeight: tab === t ? 700 : 500, color: tab === t ? "var(--h-accent)" : "var(--h-muted)", borderBottom: tab === t ? "2px solid var(--h-accent)" : "2px solid transparent", textTransform: "capitalize" }}>{t}</button>
          ))}
        </div>

        {tab === "listings" && (
          <>
            {/* Filters */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title or city…"
                style={{ flex: 1, minWidth: 200, background: "var(--h-surface)", border: "1px solid var(--h-border)", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "var(--h-text)", outline: "none" }} />
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "var(--h-text)" }}>
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button onClick={() => {
                const csv = ["id,title,city,type,price,status,verified,views,created"].concat(
                  listings.map(l => `${l.id},"${l.title}",${l.city},${l.property_type},${l.price},${l.status},${l.verified},${l.view_count || 0},${l.created_at.slice(0,10)}`)
                ).join("\n");
                const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "makan-listings.csv"; a.click();
              }} style={{ background: "var(--h-accent)", color: "white", fontWeight: 700, fontSize: 12, padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer" }}>
                Export CSV
              </button>
            </div>

            <div style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)", borderRadius: 14, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--h-border)" }}>
                    {["Title","City","Type","Price","Status","Verified","Views","Actions"].map(h => (
                      <th key={h} style={{ padding: "10px 14px", fontSize: 11, fontWeight: 700, color: "var(--h-muted)", textTransform: "uppercase", letterSpacing: "0.07em", textAlign: "left" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(l => (
                    <tr key={l.id} style={{ borderBottom: "1px solid var(--h-border)" }}>
                      <td style={{ padding: "10px 14px" }}>
                        <Link href={`/makan/listing/${l.id}`} style={{ fontSize: 13, color: "var(--h-text)", textDecoration: "none", fontWeight: 600 }}>{l.title}</Link>
                      </td>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: "var(--h-muted)" }}>{l.city}</td>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: "var(--h-muted)" }}>{l.property_type}</td>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: "var(--h-text)", fontWeight: 600 }}>£{l.price.toLocaleString()}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <button onClick={() => toggleStatus(l.id, l.status)} style={{ fontSize: 11, fontWeight: 700, color: l.status === "active" ? "#22c55e" : "var(--h-muted)", background: l.status === "active" ? "rgba(34,197,94,0.1)" : "rgba(0,0,0,0.05)", border: "none", borderRadius: 10, padding: "2px 10px", cursor: "pointer" }}>
                          {l.status}
                        </button>
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        <button onClick={() => toggleVerified(l.id, l.verified)} style={{ fontSize: 11, fontWeight: 700, color: l.verified ? "var(--h-accent)" : "var(--h-muted)", background: l.verified ? "rgba(201,168,76,0.1)" : "rgba(0,0,0,0.05)", border: "none", borderRadius: 10, padding: "2px 10px", cursor: "pointer" }}>
                          {l.verified ? "✓ Verified" : "Unverified"}
                        </button>
                      </td>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: "var(--h-muted)" }}>{l.view_count || 0}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <button onClick={() => deleteListing(l.id)} style={{ fontSize: 11, color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "none", borderRadius: 7, padding: "4px 10px", cursor: "pointer" }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <p style={{ padding: "24px", textAlign: "center", color: "var(--h-muted)", fontSize: 13 }}>No listings found.</p>
              )}
            </div>
          </>
        )}

        {tab === "enquiries" && (
          <div style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)", borderRadius: 14, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--h-border)" }}>
                  {["Listing","Message","Date","Read"].map(h => (
                    <th key={h} style={{ padding: "10px 14px", fontSize: 11, fontWeight: 700, color: "var(--h-muted)", textTransform: "uppercase", letterSpacing: "0.07em", textAlign: "left" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {enquiries.map(e => (
                  <tr key={e.id} style={{ borderBottom: "1px solid var(--h-border)" }}>
                    <td style={{ padding: "10px 14px", fontSize: 12, color: "var(--h-text)", fontWeight: 600, maxWidth: 160 }}>{e.listing?.title || "—"}</td>
                    <td style={{ padding: "10px 14px", fontSize: 12, color: "var(--h-muted)", maxWidth: 360 }}>{e.message}</td>
                    <td style={{ padding: "10px 14px", fontSize: 11, color: "var(--h-muted)", whiteSpace: "nowrap" }}>{new Date(e.created_at).toLocaleDateString("en-GB")}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: e.read ? "#22c55e" : "#f59e0b", background: e.read ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)", padding: "2px 8px", borderRadius: 10 }}>
                        {e.read ? "Read" : "Unread"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {enquiries.length === 0 && (
              <p style={{ padding: "24px", textAlign: "center", color: "var(--h-muted)", fontSize: 13 }}>No enquiries yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
