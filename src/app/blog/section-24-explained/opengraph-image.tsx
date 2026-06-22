import { blogOgImage, ogSize } from "@/lib/og-blog";

export const runtime = "edge";
export const alt = "Section 24 — How It Affects Your Tax — PropertyVault UK";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  return blogOgImage("Section 24 — How It Affects Your Tax", "Tax", "June 2026");
}
