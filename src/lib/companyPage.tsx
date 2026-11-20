import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SUPPORTED_COMPANIES, CompanyConfig } from "@/lib/companies";
import { SITE_CONFIG, isPersistedPaperId } from "@/lib/seo-config";
import { getCompanyPapers } from "@/lib/paperService";
import { JsonLd } from "@/components/seo/JsonLd";
import { CompanyResearchClient } from "@/components/CompanyResearchClient";
import type { PaperData } from "@/components/PaperCard";
import type { FaqItem } from "@/components/FaqSection";

export type CompanyFeedMode = "blog" | "research";

export function buildCompanyMetadata(
  company: CompanyConfig | undefined,
  mode: CompanyFeedMode
): Metadata {
  if (!company) {
    return {
      title: "Organization Not Found",
      robots: { index: false, follow: true },
    };
  }

  const isResearch = mode === "research";
  const title = isResearch
    ? `${company.name} Research Papers & AI Project Ideas`
    : `${company.name} AI Research & Engineering Projects`;

  const description = isResearch
    ? `Explore academic research papers and arXiv preprints from ${company.name} (${company.tagline}). Convert frontier research into Beginner, Intermediate, and Advanced engineering projects.`
    : `Explore official engineering blogs and technical posts from ${company.name} (${company.tagline}). Turn frontier engineering breakthroughs into actionable coding projects.`;

  const canonicalUrl = isResearch
    ? `${SITE_CONFIG.url}/companies/${company.slug}/research`
    : `${SITE_CONFIG.url}/companies/${company.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
    },
  };
}

export async function renderCompanyPage(
  companySlug: string,
  mode: CompanyFeedMode
) {
  const company = SUPPORTED_COMPANIES[companySlug];
  if (!company) {
    notFound();
  }

  const isResearch = mode === "research";
  let initialPapers: PaperData[] = [];
  let lastUpdatedIso: string | null = null;

  try {
    const rawPapers = await getCompanyPapers(company.slug, false, mode, 10);
    initialPapers = rawPapers.map((p) => ({
      id: p.id,
      companyId: p.companyId,
      title: p.title,
      description: p.description,
      publishedAt:
        p.publishedAt instanceof Date
          ? p.publishedAt.toISOString()
          : String(p.publishedAt),
      authors: p.authors || [],
      sourceUrl: p.sourceUrl,
      externalId: p.externalId ?? null,
      category: p.category ?? undefined,
      contentType: (p.contentType as "blog" | "research" | undefined) ?? mode,
    }));

    const timestamps = rawPapers
      .map((p) =>
        p.updatedAt instanceof Date
          ? p.updatedAt.getTime()
          : p.publishedAt instanceof Date
          ? p.publishedAt.getTime()
          : 0
      )
      .filter((t) => t > 0);

    if (timestamps.length > 0) {
      lastUpdatedIso = new Date(Math.max(...timestamps)).toISOString();
    }
  } catch (err) {
    console.warn(`SSR getCompanyPapers failed for ${company.slug} (${mode}):`, err);
  }

  const companyFaqs: FaqItem[] = [
    {
      question: `What kind of research and engineering does ${company.name} publish?`,
      answer: `${company.name} focuses on ${company.tagline}. ${company.description}`,
    },
    {
      question: `How does What2Build extract project ideas from ${company.name}'s publications?`,
      answer: `We track official arXiv preprints authored by ${company.name} researchers and official technical engineering blog articles, analyzing architectures, systems, and methods to generate 3-tiered developer project specifications.`,
    },
    {
      question: `Can I switch between ${company.name} engineering blogs and academic research papers?`,
      answer: `Yes. Use the tabs above the publication list to switch between Engineering Blogs (/companies/${company.slug}) for production system posts and Research Papers (/companies/${company.slug}/research) for academic preprints.`,
    },
  ];

  const baseCompanyUrl = `${SITE_CONFIG.url}/companies/${company.slug}`;
  const canonicalUrl = isResearch ? `${baseCompanyUrl}/research` : baseCompanyUrl;

  const pageTitle = isResearch
    ? `${company.name} Research Papers & AI Project Ideas`
    : `${company.name} AI Research & Engineering Projects`;

  const breadcrumbItems: Record<string, unknown>[] = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_CONFIG.url,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Companies",
      item: `${SITE_CONFIG.url}/companies`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: company.name,
      item: baseCompanyUrl,
    },
  ];

  if (isResearch) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 4,
      name: "Research Papers",
      item: canonicalUrl,
    });
  }

  const paperListItems = initialPapers.slice(0, 10).map((paper, index) => {
    const paperUrl = isPersistedPaperId(paper.id)
      ? `${SITE_CONFIG.url}/papers/${encodeURIComponent(paper.id)}/ideas`
      : paper.sourceUrl;

    return {
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": isResearch ? "ScholarlyArticle" : "TechArticle",
        name: paper.title,
        headline: paper.title,
        url: paperUrl,
        datePublished:
          typeof paper.publishedAt === "string"
            ? paper.publishedAt
            : paper.publishedAt.toISOString(),
      },
    };
  });

  const jsonLdItems: Record<string, unknown>[] = [
    {
      "@type": "CollectionPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: pageTitle,
      description: company.description,
      isPartOf: {
        "@id": `${SITE_CONFIG.url}/#website`,
      },
      about: {
        "@id": `${canonicalUrl}#organization`,
      },
      ...(paperListItems.length > 0
        ? { mainEntity: { "@id": `${canonicalUrl}#papers` } }
        : {}),
      ...(lastUpdatedIso ? { dateModified: lastUpdatedIso } : {}),
    },
    {
      "@type": "Organization",
      "@id": `${canonicalUrl}#organization`,
      name: company.name,
      url: company.blogUrl || company.researchUrl,
      description: company.description,
    },
    ...(paperListItems.length > 0
      ? [
          {
            "@type": "ItemList",
            "@id": `${canonicalUrl}#papers`,
            name: isResearch
              ? `${company.name} Research Papers`
              : `${company.name} Engineering Blog Posts`,
            numberOfItems: paperListItems.length,
            itemListElement: paperListItems,
          },
        ]
      : []),
    {
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumb`,
      itemListElement: breadcrumbItems,
    },
    {
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      mainEntity: companyFaqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ];

  return (
    <>
      <JsonLd items={jsonLdItems} />
      <CompanyResearchClient
        companySlug={company.slug}
        initialCompany={company}
        initialPapers={initialPapers}
        initialFilterMode={mode}
        lastUpdatedIso={lastUpdatedIso}
        faqs={companyFaqs}
      />
    </>
  );
}
