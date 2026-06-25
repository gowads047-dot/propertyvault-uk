"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { RenturaSidebar } from "@/components/rentura/RenturaSidebar";

type Doc = {
  id: string;
  file_name: string;
  category: string;
  file_url: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
  property_id: string | null;
};

const CATEGORIES = ["all", "tenancy", "compliance", "mortgage", "insurance", "correspondence", "financial", "other"] as const;

const C = {
  bg: "#0c0f1a", card: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.07)",
  ink: "rgba(255,255,255,0.85)", ink2: "rgba(255,255,255,0.45)", ink3: "rgba(255,255,255,0.22)",
  gold: "#c9a84c", green: "#22c55e",
};

const CAT_COLORS: Record<string, string> = {
  tenancy: "#6366f1", compliance: "#22c55e", mortgage: "#c9a84c",
  insurance: "#0891b2", correspondence: "#a78bfa", financial: "#f59e0b", other: "#64748b",
};

function fmtSize(b: number | null) {
  if (!b) return "";
  if (b < 1024) return `${b}B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)}KB`;
  return `${(b / 1024 / 1024).toFixed(1)}MB`;
}

export default function RenturaDocuments() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [properties, setProperties] = useState<{ id: string; address: string }[]>([]);
  const [selectedProp, setSelectedProp] = useState("");
  const [selectedCat, setSelectedCat] = useState("other");
  const fileRef = useRef<HTMLInputElement>(null);
  const [docsLoading, setDocsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/rentura/auth");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    supabase.from("rentura_properties").select("id, address").eq("user_id", user.id).then(({ data }) => {
      if (data) setProperties(data);
    });
    fetchDocs();
  }, [user]); // eslint-disable-line

  async function fetchDocs() {
    if (!user) return;
    setDocsLoading(true);
    const { data } = await supabase
      .from("rentura_documents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setDocs(data || []);
    setDocsLoading(false);
  }

  async function uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const path = `${user.id}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("rentura-docs").upload(path, file);
    if (error) { alert("Upload failed: " + error.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("rentura-docs").getPublicUrl(path);
    await supabase.from("rentura_documents").insert({
      user_id: user.id,
      property_id: selectedProp || null,
      file_name: file.name,
      category: selectedCat,
      file_url: publicUrl,
      file_size: file.size,
      mime_type: file.type,
    });
    await fetchDocs();
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function deleteDoc(id: string, fileUrl: string) {
    if (!confirm("Delete this document?")) return;
    const path = fileUrl.split("rentura-docs/")[1];
    if (path) await supabase.storage.from("rentura-docs").remove([path]);
    await supabase.from("rentura_documents").delete().eq("id", id);
    setDocs(d => d.filter(x => x.id !== id));
  }

  const filtered = docs.filter(d =>
    (category === "all" || d.category === category) &&
    (search === "" || d.file_name.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <div style={{ background: C.bg, minHeight: "100vh" }} />;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", fontFamily: "var(--font-family-body)", color: C.ink }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>
      <RenturaSidebar />

      <main style={{ flex: 1, padding: "36px 40px", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 4 }}>Documents</h1>
            <p style={{ fontSize: 13, color: C.ink2 }}>{docs.length} document{docs.length !== 1 ? "s" : ""} stored securely</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <select value={selectedProp} onChange={e => setSelectedProp(e.target.value)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 12, color: C.ink2, outline: "none" }}>
              <option value="">No property</option>
              {properties.map(p => <option key={p.id} value={p.id}>{p.address.split(",")[0]}</option>)}
            </select>
            <select value={selectedCat} onChange={e => setSelectedCat(e.target.value)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 12, color: C.ink2, outline: "none" }}>
              {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
            <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ background: C.gold, color: "#0f1b36", fontWeight: 800, fontSize: 13, padding: "9px 18px", borderRadius: 8, border: "none", cursor: "pointer" }}>
              {uploading ? "Uploading…" : "+ Upload"}
            </button>
            <input ref={fileRef} type="file" style={{ display: "none" }} onChange={uploadFile} />
          </div>
        </div>

        {/* Search + filters */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search documents…"
            style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 14px", fontSize: 13, color: C.ink, outline: "none" }}
          />
          <div style={{ display: "flex", gap: 4 }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)} style={{
                background: category === c ? C.gold : C.card,
                color: category === c ? "#0f1b36" : C.ink2,
                border: `1px solid ${category === c ? C.gold : C.border}`,
                borderRadius: 7, padding: "6px 12px", fontSize: 11, fontWeight: 600,
                cursor: "pointer", textTransform: "capitalize", fontFamily: "inherit",
              }}>{c}</button>
            ))}
          </div>
        </div>

        {/* Upload zone (empty state) */}
        {!docsLoading && filtered.length === 0 && (
          <div
            onClick={() => fileRef.current?.click()}
            style={{ border: `2px dashed ${C.border}`, borderRadius: 16, padding: "60px 40px", textAlign: "center", cursor: "pointer" }}
          >
            <p style={{ fontSize: 32, marginBottom: 12 }}>📄</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, marginBottom: 6 }}>
              {search || category !== "all" ? "No documents match your filters" : "No documents yet"}
            </p>
            <p style={{ fontSize: 13, color: C.ink2 }}>
              {search || category !== "all" ? "Try a different search or category" : "Upload tenancy agreements, compliance certs, mortgage documents, and more."}
            </p>
          </div>
        )}

        {/* Document list */}
        {filtered.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map(doc => (
              <div key={doc.id} style={{ display: "flex", alignItems: "center", gap: 16, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 18px" }}>
                <div style={{ fontSize: 24, width: 36, textAlign: "center" }}>{docIcon(doc.file_name)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: C.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.file_name}</p>
                  <p style={{ fontSize: 11, color: C.ink3, marginTop: 2 }}>
                    {new Date(doc.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    {doc.file_size ? ` · ${fmtSize(doc.file_size)}` : ""}
                  </p>
                </div>
                <span style={{ background: (CAT_COLORS[doc.category] || "#64748b") + "22", color: CAT_COLORS[doc.category] || "#64748b", fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, textTransform: "capitalize" }}>
                  {doc.category}
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: C.gold, fontWeight: 700, padding: "5px 12px", borderRadius: 7, border: `1px solid rgba(201,168,76,0.3)`, textDecoration: "none" }}>
                    View
                  </a>
                  <button onClick={() => deleteDoc(doc.id, doc.file_url)} style={{ fontSize: 12, color: "#ef4444", background: "transparent", border: `1px solid rgba(239,68,68,0.2)`, borderRadius: 7, padding: "5px 10px", cursor: "pointer" }}>
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function docIcon(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (["pdf"].includes(ext || "")) return "📋";
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) return "🖼️";
  if (["doc", "docx"].includes(ext || "")) return "📝";
  if (["xls", "xlsx", "csv"].includes(ext || "")) return "📊";
  return "📄";
}
