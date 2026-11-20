import type { MetadataRoute } from "next";
import { SITE_CONFIG, isPersistedPaperId } from "@/lib/seo-config";
import { SUPPORTED_COMPANIES } from "@/lib/companies";
import {
  getCompanyLastUpdatedMap,
  getIndexablePapersForSitemap,
} from "@/lib/paperService";

export const revalidate = 3600;

// Cap paper-ideas URLs at 5,000 per sitemap to stay well below Google's 50,000-URL limit
// and keep generation fast. If indexable papers exceed this threshold, switch to Next.js
// `generateSitemaps()` to emit a sharded sitemap index (/sitemap/0.xml, /sitemap/1.xml, ...).
const MAX_PAPER_URLS = 5000;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;

  const [companyUpdatedMap, indexablePapers] = await Promise.all([
    getCompanyLastUpdatedMap().catch(() => ({} as Record<string, Date>)),
    getIndexablePapersForSitemap(MAX_PAPER_URLS).catch(() => []),
  ]);

  const allCompanyDates = Object.values(companyUpdatedMap);
  const latestSiteUpdate =
    allCompanyDates.length > 0
      ? new Date(Math.max(...allCompanyDates.map((d) => d.getTime())))
      : undefined;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      ...(latestSiteUpdate ? { lastModified: latestSiteUpdate } : {}),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/companies`,
      ...(latestSiteUpdate ? { lastModified: latestSiteUpdate } : {}),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const companyRoutes: MetadataRoute.Sitemap = Object.keys(
    SUPPORTED_COMPANIES
  ).flatMap((slug) => {
    const lastModified = companyUpdatedMap[slug];
    return [
      {
        url: `${baseUrl}/companies/${slug}`,
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: "daily" as const,
        priority: 0.85,
      },
      {
        url: `${baseUrl}/companies/${slug}/research`,
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: "daily" as const,
        priority: 0.8,
      },
    ];
  });

  // Only emit persisted Supabase paper IDs that have cached project ideas
  const paperRoutes: MetadataRoute.Sitemap = indexablePapers
    .filter((p) => isPersistedPaperId(p.id))
    .slice(0, MAX_PAPER_URLS)
    .map((paper) => ({
      url: `${baseUrl}/papers/${encodeURIComponent(paper.id)}/ideas`,
      lastModified: paper.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...companyRoutes, ...paperRoutes];
}
