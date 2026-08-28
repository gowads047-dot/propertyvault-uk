import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Property Tools & Checkers — EPC, Council Tax, Broadband, Flood Risk",
  description: "Free UK property tools and checkers. Look up EPC ratings, council tax bands, broadband speeds, flood risk, school ratings, crime stats, and more.",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/tools/" },
  openGraph: {
    title: "Free Property Tools & Checkers — EPC, Council Tax, Broadband, Flood Risk",
    description: "Free UK property tools and checkers. Look up EPC ratings, council tax bands, broadband speeds, flood risk, school ratings, crime stats, and more.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/tools/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "PropertyVault UK Property Tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Property Tools & Checkers — EPC, Council Tax, Broadband, Flood Risk",
    description: "Free UK property tools and checkers. Look up EPC ratings, council tax bands, broadband speeds, flood risk, school ratings, crime stats, and more.",
  },
};

// `internal` marks a PropertyVault tool, which renders as a next/link rather than
// an outbound anchor. Declaring it optional here means the render code can read
// tool.internal directly instead of casting past the inferred union.
type Tool = { name: string; desc: string; url: string; source: string; internal?: boolean };
type ToolCategory = { category: string; items: Tool[] };

const tools: ToolCategory[] = [
  { category: "Property Checks", items: [
    { name: "EPC Lookup", desc: "Check the energy performance rating of any property in England and Wales", url: "https://www.gov.uk/find-energy-certificate", source: "GOV.UK" },
    { name: "Council Tax Band Checker", desc: "Find the council tax band and estimated annual charge for any address", url: "https://www.gov.uk/council-tax-bands", source: "Valuation Office Agency" },
    { name: "Land Registry Title Search", desc: "Find who owns a property, view title plans, and download official copies (£3 each)", url: "https://search-property-information.service.gov.uk/", source: "HM Land Registry" },
    { name: "Planning Applications Search", desc: "Search planning applications submitted to any local authority in England", url: "https://www.planningportal.co.uk/planning/planning-applications/find-out-more/search-applications", source: "Planning Portal" },
    { name: "Sold House Prices", desc: "Look up what any property in England and Wales sold for — free official data", url: "https://landregistry.data.gov.uk/app/ppd", source: "HM Land Registry" },
  ]},
  { category: "Location & Safety", items: [
    { name: "Flood Risk Check", desc: "Check long-term flood risk from rivers, surface water, and reservoirs for any address", url: "https://check-long-term-flood-risk.service.gov.uk/", source: "Environment Agency" },
    { name: "Crime Statistics", desc: "View crime data by postcode — burglary, anti-social behaviour, violence, and more", url: "https://www.police.uk/", source: "Police.uk" },
    { name: "School Performance Data", desc: "Search schools by location, view Ofsted ratings, exam results, and pupil numbers", url: "https://www.find-school-performance-data.service.gov.uk/", source: "DfE" },
    { name: "Deprivation Index", desc: "Check how deprived an area is across income, employment, education, health, and crime", url: "https://dclgapps.communities.gov.uk/imd/iod_index.html", source: "MHCLG" },
    { name: "Air Quality Data", desc: "Check current and forecast air pollution levels for any UK location", url: "https://uk-air.defra.gov.uk/", source: "DEFRA" },
  ]},
  { category: "Connectivity", items: [
    { name: "Broadband Speed Checker", desc: "Check superfast, ultrafast, and full fibre broadband availability at any address", url: "https://labs.thinkbroadband.com/local/", source: "ThinkBroadband / Ofcom" },
    { name: "Mobile Coverage Checker", desc: "Check 4G and 5G coverage from all UK mobile networks at any address", url: "https://checker.ofcom.org.uk/en-gb/mobile-coverage", source: "Ofcom" },
    { name: "Transport Journey Planner", desc: "Plan journeys by train, bus, tram, and walking from any location", url: "https://www.traveline.info/", source: "Traveline" },
  ]},
  { category: "Financial Tools", items: [
    { name: "Mortgage Affordability", desc: "How much can you borrow? Calculate based on income and outgoings", url: "/calculators/affordability", source: "PropertyVault", internal: true },
    { name: "Stamp Duty Calculator", desc: "Calculate your SDLT for standard, additional, and first-time buyer purchases", url: "/calculators/stamp-duty", source: "PropertyVault", internal: true },
    { name: "Mortgage Calculator", desc: "Calculate monthly repayments, total interest, and compare mortgage types", url: "/calculators/mortgage", source: "PropertyVault", internal: true },
    { name: "Remortgage Savings", desc: "See how much you could save by switching to a better rate", url: "/calculators/remortgage", source: "PropertyVault", internal: true },
    { name: "EPC Retrofit Calculator", desc: "Estimate the cost of improving your EPC rating with grants and payback", url: "/calculators/epc-retrofit", source: "PropertyVault", internal: true },
    { name: "Rent vs Buy Calculator", desc: "Is it cheaper to rent or buy? Compare total costs over time", url: "/calculators/rent-vs-buy", source: "PropertyVault", internal: true },
  ]},
  { category: "Landlord Tools", items: [
    { name: "Rental Yield Calculator", desc: "Calculate gross and net yield on any buy-to-let property", url: "/calculators/rental-yield", source: "PropertyVault", internal: true },
    { name: "BRRR Calculator", desc: "Model a buy-refurbish-rent-refinance deal with full ROI analysis", url: "/calculators/brrr", source: "PropertyVault", internal: true },
    { name: "Landlord Cost Calculator", desc: "See the real cost of being a landlord — expenses, tax, and net profit", url: "/calculators/landlord-costs", source: "PropertyVault", internal: true },
    { name: "Gas Safe Engineer Finder", desc: "Find a registered Gas Safe engineer in your area (official register)", url: "https://www.gassaferegister.co.uk/find-an-engineer/", source: "Gas Safe Register" },
    { name: "NICEIC Electrician Finder", desc: "Find an approved electrician for EICR and electrical work", url: "https://www.niceic.com/find-a-contractor", source: "NICEIC" },
    { name: "Deposit Protection Schemes", desc: "The three government-approved schemes: DPS, MyDeposits, and TDS", url: "https://www.gov.uk/tenancy-deposit-protection", source: "GOV.UK" },
  ]},
];

