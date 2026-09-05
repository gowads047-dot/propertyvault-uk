/**
 * A sample of what the account could say once a beat is allowed to reveal a
 * fact rather than count a number.
 *
 * Deliberately not in the calendar yet. This exists to be looked at before
 * thirty videos are committed to a direction.
 */
import { ImageResponse } from "next/og";
import { writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";
import type { ReelSpec } from "../src/lib/reel-calendar";
import { reelFrame, WIDTH, HEIGHT } from "../src/lib/reel-frame";

const SPEC: ReelSpec = {
  day: 0,
  id: "register-sample",
  format: "autopsy",
  hashtags: ["ukproperty", "hmo", "article4", "uklandlord", "planningpermission"],
  caption: "The listing will not tell you this. The register will.",
  scenes: [
    {
      kicker: "B29 6LA, BIRMINGHAM", render: "text", from: 0, to: 0, seconds: 3,
      text: "Article 4 direction",
      state: "verified", source: "planning.data.gov.uk",
      sub: "SELLY OAK HMO; CITY WIDE HMO",
      foot: "Permitted development rights removed — an HMO conversion needs planning permission",
      tone: "warn",
    },
    {
      kicker: "ALSO CHECKED", render: "text", from: 0, to: 0, seconds: 3,
      text: "Flood risk, conservation area, listed building",
      state: "no-record",
      sub: "Nothing on the national register at this location",
      foot: "Coverage is incomplete. That is not the same as nothing applying.",
    },
  ],
};

async function main() {
  const t = Number(process.argv[2] ?? 1.5);
  const img = new ImageResponse(reelFrame(SPEC, t, 6), { width: WIDTH, height: HEIGHT });
  const base = sharp(Buffer.from(await img.arrayBuffer()));
  mkdirSync(".reel-preview", { recursive: true });
  writeFileSync(".reel-preview/register-sample.png", await base.png().toBuffer());
  console.log(`register sample at ${t}s`);
}

main();
