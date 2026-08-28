"use client";

import { usePathname } from "next/navigation";
import { WHATSAPP_URL, CALENDLY_URL } from "@/lib/contact";

const WaIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const CalIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

export function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname?.startsWith("/makan") || pathname?.startsWith("/rentura")) return null;

  return (
    <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2">
      {/* Book a Call button */}
      <a
        href={CALENDLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Book a free 15-minute call"
        className="group flex items-center gap-2"
      >
        <span className="hidden sm:block bg-white text-navy-800 text-xs font-bold px-3 py-2 rounded-xl shadow-lg border border-navy-100 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 whitespace-nowrap pointer-events-none">
          Book a free 15-min call
        </span>
        <span className="w-9 h-9 sm:w-12 sm:h-12 bg-navy-800 hover:bg-navy-700 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-200 text-white">
          <CalIcon />
        </span>
      </a>

      {/* WhatsApp button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Ask about guaranteed rent on WhatsApp"
        className="group flex items-center gap-2"
      >
        <span className="hidden sm:block bg-white text-green-700 text-xs font-bold px-3 py-2 rounded-xl shadow-lg border border-green-100 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 whitespace-nowrap pointer-events-none">
          WhatsApp us now
        </span>
        <span className="w-10 h-10 sm:w-14 sm:h-14 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-200"
              style={{ color: "#ffffff" }}>
          <WaIcon />
        </span>
      </a>
    </div>
  );
}
