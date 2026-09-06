import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility Statement — PropertyVault UK",
  description: "PropertyVault UK accessibility statement. Our commitment to making our website accessible to all users.",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/accessibility/" },
  openGraph: {
    title: "Accessibility Statement — PropertyVault UK",
    description: "PropertyVault UK accessibility statement. Our commitment to making our website accessible to all users.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/accessibility/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Accessibility Statement — PropertyVault UK", description: "PropertyVault UK accessibility statement. Our commitment to making our website accessible to all users." },
};

export default function AccessibilityPage() {
  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Accessibility Statement</h1>
          <p className="text-navy-200 text-sm">Last updated: 6 September 2026</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl prose-sm text-navy-600 leading-relaxed space-y-8">
          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">Our Commitment</h2>
            <p>PropertyVault UK is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply the relevant accessibility standards.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">Conformance Status</h2>
            <p>We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.2 at Level AA. These guidelines explain how to make web content more accessible for people with disabilities and more user-friendly for everyone.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">Measures We Take</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Semantic HTML markup for proper document structure and screen reader compatibility</li>
              <li>Sufficient colour contrast ratios between text and backgrounds (minimum 4.5:1 for normal text)</li>
              <li>Alt text for all meaningful images</li>
              <li>Keyboard navigation support for all interactive elements</li>
              <li>ARIA labels and roles where native HTML semantics are insufficient</li>
              <li>Responsive design that works across screen sizes and orientations</li>
              <li>Focus indicators visible on all interactive elements</li>
              <li>Form labels associated with their input fields, so a screen reader announces what each one is for — checked across every public form</li>
              <li>Error messages that clearly identify and describe errors</li>
              <li>Content that does not rely solely on colour to convey information</li>
              <li>Text resizable up to 200% without loss of content or functionality</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">Known Limitations</h2>
            <p>
              These are the things we currently know fall short. It is a real list rather than a
              formality — if you hit something that is not on it, please tell us and it will be.
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>
                <strong>Some form fields in the landlord dashboard.</strong> A screen reader
                announces them without saying what they are for. Every form on the public site —
                the calculators, the document templates, the contact and enquiry forms — was
                checked and corrected in September 2026, and the signed-in dashboard is being
                worked through the same way.
              </li>
              <li>Some interactive calculator charts have limited screen reader support — the results are also given as text</li>
              <li>Some third-party embedded content may not meet all accessibility standards</li>
              <li>PDF downloads may have limited accessibility — we are working to provide accessible alternatives</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">Feedback</h2>
            <p>We welcome your feedback on the accessibility of PropertyVault UK. If you encounter accessibility barriers or have suggestions for improvement, please contact us:</p>
            <p className="mt-2"><strong>Email:</strong> info@propertyvaultuk.co.uk<br />
            We aim to respond to accessibility feedback within 5 working days.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">Enforcement</h2>
            <p>If you are not satisfied with our response, you can contact the Equality Advisory and Support Service (EASS) at equalityadvisoryservice.com or the Equality and Human Rights Commission (EHRC) at equalityhumanrights.com.</p>
          </div>
        </div>
      </section>
    </>
  );
}

