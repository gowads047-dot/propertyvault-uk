"use client";

import { useState } from "react";
import Link from "next/link";

interface Investor {
  id: number;
  name: string;
  phone: string;
  email: string;
  strategy: string;
  budget: string;
  area: string;
  status: "Hot" | "Warm" | "Cold" | "Inactive";
  notes: string;
  lastContact: string;
}

const STATUS_COLORS: Record<string, string> = {
  Hot: "#ef4444", Warm: "#f59e0b", Cold: "#3b82f6", Inactive: "#475569",
};

const INITIAL: Investor[] = [
  { id: 1, name: "James Thornton", phone: "07700 900123", email: "james@example.com", strategy: "BTL / BRRR", budget: "£150k–£300k", area: "Birmingham, Wolverhampton", status: "Hot", notes: "Wants 2 bed terraces, min 7% yield. Ready to move fast.", lastContact: "2026-06-20" },
  { id: 2, name: "Sarah Ahmed", phone: "07700 900456", email: "sarah@example.com", strategy: "HMO", budget: "£200k–£400k", area: "Nottingham, Derby", status: "Warm", notes: "Looking for 5+ bed HMO conversions. Has planning experience.", lastContact: "2026-06-15" },
  { id: 3, name: "David Clarke", phone: "07700 900789", email: "david@example.com", strategy: "Deal Packaging", budget: "£100k–£180k", area: "West Midlands", status: "Warm", notes: "Happy to pay sourcing fee up to £5k. Prefers below market value.", lastContact: "2026-06-10" },
];

const BLANK: Omit<Investor, "id"> = { name: "", phone: "", email: "", strategy: "", budget: "", area: "", status: "Warm", notes: "", lastContact: new Date().toISOString().slice(0, 10) };

const NAV = [["Courses","/academy/courses"],["Playbooks","/academy/playbooks"],["Scripts","/academy/scripts"],["Downloads","/academy/downloads"],["Calculator","/academy/calculator"],["CRM","/academy/crm"],["Emails","/academy/emails"],["Q&A","/academy/qa"]];

