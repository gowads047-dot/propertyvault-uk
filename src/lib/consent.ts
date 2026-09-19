/**
 * The visitor's cookie choice, and what it means to Google's consent mode.
 *
 * "all" is the banner's Accept All and the preferences page's "all": it
 * grants analytics and the three advertising signals — storage, user data,
 * personalisation — because the cookie policy describes Accept All as
 * covering analytics and marketing, and Google Ads conversions and Meta's
 * Conversions API both depend on the ad signals. "essential" denies all
 * four. Nothing else on the site reads or sets the stored value.
 */
export type Consent = "all" | "essential";

export function storedConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem("cookie_consent");
    return v === "all" || v === "essential" ? v : null;
  } catch {
    return null;
  }
}

export function consentSignals(granted: boolean): Record<string, "granted" | "denied"> {
  const v = granted ? "granted" : "denied";
  return { analytics_storage: v, ad_storage: v, ad_user_data: v, ad_personalization: v };
}
