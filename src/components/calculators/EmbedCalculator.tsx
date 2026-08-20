"use client";
import { BtlMortgageCalculator } from "./BtlMortgageCalculator";
import { LandlordTaxCalculator } from "./LandlordTaxCalculator";
import { MortgageCalculator } from "./MortgageCalculator";
import { RentalYieldCalculator } from "./RentalYieldCalculator";
import { StampDutyCalculator } from "./StampDutyCalculator";
import { VoidPeriodCalculator } from "./VoidPeriodCalculator";
import { BRRRCalculator } from "./BRRRCalculator";
import { CashFlowCalculator } from "./CashFlowCalculator";
import { RentIncreaseCalculator } from "./RentIncreaseCalculator";

const TITLES: Record<string, string> = {
  "stamp-duty": "Stamp Duty Calculator",
  "mortgage": "Mortgage Calculator",
  "rental-yield": "Rental Yield Calculator",
  "btl-mortgage": "BTL Mortgage Stress Test",
  "landlord-tax": "Landlord Tax Calculator",
  "void-period": "Void Period Cost Calculator",
  "brrr": "BRRR Calculator",
  "monthly-cashflow": "BTL Monthly Cash Flow",
  "rent-increase": "Rent Increase Calculator",
};

export function EmbedCalculator({ slug }: { slug: string }) {
  function renderCalc() {
    switch (slug) {
      case "stamp-duty":      return <StampDutyCalculator />;
      case "mortgage":        return <MortgageCalculator />;
      case "rental-yield":    return <RentalYieldCalculator />;
      case "btl-mortgage":    return <BtlMortgageCalculator />;
      case "landlord-tax":    return <LandlordTaxCalculator />;
      case "void-period":     return <VoidPeriodCalculator />;
      case "brrr":            return <BRRRCalculator />;
      case "monthly-cashflow":return <CashFlowCalculator />;
      case "rent-increase":   return <RentIncreaseCalculator />;
      default: return (
        <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
          <p style={{ fontWeight: 700, marginBottom: 8 }}>Calculator not found</p>
          <p style={{ fontSize: 14 }}>Valid slugs: stamp-duty, mortgage, rental-yield, btl-mortgage, landlord-tax, void-period, brrr, monthly-cashflow, rent-increase</p>
        </div>
      );
    }
  }

  const title = TITLES[slug] ?? "Property Calculator";

  return (
    <div style={{ minHeight: "100vh", background: "white", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px 20px 8px", borderBottom: "1px solid #f1f5f9" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#0f1b36", margin: 0 }}>{title}</p>
      </div>
      <div style={{ flex: 1, padding: "20px" }}>
        {renderCalc()}
      </div>
      <div style={{ padding: "10px 20px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end" }}>
        <a href="https://www.propertyvaultuk.co.uk/calculators/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#94a3b8", textDecoration: "none", fontWeight: 600 }}>
          Powered by PropertyVault UK →
        </a>
      </div>
    </div>
  );
}
