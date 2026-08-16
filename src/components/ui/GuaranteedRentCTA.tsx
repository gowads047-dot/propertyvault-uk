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
          href="https://wa.me/447415721628?text=Hi%2C%20I%27d%20like%20to%20know%20what%20guaranteed%20rent%20you%20offer%20for%20my%20property."
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline !border-white/20 !text-white hover:!bg-white/5 flex items-center gap-2"
        >
          <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp Nass
        </a>
      </div>
    </section>
  );
}
