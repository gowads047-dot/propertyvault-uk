import { siteMetrics } from "@/lib/site";

/**
 * The site's navigation model — one structure driving both the desktop
 * dropdowns and the mobile drawer.
 *
 * Previously Header.tsx held two hand-maintained lists: a flat five-item
 * desktop nav and a separate twenty-five-item mobile drawer. They had drifted,
 * so the Deal Analyser, property search, /tools, the glossary and Makan were
 * reachable on mobile but not on desktop. Adding a page meant remembering two
 * places.
 *
 * The grouping has since changed once more. It used to be Analyse · Landlords ·
 * Find property · Learn, which sorts pages by what each one *is*. A visitor
 * arrives knowing what they are trying to do, not which internal category we
 * filed it under, and there was no answer at all to "what do you sell" — no
 * Services group existed. So the top level is now the two people who show up
 * (Buy, Landlords), what we can do for them (Services), and what they can use
 * for free (Tools, Learn).
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
  /** The group's own landing page, linked from the group heading. */
  href?: string;
  links: NavLink[];
};

export const navGroups: NavGroup[] = [
  {
    label: "Buy",
    href: "/buy",
    links: [
      { href: "/vault", label: "Vault a Property", desc: "Score it against sold evidence and get your maximum offer", feature: true },
      { href: "/ask", label: "Ask PropertyVault", desc: "Describe a property, get the answer and the workings" },
      { href: "/search", label: "Property Search", desc: "Launch a search across the major portals" },
      { href: "/sold-prices", label: "Sold Prices", desc: "What properties actually sold for" },
      { href: "/areas", label: "Area Guides", desc: `${siteMetrics.areaGuides} UK investment areas` },
      { href: "/buy", label: "How buying works", desc: "The whole sequence, step by step" },
    ],
  },
  {
    label: "Landlords",
    href: "/landlords",
    links: [
      { href: "/rentura", label: "Rentura", desc: "The landlord dashboard — properties, tenancies, compliance", feature: true },
      { href: "/landlords", label: "Compliance Checklist", desc: "What is required, what is conditional, what is optional" },
      { href: "/templates", label: "Templates & Checklists", desc: `${siteMetrics.templates} landlord documents` },
      { href: "/hmo-hub", label: "HMO Hub", desc: "Licensing, standards and the numbers" },
      { href: "/list-property", label: "List Your Property", desc: "Put a property in front of tenants" },
      { href: "/tenant", label: "Tenant Portal", desc: "Where your tenants report issues" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    links: [
      { href: "/guaranteed-rent", label: "Guaranteed Rent", desc: `Fixed monthly rent on a 3–5 year lease, ${siteMetrics.guaranteedRentCities} cities`, feature: true },
      { href: "/services", label: "All Services", desc: "Every service, and whether it is running yet" },
      { href: "/find-agent", label: "Find a Professional", desc: "Brokers, solicitors and agents" },
      { href: "/trades", label: "Find a Trade", desc: "Contractors and maintenance" },
      { href: "/valuation", label: "Free Valuation", desc: "Estimate what a property is worth" },
      { href: "/contact", label: "Talk to Us", desc: "Ask about anything above" },
    ],
  },
  {
    label: "Tools",
    href: "/calculators",
    links: [
      { href: "/calculators/deal-analyser", label: "Deal Analyser", desc: "Full analysis of a single deal", feature: true },
      { href: "/calculators", label: `All ${siteMetrics.calculators} calculators`, desc: "Yield, SDLT, tax, cash flow and more" },
      { href: "/calculators/stamp-duty", label: "Stamp Duty", desc: "Including the additional-property surcharge" },
      { href: "/calculators/rental-yield", label: "Rental Yield", desc: "Gross and net, on your numbers" },
      { href: "/tools", label: "Property Tools", desc: "Quick utilities for day-to-day decisions" },
      { href: "/areas/postcodes", label: "Postcode Guides", desc: "Yields and demand by postcode" },
    ],
  },
  {
    label: "Learn",
    links: [
      { href: "/blog", label: "Blog", desc: `${siteMetrics.blogPosts} articles on the UK market`, feature: true },
      { href: "/property-investing", label: "Property Investing", desc: "Strategies and fundamentals" },
      { href: "/mortgages", label: "Mortgages", desc: "BTL, residential and bridging" },
      { href: "/property-tax", label: "Property Tax", desc: "Section 24, SDLT, CGT" },
      { href: "/glossary", label: "Property Glossary", desc: "Plain-English definitions" },
      { href: "/makan", label: "Makan", desc: "Bilingual international property marketplace" },
    ],
  },
];

/** Shown only in the mobile drawer and the footer, not the desktop dropdowns. */
export const companyLinks: NavLink[] = [
  { href: "/about", label: "About PropertyVault" },
  { href: "/contact", label: "Contact Us" },
];
