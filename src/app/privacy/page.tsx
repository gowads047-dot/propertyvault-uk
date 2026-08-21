import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — PropertyVault UK",
  description: "PropertyVault UK privacy policy. How we collect, use, store, and protect your personal data under UK GDPR and the Data Protection Act 2018.",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/privacy/" },
  openGraph: {
    title: "Privacy Policy — PropertyVault UK",
    description: "PropertyVault UK privacy policy. How we collect, use, store, and protect your personal data under UK GDPR and the Data Protection Act 2018.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/privacy/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Privacy Policy — PropertyVault UK", description: "PropertyVault UK privacy policy. How we collect, use, store, and protect your personal data under UK GDPR and the Data Protection Act 2018." },
};

export default function PrivacyPage() {
  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-navy-200 text-sm">Last updated: June 2026</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl prose-sm text-navy-600 leading-relaxed space-y-8">
          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">1. Introduction</h2>
            <p>PropertyVault UK (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, store, and share your personal information when you use our website at propertyvaultuk.co.uk (the &ldquo;Site&rdquo;) and our services.</p>
            <p className="mt-2">We are the data controller for the purposes of the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. If you have questions about this policy or your personal data, contact us at privacy@propertyvault.uk.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">2. Information We Collect</h2>
            <h3 className="text-lg font-bold text-navy-800 mt-4 mb-2">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Account registration:</strong> name, email address, and password when you create an account</li>
              <li><strong>Newsletter subscription:</strong> email address and optional first name</li>
              <li><strong>Contact forms:</strong> name, email, and message content when you contact us</li>
              <li><strong>Event registration:</strong> name, email, and any additional information you provide</li>
              <li><strong>Payment information:</strong> processed securely through Stripe — we do not store your full card details on our servers</li>
              <li><strong>Forum and community:</strong> any content you voluntarily post in our community areas</li>
              <li><strong>Calculator data:</strong> if you save calculator results to your account</li>
            </ul>

            <h3 className="text-lg font-bold text-navy-800 mt-4 mb-2">2.2 Information Collected Automatically</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Device and browser information:</strong> IP address (anonymised), browser type, operating system, screen resolution</li>
              <li><strong>Usage data:</strong> pages visited, time spent, referring URLs, click patterns</li>
              <li><strong>Cookies and similar technologies:</strong> see our Cookie Policy below</li>
              <li><strong>Location data:</strong> approximate location derived from IP address (country/region level only)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">3. How We Use Your Information</h2>
            <p>We process your personal data on the following lawful bases under UK GDPR:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Contract performance (Article 6(1)(b)):</strong> to provide your account, membership, and purchased services</li>
              <li><strong>Legitimate interests (Article 6(1)(f)):</strong> to improve our Site, analyse usage patterns, prevent fraud, and send relevant content recommendations</li>
              <li><strong>Consent (Article 6(1)(a)):</strong> to send marketing emails (you can withdraw consent at any time)</li>
              <li><strong>Legal obligation (Article 6(1)(c)):</strong> to comply with applicable laws, regulations, and legal processes</li>
            </ul>
            <p className="mt-2">Specifically, we use your data to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-1">
              <li>Provide, maintain, and improve our services</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send our newsletter and marketing communications (with your consent)</li>
              <li>Respond to your enquiries and provide customer support</li>
              <li>Analyse Site usage to improve user experience</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">4. Data Sharing</h2>
            <p>We do not sell your personal data. We may share your information with:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Service providers:</strong> hosting (Vercel), payment processing (Stripe), email delivery, analytics — all bound by data processing agreements</li>
              <li><strong>Affiliate partners:</strong> if you click an affiliate link, the partner may receive a referral identifier — not your personal data</li>
              <li><strong>Legal authorities:</strong> if required by law, court order, or to protect our legal rights</li>
              <li><strong>Business transfers:</strong> in connection with a merger, acquisition, or sale of assets</li>
            </ul>
            <p className="mt-2"><strong>International transfers:</strong> Some of our service providers may process data outside the UK. Where this occurs, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses (SCCs) approved by the ICO, or the service provider is located in a country with an adequacy decision.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">5. Data Retention</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Account data:</strong> retained for the duration of your account and for 2 years after deletion, unless longer retention is required by law</li>
              <li><strong>Newsletter subscribers:</strong> retained until you unsubscribe</li>
              <li><strong>Contact form submissions:</strong> retained for 12 months</li>
              <li><strong>Analytics data:</strong> aggregated and anonymised, retained indefinitely</li>
              <li><strong>Payment records:</strong> retained for 7 years as required by HMRC</li>
              <li><strong>Forum posts:</strong> retained until you delete them or request deletion</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">6. Your Rights Under UK GDPR</h2>
            <p>You have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Right of access:</strong> request a copy of the personal data we hold about you</li>
              <li><strong>Right to rectification:</strong> request correction of inaccurate or incomplete data</li>
              <li><strong>Right to erasure:</strong> request deletion of your personal data (subject to legal retention requirements)</li>
              <li><strong>Right to restrict processing:</strong> request that we limit how we use your data</li>
              <li><strong>Right to data portability:</strong> receive your data in a structured, machine-readable format</li>
              <li><strong>Right to object:</strong> object to processing based on legitimate interests or for direct marketing</li>
              <li><strong>Right to withdraw consent:</strong> where processing is based on consent, you can withdraw it at any time</li>
              <li><strong>Rights related to automated decision-making:</strong> we do not make solely automated decisions that significantly affect you</li>
            </ul>
            <p className="mt-2">To exercise any of these rights, contact us at privacy@propertyvault.uk. We will respond within one month. If you are not satisfied with our response, you have the right to lodge a complaint with the Information Commissioner&apos;s Office (ICO) at ico.org.uk.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">7. Cookies</h2>
            <p>We use cookies and similar technologies to improve your experience, analyse usage, and deliver relevant content. See our full Cookie Policy at <a href="/cookies" className="text-gold-600 font-semibold">/cookies</a> for details on what cookies we use, their purposes, and how to manage your preferences.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">8. Children&apos;s Privacy</h2>
            <p>Our Site is not intended for individuals under the age of 18. We do not knowingly collect personal data from children. If you believe we have collected data from a child, please contact us immediately at privacy@propertyvault.uk.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">9. Security</h2>
            <p>We implement appropriate technical and organisational measures to protect your personal data, including encryption in transit (TLS/SSL), secure password hashing, access controls, and regular security reviews. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of material changes by posting a notice on our Site or by email. The &ldquo;Last updated&rdquo; date at the top of this page indicates the latest revision.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">11. Contact</h2>
            <p>For privacy-related enquiries or to exercise your rights:</p>
            <p className="mt-2"><strong>Data Controller:</strong> PropertyVault UK<br />
            <strong>Email:</strong> privacy@propertyvault.uk</p>
          </div>
        </div>
      </section>
    </>
  );
}

