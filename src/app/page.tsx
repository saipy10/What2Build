import React from "react";
import type { Metadata } from "next";
import { SUPPORTED_COMPANIES } from "@/lib/companies";
import { SITE_CONFIG, getHomeFaqs } from "@/lib/seo-config";
import { getCompanyLastUpdatedMap } from "@/lib/paperService";
import { HomeClient } from "@/components/HomeClient";
import { JsonLd } from "@/components/seo/JsonLd";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: {
    absolute: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
  },
  description: SITE_CONFIG.description,
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    locale: SITE_CONFIG.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
  },
};

export default async function HomePage() {
  const companies = Object.values(SUPPORTED_COMPANIES);
  const homeFaqs = getHomeFaqs();

  let lastUpdatedIso: string | null = null;
  try {
    const updatedMap = await getCompanyLastUpdatedMap();
    const timestamps = Object.values(updatedMap).map((d) => d.getTime());
    if (timestamps.length > 0) {
      lastUpdatedIso = new Date(Math.max(...timestamps)).toISOString();
    }
  } catch {
    // Gracefully omit when database is unavailable
  }

  const jsonLdItems: Record<string, unknown>[] = [
    {
      "@type": "Organization",
      "@id": `${SITE_CONFIG.url}/#organization`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      description: SITE_CONFIG.description,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.url}/icon-512.png`,
        width: 512,
        height: 512,
      },
      ...(SITE_CONFIG.social.sameAs.length > 0
        ? { sameAs: SITE_CONFIG.social.sameAs }
        : {}),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_CONFIG.url}/#website`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      description: SITE_CONFIG.description,
      publisher: {
        "@id": `${SITE_CONFIG.url}/#organization`,
      },
    },
    {
      "@type": "ItemList",
      "@id": `${SITE_CONFIG.url}/#companies`,
      name: "Supported AI Research Labs & Engineering Organizations",
      numberOfItems: companies.length,
      itemListElement: companies.map((company, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: company.name,
        url: `${SITE_CONFIG.url}/companies/${company.slug}`,
        description: company.tagline,
      })),
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_CONFIG.url}/#faq`,
      mainEntity: homeFaqs.map((faq) => ({
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
      <div className="relative mx-auto w-full px-4 sm:px-6 lg:px-10 xl:px-16 pt-8 pb-16 sm:pt-12 sm:pb-24">
        <HomeClient
          companies={companies}
          faqs={homeFaqs}
          lastUpdatedIso={lastUpdatedIso}
        />
      </div>
    </>
  );
}
