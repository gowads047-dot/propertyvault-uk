"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CONTACT_URL, CALENDLY_URL } from "@/lib/contact";

/**
 * Floating contact buttons.
 *
 * Previously a WhatsApp button wired to a personal mobile number. The number
 * was removed from the site, so this now routes to the enquiry form. The
 * WhatsApp mark went with it — keeping a recognisable logo on a button that
 * opens a web form would misrepresent where the click leads.
 */

const CalIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

const MessageIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
  </svg>
);

export function ContactButtons() {
  const pathname = usePathname();
  if (pathname?.startsWith("/makan") || pathname?.startsWith("/rentura")) return null;

  return (
    <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2">
      {/* Book a call */}
      <a
        href={CALENDLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Book a free 15-minute call"
        className="group flex items-center gap-2"
      >
        <span className="hidden sm:block bg-white text-navy-800 text-xs font-bold px-3 py-2 rounded-xl shadow-lg border border-navy-100 opacity-0 group-hover:opacity-100 transition-opacity">
          Book a free 15-min call
        </span>
        <span className="w-9 h-9 sm:w-12 sm:h-12 bg-navy-800 hover:bg-navy-700 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all text-white">
          <CalIcon />
        </span>
      </a>

      {/* Enquiry form */}
      <Link
        href={CONTACT_URL}
        aria-label="Send us an enquiry"
        className="group flex items-center gap-2"
      >
        <span className="hidden sm:block bg-white text-gold-700 text-xs font-bold px-3 py-2 rounded-xl shadow-lg border border-gold-200 opacity-0 group-hover:opacity-100 transition-opacity">
          Send an enquiry
        </span>
        <span className="w-10 h-10 sm:w-14 sm:h-14 bg-gold-500 hover:bg-gold-600 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all text-white">
          <MessageIcon />
        </span>
      </Link>
    </div>
  );
}
