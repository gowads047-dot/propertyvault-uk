import type { Metadata } from "next";
import Link from "next/link";
import { FAQSchema } from "@/components/seo/FAQSchema";

export const metadata: Metadata = {
  title: "Guaranteed Rent Coventry — Landlords Get Paid Every Month | PropertyVault UK",
  description: "Guaranteed rent for landlords in Coventry. We lease your property for 3-5 years with guaranteed monthly income. No voids, no management, no fees. All Coventry postcodes covered.",
  keywords: "guaranteed rent Coventry, guaranteed rent scheme Coventry, landlord guaranteed rent CV postcode, lease my property Coventry",
  openGraph: {
    title: "Guaranteed Rent Coventry | PropertyVault UK",
    description: "Lease your Coventry property for 3-5 years — guaranteed rent every month, no voids, no management.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/guaranteed-rent/coventry/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Guaranteed Rent Coventry — PropertyVault UK" }],
  },
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/guaranteed-rent/coventry/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Guaranteed Rent Coventry",
  description: "Guaranteed rent for landlords in Coventry. We lease your property for 3-5 years with guaranteed monthly income. No voids, no management, no fees.",
  url: "https://www.propertyvaultuk.co.uk/guaranteed-rent/coventry/",
  provider: {
    "@type": "Organization",
    name: "PropertyVault UK",
    url: "https://www.propertyvaultuk.co.uk",
    email: "gowads047@gmail.com",
    areaServed: { "@type": "City", name: "Coventry" },
  },
  serviceType: "Guaranteed Rent Property Leasing",
  areaServed: { "@type": "City", name: "Coventry" },
  availableChannel: {
    "@type": "ServiceChannel",
    serviceUrl: "https://www.propertyvaultuk.co.uk/guaranteed-rent/coventry/",
  },
};

