import Link from "next/link";
import type { Metadata } from "next";
import { BlogList } from "@/components/blog/BlogList";

export const metadata: Metadata = {
  title: "Property Blog — Expert UK Property Investment Insights | PropertyVault UK",
  description: "Expert property investment articles. BRRR strategy, guaranteed rent, Section 24, HMO investing, stamp duty, first-time buyer guides, and EPC deadline explained.",
};

const articles = [
  {
    title: "Renters' Rights Act 2025 — What Every Landlord Needs to Know",
    excerpt: "Section 21 abolished, fixed-term tenancies gone, rent increases capped, pets allowed. The complete guide for UK landlords on what changed and what to do now.",
    href: "/blog/renters-rights-act",
    category: "Landlords",
    readTime: "10 min",
    date: "18 June 2026",
    featured: true,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&q=80",
  },
  {
    title: "UK Property Market 2026 — What Investors Need to Know",
    excerpt: "The market has shifted. Mortgage rates, house prices, rental demand, and what it means for your next deal — an honest look at where we are.",
    href: "/blog/uk-property-market-2026",
    category: "Market",
    readTime: "8 min",
    date: "11 June 2026",
    featured: true,
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1400&q=80",
  },
  {
    title: "The Biggest Financial Lie in Britain Is Unravelling",
    excerpt: "For 40 years, Britain believed property prices would always rise. That assumption is now failing. The market isn't crashing — it's freezing. And that could be worse.",
    href: "/blog/biggest-financial-lie-britain",
    category: "Opinion",
    readTime: "12 min",
    date: "3 June 2026",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
  },
  {
    title: "What Is the BRRR Strategy? A Complete UK Guide",
    excerpt: "Buy, Refurbish, Rent, Refinance explained — how it works, example deal, risks, and how to model your first BRRR deal with our free calculator.",
    href: "/blog/brrr-strategy-explained",
    category: "Investing",
    readTime: "8 min",
    date: "21 May 2026",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
  {
    title: "Guaranteed Rent Explained — Is It Worth It for Landlords?",
    excerpt: "How guaranteed rent works, the real income comparison, pros and cons, and who it's best for.",
    href: "/blog/guaranteed-rent-explained",
    category: "Landlords",
    readTime: "7 min",
    date: "8 May 2026",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
  },
  {
    title: "Section 24 Explained — How It Affects Your Tax Bill",
    excerpt: "Understanding the mortgage interest restriction, how it impacts different tax bands, and whether an SPV structure could save you money.",
    href: "/blog/section-24-explained",
    category: "Tax",
    readTime: "6 min",
    date: "24 April 2026",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
  },
  {
    title: "HMO Investing UK — Is It Still Profitable?",
    excerpt: "HMO licensing, minimum room sizes, fire safety requirements, yield comparison with single-lets, and whether HMOs still make financial sense.",
    href: "/blog/hmo-investing-uk",
    category: "Investing",
    readTime: "7 min",
    date: "10 April 2026",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  },
  {
    title: "Stamp Duty UK — Complete Guide to Current Rates",
    excerpt: "Current SDLT rates from April 2025, first-time buyer relief, additional property surcharge (+5%), and how to calculate your bill.",
    href: "/blog/stamp-duty-guide",
    category: "Finance",
    readTime: "5 min",
    date: "26 March 2026",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
  },
  {
    title: "First-Time Buyer Guide — Step by Step",
    excerpt: "From saving a deposit and getting an AIP to completing your purchase. LISA, stamp duty relief, budgeting, and what to expect.",
    href: "/blog/first-time-buyer-guide",
    category: "Buying",
    readTime: "6 min",
    date: "12 March 2026",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
  },
  {
    title: "Personal vs Limited Company — Which Is Better for BTL?",
    excerpt: "Side-by-side tax comparison of holding property personally versus through an SPV. Corporation tax, dividend tax, and when each makes sense.",
    href: "/blog/personal-vs-limited-company",
    category: "Tax",
    readTime: "7 min",
    date: "19 February 2026",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  },
  {
    title: "Guaranteed Rent vs Traditional Letting — Full Comparison",
    excerpt: "Side-by-side comparison of guaranteed rent vs traditional letting. Real income numbers, risk analysis, and which option suits your situation.",
    href: "/blog/guaranteed-rent-vs-traditional-letting",
    category: "Comparison",
    readTime: "6 min",
    date: "5 February 2026",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
  },
  {
    title: "EPC C Deadline — What Landlords Need to Know",
    excerpt: "The proposed EPC C requirement for rental properties. Improvement costs, available grants, and how to prepare your portfolio.",
    href: "/blog/epc-c-deadline-landlords",
    category: "Landlords",
    readTime: "6 min",
    date: "22 January 2026",
    image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=800&q=80",
  },
];

export default function BlogPage() {
  const categories = Array.from(new Set(articles.map(a => a.category)));

  return (
    <>
      {/* Hero */}
      <section style={{ background: "#0f1b36", position: "relative", overflow: "hidden", padding: "64px 0 56px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
        {/* Radial glow */}
        <div style={{ position: "absolute", top: "-30%", left: "60%", width: 600, height: 600, background: "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="container-max px-4" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a84c", display: "inline-block" }} />
                  PropertyVault Blog
                </span>
              </div>
              <h1 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, color: "white", lineHeight: 1.06, letterSpacing: "-0.025em", marginBottom: 16 }}>
                Property knowledge<br />
                <span style={{ color: "#c9a84c" }}>that pays off.</span>
              </h1>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", maxWidth: 440, lineHeight: 1.7 }}>
                Expert guides on UK property investing, tax, landlord law, and deal sourcing. Every article links to our free tools and calculators.
              </p>
            </div>
            {/* Stats strip */}
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[
                { value: `${articles.length}`, label: "Articles" },
                { value: `${categories.length}`, label: "Topics" },
                { value: "Free", label: "Always" },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 28, fontWeight: 800, color: "white", lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 600, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog grid */}
      <section style={{ background: "#f8fafc", padding: "48px 0 80px" }}>
        <div className="container-max px-4" style={{ maxWidth: 1100 }}>
          <BlogList articles={articles} />
        </div>
      </section>
    </>
  );
}
