import { NextResponse } from "next/server";

// ONS Private Rental Market Statistics 2024 — median monthly rents by region & bedrooms
const RENTAL_BY_REGION: Record<string, { studio: number; oneBed: number; twoBed: number; threeBed: number; fourBed: number; demand: string; trend: string }> = {
  "London":                     { studio: 1425, oneBed: 1825, twoBed: 2250, threeBed: 2800, fourBed: 3700, demand: "Very High", trend: "+4.2% YoY" },
  "South East":                 { studio: 950,  oneBed: 1100, twoBed: 1350, threeBed: 1700, fourBed: 2200, demand: "High",      trend: "+3.8% YoY" },
  "East of England":            { studio: 800,  oneBed: 950,  twoBed: 1150, threeBed: 1400, fourBed: 1800, demand: "High",      trend: "+3.5% YoY" },
  "South West":                 { studio: 750,  oneBed: 850,  twoBed: 1050, threeBed: 1300, fourBed: 1650, demand: "Medium",    trend: "+3.1% YoY" },
  "West Midlands":              { studio: 600,  oneBed: 700,  twoBed: 875,  threeBed: 1050, fourBed: 1350, demand: "High",      trend: "+4.5% YoY" },
  "East Midlands":              { studio: 575,  oneBed: 650,  twoBed: 800,  threeBed: 950,  fourBed: 1200, demand: "Medium",    trend: "+3.9% YoY" },
  "North West":                 { studio: 575,  oneBed: 700,  twoBed: 875,  threeBed: 1025, fourBed: 1300, demand: "High",      trend: "+4.8% YoY" },
  "Yorkshire and The Humber":   { studio: 525,  oneBed: 625,  twoBed: 750,  threeBed: 900,  fourBed: 1150, demand: "Medium",    trend: "+3.6% YoY" },
  "North East":                 { studio: 475,  oneBed: 550,  twoBed: 675,  threeBed: 800,  fourBed: 1000, demand: "Medium",    trend: "+3.2% YoY" },
  "Wales":                      { studio: 525,  oneBed: 625,  twoBed: 775,  threeBed: 925,  fourBed: 1150, demand: "Medium",    trend: "+3.4% YoY" },
  "Scotland":                   { studio: 650,  oneBed: 775,  twoBed: 975,  threeBed: 1175, fourBed: 1500, demand: "High",      trend: "+5.1% YoY" },
};
const DEFAULT_RENTAL = { studio: 600, oneBed: 700, twoBed: 875, threeBed: 1050, fourBed: 1350, demand: "Medium", trend: "+3.5% YoY" };

// Map UK regions to our benchmark city keys
const REGION_TO_CITY: Record<string, string> = {
  "West Midlands":      "birmingham",
  "East Midlands":      "nottingham",
  "Yorkshire and The Humber": "leeds",
  "North West":         "manchester",
  "London":             "london",
  "South East":         "london",
  "South West":         "london",
  "East of England":    "london",
  "North East":         "sheffield",
};

// Crime category display names
const CRIME_LABELS: Record<string, string> = {
  "anti-social-behaviour":    "Anti-social behaviour",
  "burglary":                 "Burglary",
  "criminal-damage-arson":    "Criminal damage",
  "drugs":                    "Drugs",
  "possession-of-weapons":    "Weapons",
  "public-order":             "Public order",
  "robbery":                  "Robbery",
  "shoplifting":              "Shoplifting",
  "theft-from-the-person":    "Theft",
  "vehicle-crime":            "Vehicle crime",
  "violent-crime":            "Violent crime",
  "other-crime":              "Other",
  "other-theft":              "Other theft",
};

