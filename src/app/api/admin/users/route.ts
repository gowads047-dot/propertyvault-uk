import { NextResponse } from "next/server";
import { getVerifiedUser } from "@/lib/server-auth";
import { createClient } from "@supabase/supabase-js";
import { isAdmin } from "@/lib/admin";


export async function GET() {
  // Verified against the auth server, not read out of the request cookie:
  // this decides whether the service role key gets used.
  const user = await getVerifiedUser();
  if (!user || !isAdmin(user.email ?? undefined)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 200 });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const users = (data.users || []).map(u => ({
    id: u.id,
    email: u.email || "",
    name: u.user_metadata?.full_name || u.user_metadata?.name || null,
    created_at: u.created_at,
    confirmed: !!u.email_confirmed_at,
  }));

  return NextResponse.json({ users });
}
