"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { EmailResults } from "@/components/calculators/EmailResults";
import { ShareResults } from "@/components/calculators/ShareResults";
import { PrintButton } from "@/components/calculators/PrintButton";
import { GuaranteedRentCTA } from "@/components/ui/GuaranteedRentCTA";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { calcCorpTax, calcSDLT } from "@/lib/tax";
import { monthlyRepayment, monthlyInterestOnly, compoundGrowth, pctOf } from "@/lib/finance";

/**
 * Read a number input, floored at zero.
 *
 * Every field here is a price, a rent, a cost, a percentage, a count or a
 * term, and none of those can be negative. Without this the analyser happily
 * accepted a purchase price of -250,000 and a rent of -900, then presented the
 * resulting figures as analysis. The divide-by-zero guards added earlier stop
 * it crashing; they do not stop it being nonsense.
 */
const nonNegative = (v: string) => Math.max(0, Number(v) || 0);

/**
 * Read a number input that may legitimately be negative.
 *
 * Capital growth is the one such field — modelling a falling market is a
 * reasonable thing to want, and arguably the prudent case.
 */
const signed = (v: string) => Number(v) || 0;

const faqs = [
  { q: "What is a property deal analyser?", a: "A deal analyser evaluates a potential property investment from multiple perspectives — gross yield, net yield, monthly cash flow, and cash-on-cash return. This gives you a complete picture of whether a deal is worth pursuing." },
  { q: "What is a good rental yield in the UK?", a: "A gross yield of 6-8% is considered good for most UK buy-to-let investments. Net yield of 4-5%+ and positive monthly cash flow are better indicators. Always analyse all metrics together." },
  { q: "What is cash-on-cash return?", a: "Cash-on-cash return measures the annual pre-tax cash flow as a percentage of the total cash you invested. A cash-on-cash return of 10%+ is considered strong for UK property." },
  { q: "How does Section 24 affect my returns?", a: "Section 24 restricts mortgage interest deductions for individual landlords. Higher-rate taxpayers only get a 20% tax credit on mortgage interest, not full deduction. This can significantly reduce post-tax income and is why many investors use limited companies." },
];

interface AreaData {
  postcode: string;
  region: string;
  district: string;
  county: string;
  ward: string;
  constituency: string;
  lat: number;
  lng: number;
  crime: { total: number; level: string; color: string; month: string; topCategories: { label: string; count: number }[] };
  sales: { recent: Sale[]; avgPrice: number };
  rental: { studio: number; oneBed: number; twoBed: number; threeBed: number; fourBed: number; demand: string; trend: string; yieldRangeLow: string | null; yieldRangeHigh: string | null };
  suggestedCity: string;
}
interface Sale { date: string; price: number; type: string; tenure: string; address: string; newBuild: boolean; }

interface PropertyPreview {
  portal: string;
  propertyId: string;
  listingUrl: string;
  success: boolean;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  address?: string;
  postcode?: string;
  description?: string;
  keyFeatures?: string[];
  imageUrl?: string;
  error?: string;
}

interface AiVerdict {
  verdict: "Buy" | "Negotiate" | "Pass";
  summary: string;
  greenFlags: string[];
  redFlags: string[];
  negotiationTip: string | null;
  keyInsight: string;
}

// City benchmark data
const BENCHMARKS: Record<string, { gross: number; net: number; name: string }> = {
  birmingham: { gross: 6.2, net: 4.1, name: "Birmingham" },
  nottingham: { gross: 6.8, net: 4.4, name: "Nottingham" },
  derby:       { gross: 6.5, net: 4.2, name: "Derby" },
  manchester:  { gross: 5.9, net: 3.8, name: "Manchester" },
  london:      { gross: 4.1, net: 2.1, name: "London" },
  leeds:       { gross: 5.7, net: 3.6, name: "Leeds" },
  sheffield:   { gross: 6.0, net: 3.9, name: "Sheffield" },
};

type Strategy = "btl" | "hmo" | "r2r" | "flip" | "sa";
const STRATEGY_META: Record<Strategy, { label: string; icon: string; desc: string }> = {
  btl:  { label: "Buy-to-Let",   icon: "🏠", desc: "Standard rental property" },
  hmo:  { label: "HMO",          icon: "🏘️", desc: "House in Multiple Occupation" },
  r2r:  { label: "Rent-to-Rent", icon: "🔄", desc: "Lease & sublet — no mortgage" },
  flip: { label: "Flip",         icon: "🔨", desc: "Buy, refurb & sell for profit" },
  sa:   { label: "Serv. Acc.",   icon: "🏨", desc: "Airbnb / short-let model" },
};

function ShareButton({ params }: { params: Record<string, string | number> }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => {
      const url = new URL(window.location.pathname, window.location.origin);
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
      navigator.clipboard.writeText(url.toString()).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    }} className="flex items-center gap-2 text-sm font-semibold text-navy-500 hover:text-navy-800 transition-colors">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0-12.814a2.25 2.25 0 1 0 0-2.186m0 2.186a2.25 2.25 0 1 0 0 2.186" /></svg>
      {copied ? "Copied!" : "Share deal"}
    </button>
  );
}

// Deal Score gauge component
function DealScoreGauge({ score }: { score: number }) {
  const clamp = Math.max(0, Math.min(100, score));
  const color = clamp >= 70 ? "#15803d" : clamp >= 45 ? "#c9a84c" : "#dc2626";
  const label = clamp >= 70 ? "Strong" : clamp >= 55 ? "Decent" : clamp >= 40 ? "Marginal" : "Weak";
  // SVG arc: 180° semicircle
  const r = 54, cx = 70, cy = 70;
  const angle = (clamp / 100) * 180 - 90;
  const rad = (angle * Math.PI) / 180;
  const needleX = cx + r * 0.78 * Math.cos(rad);
  const needleY = cy + r * 0.78 * Math.sin(rad);
  return (
    <div style={{ textAlign: "center" }}>
      <svg viewBox="0 0 140 80" width="160" style={{ display: "block", margin: "0 auto" }}>
        {/* Track */}
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="#e2e8f0" strokeWidth="12" strokeLinecap="round" />
        {/* Filled arc */}
        {clamp > 0 && (() => {
          const endAngle = -180 + (clamp / 100) * 180;
          const rad2 = (endAngle * Math.PI) / 180;
          const ex = cx + r * Math.cos(rad2);
          const ey = cy + r * Math.sin(rad2);
          const large = clamp > 50 ? 1 : 0;
          return <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" />;
        })()}
        {/* Needle */}
        <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke="#0f1b36" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="4" fill="#0f1b36" />
        {/* Score */}
        <text x={cx} y={cy - 14} textAnchor="middle" fontSize="20" fontWeight="800" fill="#0f1b36">{clamp}</text>
        <text x={cx} y={cy - 2} textAnchor="middle" fontSize="8" fill="#475569">/ 100</text>
      </svg>
      <p style={{ fontSize: 14, fontWeight: 700, color, marginTop: -8 }}>{label} Deal</p>
    </div>
  );
}

