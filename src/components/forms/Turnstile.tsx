"use client";

import { useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile widget, rendered inside a form.
 *
 * Renders nothing until NEXT_PUBLIC_TURNSTILE_SITE_KEY is set, so the site
 * behaves exactly as before on an environment without it. With the key,
 * Cloudflare's script is loaded once (from challenges.cloudflare.com, which
 * the Content-Security-Policy already names) and the widget adds a hidden
 * <input name="cf-turnstile-response"> to the enclosing form. A form that
 * reads FormData gets the token for free; one that builds JSON reads it
 * with turnstileToken(form). The server side is lib/turnstile.ts.
 */
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js";

declare global {
  interface Window {
    turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => string; remove: (id: string) => void };
  }
}

let loading: Promise<void> | null = null;
function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (!loading) {
    loading = new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = `${SCRIPT}?render=explicit`;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Turnstile script failed to load"));
      document.head.appendChild(s);
    });
  }
  return loading;
}

export function Turnstile({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!SITE_KEY || !ref.current) return;
    const el = ref.current;
    let id: string | null = null;
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !window.turnstile) return;
        id = window.turnstile.render(el, { sitekey: SITE_KEY, theme: "auto", size: "flexible" });
      })
      .catch(err => console.error(err));
    return () => {
      cancelled = true;
      if (id && window.turnstile) window.turnstile.remove(id);
    };
  }, []);

  if (!SITE_KEY) return null;
  return <div ref={ref} className={className} />;
}

/** The token the widget put in the form, for a handler that sends JSON. */
export function turnstileToken(form: HTMLFormElement | null): string | undefined {
  const input = form?.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]');
  return input?.value || undefined;
}
