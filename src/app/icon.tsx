import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 7,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "monospace",
            fontSize: 21,
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
            width: 12,
            height: 2.5,
            marginTop: 3,
            borderRadius: 2,
            background: "#8B5CF6",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
