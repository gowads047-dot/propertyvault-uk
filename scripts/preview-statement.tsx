/**
 * A statement opener, in the style of the accounts this brand is being
 * compared to: a claim that fills the frame, not a label above a number.
 *
 * Rendered against the existing palette so the difference on screen is the
 * typography and nothing else. Not wired into anything — this exists to be
 * looked at next to the current opener before thirty videos are re-cut.
 */
import { ImageResponse } from "next/og";
import { writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";
import { WIDTH, HEIGHT } from "../src/lib/reel-frame";

const NAVY_DEEP = "#050912";
const NAVY = "#0f1b36";
const GOLD = "#f4d35e";
const WHITE = "#ffffff";
const MUTED = "#97a5c5";

function statement(line: string, accent: string, foot: string) {
  return (
    <div
      style={{
        display: "flex", flexDirection: "column", width: "100%", height: "100%",
        background: `linear-gradient(165deg, ${NAVY_DEEP} 0%, ${NAVY} 55%, #1a2e5a 100%)`,
        padding: "260px 200px 430px 72px",
        justifyContent: "center", fontFamily: "sans-serif",
      }}
    >
      <div style={{
        display: "flex", flexWrap: "wrap", fontSize: "128px", fontWeight: 800,
        color: WHITE, lineHeight: 1.02, letterSpacing: "-4px", textTransform: "uppercase",
      }}>
        {line}
      </div>
      <div style={{
        display: "flex", fontSize: "128px", fontWeight: 800, color: GOLD,
        lineHeight: 1.02, letterSpacing: "-4px", textTransform: "uppercase", marginTop: "8px",
      }}>
        {accent}
      </div>
      <div style={{ display: "flex", width: "220px", height: "8px", background: GOLD, margin: "44px 0 36px" }} />
      <div style={{ display: "flex", fontSize: "40px", color: MUTED, lineHeight: 1.3, maxWidth: "808px" }}>
        {foot}
      </div>
    </div>
  );
}

async function main() {
  mkdirSync(".reel-preview", { recursive: true });
  const img = new ImageResponse(
    statement("The advert said", "8% yield", "It was £164 a month. Here is where the rest went."),
    { width: WIDTH, height: HEIGHT },
  );
  writeFileSync(".reel-preview/statement.png", await sharp(Buffer.from(await img.arrayBuffer())).png().toBuffer());
  console.log("statement opener rendered");
}

main();
