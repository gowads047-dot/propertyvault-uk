import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy — PropertyVault UK",
  description: "PropertyVault UK cookie policy. What cookies we use, why we use them, and how to manage your cookie preferences.",
  alternates: { canonical: "https://propertyvaultuk.co.uk/cookies/" },
  openGraph: {
    title: "Cookie Policy — PropertyVault UK",
    description: "PropertyVault UK cookie policy. What cookies we use, why we use them, and how to manage your cookie preferences.",
    type: "website",
    url: "https://propertyvaultuk.co.uk/cookies/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Cookie Policy — PropertyVault UK", description: "PropertyVault UK cookie policy. What cookies we use, why we use them, and how to manage your cookie preferences." },
};

export default function CookiesPage() {
  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Cookie Policy</h1>
          <p className="text-navy-200 text-sm">Last updated: June 2026</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl prose-sm text-navy-600 leading-relaxed space-y-8">
          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">What Are Cookies?</h2>
            <p>Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work efficiently, provide analytics information, and remember your preferences. Under UK law (the Privacy and Electronic Communications Regulations 2003, as amended), we must tell you about the cookies we use and obtain your consent for non-essential cookies.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">Cookies We Use</h2>

            <h3 className="text-lg font-bold text-navy-800 mt-4 mb-2">Strictly Necessary Cookies</h3>
            <p>These cookies are essential for the Site to function and cannot be switched off. They include:</p>
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-sm border-collapse">
                <thead><tr className="bg-navy-50"><th className="text-left p-3 font-semibold">Cookie</th><th className="text-left p-3 font-semibold">Purpose</th><th className="text-left p-3 font-semibold">Duration</th></tr></thead>
                <tbody>
                  <tr className="border-b border-navy-100"><td className="p-3">__clerk_session</td><td className="p-3">Authentication session management</td><td className="p-3">Session</td></tr>
                  <tr className="border-b border-navy-100"><td className="p-3">cookie_consent</td><td className="p-3">Stores your cookie preference</td><td className="p-3">1 year</td></tr>
                  <tr><td className="p-3">__stripe_mid</td><td className="p-3">Fraud prevention for payments</td><td className="p-3">1 year</td></tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-bold text-navy-800 mt-6 mb-2">Analytics Cookies</h3>
            <p>These cookies help us understand how visitors interact with the Site. All data is aggregated and anonymised. We use these cookies only with your consent.</p>
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-sm border-collapse">
                <thead><tr className="bg-navy-50"><th className="text-left p-3 font-semibold">Cookie</th><th className="text-left p-3 font-semibold">Purpose</th><th className="text-left p-3 font-semibold">Duration</th></tr></thead>
                <tbody>
                  <tr className="border-b border-navy-100"><td className="p-3">_ga</td><td className="p-3">Google Analytics — distinguishes users</td><td className="p-3">2 years</td></tr>
                  <tr className="border-b border-navy-100"><td className="p-3">_ga_*</td><td className="p-3">Google Analytics — maintains session state</td><td className="p-3">2 years</td></tr>
                  <tr><td className="p-3">_gid</td><td className="p-3">Google Analytics — distinguishes users</td><td className="p-3">24 hours</td></tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-bold text-navy-800 mt-6 mb-2">Marketing Cookies</h3>
            <p>These cookies may be set by our advertising partners to build a profile of your interests and show relevant adverts on other sites. We use these cookies only with your consent.</p>
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-sm border-collapse">
                <thead><tr className="bg-navy-50"><th className="text-left p-3 font-semibold">Cookie</th><th className="text-left p-3 font-semibold">Purpose</th><th className="text-left p-3 font-semibold">Duration</th></tr></thead>
                <tbody>
                  <tr className="border-b border-navy-100"><td className="p-3">_fbp</td><td className="p-3">Facebook — ad measurement and targeting</td><td className="p-3">3 months</td></tr>
                  <tr><td className="p-3">_gcl_au</td><td className="p-3">Google Ads — conversion tracking</td><td className="p-3">3 months</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">Managing Your Cookie Preferences</h2>
            <p>When you first visit our Site, you will see a cookie consent banner allowing you to accept or reject non-essential cookies. You can change your preferences at any time by clicking &ldquo;Cookie Settings&rdquo; in the footer.</p>
            <p className="mt-2">You can also control cookies through your browser settings. Most browsers allow you to block or delete cookies. However, blocking essential cookies may affect the functionality of the Site.</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
              <li><strong>Firefox:</strong> Settings → Privacy &amp; Security → Cookies</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
              <li><strong>Edge:</strong> Settings → Cookies and Site Permissions</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">Changes to This Policy</h2>
            <p>We may update this Cookie Policy to reflect changes in the cookies we use or for legal reasons. Check this page periodically for updates.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">Contact</h2>
            <p>For questions about our cookie usage, contact privacy@propertyvault.uk.</p>
          </div>
        </div>
      </section>
    </>
  );
}

