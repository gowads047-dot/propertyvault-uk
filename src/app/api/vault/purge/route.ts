import { NextResponse } from "next/server";
import { authorizeCron } from "@/lib/cron-auth";

/**
 * Deleting anonymous properties nobody came back for.
 *
 * pv_purge_unclaimed() has been in the schema since the migration: it removes
 * properties held only by a claim token that have not been touched in 90 days.
 * Nothing called it. That was harmless while nothing wrote rows; now that the
 * Vault and the agent both save, it is a retention promise written into the
 * database and never kept.
 *
 * The function is granted to service_role only and does the deleting itself,
 * so this route holds no policy — it just runs on a schedule and reports what
 * went. Anything still held by a signed-in user is untouched: the function
 * only matches rows where claim_token is not null.
 */

export const maxDuration = 60;

export async function GET(req: Request) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  try {
    const res = await fetch(`${url}/rest/v1/rpc/pv_purge_unclaimed`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: "{}",
    });
    if (!res.ok) throw new Error(`purge ${res.status}: ${(await res.text()).slice(0, 200)}`);

    const deleted = await res.json();
    return NextResponse.json({
      deleted: typeof deleted === "number" ? deleted : 0,
      retentionDays: 90,
    });
  } catch (err) {
    // Upstream messages carry connection details.
    console.error("vault purge failed:", err);
    return NextResponse.json({ error: "Purge failed." }, { status: 502 });
  }
}
