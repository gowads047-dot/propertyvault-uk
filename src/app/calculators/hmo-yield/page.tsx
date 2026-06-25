"use client";

import { useState, useMemo } from "react";
import { Disclaimer } from "@/components/legal/Disclaimer";

export default function HMOYieldPage() {
  const [purchasePrice, setPurchasePrice] = useState(200000);
  const [rooms, setRooms] = useState([
    { name: "Room 1", rent: 550, occupied: true },
    { name: "Room 2", rent: 525, occupied: true },
    { name: "Room 3", rent: 500, occupied: true },
    { name: "Room 4", rent: 550, occupied: true },
    { name: "Room 5", rent: 500, occupied: true },
  ]);
  const [billsPerMonth, setBillsPerMonth] = useState(400);
  const [insurance, setInsurance] = useState(80);
  const [maintenance, setMaintenance] = useState(100);
  const [management, setManagement] = useState(0);
  const [licensing, setLicensing] = useState(25);
  const [mortgagePayment, setMortgagePayment] = useState(750);

  const addRoom = () => setRooms([...rooms, { name: `Room ${rooms.length + 1}`, rent: 500, occupied: true }]);
  const removeRoom = () => { if (rooms.length > 1) setRooms(rooms.slice(0, -1)); };
  const updateRoom = (i: number, field: string, value: any) => {
    const updated = [...rooms];
    (updated[i] as any)[field] = value;
    setRooms(updated);
  };

  const results = useMemo(() => {
    const occupiedRooms = rooms.filter(r => r.occupied);
    const totalMonthlyRent = occupiedRooms.reduce((sum, r) => sum + r.rent, 0);
    const maxMonthlyRent = rooms.reduce((sum, r) => sum + r.rent, 0);
    const annualRent = totalMonthlyRent * 12;
    const monthlyExpenses = billsPerMonth + insurance + maintenance + management + licensing;
    const annualExpenses = monthlyExpenses * 12;
    const annualMortgage = mortgagePayment * 12;
    const grossYield = (maxMonthlyRent * 12 / purchasePrice) * 100;
    const netIncome = annualRent - annualExpenses;
    const netYield = (netIncome / purchasePrice) * 100;
    const monthlyCashFlow = (totalMonthlyRent - monthlyExpenses - mortgagePayment);
    const annualCashFlow = monthlyCashFlow * 12;
    const occupancy = rooms.length > 0 ? (occupiedRooms.length / rooms.length * 100) : 0;
    const perRoomAvg = rooms.length > 0 ? maxMonthlyRent / rooms.length : 0;

    return { totalMonthlyRent, maxMonthlyRent, annualRent, monthlyExpenses, annualExpenses, grossYield, netIncome, netYield, monthlyCashFlow, annualCashFlow, occupancy, perRoomAvg, occupiedCount: occupiedRooms.length, totalRooms: rooms.length };
  }, [rooms, billsPerMonth, insurance, maintenance, management, licensing, mortgagePayment, purchasePrice]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Calculator</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">HMO Yield Calculator</h1>
          <p className="text-navy-200 max-w-2xl">Calculate room-by-room income, gross and net yields, and monthly cash flow for any House in Multiple Occupation.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">Purchase Price / Property Value</label>
                <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">£</span>
                <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(Number(e.target.value))} className="w-full pl-8 pr-4 py-3 border border-navy-200 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-bold text-navy-800">Rooms ({rooms.length})</h3>
                <div className="flex gap-2">
                  <button onClick={removeRoom} className="px-3 py-1 bg-navy-100 text-navy-600 rounded text-sm hover:bg-navy-200">−</button>
                  <button onClick={addRoom} className="px-3 py-1 bg-navy-600 text-white rounded text-sm hover:bg-navy-700">+ Add Room</button>
                </div>
              </div>
              <div className="space-y-2">
                {rooms.map((room, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${room.occupied ? "border-green-200 bg-green-50/30" : "border-navy-100 bg-navy-50/30"}`}>
                    <input type="checkbox" checked={room.occupied} onChange={(e) => updateRoom(i, "occupied", e.target.checked)} className="rounded" />
                    <input type="text" value={room.name} onChange={(e) => updateRoom(i, "name", e.target.value)} className="w-20 px-2 py-1 border border-navy-200 rounded text-sm" />
                    <span className="text-sm text-navy-500">£</span>
                    <input type="number" value={room.rent} onChange={(e) => updateRoom(i, "rent", Number(e.target.value))} className="w-20 px-2 py-1 border border-navy-200 rounded text-sm font-semibold" />
                    <span className="text-xs text-navy-400">/month</span>
                  </div>
                ))}
              </div>

              <h3 className="font-bold text-navy-800 text-sm border-b border-navy-100 pb-2">Monthly Costs</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Bills (gas/elec/water/wifi)", value: billsPerMonth, set: setBillsPerMonth },
                  { label: "Insurance", value: insurance, set: setInsurance },
                  { label: "Maintenance", value: maintenance, set: setMaintenance },
                  { label: "Management fee", value: management, set: setManagement },
                  { label: "Licensing (monthly equiv.)", value: licensing, set: setLicensing },
                  { label: "Mortgage payment", value: mortgagePayment, set: setMortgagePayment },
                ].map((c) => (
                  <div key={c.label}><label className="block text-xs text-navy-600 mb-0.5">{c.label}</label>
                  <div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-navy-400 text-xs">£</span>
                  <input type="number" value={c.value} onChange={(e) => c.set(Number(e.target.value))} className="w-full pl-6 pr-2 py-1.5 border border-navy-200 rounded text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-8 text-white mb-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div><p className="text-navy-300 text-xs">Gross Yield</p><p className="text-3xl font-bold text-gold-400">{results.grossYield.toFixed(1)}%</p></div>
                  <div><p className="text-navy-300 text-xs">Net Yield</p><p className="text-3xl font-bold text-white">{results.netYield.toFixed(1)}%</p></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-xs opacity-70">Monthly Rent</p><p className="font-bold">{fmt(results.totalMonthlyRent)}</p></div>
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-xs opacity-70">Monthly Cash Flow</p><p className={`font-bold ${results.monthlyCashFlow >= 0 ? "text-green-400" : "text-red-400"}`}>{fmt(results.monthlyCashFlow)}</p></div>
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-xs opacity-70">Occupancy</p><p className="font-bold">{results.occupiedCount}/{results.totalRooms} ({results.occupancy.toFixed(0)}%)</p></div>
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-xs opacity-70">Avg Rent/Room</p><p className="font-bold">{fmt(results.perRoomAvg)}</p></div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-navy-100 p-5">
                <h4 className="font-bold text-navy-800 mb-3">Annual P&amp;L</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Gross annual rent</span><span className="font-semibold">{fmt(results.annualRent)}</span></div>
                  <div className="flex justify-between text-red-600"><span>Annual expenses</span><span>-{fmt(results.annualExpenses)}</span></div>
                  <div className="flex justify-between border-t pt-1"><span className="font-bold">Net operating income</span><span className="font-bold">{fmt(results.netIncome)}</span></div>
                  <div className="flex justify-between text-red-600"><span>Mortgage</span><span>-{fmt(mortgagePayment * 12)}</span></div>
                  <div className="flex justify-between border-t pt-1"><span className="font-bold">Annual cash flow</span><span className={`font-bold ${results.annualCashFlow >= 0 ? "text-green-600" : "text-red-600"}`}>{fmt(results.annualCashFlow)}</span></div>
                </div>
              </div>
            </div>
          </div>
          <Disclaimer type="calculator" />
        </div>
      </section>

      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-3xl space-y-6 text-navy-700 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-navy-800">Why HMO Yields Are Higher Than Standard Buy-to-Let</h2>
          <p>Houses in Multiple Occupation (HMOs) generate higher yields than single-let properties because you rent each room individually rather than the whole house to one household. A 5-bed property in a typical Midlands city might achieve £400/month as a single let, but £350-£450 per room as an HMO — delivering £1,750-£2,250 in total monthly rent from the same building.</p>
          <p>Gross HMO yields of 10-15% are common in cities like Nottingham, Derby, and Birmingham. Single-let buy-to-let in the same areas typically yields 4-7% gross. That difference compounds significantly over a portfolio.</p>
          <h3 className="font-bold text-navy-800">HMO Expenses to Factor In</h3>
          <p>HMOs have higher running costs than single-lets. As the landlord you typically pay all utilities (gas, electric, water, broadband) and include these in the room rent. Management fees are higher — often 12-15% with specialist agents vs 8-10% for single-let. Maintenance is more frequent with more tenants. Licensing fees (mandatory for large HMOs and in Article 4 areas) range from £250-£1,500 depending on the council.</p>
          <h3 className="font-bold text-navy-800">What Is a Good HMO Yield?</h3>
          <p>Most experienced HMO investors target a minimum 10% gross yield and at least £200 net cash flow per room per month after all costs including mortgage. Below 8% gross and the extra complexity of HMO management rarely justifies itself over a well-located single-let. Use this calculator to test those thresholds before committing to a deal.</p>
          <h3 className="font-bold text-navy-800">Article 4 Directions and HMO Licensing</h3>
          <p>Many councils have introduced Article 4 directions that require planning permission to convert a family home (C3) to an HMO (C4). Always check the local planning authority before purchasing. Mandatory HMO licensing applies to properties with 5 or more people from 2 or more households sharing facilities — failure to license carries an unlimited fine and a Rent Repayment Order risk.</p>
        </div>
      </section>
    </>
  );
}
