import { blogOgImage, ogSize } from "@/lib/og-blog";

export const runtime = "edge";
export const alt = "Personal vs Ltd Company for BTL — PropertyVault UK";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  return blogOgImage("Personal vs Ltd Company for BTL", "Tax", "June 2026");
}
