"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { RenturaSidebar } from "@/components/rentura/RenturaSidebar";

const S = {
  bg: "#0c0f1a",
  card: "rgba(255,255,255,0.035)",
  border: "rgba(255,255,255,0.07)",
  gold: "#c9a84c",
  ink: "rgba(255,255,255,0.88)",
  ink2: "rgba(255,255,255,0.5)",
  ink3: "rgba(255,255,255,0.25)",
  green: "#15803d",
  teal: "#0891b2",
};

const SPECIALTIES = [
  "plumber", "electrician", "gas engineer", "general builder",
  "locksmith", "decorator", "cleaner", "roofer", "glazier",
  "carpenter", "HVAC", "pest control", "solicitor", "agent",
  "accountant", "surveyor", "other",
];

const ROLES = ["contractor", "agent", "supplier", "solicitor", "accountant", "other"];

const SPEC_COLOR: Record<string, string> = {
  plumber: "#0891b2", electrician: "#d97706", "gas engineer": "#dc2626",
  "general builder": "#7c3aed", locksmith: "#15803d", decorator: "#b8962e",
  cleaner: "#2563eb", roofer: "#475569", solicitor: "#7c3aed",
  agent: "#15803d", accountant: "#b8962e", surveyor: "#0891b2",
};

type Contact = {
  id: string;
  name: string;
  role: string;
  specialty: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  notes: string | null;
  preferred: boolean;
};

const EMPTY: Omit<Contact, "id"> = {
  name: "", role: "contractor", specialty: null,
  phone: null, whatsapp: null, email: null, notes: null, preferred: false,
};

function waLink(num: string | null) {
  if (!num) return null;
  return `https://wa.me/${num.replace(/\D/g, "")}`;
}

function specColor(s: string | null) {
  return SPEC_COLOR[s ?? ""] ?? S.ink3;
}

