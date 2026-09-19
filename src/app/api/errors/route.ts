import { NextResponse } from "next/server";
import { RULES, rateGuard } from "@/lib/rate-limit";
import { recordError, clip } from "@/lib/error-report";

/**
 * Where the browser reports an error it could not handle.
 *
 * The error boundaries and the window-level beacon post here. Anonymous by
 * design — an error in a page nobody signed in to is the common case — so
 * it is bounded instead: a small allowed shape, sizes clipped, and the rate
 * limiter in front so a script cannot fill the table. Always answers
 * 204 or an error status; never the row.
 */
export async function POST(req: Request) {
  const limited = await rateGuard(req, RULES.errorReportPerCaller, RULES.errorReportGlobal);
  if (limited) return NextResponse.json({ error: limited.error }, { status: limited.status });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const message = clip(body.message, 1000);
  if (!message || typeof body.message !== "string") {
    return NextResponse.json({ error: "message is required." }, { status: 400 });
  }

  const ok = await recordError({
    side: "client",
    message,
    stack: typeof body.stack === "string" ? body.stack : null,
    digest: typeof body.digest === "string" ? body.digest : null,
    path: typeof body.path === "string" ? body.path : null,
    method: "GET",
    router: "App Router",
    route_type: typeof body.kind === "string" ? clip(body.kind, 30) : "browser",
    user_agent: req.headers.get("user-agent"),
    meta: null,
  });
  return ok ? new Response(null, { status: 204 }) : NextResponse.json({ error: "Not recorded." }, { status: 503 });
}
