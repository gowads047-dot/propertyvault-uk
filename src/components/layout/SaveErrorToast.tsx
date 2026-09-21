"use client";

import { useEffect, useState } from "react";
import { WRITE_ERROR_EVENT, type WriteError } from "@/lib/supabase-fetch";

/**
 * "That did not save" — for every write in the app that never looks at
 * the error it is handed back.
 *
 * Sixty-odd inserts, updates and deletes across Rentura, Makan and the
 * Academy fire and forget. When Postgres refuses one (a column that is not
 * there, a policy that says no), the page carries on as if it had worked
 * and the person finds out later, or never. The Supabase client announces
 * a refused write on the window; this shows it, once, for eight seconds,
 * with PostgREST's own words, in whichever app layout mounts it.
 */
const SHOW_MS = 8000;

export function SaveErrorToast() {
  const [err, setErr] = useState<WriteError | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onError = (e: Event) => {
      const detail = (e as CustomEvent<WriteError>).detail;
      if (!detail) return;
      setErr(detail);
      clearTimeout(timer);
      timer = setTimeout(() => setErr(null), SHOW_MS);
    };
    window.addEventListener(WRITE_ERROR_EVENT, onError);
    return () => {
      window.removeEventListener(WRITE_ERROR_EVENT, onError);
      clearTimeout(timer);
    };
  }, []);

  if (!err) return null;
  const table = err.path.split("/").filter(Boolean).pop() ?? "";
  return (
    <div
      role="alert"
      style={{
        position: "fixed", left: 16, right: 16, bottom: 16, zIndex: 9999, margin: "0 auto", maxWidth: 520,
        background: "#7f1d1d", color: "#fff", borderRadius: 12, padding: "12px 16px", fontSize: 13, lineHeight: 1.5,
        boxShadow: "0 8px 24px rgba(0,0,0,0.25)", display: "flex", gap: 12, alignItems: "flex-start",
      }}
    >
      <div style={{ flex: 1 }}>
        <strong style={{ display: "block", fontWeight: 700 }}>That change did not save{table ? ` (${table.replace(/_/g, " ")})` : ""}.</strong>
        <span style={{ opacity: 0.9 }}>{err.message}</span>
      </div>
      <button
        type="button"
        onClick={() => setErr(null)}
        aria-label="Dismiss"
        style={{ background: "transparent", border: "none", color: "#fff", fontSize: 18, lineHeight: 1, cursor: "pointer", padding: 0 }}
      >
        ×
      </button>
    </div>
  );
}
