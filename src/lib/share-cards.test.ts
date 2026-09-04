import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, sep } from "node:path";
import { ogImages } from "./site";

/**
 * A page that sets its own openGraph block must supply its own image.
 *
 * Next does not merge openGraph field by field. A page that declares the
 * object gets exactly what it declares and inherits none of the parent's
 * remaining fields — so a page setting title, description and url, and
 * nothing else, silently drops the site's image and appears in WhatsApp,
 * LinkedIn and iMessage as a bare link.
 *
 * Four pages were doing that, including /ask and /vault, and the
 * guaranteed-rent comparison page somebody would actually forward to a
 * landlord. Nothing showed it: the pages rendered correctly, the metadata was
 * valid, and the only symptom was a link that looked like nothing when shared.
 */

const APP = join(process.cwd(), "src", "app");

function pageFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...pageFiles(full));
    else if (entry === "page.tsx") out.push(full);
  }
  return out;
}

const pages = pageFiles(APP);

describe("what a shared link looks like", () => {
  it("finds the pages at all, so a broken walk cannot pass silently", () => {
    expect(pages.length).toBeGreaterThan(50);
  });

  it("gives every page that declares openGraph an image to show", () => {
    const bare = pages
      .filter(f => {
        const src = readFileSync(f, "utf8");
        if (!/openGraph\s*:/.test(src)) return false; // inherits the layout's in full
        if (/images\s*:/.test(src)) return false;
        // A colocated opengraph-image.tsx supplies one automatically.
        return !existsSync(join(dirname(f), "opengraph-image.tsx"));
      })
      .map(f => f.slice(f.indexOf("app")).split(sep).join("/").replace("app", "").replace("/page.tsx", ""));

    expect(bare, `pages that would share as a bare link: ${bare.join(", ")}`).toEqual([]);
  });
});

describe("the share card itself", () => {
  it("points at the site's own generated image, at the size the platforms want", () => {
    const [img] = ogImages("something");
    expect(img.url).toBe("https://www.propertyvaultuk.co.uk/opengraph-image");
    expect(img.width).toBe(1200);
    expect(img.height).toBe(630);
  });

  // The alt text is read aloud by screen readers on every platform that
  // surfaces it, so it has to describe the page, not repeat the brand.
  it("carries the alt text it was given", () => {
    expect(ogImages("Vault a property")[0].alt).toBe("Vault a property");
  });
});
