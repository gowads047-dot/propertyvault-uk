import { blogOgImage, ogSize } from "@/lib/og-blog";

export const runtime = "edge";
export const alt = "EPC C Deadline — What Landlords Need — PropertyVault UK";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  return blogOgImage("EPC C Deadline — What Landlords Need", "Landlords", "June 2026");
}
