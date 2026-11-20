import { SITE_CONFIG, isPersistedPaperId } from "@/lib/seo-config";
import { SUPPORTED_COMPANIES } from "@/lib/companies";
import { getLatestCachedPapers, FeedPaperItem } from "@/lib/paperService";

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const baseUrl = SITE_CONFIG.url;
  const papers = await getLatestCachedPapers(40).catch(
    () => [] as FeedPaperItem[]
  );

  const itemsXml =
    papers.length > 0
      ? papers
          .map((paper) => {
            const link =
              paper.persisted && isPersistedPaperId(paper.id)
                ? `${baseUrl}/papers/${encodeURIComponent(paper.id)}/ideas`
                : `${baseUrl}/companies/${paper.companySlug}${
                    paper.contentType === "research" ? "/research" : ""
                  }`;
            const guid =
              paper.persisted && isPersistedPaperId(paper.id)
                ? link
                : `${link}#${encodeURIComponent(paper.sourceUrl)}`;
            const summary =
              paper.description.length > 360
                ? `${paper.description.slice(0, 357).trimEnd()}...`
                : paper.description;

            return `    <item>
      <title>${escapeXml(`[${paper.companyName}] ${paper.title}`)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="${paper.persisted && isPersistedPaperId(paper.id) ? "true" : "false"}">${escapeXml(guid)}</guid>
      <pubDate>${paper.publishedAt.toUTCString()}</pubDate>
      <category>${escapeXml(paper.companyName)}</category>
      <category>${escapeXml(paper.contentType === "research" ? "Research Paper" : "Engineering Blog")}</category>
      <description>${escapeXml(summary || `Explore AI-generated Beginner, Intermediate, and Advanced project ideas based on ${paper.title}.`)}</description>
    </item>`;
          })
          .join("\n")
      : Object.values(SUPPORTED_COMPANIES)
          .map((company) => {
            const link = `${baseUrl}/companies/${company.slug}`;
            return `    <item>
      <title>${escapeXml(`${company.name} — Engineering Blogs & Research Projects`)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <category>${escapeXml(company.name)}</category>
      <description>${escapeXml(`${company.tagline}. ${company.description}`)}</description>
    </item>`;
          })
          .join("\n");

  const lastBuildDate =
    papers.length > 0 ? papers[0].updatedAt.toUTCString() : undefined;

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`)}</title>
    <link>${escapeXml(baseUrl)}</link>
    <atom:link href="${escapeXml(`${baseUrl}/feed.xml`)}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(SITE_CONFIG.description)}</description>
    <language>en-us</language>${lastBuildDate ? `\n    <lastBuildDate>${lastBuildDate}</lastBuildDate>` : ""}
${itemsXml}
  </channel>
</rss>
`;

  return new Response(rssXml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
