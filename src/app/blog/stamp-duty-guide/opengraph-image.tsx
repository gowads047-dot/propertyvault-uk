import { blogOgImage, ogSize } from "@/lib/og-blog";

export const runtime = "edge";
export const alt = "Stamp Duty UK — Complete Guide — PropertyVault UK";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  return blogOgImage("Stamp Duty UK — Complete Guide", "Finance", "June 2026");
}
