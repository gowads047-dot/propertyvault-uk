import { blogPosts } from "./blog-posts";

/**
 * Deciding what to write next.
 *
 * This exists because the alternative — a cron that generates and publishes a
 * post every week — is a bad trade. The blog is 29 hand-written pages with
 * healthy search performance; bulk-generated articles are what Google's
 * scaled-content-abuse policy exists to catch, and a model writing about UK
 * property will invent a yield figure or a tax threshold unless every claim is
 * checked. Losing the ranking of 29 good pages to gain 52 mediocre ones is not
 * a trade worth making.
 *
 * So nothing here publishes. It picks the gap that matters most and hands it
 * over as a brief for a person to write.
 *
 * The backlog below is deliberately hand-written rather than generated. These
 * are the questions the site genuinely does not answer, several of them
 * confirmed by searching the codebase: the Non-Resident Landlord scheme, the
 * 2% non-resident SDLT surcharge and power of attorney appear nowhere.
 */

export interface TopicIdea {
  /** The working title. */
  title: string;
  /** Why this one — the gap it fills. */
  why: string;
  /** Words that must appear for the post to be considered covered. */
  covers: string[];
  /** Higher runs first. */
  priority: number;
  category: string;
}

/**
 * Ordered by how badly the gap needs filling, not by how easy it is to write.
 * Overseas topics lead because the inbound messages are coming from abroad and
 * the site currently answers almost none of it.
 */
export const TOPIC_BACKLOG: TopicIdea[] = [
  {
    title: "The Non-Resident Landlord Scheme — what to register and when",
    why: "Every landlord living abroad must register with HMRC or have 20% withheld by their agent. The site does not mention the scheme anywhere.",
    covers: ["non-resident landlord scheme", "nrl1"],
    priority: 100,
    category: "Tax",
  },
  {
    title: "Stamp duty for overseas buyers — the 2% surcharge explained",
    why: "The calculator already computes this and the article to link it from does not exist.",
    covers: ["2% surcharge", "non-resident surcharge"],
    priority: 95,
    category: "Tax",
  },
  {
    title: "Buying UK property from abroad without flying over",
    why: "Power of attorney, ID checks and remote completion appear nowhere on the site.",
    covers: ["power of attorney"],
    priority: 90,
    category: "Buying",
  },
  {
    title: "Opening a UK bank account as a non-resident landlord",
    why: "The first practical blocker for an overseas buyer, and unanswered here.",
    covers: ["uk bank account"],
    priority: 85,
    category: "Buying",
  },
  {
    title: "Can a non-resident get a UK buy-to-let mortgage?",
    why: "Expat and non-resident BTL lending differs from resident lending, and nothing covers it.",
    covers: ["expat mortgage", "non-resident mortgage"],
    priority: 80,
    category: "Finance",
  },
  {
    title: "Your first BRRR, step by step, with the numbers filled in",
    why: "BRRR has a calculator and an academy page but no walkthrough article.",
    covers: ["brrr step by step", "first brrr"],
    priority: 70,
    category: "Investing",
  },
  {
    title: "How to find a deal without paying a sourcer",
    why: "Deal sourcing is covered from the sourcer's side, not the buyer's.",
    covers: ["find a deal", "without a sourcer"],
    priority: 65,
    category: "Investing",
  },
  {
    title: "What a company let actually involves, for a first-time landlord",
    why: "Makan's whole thesis, with no blog post pointing at it.",
    covers: ["company let"],
    priority: 60,
    category: "Landlords",
  },
];

/** Lowercased haystack of everything already published. */
function publishedText(): string {
  return blogPosts.map(p => `${p.title} ${p.excerpt} ${p.href}`).join(" ").toLowerCase();
}

/** A topic is covered when any of its phrases already appears in the blog. */
export function isCovered(topic: TopicIdea, haystack = publishedText()): boolean {
  const hay = haystack.toLowerCase();
  return topic.covers.some(c => hay.includes(c.toLowerCase()));
}

/** The next topics worth writing, most important first. */
export function openTopics(limit = 3): TopicIdea[] {
  const hay = publishedText();
  return TOPIC_BACKLOG
    .filter(t => !isCovered(t, hay))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit);
}

const MONTHS = ["january", "february", "march", "april", "may", "june",
                "july", "august", "september", "october", "november", "december"];

/**
 * Post dates into a timestamp.
 *
 * Two formats are in use, which is worth knowing in itself: 23 posts are
 * dated "2 August 2026" and six are month-only, "June 2026". A month-only
 * date is read as the first of that month — the alternative is treating six
 * posts as undated, which reports the blog as fresher than it is.
 */
export function parsePostDate(d: string): number | null {
  const full = d.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (full) {
    const mo = MONTHS.indexOf(full[2].toLowerCase());
    return mo < 0 ? null : Date.UTC(Number(full[3]), mo, Number(full[1]));
  }
  const monthOnly = d.match(/^\s*([A-Za-z]+)\s+(\d{4})\s*$/);
  if (monthOnly) {
    const mo = MONTHS.indexOf(monthOnly[1].toLowerCase());
    return mo < 0 ? null : Date.UTC(Number(monthOnly[2]), mo, 1);
  }
  return null;
}

/** Days since the most recent post, or null if no date parses. */
export function daysSinceLastPost(now: Date): number | null {
  const stamps = blogPosts.map(p => parsePostDate(p.date)).filter((n): n is number => n !== null);
  if (stamps.length === 0) return null;
  const newest = Math.max(...stamps);
  return Math.floor((now.getTime() - newest) / 86_400_000);
}

/** How many posts sit in each category. */
export function categoryCounts(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const p of blogPosts) out[p.category] = (out[p.category] ?? 0) + 1;
  return out;
}

export interface Plan {
  postCount: number;
  daysSinceLastPost: number | null;
  topics: TopicIdea[];
  categories: Record<string, number>;
}

export function buildPlan(now: Date, limit = 3): Plan {
  return {
    postCount: blogPosts.length,
    daysSinceLastPost: daysSinceLastPost(now),
    topics: openTopics(limit),
    categories: categoryCounts(),
  };
}

/**
 * The instruction sent to the model.
 *
 * Every constraint here is one this site has already been burned by, or has a
 * standing rule about. The outline is a brief for a person: it must not invent
 * a figure, and where a figure is genuinely needed it should say which source
 * to look it up in rather than guessing at the number.
 */
export function briefPrompt(topic: TopicIdea): string {
  return [
    `Write a blog post OUTLINE for a UK property site. Working title: "${topic.title}".`,
    `The gap it fills: ${topic.why}`,
    "",
    "Rules, all of which matter more than the writing:",
    "- Invent NO statistics, percentages, yields, average rents or dates. Where the post",
    "  needs a number, write [CHECK: what to look up, and the source] instead.",
    "- Tax thresholds and legal rules change. Name the source to verify against",
    "  (HMRC page, gov.uk page, specific legislation) rather than stating the rule.",
    "- No testimonials, no client counts, no claims about results.",
    "- British English. Plain, direct, no marketing voice.",
    "- The audience is often overseas and new to UK property. Assume intelligence,",
    "  not familiarity.",
    "",
    "Return: a suggested H1, a one-paragraph intro, 5-8 H2 sections each with two or",
    "three bullets of what to cover, and a closing section. Under 500 words total —",
    "this is a brief to write from, not the post.",
  ].join("\n");
}
