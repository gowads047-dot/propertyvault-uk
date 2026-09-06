import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Property Community — Coming Soon | PropertyVault UK",
  description: "Join the PropertyVault community. Connect with UK property investors, share deals, ask questions, and network. Coming soon.",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/community/" },
  openGraph: {
    title: "Property Community — Coming Soon | PropertyVault UK",
    description: "Join the PropertyVault community. Connect with UK property investors, share deals, ask questions, and network. Coming soon.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/community/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "PropertyVault UK Community" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Community — Coming Soon | PropertyVault UK",
    description: "Join the PropertyVault community. Connect with UK property investors, share deals, ask questions, and network. Coming soon.",
  },
};

export default function CommunityPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-24">
        <div className="container-max px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-gold-400/10 border border-gold-400/30 rounded-full text-gold-400 text-sm font-medium mb-6">Coming Soon</span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">PropertyVault Community</h1>
            <p className="text-navy-200 text-lg">We&apos;re building a community for UK property investors. Discussion forums, networking groups, deal sharing, and events — all in one place.</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <h2 className="text-xl font-bold text-navy-800 mb-6 text-center">What&apos;s Coming</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {[
              { title: "Discussion Forum", desc: "Ask questions, share experiences, and get advice on deals, strategy, finance, and legal topics." },
              { title: "Networking Groups", desc: "Regional groups to connect with investors in your area for joint ventures and recommendations." },
              { title: "Deal Sharing", desc: "Share deals for feedback and analysis. Get opinions on pricing, yield, and potential issues." },
              { title: "Events Calendar", desc: "Property meetups, webinars, and workshops across the UK." },
            ].map((item) => (
              <div key={item.title} className="bg-navy-50 rounded-xl p-5">
                <h3 className="font-bold text-navy-800 mb-1">{item.title}</h3>
                <p className="text-sm text-navy-500">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border-2 border-gold-400/30 p-8 text-center">
            <h3 className="text-xl font-bold text-navy-800 mb-2">Join the Waiting List</h3>
            <p className="text-sm text-navy-500 mb-4">Be the first to access the PropertyVault Community when it launches.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input aria-label="Your email" type="email" placeholder="Your email" required
                className="flex-1 px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" />
              <button type="submit" className="btn-primary whitespace-nowrap">Join Waiting List</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
