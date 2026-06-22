import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PropertyVault UK — Free Property Calculators, Templates & Guides";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: "linear-gradient(160deg, #050912 0%, #0f1b36 40%, #1a2e5a 100%)", padding: "60px 80px", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#f4d35e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: 800, color: "#0f1b36" }}>P</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff" }}>PropertyVault<span style={{ color: "#f4d35e" }}>.co.uk</span></span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: "52px", fontWeight: 800, color: "#ffffff", lineHeight: 1.1, maxWidth: "900px" }}>Free Property Calculators, Templates & Guides</div>
          <div style={{ fontSize: "22px", color: "#97a5c5", maxWidth: "700px" }}>17 calculators · 40+ templates · 49 glossary terms · 3 area guides</div>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ padding: "10px 24px", borderRadius: "8px", background: "linear-gradient(135deg, #f4d35e, #d4a843)", color: "#0f1b36", fontWeight: 700, fontSize: "16px" }}>Analyse a deal</div>
          <div style={{ padding: "10px 24px", borderRadius: "8px", background: "rgba(255,255,255,0.1)", color: "#ffffff", fontWeight: 600, fontSize: "16px" }}>propertyvaultuk.co.uk</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
