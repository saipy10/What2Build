import { SITE_CONFIG } from "@/lib/seo-config";
import { SUPPORTED_COMPANIES } from "@/lib/companies";

export const dynamic = "force-static";

export async function GET() {
  const companies = Object.values(SUPPORTED_COMPANIES);

  const companyList = companies
    .map(
      (c) =>
        `- **${c.name}**: ${c.tagline}\n  - Engineering Blogs: ${SITE_CONFIG.url}/companies/${c.slug}\n  - Research Papers: ${SITE_CONFIG.url}/companies/${c.slug}/research`
    )
    .join("\n");

  const content = `# ${SITE_CONFIG.name}

> ${SITE_CONFIG.description}

## Core Mission
What2Build bridges frontier AI research and software engineering blogs with hands-on software development. We track official engineering blogs and academic research preprints across ${companies.length} organizations, synthesizing them into actionable, AI-generated developer project specifications across Beginner, Intermediate, and Advanced tiers.

## Supported Organizations (${companies.length})
${companyList}

## Project Idea Schema
Every publication processed by What2Build produces 3 AI-generated project specifications:
1. **Beginner**: Minimal viable proofs-of-concept, prompt pipelines, API integrations, or focused implementations.
2. **Intermediate**: Production microservices, evaluation harnesses, vector retrieval pipelines, or fine-tuning workflows.
3. **Advanced**: Distributed systems, custom kernel optimizations, RLHF loops, agentic reasoning engines, or large-scale reproductions.

## Key Endpoints
- Homepage: ${SITE_CONFIG.url}
- Companies Directory: ${SITE_CONFIG.url}/companies
- Full LLM Context (with latest posts): ${SITE_CONFIG.url}/llms-full.txt
- RSS Feed: ${SITE_CONFIG.url}/feed.xml
- Sitemap: ${SITE_CONFIG.url}/sitemap.xml
`;

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
