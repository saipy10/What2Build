import { ImageResponse } from "next/og";
import { getPaperById } from "@/lib/paperService";
import { SITE_CONFIG } from "@/lib/seo-config";

export const alt = `${SITE_CONFIG.name} — AI-Generated Engineering Project Ideas`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function PaperOpenGraphImage({
  params,
}: {
  params: Promise<{ paperId: string }>;
}) {
  const { paperId } = await params;
  let paperTitle = "Engineering Project Specifications";
  let companyName = SITE_CONFIG.name;

  try {
    const paper = await getPaperById(paperId);
    if (paper) {
      paperTitle = paper.title;
      companyName = paper.company?.name ?? SITE_CONFIG.name;
    }
  } catch {
    // Fallback to generic title if lookup fails
  }

  const displayTitle =
    paperTitle.length > 110 ? `${paperTitle.slice(0, 107).trimEnd()}...` : paperTitle;

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
          background: "linear-gradient(135deg, #09090b 0%, #141418 60%, #0f1f1a 100%)",
          color: "#f4f4f6",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "#18181c",
                border: "1px solid #32323a",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
              }}
            >
              <div style={{ width: 12, height: 12, borderRadius: 3, background: "#6366f1" }} />
              <div style={{ display: "flex", gap: 3 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: "#f4f4f6" }} />
                <div style={{ width: 12, height: 12, borderRadius: 3, background: "#f4f4f6" }} />
              </div>
            </div>
            <span style={{ fontSize: 26, fontWeight: 600, color: "#e4e4e7" }}>
              {SITE_CONFIG.name}
            </span>
          </div>

          <div
            style={{
              padding: "8px 18px",
              borderRadius: 999,
              border: "1px solid #10b981",
              color: "#34d399",
              fontSize: 18,
              background: "rgba(16,185,129,0.08)",
            }}
          >
            {companyName}
          </div>
        </div>

        {/* Center Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1040 }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#10b981",
            }}
          >
            Project Ideas &amp; Engineering Specs
          </div>
          <div
            style={{
              fontSize: displayTitle.length > 70 ? 44 : 54,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.025em",
              color: "#ffffff",
            }}
          >
            {displayTitle}
          </div>
        </div>

        {/* Bottom Tier Chips */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #27272a",
            paddingTop: 22,
            fontSize: 19,
            color: "#a1a1aa",
          }}
        >
          <div style={{ display: "flex", gap: 16 }}>
            <span style={{ color: "#34d399" }}>Beginner</span>
            <span>{"\u00b7"}</span>
            <span style={{ color: "#fbbf24" }}>Intermediate</span>
            <span>{"\u00b7"}</span>
            <span style={{ color: "#f87171" }}>Advanced</span>
          </div>
          <span>{SITE_CONFIG.url.replace(/^https?:\/\//, "")}</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
