import { prisma, memoryDb } from "./db";
import { fetchCompanyBlogs, fetchArxivPapers, DiscoveredPaper } from "./crawler";
import { SUPPORTED_COMPANIES } from "./companies";

const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

export async function getCompanyPapers(
  companySlug: string,
  forceRefresh = false,
  filterType: "all" | "blog" | "research" = "blog"
) {
  const config = SUPPORTED_COMPANIES[companySlug];
  if (!config) {
    throw new Error(`Company not found: ${companySlug}`);
  }

  // Determine what crawler to use based on filter:
  // Default is "blog" (only company's respective blog pages).
  // "research" is ONLY used when research filter is turned on.
  const isResearchOnly = filterType === "research";

  // 1. In-memory storage / cache key strategy
  const cacheKey = `${companySlug}:${filterType}`;

  if (prisma) {
    try {
      let company = await prisma.company.findUnique({
        where: { slug: companySlug },
        include: {
          papers: {
            orderBy: { publishedAt: "desc" },
            take: 15,
          },
        },
      });

      if (!company) {
        company = await prisma.company.create({
          data: {
            slug: config.slug,
            name: config.name,
            description: config.description,
            researchUrl: config.researchUrl,
          },
          include: { papers: true },
        });
      }

      const hasValidCache =
        !forceRefresh &&
        company.papers &&
        company.papers.length >= 3 &&
        Date.now() - new Date(company.updatedAt).getTime() < CACHE_TTL_MS;

      if (hasValidCache) {
        return company.papers;
      }

      // Fetch from official blog OR arXiv research papers
      const discovered: DiscoveredPaper[] = isResearchOnly
        ? await fetchArxivPapers(companySlug, 10)
        : await fetchCompanyBlogs(companySlug, 10);

      if (discovered.length > 0) {
        for (const p of discovered) {
          await prisma.paper.upsert({
            where: { sourceUrl: p.sourceUrl },
            update: {
              title: p.title,
              description: p.description,
              publishedAt: p.publishedAt,
              authors: p.authors,
              externalId: p.externalId,
            },
            create: {
              companyId: company.id,
              title: p.title,
              description: p.description,
              publishedAt: p.publishedAt,
              authors: p.authors,
              sourceUrl: p.sourceUrl,
              externalId: p.externalId,
            },
          });
        }

        await prisma.company.update({
          where: { id: company.id },
          data: { updatedAt: new Date() },
        });

        return await prisma.paper.findMany({
          where: { companyId: company.id },
          orderBy: { publishedAt: "desc" },
          take: 10,
        });
      }

      return company.papers;
    } catch (err) {
      console.warn("Prisma query failed, falling back to memory repository:", err);
    }
  }

  // 2. In-memory storage fallback
  let company = memoryDb.getCompanyBySlug(companySlug);
  if (!company) {
    company = memoryDb.saveCompany({
      id: companySlug,
      name: config.name,
      slug: config.slug,
      description: config.description,
      researchUrl: config.researchUrl,
    });
  }

  const cachedPapers = memoryDb.getPapersByCompany(cacheKey);
  const lastRefreshed = memoryDb.getLastRefreshed(cacheKey);
  const isFresh =
    !forceRefresh &&
    cachedPapers.length >= 3 &&
    lastRefreshed &&
    Date.now() - lastRefreshed.getTime() < CACHE_TTL_MS;

  if (isFresh) {
    return cachedPapers.slice(0, 10);
  }

  // Blog mode: fetch only from company's respective blog pages.
  // Research mode: query arXiv only when filter is turned on for research papers.
  const discovered: DiscoveredPaper[] = isResearchOnly
    ? await fetchArxivPapers(companySlug, 10)
    : await fetchCompanyBlogs(companySlug, 10);

  const memoryPapers = discovered.map((p, idx) => ({
    id: `${companySlug}-${filterType}-${idx}-${Buffer.from(p.sourceUrl).toString("base64").slice(0, 12)}`,
    companyId: cacheKey,
    title: p.title,
    description: p.description,
    publishedAt: p.publishedAt,
    authors: p.authors,
    sourceUrl: p.sourceUrl,
    externalId: p.externalId,
    category: p.category,
    contentType: p.contentType || (isResearchOnly ? "research" : "blog"),
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  memoryDb.savePapers(memoryPapers);
  memoryDb.setLastRefreshed(cacheKey, new Date());

  return memoryPapers.slice(0, 10);
}

export async function getPaperById(paperId: string) {
  if (prisma) {
    try {
      const paper = await prisma.paper.findUnique({
        where: { id: paperId },
        include: { company: true },
      });
      if (paper) return paper;
    } catch (err) {
      console.warn("Prisma error in getPaperById:", err);
    }
  }

  const memPaper = memoryDb.getPaperById(paperId);
  if (memPaper) {
    const rawSlug = memPaper.companyId.split(":")[0];
    const compConfig = SUPPORTED_COMPANIES[rawSlug];
    return {
      ...memPaper,
      company: compConfig
        ? {
            id: compConfig.slug,
            name: compConfig.name,
            slug: compConfig.slug,
            description: compConfig.description,
            researchUrl: compConfig.researchUrl,
          }
        : {
            id: memPaper.companyId,
            name: memPaper.companyId,
            slug: memPaper.companyId,
            description: "",
            researchUrl: "",
          },
    };
  }

  return null;
}
