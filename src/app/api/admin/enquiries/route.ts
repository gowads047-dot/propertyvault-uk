import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getVerifiedUser } from "@/lib/server-auth";
import { isAdmin } from "@/lib/admin";

/**
 * Reading the enquiries.
 *
 * /api/contact writes every enquiry to contact_messages and then emails a
 * notification, in that order, and says why in a comment: "The enquiry is
 * saved. It can be picked up from contact_messages." That was a promise the
 * codebase could not keep. The table's policies are anon INSERT and
 * service_role SELECT, and nothing in the application read it — so an enquiry
 * whose email failed was recorded somewhere unreachable, which is the same as
 * lost while being harder to notice.
 *
 * Every enquiry on the site funnels here: the contact form, the guaranteed
 * rent enquiries, and every service waitlist. It is the only route a customer
 * has to this business.
 *
 * The table is empty today, which is worth stating plainly — that was checked,
 * and it reflects no enquiries rather than a broken form. The anon INSERT
 * policy and grant are both present, so the write path works. This exists so
 * that the first real enquiry is visible somewhere other than an inbox.
 */

export const dynamic = "force-dynamic";

/** Enough to triage from, and no more. */
const SELECT = "id,name,email,subject,message,source,details,created_at";

export async function GET(request: Request) {
  // Verified against the auth server rather than read from the cookie: this
  // decides whether the service role key gets used.
  const user = await getVerifiedUser();
  if (!user || !isAdmin(user.email ?? undefined)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "This is temporarily unavailable." }, { status: 503 });
  }

  // Bounded, and bounded by the server rather than by whatever the caller
  // asks for — an admin page is still a page, and "all of them" stops being a
  // sensible response the moment this table has a year of enquiries in it.
  const asked = Number(new URL(request.url).searchParams.get("limit") ?? 200);
  const limit = Number.isFinite(asked) ? Math.min(Math.max(asked, 1), 500) : 200;

  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from("contact_messages")
    .select(SELECT)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    // Postgres messages carry connection strings and row contents.
    console.error("enquiry read failed:", error.message);
    return NextResponse.json({ error: "Could not read the enquiries." }, { status: 502 });
  }

  return NextResponse.json(
    { enquiries: data ?? [] },
    // Somebody's name, email and message. Never cached, never shared.
    { headers: { "Cache-Control": "no-store, private" } },
  );
}
