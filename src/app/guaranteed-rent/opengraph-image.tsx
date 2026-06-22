import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Guaranteed Rent for Landlords — Birmingham, Nottingham & Derby";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: "linear-gradient(160deg, #050912 0%, #0f1b36 40%, #1a2e5a 100%)", padding: "60px 80px", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#f4d35e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: 800, color: "#0f1b36" }}>P</div>
          <span style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff" }}>PropertyVault<span style={{ color: "#f4d35e" }}>.co.uk</span></span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ padding: "8px 20px", borderRadius: "20px", background: "rgba(244,211,94,0.15)", color: "#f4d35e", fontSize: "16px", fontWeight: 700, alignSelf: "flex-start" }}>For Landlords</div>
          <div style={{ fontSize: "56px", fontWeight: 800, color: "#ffffff", lineHeight: 1.1 }}>Your Rent. Guaranteed.</div>
          <div style={{ fontSize: "22px", color: "#97a5c5" }}>We lease your property and pay you every month for 3-5 years. No voids. No fees.</div>
        </div>
        <div style={{ display: "flex", gap: "24px" }}>
          {[{ n: "3-5", l: "Year leases" }, { n: "Zero", l: "Void periods" }, { n: "100%", l: "Management" }].map(s => (
            <div key={s.l} style={{ display: "flex", flexDirection: "column", padding: "12px 24px", borderRadius: "12px", background: "rgba(255,255,255,0.08)" }}>
              <span style={{ fontSize: "28px", fontWeight: 800, color: "#f4d35e" }}>{s.n}</span>
              <span style={{ fontSize: "14px", color: "#97a5c5" }}>{s.l}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