export default function AcademyCRMPage() {
  const [investors, setInvestors] = useState<Investor[]>(INITIAL);
  const [form, setForm] = useState<Omit<Investor, "id">>(BLANK);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filtered = investors.filter(i => {
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.area.toLowerCase().includes(search.toLowerCase()) || i.strategy.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || i.status === filterStatus;
    return matchSearch && matchStatus;
  });

  function save() {
    if (!form.name) return;
    if (editing !== null) {
      setInvestors(prev => prev.map(i => i.id === editing ? { ...form, id: editing } : i));
      setEditing(null);
    } else {
      setInvestors(prev => [...prev, { ...form, id: Date.now() }]);
    }
    setForm(BLANK);
    setShowForm(false);
  }

  function startEdit(inv: Investor) {
    setForm({ name: inv.name, phone: inv.phone, email: inv.email, strategy: inv.strategy, budget: inv.budget, area: inv.area, status: inv.status, notes: inv.notes, lastContact: inv.lastContact });
    setEditing(inv.id);
    setShowForm(true);
  }

  function remove(id: number) {
    if (confirm("Remove this investor?")) setInvestors(prev => prev.filter(i => i.id !== id));
  }

  function exportCSV() {
    const headers = "Name,Phone,Email,Strategy,Budget,Area,Status,Notes,Last Contact";
    const rows = investors.map(i => `"${i.name}","${i.phone}","${i.email}","${i.strategy}","${i.budget}","${i.area}","${i.status}","${i.notes}","${i.lastContact}"`);
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "investor-crm.csv"; a.click();
  }

  const inp = (style?: object) => ({ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "9px 12px", color: "white", fontSize: 13, width: "100%", boxSizing: "border-box" as const, outline: "none", ...style });

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", color: "white" }}>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "14px 24px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <Link href="/academy/dashboard" style={{ color: "#d4af37", fontWeight: 800, fontSize: 16, textDecoration: "none" }}>DSA</Link>
        {NAV.map(([l, h]) => (
          <Link key={h} href={h} style={{ color: l === "CRM" ? "#d4af37" : "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>{l}</Link>
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
          <div>
            <p style={{ fontSize: 11, color: "#d4af37", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Members Only Tool</p>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Investor CRM</h1>
            <p style={{ color: "rgba(255,255,255,0.62)", fontSize: 14 }}>Track your investor contacts, preferences and follow-up pipeline.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={exportCSV} style={{ padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", background: "rgba(255,255,255,0.07)", color: "white", border: "1px solid rgba(255,255,255,0.1)" }}>
              ⬇ Export CSV
            </button>
            <button onClick={() => { setForm(BLANK); setEditing(null); setShowForm(true); }} style={{ padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", background: "#d4af37", color: "#0a0f1e", border: "none" }}>
              + Add Investor
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 12, marginBottom: 24 }}>
          {(["All","Hot","Warm","Cold","Inactive"] as const).map(s => {
            const count = s === "All" ? investors.length : investors.filter(i => i.status === s).length;
            return (
              <button key={s} onClick={() => setFilterStatus(s)} style={{ background: filterStatus === s ? "rgba(212,175,55,0.12)" : "rgba(255,255,255,0.03)", border: `1px solid ${filterStatus === s ? "rgba(212,175,55,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: 12, padding: "14px 16px", textAlign: "center", cursor: "pointer", color: "white" }}>
                <p style={{ fontSize: 22, fontWeight: 800, color: s === "All" ? "#d4af37" : STATUS_COLORS[s] ?? "#d4af37" }}>{count}</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.62)", marginTop: 2 }}>{s}</p>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <input aria-label="Search by name, area or strategy" type="text" placeholder="Search by name, area or strategy…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...inp(), marginBottom: 20, maxWidth: 400 }} />

        {/* Add / Edit form */}
        {showForm && (
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 16, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}>{editing !== null ? "Edit Investor" : "Add New Investor"}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12, marginBottom: 12 }}>
              {([["Name *", "name"], ["Phone", "phone"], ["Email", "email"], ["Strategy (e.g. BTL, HMO)", "strategy"], ["Budget Range", "budget"], ["Target Areas", "area"]] as [string, keyof typeof BLANK][]).map(([label, key]) => (
                <div key={key}>
                  <label style={{ fontSize: 11, color: "rgba(255,255,255,0.58)", display: "block", marginBottom: 4 }}>{label}</label>
                  <input aria-label={label} style={inp()} value={form[key] as string} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label htmlFor="crm-status" style={{ fontSize: 11, color: "rgba(255,255,255,0.58)", display: "block", marginBottom: 4 }}>Status</label>
                <select id="crm-status" style={inp()} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Investor["status"] }))}>
                  {["Hot","Warm","Cold","Inactive"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="crm-last-contact" style={{ fontSize: 11, color: "rgba(255,255,255,0.58)", display: "block", marginBottom: 4 }}>Last Contact</label>
                <input id="crm-last-contact" type="date" style={inp()} value={form.lastContact} onChange={e => setForm(f => ({ ...f, lastContact: e.target.value }))} />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="crm-notes" style={{ fontSize: 11, color: "rgba(255,255,255,0.58)", display: "block", marginBottom: 4 }}>Notes</label>
              <textarea id="crm-notes" style={{ ...inp(), minHeight: 72, resize: "vertical" }} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={save} style={{ background: "#d4af37", color: "#0a0f1e", border: "none", borderRadius: 10, padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                {editing !== null ? "Save Changes" : "Add Investor"}
              </button>
              <button onClick={() => { setShowForm(false); setEditing(null); }} style={{ background: "rgba(255,255,255,0.07)", color: "white", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {["Name","Strategy","Budget","Area","Status","Last Contact",""].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.58)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }} className="group">
                  <td style={{ padding: "12px 12px" }}>
                    <p style={{ fontSize: 14, fontWeight: 700 }}>{inv.name}</p>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.58)", marginTop: 2 }}>{inv.email}</p>
                    {inv.notes && <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 2, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{inv.notes}</p>}
                  </td>
                  <td style={{ padding: "12px 12px", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{inv.strategy}</td>
                  <td style={{ padding: "12px 12px", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{inv.budget}</td>
                  <td style={{ padding: "12px 12px", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{inv.area}</td>
                  <td style={{ padding: "12px 12px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: `${STATUS_COLORS[inv.status]}22`, color: STATUS_COLORS[inv.status] }}>{inv.status}</span>
                  </td>
                  <td style={{ padding: "12px 12px", fontSize: 12, color: "rgba(255,255,255,0.58)" }}>{inv.lastContact}</td>
                  <td style={{ padding: "12px 12px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => startEdit(inv)} style={{ fontSize: 12, color: "#d4af37", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Edit</button>
                      <button onClick={() => remove(inv.id)} style={{ fontSize: 12, color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ padding: "40px 12px", textAlign: "center", color: "rgba(255,255,255,0.62)", fontSize: 14 }}>No investors found. Add your first contact above.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 16 }}>Data is stored in your browser session only. Export to CSV to save permanently.</p>
      </div>
    </div>
  );
}
