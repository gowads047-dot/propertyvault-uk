import { describe, it, expect } from "vitest";
import { consentSignals } from "./consent";

describe("consentSignals", () => {
  it("grants or denies analytics and all three advertising signals together", () => {
    expect(consentSignals(true)).toEqual({ analytics_storage: "granted", ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted" });
    expect(consentSignals(false)).toEqual({ analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  });
});
