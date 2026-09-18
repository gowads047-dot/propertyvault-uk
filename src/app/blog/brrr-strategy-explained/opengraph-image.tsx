import { blogCard, ogSize } from "@/lib/og-blog";

export const runtime = "edge";
const card = blogCard("brrr-strategy-explained");
export const alt = card.alt;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return card.render();
}
