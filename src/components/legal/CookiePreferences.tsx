"use client";

import { useEffect, useState } from "react";

/**
 * Change your mind about analytics cookies.
 *
 * /cookies told visitors they could "change your preferences at any time by
 * clicking Cookie Settings". There was no Cookie Settings anywhere on the
 * site, and no way to withdraw consent short of clearing site data. UK GDPR
 * art 7(3) requires withdrawing to be as easy as giving, so this is the
 * control that sentence was describing.
 *
 * It writes the same localStorage key the banner uses and calls the same
 * Consent Mode update, so the two cannot disagree.
 */

type Choice = "all" | "essential" | null;

export function CookiePreferences() {
  const [choice, setChoice] = useState<Choice>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem("cookie_consent");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is unavailable during render; reading it in an initialiser causes a hydration mismatch
      if (v === "all" || v === "essential") setChoice(v);
    } catch {
      // Private mode, or site data blocked. Leaving choice null shows the
      // "not chosen yet" state, which is the safe reading.
    }
  }, []);

  function set(next: Exclude<Choice, null>) {
    try {
      localStorage.setItem("cookie_consent", next);
    } catch {
      // If it cannot be stored the consent update below still applies for
      // this page view, and the banner will ask again next time.
    }
    window.gtag?.("consent", "update", {
      analytics_storage: next === "all" ? "granted" : "denied",
    });
    setChoice(next);
    setSaved(true);
  }

  const current =
    choice === "all"
      ? "Analytics cookies are on."
      : choice === "essential"
        ? "Analytics cookies are off. Only essential cookies are in use."
        : "You have not chosen yet. Until you do, analytics cookies stay off.";

  return (
    <div className="rounded-xl border border-navy-200 bg-navy-50 p-5 not-prose">
      <h3 className="text-lg font-bold text-navy-800 mb-1">Cookie settings</h3>
      <p role="status" className="text-sm text-navy-600 mb-4">
        {current}
        {saved && <span className="text-gold-700 font-semibold"> Saved.</span>}
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => set("essential")}
          aria-pressed={choice === "essential"}
          className={`px-5 py-2.5 text-sm font-semibold rounded-lg border transition-colors ${
            choice === "essential"
              ? "bg-navy-800 text-white border-navy-800"
              : "border-navy-300 text-navy-700 hover:bg-white"
          }`}
        >
          Essential only
        </button>
        <button
          type="button"
          onClick={() => set("all")}
          aria-pressed={choice === "all"}
          className={`px-5 py-2.5 text-sm font-semibold rounded-lg border transition-colors ${
            choice === "all"
              ? "bg-gold-400 text-navy-900 border-gold-400"
              : "border-navy-300 text-navy-700 hover:bg-white"
          }`}
        >
          Allow analytics
        </button>
      </div>
    </div>
  );
}