export default function ToolsPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-20">
        <div className="container-max px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Property Tools &amp; Checkers</h1>
          <p className="text-navy-200 max-w-2xl mx-auto">Every free tool you need for UK property — EPC ratings, council tax, flood risk, sold prices, broadband speeds, calculators, and more. All in one place.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl space-y-10">
          {tools.map((group) => (
            <div key={group.category}>
              <h2 className="text-xl font-bold text-navy-800 mb-4">{group.category}</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {group.items.map((tool) => {
                  const Tag = tool.internal ? Link : "a";
                  const linkProps = tool.internal
                    ? { href: tool.url }
                    : { href: tool.url, target: "_blank", rel: "noopener noreferrer" };
                  return (
                    <Tag key={tool.name} {...linkProps}
                      className="flex items-start gap-3 p-4 bg-white rounded-xl border border-navy-100 hover:shadow-md hover:border-gold-400/30 transition-all">
                      <div className="flex-1">
                        <h3 className="font-bold text-navy-800 text-sm">{tool.name}</h3>
                        <p className="text-xs text-navy-500 mt-0.5">{tool.desc}</p>
                        <p className="text-xs text-navy-400 mt-1">Source: {tool.source}</p>
                      </div>
                      {!tool.internal && (
                        <svg className="w-4 h-4 text-navy-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      )}
                    </Tag>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-3xl text-center">
          <p className="text-xs text-navy-400">External links open on their respective websites. PropertyVault is not affiliated with these services. All government tools are free to use. Data is Crown Copyright or Open Government Licence where applicable.</p>
        </div>
      </section>
    </>
  );
}
