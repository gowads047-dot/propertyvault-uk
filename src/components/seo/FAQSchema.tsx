export function FAQSchema({ faqs }: { faqs: { q: string; a: string }[] }) {
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
      <div className="space-y-3 mt-8">
        <h2 className="text-xl font-bold text-navy-800 mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Frequently Asked Questions</h2>
        {faqs.map((faq) => (
          <div key={faq.q} className="bg-white rounded-xl border border-navy-100/80 p-5">
            <h3 className="font-bold text-navy-800 mb-1 text-sm">{faq.q}</h3>
            <p className="text-sm text-navy-600">{faq.a}</p>
          </div>
        ))}
      </div>
    </>
  );
}
