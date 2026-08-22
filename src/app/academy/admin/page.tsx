"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { isAdmin } from "@/lib/site";


const C = {
  bg: "#0a0f1e", card: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.07)",
  ink: "rgba(255,255,255,0.9)", ink2: "rgba(255,255,255,0.5)", ink3: "rgba(255,255,255,0.25)",
  gold: "#c9a84c", green: "#22c55e", red: "#ef4444", amber: "#f59e0b",
};

type Tab = "overview" | "members" | "courses" | "enrollments";

// Row shapes for the admin tables. select("*") with no generated Supabase types,
// so each lists the columns this page actually reads.
type MemberRow = {
  id: string; user_id: string; status: string; created_at: string;
  stripe_customer_id: string | null; current_period_end: string | null;
};
type CourseRow = {
  id: string; title: string; category: string | null; difficulty: string | null;
  lesson_count: number | null; is_free: boolean; is_published: boolean;
};
type EnrollmentRow = {
  id: string; enrolled_at: string; completed_at: string | null;
  course: { title: string } | null;
};

export default function AcademyAdmin() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([]);
  const [stats, setStats] = useState({ members: 0, active: 0, courses: 0, mrr: 0 });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/academy/join");
    if (!loading && user && !isAdmin(user.email)) router.push("/academy/dashboard");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !isAdmin(user.email)) return;
    Promise.all([
      supabase.from("academy_members").select("*").order("created_at", { ascending: false }),
      supabase.from("academy_courses").select("*").order("sort_order"),
      supabase.from("academy_enrollments").select("*, course:academy_courses(title)").order("enrolled_at", { ascending: false }).limit(100),
    ]).then(([m, c, e]) => {
      setMembers(m.data || []);
      setCourses(c.data || []);
      setEnrollments(e.data || []);
      const active = ((m.data ?? []) as MemberRow[]).filter(x => x.status === "active");
      setStats({ members: (m.data || []).length, active: active.length, courses: (c.data || []).length, mrr: active.length * 14.99 });
      setDataLoading(false);
    });
  }, [user]);

  async function togglePublish(id: string, current: boolean) {
    await supabase.from("academy_courses").update({ is_published: !current }).eq("id", id);
    setCourses(cs => cs.map(c => c.id === id ? { ...c, is_published: !current } : c));
  }

  if (loading || dataLoading) return <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: C.ink3 }}>Loading…</p></div>;
  if (!user || !isAdmin(user.email)) return null;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "var(--font-family-body)", color: C.ink }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>

      <header style={{ background: "rgba(0,0,0,0.4)", borderBottom: `1px solid ${C.border}`, padding: "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link href="/academy" style={{ fontSize: 14, fontWeight: 800, color: C.gold, textDecoration: "none" }}>Academy</Link>
          <span style={{ fontSize: 11, color: C.red, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 20, padding: "2px 10px" }}>Admin</span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <Link href="/academy/dashboard" style={{ fontSize: 12, color: C.ink2, textDecoration: "none" }}>← Dashboard</Link>
          <Link href="/rentura/admin" style={{ fontSize: 12, color: C.ink3, textDecoration: "none" }}>Rentura admin</Link>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 32 }}>
          {[
            { label: "Total members", value: stats.members, color: "#3b82f6" },
            { label: "Active subscribers", value: stats.active, color: C.green },
            { label: "Courses published", value: courses.filter(c => c.is_published).length, color: C.gold },
            { label: "MRR", value: `£${stats.mrr.toFixed(2)}`, color: C.amber },
          ].map(s => (
            <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 20px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: C.ink3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{s.label}</p>
              <p style={{ fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${C.border}`, marginBottom: 24 }}>
          {(["overview","members","courses","enrollments"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: "8px 16px", fontSize: 13, fontWeight: tab === t ? 700 : 500, color: tab === t ? C.gold : C.ink2, borderBottom: tab === t ? `2px solid ${C.gold}` : "2px solid transparent", textTransform: "capitalize" }}>{t}</button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 24px" }}>
              <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Recent members</p>
              {members.slice(0, 8).map(m => (
                <div key={m.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 12, color: C.ink, fontFamily: "monospace" }}>{m.user_id?.slice(0, 20)}…</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: m.status === "active" ? C.green : C.red, background: m.status === "active" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", padding: "2px 8px", borderRadius: 10, textTransform: "capitalize" }}>{m.status}</span>
                </div>
              ))}
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 24px" }}>
              <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Recent enrollments</p>
              {enrollments.slice(0, 8).map(e => (
                <div key={e.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 12, color: C.ink2 }}>{e.course?.title || "Unknown"}</span>
                  <span style={{ fontSize: 11, color: C.ink3 }}>{new Date(e.enrolled_at).toLocaleDateString("en-GB")}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Members */}
        {tab === "members" && (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
              <p style={{ fontSize: 13, fontWeight: 700 }}>{members.length} members</p>
              <button onClick={() => {
                const csv = ["user_id,status,stripe_customer_id,created_at", ...members.map(m => `${m.user_id},${m.status},${m.stripe_customer_id || ""},${m.created_at}`)].join("\n");
                const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "academy-members.csv"; a.click();
              }} style={{ background: C.gold, color: "#0f1b36", fontWeight: 800, fontSize: 12, padding: "5px 14px", borderRadius: 7, border: "none", cursor: "pointer" }}>Export CSV</button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {["User ID","Status","Customer","Period end","Joined"].map(h => (
                    <th key={h} style={{ padding: "10px 18px", fontSize: 11, fontWeight: 700, color: C.ink3, textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "left" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "11px 18px", fontSize: 11, color: C.ink, fontFamily: "monospace" }}>{m.user_id?.slice(0, 20)}…</td>
                    <td style={{ padding: "11px 18px" }}><span style={{ fontSize: 10, fontWeight: 700, color: m.status === "active" ? C.green : C.red, background: m.status === "active" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", padding: "2px 8px", borderRadius: 10, textTransform: "capitalize" }}>{m.status}</span></td>
                    <td style={{ padding: "11px 18px", fontSize: 11, color: C.ink2, fontFamily: "monospace" }}>{m.stripe_customer_id?.slice(0, 16) || "—"}</td>
                    <td style={{ padding: "11px 18px", fontSize: 11, color: C.ink2 }}>{m.current_period_end ? new Date(m.current_period_end).toLocaleDateString("en-GB") : "—"}</td>
                    <td style={{ padding: "11px 18px", fontSize: 11, color: C.ink3 }}>{new Date(m.created_at).toLocaleDateString("en-GB")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Courses */}
        {tab === "courses" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {courses.map(c => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 16, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 20px" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{c.title}</p>
                  <p style={{ fontSize: 11, color: C.ink3, marginTop: 3 }}>{c.lesson_count} lessons · {c.difficulty} · {c.category}</p>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: c.is_free ? C.green : C.gold, background: c.is_free ? "rgba(34,197,94,0.1)" : "rgba(201,168,76,0.1)", padding: "3px 10px", borderRadius: 20 }}>
                  {c.is_free ? "Free" : "Paid"}
                </span>
                <button onClick={() => togglePublish(c.id, c.is_published)} style={{ fontSize: 11, fontWeight: 700, color: c.is_published ? C.green : C.ink3, background: c.is_published ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.05)", border: `1px solid ${c.is_published ? "rgba(34,197,94,0.3)" : C.border}`, padding: "5px 12px", borderRadius: 8, cursor: "pointer" }}>
                  {c.is_published ? "Published" : "Draft"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Enrollments */}
        {tab === "enrollments" && (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {["Course","Enrolled","Completed"].map(h => (
                    <th key={h} style={{ padding: "10px 18px", fontSize: 11, fontWeight: 700, color: C.ink3, textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "left" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {enrollments.map(e => (
                  <tr key={e.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "11px 18px", fontSize: 13, color: C.ink }}>{e.course?.title || "—"}</td>
                    <td style={{ padding: "11px 18px", fontSize: 12, color: C.ink2 }}>{new Date(e.enrolled_at).toLocaleDateString("en-GB")}</td>
                    <td style={{ padding: "11px 18px" }}>
                      {e.completed_at ? <span style={{ fontSize: 11, color: C.green }}>✓ {new Date(e.completed_at).toLocaleDateString("en-GB")}</span> : <span style={{ fontSize: 11, color: C.ink3 }}>In progress</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
