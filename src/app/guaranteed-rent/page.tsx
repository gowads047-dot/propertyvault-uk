import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { GRQuoteWidget } from "@/components/guaranteed-rent/GRQuoteWidget";
import { EnquiryForm } from "@/components/guaranteed-rent/EnquiryForm";

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Guaranteed Rent Scheme",
  provider: {
    "@type": "LocalBusiness",
    name: "PropertyVault UK",
    url: "https://propertyvaultuk.co.uk",
  },
  description: "Fixed monthly rental income for landlords for 3–5 years with no voids, no management, and no arrears. PropertyVault UK pays you whether the property is occupied or not.",
  serviceType: "Guaranteed Rent",
  areaServed: [
    { "@type": "City", name: "Birmingham" },
    { "@type": "City", name: "Nottingham" },
    { "@type": "City", name: "Derby" },
    { "@type": "City", name: "Leicester" },
    { "@type": "City", name: "Coventry" },
    { "@type": "City", name: "Sheffield" },
  ],
  offers: {
    "@type": "Offer",
    description: "Free rent estimate — no obligation. Get a guaranteed rent figure for your property within 24 hours.",
    price: "0",
    priceCurrency: "GBP",
    url: "https://propertyvaultuk.co.uk/guaranteed-rent",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Guaranteed Rent Terms",
    itemListElement: [
      { "@type": "Offer", name: "3-Year Guaranteed Rent Lease" },
      { "@type": "Offer", name: "5-Year Guaranteed Rent Lease" },
    ],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://propertyvaultuk.co.uk" },
    { "@type": "ListItem", position: 2, name: "Guaranteed Rent", item: "https://propertyvaultuk.co.uk/guaranteed-rent" },
  ],
};

const guaranteedRentFaqs = [
  { q: "How much rent will I receive with guaranteed rent?", a: "Typically 80-90% of market rent. But when you factor in zero voids, zero agent fees, zero maintenance costs, and zero compliance spend, most landlords actually net more overall than self-managing." },
  { q: "Do I still own my property with guaranteed rent?", a: "Yes — you retain 100% ownership. We lease the property from you under a formal agreement, similar to a commercial tenant. You can sell at any time, subject to the lease terms." },
  { q: "What types of property qualify for guaranteed rent?", a: "Most residential properties qualify — houses, flats, bungalows, and HMOs from 1 bedroom upwards. The property must meet basic habitability and safety standards." },
  { q: "Who are the tenants in a guaranteed rent scheme?", a: "Tenants are sourced, referenced and managed entirely by our team. You have no direct contact with them — we handle referencing, day-to-day management, maintenance and any issues that arise for the length of the lease." },
  { q: "What about repairs and maintenance with guaranteed rent?", a: "We handle all day-to-day maintenance at our cost during the lease. Major structural issues (roof, subsidence) remain the property owner's responsibility, but we coordinate everything." },
  { q: "How long is a guaranteed rent lease?", a: "Typically 3-5 years. Longer leases provide greater income security and may attract a higher guaranteed rent amount." },
  { q: "How quickly can guaranteed rent start?", a: "Once you accept our offer, we can typically complete the lease within 7-14 days. Your first guaranteed rent payment follows shortly after." },
  { q: "What areas do you cover for guaranteed rent?", a: "We currently operate across Birmingham, Nottingham, Derby, Leicester, Coventry, and Sheffield — and the surrounding areas within approximately 30 minutes of each city centre." },
  { q: "Is guaranteed rent better than using a letting agent?", a: "For many landlords, yes. When you add up void periods, agent fees (8-12%), maintenance costs, and compliance spend, guaranteed rent at 80-90% of market rate often delivers more net income with zero effort." },
  { q: "What happens at the end of a guaranteed rent lease?", a: "Your property is returned in the condition it was at the start of the lease (fair wear and tear excepted). You can then renew the lease with us, let privately, or sell." },
];

export const metadata: Metadata = {
  title: "Guaranteed Rent for Landlords | PropertyVault UK",
  description: "Guaranteed rent for landlords across the Midlands. No voids, no management, guaranteed income for 3-5 years. Covering Birmingham, Nottingham, Derby, Leicester, Coventry and Sheffield.",
  alternates: { canonical: "https://propertyvaultuk.co.uk/guaranteed-rent/" },
  openGraph: {
    title: "Guaranteed Rent for Landlords | PropertyVault UK",
    description: "No voids, no management, guaranteed income for 3–5 years. We pay you every month whether the property is occupied or not.",
    type: "website",
    url: "https://propertyvaultuk.co.uk/guaranteed-rent/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Guaranteed Rent for Landlords" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guaranteed Rent for Landlords | PropertyVault UK",
    description: "No voids, no management, guaranteed income for 3–5 years across Birmingham, Nottingham, Derby, Leicester, Coventry and Sheffield.",
  },
};

