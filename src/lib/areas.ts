/**
 * The city guides, as display names and as URL slugs.
 *
 * These lived in Footer.tsx, which was fine while the footer was the only
 * thing that needed them. Two places now convert between a name and a slug —
 * the footer going one way, the area-guide call to action coming back the
 * other — and a name that round-trips wrong renders as visible nonsense on
 * somebody's home town.
 *
 * areas.test.ts asserts the round trip against the directories that actually
 * exist under src/app/areas, so a twenty-first city cannot be added in one
 * place and missed in the other.
 */

/**
 * Every city page under /areas.
 *
 * They are twenty of the site's URLs and the only link to any of them was the
 * /areas hub — the homepage body linked to none. A footer row gives each one a
 * link from every page on the site, which is where internal link equity
 * actually comes from.
 */
export const AREA_CITIES = [
  "Birmingham", "Bradford", "Bristol", "Cardiff", "Coventry",
  "Derby", "Edinburgh", "Glasgow", "Hull", "Leeds",
  "Leicester", "Liverpool", "Manchester", "Newcastle", "Nottingham",
  "Portsmouth", "Sheffield", "Southampton", "Stoke-on-Trent", "Wolverhampton",
] as const;

/** Display name to URL slug. Stoke-on-Trent → stoke-on-trent. */
export const areaSlug = (city: string) => city.toLowerCase().replace(/\s+/g, "-");

/**
 * The connecting words in a UK place name, which stay lowercase.
 *
 * Stoke-on-Trent, Stockton-on-Tees, Newcastle-under-Lyme, Ashby-de-la-Zouch.
 * Capitalising every hyphen-separated part gives "Stoke-On-Trent", which is
 * wrong in a way people notice — it is their town.
 */
const LOWER = new Set(["on", "upon", "under", "in", "le", "la", "de", "of", "and", "the"]);

/** URL slug back to display name. stoke-on-trent → Stoke-on-Trent. */
export function cityName(slug: string): string {
  return slug
    .split("-")
    // The first part is always capitalised, however small.
    .map((part, i) => (i > 0 && LOWER.has(part) ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join("-");
}
