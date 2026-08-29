import { describe, it, expect } from "vitest";
import { GET, generateStaticParams } from "./route";
import { SOCIAL_CARDS } from "@/lib/social-cards";
import { autopsyFaces } from "@/lib/autopsy";

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

  // A slide missing from here is a slide Meta cannot fetch, which fails the
  // whole carousel rather than just that image.
  it("pre-renders every standalone card and every carousel slide", () => {
    const slugs = generateStaticParams().map(p => p.slug);
    for (const c of SOCIAL_CARDS) expect(slugs, c.slug).toContain(c.slug);
    for (const slug of autopsyFaces().keys()) expect(slugs, slug).toContain(slug);
    expect(new Set(slugs).size, "no duplicate slugs").toBe(slugs.length);
  });

  it("renders every autopsy slide as a JPEG too", async () => {
    for (const slug of autopsyFaces().keys()) {
      const res = await call(slug);
      expect(res.status, slug).toBe(200);
      const buf = Buffer.from(await res.arrayBuffer());
      expect(buf[0], slug).toBe(0xff);
      expect(buf[1], slug).toBe(0xd8);
    }
  }, 180_000);
});
