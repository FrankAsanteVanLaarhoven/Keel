import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Keel — Systems for people";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#1c1916",
          color: "#f3f0e8",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <svg width="40" height="40" viewBox="0 0 32 32">
            <rect width="32" height="32" fill="#1c1916" />
            <path d="M7 23.5h18M9 23.5V9" fill="none" stroke="#f3f0e8" strokeWidth="2" />
          </svg>
          <span style={{ fontSize: "24px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#b1a89a" }}>
            Keel
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1 style={{ fontSize: "64px", fontWeight: 600, margin: 0, letterSpacing: "-0.02em" }}>
            Systems for people
          </h1>
          <p style={{ fontSize: "28px", color: "#b1a89a", margin: 0, maxWidth: "900px", lineHeight: 1.4 }}>
            A private learning programme for staff and students. Eleven cases, then one brief.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #2e2b26",
            paddingTop: "24px",
          }}
        >
          <span style={{ fontSize: "20px", color: "#d08968" }}>Tools · Platforms · Design · Operations</span>
          <span style={{ fontSize: "20px", color: "#b1a89a" }}>Frank Asante Van Laarhoven</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
