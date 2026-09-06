import { NextResponse } from "next/server";
import { authorizeCron } from "@/lib/cron-auth";
import { storeFromEnv, type SocialStore } from "@/lib/social/db";
import { queueHealth } from "@/lib/social/health";

/**
 * Queue health, for a person with the cron secret.
 *
 *   curl -H "Authorization: Bearer $CRON_SECRET" https://www.propertyvaultuk.co.uk/api/social/status
 *
 * Not a cron. Same authorisation because the answer includes internal error
 * messages and post ids, none of which belong on a public URL.
 */
export async function GET(req: Request) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const s = storeFromEnv();
  if ("error" in s) {
    return NextResponse.json({ error: s.error }, { status: 500 });
  }
  return statusWith(s.store, new Date());
}

export async function statusWith(store: SocialStore, now: Date) {
  const health = await queueHealth({ db: store, now });
  return NextResponse.json({
    ...health,
    tokenStored: Boolean(await store.getSetting("ig_access_token")),
    tokenInEnv: Boolean(process.env.INSTAGRAM_ACCESS_TOKEN),
  });
}
