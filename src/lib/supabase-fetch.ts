import { reportClientError } from "@/lib/error-beacon";

/**
 * The fetch the browser's Supabase client goes through.
 *
 * supabase-js hands errors back as values, and most of this app's writes
 * never look: seven statements naming columns and policies production does
 * not have failed silently for months (#189, #190), because nothing threw
 * and nothing was logged. This sees every PostgREST and storage response
 * the anon client gets; a failure is reported to /api/errors/ with the
 * method, the path and PostgREST's own message, so it shows up on
 * /rentura/admin/errors/ the first time it happens rather than never.
 *
 * Left out: auth (a lapsed session refreshing is not a bug), and 406, which
 * is .single() finding no row — a "not found" page, not a broken query.
 * The query string is dropped from the report because filters carry
 * values (an email in `eq.`, say).
 *
 * A refused write is also announced on the window as a "supabase:write-error"
 * event, with PostgREST's message, so the page can tell the person their
 * change did not save. Sixty-odd writes in the app never read the error
 * they were handed back; one listener in each app layout covers them all.
 */
export const WRITE_ERROR_EVENT = "supabase:write-error";
export type WriteError = { method: string; path: string; status: number; message: string };

/** PostgREST's own message out of an error body, or the status if there is none. */
export function postgrestMessage(body: string, status: number): string {
  try {
    const j = JSON.parse(body) as { message?: unknown; error?: unknown; msg?: unknown };
    const m = [j.message, j.error, j.msg].find((v) => typeof v === "string" && v.trim());
    if (typeof m === "string") return m.trim().slice(0, 200);
  } catch {
    // Not JSON; fall through.
  }
  return `HTTP ${status}`;
}

export async function reportingFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const res = await fetch(input, init);
  if (res.status < 400 || res.status === 406 || typeof window === "undefined") return res;
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  if (!/\/(rest|storage)\/v1\//.test(url)) return res;
  let detail = "";
  try {
    detail = (await res.clone().text()).slice(0, 500);
  } catch {
    // The body is a nicety; the status and path are the report.
  }
  const path = url.replace(/^https?:\/\/[^/]+/, "").replace(/\?.*$/, "");
  const method = (init?.method ?? "GET").toUpperCase();
  reportClientError(new Error(`${method} ${path} → ${res.status} ${detail}`.trim()), "supabase");
  if (method !== "GET" && method !== "HEAD") {
    const ev: WriteError = { method, path, status: res.status, message: postgrestMessage(detail, res.status) };
    window.dispatchEvent(new CustomEvent(WRITE_ERROR_EVENT, { detail: ev }));
  }
  return res;
}