export default function CoventryPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="gradient-navy relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0"><div className="absolute top-10 right-[10%] w-[300px] h-[300px] bg-gold-400/5 rounded-full blur-[80px]" /></div>
        <div className="container-max px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-gold-400 text-sm font-semibold mb-6">
            <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
            Coventry
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>
            Guaranteed Rent in Coventry
          </h1>
          <p className="text-lg text-navy-200 max-w-2xl mx-auto mb-8">
            Lease your Coventry property and receive guaranteed rent every month for 3-5 years. No voids, no management, no letting agent fees.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/contact" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all shadow-lg text-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>
              Message Us
            </a>
            <Link href="/guaranteed-rent#enquiry" className="btn-primary text-lg !py-4 !px-8">Get a Free Quote →</Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <h2 className="text-2xl font-extrabold text-navy-800 mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Guaranteed Rent Across Coventry</h2>
          <p className="text-navy-600 leading-relaxed mb-4">We are actively leasing properties across all Coventry postcodes. Whether you own a 1-bed flat near the city centre or a 4-bed house in Foleshill, we can offer you a guaranteed monthly rent with a 3-5 year lease.</p>
          <p className="text-navy-600 leading-relaxed mb-6">Every property we lease is managed to the same standard for the length of the term — rent paid monthly whether or not it is occupied, gas, electrical and EPC certification kept current, and regular inspections throughout.</p>

          <h3 className="font-bold text-navy-800 mb-3">Areas We Cover in Coventry</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-8">
            {["Foleshill", "Hillfields", "Radford", "Stoke", "Bell Green", "Wood End", "Holbrooks", "Longford", "Exhall", "Binley", "Willenhall", "Wyken", "Earlsdon", "Cheylesmore", "Tile Hill", "Canley", "Westwood", "Coundon", "Keresley", "Allesley", "Bedworth", "Nuneaton"].map((area) => (
              <span key={area} className="px-3 py-2 bg-navy-50 text-navy-700 text-sm rounded-lg font-medium text-center">{area}</span>
            ))}
          </div>

          <h3 className="font-bold text-navy-800 mb-3">What You Get</h3>
          <ul className="space-y-2 mb-6">
            {[
              "Guaranteed rent paid on the same date every month",
              "No void periods — you get paid even if the property is empty",
              "Full property management — tenants, maintenance, compliance",
              "No letting agent fees or management charges",
              "Property returned in condition at end of lease",
              "3-5 year lease for long-term income security",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-navy-600">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                {item}
              </li>
            ))}
          </ul>

          {/* Income Comparison Table */}
          <div className="mb-10">
            <h3 className="font-bold text-navy-800 mb-4 text-lg" style={{ fontFamily: "var(--font-family-heading)" }}>How Your Income Compares</h3>
            <div className="overflow-x-auto rounded-xl border border-navy-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-navy-800 text-white">
                    <th className="px-4 py-3 text-left font-semibold">Scenario</th>
                    <th className="px-4 py-3 text-center font-semibold">Monthly</th>
                    <th className="px-4 py-3 text-center font-semibold">Annual</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-navy-100 bg-white">
                    <td className="px-4 py-3 text-navy-700 font-medium">Market rent (gross)</td>
                    <td className="px-4 py-3 text-center text-navy-600">£825</td>
                    <td className="px-4 py-3 text-center text-navy-600">£9,900</td>
                  </tr>
                  <tr className="border-b border-navy-100 bg-navy-50/50">
                    <td className="px-4 py-3 text-navy-700 font-medium">After agent fees + voids</td>
                    <td className="px-4 py-3 text-center text-navy-500">£675</td>
                    <td className="px-4 py-3 text-center text-navy-500">£8,100</td>
                  </tr>
                  <tr className="bg-gold-50 border-b-2 border-gold-400">
                    <td className="px-4 py-3 text-navy-800 font-bold">Guaranteed rent (PropertyVault)</td>
                    <td className="px-4 py-3 text-center text-gold-600 font-bold">£730</td>
                    <td className="px-4 py-3 text-center text-gold-600 font-bold">£8,760</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-navy-400 mt-2">Figures based on typical 3-bed terraced house in Coventry. Agent fee assumed at 10% + 1 month average void per year.</p>
          </div>

          <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-6 text-white text-center">
            <p className="text-gold-400 font-bold text-sm mb-2">Coventry Landlord?</p>
            <p className="text-xl font-extrabold mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Get your free guaranteed rent quote today</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/contact" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>
                Message us
              </a>
              <Link href="/guaranteed-rent#enquiry" className="btn-primary !py-3">Fill in Enquiry Form →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-navy-50/40">
        <div className="container-max max-w-3xl text-center">
          <p className="text-sm text-navy-500">Want to learn more about how guaranteed rent works?</p>
          <Link href="/guaranteed-rent" className="text-sm font-semibold text-gold-600 hover:text-gold-700">Read the full guaranteed rent guide →</Link>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <FAQSchema faqs={[
            {
              q: "How much guaranteed rent will I receive for my Coventry property?",
              a: "Our guaranteed rent offer depends on your property's location, size, and condition in Coventry. For a typical 3-bed terraced house in areas like Foleshill or Hillfields, we offer around £730 per month — paid every month with no voids or agent fees. Contact us for a tailored, no-obligation quote.",
            },
            {
              q: "Which areas of Coventry does PropertyVault UK cover?",
              a: "We cover all Coventry postcodes including Foleshill, Hillfields, Radford, Stoke, Bell Green, Wood End, Holbrooks, Longford, Binley, Willenhall, Wyken, Earlsdon, Tile Hill, Coundon, Bedworth, Nuneaton, and all surrounding CV postcode areas.",
            },
            {
              q: "How quickly can I start receiving guaranteed rent in Coventry?",
              a: "Most Coventry landlords are up and running within 7–14 days of first contact. We inspect the property, prepare the lease agreement, and onboard you quickly — so you start earning guaranteed rent with minimal delay.",
            },
            {
              q: "Who handles maintenance and repairs at my Coventry property?",
              a: "We handle the day-to-day: tenant-reported repairs, general wear and tear, and routine maintenance through our local Coventry contractor network — at our cost, for the length of the lease. As the owner you remain responsible for the building structure, buildings insurance, the boiler, and any major electrical work. We arrange and coordinate those too, and always notify you in advance, but the cost sits with you as it would under any lease.",
            },
            {
              q: "Can I sell my Coventry property during the guaranteed rent lease?",
              a: "Yes. We can accommodate landlords who need to sell during the lease period. Options include early termination under agreed terms or selling with the lease in place, which many investors find appealing as an income-generating asset. Contact us to discuss your specific situation.",
            },
          ]} />
        </div>
      </section>
    </>
  );
}
