import { NextResponse } from "next/server";

function parsePropertyHtml(
  html: string,
  portal: string,
  propertyId: string,
  listingUrl: string,
) {
  let price: number | undefined;
  let bedrooms: number | undefined;
  let bathrooms: number | undefined;
  let propertyType: string | undefined;
  let address: string | undefined;
  let postcode: string | undefined;
  let description: string | undefined;
  let keyFeatures: string[] | undefined;
  let imageUrl: string | undefined;

  // OG title: "3 bedroom semi-detached house for sale in Springfield Road, Nottingham, NG7 1AA | Rightmove"
  const ogTitle =
    html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i)?.[1] ??
    html.match(/<meta\s+content="([^"]+)"\s+property="og:title"/i)?.[1];

  const ogImage =
    html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i)?.[1] ??
    html.match(/<meta\s+content="([^"]+)"\s+property="og:image"/i)?.[1];

  if (ogTitle) {
    const bedsMatch = ogTitle.match(/(\d+)\s+bedroom/i);
    if (bedsMatch) bedrooms = parseInt(bedsMatch[1]);

    const postcodeMatch = ogTitle.match(/([A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2})/i);
    if (postcodeMatch)
      postcode = postcodeMatch[1].replace(/\s+/g, " ").trim().toUpperCase();

    const typeMatch = ogTitle.match(
      /\d+\s+bedroom\s+([^f]+?)\s+for\s+(?:sale|rent)/i,
    );
    if (typeMatch) propertyType = typeMatch[1].trim();

    const addrMatch = ogTitle.match(
      /\bfor\s+(?:sale|rent)\s+in\s+(.+?)(?:\s*\||\s*$)/i,
    );
    if (addrMatch) address = addrMatch[1].trim();
  }

  if (ogImage) imageUrl = ogImage;

  // JSON-LD blocks
  const jsonLdPattern =
    /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = jsonLdPattern.exec(html)) !== null) {
    try {
      const data = JSON.parse(m[1]);
      if (data["@type"] === "Product" || data["@type"] === "RealEstateListing") {
        if (data.offers?.price)
          price = parseInt(String(data.offers.price).replace(/[^0-9]/g, ""));
        if (data.price)
          price = parseInt(String(data.price).replace(/[^0-9]/g, ""));
      }
      if (data.address?.postalCode)
        postcode = data.address.postalCode.toUpperCase();
    } catch {}
  }

  // window.__PRELOADED_STATE__ (Rightmove)
  const preloaded = html.match(
    /window\.__PRELOADED_STATE__\s*=\s*(\{[\s\S]+?\});\s*(?:<\/script>|window\.)/,
  );
  if (preloaded) {
    try {
      const state = JSON.parse(preloaded[1]);
      const pd = state?.propertyData;
      if (pd) {
        if (pd.prices?.primaryPrice)
          price = parseInt(pd.prices.primaryPrice.replace(/[^0-9]/g, ""));
        if (pd.bedrooms) bedrooms = pd.bedrooms;
        if (pd.bathrooms) bathrooms = pd.bathrooms;
        if (pd.propertyType) propertyType = pd.propertyType;
        if (pd.address?.displayAddress) address = pd.address.displayAddress;
        if (pd.address?.outcode) postcode = pd.address.outcode;
        if (pd.text?.description)
          description = pd.text.description.substring(0, 600);
        if (Array.isArray(pd.keyFeatures))
          keyFeatures = pd.keyFeatures.slice(0, 6);
        if (pd.images?.[0]?.srcUrl) imageUrl = pd.images[0].srcUrl;
      }
    } catch {}
  }

  // window.PAGE_MODEL (older Rightmove)
  if (!price) {
    const pageModel = html.match(/window\.PAGE_MODEL\s*=\s*(\{[\s\S]+?\});\s*(?:<\/script>|window\.)/);
    if (pageModel) {
      try {
        const model = JSON.parse(pageModel[1]);
        const prop = model?.propertyData ?? model?.listing;
        if (prop) {
          if (prop.prices?.primaryPrice)
            price = parseInt(prop.prices.primaryPrice.replace(/[^0-9]/g, ""));
          if (prop.bedrooms) bedrooms = prop.bedrooms;
          if (prop.address?.outcode) postcode = prop.address.outcode;
        }
      } catch {}
    }
  }

  // Last-resort: find first prominent price in page (£XXX,XXX)
  if (!price) {
    const priceMatch = html.match(/£([\d,]{5,})/);
    if (priceMatch) price = parseInt(priceMatch[1].replace(/,/g, ""));
  }

  const success = !!(price || bedrooms || postcode);

  return {
    success,
    portal,
    propertyId,
    listingUrl,
    price,
    bedrooms,
    bathrooms,
    propertyType,
    address,
    postcode,
    description,
    keyFeatures,
    imageUrl,
    error: success ? undefined : "Could not read listing details — please enter them manually.",
  };
}

export async function GET(request: Request) {
  const rawUrl = new URL(request.url).searchParams.get("url") ?? "";

  const rmMatch = rawUrl.match(/rightmove\.co\.uk\/properties\/(\d+)/);
  const zoopMatch = rawUrl.match(/zoopla\.co\.uk\/[^?#]+\/details\/(\d+)/);
  const otmMatch = rawUrl.match(/onthemarket\.com\/details\/(\d+)/);

  if (!rmMatch && !zoopMatch && !otmMatch) {
    return NextResponse.json({
      success: false,
      error:
        "URL not recognised. Paste a Rightmove, Zoopla, or OnTheMarket listing link.",
    });
  }

  const portal = rmMatch ? "rightmove" : zoopMatch ? "zoopla" : "onthemarket";
  const propertyId = (rmMatch ?? zoopMatch ?? otmMatch)![1];
  const fetchUrl = rmMatch
    ? `https://www.rightmove.co.uk/properties/${propertyId}`
    : zoopMatch
      ? `https://www.zoopla.co.uk/for-sale/details/${propertyId}/`
      : `https://www.onthemarket.com/details/${propertyId}/`;

  try {
    const res = await fetch(fetchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Upgrade-Insecure-Requests": "1",
        "Cache-Control": "no-cache",
      },
      signal: AbortSignal.timeout(9000),
    });

    if (!res.ok) {
      return NextResponse.json({
        success: false,
        portal,
        propertyId,
        listingUrl: rawUrl,
        error: `Listing unavailable (${res.status}) — enter details manually.`,
      });
    }

    const html = await res.text();
    return NextResponse.json(
      parsePropertyHtml(html, portal, propertyId, rawUrl),
    );
  } catch {
    return NextResponse.json({
      success: false,
      portal,
      propertyId,
      listingUrl: rawUrl,
      error: "Could not reach the listing — enter details manually.",
    });
  }
}
