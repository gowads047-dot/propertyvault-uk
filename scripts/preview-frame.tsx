/**
 * Render one frame of one reel, with the Instagram interface drawn over it.
 *
 * The frames were composed on a blank 1080x1920 canvas, which is the right
 * size — but Instagram puts its own chrome on top of that canvas, and nothing
 * in this repo ever showed what survives underneath it. This does.
 */
import { ImageResponse } from "next/og";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { CALENDAR, durationOf } from "../src/lib/reel-calendar";
import { reelFrame, WIDTH, HEIGHT } from "../src/lib/reel-frame";

// Instagram Reels overlay, measured against Meta's published safe areas for a
// 1080x1920 video.
const CHROME = { top: 250, bottom: 420, right: 200 };

async function main() {
  const day = Number(process.argv[2] ?? 1);
  const spec = CALENDAR.find(r => r.day === day) ?? CALENDAR[0];
  const seconds = durationOf(spec);
  const t = Number(process.argv[3] ?? (seconds * 0.5));

  const img = new ImageResponse(reelFrame(spec, t, seconds), { width: WIDTH, height: HEIGHT });
  const base = sharp(Buffer.from(await img.arrayBuffer()));

  const veil = Buffer.from(
    `<svg width="${WIDTH}" height="${HEIGHT}">
       <rect x="0" y="0" width="${WIDTH}" height="${CHROME.top}" fill="rgba(255,0,0,0.45)"/>
       <rect x="0" y="${HEIGHT - CHROME.bottom}" width="${WIDTH}" height="${CHROME.bottom}" fill="rgba(255,0,0,0.45)"/>
       <rect x="${WIDTH - CHROME.right}" y="${CHROME.top}" width="${CHROME.right}" height="${HEIGHT - CHROME.top - CHROME.bottom}" fill="rgba(255,0,0,0.45)"/>
     </svg>`,
  );

  const outDir = process.argv[4] ?? ".reel-preview";
  mkdirSync(outDir, { recursive: true });

  writeFileSync(join(outDir, `day-${day}-clean.png`), await base.clone().png().toBuffer());
  writeFileSync(
    join(outDir, `day-${day}-overlaid.png`),
    await base.composite([{ input: veil, top: 0, left: 0 }]).png().toBuffer(),
  );
  console.log(`day ${day} "${spec.id}" at ${t.toFixed(1)}s — red is what Instagram covers`);

}

main();
