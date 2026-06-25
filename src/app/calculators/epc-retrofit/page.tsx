"use client";

import { useState, useMemo } from "react";
import { Disclaimer } from "@/components/legal/Disclaimer";

type Measure = {
  id: string;
  name: string;
  desc: string;
  defaultCost: number;
  epcImpact: string;
  enabled: boolean;
  cost: number;
};

const defaultMeasures: Measure[] = [
  { id: "loft", name: "Loft Insulation (270mm)", desc: "Top up or install loft insulation to recommended 270mm depth. One of the most cost-effective improvements.", defaultCost: 400, epcImpact: "High", enabled: false, cost: 400 },
  { id: "cavity", name: "Cavity Wall Insulation", desc: "Fill cavity walls with insulation material. Suitable for properties built after 1920s with unfilled cavities.", defaultCost: 800, epcImpact: "High", enabled: false, cost: 800 },
  { id: "solidwall", name: "Internal / Solid Wall Insulation", desc: "Insulate solid walls internally or externally. Significant improvement but higher cost. Essential for pre-1920s properties.", defaultCost: 8000, epcImpact: "Very High", enabled: false, cost: 8000 },
  { id: "glazing", name: "Double / Triple Glazing", desc: "Replace single-glazed windows with double or triple glazing. Reduces heat loss and improves comfort.", defaultCost: 5000, epcImpact: "Medium", enabled: false, cost: 5000 },
  { id: "draught", name: "Draught-Proofing", desc: "Seal gaps around windows, doors, letterboxes, and floorboards. Low cost, quick improvement.", defaultCost: 250, epcImpact: "Low-Medium", enabled: false, cost: 250 },
  { id: "boiler", name: "New Condensing Boiler", desc: "Replace an old G-rated boiler with a modern A-rated condensing boiler. Typical lifespan 10-15 years.", defaultCost: 3000, epcImpact: "High", enabled: false, cost: 3000 },
  { id: "smartheating", name: "Smart Heating Controls", desc: "Install smart thermostats, TRVs, and programmable heating controls. Reduces energy waste.", defaultCost: 350, epcImpact: "Low-Medium", enabled: false, cost: 350 },
  { id: "ashp", name: "Air Source Heat Pump", desc: "Replace gas boiler with an air source heat pump. Significant carbon reduction. May require improved insulation first.", defaultCost: 12000, epcImpact: "Very High", enabled: false, cost: 12000 },
  { id: "solar", name: "Solar PV Panels", desc: "Install rooftop solar panels to generate electricity. Reduces bills and improves EPC. Feed-in potential.", defaultCost: 6000, epcImpact: "High", enabled: false, cost: 6000 },
  { id: "hotwater", name: "Hot Water Cylinder Insulation", desc: "Insulate the hot water tank with a British Standard jacket. Very low cost, quick win.", defaultCost: 25, epcImpact: "Low", enabled: false, cost: 25 },
  { id: "led", name: "LED Lighting Throughout", desc: "Replace all bulbs with LED alternatives. Low cost and improves the lighting energy score on EPC.", defaultCost: 100, epcImpact: "Low", enabled: false, cost: 100 },
  { id: "floorins", name: "Floor Insulation", desc: "Insulate suspended timber floors or solid floors. Often overlooked but can make a noticeable difference.", defaultCost: 1500, epcImpact: "Medium", enabled: false, cost: 1500 },
];

