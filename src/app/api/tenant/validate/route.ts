import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const sb = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// GET — validate a token and return invite info
export async function GET(req: Request) {
  const supabase = sb();
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token) return NextResponse.json({ valid: false });

  const { data: invite } = await supabase.from("tenant_invites").select("email, tenant_name, accepted_at, property_id").eq("token", token).maybeSingle();
  if (!invite) return NextResponse.json({ valid: false });

  // Fetch property address
  let property_address = "";
  if (invite.property_id) {
    const { data: prop } = await supabase.from("rentura_properties").select("address").eq("id", invite.property_id).maybeSingle();
    property_address = prop?.address || "";
  }

  return NextResponse.json({ valid: true, email: invite.email, tenant_name: invite.tenant_name, accepted: !!invite.accepted_at, property_address });
}

// PATCH — mark invite as accepted with auth ID
export async function PATCH(req: Request) {
  const supabase = sb();
  const { token, authId } = await req.json();
  if (!token || !authId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  await supabase.from("tenant_invites").update({ tenant_auth_id: authId, accepted_at: new Date().toISOString() }).eq("token", token);
  return NextResponse.json({ ok: true });
}
