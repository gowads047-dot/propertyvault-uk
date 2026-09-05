"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

/**
 * Records that a page was actually looked at.
 *
 * A pageview in GA counts the load. This counts a service being seen, tagged
 * with which one — the difference between knowing traffic exists and knowing
 * which of eleven services anybody wants. It renders nothing, so it can sit
 * inside a server component without making the page a client component.
 *
 * The ref is not belt-and-braces. React StrictMode deliberately mounts, tears
 * down and remounts every effect in development, so the first version of this
 * sent service_viewed twice — verified in the browser, two identical events on
 * one navigation. That is only development behaviour, but a metric that counts
 * double in one environment and single in another is worse than no metric: it
 * halves every conversion rate computed against it, and nothing about the
 * number itself reveals which environment produced it.
 *
 * Keying on the event and params means a client-side navigation to a different
 * service still fires, because the component is remounted with a new key.
 */
export function TrackView({
  event,
  params,
}: {
  event: string;
  params?: Record<string, string | number | boolean | undefined>;
}) {
  const sent = useRef<string | null>(null);

  useEffect(() => {
    const key = `${event}:${JSON.stringify(params ?? {})}`;
    if (sent.current === key) return;
    sent.current = key;
    track(event, params);
    // params is serialised into the key rather than compared by identity — a
    // fresh object literal on every render would otherwise re-fire the event.
  }, [event, JSON.stringify(params ?? {})]);

  return null;
}
