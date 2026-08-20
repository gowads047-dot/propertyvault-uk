import type { Metadata } from "next";
import Link from "next/link";
import { FAQSchema } from "@/components/seo/FAQSchema";

const DESC =
  "Ask to speak to a current PropertyVault UK landlord before you sign. We will put you in touch directly so you can hear about the service first-hand.";

export const metadata: Metadata = {
  title: "References — Speak to a PropertyVault UK Landlord | Guaranteed Rent",
  description: DESC,
  keywords: "PropertyVault UK references, guaranteed rent landlord reference, speak to a landlord",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/reviews/" },
  openGraph: {
    title: "References — Speak to a PropertyVault UK Landlord | Guaranteed Rent",
    description: DESC,
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/reviews/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "PropertyVault UK" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "References — Speak to a PropertyVault UK Landlord | Guaranteed Rent",
    description: DESC,
  },
};

const cities = ["Birmingham", "Nottingham", "Derby", "Leicester", "Coventry", "Sheffield"];

const faqs = [
  {
    q: "Can I speak to an existing PropertyVault UK landlord?",
    a: "Yes. We encourage prospective landlords to speak to a current client before committing. Contact us on WhatsApp or through the contact form and we will arrange an introduction so you can ask your questions directly, without us in the middle.",
  },
  {
    q: "Why aren't there testimonials on this page?",
    a: "We would rather you spoke to a real landlord than read a quote on our own website. We only publish feedback that a landlord has given us permission to attribute to them, so this page will stay as it is until we have that.",
  },
  {
    q: "What should I ask a reference?",
    a: "Whether payments arrived on the agreed date every month, how maintenance and tenant issues were handled, how quickly we responded when something went wrong, and what the property was like at the end of the term. Those four answers tell you most of what you need to know.",
  },
  {
    q: "What can I check independently?",
    a: "Ask us for our company registration number and look it up on the Companies House register, and ask to see the lease terms in full before you sign. Any guaranteed rent offer should be readable and specific about the payment date, the term, and what happens at the end of it.",
  },
];

export default function ReviewsPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-24">
        <div className="container-max px-4 text-center">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">References</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>
            Speak to a landlord, not a testimonial
          </h1>
          <p className="text-navy-200 max-w-xl mx-auto">
            We would rather introduce you to someone who already lets to us than show you a quote we wrote ourselves.
            Ask for a reference and we will arrange it.
          </p>
        </div>
      </section>

      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4 max-w-3xl">
          <div className="bg-white rounded-2xl border border-navy-100 p-8 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-navy-800 mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>
              How a reference works
            </h2>
            <ol className="space-y-4 text-navy-600 text-sm leading-relaxed">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-400/20 text-gold-600 font-bold text-xs flex items-center justify-center">1</span>
                <span>Tell us which area your property is in and roughly what you are considering.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-400/20 text-gold-600 font-bold text-xs flex items-center justify-center">2</span>
                <span>We ask a landlord we already work with whether they are happy to take a call, and pass on their details only if they agree.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-400/20 text-gold-600 font-bold text-xs flex items-center justify-center">3</span>
                <span>You speak to them directly. We are not on the call and we do not brief them on what to say.</span>
              </li>
            </ol>
          </div>

          <div className="bg-white rounded-2xl border border-navy-100 p-8 md:p-10 mb-8">
            <h2 className="text-xl font-bold text-navy-800 mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>
              Areas we cover
            </h2>
            <p className="text-navy-500 text-sm mb-4">Guaranteed rent enquiries are open in:</p>
            <div className="flex flex-wrap gap-2">
              {cities.map(c => (
                <span key={c} className="px-3 py-1.5 bg-navy-50 border border-navy-100 rounded-full text-navy-700 text-sm font-medium">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-navy-100 p-8 md:p-10 text-center">
            <p className="text-gold-500 font-bold text-sm uppercase tracking-wider mb-3">Ask for a reference</p>
            <h2 className="text-2xl font-bold text-navy-800 mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>
              Want to hear it from a landlord first?
            </h2>
            <p className="text-navy-500 text-sm max-w-xl mx-auto mb-6">
              Message us and we will arrange an introduction before you commit to anything.
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
