import { siteMetrics } from "@/lib/site";

/**
 * The site's navigation model — one structure driving both the desktop
 * dropdowns and the mobile drawer.
 *
 * Previously Header.tsx held two hand-maintained lists: a flat five-item
 * desktop nav and a separate twenty-five-item mobile drawer. They had drifted,
 * so the Deal Analyser, property search, /tools, the glossary and Makan were
 * reachable on mobile but not on desktop. Adding a page meant remembering two
 * places. Grouping is by user intent rather than by internal product name.
 */

export type NavLink = {
  href: string;
  label: string;
  /** Short descriptor shown in the desktop dropdown. */
  desc?: string;
  /** Renders the item as the visually leading entry in its group. */
  feature?: boolean;
};

export type NavGroup = {
  label: string;
  links: NavLink[];
};

export const navGroups: NavGroup[] = [
  {
    label: "Analyse",
    links: [
      { href: "/calculators/deal-analyser", label: "Deal Analyser", desc: "Full analysis of a single deal", feature: true },
      { href: "/calculators", label: `All ${siteMetrics.calculators} calculators`, desc: "Yield, SDLT, tax, cash flow and more" },
      { href: "/tools", label: "Property Tools", desc: "Quick utilities for day-to-day decisions" },
      { href: "/glossary", label: "Property Glossary", desc: "Plain-English definitions" },
    ],
  },
  {
    label: "Landlords",
    links: [
      { href: "/guaranteed-rent", label: "Guaranteed Rent", desc: "Fixed monthly rent on a 3–5 year lease", feature: true },
      { href: "/rentura", label: "Rentura", desc: "The operating system for UK landlords" },
      { href: "/templates", label: "Templates & Checklists", desc: `${siteMetrics.templates} landlord documents` },
      { href: "/manage", label: "Manage Tenancies", desc: "Track tenancies and compliance" },
      { href: "/list-property", label: "List Your Property", desc: "Put a property in front of tenants" },
      { href: "/find-agent", label: "Find a Professional", desc: "Brokers, solicitors and agents" },
    ],
  },
  {
    label: "Find property",
    links: [
      { href: "/search", label: "Property Search", desc: "Launch a search across the major portals", feature: true },
      { href: "/areas", label: "Area Guides", desc: `${siteMetrics.areaGuides} UK investment areas` },
      { href: "/areas/postcodes", label: "Postcode Guides", desc: "Yields and demand by postcode" },
      { href: "/sold-prices", label: "Sold Prices", desc: "What properties actually sold for" },
      { href: "/valuation", label: "Free Valuation", desc: "Estimate what a property is worth" },
      { href: "/makan", label: "Makan", desc: "Bilingual international property marketplace" },
    ],
  },
  {
    label: "Learn",
    links: [
      { href: "/blog", label: "Blog", desc: `${siteMetrics.blogPosts} articles on the UK market`, feature: true },
      { href: "/property-investing", label: "Property Investing", desc: "Strategies and fundamentals" },
      { href: "/mortgages", label: "Mortgages", desc: "BTL, residential and bridging" },
      { href: "/property-tax", label: "Property Tax", desc: "Section 24, SDLT, CGT" },
      { href: "/property-law", label: "Property Law", desc: "Your obligations as a landlord" },
      { href: "/renting-strategies", label: "Renting Strategies", desc: "HMO, SA, rent-to-rent and more" },
    ],
  },
];

/** Shown only in the mobile drawer and the footer, not the desktop dropdowns. */
export const companyLinks: NavLink[] = [
  { href: "/about", label: "About PropertyVault" },
  { href: "/contact", label: "Contact Us" },
];
