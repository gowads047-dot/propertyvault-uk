import { describe, it, expect } from "vitest";
import { bearerToken } from "./server-auth";

const req = (authorization?: string) =>
  new Request("https://example.test/api/thing", authorization ? { headers: { authorization } } : {});

const JWT = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.c2lnbmF0dXJl";

/**
 * The token is only ever a candidate here — getUser() asks the auth server
 * whether it is real. This is the cheap filter in front of that: it keeps
 * obvious rubbish from becoming a network call, and makes sure a header that
 * is not a bearer token is treated as no token at all rather than as one.
 */
describe("reading a bearer token from a request", () => {
  it("takes the token out of a well-formed header", () => {
    expect(bearerToken(req(`Bearer ${JWT}`))).toBe(JWT);
  });

  it("accepts the scheme in any case, and tolerates spacing", () => {
    expect(bearerToken(req(`bearer ${JWT}`))).toBe(JWT);
    expect(bearerToken(req(`  Bearer   ${JWT}  `))).toBe(JWT);
  });

  it("returns null when there is no header at all", () => {
    expect(bearerToken(req())).toBeNull();
    expect(bearerToken(undefined)).toBeNull();
  });

  it("refuses a header that is not a bearer token", () => {
    for (const bad of ["", "Basic abc", "Bearer", "Bearer ", JWT, `Token ${JWT}`]) {
      expect(bearerToken(req(bad)), JSON.stringify(bad)).toBeNull();
    }
  });

  // Not a signature check — that is the auth server's job — just a shape check
  // so nonsense does not become a round trip.
  it("refuses something that is not shaped like a JWT", () => {
    for (const bad of ["Bearer not-a-jwt", "Bearer a.b", "Bearer a.b.c.d", "Bearer ..", "Bearer a b c"]) {
      expect(bearerToken(req(bad)), bad).toBeNull();
    }
  });
});
