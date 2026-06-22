import { blogOgImage, ogSize } from "@/lib/og-blog";

export const runtime = "edge";
export const alt = "The Biggest Financial Lie in Britain — PropertyVault UK";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  return blogOgImage("The Biggest Financial Lie in Britain", "Opinion", "June 2026");
}
