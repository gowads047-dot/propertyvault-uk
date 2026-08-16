"use client";

import { useState } from "react";
import { SignatureBlock, ShareToolbar } from "@/components/SignatureBlock";
import { PrintFooter } from "@/components/PrintDoc";

export default function RentReceipt() {
  const [mode, setMode] = useState<"form" | "preview">("form");
  const [landlordName, setLandlordName] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [periodTo, setPeriodTo] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState<"bank-transfer" | "cash" | "cheque" | "standing-order">("bank-transfer");
  const [reference, setReference] = useState("");
  const [receiptNumber, setReceiptNumber] = useState(() => `REC-${Date.now().toString().slice(-6)}`);
  const [includesDeposit, setIncludesDeposit] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");

  const fmt = (d: string) => d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "_______________";

  const methodLabel: Record<string, string> = {
    "bank-transfer": "Bank Transfer",
    "cash": "Cash",
    "cheque": "Cheque",
    "standing-order": "Standing Order",
  };

  const total = amount && depositAmount && includesDeposit
    ? (parseFloat(amount) + parseFloat(depositAmount)).toFixed(2)
    : amount;

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #print-doc, #print-doc * { visibility: visible !important; }
          #print-doc { position: absolute; left: 0; top: 0; width: 100%; background: white; display: flex; align-items: center; justify-content: center; }
          .receipt-inner { width: 148mm; margin: auto; padding: 24px; border: 2px solid #0f1b36; }
          @page { size: A5 landscape; margin: 0; }
        }
      `}</style>

      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Template</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Rent Receipt</h1>
          <p className="text-navy-200 max-w-2xl">Generate a professional, printable rent receipt. Recommended for cash payments — proof of payment protects both landlord and tenant.</p>
        </div>
      </section>

      <div className="border-b border-navy-100 bg-white sticky top-0 z-10">
        <div className="container-max px-4 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-1 bg-navy-50 rounded-xl p-1">
            {(["form", "preview"] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${mode === m ? "bg-navy-800 text-white" : "text-navy-500 hover:text-navy-800"}`}>
                {m === "form" ? "✏️ Fill in details" : "👁 Preview receipt"}
              </button>
            ))}
          </div>
          <button onClick={() => { setMode("preview"); setTimeout(() => window.print(), 200); }} className="btn-primary text-sm">🖨️ Print / PDF</button>
        </div>
      </div>

      {mode === "form" ? (
        <section className="section-padding bg-cream">
          <div className="container-max max-w-lg space-y-6">
            <div className="bg-white rounded-2xl border border-navy-100 p-6 space-y-4">
              <h2 className="font-bold text-navy-800">Parties & Property</h2>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Landlord Name *</label>
                <input value={landlordName} onChange={e => setLandlordName(e.target.value)} placeholder="Landlord or agent name" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Tenant Name *</label>
                <input value={tenantName} onChange={e => setTenantName(e.target.value)} placeholder="Tenant full name" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Property Address *</label>
                <input value={propertyAddress} onChange={e => setPropertyAddress(e.target.value)} placeholder="Full address" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
            </div>

            <div className="bg-white rounded-2xl border border-navy-100 p-6 space-y-4">
              <h2 className="font-bold text-navy-800">Payment Details</h2>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Amount (£) *</label>
                <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400">£</span>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-navy-700 mb-1">Period from *</label>
                  <input type="date" value={periodFrom} onChange={e => setPeriodFrom(e.target.value)} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                <div><label className="block text-sm font-semibold text-navy-700 mb-1">Period to *</label>
                  <input type="date" value={periodTo} onChange={e => setPeriodTo(e.target.value)} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              </div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Date of Payment *</label>
                <input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["bank-transfer", "cash", "cheque", "standing-order"] as const).map(m => (
                    <button key={m} onClick={() => setPaymentMethod(m)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${paymentMethod === m ? "bg-navy-800 text-white border-navy-800" : "border-navy-200 text-navy-600 hover:border-navy-400"}`}>
                      {methodLabel[m]}
                    </button>
                  ))}
                </div>
              </div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Reference (optional)</label>
                <input value={reference} onChange={e => setReference(e.target.value)} placeholder="e.g. bank ref, cheque number" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Receipt Number</label>
                <input value={receiptNumber} onChange={e => setReceiptNumber(e.target.value)} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
            </div>

            <div className="bg-white rounded-2xl border border-navy-100 p-6">
              <div className="flex items-center gap-3 mb-3" onClick={() => setIncludesDeposit(!includesDeposit)}>
                <div className={`w-5 h-5 rounded border-2 flex-shrink-0 cursor-pointer flex items-center justify-center ${includesDeposit ? "bg-gold-400 border-gold-400" : "border-navy-300"}`}>
                  {includesDeposit && <svg className="w-3 h-3 text-navy-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </div>
                <label className="text-sm font-semibold text-navy-700 cursor-pointer">Include security deposit in this receipt</label>
              </div>
              {includesDeposit && (
                <div><label className="block text-sm font-semibold text-navy-700 mb-1">Deposit Amount (£)</label>
                  <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400">£</span>
                    <input type="number" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} placeholder="0.00" className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
              )}
            </div>

            <button onClick={() => setMode("preview")} className="w-full btn-gold">Preview Receipt →</button>
          </div>
        </section>
      ) : (
        <section className="section-padding bg-cream">
          <div className="container-max max-w-2xl">
            <div id="print-doc" className="p-10" style={{ background: "white", color: "#1a1a1a", fontFamily: "Arial, Helvetica, sans-serif", maxWidth: 520, margin: "0 auto" }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 12, borderBottom: "2.5px solid #0f1b36", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, background: "#0f1b36", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M10 2L2 8.5V17a1 1 0 001 1h4.5v-5a1.5 1.5 0 011.5-1.5h2a1.5 1.5 0 011.5 1.5v5H17a1 1 0 001-1V8.5L10 2z" fill="white"/></svg>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "#0f1b36", margin: 0 }}>PropertyVault<span style={{ color: "#c9a84c" }}>.co.uk</span></p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 9, color: "#6b7280", margin: 0 }}>Receipt No. {receiptNumber}</p>
                  <p style={{ fontSize: 9, color: "#6b7280", margin: 0 }}>{fmt(paymentDate)}</p>
                </div>
              </div>
              <div style={{ height: 3, background: "#c9a84c", marginBottom: 20 }} />

              <p style={{ fontSize: 9, fontWeight: 700, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>Official Rent Receipt</p>

              {/* Amount box */}
              <div style={{ border: "2px solid #0f1b36", padding: "16px 20px", textAlign: "center", marginBottom: 20 }}>
                <p style={{ fontSize: 9, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Total Amount Received</p>
                <p style={{ fontSize: 34, fontWeight: 800, color: "#0f1b36", fontFamily: "ui-monospace, monospace", margin: 0 }}>£{total || "0.00"}</p>
                {includesDeposit && depositAmount && (
                  <p style={{ fontSize: 10, color: "#6b7280", marginTop: 4 }}>Rent £{amount} + Deposit £{depositAmount}</p>
                )}
              </div>

              {/* Details table */}
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5, marginBottom: 20 }}>
                <tbody>
                  {[
                    ["Received from", tenantName || "—"],
                    ["Property", propertyAddress || "—"],
                    ["For period", periodFrom && periodTo ? `${fmt(periodFrom)} – ${fmt(periodTo)}` : "—"],
                    ["Date paid", fmt(paymentDate)],
                    ["Payment method", methodLabel[paymentMethod]],
                    ...(reference ? [["Reference", reference]] : []),
                  ].map(([label, value], i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "#fafafa" : "white" }}>
                      <td style={{ border: "1px solid #e5e7eb", padding: "7px 10px", fontWeight: 600, color: "#6b7280", width: 130 }}>{label}</td>
                      <td style={{ border: "1px solid #e5e7eb", padding: "7px 10px", color: "#1a1a1a" }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <SignatureBlock
                signerLabel="Signed (Landlord / Agent)"
                signerName={landlordName}
                showWitness={false}
                date={paymentDate}
              />

              <PrintFooter docTitle="Rent Receipt" note="Retain as proof of payment" />
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={() => setMode("form")} className="btn-outline text-sm">← Edit</button>
              <ShareToolbar docTitle="Rent Receipt" onPrint={() => window.print()} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}





