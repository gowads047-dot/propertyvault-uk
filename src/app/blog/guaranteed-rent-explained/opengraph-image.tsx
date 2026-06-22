import { blogOgImage, ogSize } from "@/lib/og-blog";

export const runtime = "edge";
export const alt = "Guaranteed Rent — Is It Worth It? — PropertyVault UK";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  return blogOgImage("Guaranteed Rent — Is It Worth It?", "Landlords", "June 2026");
}