// Fetch with a hard timeout so we don't hit Vercel's 10s serverless limit
async function fetchWithTimeout(url: string, options: RequestInit & { next?: { revalidate?: number } } = {}, timeoutMs = 5000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("postcode") ?? "";
  const postcode = raw.replace(/\s+/g, "").toUpperCase();

  if (!postcode) {
    return NextResponse.json({ error: "No postcode provided" }, { status: 400 });
  }

  try {
    // ── 1. Postcodes.io (required) ────────────────────────
    const pcRes = await fetchWithTimeout(
      `https://api.postcodes.io/postcodes/${postcode}`,
      {},
      6000
    );
    const pcJson = await pcRes.json();

    if (pcJson.status !== 200 || !pcJson.result) {
      return NextResponse.json({ error: "Invalid or unknown postcode" }, { status: 404 });
    }

    const {
      latitude, longitude, region, admin_district: district,
      parliamentary_constituency: constituency, admin_ward: ward,
      admin_county: county,
    } = pcJson.result;

    // ── 2. Crime data (optional, 4s timeout) ─────────────
    const crimeDate = getPreviousMonth();
    let crimeCategories: Record<string, number> = {};
    let crimeTotal = 0;
    try {
      const crimeRes = await fetchWithTimeout(
        `https://data.police.uk/api/crimes-street/all-crime?lat=${latitude}&lng=${longitude}&date=${crimeDate}`,
        {},
        4000
      );
      if (crimeRes.ok) {
        const crimes: { category: string }[] = await crimeRes.json();
        crimeTotal = crimes.length;
        for (const c of crimes) {
          crimeCategories[c.category] = (crimeCategories[c.category] ?? 0) + 1;
        }
      }
    } catch {
      // Crime data is optional — silently skip on timeout/error
    }

    const crimeLevel =
      crimeTotal < 15 ? "Low" :
      crimeTotal < 40 ? "Medium" :
      crimeTotal < 80 ? "High" : "Very High";

    const crimeColor =
      crimeLevel === "Low"      ? "#16a34a" :
      crimeLevel === "Medium"   ? "#d97706" :
      crimeLevel === "High"     ? "#ea580c" : "#dc2626";

    const topCrimes = Object.entries(crimeCategories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cat, count]) => ({ label: CRIME_LABELS[cat] ?? cat, count }));

    // ── 3. Land Registry recent sales (optional, 4s timeout) ──
    let recentSales: Sale[] = [];
    let avgPrice = 0;
    try {
      const formattedPC = postcode.slice(0, -3) + " " + postcode.slice(-3);
      const lrRes = await fetchWithTimeout(
        `https://landregistry.data.gov.uk/data/ppi/transaction-record.json?propertyAddress.postcode=${encodeURIComponent(formattedPC)}&_pageSize=20&_sort=-transactionDate`,
        { headers: { Accept: "application/json" } },
        4000
      );
      if (lrRes.ok) {
        const lrJson = await lrRes.json();
        const items = lrJson?.result?.items ?? [];
        recentSales = items.slice(0, 8).map((item: LRItem) => {
          const propType = str(item.propertyType);
          const estate   = str(item.estateType);
          return {
            date:     isoDate(item.transactionDate),
            price:    num(item.pricePaid),
            type:     (PROP_TYPES[propType] ?? propType) || "Property",
            tenure:   estate === "L" ? "Leasehold" : "Freehold",
            address:  [str(item.paon), str(item.saon), str(item.street)].filter(Boolean).join(" ").toUpperCase(),
            newBuild: str(item.newBuild) === "Y",
          };
        });
        if (items.length > 0) {
          const prices = items.map((i: LRItem) => num(i.pricePaid)).filter(Boolean);
          avgPrice = prices.length ? Math.round((prices as number[]).reduce((a, b) => a + b, 0) / prices.length) : 0;
        }
      }
    } catch {
      // Sales data is optional — silently skip on timeout/error
    }

    const suggestedCity = REGION_TO_CITY[region] ?? "nottingham";
    const rentalData = RENTAL_BY_REGION[region] ?? DEFAULT_RENTAL;

    // Estimate gross yield range using avg sold price vs 2-bed rent
    const yieldLow = avgPrice > 0 ? ((rentalData.twoBed * 12) / avgPrice * 100).toFixed(1) : null;
    const yieldHigh = avgPrice > 0 ? ((rentalData.threeBed * 12) / avgPrice * 100).toFixed(1) : null;

    return NextResponse.json({
      postcode: postcode.slice(0, -3) + " " + postcode.slice(-3),
      region: region ?? "Unknown",
      district: district ?? "",
      county: county ?? "",
      ward: ward ?? "",
      constituency: constituency ?? "",
      lat: latitude,
      lng: longitude,
      crime: { total: crimeTotal, level: crimeLevel, color: crimeColor, month: crimeDate, topCategories: topCrimes },
      sales: { recent: recentSales, avgPrice },
      rental: {
        studio: rentalData.studio,
        oneBed: rentalData.oneBed,
        twoBed: rentalData.twoBed,
        threeBed: rentalData.threeBed,
        fourBed: rentalData.fourBed,
        demand: rentalData.demand,
        trend: rentalData.trend,
        yieldRangeLow: yieldLow,
        yieldRangeHigh: yieldHigh,
      },
      suggestedCity,
    });
  } catch (err) {
    console.error("Postcode lookup error:", err);
    return NextResponse.json({ error: "Lookup failed — please try again" }, { status: 500 });
  }
}

function getPreviousMonth(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - 2);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const PROP_TYPES: Record<string, string> = {
  D: "Detached", S: "Semi-detached", T: "Terraced", F: "Flat/Maisonette",
};

// Land Registry returns JSON-LD — values can be strings, numbers, or nested objects
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LRVal = any;

// Recursively extract a plain string from any JSON-LD value
function str(v: LRVal): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (typeof v !== "object") return String(v);
  // Try common JSON-LD patterns in order of preference
  if (typeof v._value === "string") return v._value;
  if (typeof v._value === "number") return String(v._value);
  if (typeof v.label === "string") return v.label;
  if (typeof v.label === "object") return str(v.label);
  if (typeof v.prefLabel === "string") return v.prefLabel;
  if (typeof v.prefLabel === "object") return str(v.prefLabel);
  if (typeof v._about === "string") {
    // Extract last path segment from URI as fallback
    return v._about.split("/").pop() ?? "";
  }
  return "";
}

function num(v: LRVal): number {
  if (v === null || v === undefined) return 0;
  if (typeof v === "number") return v;
  const s = str(v);
  return s ? parseFloat(s) || 0 : 0;
}

// Parse any date value to ISO YYYY-MM-DD
function isoDate(v: LRVal): string {
  const s = str(v);
  if (!s) return "";
  // Already ISO
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  // Try native Date parse (handles "Mon, 28 Jul 2023 ...")
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return s.slice(0, 10);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LRItem = Record<string, any>;

interface Sale {
  date: string;
  price: number;
  type: string;
  tenure: string;
  address: string;
  newBuild: boolean;
}
