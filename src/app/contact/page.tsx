import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact PropertyVault UK — Get in Touch",
  description: "Contact the PropertyVault team. Questions, partnerships, advertising, press enquiries, and content contributions.",
  alternates: { canonical: "https://propertyvaultuk.co.uk/contact/" },
  openGraph: {
    title: "Contact PropertyVault UK — Get in Touch",
    description: "Contact the PropertyVault team. Questions, partnerships, advertising, press enquiries, and content contributions.",
    type: "website",
    url: "https://propertyvaultuk.co.uk/contact/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Contact PropertyVault UK" }],
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
              <form className="space-y-4" action="https://formsubmit.co/gowads047@gmail.com" method="POST">
                <input type="hidden" name="_subject" value="New enquiry from PropertyVault" />
                <input type="hidden" name="_next" value="https://propertyvaultuk.co.uk/contact/?sent=true" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="text" name="_honey" style={{ display: "none" }} />
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Your Name</label>
                  <input type="text" name="name" required className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Email Address</label>
                  <input type="email" name="email" required className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Subject</label>
                  <select name="subject" className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white">
                    <option>General Enquiry</option>
                    <option>Guaranteed Rent Enquiry</option>
                    <option>Property Listing</option>
                    <option>Advertising &amp; Partnerships</option>
                    <option>Feedback</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Message</label>
                  <textarea rows={5} name="message" required className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none" />
                </div>
                <button type="submit" className="btn-primary w-full">Send Message</button>
              </form>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-800 mb-6">Other Ways to Reach Us</h2>
              <div className="space-y-6">
                <div className="bg-navy-50 rounded-xl p-5">
                  <h3 className="font-bold text-navy-800 mb-1">General Enquiries</h3>
                  <p className="text-sm text-navy-600">gowads047@gmail.com</p>
                  
                </div>
                <div className="bg-navy-50 rounded-xl p-5">
                  <h3 className="font-bold text-navy-800 mb-1">Advertising & Partnerships</h3>
                  <p className="text-sm text-navy-600">partnerships@propertyvault.uk</p>
                </div>
                <div className="bg-navy-50 rounded-xl p-5">
                  <h3 className="font-bold text-navy-800 mb-1">Press & Media</h3>
                  <p className="text-sm text-navy-600">press@propertyvault.uk</p>
                </div>
                <div className="bg-navy-50 rounded-xl p-5">
                  <h3 className="font-bold text-navy-800 mb-1">Content Contributions</h3>
                  <p className="text-sm text-navy-600">If you are a qualified professional and would like to contribute expert content, contact editorial@propertyvault.uk</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

