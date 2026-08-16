import Link from "next/link";

const BASE = "https://propertyvaultuk.co.uk";

interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const allCrumbs = [{ label: "Home", href: "/" }, ...items];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allCrumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.label,
      ...(crumb.href ? { item: `${BASE}${crumb.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="text-xs text-navy-400 mb-4">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-navy-700 transition-colors">Home</Link>
          </li>
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1">
              <span className="text-navy-300">/</span>
              {item.href ? (
                <Link href={item.href} className="hover:text-navy-700 transition-colors">{item.label}</Link>
              ) : (
                <span className="text-navy-600 font-medium">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
