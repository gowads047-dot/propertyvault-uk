import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Makan — Find Your Place. Free property listings worldwide.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: "linear-gradient(135deg, #faf9f7 0%, #fef0ed 50%, #faf9f7 100%)", padding: "60px 80px", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "#e8553d", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="28" height="28" viewBox="0 0 20 20" fill="white"><path d="M10 2L2 8.5V17a1 1 0 001 1h4.5v-5a1.5 1.5 0 011.5-1.5h2a1.5 1.5 0 011.5 1.5v5H17a1 1 0 001-1V8.5L10 2z"/></svg>
          </div>
          <span style={{ fontSize: "28px", fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.02em" }}>makan</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: "58px", fontWeight: 800, color: "#1a1a1a", lineHeight: 1.05, letterSpacing: "-0.02em" }}>Find your place</div>
          <div style={{ fontSize: "22px", color: "#6b6b6b", maxWidth: "700px" }}>Free property listings across UK, Middle East & North Africa. Rooms, flats, houses, villas. No agents, no fees.</div>
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div style={{ padding: "12px 28px", borderRadius: "10px", background: "#e8553d", color: "white", fontWeight: 700, fontSize: "16px" }}>Browse listings</div>
          <div style={{ display: "flex", gap: "8px", fontSize: "22px" }}>
            <span>🇬🇧</span><span>🇲🇦</span><span>🇪🇬</span><span>🇦🇪</span><span>🇸🇦</span><span>🇰🇼</span><span>🇧🇭</span><span>🇶🇦</span><span>🇴🇲</span><span>🇯🇴</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
