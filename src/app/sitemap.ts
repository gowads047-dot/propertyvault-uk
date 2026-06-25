import type { MetadataRoute } from "next";

const BASE = "https://propertyvaultuk.co.uk";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    // Core
    { url: `${BASE}/`,                          lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/about/`,                    lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact/`,                  lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/blog/`,                     lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/resources/`,                lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/glossary/`,                 lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/tools/`,                    lastModified: now, changeFrequency: "monthly", priority: 0.6 },

    // Calculators
    { url: `${BASE}/calculators/`,              lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/calculators/stamp-duty/`,   lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/calculators/rental-yield/`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/calculators/brrr/`,         lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/calculators/section-24/`,   lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/calculators/hmo-yield/`,    lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/calculators/mortgage/`,     lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/calculators/affordability/`,   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/calculators/capital-gains-tax/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/calculators/deal-analyser/`,   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/calculators/bridging/`,     lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/calculators/flip-roi/`,     lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/calculators/remortgage/`,   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/calculators/landlord-costs/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/calculators/personal-vs-ltd/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/calculators/rent-vs-buy/`,  lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/calculators/moving-costs/`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/calculators/epc-retrofit/`,     lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/calculators/landlord-tax/`,     lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/calculators/btl-mortgage/`,     lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/calculators/void-period/`,       lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/calculators/rent-increase/`,    lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/calculators/monthly-cashflow/`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },

    // Templates
    { url: `${BASE}/templates/`,                lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/templates/ast/`,            lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/templates/section-8-notice/`,  lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/templates/section-13-notice/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/templates/inventory-checklist/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/templates/inspection-record/`,  lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/templates/checkout-report/`,    lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/templates/landlord-compliance/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/templates/rent-receipt/`,       lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/templates/reference-request/`,  lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/templates/repair-report/`,      lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/templates/viewing-checklist/`,  lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/templates/due-diligence/`,      lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/templates/offer-worksheet/`,    lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/templates/hmo-management-log/`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/templates/pet-permission/`,     lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/templates/renters-rights-notice/`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/templates/commercial-lease/`,   lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/templates/sale-prep-checklist/`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },

    // Blog posts
    { url: `${BASE}/blog/brrr-strategy-explained/`,            lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog/section-24-explained/`,               lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog/hmo-investing-uk/`,                   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog/stamp-duty-guide/`,                   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog/renters-rights-act/`,                 lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog/guaranteed-rent-explained/`,          lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog/guaranteed-rent-vs-traditional-letting/`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/blog/uk-property-market-2026/`,            lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/blog/biggest-financial-lie-britain/`,      lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/blog/epc-c-deadline-landlords/`,           lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/blog/first-time-buyer-guide/`,             lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/blog/personal-vs-limited-company/`,        lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/blog/is-guaranteed-rent-a-scam/`,           lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog/deal-sourcing-uk-guide/`,             lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog/best-areas-invest-birmingham-2026/`,  lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog/best-areas-invest-nottingham-2026/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog/best-areas-invest-derby-2026/`,      lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog/best-areas-invest-sheffield-2026/`,  lastModified: now, changeFrequency: "monthly", priority: 0.8 },

    // New pages
    { url: `${BASE}/reviews/`,    lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/faq/`,        lastModified: now, changeFrequency: "monthly", priority: 0.8 },

    // Guaranteed rent
    { url: `${BASE}/guaranteed-rent/`,            lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/guaranteed-rent/birmingham/`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/guaranteed-rent/nottingham/`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/guaranteed-rent/derby/`,      lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/guaranteed-rent/leicester/`,  lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/guaranteed-rent/coventry/`,   lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/guaranteed-rent/sheffield/`,  lastModified: now, changeFrequency: "monthly", priority: 0.9 },

    // Area guides
    { url: `${BASE}/areas/`,             lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/areas/birmingham/`,  lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/areas/nottingham/`,  lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/areas/derby/`,       lastModified: now, changeFrequency: "monthly", priority: 0.7 },

    // Hub pages
    { url: `${BASE}/buy-to-let/`,            lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/first-time-buyer/`,      lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/hmo-hub/`,               lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/landlord-hub/`,          lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/property-investing/`,    lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/property-tax/`,          lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/property-law/`,          lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/mortgages/`,             lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/serviced-accommodation/`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/deal-sourcing/`,         lastModified: now, changeFrequency: "monthly", priority: 0.6 },

    // Legal
    { url: `${BASE}/privacy/`,       lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms/`,         lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/cookies/`,       lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/disclaimer/`,    lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/accessibility/`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  return staticPages;
}
