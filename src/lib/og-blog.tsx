import { ImageResponse } from "next/og";
import { blogPosts, slugOf } from "./blog-posts";

export const ogSize = { width: 1200, height: 630 };

/**
 * Arabic titles need three things the renderer does not do on its own.
 *
 * A font: `next/og` fetches a Google font for a script it meets, but the
 * one it picks for Arabic carries a GSUB lookup its shaper rejects and the
 * render throws — so Cairo is vendored (og-fonts/README.md). Bidi: Satori
 * shapes the glyphs correctly but lays words out left-to-right, so a title
 * comes out with its words in reverse; lines are broken here in reading
 * order and each line's words reversed, then right-aligned. Spacing: it
 * measures each Arabic word slightly wide, so words are laid out as flex
 * items with a small gap rather than as one string.
 */
const ARABIC = /[\u0600-\u06FF]/;

function rtlLines(text: string, maxChars = 34): string[][] {
  const lines: string[][] = [];
  let line: string[] = [];
  for (const word of text.split(" ")) {
    if (line.length && line.join(" ").length + 1 + word.length > maxChars) {
      lines.push(line);
      line = [];
    }
    line.push(word);
  }
  if (line.length) lines.push(line);
  return lines.map(words => [...words].reverse());
}

async function arabicFont(): Promise<ArrayBuffer> {
  const res = await fetch(new URL("./og-fonts/Cairo-Bold.woff", import.meta.url));
  return res.arrayBuffer();
}

export async function blogOgImage(title: string, category: string, date: string) {
  const arabic = ARABIC.test(title);
  const titleBlock = arabic ? (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", maxWidth: "1000px" }}>
      {rtlLines(title).map((words, i) => (
        <div key={i} style={{ display: "flex", gap: "6px", fontSize: "48px", fontWeight: 700, color: "#ffffff", lineHeight: 1.3 }}>
          {words.map((w, j) => <span key={j}>{w}</span>)}
        </div>
      ))}
    </div>
  ) : (
    <div style={{ fontSize: "48px", fontWeight: 800, color: "#ffffff", lineHeight: 1.15, maxWidth: "900px" }}>{title}</div>
  );
  const options = arabic
    ? { ...ogSize, fonts: [{ name: "Cairo", data: await arabicFont(), weight: 700 as const, style: "normal" as const }] }
    : { ...ogSize };
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: "linear-gradient(160deg, #050912 0%, #0f1b36 40%, #1a2e5a 100%)", padding: "60px 80px", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#f4d35e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: 800, color: "#0f1b36" }}>P</div>
            <span style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff" }}>PropertyVault<span style={{ color: "#f4d35e" }}>.co.uk</span></span>
          </div>
          <span style={{ fontSize: "16px", color: "#6b7db0" }}>By Nass · {date}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: arabic ? "flex-end" : "flex-start" }}>
          <div style={{ padding: "8px 20px", borderRadius: "20px", background: "rgba(244,211,94,0.15)", color: "#f4d35e", fontSize: "16px", fontWeight: 700 }}>{category}</div>
          {titleBlock}
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ padding: "10px 24px", borderRadius: "8px", background: "linear-gradient(135deg, #f4d35e, #d4a843)", color: "#0f1b36", fontWeight: 700, fontSize: "16px" }}>Read article</div>
          <div style={{ padding: "10px 24px", borderRadius: "8px", background: "rgba(255,255,255,0.08)", color: "#97a5c5", fontWeight: 600, fontSize: "16px" }}>propertyvaultuk.co.uk/blog</div>
        </div>
      </div>
    ),
    options
  );
}

/**
 * The card for one post, from the same list the blog index, the feed and
 * the sitemap read. Each post's opengraph-image.tsx is the same eight
 * lines with its slug; the title, category and date are never typed twice.
 * Throws at build time for a slug that is not in the index, which is the
 * moment to find out.
 */
export function blogCard(slug: string) {
  const post = blogPosts.find(p => slugOf(p) === slug);
  if (!post) throw new Error(`No blog post with slug "${slug}" in lib/blog-posts.ts`);
  return {
    alt: `${post.title} — PropertyVault UK`,
    render: () => blogOgImage(post.title, post.category, post.date),
  };
}
