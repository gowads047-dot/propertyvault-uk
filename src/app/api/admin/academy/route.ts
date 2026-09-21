import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getVerifiedUser } from "@/lib/server-auth";
import { isAdmin } from "@/lib/admin";

/**
 * The Academy admin page's data, read with the service key.
 *
 * The page read academy_members, academy_courses and academy_enrollments
 * with the admin's own session. Row-level security answers that the way
 * it answers any member: your own membership row, your own enrolments,
 * and only the courses that are published. So the members table showed
 * one row, unpublished courses were invisible, and the publish toggle —
 * an update on a table with a select-only policy — was refused every
 * time. Same shape as the other admin routes: verified session, admin
 * address, then the service key.
 */
function admin(userEmail: string | null | undefined): boolean {
  return isAdmin(userEmail ?? undefined);
}

export async function GET(request: Request) {
  const user = await getVerifiedUser(request);
  if (!user || !admin(user.email)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = sb();
  const [members, courses, enrollments] = await Promise.all([
    supabase.from("academy_members").select("user_id, status, joined_at, stripe_customer_id, current_period_end").order("joined_at", { ascending: false }),
    supabase.from("academy_courses").select("id, title, category, difficulty, lesson_count, is_free, is_published, sort_order").order("sort_order"),
    supabase.from("academy_enrollments").select("id, enrolled_at, completed_at, course:academy_courses(title)").order("enrolled_at", { ascending: false }).limit(100),
  ]);
  const failed = [members.error, courses.error, enrollments.error].find(Boolean);
  if (failed) return NextResponse.json({ error: failed.message }, { status: 500 });

  return NextResponse.json({ members: members.data ?? [], courses: courses.data ?? [], enrollments: enrollments.data ?? [] });
}

export async function PATCH(request: Request) {
  const user = await getVerifiedUser(request);
  if (!user || !admin(user.email)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as { id?: unknown; is_published?: unknown };
  if (typeof body.id !== "string" || !body.id || typeof body.is_published !== "boolean") {
    return NextResponse.json({ error: "id and is_published required" }, { status: 400 });
  }
  const { error } = await sb().from("academy_courses").update({ is_published: body.is_published }).eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// Below the handlers on purpose: server-auth.test.ts holds every admin route
// to verifying the caller before the service key is so much as named.
const sb = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
