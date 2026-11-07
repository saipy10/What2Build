import { SITE_CONFIG } from "@/lib/seo-config";
import { SUPPORTED_COMPANIES } from "@/lib/companies";

export const dynamic = "force-static";

export async function GET() {
  const companyList = Object.values(SUPPORTED_COMPANIES)
    .map((c) => `- [${c.name}](${SITE_CONFIG.url}/companies/${c.slug}): ${c.tagline}`)
    .join("\n");

  const content = `# ${SITE_CONFIG.name}

> ${SITE_CONFIG.description}

## Core Mission
What2Build bridges the gap between theoretical AI breakthroughs and practical software engineering. We index official engineering blogs, research preprints, and system architectures from industry-leading AI research labs, synthesizing them into actionable developer project specifications across Beginner, Intermediate, and Advanced tiers.

## Supported Frontier Organizations & Labs
${companyList}

## Project Idea Schema
Every research publication processed by What2Build produces 3 levels of projects:
1. **Beginner**: Minimal viable proofs-of-concept, prompt pipelines, API wrappers, or toy implementations focusing on core ideas.
2. **Intermediate**: Production microservices, evaluation harnesses, vector retrieval pipelines, or fine-tuning workflows.
3. **Advanced**: Distributed systems, custom kernel optimizations, RLHF loops, agentic multi-step reasoning engines, or full-scale reproductions.

## Key Endpoints
- Homepage: ${SITE_CONFIG.url}
- Sitemap: ${SITE_CONFIG.url}/sitemap.xml
`;

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}

