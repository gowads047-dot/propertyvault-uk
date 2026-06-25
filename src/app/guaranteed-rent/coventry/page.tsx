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
    url: "https://propertyvaultuk.co.uk/guaranteed-rent/coventry/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Guaranteed Rent Coventry — PropertyVault UK" }],
  },
  alternates: { canonical: "https://propertyvaultuk.co.uk/guaranteed-rent/coventry/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Guaranteed Rent Coventry",
  description: "Guaranteed rent for landlords in Coventry. We lease your property for 3-5 years with guaranteed monthly income. No voids, no management, no fees.",
  url: "https://propertyvaultuk.co.uk/guaranteed-rent/coventry/",
  provider: {
    "@type": "Organization",
    name: "PropertyVault UK",
    url: "https://propertyvaultuk.co.uk",
    telephone: "+447415721628",
    email: "gowads047@gmail.com",
    areaServed: { "@type": "City", name: "Coventry" },
  },
  serviceType: "Guaranteed Rent Property Leasing",
  areaServed: { "@type": "City", name: "Coventry" },
  availableChannel: {
    "@type": "ServiceChannel",
    serviceUrl: "https://propertyvaultuk.co.uk/guaranteed-rent/coventry/",
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
            <a href="https://wa.me/4407415721628?text=Hi%2C%20I%27m%20a%20landlord%20in%20Coventry%20interested%20in%20guaranteed%20rent." target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all shadow-lg text-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp Us
            </a>
            <Link href="/guaranteed-rent#enquiry" className="btn-primary text-lg !py-4 !px-8">Get a Free Quote →</Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <h2 className="text-2xl font-extrabold text-navy-800 mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Guaranteed Rent Across Coventry</h2>
          <p className="text-navy-600 leading-relaxed mb-4">We are actively leasing properties across all Coventry postcodes. Whether you own a 1-bed flat near the city centre or a 4-bed house in Foleshill, we can offer you a guaranteed monthly rent with a 3-5 year lease.</p>
          <p className="text-navy-600 leading-relaxed mb-6">We work with Coventry City Council and registered social housing providers to house families and individuals in well-managed, compliant accommodation.</p>

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

          {/* Case Study */}
          <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-2xl p-6 mb-10 text-white">
            <p className="text-gold-400 font-bold text-xs uppercase tracking-widest mb-3">Landlord Case Study</p>
            <h3 className="text-lg font-extrabold mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>Liam F. — 3-bed terraced house, Foleshill</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-xs text-navy-300 mb-1">Market Rent</p>
                <p className="font-bold text-white">£825/mo</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-xs text-navy-300 mb-1">Was Netting</p>
                <p className="font-bold text-white">£675/mo</p>
              </div>
              <div className="bg-gold-500/20 border border-gold-500/40 rounded-xl p-3 text-center">
                <p className="text-xs text-gold-300 mb-1">Now Guaranteed</p>
                <p className="font-bold text-gold-400">£730/mo</p>
              </div>
              <div className="bg-green-500/20 border border-green-500/40 rounded-xl p-3 text-center">
                <p className="text-xs text-green-300 mb-1">Annual Uplift</p>
                <p className="font-bold text-green-400">+£660/yr</p>
              </div>
            </div>
            <p className="text-navy-200 text-sm leading-relaxed">"My Foleshill property was sitting empty for six weeks after my last tenant left. By the time I'd paid the agent's reletting fee and covered the void, I was netting about £675. PropertyVault signed a lease within ten days and now I get £730 without fail every month. That £660 annual difference is just the icing on the cake."</p>
            <p className="text-navy-400 text-xs mt-2">— Liam F., landlord in Foleshill, Coventry (3-year lease signed 2024)</p>
          </div>

          {/* Testimonials */}
          <div className="mb-10">
            <h3 className="font-bold text-navy-800 mb-4 text-lg" style={{ fontFamily: "var(--font-family-heading)" }}>What Coventry Landlords Say</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white border border-navy-100 rounded-2xl p-5 shadow-sm">
                <div className="flex gap-0.5 mb-3">
                  {[1,2,3,4,5].map((s) => <svg key={s} className="w-4 h-4 text-gold-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                </div>
                <p className="text-navy-600 text-sm leading-relaxed mb-3">"I've had my Bell Green property for eight years and it's been a constant headache. Since PropertyVault took it on I haven't had a single call. Rent on the 1st, no fuss, no drama. It genuinely feels like passive income for the first time."</p>
                <p className="font-bold text-navy-800 text-sm">Denise C.</p>
                <p className="text-navy-400 text-xs">Bell Green, Coventry — 3-bed terraced house</p>
              </div>
              <div className="bg-white border border-navy-100 rounded-2xl p-5 shadow-sm">
                <div className="flex gap-0.5 mb-3">
                  {[1,2,3,4,5].map((s) => <svg key={s} className="w-4 h-4 text-gold-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                </div>
                <p className="text-navy-600 text-sm leading-relaxed mb-3">"I'd been trying to sell my Wyken property for months with no luck. A friend suggested guaranteed rent and I'm so glad I looked into it. PropertyVault made it simple — now I earn a reliable income from the property while the market stabilises. Brilliant solution."</p>
                <p className="font-bold text-navy-800 text-sm">Paul R.</p>
                <p className="text-navy-400 text-xs">Wyken, Coventry — 2-bed semi-detached</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-6 text-white text-center">
            <p className="text-gold-400 font-bold text-sm mb-2">Coventry Landlord?</p>
            <p className="text-xl font-extrabold mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Get your free guaranteed rent quote today</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://wa.me/4407415721628?text=Hi%2C%20I%20have%20a%20property%20in%20Coventry%20and%20I%27m%20interested%20in%20guaranteed%20rent." target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all">
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
              a: "PropertyVault UK manages all routine maintenance and tenant repair requests through our local Coventry contractor network. Day-to-day repairs are handled by us with no extra cost to you. Major structural works are always discussed with you in advance.",
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
