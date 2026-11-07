import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seo-config";
import { SUPPORTED_COMPANIES } from "@/lib/companies";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;
  const now = new Date();

  // Root Homepage
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  // Company routes for all supported AI organizations
  const companyRoutes: MetadataRoute.Sitemap = Object.keys(SUPPORTED_COMPANIES).map(
    (slug) => ({
      url: `${baseUrl}/companies/${slug}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    })
  );

  return [...staticRoutes, ...companyRoutes];
}

