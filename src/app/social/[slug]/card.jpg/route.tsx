import { ImageResponse } from "next/og";
import sharp from "sharp";
import { cardBySlug, SOCIAL_CARDS, type CardFace } from "@/lib/social-cards";
import { autopsyFaces } from "@/lib/autopsy";

/**
 * Standalone posts and carousel slides are the same thing to this route: a
 * card face at a slug. Keeping one renderer is what stops an Autopsy slide and
 * a stamp duty card drifting into two different-looking designs.
 */
function faceBySlug(slug: string): CardFace | undefined {
  return cardBySlug(slug) ?? autopsyFaces().get(slug);
}

function allSlugs(): string[] {
  return [...SOCIAL_CARDS.map(c => c.slug), ...autopsyFaces().keys()];
}

/**
 * A 1080x1080 Instagram card, rendered from calculator output.
 *
 * Two constraints shape this route, both from Meta's content publishing API:
 *
 *   1. It fetches the URL itself, and rejects URLs carrying a query string.
 *      Hence a path segment (/social/<slug>/card.jpg) rather than ?slug=.
 *   2. image_url must be JPEG. next/og only emits PNG, so sharp converts.
 *
 * Rendering is deterministic: the same slug always produces the same image
 * from the same tested calculator code, so a post can be checked against the
 * calculator it links to.
 */
export const runtime = "nodejs";

const NAVY = "#0f1b36";
const NAVY_DEEP = "#050912";
const GOLD = "#f4d35e";
/** Used when the headline number is bad news, so it does not read as a win. */
const WARN = "#f08a5d";
const MUTED = "#97a5c5";
const HAIRLINE = "rgba(255,255,255,0.12)";

export function generateStaticParams() {
  return allSlugs().map(slug => ({ slug }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const card = faceBySlug(slug);
  if (!card) {
    return new Response("Not found", { status: 404 });
  }

  const png = new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: `linear-gradient(160deg, ${NAVY_DEEP} 0%, ${NAVY} 45%, #1a2e5a 100%)`,
          padding: "72px 72px 64px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Masthead */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: GOLD,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
              fontWeight: 800,
              color: NAVY,
            }}
          >
            P
          </div>
          <span style={{ fontSize: "26px", fontWeight: 800, color: "#ffffff" }}>
            PropertyVault
          </span>
          <div
            style={{
              display: "flex",
              padding: "8px 18px",
              borderRadius: "999px",
              background: "rgba(244,211,94,0.15)",
              color: GOLD,
              fontSize: "18px",
              fontWeight: 700,
              marginLeft: "auto",
            }}
          >
            {card.eyebrow}
          </div>
        </div>

        {/* The question, then the number */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "88px" }}>
          <div
            style={{
              fontSize: "46px",
              fontWeight: 700,
              color: MUTED,
              lineHeight: 1.2,
              maxWidth: "880px",
            }}
          >
            {card.headline}
          </div>
          <div
            style={{
              fontSize: "132px",
              fontWeight: 800,
              color: card.tone === "warn" ? WARN : GOLD,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            {card.value}
          </div>
          <div style={{ fontSize: "30px", fontWeight: 600, color: "#ffffff" }}>
            {card.valueLabel}
          </div>
        </div>

        {/* The workings, so the number is never merely asserted */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
          {card.rows.map(r => (
            <div
              key={r.k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "18px 0",
                borderTop: `1px solid ${HAIRLINE}`,
                fontSize: "26px",
              }}
            >
              <span style={{ color: MUTED }}>{r.k}</span>
              <span style={{ color: "#ffffff", fontWeight: 700 }}>{r.v}</span>
            </div>
          ))}
        </div>

        {/* Where to check it */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "22px",
            color: MUTED,
            marginTop: "44px",
          }}
        >
          <span>propertyvaultuk.co.uk</span>
          <span>Check it yourself: {card.verifyPath}</span>
        </div>
      </div>
    ),
    { width: 1080, height: 1080 },
  );

  const jpeg = await sharp(Buffer.from(await png.arrayBuffer()))
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .toBuffer();

  return new Response(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": "image/jpeg",
      // Meta fetches this during container creation; it must stay stable for
      // the life of the container, and the content only changes on deploy.
      "Cache-Control": "public, max-age=3600, s-maxage=86400, immutable",
    },
  });
}
