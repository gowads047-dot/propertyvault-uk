"use client";

import { useEffect, useState } from "react";

/**
 * Asks the server whether the signed-in user is the admin.
 *
 * The admin pages used to compare the session email against a constant in the
 * page itself, which put the owner's personal address into the browser bundle.
 * The answer now comes back as a boolean and the address never leaves the
 * server.
 *
 * Returns `null` while unresolved, so a caller can hold off redirecting rather
 * than bouncing a genuine admin out on the first render.
 */
export function useIsAdmin(enabled = true): boolean | null {
  const [admin, setAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    fetch("/api/admin/check")
      .then(r => (r.ok ? r.json() : { admin: false }))
      .then(d => {
        if (!cancelled) setAdmin(Boolean(d.admin));
      })
      // A failed check must not open the door.
      .catch(() => {
        if (!cancelled) setAdmin(false);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return admin;
}
