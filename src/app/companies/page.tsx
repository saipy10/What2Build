import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Newspaper } from "lucide-react";
import { SUPPORTED_COMPANIES } from "@/lib/companies";
import { SITE_CONFIG } from "@/lib/seo-config";
import { JsonLd } from "@/components/seo/JsonLd";
import { CompanyLogo } from "@/components/CompanyLogos";

export const revalidate = 3600;

const companiesList = Object.values(SUPPORTED_COMPANIES);

export const metadata: Metadata = {
  title: "Supported AI Labs & Engineering Blogs",
  description: `Browse official engineering blogs and academic research papers from ${companiesList.length} organizations including OpenAI, Google DeepMind, Anthropic, Meta, NVIDIA, Netflix, Uber, and Stripe.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/companies`,
  },
  openGraph: {
    title: `Supported AI Labs & Engineering Blogs | ${SITE_CONFIG.name}`,
    description: `Browse official engineering blogs and academic research papers from ${companiesList.length} leading AI labs and tech companies.`,
    url: `${SITE_CONFIG.url}/companies`,
    siteName: SITE_CONFIG.name,
    locale: SITE_CONFIG.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Supported AI Labs & Engineering Blogs | ${SITE_CONFIG.name}`,
    description: `Browse official engineering blogs and academic research papers from ${companiesList.length} leading AI labs and tech companies.`,
  },
};

export default function CompaniesHubPage() {
  const canonicalUrl = `${SITE_CONFIG.url}/companies`;

  const jsonLdItems: Record<string, unknown>[] = [
    {
      "@type": "CollectionPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: "Supported AI Labs & Engineering Blogs",
      description: `Directory of ${companiesList.length} AI research labs and software engineering organizations tracked by ${SITE_CONFIG.name}.`,
      isPartOf: { "@id": `${SITE_CONFIG.url}/#website` },
      mainEntity: { "@id": `${canonicalUrl}#list` },
    },
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
          item: canonicalUrl,
        },
      ],
    },
    {
      "@type": "ItemList",
      "@id": `${canonicalUrl}#list`,
      name: "Supported Organizations",
      numberOfItems: companiesList.length,
      itemListElement: companiesList.map((company, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: company.name,
        url: `${SITE_CONFIG.url}/companies/${company.slug}`,
        description: company.tagline,
      })),
    },
  ];

  return (
    <>
      <JsonLd items={jsonLdItems} />
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-10 xl:px-16 pt-6 pb-12 sm:pt-8 sm:pb-16">
        <header className="max-w-3xl pb-8 border-b border-border">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
            AI Labs &amp; Engineering Organizations
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            What2Build tracks {companiesList.length} frontier AI research labs and software
            engineering teams. Choose any organization below to browse its official engineering
            blogs or academic research preprints and generate Beginner, Intermediate, and Advanced
            project specifications.
          </p>
        </header>

        <section aria-label="Organizations directory" className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {companiesList.map((company) => (
              <article
                key={company.slug}
                className="flex flex-col justify-between rounded-xl border border-border bg-surface p-5 sm:p-6 shadow-xs hover:border-border-strong transition-colors"
              >
                <div>
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-elevated p-2 text-foreground shadow-xs">
                      <CompanyLogo slug={company.slug} className="w-full h-full text-foreground" />
                    </div>
                    <h2 className="font-semibold text-lg text-foreground tracking-tight">
                      <Link
                        href={`/companies/${company.slug}`}
                        className="hover:text-accent transition-colors"
                      >
                        {company.name}
                      </Link>
                    </h2>
                  </div>

                  <p className="mt-3 text-xs font-medium text-foreground/85 leading-relaxed">
                    {company.tagline}
                  </p>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    {company.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-border flex flex-wrap items-center gap-2">
                  <Link
                    href={`/companies/${company.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-elevated px-3 py-1.5 text-xs font-medium text-foreground hover:border-border-strong transition-colors"
                  >
                    <Newspaper className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                    <span>Engineering Blogs</span>
                  </Link>
                  <Link
                    href={`/companies/${company.slug}/research`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors"
                  >
                    <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Research Papers</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