export default function EPCRetrofitPage() {
  const [measures, setMeasures] = useState<Measure[]>(defaultMeasures);
  const [grantAmount, setGrantAmount] = useState(0);
  const [annualSavings, setAnnualSavings] = useState(400);
  const [currentEPC, setCurrentEPC] = useState("E");
  const [propertyType, setPropertyType] = useState("semi-detached");

  const toggleMeasure = (id: string) => {
    setMeasures(measures.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
  };

  const updateCost = (id: string, cost: number) => {
    setMeasures(measures.map(m => m.id === id ? { ...m, cost } : m));
  };

  const results = useMemo(() => {
    const selected = measures.filter(m => m.enabled);
    const totalCost = selected.reduce((sum, m) => sum + m.cost, 0);
    const afterGrant = Math.max(0, totalCost - grantAmount);
    const paybackYears = annualSavings > 0 ? afterGrant / annualSavings : 0;

    return {
      selectedCount: selected.length,
      totalCost,
      grantSaving: Math.min(grantAmount, totalCost),
      afterGrant,
      paybackYears,
      annualSavings,
    };
  }, [measures, grantAmount, annualSavings]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Calculator</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">EPC Retrofit Cost Calculator</h1>
          <p className="text-navy-200 max-w-2xl">Estimate the cost of improving your property&apos;s EPC rating. Select the measures you are considering, adjust costs to match your quotes, and see the total investment and payback period.</p>
        </div>
      </section>

      {/* Deadline Warning */}
      <section className="bg-white border-b border-navy-100">
        <div className="container-max px-4 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            <div>
              <p className="text-sm text-red-800 font-semibold">EPC C Deadline for Rental Properties</p>
              <p className="text-xs text-red-700 mt-0.5">The UK Government has proposed that all privately rented properties in England and Wales must reach EPC band C by 2030 for new tenancies. Non-compliance could result in fines of up to £30,000 per property. Check the latest government guidance for confirmed dates and requirements.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Measures */}
            <div className="lg:col-span-2 space-y-6">
              {/* Property Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Current EPC Rating</label>
                  <select value={currentEPC} onChange={(e) => setCurrentEPC(e.target.value)}
                    className="w-full px-4 py-3 border border-navy-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold-400">
                    <option>A</option><option>B</option><option>C</option><option>D</option><option>E</option><option>F</option><option>G</option><option>Unknown</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Property Type</label>
                  <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-4 py-3 border border-navy-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold-400">
                    <option value="detached">Detached House</option>
                    <option value="semi-detached">Semi-Detached House</option>
                    <option value="terraced">Terraced House</option>
                    <option value="flat">Flat / Apartment</option>
                    <option value="bungalow">Bungalow</option>
                  </select>
                </div>
              </div>

              {/* Measures */}
              <div>
                <h2 className="text-lg font-bold text-navy-800 mb-3">Select Retrofit Measures</h2>
                <p className="text-xs text-navy-500 mb-4">Toggle measures on/off and adjust costs to match your contractor quotes. Default costs are illustrative averages.</p>
                <div className="space-y-3">
                  {measures.map((m) => (
                    <div key={m.id} className={`rounded-xl border p-4 transition-all ${m.enabled ? "border-gold-400 bg-gold-50/30" : "border-navy-100 bg-white"}`}>
                      <div className="flex items-start gap-3">
                        <button onClick={() => toggleMeasure(m.id)}
                          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${m.enabled ? "bg-navy-600 border-navy-600" : "border-navy-300 hover:border-navy-400"}`}>
                          {m.enabled && <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-navy-800 text-sm">{m.name}</h3>
                            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${m.epcImpact === "Very High" ? "bg-green-100 text-green-700" : m.epcImpact === "High" ? "bg-green-50 text-green-600" : m.epcImpact === "Medium" ? "bg-blue-50 text-blue-600" : "bg-navy-50 text-navy-500"}`}>
                              {m.epcImpact} impact
                            </span>
                          </div>
                          <p className="text-xs text-navy-500 mt-0.5">{m.desc}</p>
                          {m.enabled && (
                            <div className="mt-2">
                              <label className="text-xs text-navy-600 font-medium">Cost (£)</label>
                              <input type="number" value={m.cost} onChange={(e) => updateCost(m.id, Number(e.target.value))}
                                className="w-32 px-3 py-1.5 border border-navy-200 rounded-lg text-sm ml-2 focus:outline-none focus:ring-2 focus:ring-gold-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grant & Savings */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Grant Funding Available (£)</label>
                  <p className="text-xs text-navy-400 mb-2">e.g. ECO4, Great British Insulation Scheme, Boiler Upgrade Scheme, local authority grants</p>
                  <input type="number" value={grantAmount} onChange={(e) => setGrantAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Estimated Annual Energy Savings (£)</label>
                  <p className="text-xs text-navy-400 mb-2">How much you expect to save per year on energy bills after improvements</p>
                  <input type="number" value={annualSavings} onChange={(e) => setAnnualSavings(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
              </div>
            </div>

            {/* Right: Results */}
            <div>
              <div className="sticky top-20">
                <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-6 text-white mb-4">
                  <p className="text-navy-300 text-xs mb-1">Total Retrofit Cost</p>
                  <p className="text-3xl font-bold text-gold-400 mb-4">{fmt(results.totalCost)}</p>

                  <div className="space-y-3">
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-navy-300 text-xs">Measures Selected</p>
                      <p className="font-bold text-lg">{results.selectedCount} of {measures.length}</p>
                    </div>
                    {results.grantSaving > 0 && (
                      <div className="bg-white/10 rounded-lg p-3">
                        <p className="text-navy-300 text-xs">Grant Deduction</p>
                        <p className="font-bold text-lg text-green-400">-{fmt(results.grantSaving)}</p>
                      </div>
                    )}
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-navy-300 text-xs">Your Cost (After Grants)</p>
                      <p className="font-bold text-xl text-gold-400">{fmt(results.afterGrant)}</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-navy-300 text-xs">Annual Energy Savings</p>
                      <p className="font-bold text-lg">{fmt(results.annualSavings)}/year</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-navy-300 text-xs">Simple Payback Period</p>
                      <p className="font-bold text-lg">{results.paybackYears > 0 ? results.paybackYears.toFixed(1) + " years" : "—"}</p>
                    </div>
                  </div>
                </div>

                {/* Current EPC indicator */}
                <div className="bg-white rounded-xl border border-navy-100 p-4">
                  <p className="text-xs font-semibold text-navy-700 mb-2">EPC Rating Scale</p>
                  <div className="space-y-1">
                    {[
                      { band: "A", color: "bg-green-600", range: "92+" },
                      { band: "B", color: "bg-green-500", range: "81-91" },
                      { band: "C", color: "bg-green-400", range: "69-80" },
                      { band: "D", color: "bg-yellow-400", range: "55-68" },
                      { band: "E", color: "bg-orange-400", range: "39-54" },
                      { band: "F", color: "bg-orange-500", range: "21-38" },
                      { band: "G", color: "bg-red-500", range: "1-20" },
                    ].map((b) => (
                      <div key={b.band} className={`flex items-center gap-2 px-2 py-1 rounded ${currentEPC === b.band ? "ring-2 ring-navy-600 bg-navy-50" : ""}`}>
                        <div className={`w-8 h-6 ${b.color} rounded text-white text-xs font-bold flex items-center justify-center`}>{b.band}</div>
                        <span className="text-xs text-navy-600">{b.range} points</span>
                        {currentEPC === b.band && <span className="text-xs font-bold text-navy-800 ml-auto">Current</span>}
                        {b.band === "C" && <span className="text-xs text-red-600 font-medium ml-auto">Target</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grants Info */}
      <section className="section-padding bg-navy-50/50">
        <div className="container-max max-w-4xl">
          <h2 className="text-2xl font-bold text-navy-800 mb-4 text-center">Available Grants &amp; Funding</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 border border-navy-100">
              <h3 className="font-bold text-navy-800 mb-1">Boiler Upgrade Scheme (BUS)</h3>
              <p className="text-sm text-navy-600">Up to £7,500 towards an air source heat pump or £5,000 towards a ground source heat pump. Available to homeowners and landlords in England and Wales.</p>
              <a href="https://www.gov.uk/apply-boiler-upgrade-scheme" target="_blank" rel="noopener noreferrer" className="text-xs text-gold-600 font-semibold mt-2 inline-block">Check eligibility on GOV.UK →</a>
            </div>
            <div className="bg-white rounded-xl p-5 border border-navy-100">
              <h3 className="font-bold text-navy-800 mb-1">Great British Insulation Scheme</h3>
              <p className="text-sm text-navy-600">Free or subsidised insulation for eligible households. Covers loft insulation, cavity wall insulation, and other measures.</p>
              <a href="https://www.gov.uk/apply-great-british-insulation-scheme" target="_blank" rel="noopener noreferrer" className="text-xs text-gold-600 font-semibold mt-2 inline-block">Check eligibility on GOV.UK →</a>
            </div>
            <div className="bg-white rounded-xl p-5 border border-navy-100">
              <h3 className="font-bold text-navy-800 mb-1">ECO4 Scheme</h3>
              <p className="text-sm text-navy-600">Energy Company Obligation funding for insulation, heating, and other energy efficiency measures. Targeted at low-income and vulnerable households.</p>
              <a href="https://www.ofgem.gov.uk/environmental-and-social-schemes/energy-company-obligation-eco" target="_blank" rel="noopener noreferrer" className="text-xs text-gold-600 font-semibold mt-2 inline-block">Learn more on Ofgem →</a>
            </div>
            <div className="bg-white rounded-xl p-5 border border-navy-100">
              <h3 className="font-bold text-navy-800 mb-1">Local Authority Grants</h3>
              <p className="text-sm text-navy-600">Many local councils offer additional grants and loans for energy efficiency improvements. Check with your local authority for schemes in your area.</p>
              <a href="https://www.simpleenergyadvice.org.uk/" target="_blank" rel="noopener noreferrer" className="text-xs text-gold-600 font-semibold mt-2 inline-block">Find local schemes →</a>
            </div>
          </div>
        </div>
      </section>

      {/* EPC Lookup */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl text-center">
          <h2 className="text-xl font-bold text-navy-800 mb-3">Check Your Current EPC Rating</h2>
          <p className="text-sm text-navy-500 mb-4">Look up the current EPC rating and recommendations for any property in England and Wales — free on the government register.</p>
          <a href="https://www.gov.uk/find-energy-certificate" target="_blank" rel="noopener noreferrer" className="btn-primary inline-block">Check EPC on GOV.UK →</a>
        </div>
      </section>

      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-4xl">
          <Disclaimer type="calculator" />
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl space-y-6 text-navy-700 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-navy-800">EPC C Deadline for Landlords — What's Required and When</h2>
          <p>The government has proposed that all new tenancies must have a minimum EPC rating of C by 2025, with all existing tenancies following by 2028. While the legislation is not yet finalised, most industry experts advise landlords to plan now — retrofitting a whole portfolio close to a deadline is expensive and qualified contractors will be scarce.</p>
          <p>Currently, all rental properties must have a minimum EPC rating of E. Properties rated F or G cannot legally be let (unless an exemption applies) — landlords face fines of up to £30,000 per property.</p>
          <h3 className="font-bold text-navy-800">What Improvements Move the EPC Rating Most?</h3>
          <p>Common improvements and typical point impact: loft insulation (£300-£600, +8-12 SAP points), cavity wall insulation (£500-£1,500, +6-10 points), heat pump replacing gas boiler (£7,000-£14,000 after grant, +5-15 points), double glazing replacing single (£3,000-£8,000, +4-8 points), solar panels (+10-20 points). The most cost-effective path depends on your starting EPC and property type.</p>
          <h3 className="font-bold text-navy-800">Grants Available — Don't Pay Full Price</h3>
          <p>The Boiler Upgrade Scheme offers £7,500 towards an air source heat pump. The Great British Insulation Scheme and ECO4 provide free or subsidised insulation for lower-rated properties. Always check grant availability before paying full price — thousands of pounds in support goes unclaimed by landlords every year.</p>
          <h3 className="font-bold text-navy-800">Exemptions and Cost Cap</h3>
          <p>Under the proposed rules, the maximum spend required to reach EPC C is £15,000. Spend up to this and still can't reach C? Register for an exemption. Exemptions also apply where improvements would damage the property's structure — common with listed buildings and older stone properties.</p>
        </div>
      </section>
    </>
  );
}
