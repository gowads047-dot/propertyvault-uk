"use client";

import { useState } from "react";
import Link from "next/link";

const categories = [
  { id: "all", label: "All Templates" },
  { id: "buyer", label: "Home Buyers" },
  { id: "seller", label: "Home Sellers" },
  { id: "landlord", label: "Landlords" },
  { id: "commercial", label: "Commercial" },
];

const templates = [
  // HOME BUYER
  { id: "viewing-checklist", title: "Property Viewing Checklist", desc: "A structured 50-point checklist covering the interior, exterior, location, and neighbourhood of any property. Never forget a critical detail during a viewing again.", category: "buyer", forWho: "First-time buyers, home movers, property investors", href: "/downloads/buyer/viewing-checklist.html", related: ["ftb-roadmap", "offer-worksheet"] },
  { id: "ftb-roadmap", title: "First-Time Buyer Roadmap", desc: "A step-by-step visual guide through the entire home buying process — from saving a deposit to collecting your keys. Covers mortgages, solicitors, surveys, and completion.", category: "buyer", forWho: "First-time buyers in England and Wales", href: "/downloads/buyer/ftb-roadmap.html", related: ["budget-planner", "viewing-checklist"] },
  { id: "budget-planner", title: "House Purchase Budget Planner", desc: "A comprehensive worksheet to calculate the full cost of buying a home — deposit, stamp duty, solicitor fees, surveys, moving costs, and ongoing monthly outgoings.", category: "buyer", forWho: "Anyone budgeting for a property purchase", href: "/downloads/buyer/budget-planner.html", related: ["ftb-roadmap", "conveyancing-tracker"] },
  { id: "conveyancing-tracker", title: "Conveyancing Progress Tracker", desc: "Track every stage of the legal process from instruction to completion. Covers searches, enquiries, mortgage offer, exchange, and completion with space for dates and notes.", category: "buyer", forWho: "Buyers and sellers going through conveyancing", href: "/downloads/buyer/conveyancing-tracker.html", related: ["budget-planner", "offer-worksheet"] },
  { id: "offer-worksheet", title: "Property Offer Preparation Worksheet", desc: "Prepare a strong, informed offer. Includes comparable sold prices research, negotiation points, conditions checklist, and offer letter template.", category: "buyer", forWho: "Buyers preparing to make an offer", href: "/downloads/buyer/offer-worksheet.html", related: ["viewing-checklist", "budget-planner"] },

  // HOME SELLER
  { id: "sale-prep-checklist", title: "Home Sale Preparation Checklist", desc: "Everything you need to do before putting your property on the market — repairs, decluttering, EPC, photos, kerb appeal, and documentation.", category: "seller", forWho: "Homeowners preparing to sell", href: "/downloads/seller/sale-prep-checklist.html", related: ["marketing-checklist", "seller-docs"] },
  { id: "marketing-checklist", title: "Property Marketing Readiness Checklist", desc: "Ensure your property listing is as strong as possible. Covers photography preparation, staging tips, listing description points, and portal readiness.", category: "seller", forWho: "Sellers and agents marketing a property", href: "/downloads/seller/marketing-checklist.html", related: ["sale-prep-checklist", "valuation-guide"] },
  { id: "seller-docs", title: "Seller Documentation Checklist", desc: "A complete list of documents you will need when selling — title deeds, property information form, fittings and contents form, warranties, and planning documents.", category: "seller", forWho: "Sellers preparing for conveyancing", href: "/downloads/seller/seller-docs.html", related: ["sale-prep-checklist", "move-checklist"] },
  { id: "move-checklist", title: "House Move Planning Checklist", desc: "A week-by-week countdown checklist for moving day. Covers utilities, mail redirection, removals, cleaning, key handover, and settling in.", category: "seller", forWho: "Anyone moving home", href: "/downloads/seller/move-checklist.html", related: ["seller-docs", "sale-prep-checklist"] },
  { id: "valuation-guide", title: "Property Valuation Preparation Guide", desc: "How to prepare for an estate agent valuation to achieve the best possible price estimate. Covers presentation, comparable evidence, and questions to ask.", category: "seller", forWho: "Sellers arranging valuations", href: "/downloads/seller/valuation-guide.html", related: ["sale-prep-checklist", "marketing-checklist"] },

  // LANDLORD
  { id: "landlord-compliance", title: "Landlord Compliance Checklist", desc: "Every legal obligation for private landlords in England — gas safety, EICR, EPC, deposit protection, Right to Rent, smoke alarms, licensing, and more. Referenced to current legislation.", category: "landlord", forWho: "All private residential landlords in England", href: "/downloads/compliance/landlord-compliance-checklist.html", related: ["inspection-record", "tenant-welcome"] },
  { id: "inventory-checklist", title: "Property Inventory Checklist", desc: "A room-by-room inventory template with condition ratings, meter readings, key log, smoke alarm checks, and photo prompts. Essential for deposit protection evidence.", category: "landlord", forWho: "Landlords and letting agents", href: "/downloads/inventory/full-inventory.html", related: ["inspection-record", "checkout-report"] },
  { id: "checkout-report", title: "Check-Out Inspection Report", desc: "End-of-tenancy condition report comparing check-in vs check-out state. Includes deposit deduction schedule and signature blocks.", category: "landlord", forWho: "Landlords conducting end-of-tenancy inspections", href: "/downloads/inventory/check-out-report.html", related: ["inventory-checklist", "landlord-compliance"] },
  { id: "tenant-app", title: "Tenant Application Form", desc: "A professional tenant application form covering personal details, employment, income, rental history, references, and Right to Rent documentation.", category: "landlord", forWho: "Landlords and agents accepting tenant applications", href: "/downloads/landlord/tenant-application.html", related: ["tenant-welcome", "landlord-compliance"] },
  { id: "inspection-record", title: "Property Inspection Record", desc: "A structured form for mid-tenancy inspections. Records property condition, maintenance issues, tenant compliance, and follow-up actions room by room.", category: "landlord", forWho: "Landlords conducting periodic inspections", href: "/downloads/landlord/inspection-record.html", related: ["inventory-checklist", "landlord-compliance"] },
  { id: "tenant-welcome", title: "Tenant Welcome Pack Checklist", desc: "Everything to include in a professional move-in pack — emergency contacts, meter locations, bin days, appliance guides, house rules, and compliance documents provided.", category: "landlord", forWho: "Landlords welcoming new tenants", href: "/downloads/communication/welcome-letter.html", related: ["landlord-compliance", "inventory-checklist"] },

  // COMMERCIAL
  { id: "commercial-viewing", title: "Commercial Property Viewing Checklist", desc: "A structured checklist for viewing commercial premises — offices, retail, industrial, and mixed-use. Covers access, condition, services, planning use class, and lease terms.", category: "commercial", forWho: "Business owners and commercial investors", href: "/downloads/commercial/commercial-viewing.html", related: ["due-diligence", "investment-worksheet"] },
  { id: "due-diligence", title: "Commercial Due Diligence Checklist", desc: "A comprehensive checklist for investigating a commercial property before purchase or lease — title, planning, environmental, tenant covenant, service charges, and compliance.", category: "commercial", forWho: "Commercial property buyers and investors", href: "/downloads/commercial/due-diligence.html", related: ["commercial-viewing", "investment-worksheet"] },
  { id: "lease-review", title: "Lease Review Preparation Guide", desc: "Key questions and points to review before signing or renewing a commercial lease — rent reviews, break clauses, repair obligations, permitted use, and alienation.", category: "commercial", forWho: "Tenants and landlords reviewing commercial leases", href: "/downloads/commercial/lease-review.html", related: ["due-diligence", "commercial-viewing"] },
  { id: "commercial-tenant-form", title: "Commercial Tenant Information Form", desc: "An information-gathering form for prospective commercial tenants — business details, accounts, references, intended use, and fit-out requirements.", category: "commercial", forWho: "Commercial landlords and agents", href: "/downloads/commercial/tenant-info-form.html", related: ["lease-review", "due-diligence"] },
  { id: "investment-worksheet", title: "Property Investment Assessment Worksheet", desc: "A structured worksheet to evaluate any property investment — purchase costs, rental income, yield calculations, finance costs, and 5-year projection.", category: "commercial", forWho: "Property investors and developers", href: "/downloads/commercial/investment-worksheet.html", related: ["due-diligence", "commercial-viewing"] },
];

