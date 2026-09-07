import { describe, it, expect } from "vitest";
import { GET, LANDING } from "./route";

describe("the bio link", () => {
  it("redirects temporarily to the home page with Instagram UTM parameters", () => {
    const res = GET();
    expect(res.status).toBe(307);
    const to = new URL(res.headers.get("location")!);
    expect(to.origin + to.pathname).toBe("https://www.propertyvaultuk.co.uk/");
    expect(to.searchParams.get("utm_source")).toBe("instagram");
    expect(to.searchParams.get("utm_medium")).toBe("bio");
    expect(to.searchParams.get("utm_campaign")).toBe("reels");
    expect(res.headers.get("location")).toBe(LANDING);
  });

  /**
   * It used to set pv_src here, unconditionally. Attribution is not strictly
   * necessary, so PECR reg 6 wants consent first — and this redirect runs
   * before the visitor has seen the banner. /cookies did not declare it
   * either. Nothing read it, so it goes until it has both a reader and a
   * consent path; see the note on the route.
   */
  it("sets no cookie, because consent has not been asked for yet", () => {
    const res = GET();
    expect(res.headers.get("set-cookie")).toBeNull();
    expect(res.headers.get("location")).toContain("utm_source=instagram");
  });

  // A 308 is cached by the browser; the cookie would then be set exactly once.
  it("is not a permanent redirect", () => {
    expect(GET().status).not.toBe(308);
  });
});
