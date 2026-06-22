import { blogOgImage, ogSize } from "@/lib/og-blog";

export const runtime = "edge";
export const alt = "UK Property Market 2026 — PropertyVault UK";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  return blogOgImage("UK Property Market 2026", "Market", "June 2026");
}
