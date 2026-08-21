"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

type Course = { id: string; title: string; slug: string; lesson_count: number | null; duration_hrs: number | null };

export default function CourseCertificate() {
  const { user, profile, loading: authLoading } = useAuth();
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const certRef = useRef<HTMLDivElement>(null);

  const [course, setCourse] = useState<Course | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);
  const [eligible, setEligible] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data: c } = await supabase.from("academy_courses").select("id, title, slug, lesson_count, duration_hrs").eq("slug", slug).single();
    if (!c) { setLoading(false); return; }
    setCourse(c);
    const [{ count: done }, { count: total }] = await Promise.all([
      supabase.from("academy_progress").select("*", { count: "exact", head: true }).eq("user_id", user!.id).eq("course_id", c.id).eq("completed", true),
      supabase.from("academy_lessons").select("*", { count: "exact", head: true }).eq("course_id", c.id),
    ]);
    const d = done || 0;
    const t = total || c.lesson_count || 1;
    setCompletedCount(d);
    setTotalLessons(t);
    setEligible(d >= t && t > 0);
    setLoading(false);
  }

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/academy/join"); return; }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load is an async fetch; its setState calls run after the await, not during render
    load();
  }, [user, authLoading]); // eslint-disable-line

  function printCert() {
    window.print();
  }

  const completionDate = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const studentName = profile?.name || user?.email?.split("@")[0] || "Student";

  if (loading || authLoading) return (
    <div style={{ minHeight: "100vh", background: "#0c0f1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "rgba(255,255,255,0.4)" }}>Loading…</p>
    </div>
  );

  if (!course) return (
    <div style={{ minHeight: "100vh", background: "#0c0f1a", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16 }}>Course not found.</p>
      <Link href="/academy/dashboard" style={{ color: "var(--gold-ink)", fontSize: 14 }}>← Back to dashboard</Link>
    </div>
  );

  if (!eligible) return (
    <div style={{ minHeight: "100vh", background: "#0c0f1a", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, padding: 24, textAlign: "center" }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>
      <p style={{ fontSize: 32 }}>🔒</p>
      <p style={{ fontSize: 20, fontWeight: 800, color: "rgba(255,255,255,0.9)" }}>Certificate not yet earned</p>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", maxWidth: 340 }}>
        You&apos;ve completed {completedCount} of {totalLessons} lessons in <strong style={{ color: "rgba(255,255,255,0.7)" }}>{course.title}</strong>.
        Finish all lessons to unlock your certificate.
      </p>
      <Link href={`/academy/courses/${slug}`} style={{ background: "#c9a84c", color: "#0f1b36", fontWeight: 800, fontSize: 14, padding: "11px 24px", borderRadius: 10, textDecoration: "none", marginTop: 8 }}>
        Continue course →
      </Link>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0c0f1a", fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <style>{`
        body > header, body > footer { display: none !important; }
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          #cert-wrap { box-shadow: none !important; margin: 0 !important; border-radius: 0 !important; }
        }
      `}</style>

      {/* Actions bar */}
      <div className="no-print" style={{ padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Link href={`/academy/courses/${slug}`} style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>← Back to course</Link>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/academy/dashboard" style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", textDecoration: "none", padding: "8px 16px" }}>Dashboard</Link>
          <button onClick={printCert} style={{ background: "#c9a84c", color: "#0f1b36", fontWeight: 800, fontSize: 13, padding: "9px 22px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
            Download / Print
          </button>
        </div>
      </div>

      {/* Certificate */}
      <div style={{ display: "flex", justifyContent: "center", padding: "48px 24px" }}>
        <div id="cert-wrap" ref={certRef} style={{
          width: "100%", maxWidth: 760,
          background: "white",
          borderRadius: 4,
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
          position: "relative",
          overflow: "hidden",
          padding: "60px 72px",
          textAlign: "center",
          color: "#1a1a2e",
        }}>
          {/* Gold border frame */}
          <div style={{ position: "absolute", inset: 14, border: "2px solid #c9a84c", borderRadius: 2, pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 20, border: "0.5px solid rgba(201,168,76,0.35)", borderRadius: 2, pointerEvents: "none" }} />

          {/* Corner ornaments */}
          {["top:14px;left:14px", "top:14px;right:14px", "bottom:14px;left:14px", "bottom:14px;right:14px"].map((pos, i) => {
            const [vPos, hPos] = pos.split(";");
            const [vKey, vVal] = vPos.split(":");
            const [hKey, hVal] = hPos.split(":");
            return (
              <div key={i} style={{ position: "absolute", [vKey]: vVal, [hKey]: hVal, width: 24, height: 24, borderTop: i < 2 ? "2px solid #c9a84c" : "none", borderBottom: i >= 2 ? "2px solid #c9a84c" : "none", borderLeft: i % 2 === 0 ? "2px solid #c9a84c" : "none", borderRight: i % 2 === 1 ? "2px solid #c9a84c" : "none" }} />
            );
          })}

          {/* Logo / Brand */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 11, letterSpacing: "0.25em", fontFamily: "var(--font-family-body, sans-serif)", color: "var(--gold-ink)", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>PropertyVault Academy</p>
            <div style={{ width: 48, height: 1, background: "rgba(201,168,76,0.4)", margin: "0 auto" }} />
          </div>

          <p style={{ fontSize: 12, letterSpacing: "0.2em", color: "#6b7280", fontFamily: "var(--font-family-body, sans-serif)", textTransform: "uppercase", marginBottom: 20 }}>Certificate of Completion</p>

          <p style={{ fontSize: 14, color: "#6b7280", fontFamily: "var(--font-family-body, sans-serif)", marginBottom: 8 }}>This certifies that</p>

          <h1 style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 700, color: "#1a1a2e", fontFamily: "Georgia, serif", letterSpacing: "-0.01em", marginBottom: 8, borderBottom: "1.5px solid rgba(201,168,76,0.5)", paddingBottom: 12, display: "inline-block", minWidth: "60%" }}>
            {studentName}
          </h1>

          <p style={{ fontSize: 14, color: "#6b7280", fontFamily: "var(--font-family-body, sans-serif)", margin: "20px 0 8px" }}>has successfully completed</p>

          <h2 style={{ fontSize: "clamp(18px,3vw,26px)", fontWeight: 700, color: "#1a1a2e", fontFamily: "Georgia, serif", marginBottom: 8, lineHeight: 1.3 }}>
            {course.title}
          </h2>

          {course.duration_hrs && (
            <p style={{ fontSize: 12, color: "#9ca3af", fontFamily: "var(--font-family-body, sans-serif)", marginBottom: 32 }}>
              {totalLessons} lessons · {course.duration_hrs} hours of study
            </p>
          )}

          {/* Decorative divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "28px 0", justifyContent: "center" }}>
            <div style={{ flex: 1, height: 0.5, background: "rgba(201,168,76,0.3)" }} />
            <span style={{ color: "var(--gold-ink)", fontSize: 18 }}>✦</span>
            <div style={{ flex: 1, height: 0.5, background: "rgba(201,168,76,0.3)" }} />
          </div>

          {/* Date + Signature row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 8 }}>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: 11, letterSpacing: "0.1em", color: "#9ca3af", fontFamily: "var(--font-family-body, sans-serif)", textTransform: "uppercase", marginBottom: 4 }}>Date Awarded</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e", fontFamily: "Georgia, serif" }}>{completionDate}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 28, color: "var(--gold-ink)", marginBottom: 2 }}>🏆</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 22, fontFamily: "'Brush Script MT', cursive, Georgia", color: "#1a1a2e", marginBottom: 2 }}>Nass</p>
              <div style={{ width: "100%", height: 0.5, background: "rgba(0,0,0,0.2)", marginBottom: 4 }} />
              <p style={{ fontSize: 10, letterSpacing: "0.1em", color: "#9ca3af", fontFamily: "var(--font-family-body, sans-serif)", textTransform: "uppercase" }}>Academy Director</p>
            </div>
          </div>

          {/* Footer seal */}
          <p style={{ marginTop: 28, fontSize: 10, color: "#d1d5db", fontFamily: "var(--font-family-body, sans-serif)", letterSpacing: "0.08em" }}>
            PropertyVault Academy · propertyvault.co.uk/academy
          </p>
        </div>
      </div>

      {/* Social share nudge */}
      <div className="no-print" style={{ textAlign: "center", paddingBottom: 48 }}>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>Share your achievement</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
          {["LinkedIn", "Twitter/X", "WhatsApp"].map(s => (
            <button key={s} style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontFamily: "inherit" }}>
              Share on {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
