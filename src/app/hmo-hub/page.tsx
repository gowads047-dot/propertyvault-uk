import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";

export const metadata: Metadata = {
  title: "HMO Guide UK — Licensing, Yields & Management | PropertyVault",
  description: "Complete HMO investing guide. Licensing requirements, room sizes, fire safety, yields, management, and how to run a profitable House in Multiple Occupation.",
};

export default function HMOHubPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-24">
        <div className="container-max px-4">
          <div className="max-w-3xl">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">HMO Guide</p>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">HMO Investing Hub</h1>
            <p className="text-navy-200 text-lg">Houses in Multiple Occupation offer the highest rental yields in UK property. Learn licensing requirements, room standards, fire safety, and management strategies.</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">What Is an HMO?</h2>
            <p className="text-navy-600 leading-relaxed">An HMO is a property rented to 3 or more tenants from 2 or more separate households who share facilities such as a kitchen or bathroom. HMOs generate significantly higher yields than single-let properties — typically 10-18% gross — because you rent by the room rather than the whole property.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Licensing</h2>
            <div className="space-y-3 text-navy-600 leading-relaxed">
              <p><strong>Mandatory Licensing:</strong> Required for HMOs with 5 or more people from 2 or more households, regardless of the number of storeys. Costs typically £500-1,500 per licence, valid for up to 5 years.</p>
              <p><strong>Additional Licensing:</strong> Many councils operate schemes covering smaller HMOs (3-4 people). Check your local authority&apos;s website.</p>
              <p><strong>Selective Licensing:</strong> Some areas require all rented properties to be licensed, not just HMOs.</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Minimum Room Sizes</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead><tr className="bg-navy-100"><th className="text-left p-3 font-semibold">Room Use</th><th className="text-left p-3 font-semibold">Minimum Size</th></tr></thead>
                <tbody>
                  <tr className="border-b border-navy-100"><td className="p-3">Single bedroom (1 person aged 10+)</td><td className="p-3">6.51 m²</td></tr>
                  <tr className="border-b border-navy-100"><td className="p-3">Double bedroom (2 persons aged 10+)</td><td className="p-3">10.22 m²</td></tr>
                  <tr><td className="p-3">Bedroom (1 child under 10)</td><td className="p-3">4.64 m²</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">HMO Fire Safety</h2>
            <ul className="list-disc pl-6 space-y-2 text-navy-600">
              <li>Fire doors to all bedrooms, kitchens, and living rooms (FD30S rated, self-closing)</li>
              <li>Interlinked fire detection system (Grade A in larger HMOs)</li>
              <li>Emergency lighting on escape routes</li>
              <li>Fire blanket in the kitchen</li>
              <li>Fire extinguishers on each floor</li>
              <li>Clear, unobstructed escape routes</li>
              <li>Fire risk assessment reviewed annually</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Example HMO Deal</h2>
            <div className="bg-navy-50 rounded-xl p-6 space-y-2 text-sm">
              <div className="flex justify-between"><span>Purchase price (4-bed house)</span><span className="font-bold">£180,000</span></div>
              <div className="flex justify-between"><span>Conversion cost (add en-suites, fire doors, etc.)</span><span className="font-bold">£40,000</span></div>
              <div className="flex justify-between"><span>Total investment</span><span className="font-bold">£220,000</span></div>
              <div className="flex justify-between border-t border-navy-200 pt-2 mt-2"><span>5 rooms × £550/month</span><span className="font-bold text-green-600">£2,750/month</span></div>
              <div className="flex justify-between"><span>Annual rent</span><span className="font-bold text-green-600">£33,000</span></div>
              <div className="flex justify-between"><span>Gross yield</span><span className="font-bold text-green-600">15%</span></div>
              <div className="flex justify-between"><span>vs single-let at £950/month</span><span className="font-bold">5.2%</span></div>
            </div>
          </div>
        </div>
      </section>
      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-4xl">
          <Disclaimer type="general" />
        </div>
      </section>
    </>
  );
}


