import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";

export const metadata: Metadata = {
  title: "Renting Strategies UK — Social Housing, Guaranteed Rent, DSS & More | PropertyVault",
  description: "Complete guide to every UK renting strategy. Social housing leasing, guaranteed rent, DSS/housing benefit tenants, council leasing, rent-to-rent, corporate lets, and more.",
};

const strategies = [
  {
    title: "Social Housing Leasing",
    desc: "Lease your property to a local authority or housing association for 3-5 years. They guarantee rent (typically 80-90% of market rate), handle all management, maintenance, and tenant placement. You receive guaranteed income with zero voids and zero management burden.",
    pros: ["Guaranteed rent — no voids", "No tenant management", "Property returned in original condition", "No letting agent fees", "Stable, long-term income"],
    cons: ["Rent is below market rate (10-20% discount)", "Less control over tenant selection", "Potential for heavy wear and tear", "Long lease commitment", "Slower rent increases"],
    idealFor: "Hands-off landlords who prioritise security over maximum returns",
    yield: "4-6%",
  },
  {
    title: "Council Leasing Schemes",
    desc: "Similar to social housing leasing but directly with local councils. Councils lease your property to house families on the housing waiting list. Schemes vary by council — some offer full management, repairs, and guaranteed rent; others offer partial services.",
    pros: ["Council-backed guaranteed rent", "Full property management included", "Repairs and maintenance covered", "No void periods", "Supporting housing need"],
    cons: ["Lower than market rent", "Varies significantly by council area", "Long lease terms (3-5 years)", "May require property modifications", "Potential damage risk"],
    idealFor: "Landlords in areas with active council leasing programmes",
    yield: "3.5-5.5%",
  },
  {
    title: "Housing Association Partnerships",
    desc: "Partner with registered housing associations (RPs) who lease your property to house tenants. Housing associations are regulated by the Regulator of Social Housing and provide professional management. Longer leases (5-10 years) with index-linked rent reviews.",
    pros: ["Regulated, professional partners", "Very long lease terms", "Rent reviews built in", "Professional property management", "Social impact"],
    cons: ["Below market rent", "Limited flexibility", "Association controls tenant", "Property standards required", "Lengthy setup process"],
    idealFor: "Portfolio landlords seeking institutional-quality tenants",
    yield: "4-5.5%",
  },
  {
    title: "DSS / Housing Benefit / Universal Credit Tenants",
    desc: "Letting to tenants who receive housing benefit or Universal Credit housing element. A large and growing tenant pool. Some landlords avoid DSS tenants due to perceived risk, but many experienced landlords find them reliable with proper referencing and rent guarantee insurance.",
    pros: ["Large tenant pool — less competition", "Often longer tenancies", "Government-backed income element", "Rent guarantee insurance available", "Higher demand = fewer voids"],
    cons: ["UC paid monthly in arrears to tenant", "Payment delays possible", "Benefit cap may limit rent", "Some mortgage lenders restrict DSS", "Perception vs reality gap"],
    idealFor: "Landlords comfortable with the application process who want to fill properties quickly",
    yield: "5-8%",
  },
  {
    title: "Guaranteed Rent Schemes",
    desc: "A property management company leases your property and guarantees your rent regardless of occupancy. They find tenants, manage the property, and handle all maintenance. You receive a fixed monthly payment — typically 10-20% below market rent — but with complete certainty.",
    pros: ["Fixed guaranteed income", "No void risk", "Full management included", "No tenant interaction", "Predictable cash flow"],
    cons: ["10-20% below market rent", "Quality of management varies", "Check company reputation carefully", "Contract terms can be rigid", "Less control over property"],
    idealFor: "Overseas landlords or those wanting completely passive income",
    yield: "4-6%",
  },
  {
    title: "Rent-to-Rent",
    desc: "You lease a property from a landlord (with their full knowledge and consent) and sublet it at a higher rent — either as an HMO, serviced accommodation, or to corporate clients. You don't own the property but control it and keep the profit margin between what you pay and what you charge.",
    pros: ["No capital required for purchase", "Scalable without mortgages", "Profit from day one", "Multiple exit strategies", "Can build portfolio quickly"],
    cons: ["Landlord permission essential", "Requires strong management", "Margins can be thin", "Legal complexity", "Mortgage lender consent needed"],
    idealFor: "Entrepreneurs with limited capital but strong management skills",
    yield: "Variable — margin-based",
  },
  {
    title: "Corporate Lettings",
    desc: "Let your property to companies who house their employees — contractors, relocating staff, or project teams. Higher rents than standard ASTs, typically furnished, and the company guarantees the rent. Common in cities with large employers, military bases, and infrastructure projects.",
    pros: ["Company guarantees rent", "Higher rents than residential", "Professional tenants", "Less wear and tear", "Often longer commitments"],
    cons: ["Seasonal demand fluctuations", "Furnishing costs", "Shorter notice periods", "Marketing to corporates required", "Limited to certain locations"],
    idealFor: "Landlords near business parks, hospitals, military bases, or infrastructure projects",
    yield: "6-10%",
  },
  {
    title: "Student Lettings",
    desc: "Letting to university students, typically on academic year contracts (September to June or July). Student areas near universities offer strong yields. Properties are usually let per room as HMOs. Guarantors (usually parents) provide additional security.",
    pros: ["High demand in university towns", "Strong yields (room-by-room)", "Parental guarantors", "Predictable annual cycle", "Can charge per room"],
    cons: ["Higher management intensity", "Summer void (unless 12-month contracts)", "Higher wear and tear", "HMO licensing requirements", "Annual tenant turnover"],
    idealFor: "Landlords near universities willing to manage higher-yield HMOs",
    yield: "8-14%",
  },
  {
    title: "Serviced Accommodation / Short-Term Lets",
    desc: "Fully furnished properties let on a nightly or weekly basis through platforms like Airbnb, Booking.com, and direct bookings. Premium income potential but requires active management or a management company. Ideal in tourist areas, cities, and business locations.",
    pros: ["2-3x income vs long-term let", "Flexibility to use property yourself", "Dynamic pricing", "No long-term tenant risk", "Tax benefits (FHL status)"],
    cons: ["Higher running costs", "Active management required", "Seasonal demand variations", "Regulatory restrictions (90-day rule in London)", "Furnishing and setup costs"],
    idealFor: "Active investors in tourist destinations or business cities",
    yield: "10-25%",
  },
  {
    title: "Supported Living",
    desc: "Lease your property to supported living providers who house adults with learning disabilities, mental health needs, or physical disabilities. The care provider manages the property and tenants, with funding from local authorities. Very stable, long-term income.",
    pros: ["Very long leases (5-25 years)", "Government-funded rent", "Full management by provider", "Social impact", "Extremely low void risk"],
    cons: ["Property must meet specific standards", "DDA compliance required", "Adaptations may be needed", "CQC-registered provider required", "Niche market"],
    idealFor: "Investors seeking ultra-long-term, hands-off income with social impact",
    yield: "5-8%",
  },
  {
    title: "Temporary Accommodation (TA)",
    desc: "Local councils have a statutory duty to house homeless families. Many contract with private landlords to provide temporary accommodation. Councils typically pay a fixed nightly rate and handle tenant placement. High demand due to housing shortages across the UK.",
    pros: ["Council-backed payments", "Very high demand", "No void periods", "No tenant finding costs", "Fulfils social need"],
    cons: ["Nightly rates may vary", "Higher wear and tear", "Frequent tenant turnover", "Property standards enforcement", "Political and regulatory risk"],
    idealFor: "Landlords in high-demand urban areas willing to work with councils",
    yield: "6-10%",
  },
  {
    title: "Exempt Accommodation",
    desc: "A specific category of supported housing where enhanced housing benefit rates apply. Properties house vulnerable tenants with care, support, or supervision provided by a registered provider. Higher rents than standard housing benefit due to the support element.",
    pros: ["Enhanced housing benefit rates", "Higher rents than standard LHA", "Provider manages tenants", "Social impact", "Growing sector"],
    cons: ["Heavily scrutinised sector", "Regulatory crackdown on abuse", "Quality standards enforced", "Provider quality varies", "Reputational risk if poorly managed"],
    idealFor: "Experienced landlords partnering with reputable, registered providers only",
    yield: "8-15%",
  },
  {
    title: "Multi-Let (HMO)",
    desc: "Rent individual rooms to separate tenants who share communal facilities. Higher yields than single lets but more regulation, licensing, and management. Room-by-room letting means one void doesn't eliminate all income.",
    pros: ["Highest residential yields", "Income diversification", "One void doesn't empty property", "Strong demand in cities", "Can furnish rooms individually"],
    cons: ["HMO licensing required", "Fire safety standards", "Higher management", "Room size regulations", "Council enforcement"],
    idealFor: "Experienced landlords in cities with strong room rental demand",
    yield: "10-18%",
  },
  {
    title: "Lease Options",
    desc: "Secure the right to purchase a property at an agreed price at a future date, while renting it out in the meantime. You control the property without owning it, collect rent, and exercise the option if the property appreciates in value.",
    pros: ["Control without ownership", "Low capital requirement", "Profit from appreciation", "Rent income during option period", "Flexible exit"],
    cons: ["Complex legal agreements", "Option fee may be lost", "Seller must agree", "Mortgage lender complications", "Requires experienced solicitor"],
    idealFor: "Advanced investors with strong negotiation and legal knowledge",
    yield: "Variable",
  },
];

