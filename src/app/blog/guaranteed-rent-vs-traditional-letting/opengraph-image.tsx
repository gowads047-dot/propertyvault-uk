import { blogOgImage, ogSize } from "@/lib/og-blog";

export const runtime = "edge";
export const alt = "Guaranteed Rent vs Traditional Letting — PropertyVault UK";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  return blogOgImage("Guaranteed Rent vs Traditional Letting", "Comparison", "June 2026");
}
