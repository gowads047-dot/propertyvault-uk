"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

const C = {
  bg: "#0a0f1e", card: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.07)",
  ink: "rgba(255,255,255,0.9)", ink2: "rgba(255,255,255,0.5)", ink3: "rgba(255,255,255,0.25)",
  gold: "#c9a84c", green: "#22c55e", blue: "#3b82f6",
};

type Course = {
  id: string; slug: string; title: string; subtitle: string; description: string;
  category: string; difficulty: string; duration_hrs: number; lesson_count: number; is_free: boolean;
};
type Module = { id: string; title: string; sort_order: number; lessons: Lesson[] };
type Lesson = { id: string; title: string; duration_min: number | null; is_free: boolean; sort_order: number; video_url: string | null; content: string | null };
type Progress = Record<string, boolean>;
type ProgressRow = { lesson_id: string; completed: boolean };

export default function CoursePage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<Progress>({});
  const [enrolled, setEnrolled] = useState(false);
  const [hasSub, setHasSub] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  async function loadCourse() {
    const { data: c } = await supabase
      .from("academy_courses")
      .select("*")
      .eq("slug", slug)
      .single();
    if (!c) { router.push("/academy/courses"); return; }
    setCourse(c);

    const { data: mods } = await supabase
      .from("academy_modules")
      .select("*, lessons:academy_lessons(*)")
      .eq("course_id", c.id)
      .order("sort_order");

    // Supabase has no generated types here, so the joined shape is asserted once
    // and everything downstream is inferred.
    const sorted = ((mods ?? []) as Module[])
      .map(m => ({ ...m, lessons: [...(m.lessons ?? [])].sort((a, b) => a.sort_order - b.sort_order) }))
      .sort((a, b) => a.sort_order - b.sort_order);
    setModules(sorted);

    if (user) {
      const [{ data: enr }, { data: sub }, { data: prog }] = await Promise.all([
        supabase.from("academy_enrollments").select("id").eq("user_id", user.id).eq("course_id", c.id).maybeSingle(),
        supabase.from("academy_members").select("status").eq("user_id", user.id).maybeSingle(),
        supabase.from("academy_progress").select("lesson_id, completed").eq("user_id", user.id).eq("course_id", c.id),
      ]);
      setEnrolled(!!enr);
      setHasSub(sub?.status === "active");
      const p: Progress = {};
      ((prog ?? []) as ProgressRow[]).forEach(x => { p[x.lesson_id] = x.completed; });
      setProgress(p);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!slug) return;
    loadCourse();
  }, [slug, user]); // eslint-disable-line

  async function enroll() {
    if (!user || !course) return;
    if (!hasSub && !course.is_free) {
      router.push("/academy/join");
      return;
    }
    setEnrolling(true);
    await supabase.from("academy_enrollments").upsert({ user_id: user.id, course_id: course.id }, { onConflict: "user_id,course_id" });
    setEnrolled(true);
    setEnrolling(false);
  }

  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);
  const completedLessons = Object.values(progress).filter(Boolean).length;
  const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  if (loading) return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: C.ink3 }}>Loading course…</p>
    </div>
  );

  if (!course) return null;

  const DIFF_COLORS: Record<string, string> = { beginner: C.green, intermediate: C.gold, advanced: "#ef4444" };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "var(--font-family-body)", color: C.ink }}>
      <style>{`body > header { display: none !important; }`}</style>

      {/* Course header */}
      <div style={{ background: "rgba(0,0,0,0.4)", borderBottom: `1px solid ${C.border}`, padding: "28px 0" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>
          <Link href="/academy/courses" style={{ fontSize: 12, color: C.ink3, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
            ← All courses
          </Link>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: DIFF_COLORS[course.difficulty] || C.gold, background: (DIFF_COLORS[course.difficulty] || C.gold) + "22", padding: "3px 10px", borderRadius: 20, textTransform: "capitalize" }}>
                  {course.difficulty}
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, color: C.ink3, background: "rgba(255,255,255,0.06)", padding: "3px 10px", borderRadius: 20, textTransform: "capitalize" }}>
                  {course.category.replace("-", " ")}
                </span>
                {course.is_free && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: C.green, background: "rgba(34,197,94,0.1)", padding: "3px 10px", borderRadius: 20 }}>Free</span>
                )}
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>{course.title}</h1>
              <p style={{ fontSize: 14, color: C.ink2, marginBottom: 16, lineHeight: 1.6 }}>{course.description}</p>
              <div style={{ display: "flex", gap: 20 }}>
                <span style={{ fontSize: 12, color: C.ink3 }}>{course.duration_hrs}h total</span>
                <span style={{ fontSize: 12, color: C.ink3 }}>{totalLessons} lessons</span>
                <span style={{ fontSize: 12, color: C.ink3 }}>{modules.length} modules</span>
              </div>
            </div>
            <div style={{ flexShrink: 0, textAlign: "center" }}>
              {enrolled ? (
                <div>
                  <div style={{ marginBottom: 10 }}>
                    <p style={{ fontSize: 11, color: C.ink3, marginBottom: 4 }}>{completedLessons}/{totalLessons} lessons complete</p>
                    <div style={{ width: 200, height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3 }}>
                      <div style={{ width: `${progressPct}%`, height: "100%", background: C.gold, borderRadius: 3, transition: "width 0.3s" }} />
                    </div>
                    <p style={{ fontSize: 11, color: C.gold, marginTop: 4 }}>{progressPct}% complete</p>
                  </div>
                  {modules[0]?.lessons[0] && (
                    <Link href={`/academy/courses/${slug}/${modules[0].lessons[0].id}`} style={{ display: "block", background: C.gold, color: "#0f1b36", fontWeight: 800, fontSize: 13, padding: "10px 24px", borderRadius: 8, textDecoration: "none", textAlign: "center" }}>
                      {completedLessons === 0 ? "Start course" : "Continue →"}
                    </Link>
                  )}
                </div>
              ) : (
                <button onClick={enroll} disabled={enrolling} style={{ background: C.gold, color: "#0f1b36", fontWeight: 800, fontSize: 14, padding: "12px 28px", borderRadius: 8, border: "none", cursor: "pointer", opacity: enrolling ? 0.6 : 1 }}>
                  {enrolling ? "Enrolling…" : course.is_free ? "Enrol free" : !user ? "Sign in to enrol" : !hasSub ? "Subscribe to enrol" : "Enrol now"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "36px 24px" }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.01em", marginBottom: 20 }}>Course curriculum</h2>
        {modules.length === 0 ? (
          <p style={{ color: C.ink3, fontSize: 13 }}>Curriculum coming soon.</p>
        ) : modules.map((mod, mi) => (
          <div key={mod.id} style={{ marginBottom: 12, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: mod.lessons.length > 0 ? `1px solid ${C.border}` : "none" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>
                <span style={{ color: C.ink3, marginRight: 8 }}>Module {mi + 1}</span>
                {mod.title}
              </p>
            </div>
            {mod.lessons.map((lesson, li) => {
              const done = progress[lesson.id];
              const canAccess = enrolled || lesson.is_free || course.is_free;
              return (
                <div key={lesson.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 20px", borderBottom: li < mod.lessons.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: done ? C.green : "rgba(255,255,255,0.06)", border: `1px solid ${done ? C.green : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {done && <span style={{ fontSize: 11, color: "white" }}>✓</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    {canAccess ? (
                      <Link href={`/academy/courses/${slug}/${lesson.id}`} style={{ fontSize: 13, color: done ? C.ink2 : C.ink, textDecoration: "none", fontWeight: done ? 400 : 500 }}>
                        {lesson.title}
                      </Link>
                    ) : (
                      <span style={{ fontSize: 13, color: C.ink3 }}>🔒 {lesson.title}</span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {lesson.is_free && !course.is_free && (
                      <span style={{ fontSize: 10, color: C.green, fontWeight: 700, background: "rgba(34,197,94,0.1)", padding: "2px 8px", borderRadius: 10 }}>Free preview</span>
                    )}
                    {lesson.duration_min && (
                      <span style={{ fontSize: 11, color: C.ink3 }}>{lesson.duration_min}m</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
