import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Area Research Tools UK — Schools, Crime, Transport, Flood Risk | PropertyVault UK",
  description: "Research any UK area before buying or investing. Free tools for schools, crime stats, flood risk, broadband, council tax, and transport links.",
  alternates: { canonical: "https://propertyvaultuk.co.uk/area-guide/" },
  openGraph: {
    title: "Area Research Tools UK — Schools, Crime, Transport, Flood Risk | PropertyVault UK",
    description: "Research any UK area before buying or investing. Free tools for schools, crime stats, flood risk, broadband, council tax, and transport links.",
    type: "article",
    url: "https://propertyvaultuk.co.uk/area-guide/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "UK Property Area Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Area Research Tools UK — Schools, Crime, Transport, Flood Risk | PropertyVault UK",
    description: "Research any UK area before buying or investing. Free tools for schools, crime stats, flood risk, broadband, council tax, and transport links.",
  },
};

const tools = [
  { name: "Crime Statistics", desc: "Search crime rates by postcode. Data from all UK police forces, updated monthly.", url: "https://www.police.uk/", source: "Police.uk" },
  { name: "Flood Risk Check", desc: "Check river, surface water, and reservoir flood risk for any address in England.", url: "https://check-long-term-flood-risk.service.gov.uk/", source: "Environment Agency" },
  { name: "School Performance", desc: "Search schools by location. View Ofsted ratings, exam results, and pupil numbers.", url: "https://www.find-school-performance-data.service.gov.uk/", source: "DfE / Ofsted" },
  { name: "Council Tax Bands", desc: "Check the council tax band for any property in England and Wales.", url: "https://www.gov.uk/council-tax-bands", source: "Valuation Office Agency" },
  { name: "Broadband Coverage", desc: "Check superfast, ultrafast, and full fibre broadband availability at any address.", url: "https://labs.thinkbroadband.com/local/", source: "Ofcom / ThinkBroadband" },
  { name: "Planning Applications", desc: "Search planning applications submitted to your local council.", url: "https://www.planningportal.co.uk/planning/planning-applications/find-out-more/search-applications", source: "Planning Portal" },
  { name: "Energy Performance (EPC)", desc: "Look up the EPC rating and report for any property in England and Wales.", url: "https://www.gov.uk/find-energy-certificate", source: "MHCLG" },
  { name: "Land Registry Title Search", desc: "Find out who owns a property and see the title plan. Costs £3 per title.", url: "https://search-property-information.service.gov.uk/", source: "HM Land Registry" },
  { name: "Deprivation Index", desc: "Check how deprived an area is across income, employment, education, health, and crime.", url: "https://dclgapps.communities.gov.uk/imd/iod_index.html", source: "MHCLG" },
  { name: "Transport Links", desc: "Plan journeys by train, bus, tram, and walking. Check commute times from any location.", url: "https://www.traveline.info/", source: "Traveline" },
  { name: "Air Quality", desc: "Check air pollution levels and forecasts for any UK location.", url: "https://uk-air.defra.gov.uk/", source: "DEFRA" },
  { name: "Mobile Coverage", desc: "Check 4G and 5G mobile coverage from all UK networks at any address.", url: "https://checker.ofcom.org.uk/en-gb/mobile-coverage", source: "Ofcom" },
];

export default function AreaGuidePage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-20">
        <div className="container-max px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Area Research Tools</h1>
          <p className="text-navy-200 max-w-2xl mx-auto">Research any UK area before buying or investing. All tools below are free, official government or regulator sources.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          <div className="grid md:grid-cols-2 gap-4">
            {tools.map((t) => (
              <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer"
                className="flex items-start gap-4 p-5 bg-white rounded-xl border border-navy-100 hover:shadow-lg hover:border-gold-400/30 transition-all">
                <div className="flex-1">
                  <h3 className="font-bold text-navy-800 mb-1">{t.name}</h3>
                  <p className="text-sm text-navy-500 mb-2">{t.desc}</p>
                  <p className="text-xs text-navy-400">Source: {t.source}</p>
                </div>
                <svg className="w-4 h-4 text-navy-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            ))}
          </div>
          <p className="text-xs text-navy-400 text-center mt-8">All links open on official government or regulator websites. PropertyVault is not affiliated with these services.</p>
        </div>
      </section>
    </>
  );
}
