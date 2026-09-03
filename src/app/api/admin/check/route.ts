import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { getVerifiedUser } from "@/lib/server-auth";

/**
 * Answers "is the signed-in user the admin?" without telling the browser who
 * the admin is.
 *
 * The admin pages are client components that used to decide this themselves by
 * comparing the session email against a constant — which meant the owner's
 * personal address shipped inside the JavaScript bundle. Asking the server
 * instead keeps the address on the server and returns only a boolean.
 *
 * The identity comes from getVerifiedUser, not getSession: the latter reads
 * the request cookie without checking the token against the auth server, so
 * the email it returns is a claim the client made about itself.
 *
 * This gates the interface, not the data. Every admin page reads through
 * Supabase with the anon key, so row level security remains the real boundary,
 * and /api/admin/users re-checks with the same helper before touching the
 * service role key.
 */
export async function GET() {
  const user = await getVerifiedUser();

  return NextResponse.json(
    { admin: isAdmin(user?.email ?? undefined) },
    // Per-user answer tied to a session cookie; must never be cached or shared.
    { headers: { "Cache-Control": "no-store, private" } },
  );
}
