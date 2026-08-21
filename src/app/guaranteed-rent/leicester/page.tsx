import type { Metadata } from "next";
import Link from "next/link";
import { FAQSchema } from "@/components/seo/FAQSchema";

export const metadata: Metadata = {
  title: "Guaranteed Rent Leicester — Landlords Get Paid Every Month | PropertyVault UK",
  description: "Guaranteed rent for landlords in Leicester. We lease your property for 3-5 years with guaranteed monthly income. No voids, no management, no fees. All Leicester postcodes covered.",
  keywords: "guaranteed rent Leicester, guaranteed rent scheme Leicester, landlord guaranteed rent LE postcode, lease my property Leicester",
  openGraph: {
    title: "Guaranteed Rent Leicester | PropertyVault UK",
    description: "Lease your Leicester property for 3-5 years — guaranteed rent every month, no voids, no management.",
    type: "website",
    url: "https://propertyvaultuk.co.uk/guaranteed-rent/leicester/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Guaranteed Rent Leicester — PropertyVault UK" }],
  },
  alternates: { canonical: "https://propertyvaultuk.co.uk/guaranteed-rent/leicester/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Guaranteed Rent Leicester",
  description: "Guaranteed rent for landlords in Leicester. We lease your property for 3-5 years with guaranteed monthly income. No voids, no management, no fees.",
  url: "https://propertyvaultuk.co.uk/guaranteed-rent/leicester/",
  provider: {
    "@type": "Organization",
    name: "PropertyVault UK",
    url: "https://propertyvaultuk.co.uk",
    telephone: "+447415721628",
    email: "gowads047@gmail.com",
    areaServed: { "@type": "City", name: "Leicester" },
  },
  serviceType: "Guaranteed Rent Property Leasing",
  areaServed: { "@type": "City", name: "Leicester" },
  availableChannel: {
    "@type": "ServiceChannel",
    serviceUrl: "https://propertyvaultuk.co.uk/guaranteed-rent/leicester/",
  },
};

export default function LeicesterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="gradient-navy relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0"><div className="absolute top-10 right-[10%] w-[300px] h-[300px] bg-gold-400/5 rounded-full blur-[80px]" /></div>
        <div className="container-max px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-gold-400 text-sm font-semibold mb-6">
            <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
            Leicester
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>
            Guaranteed Rent in Leicester
          </h1>
          <p className="text-lg text-navy-200 max-w-2xl mx-auto mb-8">
            Lease your Leicester property and receive guaranteed rent every month for 3-5 years. No voids, no management, no letting agent fees.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://wa.me/447415721628?text=Hi%2C%20I%27m%20a%20landlord%20in%20Leicester%20interested%20in%20guaranteed%20rent." target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all shadow-lg text-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp Us
            </a>
            <Link href="/guaranteed-rent#enquiry" className="btn-primary text-lg !py-4 !px-8">Get a Free Quote →</Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <h2 className="text-2xl font-extrabold text-navy-800 mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Guaranteed Rent Across Leicester</h2>
          <p className="text-navy-600 leading-relaxed mb-4">We are actively leasing properties across all Leicester postcodes. Whether you own a 1-bed flat in the city centre or a 4-bed house in Belgrave, we can offer you a guaranteed monthly rent with a 3-5 year lease.</p>
          <p className="text-navy-600 leading-relaxed mb-6">Every property we lease is managed to the same standard for the length of the term — rent paid monthly whether or not it is occupied, gas, electrical and EPC certification kept current, and regular inspections throughout.</p>

          <h3 className="font-bold text-navy-800 mb-3">Areas We Cover in Leicester</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-8">
            {["Belgrave", "Highfields", "Braunstone", "Evington", "Spinney Hills", "Westcotes", "New Parks", "Beaumont Leys", "Aylestone", "Knighton", "Stoneygate", "Clarendon Park", "Saffron Lane", "Hamilton", "Rushey Mead", "Humberstone", "Wigston", "Oadby", "Blaby", "Thurmaston", "Syston", "Loughborough"].map((area) => (
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
                    <td className="px-4 py-3 text-center text-navy-600">£875</td>
                    <td className="px-4 py-3 text-center text-navy-600">£10,500</td>
                  </tr>
                  <tr className="border-b border-navy-100 bg-navy-50/50">
                    <td className="px-4 py-3 text-navy-700 font-medium">After agent fees + voids</td>
                    <td className="px-4 py-3 text-center text-navy-500">£720</td>
                    <td className="px-4 py-3 text-center text-navy-500">£8,640</td>
                  </tr>
                  <tr className="bg-gold-50 border-b-2 border-gold-400">
                    <td className="px-4 py-3 text-navy-800 font-bold">Guaranteed rent (PropertyVault)</td>
                    <td className="px-4 py-3 text-center text-gold-600 font-bold">£775</td>
                    <td className="px-4 py-3 text-center text-gold-600 font-bold">£9,300</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-navy-400 mt-2">Figures based on typical 3-bed terraced house in Leicester. Agent fee assumed at 10% + 1 month average void per year.</p>
          </div>

          <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-6 text-white text-center">
            <p className="text-gold-400 font-bold text-sm mb-2">Leicester Landlord?</p>
            <p className="text-xl font-extrabold mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Get your free guaranteed rent quote today</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://wa.me/447415721628?text=Hi%2C%20I%20have%20a%20property%20in%20Leicester%20and%20I%27m%20interested%20in%20guaranteed%20rent." target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
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
              q: "How much guaranteed rent will I receive for my Leicester property?",
              a: "Our offer is based on your property's size, condition, and location in Leicester. For a typical 3-bed terraced house in areas like Belgrave or Highfields we offer around £775 per month — guaranteed every month with no voids and no agent fees deducted. Contact us for a free, no-obligation quote.",
            },
            {
              q: "Which areas of Leicester does PropertyVault UK cover?",
              a: "We cover all Leicester postcodes including Belgrave, Highfields, Braunstone, Evington, Spinney Hills, New Parks, Beaumont Leys, Aylestone, Saffron Lane, Rushey Mead, Humberstone, Wigston, Oadby, and all surrounding LE postcode areas. Contact us to confirm your area.",
            },
            {
              q: "How quickly can I start receiving guaranteed rent in Leicester?",
              a: "Most Leicester landlords are up and running within 7–14 days of first contact. We carry out a quick property inspection, draft the lease agreement, and set up your payment schedule — there are no long queues or complex processes to navigate.",
            },
            {
              q: "Who handles maintenance and repairs at my Leicester property?",
              a: "We handle all routine maintenance and day-to-day repairs through our local Leicester contractor network. Minor works are covered by PropertyVault UK at no cost to you. For any major repairs we'll always consult you beforehand as stipulated in your lease.",
            },
            {
              q: "Can I sell my Leicester property during the guaranteed rent lease?",
              a: "Yes. If your circumstances change and you need to sell, we can discuss early termination options or arrange a sale with the lease in place — an attractive proposition for many buy-to-let investors. We work flexibly with landlords who need to make changes.",
            },
          ]} />
        </div>
      </section>
    </>
  );
}
