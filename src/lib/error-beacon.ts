/**
 * Browser side of error tracking: send what went wrong to /api/errors/.
 *
 * Called by the error boundaries with the error they caught, and by the
 * window-level listeners for anything that reached no boundary — an
 * uncaught exception in an event handler, an unhandled promise rejection.
 * A few per page load at most, the same error once, and never anything
 * from a browser extension's own scripts. sendBeacon so it goes even as
 * the page unloads.
 */
const MAX_PER_PAGE = 5;
let sent = 0;
const seen = new Set<string>();

export function reportClientError(err: unknown, kind: string): void {
  if (typeof window === "undefined" || sent >= MAX_PER_PAGE) return;
  const e = err as { message?: unknown; stack?: unknown; digest?: unknown } | null;
  const message = err instanceof Error ? err.message : typeof e?.message === "string" ? e.message : String(err ?? "unknown");
  const stack = err instanceof Error ? err.stack : typeof e?.stack === "string" ? e.stack : undefined;
  // Extensions inject scripts from their own origin; their failures are not ours.
  if (stack && /(chrome|moz|safari)-extension:\/\//.test(stack)) return;
  const key = `${kind}|${message}`;
  if (seen.has(key)) return;
  seen.add(key);
  sent++;
  const payload = JSON.stringify({
    message: message.slice(0, 1000),
    stack: stack?.slice(0, 8000),
    digest: typeof e?.digest === "string" ? e.digest : undefined,
    path: window.location.pathname + window.location.search,
    kind,
  });
  try {
    if (!navigator.sendBeacon?.("/api/errors/", new Blob([payload], { type: "application/json" }))) {
      void fetch("/api/errors/", { method: "POST", headers: { "content-type": "application/json" }, body: payload, keepalive: true });
    }
  } catch {
    // Reporting must never be the thing that breaks.
  }
}

/** Installed once from the root layout. */
export function installErrorBeacon(): () => void {
  const onError = (ev: ErrorEvent) => {
    // A cross-origin script error arrives as "Script error." with nothing
    // else; recording it tells nobody anything.
    if (ev.message === "Script error." && !ev.error) return;
    reportClientError(ev.error ?? ev.message, "window.onerror");
  };
  const onRejection = (ev: PromiseRejectionEvent) => reportClientError(ev.reason, "unhandledrejection");
  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onRejection);
  return () => {
    window.removeEventListener("error", onError);
    window.removeEventListener("unhandledrejection", onRejection);
  };
}
