/**
 * Render the 30-day Reel calendar to public/reels/*.mp4.
 *
 * Run with: npm run reels
 *
 * Videos are generated here rather than on request because rendering ~450
 * frames takes about half a minute each — far too slow for a serverless route,
 * and there is no reason to redo it per view when the numbers only change when
 * the calculators do. The output is committed and served as static files, which
 * is also what Meta needs: it fetches video_url itself and rejects anything
 * behind a query string or a redirect.
 *
 * Pass a day number to render just one: npm run reels -- 7
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { CALENDAR, durationOf, type ReelSpec } from "../src/lib/reel-calendar";
import { reelFrame, FPS, WIDTH, HEIGHT } from "../src/lib/reel-frame";

const OUT_DIR = join(process.cwd(), "public", "reels");
const TMP_DIR = join(process.cwd(), ".reel-frames");

export function fileNameFor(spec: ReelSpec): string {
  return `day-${String(spec.day).padStart(2, "0")}-${spec.id}.mp4`;
}

async function renderOne(spec: ReelSpec): Promise<string> {
  const seconds = durationOf(spec);
  const frames = Math.round(seconds * FPS);
  const dir = join(TMP_DIR, spec.id);

  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });

  for (let i = 0; i < frames; i++) {
    const img = new ImageResponse(reelFrame(spec, i / FPS, seconds), { width: WIDTH, height: HEIGHT });
    const jpg = await sharp(Buffer.from(await img.arrayBuffer())).jpeg({ quality: 88 }).toBuffer();
    writeFileSync(join(dir, `f${String(i).padStart(4, "0")}.jpg`), jpg);
  }

  const out = join(OUT_DIR, fileNameFor(spec));
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error",
    "-framerate", String(FPS),
    "-i", join(dir, "f%04d.jpg"),
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    // Flat graphics compress hard; 24 keeps text crisp at a fraction of the size.
    "-crf", "24",
    "-preset", "slow",
    "-movflags", "+faststart",
    "-r", String(FPS),
    out,
  ]);

  rmSync(dir, { recursive: true, force: true });
  return out;
}

async function main() {
  const only = process.argv[2] ? Number(process.argv[2]) : null;
  const todo = only ? CALENDAR.filter(r => r.day === only) : CALENDAR;

  if (todo.length === 0) {
    console.error(`No reel for day ${only}. The calendar runs 1-${CALENDAR.length}.`);
    process.exit(1);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  let bytes = 0;

  for (const spec of todo) {
    const started = Date.now();
    const out = await renderOne(spec);
    const size = statSync(out).size;
    bytes += size;
    console.log(
      `day ${String(spec.day).padStart(2)}  ${spec.format.padEnd(11)} ` +
      `${durationOf(spec).toFixed(1)}s  ${(size / 1024).toFixed(0)}KB  ` +
      `${((Date.now() - started) / 1000).toFixed(1)}s  ${fileNameFor(spec)}`,
    );
  }

  rmSync(TMP_DIR, { recursive: true, force: true });
  console.log(`\n${todo.length} reels, ${(bytes / 1024 / 1024).toFixed(1)}MB total`);
}

if (!existsSync(join(process.cwd(), "package.json"))) {
  console.error("Run this from the repository root.");
  process.exit(1);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
