/**
 * FAQPage schema, with an optional rendered list.
 *
 * `visible` defaults to true because most pages rely on this for their FAQ
 * section. Pages that lay out their own list must pass `visible={false}`:
 * fifty-five of them did not, and rendered every question twice — once in
 * their own markup and once here — which is duplicate content on the page
 * and a second "Frequently Asked Questions" heading in the outline.
 */
export function FAQSchema({ faqs, visible = true }: { faqs: { q: string; a: string }[]; visible?: boolean }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {visible && <div className="space-y-3 mt-8">
        <h2 className="text-xl font-bold text-navy-800 mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Frequently Asked Questions</h2>
        {faqs.map((faq) => (
          <div key={faq.q} className="bg-white rounded-xl border border-navy-100/80 p-5">
            <h3 className="font-bold text-navy-800 mb-1 text-sm">{faq.q}</h3>
            <p className="text-sm text-navy-600">{faq.a}</p>
          </div>
        ))}
      </div>}
    </>
  );
}
