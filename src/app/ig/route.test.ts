import { describe, it, expect } from "vitest";
import { GET, LANDING, SOURCE_COOKIE } from "./route";

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

  it("sets the acquisition cookie for thirty days, site-wide, Secure and Lax", () => {
    const cookie = GET().headers.get("set-cookie")!;
    expect(cookie).toContain(`${SOURCE_COOKIE}=instagram`);
    expect(cookie).toContain("Path=/");
    expect(cookie).toContain(`Max-Age=${30 * 86_400}`);
    expect(cookie).toMatch(/SameSite=Lax/i);
    expect(cookie).toContain("Secure");
    expect(cookie).toContain("HttpOnly");
  });

  // A 308 is cached by the browser; the cookie would then be set exactly once.
  it("is not a permanent redirect", () => {
    expect(GET().status).not.toBe(308);
  });
});
