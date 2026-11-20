import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090b",
          borderRadius: 36,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#6366f1",
            }}
          />
          <div style={{ display: "flex", gap: 10 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 12,
                background: "#f4f4f6",
              }}
            />
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 12,
                background: "#f4f4f6",
              }}
            />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