const faqs = [
  { q: "Are these property templates free?", a: "Yes, all templates on PropertyVault are completely free to download and use. No hidden charges, no subscription required." },
  { q: "Can landlords use these templates for their rental properties?", a: "Yes. Our landlord templates are specifically designed for private residential landlords in England and Wales. They cover compliance, inventories, inspections, and tenant communication." },
  { q: "Are these templates suitable for use across England and Wales?", a: "Yes. All templates are designed for use in England and Wales and are based on current legislation and property industry best practice applicable in these jurisdictions. Scotland and Northern Ireland have different legal frameworks." },
  { q: "Do I still need a solicitor?", a: "These templates are informational checklists, trackers, and guides — they are not legally binding contracts. For any legal matter including property transactions, tenancy agreements, or disputes, you should always seek advice from a qualified solicitor." },
  { q: "How often are the templates updated?", a: "We review our templates regularly to ensure they reflect current legislation and best practice. However, property law changes frequently, so always verify current requirements with a qualified professional." },
  { q: "Can I edit the templates after downloading?", a: "Yes. All templates open in your browser where you can fill in the fields and then save as PDF using the print function (Ctrl+P → Save as PDF). The fields are fully interactive." },
  { q: "Are these templates government approved?", a: "No. These templates are not government approved or endorsed. They are based on UK Government guidance and property industry best practice, but they are independently produced by PropertyVault for informational purposes only." },
  { q: "Can I use these templates for commercial properties?", a: "Yes. We have a dedicated commercial property template category covering viewing checklists, due diligence, lease review preparation, and investment assessment." },
  { q: "Do these templates replace a tenancy agreement?", a: "No. These templates are checklists, trackers, and guides — not legally binding contracts. Tenancy agreements should be prepared or reviewed by a qualified solicitor or licensed conveyancer." },
  { q: "Can estate agents use these templates?", a: "Yes. Estate agents, letting agents, and property managers are welcome to use these templates in their professional practice." },
];

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  const filtered = templates.filter((t) => {
    const matchCat = activeCategory === "all" || t.category === activeCategory;
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleDownload = (href: string) => {
    setDownloadUrl(href);
    setShowForm(true);
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-max px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest mb-3">Free Downloads</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-navy-800 mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Property Templates &amp; Checklists</h1>
            <p className="text-navy-500 text-lg">Professional checklists, trackers, and guides for home buyers, sellers, landlords, and commercial property professionals.</p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-white border-b border-navy-100">
        <div className="container-max px-4 py-6">
          <div className="flex flex-wrap justify-center gap-6 text-center text-sm text-navy-600">
            <span className="font-semibold">{templates.length} Free Templates</span>
            <span>·</span>
            <span>4 Categories</span>
            <span>·</span>
            <span>Fillable &amp; Printable</span>
            <span>·</span>
            <span>England &amp; Wales</span>
          </div>
        </div>
      </section>

      {/* Search + Filter */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-5xl">
          {/* Search */}
          <div className="mb-6">
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.id ? "bg-navy-600 text-white" : "bg-navy-50 text-navy-600 hover:bg-navy-100"}`}>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <p className="text-sm text-navy-500 mb-4">{filtered.length} template{filtered.length !== 1 ? "s" : ""} found</p>

          {/* Template Cards */}
          <div className="grid md:grid-cols-2 gap-5">
            {filtered.map((t) => {
              const catColors: Record<string, { bg: string; icon: string }> = {
                buyer: { bg: "bg-blue-50", icon: "text-blue-500" },
                seller: { bg: "bg-green-50", icon: "text-green-500" },
                landlord: { bg: "bg-gold-50", icon: "text-gold-600" },
                commercial: { bg: "bg-purple-50", icon: "text-purple-500" },
              };
              const c = catColors[t.category] || catColors.buyer;
              return (
              <div key={t.id} className="bg-white rounded-xl border border-navy-100 p-6 hover:shadow-lg hover:border-gold-400/30 transition-all">
                <div className="flex items-start gap-4 mb-3">
                  <div className={`w-12 h-14 rounded-lg ${c.bg} flex items-center justify-center flex-shrink-0`}>
                    <svg className={`w-6 h-6 ${c.icon}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      {t.category === "buyer" && <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955a1.126 1.126 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />}
                      {t.category === "seller" && <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />}
                      {t.category === "landlord" && <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />}
                      {t.category === "commercial" && <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />}
                    </svg>
                  </div>
                  <div>
                    <span className="inline-block px-2 py-0.5 bg-navy-50 text-navy-600 text-xs font-semibold rounded-full mb-1 capitalize">{t.category === "buyer" ? "Home Buyer" : t.category === "seller" ? "Home Seller" : t.category === "landlord" ? "Landlord" : "Commercial"}</span>
                    <h3 className="font-bold text-navy-800 text-lg">{t.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-navy-500 mb-3 leading-relaxed">{t.desc}</p>
                <p className="text-xs text-navy-400 mb-4"><strong>For:</strong> {t.forWho}</p>
                <div className="flex gap-3">
                  <a href={t.href} target="_blank" rel="noopener noreferrer"
                    className="btn-primary !py-2 !px-4 text-sm flex-shrink-0">
                    Download Free
                  </a>
                  <button onClick={() => handleDownload(t.href)}
                    className="text-sm font-semibold text-gold-600 hover:text-gold-700">
                    Get via Email →
                  </button>
                </div>
              </div>
            );
            })}
          </div>
        </div>
      </section>

      {/* Lead Capture Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-navy-800 mb-1">Get Templates by Email</h3>
            <p className="text-sm text-navy-500 mb-5">Enter your details and we will send the template directly to your inbox.</p>
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); window.open(downloadUrl, '_blank'); setShowForm(false); }}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">First Name *</label>
                  <input type="text" required className="w-full px-3 py-2.5 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 mb-1">Last Name *</label>
                  <input type="text" required className="w-full px-3 py-2.5 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">Email Address *</label>
                <input type="email" required className="w-full px-3 py-2.5 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">Phone Number (optional)</label>
                <input type="tel" className="w-full px-3 py-2.5 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-1">I am a...</label>
                <div className="flex flex-wrap gap-2">
                  {["Buyer", "Seller", "Landlord", "Investor", "Commercial Client"].map((type) => (
                    <label key={type} className="flex items-center gap-1.5 text-xs text-navy-600 cursor-pointer">
                      <input type="radio" name="userType" value={type} className="text-gold-500" />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
              <label className="flex items-start gap-2 text-xs text-navy-500 cursor-pointer mt-2">
                <input type="checkbox" className="mt-0.5" />
                I agree to receive occasional property insights and updates from PropertyVault.
              </label>
              <button type="submit" className="btn-primary w-full !py-3 text-sm mt-2">Download Template</button>
            </form>
            <button onClick={() => setShowForm(false)} className="text-xs text-navy-400 hover:text-navy-600 mt-3 block mx-auto">Close</button>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="section-padding gradient-navy">
        <div className="container-max max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Need Help With Your Property?</h2>
          <p className="text-navy-200 text-sm mb-6">Use our free calculators to crunch the numbers, or explore our comprehensive property guides.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/calculators" className="btn-primary">Property Calculators →</Link>
            <Link href="/property-investing" className="btn-outline !border-white/30 !text-white hover:!bg-white/10">Investment Guides →</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <h2 className="text-2xl font-bold text-navy-800 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl border border-navy-100 p-5">
                <h3 className="font-bold text-navy-800 mb-1">{faq.q}</h3>
                <p className="text-sm text-navy-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-3xl">
          <div className="bg-white rounded-xl border border-navy-200 p-6">
            <h3 className="font-bold text-navy-800 mb-3">Important Information About These Templates</h3>
            <div className="text-xs text-navy-600 space-y-2 leading-relaxed">
              <p>These templates are provided by PropertyVault UK for <strong>general informational purposes only</strong>. They are checklists, trackers, guides, and worksheets — they are <strong>not legally binding documents</strong> and do not constitute legal, financial, or tax advice.</p>
              <p>All templates are based on UK Government guidance and property industry best practice applicable in <strong>England and Wales</strong> at the time of publication. Scotland and Northern Ireland have different legal frameworks and these templates may not be suitable for use in those jurisdictions.</p>
              <p>These templates <strong>do not replace professional advice</strong>. For any legal matter — including property transactions, tenancy agreements, disputes, tax planning, or compliance — you should always consult a qualified solicitor, licensed conveyancer, accountant, or other regulated professional.</p>
              <p>PropertyVault UK accepts no liability for any loss or damage arising from the use of these templates. Property law and regulations change frequently — always verify current requirements with the relevant authority or professional body.</p>
              <p>By downloading and using these templates, you acknowledge that you have read and understood this disclaimer.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
