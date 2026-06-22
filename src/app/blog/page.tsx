import Link from "next/link";
import type { Metadata } from "next";
import { BlogList } from "@/components/blog/BlogList";

export const metadata: Metadata = {
  title: "Property Blog — Expert UK Property Investment Insights | PropertyVault UK",
  description: "Expert property investment articles. BRRR strategy, guaranteed rent, Section 24, HMO investing, stamp duty, first-time buyer guides, and EPC deadline explained.",
  keywords: "property blog UK, property investment articles, BRRR guide, guaranteed rent explained, Section 24 explained, HMO investing",
};

const articles = [
  {
    title: "UK Property Market 2026 — What Investors Need to Know",
    excerpt: "The market has shifted. Mortgage rates, house prices, rental demand, and what it means for your next deal — an honest look at where we are.",
    href: "/blog/uk-property-market-2026",
    category: "Market",
    readTime: "8 min",
    date: "June 2026",
    featured: true,
  },
  {
    title: "The Biggest Financial Lie in Britain Is Unravelling",
    excerpt: "For 40 years, Britain believed property prices would always rise. That assumption is now failing. The market isn't crashing — it's freezing. And that could be worse.",
    href: "/blog/biggest-financial-lie-britain",
    category: "Opinion",
    readTime: "12 min",
    date: "June 2026",
  },
  {
    title: "What Is the BRRR Strategy? A Complete UK Guide",
    excerpt: "Buy, Refurbish, Rent, Refinance explained — how it works, example deal, risks, and how to model your first BRRR deal with our free calculator.",
    href: "/blog/brrr-strategy-explained",
    category: "Investing",
    readTime: "8 min",
    date: "June 2026",
  },
  {
    title: "Guaranteed Rent Explained — Is It Worth It for Landlords?",
    excerpt: "How guaranteed rent works, the real income comparison (you may actually earn more), pros and cons, and who it's best for.",
    href: "/blog/guaranteed-rent-explained",
    category: "Landlords",
    readTime: "7 min",
    date: "June 2026",
  },
  {
    title: "Section 24 Explained — How It Affects Your Tax Bill",
    excerpt: "Understanding the mortgage interest restriction, how it impacts different tax bands, and whether an SPV structure could save you money.",
    href: "/blog/section-24-explained",
    category: "Tax",
    readTime: "6 min",
    date: "June 2026",
  },
  {
    title: "HMO Investing UK — Is It Still Profitable?",
    excerpt: "HMO licensing, minimum room sizes, fire safety requirements, yield comparison with single-lets, and whether HMOs still make financial sense.",
    href: "/blog/hmo-investing-uk",
    category: "Investing",
    readTime: "7 min",
    date: "June 2026",
  },
  {
    title: "Stamp Duty UK — Complete Guide to Current Rates",
    excerpt: "Current SDLT rates from April 2025, first-time buyer relief, additional property surcharge (+5%), and how to calculate your bill.",
    href: "/blog/stamp-duty-guide",
    category: "Finance",
    readTime: "5 min",
    date: "June 2026",
  },
  {
    title: "First-Time Buyer Guide — Step by Step",
    excerpt: "From saving a deposit and getting an AIP to completing your purchase. LISA, stamp duty relief, budgeting, and what to expect.",
    href: "/blog/first-time-buyer-guide",
    category: "Buying",
    readTime: "6 min",
    date: "June 2026",
  },
  {
    title: "Personal vs Limited Company — Which Is Better for BTL?",
    excerpt: "Side-by-side tax comparison of holding property personally versus through an SPV. Corporation tax, dividend tax, and when each makes sense.",
    href: "/blog/personal-vs-limited-company",
    category: "Tax",
    readTime: "7 min",
    date: "June 2026",
  },
  {
    title: "Guaranteed Rent vs Traditional Letting — Full Comparison",
    excerpt: "Side-by-side comparison of guaranteed rent vs traditional letting. Real income numbers, risk analysis, and which option suits your situation.",
    href: "/blog/guaranteed-rent-vs-traditional-letting",
    category: "Comparison",
    readTime: "6 min",
    date: "June 2026",
  },
  {
    title: "EPC C Deadline — What Landlords Need to Know",
    excerpt: "The proposed EPC C requirement for rental properties. Improvement costs, available grants, and how to prepare your portfolio.",
    href: "/blog/epc-c-deadline-landlords",
    category: "Landlords",
    readTime: "6 min",
    date: "June 2026",
  },
];

export default function BlogPage() {
  return (
    <>
      <section className="bg-white py-16 md:py-24">
        <div className="container-max px-4">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest mb-3">Blog</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-navy-800 mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Property Insights</h1>
            <p className="text-navy-500">Expert articles on UK property investing, tax, mortgages, and landlord compliance. Every article is fact-checked and links to our free calculators and tools.</p>
          </div>
        </div>
      </section>

      <div className="border-t border-navy-100" />

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          <BlogList articles={articles} />
        </div>
      </section>
    </>
  );
}
