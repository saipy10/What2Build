import { SITE_CONFIG, isPersistedPaperId } from "@/lib/seo-config";
import { SUPPORTED_COMPANIES } from "@/lib/companies";
import { getLatestCachedPapers, FeedPaperItem } from "@/lib/paperService";

export const revalidate = 3600;

export async function GET() {
  const companies = Object.values(SUPPORTED_COMPANIES);
  const latestPapers = await getLatestCachedPapers(120).catch(
    () => [] as FeedPaperItem[]
  );

  const papersBySlug = new Map<string, FeedPaperItem[]>();
  for (const paper of latestPapers) {
    const group = papersBySlug.get(paper.companySlug) || [];
    if (group.length < 5) {
      group.push(paper);
      papersBySlug.set(paper.companySlug, group);
    }
  }

  const companySections = companies
    .map((c) => {
      const posts = papersBySlug.get(c.slug) || [];
      const postsBlock =
        posts.length > 0
          ? posts
              .map((p) => {
                const dateStr = p.publishedAt.toISOString().slice(0, 10);
                const ideasUrl =
                  p.persisted && isPersistedPaperId(p.id)
                    ? `${SITE_CONFIG.url}/papers/${encodeURIComponent(p.id)}/ideas`
                    : p.sourceUrl;
                return `  - [${p.title}](${ideasUrl}) (${p.contentType}, ${dateStr}) — Source: ${p.sourceUrl}`;
              })
              .join("\n")
          : `  - Browse live feed at ${SITE_CONFIG.url}/companies/${c.slug} and ${SITE_CONFIG.url}/companies/${c.slug}/research`;

      return `### ${c.name}
- Tagline: ${c.tagline}
- Summary: ${c.description}
- Engineering Blogs Hub: ${SITE_CONFIG.url}/companies/${c.slug}
- Research Papers Hub: ${SITE_CONFIG.url}/companies/${c.slug}/research
- Official Sources: Blog (${c.blogUrl}) | Research (${c.researchUrl})
- Latest Indexed Publications:
${postsBlock}`;
    })
    .join("\n\n");

  const content = `# ${SITE_CONFIG.name} — Full Index

> ${SITE_CONFIG.description}

- Canonical URL: ${SITE_CONFIG.url}
- Compact Index: ${SITE_CONFIG.url}/llms.txt
- Companies Directory: ${SITE_CONFIG.url}/companies
- RSS Feed: ${SITE_CONFIG.url}/feed.xml
- Sitemap: ${SITE_CONFIG.url}/sitemap.xml
- Total Supported Organizations: ${companies.length}

## Organizations & Latest Publications

${companySections}
`;

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
