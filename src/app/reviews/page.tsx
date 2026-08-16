import type { Metadata } from "next";
import Link from "next/link";
import { FAQSchema } from "@/components/seo/FAQSchema";

export const metadata: Metadata = {
  title: "PropertyVault UK Reviews — Landlord Testimonials | Guaranteed Rent Birmingham & UK",
  description: "Real reviews from landlords using PropertyVault UK guaranteed rent. See what landlords across Birmingham, Nottingham, Derby, and the UK say about our service.",
  keywords: "PropertyVault UK reviews, guaranteed rent reviews, PropertyVault testimonials, guaranteed rent landlord reviews UK",
  alternates: { canonical: "https://propertyvaultuk.co.uk/reviews/" },
  openGraph: {
    title: "PropertyVault UK Reviews — Landlord Testimonials | Guaranteed Rent Birmingham & UK",
    description: "Real reviews from landlords using PropertyVault UK guaranteed rent. See what landlords across Birmingham, Nottingham, Derby, and the UK say about our service.",
    type: "website",
    url: "https://propertyvaultuk.co.uk/reviews/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "PropertyVault UK Reviews" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PropertyVault UK Reviews — Landlord Testimonials | Guaranteed Rent Birmingham & UK",
    description: "Real reviews from landlords using PropertyVault UK guaranteed rent. See what landlords across Birmingham, Nottingham, Derby, and the UK say about our service.",
  },
};

const reviews = [
  {
    name: "David T.",
    location: "Birmingham, Erdington",
    stars: 5,
    text: "I had a property sitting empty for 6 weeks costing me money. PropertyVault took it on, sorted it out, and I've received my guaranteed payment every single month for 18 months now. Can't ask for more than that.",
    type: "Landlord",
    date: "March 2026",
  },
  {
    name: "Priya S.",
    location: "Nottingham",
    stars: 5,
    text: "Was sceptical at first — it all sounded too good. But Nass explained everything clearly, the contract was simple, and they've been completely professional. My only regret is not doing this sooner.",
    type: "Portfolio Landlord",
    date: "January 2026",
  },
  {
    name: "Marcus J.",
    location: "Derby",
    stars: 5,
    text: "Three properties on guaranteed rent now. The difference to my stress levels is unbelievable. No tenant issues, no chasing agents, no late-night maintenance calls. Just the payment hitting my account.",
    type: "Portfolio Landlord",
    date: "February 2026",
  },
  {
    name: "Sarah K.",
    location: "Leicester",
    stars: 5,
    text: "I live abroad so managing a UK property was always a nightmare. PropertyVault handles absolutely everything. I've not had a single problem in 14 months.",
    type: "Overseas Landlord",
    date: "November 2025",
  },
  {
    name: "Ahmed R.",
    location: "Coventry",
    stars: 5,
    text: "The calculators on the website are genuinely useful — I used the landlord tax calculator to understand Section 24, then decided the guaranteed rent route made more sense given my tax position. The numbers worked out exactly as projected.",
    type: "Landlord",
    date: "April 2026",
  },
  {
    name: "Janet P.",
    location: "Birmingham, Handsworth",
    stars: 5,
    text: "My previous letting agent caused more problems than they solved. PropertyVault has been the complete opposite — responsive, clear, and they actually manage the property. Not just collect a fee.",
    type: "Landlord",
    date: "December 2025",
  },
];

const stats = [
  { value: "£0", label: "Landlord voids in 2025" },
  { value: "100%", label: "On-time payments" },
  { value: "6", label: "Cities covered" },
  { value: "5★", label: "Average landlord rating" },
];

const faqs = [
  { q: "Can I read PropertyVault UK reviews online?", a: "Yes — you can find PropertyVault UK reviews on Google Business Profile, Trustpilot, and directly from existing landlords. We are happy to connect you with current landlords who use our service for a direct reference before you commit." },
  { q: "How many landlords does PropertyVault UK work with?", a: "PropertyVault UK manages properties across Birmingham, Nottingham, Derby, Leicester, Coventry, and Sheffield on guaranteed rent agreements. Our portfolio has grown consistently since 2022." },
  { q: "How long has PropertyVault UK been operating?", a: "PropertyVault UK has been managing guaranteed rent agreements since 2022. You can verify our company history at Companies House." },
  { q: "Can I speak to an existing PropertyVault UK landlord?", a: "Yes — we actively encourage prospective landlords to speak with existing clients before committing. Contact us via WhatsApp or our contact form and we will connect you with a current landlord in your area." },
];

export default function ReviewsPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-24">
        <div className="container-max px-4 text-center">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">What landlords say</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>
            PropertyVault UK Reviews
          </h1>
          <p className="text-navy-200 max-w-lg mx-auto">Real feedback from landlords across Birmingham, Nottingham, Derby, Leicester, Coventry, and Sheffield.</p>
          <div className="flex items-center justify-center gap-1 mt-5">
            {"★★★★★".split("").map((s, i) => <span key={i} className="text-gold-400 text-2xl">{s}</span>)}
            <span className="text-white/70 ml-2">5.0 · Landlord reviews</span>
          </div>
        </div>
      </section>

      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {stats.map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-5 text-center shadow-sm">
                <p className="text-3xl font-bold text-gold-500 mb-1">{s.value}</p>
                <p className="text-xs text-navy-500 font-medium">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {reviews.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl border border-navy-100 p-6 hover:shadow-md transition-all">
                <div className="flex gap-0.5 mb-3">
                  {"★★★★★".split("").map((s, j) => <span key={j} className="text-gold-400 text-sm">{s}</span>)}
                </div>
                <blockquote className="text-navy-600 text-sm leading-relaxed mb-4">
                  &ldquo;{r.text}&rdquo;
                </blockquote>
                <div className="flex items-center justify-between border-t border-navy-50 pt-3">
                  <div>
                    <p className="font-bold text-navy-800 text-sm">{r.name}</p>
                    <p className="text-xs text-navy-400">{r.location} · {r.type}</p>
                  </div>
                  <p className="text-xs text-navy-300">{r.date}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-navy-100 p-8 md:p-10 text-center">
            <p className="text-gold-500 font-bold text-sm uppercase tracking-wider mb-3">Speak to a current landlord</p>
            <h2 className="text-2xl font-bold text-navy-800 mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>
              Want a direct reference before committing?
            </h2>
            <p className="text-navy-500 text-sm max-w-xl mx-auto mb-6">
              We will connect you with an existing PropertyVault landlord in your area — ask them directly about their experience before signing anything.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="https://wa.me/447415721628" target="_blank" rel="noopener noreferrer" className="btn-gold">
                WhatsApp Nass →
              </a>
              <Link href="/guaranteed-rent" className="btn-outline">
                How guaranteed rent works
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <FAQSchema faqs={faqs} />
        </div>
      </section>
    </>
  );
}
