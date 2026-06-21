import Link from "next/link";

const sections = [
  { title: "Platform", links: [
    { href: "/calculators", label: "Calculators" },
    { href: "/templates", label: "Templates" },
    { href: "/tools", label: "Tools" },
    { href: "/glossary", label: "Glossary" },
    { href: "/search", label: "Search" },
    { href: "/guaranteed-rent", label: "Guaranteed Rent" },
  ]},
  { title: "Learn", links: [
    { href: "/property-investing", label: "Investing" },
    { href: "/mortgages", label: "Mortgages" },
    { href: "/property-tax", label: "Tax" },
    { href: "/property-law", label: "Law" },
    { href: "/blog", label: "Blog" },
  ]},
  { title: "Legal", links: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "/disclaimer", label: "Disclaimer" },
    { href: "/cookies", label: "Cookies" },
    { href: "/accessibility", label: "Accessibility" },
  ]},
];

export function Footer() {
  return (
    <footer className="bg-white border-t border-navy-100/50">
      <div className="container-max px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-navy-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">P</span>
              </div>
              <span className="font-bold text-navy-800 text-sm">PropertyVault</span>
            </div>
            <p className="text-xs text-navy-400 leading-relaxed">Free property tools for UK investors, landlords, and buyers.</p>
          </div>
          {sections.map((s) => (
            <div key={s.title}>
              <h4 className="font-semibold text-navy-800 text-xs uppercase tracking-wider mb-3">{s.title}</h4>
              <ul className="space-y-2">
                {s.links.map((link) => (
                  <li key={link.href}><Link href={link.href} className="text-sm text-navy-400 hover:text-navy-800 transition-colors">{link.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-navy-100/50">
        <div className="container-max px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-navy-400">
          <span>&copy; {new Date().getFullYear()} PropertyVault UK</span>
          <span>Educational content only. Not financial, legal, or tax advice.</span>
        </div>
      </div>
    </footer>
  );
}
