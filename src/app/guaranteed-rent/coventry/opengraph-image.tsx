import { guaranteedRentCard, ogSize } from "@/lib/og-guaranteed-rent";

export const runtime = "edge";
const card = guaranteedRentCard("For Landlords in Coventry", "Guaranteed Rent Coventry — PropertyVault UK");
export const alt = card.alt;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return card.render();
}
