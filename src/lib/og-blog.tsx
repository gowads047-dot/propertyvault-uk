import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

export function blogOgImage(title: string, category: string, date: string) {
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
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ padding: "8px 20px", borderRadius: "20px", background: "rgba(244,211,94,0.15)", color: "#f4d35e", fontSize: "16px", fontWeight: 700, alignSelf: "flex-start" }}>{category}</div>
          <div style={{ fontSize: "48px", fontWeight: 800, color: "#ffffff", lineHeight: 1.15, maxWidth: "900px" }}>{title}</div>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ padding: "10px 24px", borderRadius: "8px", background: "linear-gradient(135deg, #f4d35e, #d4a843)", color: "#0f1b36", fontWeight: 700, fontSize: "16px" }}>Read article</div>
          <div style={{ padding: "10px 24px", borderRadius: "8px", background: "rgba(255,255,255,0.08)", color: "#97a5c5", fontWeight: 600, fontSize: "16px" }}>propertyvaultuk.co.uk/blog</div>
        </div>
      </div>
    ),
    { ...ogSize }
  );
}
