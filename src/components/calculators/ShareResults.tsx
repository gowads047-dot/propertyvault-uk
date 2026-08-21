"use client";
import { useState, useEffect } from "react";

interface ShareResultsProps {
  title: string;
  summary: string; // e.g. "Stamp duty: £5,000 on a £300,000 property"
  url?: string;    // defaults to current page
}

export function ShareResults({ title, summary, url }: ShareResultsProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- mounted flag so window.location is only read after hydration; removing it reintroduces a mismatch
  useEffect(() => setMounted(true), []);

  // Use empty string on SSR to avoid hydration mismatch; resolved on client after mount
  const pageUrl = mounted ? (url ?? window.location.href) : (url ?? "");
  const waText = encodeURIComponent(`${summary}\n\nCalculated with the free ${title} on PropertyVault UK: ${pageUrl}`);
  const xText = encodeURIComponent(`${summary} — calculated with the free ${title} 👇`);

  function copyLink() {
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="mt-6 pt-5 border-t border-navy-100">
      <p className="text-xs font-bold text-navy-500 uppercase tracking-wider mb-3">Share your result</p>
      <div className="flex flex-wrap gap-2">
        {/* Copy link */}
        <button
          onClick={copyLink}
          className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg border transition-all ${copied ? "bg-green-50 border-green-200 text-green-700" : "bg-white border-navy-200 text-navy-700 hover:border-navy-400"}`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
          </svg>
          {copied ? "Copied!" : "Copy link"}
        </button>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          suppressHydrationWarning
          className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 transition-all"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
          Message us
        </a>

        {/* X / Twitter */}
        <a
          href={`https://x.com/intent/tweet?text=${xText}&url=${encodeURIComponent(pageUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          suppressHydrationWarning
          className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-all"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Post on X
        </a>
      </div>
    </div>
  );
}
