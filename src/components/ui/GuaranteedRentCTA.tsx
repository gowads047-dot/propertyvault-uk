"use client";
import Link from "next/link";

interface GuaranteedRentCTAProps {
  context?: "yield" | "cashflow" | "mortgage" | "brrr" | "deal" | "general";
}

const COPY: Record<NonNullable<GuaranteedRentCTAProps["context"]>, { headline: string; body: string }> = {
  yield: {
    headline: "Want this yield — guaranteed, every month?",
    body: "PropertyVault leases your property for 3–5 years and pays you a fixed rent whether it's occupied or not. No voids, no management, no fees.",
  },
  cashflow: {
    headline: "Make your cash flow predictable",
    body: "Guaranteed rent means the number you calculated above is what you actually receive — every month, on time, without chasing.",
  },
  mortgage: {
    headline: "Guaranteed rent clears the stress test automatically",
    body: "Because we pay you a fixed monthly rent, lenders see 100% rental coverage with zero voids. Many landlords find it easier to remortgage or refinance on a guaranteed rent agreement.",
  },
  brrr: {
    headline: "Lock in your exit yield before you refinance",
    body: "Add a guaranteed rent agreement after your BRRR refurb and you'll have a fully managed, void-free property — exactly what lenders want to see at remortgage stage.",
  },
  deal: {
    headline: "Found a deal that works? We can take it off your hands.",
    body: "PropertyVault offers guaranteed rent on properties across the Midlands. If the numbers above look good, we may be interested in leasing the property directly.",
  },
  general: {
    headline: "Want guaranteed rent instead?",
    body: "Skip the voids and management entirely. PropertyVault leases your property for 3–5 years and pays you every month, guaranteed.",
  },
};

export function GuaranteedRentCTA({ context = "general" }: GuaranteedRentCTAProps) {
  const { headline, body } = COPY[context];
  return (
    <section className="mt-10 bg-navy-800 rounded-2xl p-6 md:p-8 text-center">
      <p className="text-xs font-semibold text-gold-400 uppercase tracking-widest mb-2">No voids. No management. No fees.</p>
      <h2 className="text-xl font-extrabold text-white mb-2" style={{ fontFamily: "var(--font-family-heading)" }}>
        {headline}
      </h2>
      <p className="text-white/60 text-sm mb-5 max-w-lg mx-auto">{body}</p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/guaranteed-rent" className="btn-gold">Get a free rent estimate</Link>
        <a
          href="/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline !border-white/20 !text-white hover:!bg-white/5 flex items-center gap-2"
        >
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
          Message Nass
        </a>
      </div>
    </section>
  );
}
