import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export async function GET() {
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
          borderRadius: 96,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
          }}
        >
          <div
            style={{
              width: 164,
              height: 164,
              borderRadius: 34,
              background: "#6366f1",
            }}
          />
          <div style={{ display: "flex", gap: 28 }}>
            <div
              style={{
                width: 164,
                height: 164,
                borderRadius: 34,
                background: "#f4f4f6",
              }}
            />
            <div
              style={{
                width: 164,
                height: 164,
                borderRadius: 34,
                background: "#f4f4f6",
              }}
            />
          </div>
        </div>
      </div>
    ),
    {
      width: 512,
      height: 512,
    }
  );
}
