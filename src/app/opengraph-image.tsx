import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/lib/seo-config";
import { SUPPORTED_COMPANIES } from "@/lib/companies";

export const alt = `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  const companyCount = Object.keys(SUPPORTED_COMPANIES).length;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #09090b 0%, #141418 55%, #0f1f1a 100%)",
          color: "#f4f4f6",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Brand Row */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "#18181c",
              border: "1px solid #32323a",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <div style={{ width: 14, height: 14, borderRadius: 3, background: "#6366f1" }} />
            <div style={{ display: "flex", gap: 4 }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: "#f4f4f6" }} />
              <div style={{ width: 14, height: 14, borderRadius: 3, background: "#f4f4f6" }} />
            </div>
          </div>
          <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em" }}>
            {SITE_CONFIG.name}
          </span>
        </div>

        {/* Center Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 960 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: "#ffffff",
            }}
          >
            Turn AI research papers &amp; engineering blogs into projects
          </div>
          <div
            style={{
              fontSize: 26,
              lineHeight: 1.4,
              color: "#a1a1aa",
              display: "flex",
            }}
          >
            {`Browse publications from ${companyCount} leading AI labs & engineering teams with Beginner, Intermediate, and Advanced build specs.`}
          </div>
        </div>

        {/* Bottom Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #27272a",
            paddingTop: 24,
            fontSize: 20,
            color: "#10b981",
          }}
        >
          <span>ReadEngg, BuildEngg</span>
          <span style={{ color: "#a1a1aa" }}>
            {SITE_CONFIG.url.replace(/^https?:\/\//, "")}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
