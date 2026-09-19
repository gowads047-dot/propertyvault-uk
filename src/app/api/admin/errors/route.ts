import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getVerifiedUser } from "@/lib/server-auth";
import { isAdmin } from "@/lib/admin";

/**
 * The last hundred errors, for /rentura/admin/errors/. Same gate as the
 * enquiries: a verified session whose address is the admin's. Stacks
 * carry file paths and upstream messages, so never cached.
 */
export const dynamic = "force-dynamic";

const SELECT = "id,ts,side,message,stack,digest,path,method,route_type,user_agent";

export async function GET(request: Request) {
  const user = await getVerifiedUser(request);
  if (!user || !isAdmin(user.email ?? undefined)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "This is temporarily unavailable." }, { status: 503 });
  }

  const asked = Number(new URL(request.url).searchParams.get("limit") ?? 100);
  const limit = Number.isFinite(asked) ? Math.min(Math.max(asked, 1), 500) : 100;

  const { data, error } = await createClient(url, key)
    .from("app_errors")
    .select(SELECT)
    .order("ts", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("app_errors read failed:", error.message);
    const missing = error.code === "42P01" || /app_errors/.test(error.message);
    return NextResponse.json(
      { error: missing ? "The app_errors table does not exist yet — run supabase/app-errors.sql." : "Could not read the errors." },
      { status: 502 },
    );
  }

  return NextResponse.json({ errors: data ?? [] }, { headers: { "Cache-Control": "no-store, private" } });
}
