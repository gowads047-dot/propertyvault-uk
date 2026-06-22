import { blogOgImage, ogSize } from "@/lib/og-blog";

export const runtime = "edge";
export const alt = "HMO Investing UK — Still Profitable? — PropertyVault UK";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  return blogOgImage("HMO Investing UK — Still Profitable?", "Investing", "June 2026");
}
