"use client";

import { useState } from "react";

const glossaryTerms = [
  { term: "AST (Assured Shorthold Tenancy)", def: "The most common type of tenancy in England. A tenancy agreement between a private landlord and tenant, giving the tenant the right to live in the property for a set period." },
  { term: "ARV (After Repair Value)", def: "The estimated market value of a property after refurbishment works are completed. Used in BRRR and flip deal analysis." },
  { term: "BMV (Below Market Value)", def: "A property offered for sale at a price below its current market valuation, often from motivated sellers." },
  { term: "Bridging Finance", def: "Short-term loans (typically 1-18 months) used for property purchases, refurbishments, or chain-break situations. Higher interest rates than mortgages, charged monthly." },
  { term: "BRRR", def: "Buy, Refurbish, Rent, Refinance — a property investment strategy where you buy below market value, add value through refurbishment, rent the property, then refinance to recycle your capital." },
  { term: "BTL (Buy-to-Let)", def: "Purchasing a property specifically to rent it out to tenants, generating rental income and potential capital growth." },
  { term: "Capital Gains Tax (CGT)", def: "Tax paid on the profit when you sell a property that is not your main home. Residential property rates are 18% (basic rate) and 24% (higher rate) from October 2024." },
  { term: "Chain", def: "A sequence of linked property transactions where each buyer is also selling a property. Chain-free means the buyer has no property to sell." },
  { term: "Commonhold", def: "A form of property ownership for flats where each owner holds a freehold share. No ground rent or lease expiry. Managed by a commonhold association." },
  { term: "Completion", def: "The final stage of a property purchase when ownership legally transfers, the balance of funds is paid, and keys are handed over." },
  { term: "Conveyancing", def: "The legal process of transferring property ownership from seller to buyer. Carried out by a solicitor or licensed conveyancer." },
  { term: "Covenant", def: "A legal obligation or restriction attached to a property's title. Can restrict what you can do with the property." },
  { term: "Deposit Protection", def: "Legal requirement for landlords to protect tenants' deposits in a government-approved scheme (DPS, MyDeposits, or TDS) within 30 days of receipt." },
  { term: "Dilapidations", def: "The cost of repairs and reinstatement required at the end of a lease to return a property to its original condition. Common in commercial leases." },
  { term: "EPC (Energy Performance Certificate)", def: "A rating from A (most efficient) to G (least efficient) showing a property's energy performance. Legal requirement for selling or renting. Minimum E for rental properties." },
  { term: "EICR (Electrical Installation Condition Report)", def: "A report on the safety of a property's electrical installation. Required every 5 years for rental properties in England." },
  { term: "Equity", def: "The difference between a property's market value and the outstanding mortgage balance. Equity = Value - Mortgage." },
  { term: "Exchange of Contracts", def: "The point at which both buyer and seller are legally committed to the transaction. The buyer pays a deposit (usually 10%) and a completion date is set." },
  { term: "FHL (Furnished Holiday Let)", def: "A property let as furnished holiday accommodation that meets HMRC criteria (available 210+ days, let 105+ days per year). Offers specific tax advantages." },
  { term: "Freehold", def: "Outright ownership of both the property and the land it sits on, indefinitely. The owner has full control and no ground rent." },
  { term: "GDV (Gross Development Value)", def: "The total market value of a completed development. Used to assess the viability of property development projects." },
  { term: "Ground Rent", def: "An annual charge paid by a leaseholder to the freeholder. The Leasehold Reform Act 2022 set new ground rents on new leases to zero (a peppercorn)." },
  { term: "Gross Yield", def: "Annual rental income divided by the purchase price, expressed as a percentage. Does not account for expenses. Formula: (Annual Rent ÷ Price) × 100." },
  { term: "HMO (House in Multiple Occupation)", def: "A property rented to 3+ people from 2+ separate households who share facilities. Subject to additional licensing and safety requirements." },
  { term: "ICR (Interest Coverage Ratio)", def: "A lender's test that rental income must cover mortgage payments by a set ratio (usually 125-145% at a stress rate). Used for BTL mortgage affordability." },
  { term: "Leasehold", def: "Ownership of a property for a set term (typically 99-999 years) but not the land. Common with flats. Subject to ground rent, service charges, and lease conditions." },
  { term: "LTV (Loan-to-Value)", def: "The mortgage amount as a percentage of the property value. A £150,000 mortgage on a £200,000 property = 75% LTV." },
  { term: "Negative Equity", def: "When a property is worth less than the outstanding mortgage balance. Can occur during market downturns." },
  { term: "Net Yield", def: "Annual rental income minus operating expenses, divided by purchase price. Gives a more realistic picture of returns than gross yield." },
  { term: "Permitted Development (PD)", def: "Certain types of development that can be carried out without formal planning permission, subject to conditions. Includes some extensions and changes of use." },
  { term: "PPD (Price Paid Data)", def: "HM Land Registry data showing the sale price of every residential property transaction in England and Wales. Publicly available and free." },
  { term: "Rent-to-Rent", def: "Leasing a property from a landlord and subletting it at a higher rent (with the landlord's consent). The operator keeps the margin." },
  { term: "RICS", def: "Royal Institution of Chartered Surveyors — the professional body for surveyors and valuers. RICS-registered surveyors follow strict professional standards." },
  { term: "Right to Rent", def: "Legal requirement for landlords in England to verify that tenants have the legal right to rent in the UK before the tenancy starts. Penalties of up to £20,000." },
  { term: "SA (Serviced Accommodation)", def: "Fully furnished short-term rental property, typically booked nightly or weekly through platforms like Airbnb and Booking.com." },
  { term: "SDLT (Stamp Duty Land Tax)", def: "Tax paid on property purchases in England and Northern Ireland above certain thresholds. Additional 5% surcharge on second homes and investment properties." },
  { term: "Section 8", def: "A notice seeking possession of a rental property on specific grounds (e.g., rent arrears, breach of tenancy). Ground 8 is mandatory for 2+ months arrears." },
  { term: "Section 21", def: "A no-fault possession notice giving tenants 2 months to leave. The government plans to abolish Section 21 through the Renters' Reform Bill." },
  { term: "Section 24", def: "Tax rule (since April 2020) that prevents individual landlords from deducting mortgage interest from rental income. Instead, a 20% tax credit is given." },
  { term: "Service Charge", def: "Fees paid by leaseholders towards the maintenance and management of a building's communal areas, structure, and services." },
  { term: "SPV (Special Purpose Vehicle)", def: "A limited company set up specifically to hold property. Used for tax efficiency — mortgage interest is fully deductible and corporation tax applies instead of income tax." },
  { term: "SRA", def: "Solicitors Regulation Authority — the regulatory body for solicitors in England and Wales. SRA-regulated solicitors must follow professional conduct rules." },
  { term: "Stamp Duty Surcharge", def: "An additional 5% (increased from 3% in October 2024) charged on top of standard SDLT rates for additional property purchases (second homes, BTL)." },
  { term: "Tenure", def: "The way a property is held — freehold (own outright), leasehold (own for a set term), or commonhold (shared freehold)." },
  { term: "Void Period", def: "A period when a rental property is empty between tenants, generating no income. Typically 2-4 weeks per year." },
  { term: "Yield", def: "The annual return on a property investment, usually expressed as a percentage. Can be calculated as gross yield (before expenses) or net yield (after expenses)." },
];

