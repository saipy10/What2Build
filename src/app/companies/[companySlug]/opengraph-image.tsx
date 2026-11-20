import { ImageResponse } from "next/og";
import { SUPPORTED_COMPANIES } from "@/lib/companies";
import { SITE_CONFIG } from "@/lib/seo-config";

export const alt = `${SITE_CONFIG.name} — Organization Research & Engineering Projects`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function CompanyOpenGraphImage({
  params,
}: {
  params: Promise<{ companySlug: string }>;
}) {
  const { companySlug } = await params;
  const company = SUPPORTED_COMPANIES[companySlug];
  const name = company?.name ?? "Engineering Organization";
  const tagline =
    company?.tagline ??
    "Turn official engineering blogs and AI research papers into portfolio projects";
  const accent = company?.color && company.color !== "#000000" ? company.color : "#10b981";
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

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
          background: "linear-gradient(135deg, #09090b 0%, #141419 65%, #111827 100%)",
          color: "#f4f4f6",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Row: What2Build badge + Accent bar */}
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
              border: `1px solid ${accent}`,
              color: "#f4f4f6",
              fontSize: 18,
              background: "rgba(255,255,255,0.05)",
            }}
          >
            Engineering &amp; Research Hub
          </div>
        </div>

        {/* Main Company Identity */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div
            style={{
              width: 112,
              height: 112,
              borderRadius: 28,
              background: accent,
              color: "#ffffff",
              fontSize: 44,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {initials || "W2B"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 880 }}>
            <div
              style={{
                fontSize: 60,
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                color: "#ffffff",
              }}
            >
              {name}
            </div>
            <div
              style={{
                fontSize: 26,
                lineHeight: 1.35,
                color: "#a1a1aa",
              }}
            >
              {tagline}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #27272a",
            paddingTop: 22,
            fontSize: 20,
            color: "#a1a1aa",
          }}
        >
          <span>Engineering Blogs &middot; Research Papers &middot; Project Specs</span>
          <span>
            {`${SITE_CONFIG.url.replace(/^https?:\/\//, "")}/companies/${companySlug}`}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
