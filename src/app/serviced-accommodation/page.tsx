import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";

export const metadata: Metadata = {
  title: "Serviced Accommodation UK — Airbnb & Short-Let Guide | PropertyVault",
  description: "Complete guide to serviced accommodation investing. Airbnb strategy, pricing, compliance, 90-day rule, furnishing, and management for short-term lets.",
};

export default function ServicedAccommodationPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-24">
        <div className="container-max px-4">
          <div className="max-w-3xl">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">SA Guide</p>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Serviced Accommodation</h1>
            <p className="text-navy-200 text-lg">Short-term and holiday lets can generate 2-3x the income of traditional buy-to-let. Learn Airbnb strategies, pricing optimisation, compliance, and management.</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">What Is Serviced Accommodation?</h2>
            <p className="text-navy-600 leading-relaxed">Serviced accommodation (SA) is fully furnished, short-term rental property — typically booked nightly or weekly through platforms like Airbnb, Booking.com, and direct bookings. Properties are equipped with everything a guest needs: furniture, kitchen equipment, towels, toiletries, and Wi-Fi.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">The 90-Day Rule</h2>
            <p className="text-navy-600 leading-relaxed">In London, you can only rent out your entire property on a short-term basis for up to 90 nights per calendar year without planning permission. Outside London, there is currently no national limit, but some local authorities are introducing restrictions through Article 4 directions. Always check with your local planning authority.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Revenue Potential</h2>
            <div className="bg-navy-50 rounded-xl p-6 space-y-2 text-sm">
              <div className="flex justify-between"><span>2-bed apartment, Manchester</span><span className="font-bold">£120/night average</span></div>
              <div className="flex justify-between"><span>Occupancy rate (75%)</span><span className="font-bold">274 nights/year</span></div>
              <div className="flex justify-between"><span>Gross annual revenue</span><span className="font-bold text-green-600">£32,880</span></div>
              <div className="flex justify-between"><span>vs long-term let (£1,100/month)</span><span className="font-bold">£13,200/year</span></div>
              <div className="flex justify-between border-t border-navy-200 pt-2 mt-2"><span className="font-bold">SA premium</span><span className="font-bold text-green-600">149% more</span></div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Running Costs</h2>
            <ul className="list-disc pl-6 space-y-2 text-navy-600">
              <li><strong>Cleaning</strong> — £40-80 per turnover (biggest operational cost)</li>
              <li><strong>Utilities</strong> — you pay all bills (£150-300/month)</li>
              <li><strong>Platform fees</strong> — Airbnb charges 3% host service fee</li>
              <li><strong>Wi-Fi and TV</strong> — essential for guest reviews (£40-60/month)</li>
              <li><strong>Consumables</strong> — toiletries, coffee, tea (£30-50/month)</li>
              <li><strong>Insurance</strong> — specialist SA insurance (£300-600/year)</li>
              <li><strong>Furnishing</strong> — initial setup £3,000-8,000 per unit</li>
              <li><strong>Management</strong> — if using a management company: 15-25% of revenue</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Tax Benefits</h2>
            <p className="text-navy-600 leading-relaxed">If your SA property qualifies as a Furnished Holiday Let (FHL), you may benefit from capital allowances on furniture, mortgage interest relief as a business expense, and more favourable CGT treatment. FHL status requires the property to be available for let for at least 210 days per year and actually let for at least 105 days. Note: The government has announced changes to FHL tax treatment — check the latest HMRC guidance.</p>
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


