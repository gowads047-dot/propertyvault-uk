import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isAdmin } from "@/lib/admin";

/**
 * Answers "is the signed-in user the admin?" without telling the browser who
 * the admin is.
 *
 * The admin pages are client components that used to decide this themselves by
 * comparing the session email against a constant — which meant the owner's
 * personal address shipped inside the JavaScript bundle. Asking the server
 * instead keeps the address on the server and returns only a boolean.
 *
 * This gates the interface, not the data. Every admin page reads through
 * Supabase with the anon key, so row level security remains the real boundary,
 * and /api/admin/users re-checks with the same helper before touching the
 * service role key.
 */
export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { session } } = await supabase.auth.getSession();

  return NextResponse.json(
    { admin: isAdmin(session?.user?.email) },
    // Per-user answer tied to a session cookie; must never be cached or shared.
    { headers: { "Cache-Control": "no-store, private" } }
  );
}
