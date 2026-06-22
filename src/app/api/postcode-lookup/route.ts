import { NextResponse } from "next/server";

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("postcode") ?? "";
  const postcode = raw.replace(/\s+/g, "").toUpperCase();

  if (!postcode) {
    return NextResponse.json({ error: "No postcode provided" }, { status: 400 });
  }

  try {
    // ── 1. Postcodes.io ───────────────────────────────────
    const pcRes = await fetch(`https://api.postcodes.io/postcodes/${postcode}`, {
      next: { revalidate: 86400 },
    });
    const pcJson = await pcRes.json();

    if (pcJson.status !== 200 || !pcJson.result) {
      return NextResponse.json({ error: "Invalid or unknown postcode" }, { status: 404 });
    }

    const {
      latitude, longitude, region, admin_district: district,
      parliamentary_constituency: constituency, admin_ward: ward,
      admin_county: county,
    } = pcJson.result;

    // ── 2. Crime data (last full month) ──────────────────
    const crimeDate = getPreviousMonth();
    let crimeCategories: Record<string, number> = {};
    let crimeTotal = 0;
    try {
      const crimeRes = await fetch(
        `https://data.police.uk/api/crimes-street/all-crime?lat=${latitude}&lng=${longitude}&date=${crimeDate}`,
        { next: { revalidate: 3600 } }
      );
      if (crimeRes.ok) {
        const crimes: { category: string }[] = await crimeRes.json();
        crimeTotal = crimes.length;
        for (const c of crimes) {
          crimeCategories[c.category] = (crimeCategories[c.category] ?? 0) + 1;
        }
      }
    } catch {
      // Crime data is optional — don't fail the whole request
    }

    const crimeLevel =
      crimeTotal < 15 ? "Low" :
      crimeTotal < 40 ? "Medium" :
      crimeTotal < 80 ? "High" : "Very High";

    const crimeColor =
      crimeLevel === "Low"      ? "#16a34a" :
      crimeLevel === "Medium"   ? "#d97706" :
      crimeLevel === "High"     ? "#ea580c" : "#dc2626";

    // Top crime categories
    const topCrimes = Object.entries(crimeCategories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cat, count]) => ({ label: CRIME_LABELS[cat] ?? cat, count }));

    // ── 3. Land Registry recent sales ────────────────────
    let recentSales: Sale[] = [];
    let avgPrice = 0;
    try {
      const lrRes = await fetch(
        `https://landregistry.data.gov.uk/data/ppi/transaction-record.json?propertyAddress.postcode=${encodeURIComponent(postcode.slice(0, -3) + " " + postcode.slice(-3))}&_pageSize=20&_sort=-transactionDate`,
        { headers: { Accept: "application/json" }, next: { revalidate: 86400 } }
      );
      if (lrRes.ok) {
        const lrJson = await lrRes.json();
        const items = lrJson?.result?.items ?? [];
        recentSales = items.slice(0, 8).map((item: LRItem) => ({
          date:     item.transactionDate?.slice(0, 10) ?? "",
          price:    item.pricePaid ?? 0,
          type:     PROP_TYPES[item.propertyType ?? ""] ?? item.propertyType ?? "Property",
          tenure:   item.estateType === "L" ? "Leasehold" : "Freehold",
          address:  [item.paon, item.saon, item.street].filter(Boolean).join(" ").toUpperCase(),
          newBuild: item.newBuild === "Y",
        }));
        if (items.length > 0) {
          const prices = items.map((i: LRItem) => i.pricePaid ?? 0).filter(Boolean);
          avgPrice = prices.length ? Math.round(prices.reduce((a: number, b: number) => a + b, 0) / prices.length) : 0;
        }
      }
    } catch {
      // Sales data is optional
    }

    const suggestedCity = REGION_TO_CITY[region] ?? "nottingham";

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

interface LRItem {
  transactionDate?: string;
  pricePaid?: number;
  propertyType?: string;
  estateType?: string;
  newBuild?: string;
  paon?: string;
  saon?: string;
  street?: string;
}

interface Sale {
  date: string;
  price: number;
  type: string;
  tenure: string;
  address: string;
  newBuild: boolean;
}
