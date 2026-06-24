"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

const C = {
  bg: "#0a0f1e", card: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.07)",
  ink: "rgba(255,255,255,0.9)", ink2: "rgba(255,255,255,0.5)", ink3: "rgba(255,255,255,0.25)",
  gold: "#c9a84c", green: "#22c55e",
};

type Lesson = {
  id: string; title: string; content: string | null; video_url: string | null;
  duration_min: number | null; is_free: boolean; sort_order: number;
  module_id: string; course_id: string;
};
type Module = { id: string; title: string; sort_order: number; lessons: Lesson[] };
type Course = { id: string; slug: string; title: string; is_free: boolean };

export default function LessonPage() {
  const { slug, lessonId } = useParams<{ slug: string; lessonId: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [enrolled, setEnrolled] = useState(false);
  const [marking, setMarking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const loadData = useCallback(async () => {
    const { data: c } = await supabase.from("academy_courses").select("id, slug, title, is_free").eq("slug", slug).single();
    if (!c) { router.push("/academy/courses"); return; }
    setCourse(c);

    const { data: l } = await supabase.from("academy_lessons").select("*").eq("id", lessonId).single();
    if (!l) { router.push(`/academy/courses/${slug}`); return; }
    setLesson(l);

    const { data: mods } = await supabase
      .from("academy_modules")
      .select("*, lessons:academy_lessons(*)")
      .eq("course_id", c.id)
      .order("sort_order");
    const sorted = (mods || []).map((m: any) => ({
      ...m, lessons: (m.lessons || []).sort((a: any, b: any) => a.sort_order - b.sort_order),
    })).sort((a: any, b: any) => a.sort_order - b.sort_order);
    setModules(sorted);

    if (user) {
      const [{ data: enr }, { data: sub }, { data: prog }] = await Promise.all([
        supabase.from("academy_enrollments").select("id").eq("user_id", user.id).eq("course_id", c.id).maybeSingle(),
        supabase.from("academy_members").select("status").eq("user_id", user.id).maybeSingle(),
        supabase.from("academy_progress").select("lesson_id, completed").eq("user_id", user.id).eq("course_id", c.id),
      ]);
      setEnrolled(!!enr || sub?.status === "active");
      const p: Record<string, boolean> = {};
      (prog || []).forEach((x: any) => { p[x.lesson_id] = x.completed; });
      setProgress(p);
    }
    setLoading(false);
  }, [slug, lessonId, user, router]);

  useEffect(() => { loadData(); }, [loadData]);

  async function markComplete() {
    if (!user || !lesson || !course) return;
    setMarking(true);
    await supabase.from("academy_progress").upsert({
      user_id: user.id,
      lesson_id: lesson.id,
      course_id: course.id,
      completed: true,
      completed_at: new Date().toISOString(),
    }, { onConflict: "user_id,lesson_id" });
    setProgress(p => ({ ...p, [lesson.id]: true }));
    setMarking(false);

    // Auto-advance to next lesson
    const allLessons = modules.flatMap(m => m.lessons);
    const idx = allLessons.findIndex(l => l.id === lesson.id);
    if (idx < allLessons.length - 1) {
      const next = allLessons[idx + 1];
      router.push(`/academy/courses/${slug}/${next.id}`);
    }
  }

  function prevNext() {
    const allLessons = modules.flatMap(m => m.lessons);
    const idx = allLessons.findIndex(l => l.id === lessonId);
    return {
      prev: idx > 0 ? allLessons[idx - 1] : null,
      next: idx < allLessons.length - 1 ? allLessons[idx + 1] : null,
    };
  }

  const canAccess = enrolled || lesson?.is_free || course?.is_free;
  const isDone = progress[lessonId];
  const { prev, next } = prevNext();
  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);
  const completedCount = Object.values(progress).filter(Boolean).length;

  if (loading) return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: C.ink3 }}>Loading lesson…</p>
    </div>
  );

  if (!lesson || !course) return null;

  if (!canAccess) return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <p style={{ fontSize: 32 }}>🔒</p>
      <p style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>This lesson requires a subscription</p>
      <Link href="/academy/join" style={{ background: C.gold, color: "#0f1b36", fontWeight: 800, padding: "12px 28px", borderRadius: 8, textDecoration: "none" }}>
        Get Academy Access — £14.99/mo
      </Link>
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "var(--font-family-body)", color: C.ink }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>

      {/* Top bar */}
      <header style={{ background: "rgba(0,0,0,0.5)", borderBottom: `1px solid ${C.border}`, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={() => setSidebarOpen(s => !s)} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.ink2, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>
            ☰
          </button>
          <Link href={`/academy/courses/${slug}`} style={{ fontSize: 12, color: C.ink3, textDecoration: "none" }}>
            ← {course.title}
          </Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 11, color: C.ink3 }}>{completedCount}/{totalLessons} complete</span>
          <div style={{ width: 100, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
            <div style={{ width: `${totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0}%`, height: "100%", background: C.gold, borderRadius: 2 }} />
          </div>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Curriculum sidebar */}
        {sidebarOpen && (
          <aside style={{ width: 280, background: "rgba(0,0,0,0.3)", borderRight: `1px solid ${C.border}`, overflowY: "auto", flexShrink: 0 }}>
            {modules.map((mod, mi) => (
              <div key={mod.id}>
                <p style={{ padding: "14px 16px 8px", fontSize: 10, fontWeight: 800, color: C.ink3, textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: `1px solid ${C.border}` }}>
                  {mi + 1}. {mod.title}
                </p>
                {mod.lessons.map(l => {
                  const done = progress[l.id];
                  const active = l.id === lessonId;
                  const accessible = enrolled || l.is_free || course.is_free;
                  return (
                    <div key={l.id}>
                      {accessible ? (
                        <Link href={`/academy/courses/${slug}/${l.id}`} style={{
                          display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
                          fontSize: 12, color: active ? C.gold : done ? C.ink3 : C.ink2,
                          fontWeight: active ? 700 : 400,
                          background: active ? "rgba(201,168,76,0.08)" : "transparent",
                          textDecoration: "none", borderLeft: active ? `2px solid ${C.gold}` : "2px solid transparent",
                        }}>
                          <span style={{ width: 16, height: 16, borderRadius: "50%", background: done ? C.green : "rgba(255,255,255,0.06)", border: `1px solid ${done ? C.green : C.border}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>
                            {done && "✓"}
                          </span>
                          <span style={{ flex: 1, lineHeight: 1.3 }}>{l.title}</span>
                          {l.duration_min && <span style={{ fontSize: 10, color: C.ink3 }}>{l.duration_min}m</span>}
                        </Link>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", fontSize: 12, color: C.ink3, borderLeft: "2px solid transparent" }}>
                          <span style={{ fontSize: 10 }}>🔒</span>
                          <span style={{ flex: 1, lineHeight: 1.3 }}>{l.title}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </aside>
        )}

        {/* Lesson content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "40px 48px", maxWidth: 780 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 20, lineHeight: 1.25 }}>
            {lesson.title}
          </h1>

          {/* Video placeholder */}
          {lesson.video_url ? (
            <div style={{ marginBottom: 32, borderRadius: 12, overflow: "hidden", background: "#000", aspectRatio: "16/9" }}>
              <iframe src={lesson.video_url} style={{ width: "100%", height: "100%", border: "none" }} allow="autoplay; fullscreen" allowFullScreen />
            </div>
          ) : (
            <div style={{ marginBottom: 32, borderRadius: 12, background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 36, marginBottom: 8 }}>🎬</p>
                <p style={{ fontSize: 13, color: C.ink3 }}>Video lesson coming soon</p>
              </div>
            </div>
          )}

          {/* Lesson text */}
          {lesson.content && (
            <div style={{ fontSize: 15, lineHeight: 1.8, color: C.ink2, marginBottom: 36, whiteSpace: "pre-wrap" }}>
              {lesson.content}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", paddingTop: 24, borderTop: `1px solid ${C.border}` }}>
            {prev && (
              <Link href={`/academy/courses/${slug}/${prev.id}`} style={{ background: C.card, border: `1px solid ${C.border}`, color: C.ink2, fontWeight: 600, fontSize: 13, padding: "10px 18px", borderRadius: 8, textDecoration: "none" }}>
                ← Previous
              </Link>
            )}
            {!isDone ? (
              <button onClick={markComplete} disabled={marking} style={{ background: C.gold, color: "#0f1b36", fontWeight: 800, fontSize: 13, padding: "10px 22px", borderRadius: 8, border: "none", cursor: "pointer", opacity: marking ? 0.6 : 1 }}>
                {marking ? "Marking…" : next ? "Mark complete & continue →" : "Mark complete ✓"}
              </button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: C.green, fontWeight: 700, fontSize: 13 }}>✓ Completed</span>
                {next && (
                  <Link href={`/academy/courses/${slug}/${next.id}`} style={{ background: C.gold, color: "#0f1b36", fontWeight: 800, fontSize: 13, padding: "10px 22px", borderRadius: 8, textDecoration: "none" }}>
                    Next lesson →
                  </Link>
                )}
              </div>
            )}
          </div>

          {!next && isDone && (
            <div style={{ marginTop: 32, background: "rgba(201,168,76,0.06)", border: `1px solid rgba(201,168,76,0.2)`, borderRadius: 16, padding: "28px 32px", textAlign: "center" }}>
              <p style={{ fontSize: 22, fontWeight: 800, color: C.gold, marginBottom: 8 }}>Course complete!</p>
              <p style={{ fontSize: 14, color: C.ink2, marginBottom: 20 }}>You have finished {course.title}. Collect your certificate below.</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href={`/academy/courses/${slug}/certificate`} style={{ background: C.gold, color: "#0f1b36", fontWeight: 800, fontSize: 13, padding: "10px 24px", borderRadius: 8, textDecoration: "none" }}>
                  🏆 Get certificate
                </Link>
                <Link href={`/academy/courses/${slug}`} style={{ background: "rgba(255,255,255,0.08)", color: C.ink, fontWeight: 700, fontSize: 13, padding: "10px 24px", borderRadius: 8, textDecoration: "none" }}>
                  Course overview
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