export default function RentingStrategiesPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-24">
        <div className="container-max px-4">
          <div className="max-w-3xl">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">Complete Guide</p>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">UK Renting Strategies</h1>
            <p className="text-navy-200 text-lg">Every way to generate rental income from UK property — from social housing leasing and guaranteed rent to serviced accommodation and corporate lets. Compare strategies, risks, and returns.</p>
          </div>
        </div>
      </section>

      {/* Quick Comparison */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-navy-800 mb-6">Strategy Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy-50">
                  <th className="text-left p-3 font-semibold text-navy-800">Strategy</th>
                  <th className="text-left p-3 font-semibold text-navy-800">Typical Yield</th>
                  <th className="text-left p-3 font-semibold text-navy-800">Void Risk</th>
                  <th className="text-left p-3 font-semibold text-navy-800">Management</th>
                  <th className="text-left p-3 font-semibold text-navy-800">Capital Needed</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Social Housing Leasing", "4-6%", "None", "None (provider manages)", "Standard"],
                  ["Council Leasing", "3.5-5.5%", "None", "None (council manages)", "Standard"],
                  ["DSS / UC Tenants", "5-8%", "Low", "Standard", "Standard"],
                  ["Guaranteed Rent", "4-6%", "None", "None (company manages)", "Standard"],
                  ["Rent-to-Rent", "Variable", "Low-Medium", "High", "Very Low"],
                  ["Corporate Lets", "6-10%", "Low-Medium", "Medium", "Higher (furnishing)"],
                  ["Student Lets", "8-14%", "Medium (summer)", "High", "Higher (HMO setup)"],
                  ["Serviced Accommodation", "10-25%", "Medium", "Very High", "Higher (furnishing)"],
                  ["Supported Living", "5-8%", "Very Low", "None (provider)", "Standard + adaptations"],
                  ["Temporary Accommodation", "6-10%", "Very Low", "Low", "Standard"],
                  ["Exempt Accommodation", "8-15%", "Very Low", "None (provider)", "Standard"],
                  ["HMO (Multi-Let)", "10-18%", "Low", "High", "Higher (conversion)"],
                  ["Lease Options", "Variable", "Variable", "Standard", "Very Low"],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-navy-50 hover:bg-navy-50/50 transition-colors">
                    <td className="p-3 font-medium text-navy-800">{row[0]}</td>
                    <td className="p-3 text-green-600 font-semibold">{row[1]}</td>
                    <td className="p-3 text-navy-600">{row[2]}</td>
                    <td className="p-3 text-navy-600">{row[3]}</td>
                    <td className="p-3 text-navy-600">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Detailed Strategies */}
      <section className="section-padding bg-navy-50/50">
        <div className="container-max max-w-4xl space-y-8">
          {strategies.map((s) => (
            <div key={s.title} className="bg-white rounded-2xl border border-navy-100 overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-xl font-bold text-navy-800">{s.title}</h2>
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">{s.yield}</span>
                </div>
                <p className="text-sm text-navy-600 leading-relaxed mb-5">{s.desc}</p>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-bold text-green-800 text-sm mb-2">Advantages</h4>
                    <ul className="space-y-1">
                      {s.pros.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-xs text-green-700">
                          <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="font-bold text-red-800 text-sm mb-2">Considerations</h4>
                    <ul className="space-y-1">
                      {s.cons.map((c) => (
                        <li key={c} className="flex items-start gap-2 text-xs text-red-700">
                          <svg className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-navy-500"><strong>Ideal for:</strong> {s.idealFor}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Housing Deep Dive */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          <h2 className="text-2xl font-bold text-navy-800 mb-6">Social Housing Leasing — In Depth</h2>
          <div className="space-y-4 text-sm text-navy-600 leading-relaxed">
            <p>Social housing leasing has become one of the fastest-growing strategies for UK landlords seeking guaranteed, hands-off income. With over 100,000 households in temporary accommodation and 1.2 million on council waiting lists, demand from local authorities is enormous.</p>

            <h3 className="text-lg font-bold text-navy-800 mt-6">How Social Housing Leasing Works</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong>Property assessment:</strong> The council or housing association inspects your property to ensure it meets minimum standards (Decent Homes Standard, fire safety, EPC E minimum)</li>
              <li><strong>Lease agreement:</strong> You sign a lease (typically 3-5 years) agreeing a fixed monthly rent, usually 80-90% of local market rate</li>
              <li><strong>Property handover:</strong> The council/HA takes management responsibility. They find tenants, handle day-to-day maintenance, and manage any tenant issues</li>
              <li><strong>Rent payments:</strong> You receive guaranteed rent monthly, regardless of occupancy. If the property is void, you still get paid</li>
              <li><strong>End of lease:</strong> Property is returned in the same condition (fair wear and tear excepted). Some schemes include a dilapidation budget</li>
            </ol>

            <h3 className="text-lg font-bold text-navy-800 mt-6">Property Standards Required</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Gas Safety Certificate (annual)</li>
              <li>EICR (satisfactory)</li>
              <li>EPC rating E minimum (some require D or C)</li>
              <li>Smoke and CO detectors on every floor</li>
              <li>No Category 1 hazards under the Housing Health and Safety Rating System (HHSRS)</li>
              <li>Adequate kitchen and bathroom facilities</li>
              <li>Secure entry points (doors and windows)</li>
              <li>Good state of repair internally and externally</li>
            </ul>

            <h3 className="text-lg font-bold text-navy-800 mt-6">Finding Social Housing Partners</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Contact your local council&apos;s housing department directly</li>
              <li>Search the Regulator of Social Housing&apos;s register for housing associations in your area</li>
              <li>National schemes: Mears Group, Pinnacle Group, Serco, and other registered providers</li>
              <li>Local lettings agents who specialise in social/supported housing</li>
              <li>PropertyVault verified social housing partners (see our directory)</li>
            </ul>

            <h3 className="text-lg font-bold text-navy-800 mt-6">Tax Implications</h3>
            <p>Social housing leasing income is taxed the same as any other rental income. You can deduct allowable expenses including mortgage interest (subject to Section 24 for personal landlords), insurance, and property maintenance. SPV structures may be more tax-efficient for higher-rate taxpayers.</p>
          </div>

          <Disclaimer type="general" />
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding gradient-navy">
        <div className="container-max text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Explore These Strategies?</h2>
          <p className="text-navy-200 mb-6 max-w-xl mx-auto">Use our calculators to model returns for any renting strategy, or browse properties available for social housing leasing.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/calculators" className="btn-primary">Use Calculators →</Link>
            <Link href="/properties" className="btn-outline !border-white/30 !text-white hover:!bg-white/10">Browse Properties →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
