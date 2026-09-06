"use client";

import { useState, useEffect } from "react";
import { track, events } from "@/lib/analytics";

export function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  // Whether the starter pack actually sent, so the success copy stays honest.
  const [emailed, setEmailed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("newsletter_dismissed");
    if (dismissed) return;
    const timer = setTimeout(() => {
      setVisible(true);
      track(events.signupShown, { placement: "popup" });
    }, 60000);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    track(events.signupDismissed, { placement: "popup" });
    setVisible(false);
    localStorage.setItem("newsletter_dismissed", "true");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    track(events.signupSubmitted, { placement: "popup" });

    try {
      const res = await fetch("/api/subscribe/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, user_type: userType || null }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        track(events.signupFailed, { placement: "popup", reason: "server" });
        return;
      }

      setEmailed(Boolean(data.emailed));
      setStatus("success");
      track(events.signupSucceeded, { placement: "popup", emailed: Boolean(data.emailed) });
      localStorage.setItem("newsletter_dismissed", "true");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
      track(events.signupFailed, { placement: "popup", reason: "network" });
    }
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
      onClick={status !== "success" ? dismiss : undefined}
    >
      <div
        className="bg-navy-900 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {status !== "success" && (
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 text-navy-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {status === "success" ? (
          <div className="text-center py-4">
            <span className="text-4xl block mb-4">🎉</span>
            <h3 className="text-xl font-extrabold text-white mb-2" style={{ fontFamily: "var(--font-family-heading)" }}>
              You&apos;re in!
            </h3>
            {/* Only promise an inbox delivery when one actually happened. The
                subscriber is saved either way, but "check your inbox" when
                nothing was sent is a promise we would not keep. */}
            <p className="text-navy-300 text-sm mb-6">
              {emailed
                ? "Check your inbox — your free property starter pack is on its way."
                : "We have your details and will send your starter pack shortly."}
            </p>
            <button
              onClick={dismiss}
              className="bg-gold-400 text-navy-900 font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-gold-300 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-5">
              <span className="text-3xl block mb-3">📬</span>
              <h3 className="text-xl font-extrabold text-white" style={{ fontFamily: "var(--font-family-heading)" }}>
                Free Property Starter Pack
              </h3>
              <p className="text-sm text-navy-300 mt-2">
                Get our best calculator links, top guides, and a landlord compliance checklist — delivered straight to your inbox. Free, no spam.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Your first name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-navy-800 border border-navy-600 rounded-xl text-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-gold-400 text-sm"
              />
              <input
                type="email"
                placeholder="Your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-navy-800 border border-navy-600 rounded-xl text-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-gold-400 text-sm"
              />

              <div>
                <p className="text-xs text-navy-400 mb-2 font-medium">I am a...</p>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {["Landlord", "Investor", "First-Time Buyer", "Agent", "Other"].map((type) => (
                    <label key={type} className="flex items-center gap-1.5 text-xs text-navy-300 cursor-pointer">
                      <input
                        type="radio"
                        name="user_type"
                        value={type}
                        checked={userType === type}
                        onChange={() => setUserType(type)}
                        className="accent-gold-400"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-red-400 font-medium">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-gold-400 text-navy-900 font-bold text-sm py-3.5 rounded-xl hover:bg-gold-300 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Sending…" : "Send Me the Free Pack →"}
              </button>

              <p className="text-[10px] text-navy-500 text-center">
                No spam. Unsubscribe anytime. We respect your privacy.
              </p>
            </form>

            <button onClick={dismiss} className="block text-xs text-navy-500 hover:text-navy-300 mx-auto mt-3 transition-colors">
              No thanks, I&apos;ll skip this
            </button>
          </>
        )}
      </div>
    </div>
  );
}
