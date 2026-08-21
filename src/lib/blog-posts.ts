/**
 * The blog index - one entry per post under src/app/blog.
 *
 * This was a local const inside src/app/blog/page.tsx, so nothing else could
 * read it. Related-article links and Article schema both need this data, and
 * duplicating it per post is how dates and categories drift apart.
 */

export type BlogPost = {
  title: string;
  excerpt: string;
  href: string;
  category: string;
  readTime: string;
  date: string;
  featured?: boolean;
  image: string;
};

export const blogPosts: BlogPost[] = [
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

/** Slug for a post href, e.g. "/blog/foo" -> "foo". */
export function slugOf(post: BlogPost): string {
  return post.href.replace(/^\/blog\//, "").replace(/\/$/, "");
}

/** The Arabic posts are categorised "Arabic"; everything else is English. */
function isArabic(post: BlogPost): boolean {
  return post.category === "Arabic";
}

/**
 * Up to `limit` further posts to read after this one.
 *
 * Language is a hard filter: an English article recommending three Arabic
 * ones is not a useful next step, and the naive version did exactly that
 * because the Arabic posts sit at the top of the index and any post whose
 * category had no siblings fell back to plain array order.
 *
 * Within a language, same-category posts come first, then the rest.
 */
export function relatedPosts(slug: string, limit = 3): BlogPost[] {
  const self = blogPosts.find(p => slugOf(p) === slug);
  if (!self) return [];
  const sameLanguage = blogPosts.filter(
    p => slugOf(p) !== slug && isArabic(p) === isArabic(self),
  );
  const sameCategory = sameLanguage.filter(p => p.category === self.category);
  const rest = sameLanguage.filter(p => p.category !== self.category);
  return [...sameCategory, ...rest].slice(0, limit);
}
