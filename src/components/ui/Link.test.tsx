import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import Link from "./Link";

// What next build defines from next.config.ts (skipTrailingSlashRedirect:
// true). Without it next/link takes its no-config branch and strips the
// slash, which is not the build this site ships.
process.env.__NEXT_MANUAL_TRAILING_SLASH = "true";

/**
 * The wrapper renders the slash; nothing else imports next/link.
 *
 * The first half is what a crawler sees. The second is belt and braces on
 * the eslint rule: lint is run per file on Windows and can be skipped, this
 * cannot.
 */
describe("Link", () => {
  it("renders an internal href with its trailing slash", () => {
    expect(renderToStaticMarkup(<Link href="/blog">Blog</Link>)).toContain('href="/blog/"');
    expect(renderToStaticMarkup(<Link href="/makan?type=flat">Flats</Link>)).toContain('href="/makan/?type=flat"');
    expect(renderToStaticMarkup(<Link href={{ pathname: "/areas", query: { q: "b1" } }}>Areas</Link>)).toContain('href="/areas/?q=b1"');
  });

  it("leaves the root and external links as written", () => {
    expect(renderToStaticMarkup(<Link href="/">Home</Link>)).toContain('href="/"');
    expect(renderToStaticMarkup(<Link href="https://example.com/x">Out</Link>)).toContain('href="https://example.com/x"');
  });

  it("is the only file that imports next/link", () => {
    const root = join(process.cwd(), "src");
    const offenders = readdirSync(root, { recursive: true, encoding: "utf8" })
      .filter(p => /\.tsx?$/.test(p) && !p.includes(".test."))
      .filter(p => /from\s+["']next\/link["']/.test(readFileSync(join(root, p), "utf8")))
      .map(p => p.split("\\").join("/"));
    expect(offenders).toEqual(["components/ui/Link.tsx"]);
  });
});
