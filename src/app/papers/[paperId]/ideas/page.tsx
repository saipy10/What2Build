import React, { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_CONFIG, isPersistedPaperId } from "@/lib/seo-config";
import { getPaperById, getCachedIdeasForPaper } from "@/lib/paperService";
import { PaperIdeasClient, PaperDetails } from "@/components/PaperIdeasClient";
import { JsonLd } from "@/components/seo/JsonLd";

interface PaperIdeasPageProps {
  params: Promise<{ paperId: string }>;
}

const getPaperCached = cache(async (paperId: string) => getPaperById(paperId));
const getIdeasCached = cache(async (paperId: string) =>
  getCachedIdeasForPaper(paperId)
);

function buildSummaryDescription(
  paperTitle: string,
  companyName: string | undefined,
  summary: string
): string {
  const cleanSummary = summary.replace(/\s+/g, " ").trim();
  const prefix = companyName
    ? `Project ideas based on ${companyName}'s "${paperTitle}": `
    : `Project ideas based on "${paperTitle}": `;
  const maxSummaryLen = Math.max(60, 158 - prefix.length);
  if (!cleanSummary) {
    return `${prefix}Beginner, Intermediate, and Advanced software engineering specifications with tech stacks and features.`;
  }
  const snippet =
    cleanSummary.length > maxSummaryLen
      ? `${cleanSummary.slice(0, maxSummaryLen - 1).trimEnd()}…`
      : cleanSummary;
  return `${prefix}${snippet}`;
}

export async function generateMetadata({
  params,
}: PaperIdeasPageProps): Promise<Metadata> {
  const { paperId } = await params;
  const paper = await getPaperCached(paperId);

  if (!paper) {
    notFound();
  }

  const ideas = await getIdeasCached(paperId);
  const companyName = paper.company?.name;
  const title = companyName
    ? `${paper.title} — ${companyName} Project Ideas`
    : `${paper.title} — Project Ideas`;
  const description = buildSummaryDescription(
    paper.title,
    companyName,
    paper.description
  );
  const canonicalUrl = `${SITE_CONFIG.url}/papers/${encodeURIComponent(paperId)}/ideas`;

  const isPersisted = Boolean(paper.persisted && isPersistedPaperId(paperId));
  const hasIdeas = ideas.length > 0;
  const shouldIndex = isPersisted && hasIdeas;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: shouldIndex
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      type: "article",
      publishedTime: paper.publishedAt.toISOString(),
      modifiedTime: paper.updatedAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
    },
  };
}

export default async function PaperIdeasPage({ params }: PaperIdeasPageProps) {
  const { paperId } = await params;
  const paper = await getPaperCached(paperId);

  if (!paper) {
    notFound();
  }

  const cachedIdeas = await getIdeasCached(paperId);
  const canonicalUrl = `${SITE_CONFIG.url}/papers/${encodeURIComponent(paperId)}/ideas`;

  const initialPaper: PaperDetails = {
    id: paper.id,
    title: paper.title,
    description: paper.description,
    sourceUrl: paper.sourceUrl,
    authors: paper.authors || [],
    publishedAt: paper.publishedAt.toISOString(),
    updatedAt: paper.updatedAt.toISOString(),
    company: paper.company
      ? {
          name: paper.company.name,
          slug: paper.company.slug,
        }
      : undefined,
  };

  const latestIdeaUpdate =
    cachedIdeas.length > 0
      ? cachedIdeas
          .map((i) => new Date(i.updatedAt).getTime())
          .reduce((a, b) => Math.max(a, b), 0)
      : 0;
  const dateModifiedIso = new Date(
    Math.max(paper.updatedAt.getTime(), latestIdeaUpdate)
  ).toISOString();

  const breadcrumbItems: Record<string, unknown>[] = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_CONFIG.url,
    },
  ];

  if (paper.company?.slug) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 2,
      name: paper.company.name,
      item: `${SITE_CONFIG.url}/companies/${paper.company.slug}`,
    });
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: paper.title,
      item: canonicalUrl,
    });
  } else {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 2,
      name: paper.title,
      item: canonicalUrl,
    });
  }

  const jsonLdItems: Record<string, unknown>[] = [
    {
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumb`,
      itemListElement: breadcrumbItems,
    },
    {
      "@type": "TechArticle",
      "@id": `${canonicalUrl}#article`,
      headline: paper.title,
      description: buildSummaryDescription(
        paper.title,
        paper.company?.name,
        paper.description
      ),
      url: canonicalUrl,
      datePublished: paper.publishedAt.toISOString(),
      dateModified: dateModifiedIso,
      author: {
        "@type": "Organization",
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
      },
      publisher: {
        "@type": "Organization",
        "@id": `${SITE_CONFIG.url}/#organization`,
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_CONFIG.url}/icon-512.png`,
          width: 512,
          height: 512,
        },
      },
      isBasedOn: {
        "@type":
          paper.contentType === "research" ? "ScholarlyArticle" : "Article",
        name: paper.title,
        url: paper.sourceUrl,
      },
      citation: paper.sourceUrl,
    },
  ];

  if (cachedIdeas.length > 0) {
    jsonLdItems.push({
      "@type": "ItemList",
      "@id": `${canonicalUrl}#ideas`,
      name: `AI-Generated Project Ideas for ${paper.title}`,
      numberOfItems: cachedIdeas.length,
      itemListElement: cachedIdeas.map((idea, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${idea.difficulty}: ${idea.title}`,
        description: idea.description,
      })),
    });
  }

  return (
    <>
      <JsonLd items={jsonLdItems} />
      <PaperIdeasClient
        paperId={paperId}
        initialPaper={initialPaper}
        initialIdeas={cachedIdeas}
        lastUpdatedIso={dateModifiedIso}
      />
    </>
  );
}
