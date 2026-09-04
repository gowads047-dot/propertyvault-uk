import { NextResponse } from "next/server";
import { RULES, rateGuard } from "@/lib/rate-limit";
import { createClient } from "@supabase/supabase-js";

const sb = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// GET — validate a token and return invite info
export async function GET(req: Request) {
  const limited = await rateGuard(req, RULES.lookupPerCaller, RULES.lookupGlobal);
  if (limited) {
    return NextResponse.json({ error: limited.error }, { status: limited.status });
  }

  const supabase = sb();
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token) return NextResponse.json({ valid: false });

  const { data: invite } = await supabase.from("tenant_invites").select("email, tenant_name, accepted_at, property_id, landlord_user_id, phone").eq("token", token).maybeSingle();
  if (!invite) return NextResponse.json({ valid: false });

  // Parallel: property + landlord name
  const [propRes, landlordRes] = await Promise.all([
    invite.property_id ? supabase.from("rentura_properties").select("address").eq("id", invite.property_id).maybeSingle() : Promise.resolve({ data: null }),
    invite.landlord_user_id ? supabase.from("rentura_subscriptions").select("name").eq("user_id", invite.landlord_user_id).maybeSingle() : Promise.resolve({ data: null }),
  ]);

  return NextResponse.json({
    valid: true,
    email: invite.email,
    tenant_name: invite.tenant_name,
    accepted: !!invite.accepted_at,
    property_address: propRes.data?.address || "",
    landlord_name: landlordRes.data?.name || "Your landlord",
    phone: invite.phone || null,
  });
}

// PATCH — mark invite as accepted with auth ID
export async function PATCH(req: Request) {
  // The GET was metered and this was not. It is the handler that writes —
  // binding an auth id to an invite — so it is the one that mattered more.
  const limited = await rateGuard(req, RULES.lookupPerCaller, RULES.lookupGlobal);
  if (limited) {
    return NextResponse.json({ error: limited.error }, { status: limited.status });
  }

  const supabase = sb();
  const { token, authId } = await req.json();
  if (!token || !authId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  await supabase.from("tenant_invites").update({ tenant_auth_id: authId, accepted_at: new Date().toISOString() }).eq("token", token);
  return NextResponse.json({ ok: true });
}
