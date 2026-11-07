import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SUPPORTED_COMPANIES } from "@/lib/companies";
import { SITE_CONFIG } from "@/lib/seo-config";
import { JsonLd } from "@/components/seo/JsonLd";
import { CompanyResearchClient } from "@/components/CompanyResearchClient";
import { FaqItem } from "@/components/FaqSection";

interface CompanyPageProps {
  params: Promise<{ companySlug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(SUPPORTED_COMPANIES).map((slug) => ({
    companySlug: slug,
  }));
}

export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
  const resolved = await params;
  const company = SUPPORTED_COMPANIES[resolved.companySlug];

  if (!company) {
    return {
      title: "Organization Not Found",
    };
  }

  const title = `${company.name} AI Research & Engineering Projects`;
  const description = `Explore official research papers and engineering blog posts from ${company.name} (${company.tagline}). Turn frontier AI breakthroughs into actionable coding projects.`;
  const canonicalUrl = `${SITE_CONFIG.url}/companies/${company.slug}`;

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

export default async function CompanyResearchPage({ params }: CompanyPageProps) {
  const resolved = await params;
  const company = SUPPORTED_COMPANIES[resolved.companySlug];

  if (!company) {
    notFound();
  }

  const companyFaqs: FaqItem[] = [
    {
      question: `What kind of research and engineering does ${company.name} publish?`,
      answer: `${company.name} focuses on ${company.tagline}. ${company.description}`,
    },
    {
      question: `How does What2Build extract project ideas from ${company.name}'s publications?`,
      answer: `We monitor both official arXiv preprints authored by ${company.name} researchers and official technical blog articles, analyzing algorithms, architectures, and datasets to design 3-tiered developer projects.`,
    },
    {
      question: `Can I toggle between ${company.name} blog articles and academic papers?`,
      answer: `Yes. Use the filter toggle above the publication list to switch between 'Engineering Blogs' for production architecture updates and 'Research Papers' for academic preprints.`,
    },
  ];

  const canonicalUrl = `${SITE_CONFIG.url}/companies/${company.slug}`;

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
          name: "Companies",
          item: `${SITE_CONFIG.url}/#companies`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: company.name,
          item: canonicalUrl,
        },
      ],
    },
    {
      "@type": "Organization",
      "@id": `${canonicalUrl}#organization`,
      name: company.name,
      url: company.blogUrl || company.researchUrl,
      description: company.description,
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
        faqs={companyFaqs}
      />
    </>
  );
}
