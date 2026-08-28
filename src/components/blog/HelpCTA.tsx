import Link from "next/link";
import { WHATSAPP_HELP_URL, CALENDLY_URL } from "@/lib/contact";

/**
 * The offer at the foot of a blog post.
 *
 * Deliberately not a "work with me" page. Someone who has just read 2,000 words
 * on Section 24 or BRRR is already thinking about their own situation; a page
 * they would have to go and find is a page they do not visit. This meets them
 * where the question formed.
 *
 * The copy claims nothing that cannot be stood behind. No number of people
 * helped, no outcomes, no testimonials, no pricing — those would all be
 * invented. What is true is that the author has been buying and letting since
 * 2013, and that a reader can send a message and get an answer.
 *
 * The WhatsApp link carries its own prefilled text so the message arrives with
 * context, rather than reusing the guaranteed-rent one, which would put a
 * first-time buyer into a landlord funnel.
 */
export function HelpCTA({ dir = "ltr" }: { dir?: "ltr" | "rtl" }) {
  const ar = dir === "rtl";

  return (
    <aside
      dir={dir}
      className="mt-12 rounded-2xl p-6 sm:p-8"
      style={{ background: "var(--card-surface)", border: "1.5px solid var(--hairline)" }}
    >
      <p
        className="text-xs font-bold uppercase tracking-widest mb-2"
        style={{ color: "var(--gold-ink)" }}
      >
        {ar ? "هل تحتاج مساعدة؟" : "Working this out for yourself?"}
      </p>

      <h2 className="text-xl sm:text-2xl font-extrabold mb-3" style={{ color: "var(--ink)" }}>
        {ar ? "يمكنني مساعدتك في البداية" : "I can help you get started"}
      </h2>

      <p className="leading-relaxed mb-5" style={{ color: "var(--ink-muted)" }}>
        {ar
          ? "أستثمر في العقارات البريطانية منذ عام 2013 — بما في ذلك الأخطاء. إذا كنت تفكر في أول عملية شراء، أو في استراتيجية BRRR، أو في الشراء من الخارج، أرسل لي رسالة تشرح فيها أين وصلت وسأوجهك."
          : "I have been buying and letting UK property since 2013 — including the mistakes. If you are weighing up a first purchase, a BRRR, or buying from overseas, send me a message telling me where you are up to and I will point you in the right direction."}
      </p>

      <div className="flex flex-wrap gap-3">
        <a
          href={WHATSAPP_HELP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-bold text-sm"
          style={{ background: "#25d366", color: "#0b2e18" }}
        >
          {ar ? "راسلني على واتساب" : "Message me on WhatsApp"}
        </a>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-bold text-sm"
          style={{ background: "var(--ink)", color: "var(--page-surface)" }}
        >
          {ar ? "احجز مكالمة" : "Book a call"}
        </a>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-sm"
          style={{ border: "1.5px solid var(--hairline)", color: "var(--ink-muted)" }}
        >
          {ar ? "أو أرسل بريدًا" : "Or send an email"}
        </Link>
      </div>
    </aside>
  );
}
