import type { Metadata } from "next";
import { BlogList } from "@/components/blog/BlogList";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Property Investment Blog | PropertyVault UK",
  description: "Expert property investment articles. BRRR strategy, guaranteed rent, Section 24, HMO investing, stamp duty, leasehold, rent-to-rent, deal sourcing, and more.",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/blog/" },
  openGraph: {
    title: "Property Investment Blog | PropertyVault UK",
    description: "Expert property investment articles. BRRR strategy, guaranteed rent, Section 24, HMO investing, stamp duty, leasehold, rent-to-rent, deal sourcing, and more.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/blog/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "PropertyVault UK Property Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Investment Blog | PropertyVault UK",
    description: "Expert property investment articles. BRRR strategy, guaranteed rent, Section 24, HMO investing, stamp duty, leasehold, rent-to-rent, deal sourcing, and more.",
  },
};

const articles = [
  {
    title: "دليل شراء العقارات في المملكة المتحدة",
    excerpt: "كل ما تحتاج معرفته قبل شراء عقار في بريطانيا — من الرهن العقاري والضرائب إلى المحامي والتفاوض على السعر. دليل شامل للمشترين العرب.",
    href: "/blog/dalil-shira-aqar-uk",
    category: "Arabic",
    readTime: "12 min",
    date: "2 August 2026",
    featured: true,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1400&q=80",
  },
  {
    title: "التمويل الإسلامي والرهن العقاري الحلال في المملكة المتحدة",
    excerpt: "مقارنة كاملة بين منتجات التمويل الإسلامي (المرابحة، الإجارة، المشاركة المتناقصة) والرهن التقليدي — وأفضل بنوك الرهن الحلال في بريطانيا.",
    href: "/blog/tamwil-islami-uk",
    category: "Arabic",
    readTime: "10 min",
    date: "2 August 2026",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
  },
  {
    title: "الاستثمار العقاري في بريطانيا من خارج المملكة المتحدة",
    excerpt: "دليل المستثمر العربي غير المقيم — الضرائب، فتح حساب بنكي، أفضل المدن للعائد، والإدارة عن بُعد عبر الإيجار المضمون.",
    href: "/blog/istihtmar-aqari-uk-min-kharij",
    category: "Arabic",
    readTime: "11 min",
    date: "2 August 2026",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
  },
  {
    title: "حقوق المستأجر في المملكة المتحدة 2025",
    excerpt: "كل ما يحتاج معرفته المستأجر العربي — إلغاء Section 21، قواعد رفع الإيجار، الوديعة، ومتى وكيف تشتكي.",
    href: "/blog/hquq-almustajir-uk",
    category: "Arabic",
    readTime: "10 min",
    date: "2 August 2026",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
  },
  {
    title: "PRS Ombudsman Registration — What Every Landlord Must Do Now",
    excerpt: "All private landlords in England must register with the PRS Ombudsman under the Renters' Rights Act 2025. Failure is a criminal offence with fines up to £5,000 per property.",
    href: "/blog/prs-ombudsman-landlord-registration",
    category: "Landlords",
    readTime: "7 min",
    date: "1 August 2026",
    featured: true,
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1400&q=80",
  },
  {
    title: "Best Areas to Invest in Leicester 2026 — BTL Hotspot Guide",
    excerpt: "Yields, average prices, tenant demand, and regeneration prospects — ranked and explained for property investors looking at Leicester in 2026.",
    href: "/blog/best-areas-invest-leicester-2026",
    category: "Investing",
    readTime: "9 min",
    date: "1 August 2026",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
  },
  {
    title: "Leasehold Property Explained — The Complete UK Buyer's Guide",
    excerpt: "Everything UK buyers need to know about leasehold: lease lengths, extension costs, ground rent risks, marriage value, and how to avoid the most expensive mistakes.",
    href: "/blog/leasehold-explained",
    category: "Buying",
    readTime: "7 min",
    date: "5 July 2026",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80",
  },
  {
    title: "Rent-to-Rent Explained — The Complete UK Guide 2026",
    excerpt: "You don't need a six-figure deposit to build a property income. Rent-to-Rent lets you control properties, collect rent, and profit — without a mortgage. The full picture for 2026.",
    href: "/blog/rent-to-rent-explained",
    category: "Investing",
    readTime: "10 min",
    date: "5 July 2026",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
  },
  {
    title: "How to Start Investing in UK Property: A Beginner's Guide (2026)",
    excerpt: "Not the highlight reel version. What property investing actually costs, which strategy suits where you're starting from, and how to know if a deal is worth doing before you spend a penny.",
    href: "/blog/how-to-start-investing-in-uk-property",
    category: "Investing",
    readTime: "14 min",
    date: "26 June 2026",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80",
  },
  {
    title: "Renters' Rights Act 2025 — The Landlord Checklist",
    excerpt: "12 practical actions every landlord must take now that the Renters' Rights Act is live. Section 21 is gone — here is exactly what to do instead.",
    href: "/blog/renters-reform-act-landlord-checklist",
    category: "Landlords",
    readTime: "9 min",
    date: "25 June 2026",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
  },
  {
    title: "How to Pass the BTL Mortgage Stress Test",
    excerpt: "Your deal is cash-flow positive but the lender says no. Here is exactly why stress tests work the way they do — and 6 strategies to get your deal approved.",
    href: "/blog/how-to-pass-btl-mortgage-stress-test",
    category: "Finance",
    readTime: "8 min",
    date: "25 June 2026",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
  },
  {
    title: "Best Areas to Invest in Birmingham 2026 — BTL Hotspot Guide",
    excerpt: "Yields, average prices, tenant demand, and regeneration prospects — ranked and explained for property investors looking at Birmingham in 2026.",
    href: "/blog/best-areas-invest-birmingham-2026",
    category: "Investing",
    readTime: "9 min",
    date: "June 2026",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80",
  },
  {
    title: "Best Areas to Invest in Sheffield 2026 — BTL Hotspot Guide",
    excerpt: "Yields, average prices, tenant demand, and regeneration prospects — ranked and explained for property investors looking at Sheffield in 2026.",
    href: "/blog/best-areas-invest-sheffield-2026",
    category: "Investing",
    readTime: "9 min",
    date: "June 2026",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
  },
  {
    title: "Best Areas to Invest in Nottingham 2026 — BTL Hotspot Guide",
    excerpt: "Yields, average prices, tenant demand, and regeneration prospects — ranked and explained for property investors looking at Nottingham in 2026.",
    href: "/blog/best-areas-invest-nottingham-2026",
    category: "Investing",
    readTime: "9 min",
    date: "June 2026",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
  {
    title: "Best Areas to Invest in Derby 2026 — BTL Hotspot Guide",
    excerpt: "Yields, average prices, tenant demand, and regeneration prospects — ranked and explained for property investors looking at Derby in 2026.",
    href: "/blog/best-areas-invest-derby-2026",
    category: "Investing",
    readTime: "9 min",
    date: "June 2026",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
  },
  {
    title: "Deal Sourcing UK — Complete Beginner Guide 2026",
    excerpt: "What deal sourcing actually is, how much you can earn, what's legal, and how to get started — even with no money and no experience.",
    href: "/blog/deal-sourcing-uk-guide",
    category: "Academy",
    readTime: "10 min",
    date: "June 2026",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  },
  {
    title: "Is Guaranteed Rent a Scam? An Honest Answer for Landlords",
    excerpt: "Landlords ask this question constantly. Here is an honest breakdown of how legitimate guaranteed rent works, what fraud looks like, and exactly what to check before signing.",
    href: "/blog/is-guaranteed-rent-a-scam",
    category: "Landlords",
    readTime: "7 min",
    date: "June 2026",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
  },
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
    excerpt: "The confirmed EPC C requirement (deadline 2030) for rental properties. Improvement costs, available grants, and how to prepare your portfolio.",
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
          <Breadcrumbs items={[{ label: "Blog" }]} />
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a84c", display: "inline-block" }} />
                  PropertyVault Blog
                </span>
              </div>
              <h1 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, color: "white", lineHeight: 1.06, letterSpacing: "-0.025em", marginBottom: 16 }}>
                UK property investing<br />
                <span style={{ color: "#c9a84c" }}>guides that pay off.</span>
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