export default function DealAnalyserPage() {
  const gp = (key: string, fallback: number) => {
    if (typeof window === "undefined") return fallback;
    const v = new URLSearchParams(window.location.search).get(key);
    return v ? Number(v) : fallback;
  };
  const gps = (key: string, fallback: string) => {
    if (typeof window === "undefined") return fallback;
    return new URLSearchParams(window.location.search).get(key) ?? fallback;
  };

  // ── Inputs ──────────────────────────────────────────────
  const [purchasePrice, setPurchasePrice] = useState(() => gp("pp", 180000));
  const [refurbCost, setRefurbCost]       = useState(() => gp("rc", 15000));
  const [afterRefurbValue, setARV]        = useState(() => gp("arv", 220000));
  const [monthlyRent, setMonthlyRent]     = useState(() => gp("mr", 950));
  const [depositPct, setDepositPct]       = useState(() => gp("dp", 25));
  const [mortgageRate, setMortgageRate]   = useState(() => gp("rate", 5.5));
  const [mortgageTerm, setMortgageTerm]   = useState(() => gp("term", 25));
  const [mortgageType, setMortgageType]   = useState<"interest"|"repayment">(() => gps("mt", "interest") === "repayment" ? "repayment" : "interest");
  const [managementPct, setManagementPct] = useState(() => gp("mgmt", 10));
  const [maintenancePct, setMaintPct]     = useState(() => gp("maint", 10));
  const [insuranceMonthly, setInsurance]  = useState(() => gp("ins", 30));
  const [voidWeeks, setVoidWeeks]         = useState(() => gp("vw", 2));

  // ── Smart toggles ────────────────────────────────────────
  const [additionalProperty, setAdditionalProperty] = useState(true);
  const [taxBand, setTaxBand] = useState<"basic"|"higher"|"company">("higher");
  const [cityBenchmark, setCityBenchmark] = useState("nottingham");
  const [capitalGrowthPct, setCapGrowth] = useState(3);
  const [activeSection, setActiveSection] = useState<"overview"|"stress"|"projection"|"tax"|"brrr">("overview");

  // ── Strategy ─────────────────────────────────────────────
  const [strategy, setStrategy] = useState<Strategy>("btl");
  const handleStrategyChange = (s: Strategy) => { setStrategy(s); setActiveSection("overview"); };

  // HMO
  const [hmoRooms, setHmoRooms]               = useState(5);
  const [hmoRentPerRoom, setHmoRentPerRoom]   = useState(600);
  const [hmoCouncilTax, setHmoCouncilTax]     = useState(150);
  const [hmoUtilities, setHmoUtilities]       = useState(200);
  const [hmoLicenceCost, setHmoLicenceCost]   = useState(500);
  // R2R
  const [r2rLeaseCost, setR2rLeaseCost]       = useState(850);
  const [r2rRooms, setR2rRooms]               = useState(4);
  const [r2rRentPerRoom, setR2rRentPerRoom]   = useState(550);
  const [r2rSetupCost, setR2rSetupCost]       = useState(8000);
  const [r2rCouncilTax, setR2rCouncilTax]     = useState(150);
  const [r2rUtilities, setR2rUtilities]       = useState(200);
  // Flip
  const [flipHoldingMonths, setFlipHoldingMonths] = useState(4);
  const [flipAgentFee, setFlipAgentFee]           = useState(1.5);
  const [flipBridgingRate, setFlipBridgingRate]   = useState(0.75);
  const [flipBridgingLTV, setFlipBridgingLTV]     = useState(70);
  const [flipHoldingCosts, setFlipHoldingCosts]   = useState(500);
  // SA
  const [saNightlyRate, setSaNightlyRate]         = useState(85);
  const [saOccupancy, setSaOccupancy]             = useState(70);
  const [saPlatformFee, setSaPlatformFee]         = useState(15);
  const [saCleaningPerStay, setSaCleaningPerStay] = useState(40);
  const [saAvgStayNights, setSaAvgStayNights]     = useState(3);
  const [saRunningCosts, setSaRunningCosts]       = useState(400);
  // Guaranteed Rent
  const [guaranteedRent, setGuaranteedRent]       = useState(false);
  const [guaranteedRentPct, setGuaranteedRentPct] = useState(87);
  // Bridging (BRRR tab)
  const [usesBridging, setUsesBridging]           = useState(false);
  const [bridgingRate, setBridgingRate]           = useState(0.75);
  const [bridgingTermMonths, setBridgingTermMonths] = useState(6);
  const [bridgingLTV, setBridgingLTV]             = useState(70);

  // ── Postcode lookup ──────────────────────────────────────
  const [postcodeInput, setPostcodeInput]   = useState("");
  const [postcodeLoading, setPostcodeLoading] = useState(false);
  const [postcodeError, setPostcodeError]   = useState("");
  const [areaData, setAreaData]             = useState<AreaData | null>(null);

  // ── Property URL lookup ──────────────────────────────────
  const [urlInput, setUrlInput]               = useState("");
  const [urlLoading, setUrlLoading]           = useState(false);
  const [urlError, setUrlError]               = useState("");
  const [propertyPreview, setPropertyPreview] = useState<PropertyPreview | null>(null);

  // ── AI Deal Verdict ──────────────────────────────────────
  const [aiVerdictLoading, setAiVerdictLoading] = useState(false);
  const [aiVerdictError, setAiVerdictError]     = useState("");
  const [aiVerdict, setAiVerdict]               = useState<AiVerdict | null>(null);

  const lookupPostcode = async () => {
    const pc = postcodeInput.trim().toUpperCase();
    if (!pc) return;
    setPostcodeLoading(true);
    setPostcodeError("");
    setAreaData(null);
    try {
      const res = await fetch(`/api/postcode-lookup?postcode=${encodeURIComponent(pc)}`);
      const json = await res.json();
      if (!res.ok) { setPostcodeError(json.error ?? "Lookup failed"); return; }
      setAreaData(json);
      // Auto-set benchmark city from region
      if (json.suggestedCity) setCityBenchmark(json.suggestedCity);
      // Suggest avg price as purchase price if we have data and user hasn't changed default
      if (json.sales?.avgPrice > 0 && purchasePrice === 180000) {
        setPurchasePrice(Math.round(json.sales.avgPrice / 5000) * 5000);
      }
    } catch {
      setPostcodeError("Network error — please try again.");
    } finally {
      setPostcodeLoading(false);
    }
  };

  const lookupPropertyUrl = async () => {
    const url = urlInput.trim();
    if (!url) return;
    setUrlLoading(true);
    setUrlError("");
    setPropertyPreview(null);
    try {
      const res = await fetch(`/api/property-lookup?url=${encodeURIComponent(url)}`);
      const json: PropertyPreview = await res.json();
      setPropertyPreview(json);
      if (json.success) {
        if (json.price) setPurchasePrice(json.price);
        if (json.postcode) {
          setPostcodeInput(json.postcode);
          // Trigger postcode lookup automatically
          const pc = json.postcode.trim().toUpperCase();
          fetch(`/api/postcode-lookup?postcode=${encodeURIComponent(pc)}`)
            .then(r => r.json())
            .then(data => {
              if (data && !data.error) {
                setAreaData(data);
                if (data.suggestedCity) setCityBenchmark(data.suggestedCity);
              }
            })
            .catch(() => {/* silent */});
        }
      } else {
        setUrlError(json.error ?? "Could not read listing — enter details manually.");
      }
    } catch {
      setUrlError("Network error — please try again.");
    } finally {
      setUrlLoading(false);
    }
  };

  const getAiVerdict = async () => {
    setAiVerdictLoading(true);
    setAiVerdictError("");
    setAiVerdict(null);
    const bm = BENCHMARKS[cityBenchmark];
    try {
      const res = await fetch("/api/deal-ai-verdict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purchasePrice,
          monthlyRent,
          grossYield: calc.grossYield,
          netYield: calc.netYield,
          monthlyCF: calc.monthlyCF,
          cashOnCash: calc.cashOnCash,
          dealScore: calc.dealScore,
          stressRatePlus2: stressCalc.ratePlus2,
          cityBenchmark: bm?.name ?? cityBenchmark,
          benchmarkGross: bm?.gross,
          benchmarkNet: bm?.net,
          bedrooms: propertyPreview?.bedrooms,
          propertyType: propertyPreview?.propertyType,
          postcode: propertyPreview?.postcode ?? postcodeInput,
          address: propertyPreview?.address,
          crimeLevel: areaData?.crime?.level,
          avgSoldPrice: areaData?.sales?.avgPrice,
          rentalDemand: areaData?.rental?.demand,
          strategy,
          taxBand,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        setAiVerdictError(json.error ?? "AI verdict failed — please try again.");
      } else {
        setAiVerdict(json);
      }
    } catch {
      setAiVerdictError("Network error — please try again.");
    } finally {
      setAiVerdictLoading(false);
    }
  };

  // Auto SDLT
  const sdlt = useMemo(() => calcSDLT(purchasePrice, additionalProperty), [purchasePrice, additionalProperty]);
  const purchaseCosts = sdlt + 2500; // SDLT + legal/survey

  // ── Core Calculations ────────────────────────────────────
  // eslint-disable-next-line react-hooks/preserve-manual-memoization -- hand-written memoisation kept deliberately; letting the compiler take over changes recompute behaviour on the largest calculator
  const calc = useMemo(() => {
    const annualRent = monthlyRent * 12;
    const grossYield = pctOf(annualRent, purchasePrice);
    const depositAmount = purchasePrice * (depositPct / 100);
    const loanAmount = purchasePrice - depositAmount;
    const monthlyMortgage = mortgageType === "interest"
      ? monthlyInterestOnly(loanAmount, mortgageRate)
      : monthlyRepayment(loanAmount, mortgageRate, mortgageTerm);
    const annualMortgage = monthlyMortgage * 12;
    const management  = annualRent * (managementPct / 100);
    const maintenance = annualRent * (maintenancePct / 100);
    const insurance   = insuranceMonthly * 12;
    const voidCost    = (annualRent / 52) * voidWeeks;
    const totalExpenses = annualMortgage + management + maintenance + insurance + voidCost;
    const netIncome   = annualRent - totalExpenses;
    const netYield    = pctOf(netIncome, purchasePrice);
    const monthlyCF   = netIncome / 12;
    const totalCashIn = depositAmount + purchaseCosts + refurbCost;
    const cashOnCash  = totalCashIn > 0 ? (netIncome / totalCashIn) * 100 : 0;
    const equityGain  = afterRefurbValue - purchasePrice - refurbCost;
    const totalReturn = netIncome + equityGain;
    const roi = totalCashIn > 0 ? (totalReturn / totalCashIn) * 100 : 0;

    // Deal Score (0–100)
    const scoreGrossYield  = Math.min(20, (grossYield / 10) * 20);
    const scoreNetYield    = Math.min(25, (netYield / 5) * 25);
    const scoreCF          = Math.min(25, (Math.max(0, monthlyCF) / 300) * 25);
    const scoreCoC         = Math.min(20, (cashOnCash / 10) * 20);
    const scoreEquity      = Math.min(10, pctOf(Math.max(0, equityGain), purchasePrice * 0.1) / 10);
    const dealScore = Math.round(scoreGrossYield + scoreNetYield + scoreCF + scoreCoC + scoreEquity);

    return {
      annualRent, grossYield, depositAmount, loanAmount, monthlyMortgage,
      annualMortgage, management, maintenance, insurance, voidCost,
      totalExpenses, netIncome, netYield, monthlyCF, totalCashIn,
      cashOnCash, equityGain, totalReturn, roi, dealScore,
    };
  }, [purchasePrice, refurbCost, afterRefurbValue, monthlyRent, depositPct, mortgageRate, mortgageTerm, mortgageType, purchaseCosts, managementPct, maintenancePct, insuranceMonthly, voidWeeks]);

  // ── Stress Tests ─────────────────────────────────────────
  // eslint-disable-next-line react-hooks/preserve-manual-memoization -- hand-written memoisation kept deliberately; see the note on calc above
  const stressCalc = useMemo(() => {
    const run = (rateAdj: number, voidAdj: number, rentAdj: number) => {
      const r = monthlyRent * (1 + rentAdj);
      const annualR = r * 12;
      const loan = purchasePrice * (1 - depositPct / 100);
      const mtg = mortgageType === "interest"
        ? monthlyInterestOnly(loan, mortgageRate + rateAdj)
        : monthlyRepayment(loan, mortgageRate + rateAdj, mortgageTerm);
      const mgmt = annualR * managementPct / 100;
      const maint = annualR * maintenancePct / 100;
      const ins = insuranceMonthly * 12;
      const voids = (annualR / 52) * voidWeeks * (1 + voidAdj);
      const totalExp = mtg * 12 + mgmt + maint + ins + voids;
      return (annualR - totalExp) / 12;
    };
    return {
      baseline:  run(0, 0, 0),
      ratePlus1: run(1, 0, 0),
      ratePlus2: run(2, 0, 0),
      voidDouble:run(0, 1, 0),
      rentMinus: run(0, 0, -0.1),
      worstCase: run(2, 1, -0.1),
    };
  }, [purchasePrice, depositPct, mortgageRate, mortgageTerm, mortgageType, monthlyRent, managementPct, maintenancePct, insuranceMonthly, voidWeeks]);

  // ── 5-Year Projection ────────────────────────────────────
  const projection = useMemo(() => {
    const rows = [];
    let cumulativeIncome = 0;
    const loan = purchasePrice * (1 - depositPct / 100);
    for (let yr = 1; yr <= 5; yr++) {
      cumulativeIncome += calc.netIncome;
      const capitalValue = compoundGrowth(purchasePrice, capitalGrowthPct, yr);
      const equity = capitalValue - loan + (afterRefurbValue - purchasePrice - refurbCost);
      const totalWealth = cumulativeIncome + equity - calc.totalCashIn;
      rows.push({ yr, capitalValue, equity, cumulativeIncome, totalWealth });
    }
    return rows;
  }, [calc, purchasePrice, depositPct, afterRefurbValue, refurbCost, capitalGrowthPct]);

  // ── Section 24 ───────────────────────────────────────────
  const taxAnalysis = useMemo(() => {
    const grossProfit = calc.annualRent - (calc.management + calc.maintenance + calc.insurance + calc.voidCost);
    const interestCost = calc.annualMortgage;
    // Basic rate: S24 credit (20% of interest) cancels the extra tax — net = old-rules result
    const basicTax = Math.max(0, grossProfit - interestCost) * 0.20;
    const basicNet = grossProfit - basicTax - interestCost;
    // Higher rate: 40% on gross profit, only 20% credit on interest (S24 restriction)
    const higherTax = Math.max(0, grossProfit * 0.40 - interestCost * 0.20);
    const higherNet = grossProfit - higherTax - interestCost;
    // Company: full interest deductible; CT at 19%–25% via marginal relief
    const companyProfit = Math.max(0, grossProfit - interestCost);
    const companyTax = calcCorpTax(companyProfit);
    const companyNet = companyProfit - companyTax;
    return { basicNet, higherNet, companyNet, basicTax, higherTax, companyTax };
  }, [calc]);

  // ── BRRR Refinance ───────────────────────────────────────
  const brrrCalc = useMemo(() => {
    const refiLoan = afterRefurbValue * 0.75;
    const originalLoan = purchasePrice * (1 - depositPct / 100);
    const moneyOut = refiLoan - originalLoan;
    const cashLeft = calc.totalCashIn - Math.max(0, moneyOut);
    const newMtg = mortgageType === "interest"
      ? monthlyInterestOnly(refiLoan, mortgageRate)
      : monthlyRepayment(refiLoan, mortgageRate, mortgageTerm);
    const newNetIncome = calc.annualRent - (newMtg * 12 + calc.management + calc.maintenance + calc.insurance + calc.voidCost);
    const newCoC = cashLeft > 0 ? (newNetIncome / cashLeft) * 100 : Infinity;
    return { refiLoan, originalLoan, moneyOut, cashLeft, newMtg, newNetIncome: newNetIncome / 12, newCoC };
  }, [purchasePrice, afterRefurbValue, depositPct, mortgageRate, mortgageTerm, mortgageType, calc]);

  // ── HMO Calc ────────────────────────────────────────────
  const hmoCalc = useMemo(() => {
    const grossIncome = hmoRooms * hmoRentPerRoom * 12;
    const annualLicence = hmoLicenceCost;
    const annualCouncilTax = hmoCouncilTax * 12;
    const annualUtilities = hmoUtilities * 12;
    const depositAmount = purchasePrice * (depositPct / 100);
    const loanAmount = purchasePrice - depositAmount;
    const monthlyMtg = mortgageType === "interest"
      ? monthlyInterestOnly(loanAmount, mortgageRate)
      : monthlyRepayment(loanAmount, mortgageRate, mortgageTerm);
    const annualMtg = monthlyMtg * 12;
    const mgmt = grossIncome * (managementPct / 100);
    const maint = grossIncome * (maintenancePct / 100);
    const ins = insuranceMonthly * 12;
    const voids = (grossIncome / 52) * voidWeeks;
    const totalExp = annualMtg + mgmt + maint + ins + voids + annualLicence + annualCouncilTax + annualUtilities;
    const netIncome = grossIncome - totalExp;
    const grossYield = pctOf(grossIncome, purchasePrice);
    const netYield = pctOf(netIncome, purchasePrice);
    const totalCashIn = depositAmount + purchaseCosts + refurbCost;
    const cashOnCash = totalCashIn > 0 ? (netIncome / totalCashIn) * 100 : 0;
    const score = Math.round(Math.min(25, (grossYield / 12) * 25) + Math.min(25, (Math.max(0, netYield) / 6) * 25) + Math.min(25, (Math.max(0, netIncome / 12) / 400) * 25) + Math.min(25, (cashOnCash / 12) * 25));
    return { grossIncome, netIncome, grossYield, netYield, monthlyCF: netIncome / 12, cashOnCash, totalCashIn, monthlyMtg, annualMtg, totalExp, score };
  }, [hmoRooms, hmoRentPerRoom, hmoCouncilTax, hmoUtilities, hmoLicenceCost, purchasePrice, depositPct, mortgageRate, mortgageTerm, mortgageType, managementPct, maintenancePct, insuranceMonthly, voidWeeks, purchaseCosts, refurbCost]);

  // ── R2R Calc ─────────────────────────────────────────────
  const r2rCalc = useMemo(() => {
    const grossIncome = r2rRooms * r2rRentPerRoom * 12;
    const totalExpenses = r2rLeaseCost * 12 + r2rCouncilTax * 12 + r2rUtilities * 12 + grossIncome * (managementPct / 100) + grossIncome * (maintenancePct / 100);
    const netIncome = grossIncome - totalExpenses;
    const roi = r2rSetupCost > 0 ? (netIncome / r2rSetupCost) * 100 : 0;
    const paybackMonths = netIncome > 0 ? (r2rSetupCost / (netIncome / 12)) : Infinity;
    return { grossIncome, totalExpenses, netIncome, monthlyCF: netIncome / 12, roi, paybackMonths };
  }, [r2rRooms, r2rRentPerRoom, r2rLeaseCost, r2rCouncilTax, r2rUtilities, r2rSetupCost, managementPct, maintenancePct]);

  // ── Flip Calc ────────────────────────────────────────────
  const flipCalc = useMemo(() => {
    const bridgeAmount = purchasePrice * (flipBridgingLTV / 100);
    const cashDown = purchasePrice - bridgeAmount;
    const monthlyBridgeInterest = bridgeAmount * (flipBridgingRate / 100);
    const totalBridgeCost = monthlyBridgeInterest * flipHoldingMonths;
    const holdingCosts = flipHoldingCosts * flipHoldingMonths;
    const agentFeeAmt = afterRefurbValue * (flipAgentFee / 100);
    const totalCost = cashDown + refurbCost + totalBridgeCost + holdingCosts + purchaseCosts + agentFeeAmt;
    const netProfit = afterRefurbValue - purchasePrice - refurbCost - totalBridgeCost - holdingCosts - purchaseCosts - agentFeeAmt;
    const cashIn = cashDown + purchaseCosts + refurbCost;
    const roi = cashIn > 0 ? (netProfit / cashIn) * 100 : 0;
    const annualisedRoi = flipHoldingMonths > 0 ? (roi / flipHoldingMonths) * 12 : 0;
    const margin = afterRefurbValue > 0 ? (netProfit / afterRefurbValue) * 100 : 0;
    return { bridgeAmount, cashDown, monthlyBridgeInterest, totalBridgeCost, holdingCosts, agentFeeAmt, totalCost, netProfit, cashIn, roi, annualisedRoi, margin };
  }, [purchasePrice, afterRefurbValue, refurbCost, flipHoldingMonths, flipAgentFee, flipBridgingRate, flipBridgingLTV, flipHoldingCosts, purchaseCosts]);

  // ── SA Calc ──────────────────────────────────────────────
  const saCalc = useMemo(() => {
    const occupiedNights = Math.round(365 * (saOccupancy / 100));
    const grossRevenue = saNightlyRate * occupiedNights;
    const platformFees = grossRevenue * (saPlatformFee / 100);
    const stays = saAvgStayNights > 0 ? occupiedNights / saAvgStayNights : 0;
    const cleaningCosts = stays * saCleaningPerStay;
    const annualRunning = saRunningCosts * 12;
    const depositAmount = purchasePrice * (depositPct / 100);
    const loanAmount = purchasePrice - depositAmount;
    const monthlyMtg = mortgageType === "interest"
      ? monthlyInterestOnly(loanAmount, mortgageRate)
      : monthlyRepayment(loanAmount, mortgageRate, mortgageTerm);
    const annualMtg = monthlyMtg * 12;
    const totalExp = platformFees + cleaningCosts + annualRunning + annualMtg + insuranceMonthly * 12;
    const netIncome = grossRevenue - totalExp;
    const grossYield = pctOf(grossRevenue, purchasePrice);
    const netYield = pctOf(netIncome, purchasePrice);
    const totalCashIn = depositAmount + purchaseCosts + refurbCost;
    const cashOnCash = totalCashIn > 0 ? (netIncome / totalCashIn) * 100 : 0;
    return { grossRevenue, platformFees, cleaningCosts, annualRunning, annualMtg, totalExp, netIncome, grossYield, netYield, monthlyCF: netIncome / 12, cashOnCash, occupiedNights };
  }, [purchasePrice, depositPct, mortgageRate, mortgageTerm, mortgageType, saNightlyRate, saOccupancy, saPlatformFee, saCleaningPerStay, saAvgStayNights, saRunningCosts, insuranceMonthly, purchaseCosts, refurbCost]);

  // ── ICR Calc (lender stress test) ───────────────────────
  const icrCalc = useMemo(() => {
    const effectiveRent = strategy === "hmo" ? hmoRooms * hmoRentPerRoom : strategy === "sa" ? saCalc.grossRevenue / 12 : monthlyRent;
    const icr = calc.monthlyMortgage > 0 ? effectiveRent / calc.monthlyMortgage : Infinity;
    const passes125 = icr >= 1.25;
    const passes145 = icr >= 1.45;
    const required125 = calc.monthlyMortgage * 1.25;
    const required145 = calc.monthlyMortgage * 1.45;
    return { icr, passes125, passes145, effectiveRent, required125, required145 };
  }, [strategy, hmoRooms, hmoRentPerRoom, saCalc, monthlyRent, calc]);

  // ── Guaranteed Rent Calc ─────────────────────────────────
  const grCalc = useMemo(() => {
    const grMonthly = monthlyRent * (guaranteedRentPct / 100);
    const grAnnual = grMonthly * 12;
    const grNetIncome = grAnnual - (calc.annualMortgage + calc.insurance + (calc.maintenance));
    const grMonthlyCF = grNetIncome / 12;
    const saving = grMonthlyCF - calc.monthlyCF;
    return { grMonthly, grAnnual, grNetIncome, grMonthlyCF, saving };
  }, [monthlyRent, guaranteedRentPct, calc]);

  // ── Bridging Calc (BRRR tab) ─────────────────────────────
  const bridgingCalc = useMemo(() => {
    const bridgeAmount = purchasePrice * (bridgingLTV / 100);
    const monthlyInterest = bridgeAmount * (bridgingRate / 100);
    const totalInterest = monthlyInterest * bridgingTermMonths;
    const cashRequired = purchasePrice - bridgeAmount + refurbCost + purchaseCosts;
    const exitLoan = afterRefurbValue * 0.75;
    const cashReleased = exitLoan - bridgeAmount;
    const netCashLeft = cashRequired - Math.max(0, cashReleased);
    return { bridgeAmount, monthlyInterest, totalInterest, cashRequired, exitLoan, cashReleased, netCashLeft };
  }, [purchasePrice, bridgingLTV, bridgingRate, bridgingTermMonths, refurbCost, purchaseCosts, afterRefurbValue]);

  const fmt  = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
  const fmt2 = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 2 }).format(n);

  // ── Smart Insights ───────────────────────────────────────
  const insights = useMemo(() => {
    const tips: { type: "success"|"warn"|"info"|"error"; text: string }[] = [];
    const bench = BENCHMARKS[cityBenchmark];
    if (calc.grossYield > bench.gross + 1) tips.push({ type: "success", text: `Your gross yield of ${calc.grossYield.toFixed(1)}% beats the ${bench.name} average of ${bench.gross}%. Strong rental market fit.` });
    else if (calc.grossYield < bench.gross - 1) {
      const targetPrice = Math.round((calc.annualRent / (bench.gross / 100)) / 1000) * 1000;
      tips.push({ type: "warn", text: `Gross yield ${calc.grossYield.toFixed(1)}% is below the ${bench.name} average of ${bench.gross}%. To hit ${bench.gross}% gross, negotiate purchase price to £${targetPrice.toLocaleString()}.` });
    }
    if (calc.netYield < 3) tips.push({ type: "error", text: `Net yield of ${calc.netYield.toFixed(1)}% is very low. Running costs are eating ${pctOf(calc.totalExpenses, calc.annualRent).toFixed(0)}% of rental income.` });
    if (calc.monthlyCF < 0) tips.push({ type: "error", text: `Negative cash flow of ${fmt(calc.monthlyCF)}/mo means this deal costs you money every month even before tax.` });
    else if (calc.monthlyCF < 100) tips.push({ type: "warn", text: `Thin cash flow of ${fmt(calc.monthlyCF)}/mo leaves little buffer. A single repair bill could push you into the red.` });
    if (taxBand === "higher" && taxAnalysis.higherNet < taxAnalysis.companyNet * 0.85) tips.push({ type: "info", text: `As a higher-rate taxpayer, a limited company could increase your after-tax income by ~${fmt(taxAnalysis.companyNet - taxAnalysis.higherNet)}/yr due to full mortgage interest deductibility.` });
    if (afterRefurbValue > purchasePrice + refurbCost) {
      const equity = afterRefurbValue - purchasePrice - refurbCost;
      tips.push({ type: "success", text: `Refurb creates ${fmt(equity)} of instant equity (${((equity / (purchasePrice + refurbCost)) * 100).toFixed(1)}% uplift). ${brrrCalc.moneyOut > 0 ? `BRRR refinance could return ${fmt(brrrCalc.moneyOut)} of your capital.` : ""}` });
    }
    if (stressCalc.ratePlus2 < 0) tips.push({ type: "warn", text: `At +2% mortgage rate, cash flow turns negative (${fmt(stressCalc.ratePlus2)}/mo). Stress-test this deal before committing.` });
    if (calc.cashOnCash > 12) tips.push({ type: "success", text: `Cash-on-cash return of ${calc.cashOnCash.toFixed(1)}% is excellent — your invested capital is working very hard.` });
    if (tips.length === 0) tips.push({ type: "info", text: "Adjust the inputs to see smart analysis of your deal." });
    return tips;
  }, [calc, brrrCalc, stressCalc, taxAnalysis, taxBand, cityBenchmark, purchasePrice, afterRefurbValue, refurbCost]);

  const shareParams = { pp: purchasePrice, rc: refurbCost, arv: afterRefurbValue, mr: monthlyRent, dp: depositPct, rate: mortgageRate, term: mortgageTerm, mt: mortgageType, mgmt: managementPct, maint: maintenancePct, ins: insuranceMonthly, vw: voidWeeks };

  const expenseItems = [
    { label: "Mortgage",    value: calc.annualMortgage, color: "#0f1b36" },
    { label: "Management",  value: calc.management,     color: "var(--gold-ink)" },
    { label: "Maintenance", value: calc.maintenance,    color: "#6b7280" },
    { label: "Insurance",   value: calc.insurance,      color: "#3b82f6" },
    { label: "Voids",       value: calc.voidCost,       color: "#ef4444" },
  ];
  const expTotal = expenseItems.reduce((s, e) => s + e.value, 0);

  const cfColor = (v: number) => v >= 200 ? "text-green-600" : v >= 0 ? "text-amber-600" : "text-red-600";
  const yldColor = (v: number) => v >= 4 ? "text-green-600" : v >= 2 ? "text-amber-600" : "text-red-600";

  const allTabs = [
    { id: "overview"   as const, label: "Overview" },
    { id: "stress"     as const, label: "Stress Test" },
    { id: "projection" as const, label: "5-Yr Projection" },
    { id: "tax"        as const, label: "Tax Impact" },
    { id: "brrr"       as const, label: "BRRR Refinance" },
  ];
  const availableTabs = strategy === "r2r" || strategy === "flip"
    ? allTabs.slice(0, 1)
    : strategy === "sa"
    ? allTabs.slice(0, 3)
    : allTabs;

  return (
    <>
      {/* Header */}
      <section style={{ background: "#0f1b36", position: "relative", overflow: "hidden", padding: "56px 0 48px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
        <div className="container-max px-4" style={{ position: "relative", zIndex: 1 }}>
          <Breadcrumbs items={[{ label: "Calculators", href: "/calculators" }, { label: "Deal Analyser" }]} />
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><rect x="2" y="6" width="24" height="18" rx="3" fill="#c9a84c"/><path d="M6 20V14" stroke="white" strokeWidth="3" strokeLinecap="round"/><path d="M11 20V11" stroke="white" strokeWidth="3" strokeLinecap="round"/><path d="M16 20V8" stroke="white" strokeWidth="3" strokeLinecap="round"/><path d="M21 20V5" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "var(--gold-ink)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Flagship tool</p>
                  <h1 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, color: "white", lineHeight: 1 }}>Deal Analyser</h1>
                </div>
              </div>
              <p style={{ color: "rgba(255,255,255,0.62)", fontSize: 15, maxWidth: 500 }}>8 perspectives. Stress tests. Tax impact. 5-year projection. The comprehensive UK property deal analysis tool.</p>
              <div style={{ display: "flex", gap: 16, marginTop: 16 }}><PrintButton /><ShareButton params={shareParams} /></div>
            </div>
            <DealScoreGauge score={calc.dealScore} />
          </div>
        </div>
      </section>

      <section style={{ background: "#f8f9fc", paddingBottom: 64 }}>
        <div className="container-max px-4" style={{ paddingTop: 24 }}>
          <div className="grid lg:grid-cols-5 gap-6">

            {/* ── INPUTS ─────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-4">

              {/* ── URL Paste ── */}
              <div className="bg-white rounded-2xl border border-navy-100 p-5" style={{ borderColor: "#c9a84c33" }}>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-navy-800 text-sm">🔗 Paste a Rightmove or Zoopla URL</h3>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#92400e", background: "#fef3c7", border: "1px solid #fde68a", padding: "1px 7px", borderRadius: 20 }}>NEW</span>
                </div>
                <p className="text-xs text-navy-400 mb-3">Auto-fill price and area data straight from the listing.</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && lookupPropertyUrl()}
                    placeholder="https://www.rightmove.co.uk/properties/…"
                    style={{ flex: 1, padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 12, fontSize: 13, outline: "none", minWidth: 0 }}
                  />
                  <button
                    onClick={lookupPropertyUrl}
                    disabled={urlLoading || !urlInput.trim()}
                    style={{ padding: "10px 16px", background: urlLoading || !urlInput.trim() ? "#475569" : "#c9a84c", color: "white", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: urlLoading || !urlInput.trim() ? "not-allowed" : "pointer", whiteSpace: "nowrap", transition: "background 0.15s" }}
                  >
                    {urlLoading ? "Fetching…" : "Fetch"}
                  </button>
                </div>

                {urlError && (
                  <p style={{ fontSize: 12, color: "#92400e", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "8px 12px", marginTop: 10, fontWeight: 500 }}>
                    ⚠️ {urlError}
                    {propertyPreview?.listingUrl && (
                      <a href={propertyPreview.listingUrl} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginTop: 4, color: "var(--gold-ink)", fontWeight: 600, textDecoration: "none" }}>
                        Open listing →
                      </a>
                    )}
                  </p>
                )}

                {propertyPreview?.success && (
                  <div style={{ marginTop: 14, borderTop: "1px solid #e2e8f0", paddingTop: 12 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      {propertyPreview.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={propertyPreview.imageUrl} alt="Property" style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {propertyPreview.address && (
                          <p style={{ fontSize: 13, fontWeight: 700, color: "#0f1b36", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {propertyPreview.address}
                          </p>
                        )}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 4 }}>
                          {propertyPreview.price && (
                            <span style={{ fontSize: 12, fontWeight: 700, color: "#15803d", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "2px 8px", borderRadius: 6 }}>
                              £{propertyPreview.price.toLocaleString()}
                            </span>
                          )}
                          {propertyPreview.bedrooms && (
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", background: "#f8f9fc", border: "1px solid #e2e8f0", padding: "2px 8px", borderRadius: 6 }}>
                              {propertyPreview.bedrooms} bed
                            </span>
                          )}
                          {propertyPreview.propertyType && (
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", background: "#f8f9fc", border: "1px solid #e2e8f0", padding: "2px 8px", borderRadius: 6, textTransform: "capitalize" }}>
                              {propertyPreview.propertyType}
                            </span>
                          )}
                        </div>
                        <a href={propertyPreview.listingUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "var(--gold-ink)", fontWeight: 600, textDecoration: "none" }}>
                          View on {propertyPreview.portal} →
                        </a>
                      </div>
                    </div>
                    {propertyPreview.keyFeatures && propertyPreview.keyFeatures.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 10 }}>
                        {propertyPreview.keyFeatures.map((f, i) => (
                          <span key={i} style={{ fontSize: 10, color: "#475569", background: "#f8f9fc", border: "1px solid #e2e8f0", padding: "2px 7px", borderRadius: 6 }}>{f}</span>
                        ))}
                      </div>
                    )}
                    <p style={{ fontSize: 11, color: "#15803d", fontWeight: 600, marginTop: 8 }}>
                      ✓ Price auto-filled · postcode area data loaded
                    </p>
                  </div>
                )}
              </div>

              {/* Strategy Selector */}
              <div className="bg-white rounded-2xl border border-navy-100 p-5">
                <h3 className="font-bold text-navy-800 text-sm mb-3">🎯 Investment Strategy</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6 }}>
                  {(Object.entries(STRATEGY_META) as [Strategy, typeof STRATEGY_META[Strategy]][]).map(([key, meta]) => (
                    <button key={key} onClick={() => handleStrategyChange(key)}
                      style={{ padding: "8px 4px", borderRadius: 10, border: strategy === key ? "2px solid #c9a84c" : "1.5px solid #e2e8f0", background: strategy === key ? "#fefce8" : "white", cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}>
                      <div style={{ fontSize: 18 }}>{meta.icon}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: strategy === key ? "#92400e" : "#475569", marginTop: 3, lineHeight: 1.2 }}>{meta.label}</div>
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: "#475569", marginTop: 8 }}>{STRATEGY_META[strategy].desc}</p>
              </div>

              {/* Postcode lookup */}
              <div className="bg-white rounded-2xl border border-navy-100 p-5">
                <h3 className="font-bold text-navy-800 text-sm mb-1">📍 Property Postcode</h3>
                <p className="text-xs text-navy-400 mb-3">Get area intelligence — crime data, recent sold prices, and market context.</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    value={postcodeInput}
                    onChange={e => setPostcodeInput(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === "Enter" && lookupPostcode()}
                    placeholder="e.g. NG1 1AA"
                    maxLength={8}
                    style={{ flex: 1, padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 12, fontSize: 14, fontWeight: 600, outline: "none", textTransform: "uppercase", letterSpacing: "0.04em" }}
                  />
                  <button
                    onClick={lookupPostcode}
                    disabled={postcodeLoading || !postcodeInput.trim()}
                    style={{ padding: "10px 18px", background: postcodeLoading || !postcodeInput.trim() ? "#475569" : "#0f1b36", color: "white", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: postcodeLoading || !postcodeInput.trim() ? "not-allowed" : "pointer", whiteSpace: "nowrap", transition: "background 0.15s" }}
                  >
                    {postcodeLoading ? "Looking up…" : "Look up"}
                  </button>
                </div>
                {postcodeError && (
                  <p style={{ fontSize: 12, color: "#b91c1c", marginTop: 8, fontWeight: 500 }}>⚠️ {postcodeError}</p>
                )}

                {/* Area Intelligence results */}
                {areaData && (
                  <div style={{ marginTop: 16, borderTop: "1px solid #e2e8f0", paddingTop: 14 }}>
                    {/* Area header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <p style={{ fontSize: 16, fontWeight: 800, color: "#0f1b36" }}>{areaData.postcode}</p>
                        <p style={{ fontSize: 12, color: "#475569" }}>{[areaData.district, areaData.county, areaData.region].filter(Boolean).join(" · ")}</p>
                        <p style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{areaData.ward} ward · {areaData.constituency}</p>
                      </div>
                      <a
                        href={`https://www.google.com/maps?q=${areaData.lat},${areaData.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: 11, color: "var(--gold-ink)", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0z"/></svg>
                        Map
                      </a>
                    </div>

                    {/* Crime */}
                    <div style={{ padding: "10px 12px", borderRadius: 10, background: "#f8f9fc", border: "1.5px solid #e2e8f0", marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>🚨 Crime ({areaData.crime.month})</span>
                        <span style={{ fontSize: 13, fontWeight: 800, color: areaData.crime.color }}>{areaData.crime.level} — {areaData.crime.total} incidents</span>
                      </div>
                      {areaData.crime.topCategories.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 8px" }}>
                          {areaData.crime.topCategories.map(c => (
                            <span key={c.label} style={{ fontSize: 10, color: "#475569", background: "white", border: "1px solid #e2e8f0", padding: "2px 7px", borderRadius: 6 }}>
                              {c.label} ({c.count})
                            </span>
                          ))}
                        </div>
                      )}
                      <p style={{ fontSize: 10, color: "#475569", marginTop: 4 }}>Source: data.police.uk — crimes within ~1 mile</p>
                    </div>

                    {/* Recent sold prices */}
                    {areaData.sales.recent.length > 0 ? (
                      <div style={{ padding: "10px 12px", borderRadius: 10, background: "#f8f9fc", border: "1.5px solid #e2e8f0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>🏠 Recent Sold Prices</span>
                          {areaData.sales.avgPrice > 0 && (
                            <span style={{ fontSize: 12, fontWeight: 700, color: "#0f1b36" }}>Avg: <strong style={{ color: "var(--gold-ink)" }}>£{areaData.sales.avgPrice.toLocaleString()}</strong></span>
                          )}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                          {areaData.sales.recent.slice(0, 5).map((s, i) => (
                            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: i < 4 ? "1px solid #e2e8f0" : "none" }}>
                              <div>
                                <p style={{ fontSize: 11, fontWeight: 600, color: "#374151" }}>{s.address || s.type}</p>
                                <p style={{ fontSize: 10, color: "#475569" }}>{s.type} · {s.tenure} {s.newBuild ? "· New Build" : ""} · {s.date.slice(0, 7)}</p>
                              </div>
                              <span style={{ fontSize: 13, fontWeight: 800, color: "#0f1b36", flexShrink: 0, marginLeft: 8 }}>
                                £{s.price.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                        <p style={{ fontSize: 10, color: "#475569", marginTop: 6 }}>Source: HM Land Registry Price Paid Data</p>
                      </div>
                    ) : (
                      <p style={{ fontSize: 12, color: "#475569", textAlign: "center", padding: "8px 0" }}>No recent sold prices found for this postcode — try a nearby postcode.</p>
                    )}

                    {/* Rental Market */}
                    {areaData.rental && (
                      <div style={{ padding: "10px 12px", borderRadius: 10, background: "#f8f9fc", border: "1.5px solid #e2e8f0", marginTop: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>🏘️ Rental Market ({areaData.region})</span>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 6, background: areaData.rental.demand === "Very High" ? "#fef2f2" : areaData.rental.demand === "High" ? "#fefce8" : "#f0fdf4", color: areaData.rental.demand === "Very High" ? "#dc2626" : areaData.rental.demand === "High" ? "#ca8a04" : "#15803d" }}>{areaData.rental.demand} Demand</span>
                            <span style={{ fontSize: 10, color: "#15803d", fontWeight: 600 }}>{areaData.rental.trend}</span>
                          </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 4, marginBottom: 8 }}>
                          {[
                            { label: "Studio", val: areaData.rental.studio },
                            { label: "1 Bed", val: areaData.rental.oneBed },
                            { label: "2 Bed", val: areaData.rental.twoBed },
                            { label: "3 Bed", val: areaData.rental.threeBed },
                            { label: "4 Bed+", val: areaData.rental.fourBed },
                          ].map(r => (
                            <div key={r.label} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 7, padding: "5px 4px", textAlign: "center" }}>
                              <div style={{ fontSize: 9, color: "#475569", fontWeight: 600 }}>{r.label}</div>
                              <div style={{ fontSize: 11, fontWeight: 800, color: "#0f1b36" }}>£{r.val.toLocaleString()}</div>
                              <div style={{ fontSize: 9, color: "#475569" }}>/mo</div>
                            </div>
                          ))}
                        </div>
                        {areaData.rental.yieldRangeLow && areaData.rental.yieldRangeHigh && (
                          <p style={{ fontSize: 10, color: "#475569" }}>
                            Estimated gross yield: <strong style={{ color: "var(--gold-ink)" }}>{areaData.rental.yieldRangeLow}–{areaData.rental.yieldRangeHigh}%</strong> based on area sold prices
                          </p>
                        )}
                        <p style={{ fontSize: 10, color: "#475569", marginTop: 3 }}>Source: ONS Private Rental Market Statistics 2024 — regional medians</p>
                      </div>
                    )}

                    {areaData.suggestedCity && (
                      <p style={{ fontSize: 11, color: "#475569", marginTop: 8 }}>
                        📊 Benchmark auto-set to <strong>{BENCHMARKS[areaData.suggestedCity]?.name}</strong> based on region.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Property */}
              <div className="bg-white rounded-2xl border border-navy-100 p-5">
                <h3 className="font-bold text-navy-800 text-sm mb-4">🏠 Property</h3>
                <div className="space-y-3">
                  <label className="block">
                    <span className="block text-xs text-navy-500 mb-1">Purchase Price</span>
                    <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span>
                      <input type="number" min="0" value={purchasePrice} onChange={e => setPurchasePrice(nonNegative(e.target.value))} className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block">
                      <span className="block text-xs text-navy-500 mb-1">Refurb Cost</span>
                      <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span>
                        <input type="number" min="0" value={refurbCost} onChange={e => setRefurbCost(nonNegative(e.target.value))} className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                    </label>
                    <label className="block">
                      <span className="block text-xs text-navy-500 mb-1">After Refurb Value</span>
                      <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span>
                        <input type="number" min="0" value={afterRefurbValue} onChange={e => setARV(nonNegative(e.target.value))} className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                    </label>
                  </div>
                  {(strategy === "btl" || strategy === "sa") && (
                    <label className="block">
                      <span className="block text-xs text-navy-500 mb-1">Monthly Rent</span>
                      <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span>
                        <input type="number" min="0" value={monthlyRent} onChange={e => setMonthlyRent(nonNegative(e.target.value))} className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                    </label>
                  )}
                </div>
                {strategy === "btl" && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #e2e8f0" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                      <input type="checkbox" checked={guaranteedRent} onChange={e => setGuaranteedRent(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#c9a84c" }} />
                      <span className="text-sm font-semibold text-navy-700">Guaranteed Rent (via PropertyVault)</span>
                    </label>
                    {guaranteedRent && (
                      <div style={{ marginTop: 10 }}>
                        <label className="block">
                          <span className="block text-xs text-navy-500 mb-1">Guaranteed % of market rent: {guaranteedRentPct}%</span>
                          <input type="range" min={80} max={95} step={1} value={guaranteedRentPct} onChange={e => setGuaranteedRentPct(nonNegative(e.target.value))} style={{ width: "100%", accentColor: "#c9a84c" }} />
                        </label>
                        <p style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>Guaranteed: <strong style={{ color: "var(--gold-ink)" }}>{fmt(monthlyRent * guaranteedRentPct / 100)}/mo</strong> — no voids, no management fees</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Auto SDLT */}
              <div className="bg-white rounded-2xl border border-navy-100 p-5">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <h3 className="font-bold text-navy-800 text-sm">🏛️ Stamp Duty (Auto)</h3>
                  <span className="text-xs font-bold text-gold-600">{fmt(sdlt)}</span>
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={additionalProperty} onChange={e => setAdditionalProperty(e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: "#c9a84c" }} />
                  <span className="text-sm text-navy-600">Additional property (+5% surcharge)</span>
                </label>
                <p className="text-xs text-navy-400 mt-2">SDLT + £2,500 legal/survey = <strong className="text-navy-800">{fmt(purchaseCosts)}</strong> purchase costs</p>
              </div>

              {/* Mortgage */}
              <div className="bg-white rounded-2xl border border-navy-100 p-5">
                <h3 className="font-bold text-navy-800 text-sm mb-4">🏦 Mortgage</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block"><span className="block text-xs text-navy-500 mb-1">Deposit %</span><input type="number" min="0" value={depositPct} onChange={e => setDepositPct(nonNegative(e.target.value))} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></label>
                    <label className="block"><span className="block text-xs text-navy-500 mb-1">Rate %</span><input type="number" min="0" step="0.1" value={mortgageRate} onChange={e => setMortgageRate(nonNegative(e.target.value))} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block"><span className="block text-xs text-navy-500 mb-1">Term (yrs)</span><input type="number" min="0" value={mortgageTerm} onChange={e => setMortgageTerm(nonNegative(e.target.value))} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></label>
                    <label className="block"><span className="block text-xs text-navy-500 mb-1">Type</span>
                      <select value={mortgageType} onChange={e => setMortgageType(e.target.value as "interest"|"repayment")} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white">
                        <option value="interest">Interest only</option>
                        <option value="repayment">Repayment</option>
                      </select>
                    </label>
                  </div>
                </div>
              </div>

              {/* Running Costs */}
              <div className="bg-white rounded-2xl border border-navy-100 p-5">
                <h3 className="font-bold text-navy-800 text-sm mb-4">⚙️ Running Costs</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block"><span className="block text-xs text-navy-500 mb-1">Management %</span><input type="number" min="0" value={managementPct} onChange={e => setManagementPct(nonNegative(e.target.value))} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></label>
                    <label className="block"><span className="block text-xs text-navy-500 mb-1">Maintenance %</span><input type="number" min="0" value={maintenancePct} onChange={e => setMaintPct(nonNegative(e.target.value))} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block"><span className="block text-xs text-navy-500 mb-1">Insurance £/mo</span><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" min="0" value={insuranceMonthly} onChange={e => setInsurance(nonNegative(e.target.value))} className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></label>
                    <label className="block"><span className="block text-xs text-navy-500 mb-1">Void wks/yr</span><input type="number" min="0" value={voidWeeks} onChange={e => setVoidWeeks(nonNegative(e.target.value))} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></label>
                  </div>
                </div>
              </div>

              {/* HMO Inputs */}
              {strategy === "hmo" && (
                <div className="bg-white rounded-2xl border border-navy-100 p-5">
                  <h3 className="font-bold text-navy-800 text-sm mb-4">🏘️ HMO Details</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <label className="block"><span className="block text-xs text-navy-500 mb-1">Rooms</span><input type="number" min="0" value={hmoRooms} onChange={e => setHmoRooms(nonNegative(e.target.value))} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></label>
                      <label className="block"><span className="block text-xs text-navy-500 mb-1">Rent/Room £/mo</span><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" min="0" value={hmoRentPerRoom} onChange={e => setHmoRentPerRoom(nonNegative(e.target.value))} className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></label>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <label className="block"><span className="block text-xs text-navy-500 mb-1">Council Tax £/mo</span><input type="number" min="0" value={hmoCouncilTax} onChange={e => setHmoCouncilTax(nonNegative(e.target.value))} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></label>
                      <label className="block"><span className="block text-xs text-navy-500 mb-1">Utilities £/mo</span><input type="number" min="0" value={hmoUtilities} onChange={e => setHmoUtilities(nonNegative(e.target.value))} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></label>
                      <label className="block"><span className="block text-xs text-navy-500 mb-1">Licence £/yr</span><input type="number" min="0" value={hmoLicenceCost} onChange={e => setHmoLicenceCost(nonNegative(e.target.value))} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></label>
                    </div>
                    <p style={{ fontSize: 11, color: "#475569" }}>Gross income: <strong style={{ color: "var(--gold-ink)" }}>{fmt(hmoRooms * hmoRentPerRoom)}/mo</strong></p>
                  </div>
                </div>
              )}

              {/* R2R Inputs */}
              {strategy === "r2r" && (
                <div className="bg-white rounded-2xl border border-navy-100 p-5">
                  <h3 className="font-bold text-navy-800 text-sm mb-4">🔄 Rent-to-Rent Details</h3>
                  <div className="space-y-3">
                    <label className="block"><span className="block text-xs text-navy-500 mb-1">Lease Cost £/mo (you pay landlord)</span><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" min="0" value={r2rLeaseCost} onChange={e => setR2rLeaseCost(+e.target.value)} className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="block"><span className="block text-xs text-navy-500 mb-1">Rooms to Sublet</span><input type="number" min="0" value={r2rRooms} onChange={e => setR2rRooms(+e.target.value)} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></label>
                      <label className="block"><span className="block text-xs text-navy-500 mb-1">Sublet £/room/mo</span><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" min="0" value={r2rRentPerRoom} onChange={e => setR2rRentPerRoom(+e.target.value)} className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></label>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <label className="block"><span className="block text-xs text-navy-500 mb-1">Setup Cost £</span><input type="number" min="0" value={r2rSetupCost} onChange={e => setR2rSetupCost(+e.target.value)} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></label>
                      <label className="block"><span className="block text-xs text-navy-500 mb-1">Council Tax £/mo</span><input type="number" min="0" value={r2rCouncilTax} onChange={e => setR2rCouncilTax(+e.target.value)} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></label>
                      <label className="block"><span className="block text-xs text-navy-500 mb-1">Utilities £/mo</span><input type="number" min="0" value={r2rUtilities} onChange={e => setR2rUtilities(+e.target.value)} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></label>
                    </div>
                  </div>
                </div>
              )}

              {/* Flip Inputs */}
              {strategy === "flip" && (
                <div className="bg-white rounded-2xl border border-navy-100 p-5">
                  <h3 className="font-bold text-navy-800 text-sm mb-4">🔨 Flip Details</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <label className="block"><span className="block text-xs text-navy-500 mb-1">Hold Period (months)</span><input type="number" min="0" value={flipHoldingMonths} onChange={e => setFlipHoldingMonths(nonNegative(e.target.value))} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></label>
                      <label className="block"><span className="block text-xs text-navy-500 mb-1">Agent Fee %</span><input type="number" min="0" step="0.1" value={flipAgentFee} onChange={e => setFlipAgentFee(nonNegative(e.target.value))} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></label>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <label className="block"><span className="block text-xs text-navy-500 mb-1">Bridge Rate %/mo</span><input type="number" min="0" step="0.05" value={flipBridgingRate} onChange={e => setFlipBridgingRate(nonNegative(e.target.value))} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></label>
                      <label className="block"><span className="block text-xs text-navy-500 mb-1">Bridge LTV %</span><input type="number" min="0" value={flipBridgingLTV} onChange={e => setFlipBridgingLTV(nonNegative(e.target.value))} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></label>
                      <label className="block"><span className="block text-xs text-navy-500 mb-1">Holding Costs £/mo</span><input type="number" min="0" value={flipHoldingCosts} onChange={e => setFlipHoldingCosts(nonNegative(e.target.value))} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></label>
                    </div>
                  </div>
                </div>
              )}

              {/* SA Inputs */}
              {strategy === "sa" && (
                <div className="bg-white rounded-2xl border border-navy-100 p-5">
                  <h3 className="font-bold text-navy-800 text-sm mb-4">🏨 Serviced Accommodation Details</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <label className="block"><span className="block text-xs text-navy-500 mb-1">Nightly Rate £</span><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" min="0" value={saNightlyRate} onChange={e => setSaNightlyRate(nonNegative(e.target.value))} className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></label>
                      <label className="block"><span className="block text-xs text-navy-500 mb-1">Occupancy %</span><input type="number" min="0" value={saOccupancy} onChange={e => setSaOccupancy(nonNegative(e.target.value))} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></label>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <label className="block"><span className="block text-xs text-navy-500 mb-1">Platform Fee %</span><input type="number" min="0" step="0.5" value={saPlatformFee} onChange={e => setSaPlatformFee(nonNegative(e.target.value))} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></label>
                      <label className="block"><span className="block text-xs text-navy-500 mb-1">Clean/Stay £</span><input type="number" min="0" value={saCleaningPerStay} onChange={e => setSaCleaningPerStay(nonNegative(e.target.value))} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></label>
                      <label className="block"><span className="block text-xs text-navy-500 mb-1">Avg Stay (nights)</span><input type="number" min="0" value={saAvgStayNights} onChange={e => setSaAvgStayNights(nonNegative(e.target.value))} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></label>
                    </div>
                    <label className="block"><span className="block text-xs text-navy-500 mb-1">Running Costs £/mo (linen, toiletries, etc.)</span><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" min="0" value={saRunningCosts} onChange={e => setSaRunningCosts(nonNegative(e.target.value))} className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></label>
                    <p style={{ fontSize: 11, color: "#475569" }}>Projected revenue: <strong style={{ color: "var(--gold-ink)" }}>{fmt(saCalc.grossRevenue)}/yr</strong> ({saCalc.occupiedNights} nights)</p>
                  </div>
                </div>
              )}

              {/* Smart settings */}
              <div className="bg-white rounded-2xl border border-navy-100 p-5">
                <h3 className="font-bold text-navy-800 text-sm mb-4">🧠 Smart Settings</h3>
                <div className="space-y-3">
                  <label className="block">
                    <span className="block text-xs text-navy-500 mb-1">Benchmark city</span>
                    <select value={cityBenchmark} onChange={e => setCityBenchmark(e.target.value)} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white">
                      {Object.entries(BENCHMARKS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="block text-xs text-navy-500 mb-1">Tax situation</span>
                    <select value={taxBand} onChange={e => setTaxBand(e.target.value as typeof taxBand)} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white">
                      <option value="basic">Basic rate (20%)</option>
                      <option value="higher">Higher rate (40%)</option>
                      <option value="company">Limited company (19%)</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="block text-xs text-navy-500 mb-1">Capital growth assumption: {capitalGrowthPct}%/yr</span>
                    <input type="range" min={0} max={8} step={0.5} value={capitalGrowthPct} onChange={e => setCapGrowth(signed(e.target.value))} style={{ width: "100%", accentColor: "#c9a84c" }} />
                  </label>
                </div>
              </div>
            </div>

            {/* ── RESULTS ────────────────────────────────────── */}
            <div className="lg:col-span-3 space-y-4">

              {/* 4 key metrics */}
              <div className="grid grid-cols-2 gap-3">
                {(strategy === "hmo" ? [
                  { label: "Gross Yield", value: `${hmoCalc.grossYield.toFixed(1)}%`, sub: `${hmoRooms} rooms × ${fmt(hmoRentPerRoom)}`, cls: "text-navy-800" },
                  { label: "Net Yield",   value: `${hmoCalc.netYield.toFixed(1)}%`,   sub: "After all HMO costs", cls: yldColor(hmoCalc.netYield) },
                  { label: "Monthly CF",  value: fmt(hmoCalc.monthlyCF), sub: "Net income/mo", cls: cfColor(hmoCalc.monthlyCF) },
                  { label: "Cash-on-Cash",value: `${hmoCalc.cashOnCash.toFixed(1)}%`, sub: "Return on cash", cls: cfColor(hmoCalc.cashOnCash - 5) },
                ] : strategy === "r2r" ? [
                  { label: "Monthly CF",  value: fmt(r2rCalc.monthlyCF), sub: "Sublet income − lease", cls: cfColor(r2rCalc.monthlyCF) },
                  { label: "Annual Profit",value: fmt(r2rCalc.netIncome), sub: "Net income/yr", cls: cfColor(r2rCalc.netIncome / 12) },
                  { label: "ROI",          value: `${r2rCalc.roi.toFixed(1)}%`, sub: "On setup cost", cls: cfColor(r2rCalc.roi - 5) },
                  { label: "Payback",      value: r2rCalc.paybackMonths === Infinity ? "N/A" : `${Math.ceil(r2rCalc.paybackMonths)}mo`, sub: "Setup cost payback", cls: "text-navy-800" },
                ] : strategy === "flip" ? [
                  { label: "Net Profit",   value: fmt(flipCalc.netProfit), sub: "After all costs", cls: cfColor(flipCalc.netProfit / 1000) },
                  { label: "ROI",          value: `${flipCalc.roi.toFixed(1)}%`, sub: "Return on cash in", cls: cfColor(flipCalc.roi - 10) },
                  { label: "Ann. ROI",     value: `${flipCalc.annualisedRoi.toFixed(1)}%`, sub: "Annualised", cls: cfColor(flipCalc.annualisedRoi - 15) },
                  { label: "Profit Margin",value: `${flipCalc.margin.toFixed(1)}%`, sub: "% of sale price", cls: cfColor(flipCalc.margin - 10) },
                ] : strategy === "sa" ? [
                  { label: "Gross Revenue",value: fmt(saCalc.grossRevenue), sub: `${saCalc.occupiedNights} nights/yr`, cls: "text-navy-800" },
                  { label: "Net Yield",    value: `${saCalc.netYield.toFixed(1)}%`, sub: "After all SA costs", cls: yldColor(saCalc.netYield) },
                  { label: "Monthly CF",   value: fmt(saCalc.monthlyCF), sub: "Net income/mo", cls: cfColor(saCalc.monthlyCF) },
                  { label: "Cash-on-Cash", value: `${saCalc.cashOnCash.toFixed(1)}%`, sub: "Return on cash", cls: cfColor(saCalc.cashOnCash - 5) },
                ] : [
                  { label: "Gross Yield", value: `${calc.grossYield.toFixed(1)}%`, sub: "Rent / price", cls: "text-navy-800" },
                  { label: "Net Yield",   value: `${calc.netYield.toFixed(1)}%`,   sub: "After all costs", cls: yldColor(calc.netYield) },
                  { label: "Monthly CF",  value: fmt(guaranteedRent ? grCalc.grMonthlyCF : calc.monthlyCF), sub: guaranteedRent ? "Guaranteed rent CF" : "Net income/mo", cls: cfColor(guaranteedRent ? grCalc.grMonthlyCF : calc.monthlyCF) },
                  { label: "Cash-on-Cash",value: `${calc.cashOnCash.toFixed(1)}%`, sub: "Return on cash", cls: cfColor(calc.cashOnCash - 5) },
                ]).map(m => (
                  <div key={m.label} className="bg-white rounded-2xl border border-navy-100 p-5">
                    <p className="text-xs text-navy-400 font-semibold mb-1">{m.label}</p>
                    <p className={`text-3xl font-extrabold ${m.cls}`}>{m.value}</p>
                    <p className="text-xs text-navy-400 mt-1">{m.sub}</p>
                  </div>
                ))}
              </div>

              {/* Tab navigation */}
              <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
                {availableTabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveSection(tab.id)}
                    style={{ padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: activeSection === tab.id ? "none" : "1.5px solid #e2e8f0", background: activeSection === tab.id ? "#0f1b36" : "white", color: activeSection === tab.id ? "white" : "#475569", whiteSpace: "nowrap", transition: "all 0.15s", flexShrink: 0 }}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* ── OVERVIEW TAB ──────────────────────────────── */}
              {activeSection === "overview" && (
                <div className="space-y-4">

                  {/* R2R Summary */}
                  {strategy === "r2r" && (
                    <div className="bg-white rounded-2xl border border-navy-100 p-5 space-y-3">
                      <h4 className="font-bold text-navy-800 text-sm">🔄 Rent-to-Rent P&L</h4>
                      {[
                        ["Sublet Income", fmt(r2rCalc.grossIncome), "green"],
                        ["Lease Cost", `-${fmt(r2rLeaseCost * 12)}`, "red"],
                        ["Council Tax + Utilities", `-${fmt((r2rCouncilTax + r2rUtilities) * 12)}`, "red"],
                        ["Management + Maintenance", `-${fmt(r2rCalc.grossIncome * (managementPct + maintenancePct) / 100)}`, "red"],
                      ].map(([l, v, c]) => (
                        <div key={l as string} className="flex justify-between text-sm">
                          <span className="text-navy-500">{l}</span>
                          <span className={`font-semibold ${c === "green" ? "text-green-600" : "text-red-500"}`}>{v}</span>
                        </div>
                      ))}
                      <div className="border-t border-navy-100 pt-2 flex justify-between font-bold">
                        <span>Net Annual Profit</span>
                        <span className={r2rCalc.netIncome >= 0 ? "text-green-600" : "text-red-600"}>{fmt(r2rCalc.netIncome)}</span>
                      </div>
                      <p className="text-xs text-navy-400">No mortgage required. Setup cost {fmt(r2rSetupCost)} recovers in {Math.ceil(r2rCalc.paybackMonths)} months.</p>
                    </div>
                  )}

                  {/* Flip Summary */}
                  {strategy === "flip" && (
                    <div className="bg-white rounded-2xl border border-navy-100 p-5 space-y-3">
                      <h4 className="font-bold text-navy-800 text-sm">🔨 Flip P&L</h4>
                      {[
                        ["Sale Price (ARV)", fmt(afterRefurbValue), "green"],
                        ["Purchase Price", `-${fmt(purchasePrice)}`, "red"],
                        ["Refurb Cost", `-${fmt(refurbCost)}`, "red"],
                        ["Bridging Finance", `-${fmt(flipCalc.totalBridgeCost)}`, "red"],
                        ["Holding Costs", `-${fmt(flipCalc.holdingCosts)}`, "red"],
                        ["Agent Fee", `-${fmt(flipCalc.agentFeeAmt)}`, "red"],
                        ["SDLT + Legal", `-${fmt(purchaseCosts)}`, "red"],
                      ].map(([l, v, c]) => (
                        <div key={l as string} className="flex justify-between text-sm">
                          <span className="text-navy-500">{l}</span>
                          <span className={`font-semibold ${c === "green" ? "text-green-600" : "text-red-500"}`}>{v}</span>
                        </div>
                      ))}
                      <div className="border-t border-navy-100 pt-2 flex justify-between font-bold">
                        <span>Net Profit</span>
                        <span className={flipCalc.netProfit >= 0 ? "text-green-600" : "text-red-600"}>{fmt(flipCalc.netProfit)}</span>
                      </div>
                      <p className="text-xs text-navy-400">Cash in: {fmt(flipCalc.cashIn)} · Bridge: {fmt(flipCalc.bridgeAmount)} at {flipBridgingRate}%/mo · {flipHoldingMonths}-month hold</p>
                    </div>
                  )}

                  {/* HMO Summary */}
                  {strategy === "hmo" && (
                    <div className="bg-white rounded-2xl border border-navy-100 p-5 space-y-3">
                      <h4 className="font-bold text-navy-800 text-sm">🏘️ HMO P&L</h4>
                      {[
                        ["Gross HMO Income", fmt(hmoCalc.grossIncome), "green"],
                        ["Mortgage", `-${fmt(hmoCalc.annualMtg)}`, "red"],
                        ["Management + Maintenance", `-${fmt(hmoCalc.grossIncome * (managementPct + maintenancePct) / 100)}`, "red"],
                        ["Council Tax + Utilities", `-${fmt((hmoCouncilTax + hmoUtilities) * 12)}`, "red"],
                        ["HMO Licence", `-${fmt(hmoLicenceCost)}`, "red"],
                        ["Insurance + Voids", `-${fmt(insuranceMonthly * 12 + (hmoCalc.grossIncome / 52) * voidWeeks)}`, "red"],
                      ].map(([l, v, c]) => (
                        <div key={l as string} className="flex justify-between text-sm">
                          <span className="text-navy-500">{l}</span>
                          <span className={`font-semibold ${c === "green" ? "text-green-600" : "text-red-500"}`}>{v}</span>
                        </div>
                      ))}
                      <div className="border-t border-navy-100 pt-2 flex justify-between font-bold">
                        <span>Net Annual Income</span>
                        <span className={hmoCalc.netIncome >= 0 ? "text-green-600" : "text-red-600"}>{fmt(hmoCalc.netIncome)}</span>
                      </div>
                    </div>
                  )}

                  {/* SA Summary */}
                  {strategy === "sa" && (
                    <div className="bg-white rounded-2xl border border-navy-100 p-5 space-y-3">
                      <h4 className="font-bold text-navy-800 text-sm">🏨 SA Revenue Breakdown</h4>
                      {[
                        ["Gross Revenue", fmt(saCalc.grossRevenue), "green"],
                        ["Platform Fees", `-${fmt(saCalc.platformFees)}`, "red"],
                        ["Cleaning Costs", `-${fmt(saCalc.cleaningCosts)}`, "red"],
                        ["Running Costs", `-${fmt(saCalc.annualRunning)}`, "red"],
                        ["Mortgage", `-${fmt(saCalc.annualMtg)}`, "red"],
                        ["Insurance", `-${fmt(insuranceMonthly * 12)}`, "red"],
                      ].map(([l, v, c]) => (
                        <div key={l as string} className="flex justify-between text-sm">
                          <span className="text-navy-500">{l}</span>
                          <span className={`font-semibold ${c === "green" ? "text-green-600" : "text-red-500"}`}>{v}</span>
                        </div>
                      ))}
                      <div className="border-t border-navy-100 pt-2 flex justify-between font-bold">
                        <span>Net Annual Income</span>
                        <span className={saCalc.netIncome >= 0 ? "text-green-600" : "text-red-600"}>{fmt(saCalc.netIncome)}</span>
                      </div>
                    </div>
                  )}

                  {/* Guaranteed Rent Comparison */}
                  {strategy === "btl" && guaranteedRent && (
                    <div className="bg-white rounded-2xl border border-navy-100 p-5">
                      <h4 className="font-bold text-navy-800 text-sm mb-3">🛡️ Guaranteed Rent vs Self-Managed</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div style={{ padding: "14px", borderRadius: 12, background: "#f8f9fc", border: "1.5px solid #e2e8f0" }}>
                          <p style={{ fontSize: 11, color: "#475569", marginBottom: 6, fontWeight: 600 }}>SELF-MANAGED</p>
                          <p style={{ fontSize: 20, fontWeight: 800, color: calc.monthlyCF >= 0 ? "#0f1b36" : "#dc2626" }}>{fmt(calc.monthlyCF)}/mo</p>
                          <div style={{ marginTop: 8, fontSize: 11, color: "#475569" }}>
                            <div>Rent: {fmt(monthlyRent)}/mo</div>
                            <div>Voids: ~{voidWeeks} wks/yr</div>
                            <div>Mgmt: {managementPct}%</div>
                          </div>
                        </div>
                        <div style={{ padding: "14px", borderRadius: 12, background: "#f0fdf4", border: "1.5px solid #bbf7d0" }}>
                          <p style={{ fontSize: 11, color: "#15803d", marginBottom: 6, fontWeight: 700 }}>GUARANTEED RENT</p>
                          <p style={{ fontSize: 20, fontWeight: 800, color: grCalc.grMonthlyCF >= 0 ? "#15803d" : "#dc2626" }}>{fmt(grCalc.grMonthlyCF)}/mo</p>
                          <div style={{ marginTop: 8, fontSize: 11, color: "#475569" }}>
                            <div>Rent: {fmt(grCalc.grMonthly)}/mo ({guaranteedRentPct}%)</div>
                            <div>Voids: <strong style={{ color: "#15803d" }}>0 weeks</strong></div>
                            <div>Mgmt: <strong style={{ color: "#15803d" }}>0%</strong></div>
                          </div>
                        </div>
                      </div>
                      <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 10, background: grCalc.saving >= 0 ? "#eff6ff" : "#fffbeb", border: `1px solid ${grCalc.saving >= 0 ? "#bfdbfe" : "#fde68a"}` }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: grCalc.saving >= 0 ? "#1d4ed8" : "#92400e" }}>
                          {grCalc.saving >= 0
                            ? `💡 Guaranteed rent gives you ${fmt(grCalc.saving)}/mo more certainty — no void risk, no agent hassle.`
                            : `⚠️ Self-managing earns ${fmt(-grCalc.saving)}/mo more if fully let. Guaranteed rent trades income for peace of mind.`}
                        </p>
                      </div>
                      <a href="/guaranteed-rent" style={{ display: "block", marginTop: 12, textAlign: "center", padding: "10px", borderRadius: 10, background: "#0f1b36", color: "var(--gold-ink)", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
                        Get a Guaranteed Rent Quote from PropertyVault →
                      </a>
                    </div>
                  )}

                  {/* Smart Insights */}
                  <div className="bg-white rounded-2xl border border-navy-100 p-5">
                    <h4 className="font-bold text-navy-800 text-sm mb-3 flex items-center gap-2">
                      <span>🧠</span> Smart Insights
                    </h4>
                    <div className="space-y-2">
                      {insights.map((ins, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", borderRadius: 10, background: ins.type === "success" ? "#f0fdf4" : ins.type === "warn" ? "#fffbeb" : ins.type === "error" ? "#fef2f2" : "#eff6ff", border: `1px solid ${ins.type === "success" ? "#bbf7d0" : ins.type === "warn" ? "#fde68a" : ins.type === "error" ? "#fecaca" : "#bfdbfe"}` }}>
                          <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{ins.type === "success" ? "✅" : ins.type === "warn" ? "⚠️" : ins.type === "error" ? "❌" : "💡"}</span>
                          <p style={{ fontSize: 13, lineHeight: 1.5, color: "#374151" }}>{ins.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Deal Verdict */}
                  <div className="bg-white rounded-2xl border border-navy-100 p-5" style={{ borderColor: "#c9a84c33" }}>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-navy-800 text-sm flex items-center gap-2">
                        <span>🤖</span> AI Deal Verdict
                      </h4>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#92400e", background: "#fef3c7", border: "1px solid #fde68a", padding: "1px 7px", borderRadius: 20 }}>NEW</span>
                    </div>
                    <p className="text-xs text-navy-400 mb-4">Claude analyses your deal metrics and gives a buy / negotiate / pass verdict with red flags and negotiation tips.</p>

                    {!aiVerdict && (
                      <button
                        onClick={getAiVerdict}
                        disabled={aiVerdictLoading}
                        style={{ width: "100%", padding: "11px", background: aiVerdictLoading ? "#475569" : "#0f1b36", color: aiVerdictLoading ? "white" : "#c9a84c", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: aiVerdictLoading ? "not-allowed" : "pointer", transition: "background 0.15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                      >
                        {aiVerdictLoading ? (
                          <>
                            <svg style={{ animation: "spin 1s linear infinite", width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 12v3M3 12h3m12 0h3m-2.636-6.364-2.122 2.122M7.758 16.242l-2.122 2.122m0-12.728 2.122 2.122m8.484 8.484 2.122 2.122" /></svg>
                            Analysing deal…
                          </>
                        ) : "Get AI Deal Verdict →"}
                      </button>
                    )}

                    {aiVerdictError && (
                      <p style={{ fontSize: 12, color: "#b91c1c", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 12px", marginTop: 8 }}>⚠️ {aiVerdictError}</p>
                    )}

                    {aiVerdict && (
                      <div>
                        {/* Verdict badge */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, padding: "12px 16px", borderRadius: 12, background: aiVerdict.verdict === "Buy" ? "#f0fdf4" : aiVerdict.verdict === "Negotiate" ? "#fffbeb" : "#fef2f2", border: `2px solid ${aiVerdict.verdict === "Buy" ? "#86efac" : aiVerdict.verdict === "Negotiate" ? "#fde68a" : "#fecaca"}` }}>
                          <span style={{ fontSize: 28 }}>{aiVerdict.verdict === "Buy" ? "✅" : aiVerdict.verdict === "Negotiate" ? "🤝" : "❌"}</span>
                          <div>
                            <p style={{ fontSize: 20, fontWeight: 900, color: aiVerdict.verdict === "Buy" ? "#15803d" : aiVerdict.verdict === "Negotiate" ? "#92400e" : "#dc2626", lineHeight: 1.1 }}>{aiVerdict.verdict}</p>
                            <p style={{ fontSize: 11, color: "#475569", fontWeight: 600 }}>AI-assisted analysis · not financial advice</p>
                          </div>
                        </div>

                        <p style={{ fontSize: 11, lineHeight: 1.5, color: "#475569", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 11px", marginBottom: 14 }}>
                          This is an automated reading of the figures you entered, not a personal recommendation.
                          PropertyVault UK is not authorised or regulated by the FCA. Check the numbers yourself and
                          speak to a qualified professional before committing to a purchase.
                        </p>

                        {/* Summary */}
                        <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, marginBottom: 14, fontStyle: "italic" }}>&ldquo;{aiVerdict.summary}&rdquo;</p>

                        {/* Green flags */}
                        {aiVerdict.greenFlags?.length > 0 && (
                          <div style={{ marginBottom: 12 }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: "#15803d", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>✅ Green flags</p>
                            <div className="space-y-1.5">
                              {aiVerdict.greenFlags.map((f, i) => (
                                <div key={i} style={{ fontSize: 13, color: "#374151", padding: "7px 10px", background: "#f0fdf4", borderRadius: 8, border: "1px solid #bbf7d0" }}>{f}</div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Red flags */}
                        {aiVerdict.redFlags?.length > 0 && (
                          <div style={{ marginBottom: 12 }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: "#b91c1c", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>⚠️ Red flags</p>
                            <div className="space-y-1.5">
                              {aiVerdict.redFlags.map((f, i) => (
                                <div key={i} style={{ fontSize: 13, color: "#374151", padding: "7px 10px", background: "#fef2f2", borderRadius: 8, border: "1px solid #fecaca" }}>{f}</div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Negotiation tip */}
                        {aiVerdict.negotiationTip && (
                          <div style={{ marginBottom: 12, padding: "10px 12px", background: "#eff6ff", borderRadius: 10, border: "1px solid #bfdbfe" }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: "#1d4ed8", marginBottom: 4 }}>💡 NEGOTIATION TIP</p>
                            <p style={{ fontSize: 13, color: "#374151" }}>{aiVerdict.negotiationTip}</p>
                          </div>
                        )}

                        {/* Key insight */}
                        {aiVerdict.keyInsight && (
                          <div style={{ padding: "10px 12px", background: "#f8f9fc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
                            <p style={{ fontSize: 13, color: "#0f1b36", fontWeight: 600, lineHeight: 1.5 }}>🔑 {aiVerdict.keyInsight}</p>
                          </div>
                        )}

                        <button
                          onClick={() => { setAiVerdict(null); setAiVerdictError(""); }}
                          style={{ marginTop: 12, fontSize: 12, color: "#475569", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                        >
                          Re-analyse →
                        </button>
                      </div>
                    )}
                  </div>

                  {/* City Benchmark */}
                  <div className="bg-white rounded-2xl border border-navy-100 p-5">
                    <h4 className="font-bold text-navy-800 text-sm mb-3">📍 vs {BENCHMARKS[cityBenchmark].name} Market</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Your Gross Yield", yours: calc.grossYield, avg: BENCHMARKS[cityBenchmark].gross },
                        { label: "Your Net Yield",   yours: calc.netYield,   avg: BENCHMARKS[cityBenchmark].net },
                      ].map(b => (
                        <div key={b.label} style={{ padding: "12px 14px", borderRadius: 12, background: "#f8f9fc", border: "1px solid #e2e8f0" }}>
                          <p style={{ fontSize: 11, color: "#475569", marginBottom: 6 }}>{b.label}</p>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                            <span style={{ fontSize: 20, fontWeight: 800, color: b.yours >= b.avg ? "#15803d" : "#dc2626" }}>{b.yours.toFixed(1)}%</span>
                            <span style={{ fontSize: 12, color: "#475569" }}>vs {b.avg}% avg</span>
                          </div>
                          <div style={{ height: 6, borderRadius: 4, background: "#e2e8f0", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${Math.min(100, (b.yours / (b.avg * 2)) * 100)}%`, background: b.yours >= b.avg ? "#15803d" : "#f59e0b", borderRadius: 4, transition: "width 0.4s" }} />
                          </div>
                          <p style={{ fontSize: 10, color: b.yours >= b.avg ? "#15803d" : "#dc2626", marginTop: 4, fontWeight: 600 }}>
                            {b.yours >= b.avg ? `▲ ${(b.yours - b.avg).toFixed(1)}% above` : `▼ ${(b.avg - b.yours).toFixed(1)}% below`} market avg
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expense Breakdown */}
                  <div className="bg-white rounded-2xl border border-navy-100 p-5">
                    <h4 className="font-bold text-navy-800 text-sm mb-4">Annual Expenses</h4>
                    <div className="h-5 rounded-full overflow-hidden flex mb-4">
                      {expenseItems.map(item => (
                        <div key={item.label} style={{ width: `${expTotal > 0 ? (item.value / expTotal * 100) : 0}%`, backgroundColor: item.color }} className="h-full transition-all" title={`${item.label}: ${fmt(item.value)}`} />
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {expenseItems.map(item => (
                        <div key={item.label} className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                          <div><p className="text-xs text-navy-400">{item.label}</p><p className="text-sm font-semibold text-navy-800">{fmt(item.value)}</p></div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-navy-100 mt-4 pt-3 flex justify-between text-sm">
                      <span className="font-semibold text-navy-800">Total annual expenses</span>
                      <span className="font-bold text-red-600">{fmt(expTotal)}</span>
                    </div>
                  </div>

                  {/* P&L */}
                  <div className="bg-navy-800 rounded-2xl p-5 text-white">
                    <h4 className="font-bold text-sm text-white/50 mb-3">Profit & Loss</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-white/60">Annual rental income</span><span className="font-semibold text-green-400">{fmt(calc.annualRent)}</span></div>
                      <div className="flex justify-between"><span className="text-white/60">Total expenses</span><span className="font-semibold text-red-400">-{fmt(calc.totalExpenses)}</span></div>
                      <div className="flex justify-between border-t border-white/10 pt-2">
                        <span className="font-bold">Net annual income</span>
                        <span className={`font-bold text-lg ${calc.netIncome >= 0 ? "text-green-400" : "text-red-400"}`}>{fmt(calc.netIncome)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Investment Summary */}
                  <div className="bg-white rounded-2xl border border-navy-100 p-5">
                    <h4 className="font-bold text-navy-800 text-sm mb-3">Investment Summary</h4>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm mb-3">
                      {[
                        ["Deposit", fmt(calc.depositAmount)],
                        ["Loan amount", fmt(calc.loanAmount)],
                        ["SDLT", fmt(sdlt)],
                        ["Legal / survey", "£2,500"],
                        ["Refurb", fmt(refurbCost)],
                        ["Monthly mortgage", fmt2(calc.monthlyMortgage)],
                        ["Equity created", fmt(calc.equityGain)],
                        ["ROI (income+equity)", `${calc.roi.toFixed(1)}%`],
                      ].map(([l, v]) => (
                        <div key={l} className="flex justify-between"><span className="text-navy-500">{l}</span><span className="font-semibold text-navy-800">{v}</span></div>
                      ))}
                    </div>
                    <div className="border-t border-navy-100 pt-3 flex justify-between">
                      <span className="font-bold text-navy-800">Total cash invested</span>
                      <span className="font-extrabold text-lg text-navy-800">{fmt(calc.totalCashIn)}</span>
                    </div>
                  </div>
                  <EmailResults deal={{
                    purchasePrice,
                    monthlyRent,
                    grossYield: calc.grossYield,
                    netYield: calc.netYield,
                    monthlyCF: calc.monthlyCF,
                    cashOnCash: calc.cashOnCash,
                    dealScore: calc.dealScore,
                    totalCashIn: calc.totalCashIn,
                    netIncome: calc.netIncome,
                    strategy: STRATEGY_META[strategy].label,
                  }} />
                  <ShareResults title="Property Deal Analyser" summary={`Deal score ${calc.dealScore}/100: ${calc.grossYield.toFixed(1)}% gross yield, ${fmt(calc.monthlyCF)}/mo cash flow, ${calc.cashOnCash.toFixed(1)}% cash-on-cash`} />
                </div>
              )}

              {/* ── STRESS TEST TAB ───────────────────────────── */}
              {activeSection === "stress" && (
                <div className="bg-white rounded-2xl border border-navy-100 p-5 space-y-4">
                  <h4 className="font-bold text-navy-800 text-sm">Stress Test — Monthly Cash Flow</h4>
                  <p className="text-xs text-navy-400">How does your cash flow hold up when things go wrong?</p>
                  <div className="space-y-3">
                    {[
                      { label: "Current (baseline)",           value: stressCalc.baseline,  icon: "📊" },
                      { label: "Rate +1% (to " + (mortgageRate+1).toFixed(1) + "%)",        value: stressCalc.ratePlus1, icon: "📈" },
                      { label: "Rate +2% (to " + (mortgageRate+2).toFixed(1) + "%)",        value: stressCalc.ratePlus2, icon: "📈" },
                      { label: "Void period doubles",          value: stressCalc.voidDouble, icon: "🏚️" },
                      { label: "Rent falls 10%",               value: stressCalc.rentMinus,  icon: "📉" },
                      { label: "Worst case (all combined)",    value: stressCalc.worstCase,  icon: "⚠️" },
                    ].map(s => {
                      const pct = stressCalc.baseline !== 0 ? ((s.value - stressCalc.baseline) / Math.abs(stressCalc.baseline)) * 100 : 0;
                      return (
                        <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, background: s.value < 0 ? "#fef2f2" : s.value < 100 ? "#fffbeb" : "#f0fdf4", border: `1px solid ${s.value < 0 ? "#fecaca" : s.value < 100 ? "#fde68a" : "#bbf7d0"}` }}>
                          <span style={{ fontSize: 18, flexShrink: 0 }}>{s.icon}</span>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{s.label}</p>
                            {s.label !== "Current (baseline)" && <p style={{ fontSize: 11, color: "#475569" }}>{pct >= 0 ? `+${pct.toFixed(0)}%` : `${pct.toFixed(0)}%`} vs baseline</p>}
                          </div>
                          <span style={{ fontSize: 16, fontWeight: 800, color: s.value >= 200 ? "#15803d" : s.value >= 0 ? "#d97706" : "#dc2626", fontFamily: "monospace" }}>
                            {fmt(s.value)}/mo
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ padding: "12px 14px", borderRadius: 12, background: "#f8f9fc", border: "1px solid #e2e8f0" }}>
                    <p className="text-xs font-bold text-navy-800 mb-1">Break-even rent</p>
                    <p className="text-2xl font-extrabold text-navy-800">{fmt((calc.totalExpenses / 12) + 1)}<span className="text-sm font-normal text-navy-400">/mo</span></p>
                    <p className="text-xs text-navy-400">Minimum rent to avoid negative cash flow</p>
                  </div>

                  {/* ICR Lender Stress Test */}
                  <div style={{ padding: "16px", borderRadius: 14, border: "1.5px solid #e2e8f0", background: "white" }}>
                    <h4 className="font-bold text-navy-800 text-sm mb-1">🏦 Lender ICR Stress Test</h4>
                    <p className="text-xs text-navy-400 mb-3">Interest Coverage Ratio — lenders require rent to cover mortgage by 125% (basic rate) or 145% (higher rate / company).</p>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div style={{ textAlign: "center", padding: "12px", borderRadius: 10, background: "#f8f9fc" }}>
                        <p style={{ fontSize: 10, color: "#475569", marginBottom: 4 }}>Your ICR</p>
                        <p style={{ fontSize: 22, fontWeight: 800, color: icrCalc.passes125 ? "#15803d" : "#dc2626" }}>{icrCalc.icr === Infinity ? "∞" : icrCalc.icr.toFixed(2)}x</p>
                      </div>
                      <div style={{ textAlign: "center", padding: "12px", borderRadius: 10, background: icrCalc.passes125 ? "#f0fdf4" : "#fef2f2", border: `1.5px solid ${icrCalc.passes125 ? "#bbf7d0" : "#fecaca"}` }}>
                        <p style={{ fontSize: 10, color: "#475569", marginBottom: 4 }}>Basic Rate 1.25x</p>
                        <p style={{ fontSize: 16, fontWeight: 800, color: icrCalc.passes125 ? "#15803d" : "#dc2626" }}>{icrCalc.passes125 ? "✓ PASS" : "✗ FAIL"}</p>
                        <p style={{ fontSize: 10, color: "#475569" }}>Need {fmt(icrCalc.required125)}/mo</p>
                      </div>
                      <div style={{ textAlign: "center", padding: "12px", borderRadius: 10, background: icrCalc.passes145 ? "#f0fdf4" : "#fef2f2", border: `1.5px solid ${icrCalc.passes145 ? "#bbf7d0" : "#fecaca"}` }}>
                        <p style={{ fontSize: 10, color: "#475569", marginBottom: 4 }}>Higher Rate 1.45x</p>
                        <p style={{ fontSize: 16, fontWeight: 800, color: icrCalc.passes145 ? "#15803d" : "#dc2626" }}>{icrCalc.passes145 ? "✓ PASS" : "✗ FAIL"}</p>
                        <p style={{ fontSize: 10, color: "#475569" }}>Need {fmt(icrCalc.required145)}/mo</p>
                      </div>
                    </div>
                    {!icrCalc.passes125 && (
                      <div style={{ padding: "10px 12px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca" }}>
                        <p style={{ fontSize: 12, color: "#b91c1c", fontWeight: 600 }}>⚠️ This deal fails lender ICR checks at current rent. You need {fmt(icrCalc.required125 - icrCalc.effectiveRent)}/mo more rent, or a lower mortgage.</p>
                      </div>
                    )}
                    {icrCalc.passes125 && !icrCalc.passes145 && (
                      <div style={{ padding: "10px 12px", borderRadius: 10, background: "#fffbeb", border: "1px solid #fde68a" }}>
                        <p style={{ fontSize: 12, color: "#92400e", fontWeight: 600 }}>⚠️ Passes basic rate but fails higher rate / company ICR. Increase rent by {fmt(icrCalc.required145 - icrCalc.effectiveRent)}/mo to pass 1.45x.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── 5-YEAR PROJECTION TAB ─────────────────────── */}
              {activeSection === "projection" && (
                <div className="bg-white rounded-2xl border border-navy-100 p-5">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h4 className="font-bold text-navy-800 text-sm">5-Year Projection</h4>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="text-xs text-navy-500">Growth:</span>
                      <select value={capitalGrowthPct} onChange={e => setCapGrowth(signed(e.target.value))} className="text-xs font-semibold border border-navy-200 rounded-lg px-2 py-1 bg-white focus:outline-none">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(v => <option key={v} value={v}>{v}%/yr</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          {["Year", "Property Value", "Net Income", "Cumul. Income", "Equity", "Total Gain"].map(h => (
                            <th key={h} style={{ textAlign: "right", padding: "6px 8px", borderBottom: "2px solid #e2e8f0", color: "#475569", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {projection.map((row, i) => (
                          <tr key={row.yr} style={{ background: i % 2 === 0 ? "#f8f9fc" : "white" }}>
                            <td style={{ padding: "8px", borderBottom: "1px solid #e2e8f0", fontWeight: 700, color: "#0f1b36", textAlign: "right" }}>Yr {row.yr}</td>
                            <td style={{ padding: "8px", borderBottom: "1px solid #e2e8f0", textAlign: "right", color: "#374151" }}>{fmt(row.capitalValue)}</td>
                            <td style={{ padding: "8px", borderBottom: "1px solid #e2e8f0", textAlign: "right", color: calc.netIncome >= 0 ? "#15803d" : "#dc2626" }}>{fmt(calc.netIncome)}</td>
                            <td style={{ padding: "8px", borderBottom: "1px solid #e2e8f0", textAlign: "right", color: "#374151" }}>{fmt(row.cumulativeIncome)}</td>
                            <td style={{ padding: "8px", borderBottom: "1px solid #e2e8f0", textAlign: "right", color: "#374151" }}>{fmt(row.equity)}</td>
                            <td style={{ padding: "8px", borderBottom: "1px solid #e2e8f0", textAlign: "right", fontWeight: 700, color: row.totalWealth >= 0 ? "#15803d" : "#dc2626" }}>{fmt(row.totalWealth)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-navy-400 mt-3">Total Gain = cumulative net income + equity growth − cash invested. Assumes constant rent and expenses.</p>
                </div>
              )}

              {/* ── TAX IMPACT TAB ────────────────────────────── */}
              {activeSection === "tax" && (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-navy-100 p-5">
                    <h4 className="font-bold text-navy-800 text-sm mb-4">Section 24 Tax Impact</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Basic rate (20%)", net: taxAnalysis.basicNet, tax: taxAnalysis.basicTax, note: "Full mortgage interest deductible via 20% credit" },
                        { label: "Higher rate (40%)", net: taxAnalysis.higherNet, tax: taxAnalysis.higherTax, note: "S24 restricts interest relief — only 20% credit" },
                        { label: "Ltd company (CT)", net: taxAnalysis.companyNet, tax: taxAnalysis.companyTax, note: "Full mortgage interest deductible. CT 19%–25% via marginal relief" },
                      ].map((t, i) => (
                        <div key={t.label} style={{ padding: "14px 12px", borderRadius: 14, border: "1.5px solid", borderColor: i === 2 ? "#bbf7d0" : i === 1 ? "#fde68a" : "#e2e8f0", background: i === 2 ? "#f0fdf4" : "#f8f9fc", textAlign: "center" }}>
                          <p style={{ fontSize: 11, fontWeight: 600, color: "#475569", marginBottom: 8 }}>{t.label}</p>
                          <p style={{ fontSize: 20, fontWeight: 800, color: t.net > 0 ? "#0f1b36" : "#dc2626" }}>{fmt(t.net)}</p>
                          <p style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>net/yr after tax</p>
                          <p style={{ fontSize: 12, fontWeight: 600, color: "#b91c1c", marginTop: 6 }}>Tax: {fmt(t.tax)}</p>
                          <p style={{ fontSize: 10, color: "#475569", marginTop: 6, lineHeight: 1.4 }}>{t.note}</p>
                        </div>
                      ))}
                    </div>
                    {taxAnalysis.higherNet < taxAnalysis.companyNet && (
                      <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 12, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
                        <p style={{ fontSize: 13, color: "#1d4ed8", fontWeight: 600 }}>
                          💡 As a higher-rate taxpayer, a limited company structure could save you <strong>{fmt(taxAnalysis.companyNet - taxAnalysis.higherNet)}</strong>/year in tax on this property.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="bg-white rounded-2xl border border-navy-100 p-5">
                    <h4 className="font-bold text-navy-800 text-sm mb-3">After-tax monthly income</h4>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      {[
                        { label: "Basic rate", value: taxAnalysis.basicNet / 12 },
                        { label: "Higher rate", value: taxAnalysis.higherNet / 12 },
                        { label: "Ltd company", value: taxAnalysis.companyNet / 12 },
                      ].map(t => (
                        <div key={t.label} style={{ padding: "12px", borderRadius: 12, background: "#f8f9fc" }}>
                          <p className="text-xs text-navy-400 mb-1">{t.label}</p>
                          <p className={`text-xl font-extrabold ${t.value >= 0 ? "text-navy-800" : "text-red-600"}`}>{fmt(t.value)}/mo</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── BRRR REFINANCE TAB ────────────────────────── */}
              {activeSection === "brrr" && (
                <div className="space-y-4">

                  {/* Bridging Loan Toggle */}
                  <div className="bg-white rounded-2xl border border-navy-100 p-5">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <h4 className="font-bold text-navy-800 text-sm">🌉 Bridging Finance</h4>
                      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                        <input type="checkbox" checked={usesBridging} onChange={e => setUsesBridging(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#c9a84c" }} />
                        <span className="text-sm font-semibold text-navy-700">Use bridging loan</span>
                      </label>
                    </div>
                    {usesBridging && (
                      <>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          <label className="block"><span className="block text-xs text-navy-500 mb-1">Rate %/mo</span><input type="number" min="0" step="0.05" value={bridgingRate} onChange={e => setBridgingRate(nonNegative(e.target.value))} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></label>
                          <label className="block"><span className="block text-xs text-navy-500 mb-1">Term (months)</span><input type="number" min="0" value={bridgingTermMonths} onChange={e => setBridgingTermMonths(nonNegative(e.target.value))} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></label>
                          <label className="block"><span className="block text-xs text-navy-500 mb-1">LTV %</span><input type="number" min="0" value={bridgingLTV} onChange={e => setBridgingLTV(nonNegative(e.target.value))} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></label>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: "Bridge Amount", value: fmt(bridgingCalc.bridgeAmount), note: `${bridgingLTV}% LTV on purchase` },
                            { label: "Monthly Interest", value: fmt(bridgingCalc.monthlyInterest), note: `${bridgingRate}% per month` },
                            { label: "Total Interest Cost", value: fmt(bridgingCalc.totalInterest), note: `Over ${bridgingTermMonths} months`, highlight: true },
                            { label: "Cash Required", value: fmt(bridgingCalc.cashRequired), note: "Down payment + refurb + costs" },
                            { label: "Exit Loan (75% ARV)", value: fmt(bridgingCalc.exitLoan), note: "Refinance amount" },
                            { label: "Cash Released", value: fmt(Math.max(0, bridgingCalc.cashReleased)), note: "Net capital returned", highlight: bridgingCalc.cashReleased > 0 },
                          ].map(s => (
                            <div key={s.label} style={{ padding: "12px", borderRadius: 10, background: s.highlight ? "#f0fdf4" : "#f8f9fc", border: `1.5px solid ${s.highlight ? "#bbf7d0" : "#e2e8f0"}` }}>
                              <p style={{ fontSize: 10, color: "#475569", marginBottom: 3 }}>{s.label}</p>
                              <p style={{ fontSize: 17, fontWeight: 800, color: s.highlight ? "#15803d" : "#0f1b36" }}>{s.value}</p>
                              <p style={{ fontSize: 10, color: "#475569" }}>{s.note}</p>
                            </div>
                          ))}
                        </div>
                        {bridgingCalc.netCashLeft < 0 && (
                          <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 10, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                            <p style={{ fontSize: 13, color: "#15803d", fontWeight: 600 }}>✅ Full BRRR recycle! Cash released ({fmt(bridgingCalc.cashReleased)}) exceeds cash invested ({fmt(bridgingCalc.cashRequired)}) — <strong>infinite ROI</strong> on this deal.</p>
                          </div>
                        )}
                      </>
                    )}
                    {!usesBridging && <p className="text-xs text-navy-400">Toggle on to model your BRRR purchase with bridging finance before refinancing onto a BTL mortgage.</p>}
                  </div>

                  <div className="bg-white rounded-2xl border border-navy-100 p-5">
                    <h4 className="font-bold text-navy-800 text-sm mb-1">BRRR Refinance Analysis</h4>
                    <p className="text-xs text-navy-400 mb-4">Refinance at 75% LTV on after-refurb value</p>
                    {afterRefurbValue <= purchasePrice + refurbCost ? (
                      <div style={{ padding: "16px", borderRadius: 12, background: "#fef2f2", border: "1px solid #fecaca", textAlign: "center" }}>
                        <p style={{ fontSize: 14, color: "#b91c1c", fontWeight: 600 }}>⚠️ No equity gain — ARV must exceed (purchase price + refurb cost) to benefit from BRRR refinance.</p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: "ARV (75% LTV loan)", value: fmt(brrrCalc.refiLoan), note: "New mortgage amount" },
                            { label: "Original loan",       value: fmt(brrrCalc.originalLoan), note: "Current mortgage" },
                            { label: "Capital released",   value: fmt(brrrCalc.moneyOut), note: "Cash back in your pocket", highlight: brrrCalc.moneyOut > 0 },
                            { label: "Cash left in deal",  value: fmt(Math.max(0, brrrCalc.cashLeft)), note: "Remaining skin in game" },
                            { label: "New monthly mtg",    value: fmt2(brrrCalc.newMtg), note: "After refinance" },
                            { label: "New cash flow",      value: `${fmt(brrrCalc.newNetIncome)}/mo`, note: "After new mortgage", highlight: brrrCalc.newNetIncome > 0 },
                          ].map(s => (
                            <div key={s.label} style={{ padding: "14px 12px", borderRadius: 12, background: s.highlight ? "#f0fdf4" : "#f8f9fc", border: `1.5px solid ${s.highlight ? "#bbf7d0" : "#e2e8f0"}` }}>
                              <p style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>{s.label}</p>
                              <p style={{ fontSize: 18, fontWeight: 800, color: s.highlight ? "#15803d" : "#0f1b36" }}>{s.value}</p>
                              <p style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{s.note}</p>
                            </div>
                          ))}
                        </div>
                        <div style={{ marginTop: 16, padding: "14px", borderRadius: 12, background: "#0f1b36", color: "white" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>New Cash-on-Cash Return</p>
                              <p style={{ fontSize: 28, fontWeight: 800, color: brrrCalc.newCoC === Infinity ? "#c9a84c" : brrrCalc.newCoC > 15 ? "#4ade80" : "white" }}>
                                {brrrCalc.newCoC === Infinity ? "∞" : `${brrrCalc.newCoC.toFixed(1)}%`}
                              </p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.58)" }}>vs original</p>
                              <p style={{ fontSize: 20, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>{calc.cashOnCash.toFixed(1)}%</p>
                            </div>
                          </div>
                        </div>
                        {brrrCalc.moneyOut > 0 && (
                          <div style={{ padding: "12px 14px", borderRadius: 12, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
                            <p style={{ fontSize: 13, color: "#1d4ed8" }}>💡 BRRR releases <strong>{fmt(brrrCalc.moneyOut)}</strong> of your capital — enough to fund {Math.floor(brrrCalc.moneyOut / calc.totalCashIn * 10) / 10} more deals of the same size.</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* Related */}
      <section className="bg-white section-padding">
        <div className="container-max px-4 max-w-4xl">
          <h2 className="text-xl font-bold text-navy-800 mb-6 text-center">Go deeper</h2>
          <div className="grid sm:grid-cols-4 gap-3">
            {[
              { href: "/calculators/rental-yield", label: "Rental Yield" },
              { href: "/calculators/brrr", label: "BRRR Calculator" },
              { href: "/calculators/section-24", label: "Section 24" },
              { href: "/calculators/capital-gains-tax", label: "CGT Calculator" },
            ].map(l => (
              <Link key={l.href} href={l.href} className="block bg-navy-50 rounded-2xl p-4 card-hover text-center">
                <p className="font-semibold text-navy-800 text-sm">{l.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-50 section-padding">
        <div className="container-max max-w-3xl px-4">
          <GuaranteedRentCTA context="deal" />
          <FAQSchema faqs={faqs} />
          <Disclaimer type="financial" />
        </div>
      </section>

      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-3xl space-y-6 text-navy-700 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-navy-800">How to Analyse a Property Deal Properly</h2>
          <p>Most amateur investors make a decision based on asking price alone. Professional investors build a full deal model — purchase costs, refurb, finance, running costs, rental income, void assumptions, and exit strategy — before they even view the property. This calculator helps you build that model.</p>
          <p>The key metrics to focus on: <strong>net yield</strong> (annual profit ÷ total invested), <strong>monthly cash flow</strong> (rent minus all costs including mortgage), and <strong>ROI</strong> which factors in capital appreciation alongside income.</p>
          <h3 className="font-bold text-navy-800">What Is a Good Deal?</h3>
          <p>For a standard buy-to-let, most experienced investors require a minimum 6% net yield and positive monthly cash flow after all costs. Below this, the risk-adjusted return rarely justifies tying up capital. In the Midlands and North, deals with 8-12% net yield and £200-500/month positive cash flow exist — these are the benchmarks worth targeting.</p>
          <h3 className="font-bold text-navy-800">Don't Forget Acquisition Costs</h3>
          <p>Total investment includes: deposit, stamp duty (5% surcharge on additional properties), legal fees (£1,000-£2,500), survey (£300-£700), mortgage arrangement fee, refurbishment, and initial furnishing. Missing any of these inflates your apparent ROI — this calculator captures all of them.</p>
          <h3 className="font-bold text-navy-800">Model Void Periods Realistically</h3>
          <p>Assuming 100% occupancy is the most common mistake in property analysis. A 5% void allowance (about 2.5 weeks/year) is conservative and realistic for well-located properties. HMOs and short-lets can have higher voids. Baking in realistic voids shows what the deal actually returns in the real world.</p>
          <div className="pt-4 border-t border-navy-200">
            <p className="font-bold text-navy-800 mb-3 text-sm">Related Tools & Guides</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
              <Link href="/calculators/rental-yield" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Rental Yield</p><p className="text-xs text-navy-400 mt-0.5">Yield check</p></Link>
              <Link href="/calculators/hmo-yield" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">HMO Yield</p><p className="text-xs text-navy-400 mt-0.5">HMO returns</p></Link>
              <Link href="/calculators/bridging" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Bridging Loan</p><p className="text-xs text-navy-400 mt-0.5">Finance costs</p></Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/blog/brrr-strategy-explained" className="group block bg-white rounded-lg border border-navy-100 p-3 hover:shadow-md transition-all"><span className="text-xs font-bold text-gold-600">Guide</span><p className="font-bold text-navy-800 text-xs group-hover:text-gold-600 mt-0.5">BRRR Strategy Explained</p></Link>
              <Link href="/blog/hmo-investing-uk" className="group block bg-white rounded-lg border border-navy-100 p-3 hover:shadow-md transition-all"><span className="text-xs font-bold text-gold-600">Guide</span><p className="font-bold text-navy-800 text-xs group-hover:text-gold-600 mt-0.5">HMO Investing UK</p></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}