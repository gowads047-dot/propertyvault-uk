"use client";

import { useState, useEffect } from "react";

export function NewsletterPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("newsletter_dismissed");
    if (dismissed) return;

    const timer = setTimeout(() => {
      setVisible(true);
    }, 60000); // Show after 60 seconds

    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setVisible(false);
    localStorage.setItem("newsletter_dismissed", "true");
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={dismiss}>
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={dismiss} className="absolute top-4 right-4 text-navy-400 hover:text-navy-600 transition-colors" aria-label="Close">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="text-center mb-5">
          <span className="text-3xl block mb-3">📬</span>
          <h3 className="text-xl font-extrabold text-navy-800" style={{ fontFamily: "var(--font-family-heading)" }}>
            Free Property Starter Pack
          </h3>
          <p className="text-sm text-navy-500 mt-2">
            Get our best calculator links, top guides, and a landlord compliance checklist — delivered straight to your inbox. Free, no spam.
          </p>
        </div>

        <form action="https://formsubmit.co/gowads047@gmail.com" method="POST" className="space-y-3">
          <input type="hidden" name="_subject" value="New Newsletter Signup — PropertyVault" />
          <input type="hidden" name="_next" value="https://propertyvaultuk.co.uk/?subscribed=true" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="text" name="_honey" style={{ display: "none" }} />

          <input
            type="text" name="name" placeholder="Your first name" required
            className="w-full px-4 py-3 border border-navy-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400 text-sm"
          />
          <input
            type="email" name="email" placeholder="Your email address" required
            className="w-full px-4 py-3 border border-navy-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400 text-sm"
          />

          <div>
            <p className="text-xs text-navy-500 mb-2 font-medium">I am a...</p>
            <div className="flex flex-wrap gap-2">
              {["Landlord", "Investor", "First-Time Buyer", "Agent", "Other"].map((type) => (
                <label key={type} className="flex items-center gap-1.5 text-xs text-navy-600 cursor-pointer">
                  <input type="radio" name="user_type" value={type} className="text-gold-500" />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary w-full !py-3.5 text-sm">
            Send Me the Free Pack →
          </button>

          <p className="text-[10px] text-navy-400 text-center">
            No spam. Unsubscribe anytime. We respect your privacy.
          </p>
        </form>

        <button onClick={dismiss} className="block text-xs text-navy-400 hover:text-navy-600 mx-auto mt-3">
          No thanks, I&apos;ll skip this
        </button>
      </div>
    </div>
  );
}