export default function ContactsPage() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [form, setForm] = useState<Omit<Contact, "id">>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterSpec, setFilterSpec] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("rentura_contacts")
      .select("*")
      .eq("user_id", user.id)
      .order("preferred", { ascending: false })
      .order("name");
    setContacts((data ?? []) as Contact[]);
    setLoading(false);
  }, [user]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- load is an async fetch; its setState calls run after the await, not during render
  useEffect(() => { load(); }, [load]);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY);
    setShowModal(true);
  }

  function openEdit(c: Contact) {
    setEditing(c);
    setForm({ name: c.name, role: c.role, specialty: c.specialty, phone: c.phone, whatsapp: c.whatsapp, email: c.email, notes: c.notes, preferred: c.preferred });
    setShowModal(true);
  }

  async function save() {
    if (!user || !form.name.trim()) return;
    setSaving(true);
    const payload = {
      user_id: user.id,
      name: form.name.trim(),
      role: form.role,
      specialty: form.specialty || null,
      phone: form.phone?.trim() || null,
      whatsapp: form.whatsapp?.trim() || null,
      email: form.email?.trim() || null,
      notes: form.notes?.trim() || null,
      preferred: form.preferred,
    };
    if (editing) {
      await supabase.from("rentura_contacts").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("rentura_contacts").insert(payload);
    }
    setSaving(false);
    setShowModal(false);
    load();
  }

  async function del(id: string) {
    setDeleting(id);
    await supabase.from("rentura_contacts").delete().eq("id", id);
    setDeleting(null);
    setContacts(c => c.filter(x => x.id !== id));
  }

  const specs = Array.from(new Set(contacts.map(c => c.specialty).filter(Boolean))) as string[];
  const filtered = contacts.filter(c => {
    const q = search.toLowerCase();
    const matchQ = !q || c.name.toLowerCase().includes(q) || (c.specialty ?? "").toLowerCase().includes(q) || (c.phone ?? "").includes(q);
    const matchSpec = !filterSpec || c.specialty === filterSpec;
    return matchQ && matchSpec;
  });

  const preferred = filtered.filter(c => c.preferred);
  const rest = filtered.filter(c => !c.preferred);

  return (
    <>
      <style>{`
        body > header, body > footer { display: none !important; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::placeholder { color: rgba(255,255,255,0.62) !important; }
        select option { background: #1e293b; color: white; }
        .contact-card:hover { background: rgba(255,255,255,0.055) !important; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div style={{ background: S.bg, minHeight: "100vh", color: S.ink, fontFamily: "system-ui, sans-serif", display: "flex" }}>
      <RenturaSidebar />
      <div style={{ flex: 1, overflowY: "auto", padding: "32px 36px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: S.gold, marginBottom: 4 }}>Contacts</h1>
            <p style={{ fontSize: 13, color: S.ink2 }}>
              {contacts.length} contact{contacts.length !== 1 ? "s" : ""} — contractors, agents, suppliers
            </p>
          </div>
          <button onClick={openAdd}
            style={{ background: S.gold, color: "#111", border: "none", borderRadius: 9, padding: "10px 20px", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
            + Add contact
          </button>
        </div>

        {/* Search + filter */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, specialty, or number…"
            style={{ flex: 1, minWidth: 200, background: S.card, border: `1px solid ${S.border}`, borderRadius: 9, padding: "9px 14px", color: S.ink, fontSize: 13, fontFamily: "inherit", outline: "none" }}
          />
          {specs.map(s => (
            <button key={s} onClick={() => setFilterSpec(filterSpec === s ? null : s)}
              style={{ padding: "7px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", border: `1px solid ${filterSpec === s ? specColor(s) : S.border}`, background: filterSpec === s ? `${specColor(s)}22` : "transparent", color: filterSpec === s ? specColor(s) : S.ink2, transition: "all 0.15s" }}>
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: S.ink2, fontSize: 13 }}>Loading…</p>
        ) : contacts.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: 80 }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>📋</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: S.ink, marginBottom: 6 }}>No contacts yet</p>
            <p style={{ fontSize: 13, color: S.ink2, marginBottom: 24 }}>Add your plumber, electrician, gas engineer, and other contractors so the AI can message them for you.</p>
            <button onClick={openAdd} style={{ background: S.gold, color: "#111", border: "none", borderRadius: 9, padding: "10px 22px", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
              Add first contact
            </button>
          </div>
        ) : (
          <div style={{ animation: "fadeIn 0.2s ease" }}>
            {preferred.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontSize: 10, fontWeight: 800, color: S.gold, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>⭐ Preferred</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 12 }}>
                  {preferred.map(c => <ContactCard key={c.id} c={c} onEdit={openEdit} onDelete={del} deleting={deleting} />)}
                </div>
              </div>
            )}
            {rest.length > 0 && (
              <div>
                {preferred.length > 0 && <p style={{ fontSize: 10, fontWeight: 800, color: S.ink3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>All contacts</p>}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 12 }}>
                  {rest.map(c => <ContactCard key={c.id} c={c} onEdit={openEdit} onDelete={del} deleting={deleting} />)}
                </div>
              </div>
            )}
            {filtered.length === 0 && (
              <p style={{ color: S.ink2, fontSize: 13, textAlign: "center", paddingTop: 40 }}>No contacts match your search.</p>
            )}
          </div>
        )}
      </div>
      </div>

      {/* Add / Edit modal */}
      {showModal && (
        <div onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#111827", border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: S.ink }}>{editing ? "Edit contact" : "Add contact"}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: S.ink3, fontSize: 20, cursor: "pointer", lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Name */}
              <div>
                <label htmlFor="contacts-name" style={{ fontSize: 11, fontWeight: 700, color: S.ink2, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>Name *</label>
                <input id="contacts-name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Mr Ahmed, City Plumbing Ltd"
                  style={{ width: "100%", background: S.card, border: `1px solid ${S.border}`, borderRadius: 8, padding: "9px 12px", color: S.ink, fontSize: 13, fontFamily: "inherit", outline: "none" }} />
              </div>

              {/* Role + Specialty side by side */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 10 }}>
                <div>
                  <label htmlFor="contacts-role" style={{ fontSize: 11, fontWeight: 700, color: S.ink2, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>Role</label>
                  <select id="contacts-role" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                    style={{ width: "100%", background: "#1e293b", border: `1px solid ${S.border}`, borderRadius: 8, padding: "9px 12px", color: S.ink, fontSize: 13, fontFamily: "inherit", outline: "none" }}>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="contacts-specialty" style={{ fontSize: 11, fontWeight: 700, color: S.ink2, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>Specialty</label>
                  <select id="contacts-specialty" value={form.specialty ?? ""} onChange={e => setForm(f => ({ ...f, specialty: e.target.value || null }))}
                    style={{ width: "100%", background: "#1e293b", border: `1px solid ${S.border}`, borderRadius: 8, padding: "9px 12px", color: S.ink, fontSize: 13, fontFamily: "inherit", outline: "none" }}>
                    <option value="">— select —</option>
                    {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="contacts-phone" style={{ fontSize: 11, fontWeight: 700, color: S.ink2, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>Phone</label>
                <input id="contacts-phone" value={form.phone ?? ""} onChange={e => setForm(f => ({ ...f, phone: e.target.value || null }))}
                  placeholder="07xxx xxxxxx"
                  style={{ width: "100%", background: S.card, border: `1px solid ${S.border}`, borderRadius: 8, padding: "9px 12px", color: S.ink, fontSize: 13, fontFamily: "inherit", outline: "none" }} />
              </div>

              {/* WhatsApp */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: S.ink2, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>
                  WhatsApp number <span style={{ color: S.ink3, fontWeight: 400 }}>(with country code, digits only)</span>
                </label>
                <input value={form.whatsapp ?? ""} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value.replace(/\D/g, "") || null }))}
                  placeholder="447700123456"
                  style={{ width: "100%", background: S.card, border: `1px solid ${S.border}`, borderRadius: 8, padding: "9px 12px", color: S.ink, fontSize: 13, fontFamily: "inherit", outline: "none" }} />
                <p style={{ fontSize: 10, color: S.ink3, marginTop: 4 }}>UK: 447… — this is what the AI uses to open WhatsApp</p>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="contacts-email" style={{ fontSize: 11, fontWeight: 700, color: S.ink2, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>Email</label>
                <input id="contacts-email" value={form.email ?? ""} onChange={e => setForm(f => ({ ...f, email: e.target.value || null }))}
                  placeholder="contractor@example.com"
                  style={{ width: "100%", background: S.card, border: `1px solid ${S.border}`, borderRadius: 8, padding: "9px 12px", color: S.ink, fontSize: 13, fontFamily: "inherit", outline: "none" }} />
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="contacts-notes" style={{ fontSize: 11, fontWeight: 700, color: S.ink2, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>Notes</label>
                <textarea id="contacts-notes" value={form.notes ?? ""} onChange={e => setForm(f => ({ ...f, notes: e.target.value || null }))}
                  placeholder="e.g. Reliable, usually available weekdays. Gas Safe reg: 123456"
                  rows={2}
                  style={{ width: "100%", background: S.card, border: `1px solid ${S.border}`, borderRadius: 8, padding: "9px 12px", color: S.ink, fontSize: 13, fontFamily: "inherit", outline: "none", resize: "vertical" }} />
              </div>

              {/* Preferred toggle */}
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <div onClick={() => setForm(f => ({ ...f, preferred: !f.preferred }))}
                  style={{ width: 38, height: 22, borderRadius: 11, background: form.preferred ? S.gold : S.border, border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                  <div style={{ position: "absolute", top: 3, left: form.preferred ? 18 : 3, width: 16, height: 16, borderRadius: "50%", background: form.preferred ? "#111" : "rgba(255,255,255,0.5)", transition: "left 0.2s" }} />
                </div>
                <span style={{ fontSize: 13, color: S.ink }}>Mark as preferred</span>
                <span style={{ fontSize: 11, color: S.ink3 }}>(shows at top, AI prioritises)</span>
              </label>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <button onClick={save} disabled={saving || !form.name.trim()}
                style={{ flex: 1, background: S.gold, color: "#111", border: "none", borderRadius: 9, padding: "11px", fontSize: 13, fontWeight: 800, cursor: saving || !form.name.trim() ? "not-allowed" : "pointer", opacity: saving || !form.name.trim() ? 0.5 : 1, fontFamily: "inherit" }}>
                {saving ? "Saving…" : editing ? "Save changes" : "Add contact"}
              </button>
              <button onClick={() => setShowModal(false)}
                style={{ padding: "11px 18px", background: "none", border: `1px solid ${S.border}`, borderRadius: 9, color: S.ink2, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ContactCard({ c, onEdit, onDelete, deleting }: { c: Contact; onEdit: (c: Contact) => void; onDelete: (id: string) => void; deleting: string | null }) {
  const [confirmDel, setConfirmDel] = useState(false);
  const col = specColor(c.specialty);
  const wa = waLink(c.whatsapp || c.phone);

  return (
    <div className="contact-card"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 18px", transition: "background 0.15s", position: "relative" }}>
      {c.preferred && (
        <span style={{ position: "absolute", top: 12, right: 14, fontSize: 11, color: "var(--gold-ink)", fontWeight: 700 }}>⭐</span>
      )}

      {/* Name + specialty */}
      <div style={{ marginBottom: 10 }}>
        <p style={{ fontSize: 14, fontWeight: 800, color: "rgba(255,255,255,0.9)", marginBottom: 4 }}>{c.name}</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {c.specialty && (
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: `${col}18`, color: col, border: `1px solid ${col}35`, textTransform: "capitalize" }}>
              {c.specialty}
            </span>
          )}
          {c.role !== "contractor" && (
            <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 10, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.62)", border: "1px solid rgba(255,255,255,0.1)", textTransform: "capitalize" }}>
              {c.role}
            </span>
          )}
        </div>
      </div>

      {/* Contact details */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }}>
        {c.phone && (
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.62)", width: 14 }}>📞</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{c.phone}</span>
          </div>
        )}
        {c.whatsapp && (
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.62)", width: 14 }}>💬</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{c.whatsapp}</span>
          </div>
        )}
        {c.email && (
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.62)", width: 14 }}>✉</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.email}</span>
          </div>
        )}
        {c.notes && (
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.58)", lineHeight: 1.5, marginTop: 2 }}>{c.notes}</p>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", background: "#15803d1a", border: "1px solid #15803d55", borderRadius: 8, color: "#15803d", fontSize: 11, fontWeight: 700, textDecoration: "none" }}>
            📱 WhatsApp
          </a>
        )}
        <button onClick={() => onEdit(c)}
          style={{ padding: "6px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          Edit
        </button>
        {!confirmDel ? (
          <button onClick={() => setConfirmDel(true)}
            style={{ marginLeft: "auto", padding: "6px 10px", background: "none", border: "none", color: "rgba(255,255,255,0.2)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
            🗑
          </button>
        ) : (
          <div style={{ marginLeft: "auto", display: "flex", gap: 5 }}>
            <button onClick={() => onDelete(c.id)} disabled={deleting === c.id}
              style={{ padding: "5px 10px", background: "#dc262620", border: "1px solid #dc262655", borderRadius: 7, color: "#b91c1c", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              {deleting === c.id ? "…" : "Delete"}
            </button>
            <button onClick={() => setConfirmDel(false)}
              style={{ padding: "5px 8px", background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7, color: "rgba(255,255,255,0.58)", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
