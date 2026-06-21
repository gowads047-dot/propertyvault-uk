"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("cookie_consent", "all");
    setVisible(false);
  }

  function reject() {
    localStorage.setItem("cookie_consent", "essential");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-navy-900 text-white border-t border-navy-700 shadow-2xl">
      <div className="container-max px-4 py-4 md:py-5">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm leading-relaxed">
              We use cookies to improve your experience, analyse site traffic, and support our marketing. Essential cookies are always active. You can choose to accept or reject analytics and marketing cookies.{" "}
              <Link href="/cookies" className="text-gold-400 underline hover:text-gold-300">
                Read our Cookie Policy
              </Link>
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={reject}
              className="px-5 py-2.5 text-sm font-semibold border border-white/30 rounded-lg hover:bg-white/10 transition-colors"
            >
              Essential Only
            </button>
            <button
              onClick={accept}
              className="px-5 py-2.5 text-sm font-semibold bg-gold-400 text-navy-900 rounded-lg hover:bg-gold-500 transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
