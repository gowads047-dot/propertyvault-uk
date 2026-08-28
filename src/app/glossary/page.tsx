import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Property Glossary — 50+ UK Property Terms Explained",
  description: "A-Z glossary of UK property investment terms. From ARV to yield, every term landlords, investors, and buyers need to know — explained simply.",
  keywords: "property glossary, property terms explained, buy to let glossary, property investment terminology, UK property definitions",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/glossary/" },
  openGraph: {
    title: "Property Glossary — 50+ UK Property Terms Explained",
    description: "A-Z glossary of UK property investment terms. From ARV to yield, every term landlords, investors, and buyers need to know — explained simply.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/glossary/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "UK Property Glossary" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Glossary — 50+ UK Property Terms Explained",
    description: "A-Z glossary of UK property investment terms. From ARV to yield, every term landlords, investors, and buyers need to know — explained simply.",
  },
};

const terms: { term: string; def: string; link?: string; linkLabel?: string }[] = [
  { term: "ARV (After Refurbishment Value)", def: "The estimated market value of a property after renovation works are completed. Used in BRRR and flip strategies to calculate potential profit and refinance amounts.", link: "/calculators/brrr", linkLabel: "BRRR Calculator" },
  { term: "AST (Assured Shorthold Tenancy)", def: "The most common type of tenancy in England and Wales. Gives the tenant the right to stay for a fixed term (usually 6 or 12 months) with a minimum notice period.", link: "/templates/ast", linkLabel: "Free AST Template" },
  { term: "Below Market Value (BMV)", def: "A property priced below its true market value. Often found through motivated sellers, auctions, or direct-to-vendor marketing. Key to BRRR and flip strategies." },
  { term: "Bridging Loan", def: "Short-term finance (typically 1-18 months) used to bridge a gap — for example, buying at auction before a mortgage completes, or funding a refurb before refinancing.", link: "/calculators/bridging", linkLabel: "Bridging Loan Calculator" },
  { term: "BRRR", def: "Buy, Refurbish, Refinance, Rent. A strategy where you buy below market value, renovate, refinance to pull your capital out, then rent the property. Goal is to recycle your deposit.", link: "/blog/brrr-strategy-explained", linkLabel: "BRRR Strategy Guide" },
  { term: "Buy-to-Let (BTL)", def: "Purchasing a property specifically to rent out to tenants. Requires a buy-to-let mortgage (not a residential one) and typically a 25% deposit.", link: "/calculators/btl-mortgage", linkLabel: "BTL Stress Test Calculator" },
  { term: "Capital Gains Tax (CGT)", def: "Tax paid on profit when selling a property that isn't your main home. Rates are 18% (basic rate) and 24% (higher rate) for residential property from October 2024.", link: "/calculators/capital-gains-tax", linkLabel: "CGT Calculator" },
  { term: "Capital Growth", def: "The increase in a property's value over time. Some areas prioritise capital growth (e.g., London, premium suburbs) while others prioritise rental yield." },
  { term: "Cash Flow", def: "The net money left each month after all costs (mortgage, management, maintenance, insurance, voids) are deducted from rental income. Positive cash flow means profit.", link: "/calculators/monthly-cashflow", linkLabel: "Monthly Cash Flow Calculator" },
  { term: "Cash-on-Cash Return", def: "Annual pre-tax cash flow divided by total cash invested. Measures how hard your actual cash is working. A 10%+ cash-on-cash return is considered strong.", link: "/calculators/deal-analyser", linkLabel: "Deal Analyser" },
  { term: "Chain", def: "A sequence of linked property transactions where each sale depends on the next. Being 'chain-free' (e.g., first-time buyer or cash buyer) is an advantage." },
  { term: "Completion", def: "The final stage of a property purchase when ownership legally transfers, keys are handed over, and the purchase price is paid. Stamp duty is due on this date.", link: "/calculators/moving-costs", linkLabel: "Moving Costs Calculator" },
  { term: "Conveyancing", def: "The legal process of transferring property ownership from seller to buyer. Handled by a solicitor or licensed conveyancer. Typically costs £1,000-£2,000." },
  { term: "Covenant", def: "A legal obligation attached to a property, such as restrictions on use, alterations, or development. Check covenants before purchasing — they can limit investment potential." },
  { term: "Deal Sourcer", def: "Someone who finds below-market-value properties for investors in exchange for a fee (typically £3,000-£7,000). Must be transparent about fees and not mislead on values." },
  { term: "Deposit", def: "The upfront cash paid when buying a property. Buy-to-let mortgages typically require 25% deposit. Residential mortgages can be as low as 5-10%.", link: "/calculators/affordability", linkLabel: "Affordability Calculator" },
  { term: "Disbursements", def: "Additional costs paid by your solicitor on your behalf during conveyancing — searches, Land Registry fees, bank transfer fees. Typically £300-£500 on top of legal fees." },
  { term: "EPC (Energy Performance Certificate)", def: "A rating from A (most efficient) to G (least efficient) showing a property's energy efficiency. Rental properties must have a minimum E rating. A C rating is required by 2030 for all rental properties.", link: "/calculators/epc-retrofit", linkLabel: "EPC Retrofit Cost Calculator" },
  { term: "Equity", def: "The difference between a property's market value and the outstanding mortgage. Equity increases as you pay down the mortgage and/or the property value rises.", link: "/calculators/remortgage", linkLabel: "Remortgage Calculator" },
  { term: "Exchange of Contracts", def: "The point at which the sale becomes legally binding. Both parties sign contracts and the buyer pays a deposit (usually 10%). Pulling out after exchange incurs penalties." },
  { term: "Freehold", def: "Outright ownership of both the building and the land it sits on. Most houses are freehold. Preferred over leasehold for investment as there are no ground rent or service charges to a freeholder." },
  { term: "Gross Yield", def: "Annual rental income divided by the property purchase price, expressed as a percentage. A simple but incomplete measure — doesn't account for any costs.", link: "/calculators/rental-yield", linkLabel: "Rental Yield Calculator" },
  { term: "Ground Rent", def: "An annual charge paid by a leaseholder to the freeholder. Can be a nominal amount (£50-£250/year) or escalating. The Leasehold Reform Act 2022 set new ground rents to zero for new leases.", link: "/calculators/leasehold", linkLabel: "Leasehold Calculator" },
  { term: "Guaranteed Rent", def: "A scheme where a company leases your property and pays you a fixed rent regardless of occupancy. Removes void risk and management hassle. Typically 3-5 year contracts.", link: "/guaranteed-rent", linkLabel: "Get a Guaranteed Rent Quote" },
  { term: "HMO (House in Multiple Occupation)", def: "A property rented by 3+ tenants from 2+ households who share facilities. Requires an HMO licence if 5+ tenants. Higher yields but more regulation and management.", link: "/calculators/hmo-yield", linkLabel: "HMO Yield Calculator" },
  { term: "ICR (Interest Cover Ratio)", def: "A lender's test that rental income must exceed mortgage interest by a set ratio (typically 125-145% at a stress rate of 5.5%). Determines how much you can borrow.", link: "/calculators/btl-mortgage", linkLabel: "BTL Stress Test Calculator" },
  { term: "Joint Venture (JV)", def: "A partnership between two or more parties to invest in property. One may provide capital, the other expertise or time. Requires a clear JV agreement." },
  { term: "Land Registry", def: "The government body that records property ownership in England and Wales. All property sales must be registered. Title information can be purchased for £3 per property." },
  { term: "Leasehold", def: "Ownership of a property for a fixed term (e.g., 99 or 125 years) but not the land. Common with flats. Short leases (under 80 years) significantly reduce value and mortgageability.", link: "/calculators/leasehold", linkLabel: "Leasehold Calculator" },
  { term: "LTV (Loan-to-Value)", def: "The mortgage amount as a percentage of the property value. A 75% LTV means you're borrowing 75% and putting down 25% deposit. Lower LTV usually means better rates.", link: "/calculators/mortgage", linkLabel: "Mortgage Calculator" },
  { term: "Market Value", def: "The price a property would reasonably sell for on the open market. Determined by comparable sales, location, condition, and demand. Different from the asking price." },
  { term: "Mortgage Offer", def: "A formal offer from a lender to provide a mortgage on specific terms. Typically valid for 3-6 months. Subject to conditions like satisfactory survey and legal checks.", link: "/calculators/mortgage", linkLabel: "Mortgage Calculator" },
  { term: "Net Yield", def: "Annual rental income minus all costs (mortgage, management, maintenance, insurance, voids), divided by the purchase price. The real measure of investment return.", link: "/calculators/rental-yield", linkLabel: "Rental Yield Calculator" },
  { term: "No-Fault Eviction (Section 21)", def: "A landlord's ability to evict a tenant without giving a reason after the fixed term ends. Abolished under the Renters' Rights Act 2025 — landlords must now use specific grounds for possession.", link: "/blog/renters-rights-act", linkLabel: "Renters' Rights Act 2025 Guide" },
  { term: "RICS Valuation", def: "A formal property valuation by a Royal Institution of Chartered Surveyors member. Required by most mortgage lenders. Different from an estate agent's opinion of value." },
  { term: "Rental Yield", def: "The annual return on a property investment from rent, expressed as a percentage. Can be gross (before costs) or net (after costs). The most common measure of BTL performance.", link: "/calculators/rental-yield", linkLabel: "Rental Yield Calculator" },
  { term: "Remortgage", def: "Switching your existing mortgage to a new deal, either with the same or a different lender. Usually done when a fixed rate ends to avoid the lender's SVR (standard variable rate).", link: "/calculators/remortgage", linkLabel: "Remortgage Calculator" },
  { term: "Right to Rent", def: "A legal requirement for landlords in England to check that tenants have the right to live in the UK before granting a tenancy. Failure to check can result in fines up to £20,000.", link: "/templates/landlord-compliance", linkLabel: "Landlord Compliance Checklist" },
  { term: "SDLT (Stamp Duty Land Tax)", def: "Tax paid on property purchases in England and Northern Ireland. Rates start at 0% up to £125,000, rising to 12% above £1.5m. An additional 5% surcharge applies to second homes.", link: "/calculators/stamp-duty", linkLabel: "Stamp Duty Calculator" },
  { term: "Section 24", def: "Tax rule (fully phased in from April 2020) that prevents landlords from deducting mortgage interest from rental income. Instead, a 20% tax credit is given. Hits higher-rate taxpayers hardest.", link: "/calculators/section-24", linkLabel: "Section 24 Calculator" },
  { term: "Service Charge", def: "An annual charge for the maintenance of communal areas in a leasehold property — cleaning, repairs, insurance, management. Can be £1,000-£5,000+/year and erode yield significantly.", link: "/calculators/leasehold", linkLabel: "Leasehold Calculator" },
  { term: "SPV (Special Purpose Vehicle)", def: "A limited company set up specifically to hold property. Avoids Section 24, allows mortgage interest as a business expense, and corporation tax (19–25%) may be lower than personal income tax.", link: "/calculators/personal-vs-ltd", linkLabel: "Personal vs Ltd Company Calculator" },
  { term: "Stress Test", def: "A lender's assessment of whether you can afford mortgage payments if interest rates rise. BTL lenders typically stress test at 5.5% even if your actual rate is lower.", link: "/calculators/btl-mortgage", linkLabel: "BTL Stress Test Calculator" },
  { term: "Survey", def: "A professional inspection of a property's condition. Types range from basic (Level 1/Condition Report) to full structural (Level 3/Building Survey). Essential before purchase.", link: "/templates/due-diligence", linkLabel: "Due Diligence Template" },
  { term: "Tenancy Deposit Scheme", def: "A legal requirement in England to protect tenant deposits in a government-approved scheme (DPS, MyDeposits, or TDS) within 30 days. Failure allows tenants to claim 1-3x the deposit.", link: "/templates/landlord-compliance", linkLabel: "Landlord Compliance Checklist" },
  { term: "Title Deeds", def: "Legal documents proving ownership of a property. Now mostly held electronically by the Land Registry. Include details of boundaries, rights of way, and any restrictions." },
  { term: "Vacant Possession", def: "A property sold empty with no tenants or occupants. Required for most residential mortgages. BTL properties can be sold with tenants in situ." },
  { term: "Void Period", def: "Time when a rental property is empty between tenants. No rent is received but costs continue. Typically 2-4 weeks per year. Reducing voids is key to maximising returns.", link: "/calculators/void-period", linkLabel: "Void Period Calculator" },
  { term: "Yield", def: "The annual return on an investment expressed as a percentage. In property, usually refers to rental yield — gross yield (rent/price) or net yield (rent minus costs/price).", link: "/calculators/rental-yield", linkLabel: "Rental Yield Calculator" },
];

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function GlossaryPage() {
  const grouped = alphabet.reduce((acc, letter) => {
    const matching = terms.filter(t => t.term.charAt(0).toUpperCase() === letter);
    if (matching.length > 0) acc[letter] = matching;
    return acc;
  }, {} as Record<string, typeof terms>);

  const activeLetters = Object.keys(grouped);

  return (
    <>
      <section className="bg-white py-16 md:py-24">
        <div className="container-max px-4">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest mb-3">Reference</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-navy-800 mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Property Glossary</h1>
            <p className="text-navy-500">{terms.length} essential UK property terms explained in plain English. From ARV to yield — everything investors, landlords, and buyers need to know.</p>
          </div>
        </div>
      </section>

      <div className="border-t border-navy-100" />

      {/* Alphabet Navigation */}
      <section className="bg-white sticky top-0 z-10 border-b border-navy-100">
        <div className="container-max px-4 py-3">
          <div className="flex flex-wrap gap-1">
            {alphabet.map(letter => (
              <a
                key={letter}
                href={activeLetters.includes(letter) ? `#letter-${letter}` : undefined}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${activeLetters.includes(letter) ? "bg-navy-800 text-white hover:bg-gold-500" : "bg-navy-50 text-navy-300 cursor-default"}`}
              >
                {letter}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4 max-w-3xl">
          <div className="space-y-8">
            {activeLetters.map(letter => (
              <div key={letter} id={`letter-${letter}`} className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-navy-800 text-white flex items-center justify-center font-extrabold text-lg">{letter}</div>
                  <div className="flex-1 h-px bg-navy-200" />
                </div>
                <div className="space-y-3">
                  {grouped[letter].map(t => (
                    <div key={t.term} className="bg-white rounded-2xl border border-navy-100 p-5">
                      <h3 className="font-bold text-navy-800 mb-1">{t.term}</h3>
                      <p className="text-sm text-navy-500 leading-relaxed">{t.def}</p>
                      {t.link && (
                        <Link href={t.link} className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-gold-600 hover:text-gold-700 transition-colors">
                          {t.linkLabel} →
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