export default function GlossaryPage() {
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState("");

  const letters = [...new Set(glossaryTerms.map(t => t.term[0].toUpperCase()))].sort();

  const filtered = glossaryTerms.filter(t => {
    const matchSearch = !search || t.term.toLowerCase().includes(search.toLowerCase()) || t.def.toLowerCase().includes(search.toLowerCase());
    const matchLetter = !activeLetter || t.term[0].toUpperCase() === activeLetter;
    return matchSearch && matchLetter;
  });

  return (
    <>
      <section className="gradient-navy py-16 md:py-20">
        <div className="container-max px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Property Glossary</h1>
          <p className="text-navy-200 max-w-2xl mx-auto">Every UK property term explained in plain English. {glossaryTerms.length} definitions covering investing, mortgages, law, tax, and more.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setActiveLetter(""); }}
            placeholder="Search terms..."
            className="w-full px-4 py-3 border border-navy-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-gold-400" />

          <div className="flex flex-wrap gap-1 mb-6">
            <button onClick={() => setActiveLetter("")} className={`px-2.5 py-1 rounded text-sm font-medium ${!activeLetter ? "bg-navy-600 text-white" : "bg-navy-50 text-navy-600 hover:bg-navy-100"}`}>All</button>
            {letters.map(l => (
              <button key={l} onClick={() => { setActiveLetter(l === activeLetter ? "" : l); setSearch(""); }}
                className={`px-2.5 py-1 rounded text-sm font-medium ${activeLetter === l ? "bg-navy-600 text-white" : "bg-navy-50 text-navy-600 hover:bg-navy-100"}`}>{l}</button>
            ))}
          </div>

          <p className="text-sm text-navy-500 mb-4">{filtered.length} term{filtered.length !== 1 ? "s" : ""}</p>

          <div className="space-y-3">
            {filtered.map(t => (
              <div key={t.term} className="bg-white rounded-xl border border-navy-100 p-5">
                <h3 className="font-bold text-navy-800">{t.term}</h3>
                <p className="text-sm text-navy-600 mt-1">{t.def}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
