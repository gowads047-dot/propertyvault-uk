/**
 * Recording an error where it can be read later.
 *
 * Vercel's function log is where errors went, and it is gone in a day and
 * readable only in the dashboard. app_errors is a table in the same
 * database as everything else: the server writes to it from
 * instrumentation.ts, the browser through /api/errors/, and
 * /rentura/admin/errors/ reads it. No vendor, no key, no SDK in the
 * bundle. If the site ever outgrows a table — sampling, alerting, source
 * maps — that is the moment for Sentry, and this is the code to swap.
 *
 * Written with the service key straight to PostgREST rather than through
 * supabase-js, so the server hook stays light and has nothing to import
 * that could itself throw. Never throws: an error in reporting an error
 * goes to console.error and stops there.
 */
export type ErrorReport = {
  side: "server" | "client";
  message: string;
  stack?: string | null;
  digest?: string | null;
  path?: string | null;
  method?: string | null;
  router?: string | null;
  route_type?: string | null;
  user_agent?: string | null;
  meta?: Record<string, unknown> | null;
};

const LIMITS = { message: 1000, stack: 8000, path: 500, user_agent: 400 } as const;

export function clip(value: unknown, max: number): string | null {
  if (value == null) return null;
  const s = String(value);
  return s.length > max ? s.slice(0, max) + "…" : s;
}

/** What to record about a thrown value. */
export function describeError(err: unknown): { message: string; stack: string | null; digest: string | null } {
  const e = err as { message?: unknown; stack?: unknown; digest?: unknown } | null;
  const message = err instanceof Error ? err.message : typeof e?.message === "string" ? e.message : String(err);
  return {
    message: clip(message || "(no message)", LIMITS.message)!,
    stack: clip(err instanceof Error ? err.stack : typeof e?.stack === "string" ? e.stack : null, LIMITS.stack),
    digest: clip(typeof e?.digest === "string" ? e.digest : null, 100),
  };
}

export async function recordError(report: ErrorReport): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return false;
  const row = {
    side: report.side,
    message: clip(report.message, LIMITS.message) ?? "(no message)",
    stack: clip(report.stack, LIMITS.stack),
    digest: clip(report.digest, 100),
    path: clip(report.path, LIMITS.path),
    method: clip(report.method, 10),
    router: clip(report.router, 20),
    route_type: clip(report.route_type, 30),
    user_agent: clip(report.user_agent, LIMITS.user_agent),
    meta: report.meta ?? null,
  };
  try {
    const res = await fetch(`${url}/rest/v1/app_errors`, {
      method: "POST",
      headers: {
        apikey: key,
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
        prefer: "return=minimal",
      },
      body: JSON.stringify(row),
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) {
      console.error(`app_errors insert failed: ${res.status}${res.status === 404 ? " — run supabase/app-errors.sql" : ""}`);
      return false;
    }
    return true;
  } catch (e) {
    console.error("app_errors insert failed:", e);
    return false;
  }
}
