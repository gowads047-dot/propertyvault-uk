/**
 * A page's FAQ list — the visible one, and nothing else.
 *
 * This used to also emit FAQPage JSON-LD on every page that had questions
 * (128 of them). Google withdrew FAQ rich results from everything but
 * government and health sites in August 2023; since then the markup earns
 * nothing and reads, to anyone who checks, as boilerplate stamped across
 * the site. The questions stay on the page for the people reading them.
 *
 * `visible` defaults to true because most pages rely on this for their FAQ
 * section. Pages that lay out their own list pass `visible={false}` and now
 * render nothing here.
 */
export function FAQList({ faqs, visible = true }: { faqs: { q: string; a: string }[]; visible?: boolean }) {
  if (!visible) return null;
  return (
    <div className="space-y-3 mt-8">
      <h2 className="text-xl font-bold text-navy-800 mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Frequently Asked Questions</h2>
      {faqs.map((faq) => (
        <div key={faq.q} className="bg-white rounded-xl border border-navy-100/80 p-5">
          <h3 className="font-bold text-navy-800 mb-1 text-sm">{faq.q}</h3>
          <p className="text-sm text-navy-600">{faq.a}</p>
        </div>
      ))}
    </div>
  );
}
