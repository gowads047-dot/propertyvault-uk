import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact PropertyVault UK — Get in Touch",
  description: "Contact the PropertyVault team. Questions, partnerships, advertising, press enquiries, and content contributions.",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/contact/" },
  openGraph: {
    title: "Contact PropertyVault UK — Get in Touch",
    description: "Contact the PropertyVault team. Questions, partnerships, advertising, press enquiries, and content contributions.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/contact/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Contact PropertyVault UK" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact PropertyVault UK — Get in Touch",
    description: "Contact the PropertyVault team. Questions, partnerships, advertising, press enquiries, and content contributions.",
  },
};

export default function ContactPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-20">
        <div className="container-max px-4">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">Contact</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Get in Touch</h1>
          <p className="text-navy-200">Have a question, partnership enquiry, or feedback? We would love to hear from you.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-xl font-bold text-navy-800 mb-6">Send Us a Message</h2>
              <ContactForm />
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-800 mb-6">Other Ways to Reach Us</h2>
              {/* One mailbox, so one box. This was four cards each naming a
                  different address on a domain with no mailbox behind it —
                  repeating the same address four times would read as a bug. */}
              <div className="space-y-6">
                <div className="bg-navy-50 rounded-xl p-5">
                  <h3 className="font-bold text-navy-800 mb-1">Email us</h3>
                  <p className="text-sm text-navy-600">
                    <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
                      {CONTACT_EMAIL}
                    </a>
                  </p>
                  <p className="text-sm text-navy-600 mt-2">
                    One address for everything — general questions, guaranteed rent, listing a
                    property, advertising and partnerships, press, and privacy or complaints. We aim
                    to reply within one working day.
                  </p>
                </div>
                <div className="bg-navy-50 rounded-xl p-5">
                  <h3 className="font-bold text-navy-800 mb-1">Writing for us</h3>
                  <p className="text-sm text-navy-600">
                    If you are a qualified professional and would like to contribute expert content,
                    email us with a short outline and your credentials.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

