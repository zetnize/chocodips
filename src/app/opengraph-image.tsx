import { ImageResponse } from "next/og";
export const alt = "Choco Dips — кофе и десерты в Нальчике";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#1C0F0A",
        color: "#F2E7D8",
        display: "flex",
        flexDirection: "column",
        padding: "65px 85px",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          color: "#E87843",
          fontSize: 22,
          letterSpacing: 7,
          display: "flex",
        }}
      >
        НАЛЬЧИК · ПУШКИНА, 85А
      </div>
      <div
        style={{
          fontSize: 140,
          letterSpacing: -7,
          marginTop: 22,
          display: "flex",
        }}
      >
        Choco Dips
      </div>
      <div style={{ fontSize: 34, marginTop: 25, display: "flex" }}>
        Завтраки, кофе и десерты
      </div>
    </div>,
    size,
  );
}
