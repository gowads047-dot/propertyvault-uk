import type { Metadata } from "next";
import Link from "next/link";
import { FAQSchema } from "@/components/seo/FAQSchema";

export const metadata: Metadata = {
  title: "Guaranteed Rent Birmingham — Landlords Get Paid Every Month | PropertyVault UK",
  description: "Guaranteed rent for landlords in Birmingham. We lease your property for 3-5 years with guaranteed monthly income. No voids, no management, no fees. All Birmingham postcodes covered.",
  keywords: "guaranteed rent Birmingham, guaranteed rent scheme Birmingham, landlord guaranteed rent B postcode, lease my property Birmingham",
  openGraph: {
    title: "Guaranteed Rent Birmingham | PropertyVault UK",
    description: "Lease your Birmingham property for 3-5 years — guaranteed rent every month, no voids, no management.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/guaranteed-rent/birmingham/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Guaranteed Rent Birmingham — PropertyVault UK" }],
  },
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/guaranteed-rent/birmingham/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Guaranteed Rent Birmingham",
  description: "Guaranteed rent for landlords in Birmingham. We lease your property for 3-5 years with guaranteed monthly income. No voids, no management, no fees.",
  url: "https://www.propertyvaultuk.co.uk/guaranteed-rent/birmingham/",
  provider: {
    "@type": "Organization",
    name: "PropertyVault UK",
    url: "https://www.propertyvaultuk.co.uk",
    email: "gowads047@gmail.com",
    areaServed: { "@type": "City", name: "Birmingham", sameAs: "https://en.wikipedia.org/wiki/Birmingham" },
  },
  serviceType: "Guaranteed Rent Property Leasing",
  areaServed: { "@type": "City", name: "Birmingham" },
  availableChannel: {
    "@type": "ServiceChannel",
    serviceUrl: "https://www.propertyvaultuk.co.uk/guaranteed-rent/birmingham/",
  },
};

export default function BirminghamPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="gradient-navy relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0"><div className="absolute top-10 right-[10%] w-[300px] h-[300px] bg-gold-400/5 rounded-full blur-[80px]" /></div>
        <div className="container-max px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-gold-400 text-sm font-semibold mb-6">
            <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
            Birmingham
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>
            Guaranteed Rent in Birmingham
          </h1>
          <p className="text-lg text-navy-200 max-w-2xl mx-auto mb-8">
            Lease your Birmingham property and receive guaranteed rent every month for 3-5 years. No voids, no management, no letting agent fees.
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
          <h2 className="text-2xl font-extrabold text-navy-800 mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Guaranteed Rent Across Birmingham</h2>
          <p className="text-navy-600 leading-relaxed mb-4">We are actively leasing properties across all Birmingham postcodes. Whether you own a 1-bed flat in the Jewellery Quarter or a 4-bed house in Erdington, we can offer you a guaranteed monthly rent with a 3-5 year lease.</p>
          <p className="text-navy-600 leading-relaxed mb-6">Every property we lease is managed to the same standard for the length of the term — rent paid monthly whether or not it is occupied, gas, electrical and EPC certification kept current, and regular inspections throughout.</p>

          <h3 className="font-bold text-navy-800 mb-3">Areas We Cover in Birmingham</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-8">
            {["Erdington", "Aston", "Small Heath", "Sparkhill", "Sparkbrook", "Handsworth", "Perry Barr", "Lozells", "Tyseley", "Kings Heath", "Moseley", "Edgbaston", "Harborne", "Selly Oak", "Bordesley Green", "Alum Rock", "Ward End", "Stechford", "Yardley", "Acocks Green", "Hall Green", "Sheldon"].map((area) => (
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
                    <td className="px-4 py-3 text-center text-navy-600">£950</td>
                    <td className="px-4 py-3 text-center text-navy-600">£11,400</td>
                  </tr>
                  <tr className="border-b border-navy-100 bg-navy-50/50">
                    <td className="px-4 py-3 text-navy-700 font-medium">After agent fees + voids</td>
                    <td className="px-4 py-3 text-center text-navy-500">£780</td>
                    <td className="px-4 py-3 text-center text-navy-500">£9,360</td>
                  </tr>
                  <tr className="bg-gold-50 border-b-2 border-gold-400">
                    <td className="px-4 py-3 text-navy-800 font-bold">Guaranteed rent (PropertyVault)</td>
                    <td className="px-4 py-3 text-center text-gold-600 font-bold">£840</td>
                    <td className="px-4 py-3 text-center text-gold-600 font-bold">£10,080</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-navy-400 mt-2">Figures based on typical 3-bed terraced house in Birmingham. Agent fee assumed at 10% + 1 month average void per year.</p>
          </div>

          <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-6 text-white text-center">
            <p className="text-gold-400 font-bold text-sm mb-2">Birmingham Landlord?</p>
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
              q: "How much guaranteed rent will I receive for my Birmingham property?",
              a: "Guaranteed rent amounts depend on your property type, size, and location within Birmingham. For a typical 3-bed terraced house we offer around £840 per month — paid every month regardless of occupancy. Contact us for a free, no-obligation quote specific to your property.",
            },
            {
              q: "Which areas of Birmingham does PropertyVault UK cover?",
              a: "We cover all Birmingham postcodes including Erdington, Sparkhill, Handsworth, Small Heath, Aston, Kings Heath, Moseley, Selly Oak, Edgbaston, Acocks Green, Hall Green, Yardley, and all surrounding B postcode areas. If you're unsure, contact us and we'll confirm immediately.",
            },
            {
              q: "How quickly can I start receiving guaranteed rent in Birmingham?",
              a: "Once we've assessed your property and agreed terms, most Birmingham landlords are up and running within 7–14 days. We handle all the paperwork, inspection, and tenant placement — you simply sign the lease and start receiving rent on your agreed payment date.",
            },
            {
              q: "Who handles maintenance and repairs at my Birmingham property?",
              a: "We handle the day-to-day: tenant-reported repairs, general wear and tear, and routine maintenance through our local Birmingham contractor network — at our cost, for the length of the lease. As the owner you remain responsible for the building structure, buildings insurance, the boiler, and any major electrical work. We arrange and coordinate those too, and always notify you in advance, but the cost sits with you as it would under any lease.",
            },
            {
              q: "Can I sell my Birmingham property during the guaranteed rent lease?",
              a: "Yes. If you wish to sell during the lease period, we can discuss your options including early lease termination terms or selling the property with the lease in place (which can be attractive to buy-to-let investors). We aim to be flexible and work with landlords who need to exit.",
            },
          ]} />
        </div>
      </section>
    </>
  );
}
