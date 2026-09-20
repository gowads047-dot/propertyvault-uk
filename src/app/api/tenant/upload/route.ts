import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { RULES, rateGuard } from "@/lib/rate-limit";
import { ALLOWED, BUCKET, MAX_BYTES } from "@/lib/tenant-upload";

/**
 * Tenant issue attachments: a signed upload slot.
 *
 * The tenant portal is token-based — the tenant is not a Supabase user — so
 * the browser cannot write to storage on its own: the anon role has no
 * insert policy on the bucket (and the bucket did not exist). Both issue
 * pages uploaded straight from the client and dropped the file without a
 * word when it failed.
 *
 * The file itself does not pass through here: a Vercel function body is
 * capped at 4.5 MB and a video of a leak is bigger than that. The invite
 * token is checked, the service key mints a signed upload URL for one
 * path, and the browser puts the file straight into storage with it.
 */
export async function POST(req: Request) {
  const limited = await rateGuard(req, RULES.uploadPerCaller, RULES.uploadGlobal);
  if (limited) return NextResponse.json({ error: limited.error }, { status: limited.status });

  let body: { token?: unknown; type?: unknown; size?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Expected JSON." }, { status: 400 });
  }
  const { token, type, size } = body;
  if (typeof token !== "string" || !token || typeof type !== "string" || typeof size !== "number") {
    return NextResponse.json({ error: "Missing token, type or size." }, { status: 400 });
  }
  const ext = ALLOWED[type];
  if (!ext) return NextResponse.json({ error: "Photos, videos (MP4, MOV, WebM) and PDFs only." }, { status: 415 });
  if (size > MAX_BYTES) return NextResponse.json({ error: "Files must be under 50 MB." }, { status: 413 });

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data: invite } = await supabase.from("tenant_invites").select("property_id").eq("token", token).maybeSingle();
  if (!invite) return NextResponse.json({ error: "Invalid token" }, { status: 403 });

  const path = `${invite.property_id}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path);
  if (error || !data) {
    console.error("tenant/upload: could not sign an upload:", error?.message);
    return NextResponse.json({ error: "Could not prepare the upload. Please try again." }, { status: 502 });
  }
  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ path, uploadToken: data.token, url: pub.publicUrl });
}