export default function GuaranteedRentPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Hero */}
      <section className="gradient-navy relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-[10%] w-[400px] h-[400px] bg-gold-400/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 left-[5%] w-[300px] h-[300px] bg-navy-400/10 rounded-full blur-[80px]" />
        </div>
        <div className="container-max px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-gold-400 text-sm font-semibold mb-8">
              <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
              Birmingham · Nottingham · Derby · Leicester · Coventry · Sheffield
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-[1.1]" style={{ fontFamily: "var(--font-family-heading)" }}>
              Your Rent.
              <span className="block text-gradient-gold">Guaranteed.</span>
            </h1>
            <p className="text-xl text-navy-200 mb-4 max-w-2xl mx-auto">
              We lease your property and pay you every month for 3-5 years. No voids. No tenants to manage. No fees. Just income.
            </p>
            <p className="text-gold-400 font-bold text-lg mb-8">
              Even if the property sits empty — you still get paid.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://calendly.com/gowads047/30min" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold-400 text-navy-900 font-bold rounded-xl hover:bg-gold-300 transition-all shadow-lg text-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                Book a Free 15-Min Call
              </a>
              <a href="#enquiry" className="btn-primary text-center text-lg !py-4 !px-10">
                Get a Rent Estimate →
              </a>
              <a href="https://wa.me/447415721628?text=Hi%2C%20I%27m%20a%20landlord%20interested%20in%20guaranteed%20rent.%20Can%20you%20tell%20me%20more%3F" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all shadow-lg text-base">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Point Banner */}
      <section className="bg-red-50 border-y border-red-200">
        <div className="container-max px-4 py-5">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-red-700 font-medium text-center">
            <span>Chasing late rent?</span>
            <span>Property sitting empty?</span>
            <span>Midnight maintenance calls?</span>
            <span>Paying agent fees?</span>
            <span>Compliance headaches?</span>
          </div>
          <p className="text-center text-red-800 font-bold mt-2">All of this disappears with guaranteed rent.</p>
        </div>
      </section>

      {/* What You Get */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          <div className="text-center mb-10">
            <p className="text-gold-600 font-bold text-xs uppercase tracking-widest mb-2">The Deal</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy-800" style={{ fontFamily: "var(--font-family-heading)" }}>Here&apos;s What You Get</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Guaranteed Monthly Rent", desc: "Same amount. Same date. Every single month. Whether the property is occupied or not." },
              { title: "No Void Periods For You", desc: "Your rent is paid on the same date each month for the length of the lease, whether or not the property is occupied." },
              { title: "We Handle Everything", desc: "Tenant sourcing, management, maintenance, compliance, inspections — all us." },
              { title: "No Agent Fees", desc: "No tenant-find fees. No management percentage. No renewal charges. No hidden costs." },
              { title: "3-5 Year Lease", desc: "Long-term security. One agreement. Guaranteed income for years, not months." },
              { title: "Property Protected", desc: "Regular inspections. Professional management. Returned in condition at end of lease." },
            ].map((b) => (
              <div key={b.title} className="bg-white rounded-2xl border border-navy-100 p-6 card-hover">
                <h3 className="font-bold text-navy-800 mb-1">{b.title}</h3>
                <p className="text-sm text-navy-500">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Numbers */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <div className="text-center mb-8">
            <p className="text-gold-600 font-bold text-xs uppercase tracking-widest mb-2">The Maths</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-navy-800" style={{ fontFamily: "var(--font-family-heading)" }}>You Actually Earn More</h2>
            <p className="text-navy-500 mt-2">When you add up voids, agent fees, maintenance, and compliance — guaranteed rent usually puts more money in your pocket.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-navy-50"><th className="text-left p-3 font-semibold"></th><th className="text-left p-3 font-semibold">Self-Managing</th><th className="text-left p-3 font-semibold text-gold-700">Guaranteed Rent</th></tr></thead>
              <tbody>
                {[
                  ["Market rent (£1,000/month)", "£12,000", "—"],
                  ["Guaranteed rent (£850/month)", "—", "£10,200"],
                  ["Void periods (3 weeks)", "-£692", "£0"],
                  ["Letting agent fees (10%)", "-£1,200", "£0"],
                  ["Maintenance & repairs", "-£600", "£0"],
                  ["Compliance costs", "-£300", "£0"],
                  ["Tenant-find fee", "-£500", "£0"],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-navy-100"><td className="p-3 font-medium text-navy-800">{row[0]}</td><td className="p-3 text-navy-600">{row[1]}</td><td className="p-3 text-gold-700 font-semibold">{row[2]}</td></tr>
                ))}
                <tr className="bg-navy-50"><td className="p-3 font-bold text-navy-800">Your actual annual income</td><td className="p-3 font-bold text-navy-800">£8,708</td><td className="p-3 font-bold text-gold-700 text-lg">£10,200</td></tr>
                <tr className="bg-green-50"><td className="p-3 font-bold text-green-800">You earn MORE with guaranteed rent</td><td className="p-3"></td><td className="p-3 font-bold text-green-700">+£1,492/year</td></tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 bg-navy-50 rounded-xl p-4 text-xs text-navy-500 space-y-1">
            <p className="font-semibold text-navy-700 mb-2">Assumptions used in this example</p>
            <p>• Market rent: £1,000/month (£12,000/year)</p>
            <p>• Guaranteed rent offered: 85% of market = £850/month (£10,200/year)</p>
            <p>• Voids: industry average 2.7 weeks/year = £692 lost income</p>
            <p>• Agent fees: 10% management = £1,200/year</p>
            <p>• Maintenance & repairs: RICS estimate avg £600/year for a 2-bed</p>
            <p>• Compliance: gas/EICON/EPC/EICR prorated avg = £300/year</p>
            <p>• Tenant-find fee: one-time £500 amortised over typical 1.5yr tenancy</p>
            <p className="pt-1 italic">Your actual figures will vary. Request a personalised estimate for your property.</p>
          </div>
          <div className="text-center mt-6">
            <Link href="/blog/guaranteed-rent-vs-traditional-letting" className="text-sm font-semibold text-gold-600 hover:text-gold-700 transition-colors">Read the full comparison: Guaranteed Rent vs Traditional Letting →</Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-navy-50/40">
        <div className="container-max max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-navy-800" style={{ fontFamily: "var(--font-family-heading)" }}>How It Works</h2>
          </div>
          <div className="space-y-5">
            {[
              { step: "1", title: "Get in touch", desc: "Fill in the form below or WhatsApp us. Tell us about your property. We respond within 24 hours." },
              { step: "2", title: "Free property visit", desc: "We visit your property — no cost, no obligation. We assess the condition and rental potential." },
              { step: "3", title: "Receive your offer", desc: "Within 48 hours, you get a guaranteed rent offer. Take as long as you need to decide." },
              { step: "4", title: "Sign and start earning", desc: "Accept the offer, sign the lease, and your guaranteed rent starts immediately." },
            ].map((s) => (
              <div key={s.step} className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 gradient-navy rounded-2xl flex items-center justify-center shadow-md">
                  <span className="text-gold-400 font-extrabold text-lg">{s.step}</span>
                </div>
                <div>
                  <h3 className="font-bold text-navy-800 text-lg">{s.title}</h3>
                  <p className="text-sm text-navy-500 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="section-padding gradient-navy">
        <div className="container-max text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>Areas We Cover</h2>
          <p className="text-navy-200 text-sm mb-8">We are actively looking for properties in these areas right now.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { city: "Birmingham", areas: "Edgbaston, Erdington, Handsworth, Small Heath, Sparkhill, Aston, Kings Heath, Moseley, and all B postcodes", href: "/guaranteed-rent/birmingham" },
              { city: "Nottingham", areas: "Hyson Green, Sneinton, Radford, Bulwell, Bestwood, Lenton, Beeston, Carlton, and all NG postcodes", href: "/guaranteed-rent/nottingham" },
              { city: "Derby", areas: "Normanton, Pear Tree, Chaddesden, Spondon, Littleover, Alvaston, Chellaston, and all DE postcodes", href: "/guaranteed-rent/derby" },
              { city: "Leicester", areas: "Highfields, Evington, Belgrave, Braunstone, Beaumont Leys, Aylestone, North Evington, and all LE postcodes", href: "/guaranteed-rent/leicester" },
              { city: "Coventry", areas: "Foleshill, Stoke, Hillfields, Radford, Tile Hill, Wood End, Binley, Earlsdon, and all CV postcodes", href: "/guaranteed-rent/coventry" },
              { city: "Sheffield", areas: "Burngreave, Firth Park, Hillsborough, Walkley, Crookes, Heeley, Meersbrook, and all S postcodes", href: "/guaranteed-rent/sheffield" },
            ].map((c) => (
              <a key={c.city} href={c.href} className="glass rounded-2xl p-6 text-left hover:bg-white/10 transition-all block">
                <h3 className="font-extrabold text-gold-400 text-xl mb-2" style={{ fontFamily: "var(--font-family-heading)" }}>{c.city}</h3>
                <p className="text-sm text-navy-200 mb-2">{c.areas}</p>
                <span className="text-xs font-semibold text-gold-400">View {c.city} details →</span>
              </a>
            ))}
          </div>
          {/* Expansion waitlist */}
          <div className="mt-10 max-w-xl mx-auto glass rounded-2xl p-6 text-center">
            <p className="text-xs font-bold text-gold-400 uppercase tracking-widest mb-2">Coming Soon</p>
            <h3 className="text-lg font-extrabold text-white mb-2" style={{ fontFamily: "var(--font-family-heading)" }}>Outside the Midlands?</h3>
            <p className="text-sm text-navy-200 mb-4">We are expanding. Get on the waitlist and be first to know when we launch in your area.</p>
            <a href={`https://wa.me/447415721628?text=${encodeURIComponent("Hi, I'm interested in guaranteed rent for my property but I'm outside the Midlands. I'd like to be added to your expansion waitlist.")}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold text-sm px-6 py-3 rounded-xl transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Join the waitlist on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* FAQs with Schema */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <FAQSchema faqs={guaranteedRentFaqs} />
        </div>
      </section>

      {/* Instant Quote Widget */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <div className="text-center mb-8">
            <p className="text-gold-600 font-bold text-xs uppercase tracking-widest mb-2">Try it now</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-navy-800" style={{ fontFamily: "var(--font-family-heading)" }}>
              See What We&apos;d Pay You
            </h2>
            <p className="text-navy-500 text-sm mt-2">2 questions. Instant estimate. No sign-up needed.</p>
          </div>
          <GRQuoteWidget />
        </div>
      </section>

      {/* Enquiry Form */}
      <section id="enquiry" className="section-padding bg-navy-50/40">
        <div className="container-max max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-navy-800" style={{ fontFamily: "var(--font-family-heading)" }}>Book Your Free Valuation</h2>
            <p className="text-navy-500 text-sm mt-2">Choose how you&apos;d like to get started — we respond within 2 hours.</p>
          </div>

          {/* Dual contact CTA */}
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            <a href="https://calendly.com/gowads047/30min" target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 px-6 py-5 bg-navy-800 text-white font-bold rounded-2xl hover:bg-navy-700 transition-all shadow-xl hover:-translate-y-1 text-center group">
              <svg className="w-7 h-7 text-gold-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
              <span className="text-base">Book a Free 15-Min Call</span>
              <span className="text-xs text-navy-300 font-normal">Pick a time that suits you</span>
            </a>
            <a href="https://wa.me/447415721628?text=Hi%2C%20I%27m%20a%20landlord%20interested%20in%20guaranteed%20rent.%20Can%20you%20tell%20me%20more%3F" target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 px-6 py-5 bg-green-500 text-white font-bold rounded-2xl hover:bg-green-600 transition-all shadow-xl hover:-translate-y-1 text-center">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <span className="text-base">Message on WhatsApp</span>
              <span className="text-xs text-green-100 font-normal">Instant reply during business hours</span>
            </a>
          </div>

          <p className="text-navy-400 text-xs text-center mb-4">— or fill in the form and we&apos;ll contact you —</p>

          <EnquiryForm />
        </div>
      </section>

      {/* Final urgency CTA */}
      <section className="gradient-navy py-12">
        <div className="container-max max-w-2xl text-center px-4">
          <p className="text-gold-400 font-bold text-sm mb-2">Don&apos;t let another month of rent slip away</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Every month without guaranteed rent is money you&apos;re losing.</h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://calendly.com/gowads047/30min" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold-400 text-navy-900 font-bold rounded-xl hover:bg-gold-300 transition-all shadow-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
              Book a Free Call
            </a>
            <a href="#enquiry" className="btn-primary !py-4 !px-8">Get a Free Quote →</a>
            <a href="https://wa.me/447415721628?text=Hi%2C%20I%27m%20interested%20in%20guaranteed%20rent%20for%20my%20property." target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          <Disclaimer type="general" />
        </div>
      </section>
    </>
  );
}



