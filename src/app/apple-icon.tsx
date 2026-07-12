import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0D14",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "monospace",
            fontSize: 110,
            fontWeight: 700,
            lineHeight: 1,
            color: "#39FF88",
          }}
        >
          S
        </div>
        <div
          style={{
            display: "flex",
            width: 62,
            height: 12,
            marginTop: 14,
            borderRadius: 6,
            background: "#8B5CF6",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
