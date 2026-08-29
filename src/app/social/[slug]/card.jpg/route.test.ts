import { describe, it, expect } from "vitest";
import { GET, generateStaticParams } from "./route";
import { SOCIAL_CARDS } from "@/lib/social-cards";

const call = (slug: string) =>
  GET(new Request("http://localhost"), { params: Promise.resolve({ slug }) });

describe("the Instagram card route", () => {
  // Meta fetches this URL itself and rejects anything that is not a JPEG, so
  // a PNG here would fail at container creation with an opaque 400.
  it("returns a real JPEG for every card in the catalogue", async () => {
    for (const c of SOCIAL_CARDS) {
      const res = await call(c.slug);
      expect(res.status, c.slug).toBe(200);
      expect(res.headers.get("Content-Type"), c.slug).toBe("image/jpeg");

      const buf = Buffer.from(await res.arrayBuffer());
      // JPEG magic number. Catches a PNG slipping through the conversion.
      expect(buf[0], c.slug).toBe(0xff);
      expect(buf[1], c.slug).toBe(0xd8);
      expect(buf.length, c.slug).toBeGreaterThan(10_000);
    }
  }, 120_000);

  it("404s an unknown slug rather than rendering an empty card", async () => {
    expect((await call("no-such-card")).status).toBe(404);
  });

  it("pre-renders exactly the catalogue", () => {
    expect(generateStaticParams().map(p => p.slug)).toEqual(SOCIAL_CARDS.map(c => c.slug));
  });
});
