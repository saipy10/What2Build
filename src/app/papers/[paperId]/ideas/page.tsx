import React from "react";
import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/seo-config";
import { PaperIdeasClient } from "@/components/PaperIdeasClient";
import { JsonLd } from "@/components/seo/JsonLd";

interface PaperIdeasPageProps {
  params: Promise<{ paperId: string }>;
}

export async function generateMetadata({ params }: PaperIdeasPageProps): Promise<Metadata> {
  const resolved = await params;
  const paperId = resolved.paperId;

  const title = `AI Project Ideas & Engineering Specs (Paper #${paperId.slice(0, 8)})`;
  const description = `Generate beginner, intermediate, and advanced software engineering project specs from AI research paper #${paperId}. Includes tech stacks, architectures, and implementation steps.`;
  const canonicalUrl = `${SITE_CONFIG.url}/papers/${paperId}/ideas`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PaperIdeasPage({ params }: PaperIdeasPageProps) {
  const resolved = await params;
  const paperId = resolved.paperId;
  const canonicalUrl = `${SITE_CONFIG.url}/papers/${paperId}/ideas`;

  const jsonLdItems = [
    {
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_CONFIG.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Paper Projects",
          item: canonicalUrl,
        },
      ],
    },
  ];

  return (
    <>
      <JsonLd items={jsonLdItems} />
      <PaperIdeasClient paperId={paperId} />
    </>
  );
}
