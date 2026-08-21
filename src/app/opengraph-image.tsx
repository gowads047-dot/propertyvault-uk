import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PropertyVault UK — Free Property Tools, Calculators & Guides";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, display: "flex", background: "#0c1730", position: "relative" }}>

        {/* Gold left accent bar */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 6, height: 630, background: "#c9a84c", display: "flex" }} />

        {/* Left: wordmark + tagline */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 72, paddingRight: 40, flex: 1 }}>
          <span style={{ fontSize: 90, fontWeight: 800, color: "#ffffff", letterSpacing: "-2px", lineHeight: 1, fontFamily: "serif" }}>PROPERTY</span>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: -6 }}>
            <span style={{ fontSize: 90, fontWeight: 800, color: "var(--gold-ink)", letterSpacing: "-2px", lineHeight: 1, fontFamily: "serif" }}>VAULT</span>
            <span style={{ fontSize: 56, fontWeight: 300, color: "rgba(255,255,255,0.45)", fontFamily: "serif" }}>UK</span>
          </div>

          {/* Gold divider */}
          <div style={{ width: 460, height: 2, background: "rgba(201,168,76,0.4)", marginTop: 22, marginBottom: 22, display: "flex" }} />

          <span style={{ fontSize: 19, color: "rgba(255,255,255,0.48)", letterSpacing: "5px", fontFamily: "sans-serif" }}>
            FREE TOOLS · CALCULATORS · GUARANTEED RENT
          </span>
          <span style={{ fontSize: 15, color: "rgba(255,255,255,0.28)", letterSpacing: "4px", fontFamily: "sans-serif", marginTop: 14 }}>
            PROPERTYVAULTUK.CO.UK
          </span>
        </div>

        {/* Right: PV monogram panel */}
        <div style={{
          width: 400,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
        }}>
          {/* PV */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 0, marginBottom: 36 }}>
            <span style={{ fontSize: 130, fontWeight: 800, color: "rgba(255,255,255,0.88)", lineHeight: 1, fontFamily: "serif" }}>P</span>
            <span style={{ fontSize: 100, fontWeight: 300, color: "rgba(201,168,76,0.7)", lineHeight: 1, fontFamily: "serif" }}>V</span>
          </div>

          {/* Sub-brand circles */}
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            {([
              ["MAKAN", "#c9a84c"],
              ["ACADEMY", "#22c55e"],
              ["RENTURA", "#3b82f6"],
            ] as [string, string][]).map(([label, color]) => (
              <div key={label} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 76,
                height: 76,
                borderRadius: "50%",
                border: `2.5px solid ${color}`,
              }}>
                <span style={{ fontSize: 9, fontWeight: 700, color, letterSpacing: "0.5px", fontFamily: "sans-serif" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    ),
    { ...size }
  );
}
