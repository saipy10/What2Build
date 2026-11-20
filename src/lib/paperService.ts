import { memoryDb } from "./db";
import { supabaseAdmin } from "./supabase";
import { fetchCompanyBlogs, fetchArxivPapers, DiscoveredPaper } from "./crawler";
import { SUPPORTED_COMPANIES } from "./companies";

const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

/**
 * Returns papers ordered latest -> oldest regardless of the source
 * (Supabase, in-memory cache, or freshly crawled).
 */
export async function getCompanyPapers(
  companySlug: string,
  forceRefresh = false,
  filterType: "all" | "blog" | "research" = "blog",
  limit = 20
) {
  const papers = await loadCompanyPapers(companySlug, forceRefresh, filterType, limit);
  return [...papers].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

async function loadCompanyPapers(
  companySlug: string,
  forceRefresh: boolean,
  filterType: "all" | "blog" | "research",
  limit: number
) {
  const config = SUPPORTED_COMPANIES[companySlug];
  if (!config) {
    throw new Error(`Company not found: ${companySlug}`);
  }

  const isResearchOnly = filterType === "research";
  const cacheKey = `${companySlug}:${filterType}`;
  const targetContentType = isResearchOnly ? "research" : "blog";
  let discovered: DiscoveredPaper[] | null = null;

  const discoverPapers = async (): Promise<DiscoveredPaper[]> => {
    if (discovered !== null) {
      return discovered;
    }
    const fetchCount = Math.max(limit, 20);
    discovered = isResearchOnly
      ? await fetchArxivPapers(companySlug, fetchCount)
      : await fetchCompanyBlogs(companySlug, fetchCount);
    return discovered;
  };

  interface DbPaperRow {
    id: string;
    company_id: string;
    title: string;
    description: string;
    published_at: string;
    authors?: string[] | null;
    source_url: string;
    external_id?: string | null;
    category?: string | null;
    content_type?: "blog" | "research" | null;
    created_at: string;
    updated_at: string;
  }

  const mapDbPaper = (p: DbPaperRow) => ({
    id: p.id,
    companyId: p.company_id,
    title: p.title,
    description: p.description,
    publishedAt: new Date(p.published_at),
    authors: p.authors || [],
    sourceUrl: p.source_url,
    externalId: p.external_id,
    category: p.category,
    contentType: p.content_type,
    createdAt: new Date(p.created_at),
    updatedAt: new Date(p.updated_at),
  });

  // 1. Try Supabase if configured
  if (supabaseAdmin) {
    try {
      const { data: companyData, error: companyErr } = await supabaseAdmin
        .from("companies")
        .select("id, slug, updated_at")
        .eq("slug", companySlug)
        .maybeSingle();

      if (companyErr) {
        console.warn("Supabase company query error:", companyErr.message);
      }

      let companyId = companyData?.id;

      if (!companyId) {
        const { data: newCompany, error: insertErr } = await supabaseAdmin
          .from("companies")
          .insert({
            slug: config.slug,
            name: config.name,
            description: config.description,
            research_url: config.researchUrl,
          })
          .select("id")
          .single();

        if (!insertErr && newCompany) {
          companyId = newCompany.id;
        }
      }

      if (companyId) {
        let cacheQuery = supabaseAdmin
          .from("papers")
          .select("*")
          .eq("company_id", companyId)
          .order("published_at", { ascending: false })
          .limit(limit);

        if (filterType !== "all") {
          cacheQuery = cacheQuery.eq("content_type", targetContentType);
        }

        if (companySlug === "huggingface") {
          if (targetContentType === "blog") {
            cacheQuery = cacheQuery.eq("category", "Community Blog");
          } else if (targetContentType === "research") {
            cacheQuery = cacheQuery.like("source_url", "https://huggingface.co/blog%");
          }
        }

        const { data: cachedDbPapers } = await cacheQuery;

        const memLastRefreshed = memoryDb.getLastRefreshed(cacheKey);
        const latestDbPaperTime =
          cachedDbPapers && cachedDbPapers.length > 0
            ? Math.max(
                ...cachedDbPapers.map((p) =>
                  new Date(p.updated_at || p.created_at || 0).getTime()
                )
              )
            : 0;
        const lastFilterRefreshTime = memLastRefreshed
          ? memLastRefreshed.getTime()
          : latestDbPaperTime;

        const hasValidCache =
          !forceRefresh &&
          cachedDbPapers &&
          cachedDbPapers.length > 0 &&
          lastFilterRefreshTime > 0 &&
          Date.now() - lastFilterRefreshTime < CACHE_TTL_MS;

        if (hasValidCache) {
          return cachedDbPapers.map(mapDbPaper);
        }

        // Fetch fresh papers from source (at most once per call)
        const liveDiscovered = await discoverPapers();

        if (liveDiscovered.length > 0) {
          const nowIso = new Date().toISOString();
          const rowsToUpsert = liveDiscovered.map((p) => ({
            company_id: companyId,
            title: p.title,
            description: p.description,
            published_at: p.publishedAt.toISOString(),
            authors: p.authors,
            source_url: p.sourceUrl,
            external_id: p.externalId,
            category: p.category,
            content_type: p.contentType || targetContentType,
            updated_at: nowIso,
          }));

          await supabaseAdmin.from("papers").upsert(rowsToUpsert, {
            onConflict: "source_url",
          });

          await supabaseAdmin
            .from("companies")
            .update({ updated_at: nowIso })
            .eq("id", companyId);

          memoryDb.setLastRefreshed(cacheKey, new Date());

          let refreshQuery = supabaseAdmin
            .from("papers")
            .select("*")
            .eq("company_id", companyId)
            .order("published_at", { ascending: false })
            .limit(limit);

          if (filterType !== "all") {
            refreshQuery = refreshQuery.eq("content_type", targetContentType);
          }

          if (companySlug === "huggingface") {
            if (targetContentType === "blog") {
              refreshQuery = refreshQuery.eq("category", "Community Blog");
            } else if (targetContentType === "research") {
              refreshQuery = refreshQuery.like("source_url", "https://huggingface.co/blog%");
            }
          }

          const { data: refreshedPapers } = await refreshQuery;

          if (refreshedPapers && refreshedPapers.length > 0) {
            return refreshedPapers.map(mapDbPaper);
          }
        } else {
          return cachedDbPapers ? cachedDbPapers.map(mapDbPaper) : [];
        }
      }
    } catch (err) {
      console.warn("Supabase query failed, falling back to memory repository:", err);
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
    cachedPapers.length > 0 &&
    lastRefreshed &&
    Date.now() - lastRefreshed.getTime() < CACHE_TTL_MS;

  if (isFresh) {
    return cachedPapers.slice(0, limit);
  }

  const fallbackDiscovered = await discoverPapers();

  const memoryPapers = fallbackDiscovered.map((p, idx) => ({
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

  return memoryDb.getPapersByCompany(cacheKey).slice(0, limit);
}

export async function getPaperById(paperId: string) {
  if (supabaseAdmin) {
    try {
      const { data: paper } = await supabaseAdmin
        .from("papers")
        .select("*, companies(*)")
        .eq("id", paperId)
        .maybeSingle();

      if (paper) {
        return {
          id: paper.id,
          companyId: paper.company_id,
          title: paper.title,
          description: paper.description,
          publishedAt: new Date(paper.published_at),
          authors: paper.authors || [],
          sourceUrl: paper.source_url,
          externalId: paper.external_id,
          category: paper.category,
          contentType: paper.content_type as "blog" | "research" | null | undefined,
          createdAt: new Date(paper.created_at),
          updatedAt: new Date(paper.updated_at),
          persisted: true,
          company: paper.companies
            ? {
                id: paper.companies.id,
                name: paper.companies.name,
                slug: paper.companies.slug,
                description: paper.companies.description,
                researchUrl: paper.companies.research_url,
              }
            : undefined,
        };
      }
    } catch (err) {
      console.warn("Supabase error in getPaperById:", err);
    }
  }

  const memPaper = memoryDb.getPaperById(paperId);
  if (memPaper) {
    const rawSlug = memPaper.companyId.split(":")[0];
    const compConfig = SUPPORTED_COMPANIES[rawSlug];
    return {
      ...memPaper,
      persisted: false,
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

export interface CachedProjectIdea {
  id: string;
  paperId: string;
  title: string;
  description: string;
  features: string[];
  skills: string[];
  technologies: string[];
  difficulty: string;
  researchConnection: string;
  createdAt: string;
  updatedAt: string;
}

export async function getCachedIdeasForPaper(
  paperId: string
): Promise<CachedProjectIdea[]> {
  if (supabaseAdmin) {
    try {
      const { data: ideas, error } = await supabaseAdmin
        .from("project_ideas")
        .select("*")
        .eq("paper_id", paperId)
        .order("created_at", { ascending: true });

      if (!error && ideas && ideas.length > 0) {
        return ideas.map((i) => ({
          id: i.id,
          paperId: i.paper_id,
          title: i.title,
          description: i.description,
          features: i.features || [],
          skills: i.skills || [],
          technologies: i.technologies || [],
          difficulty: i.difficulty,
          researchConnection: i.research_connection || "",
          createdAt: new Date(i.created_at).toISOString(),
          updatedAt: new Date(i.updated_at || i.created_at).toISOString(),
        }));
      }
    } catch (err) {
      console.warn("Supabase error in getCachedIdeasForPaper:", err);
    }
  }

  const memIdeas = memoryDb.getIdeasByPaperId(paperId);
  return memIdeas.map((i) => ({
    id: i.id,
    paperId: i.paperId,
    title: i.title,
    description: i.description,
    features: i.features || [],
    skills: i.skills || [],
    technologies: i.technologies || [],
    difficulty: i.difficulty,
    researchConnection: i.researchConnection || "",
    createdAt: i.createdAt.toISOString(),
    updatedAt: i.updatedAt.toISOString(),
  }));
}

/**
 * Returns the most recent `updated_at` timestamp per company slug from Supabase
 * (falling back to in-memory refresh timestamps if Supabase is unavailable).
 */
export async function getCompanyLastUpdatedMap(): Promise<Record<string, Date>> {
  const result: Record<string, Date> = {};

  if (supabaseAdmin) {
    try {
      const { data: companies, error } = await supabaseAdmin
        .from("companies")
        .select("id, slug, updated_at");

      if (!error && companies) {
        const companyIdToSlug = new Map<string, string>();
        for (const c of companies) {
          if (c.slug) {
            companyIdToSlug.set(c.id, c.slug);
            if (c.updated_at) {
              result[c.slug] = new Date(c.updated_at);
            }
          }
        }

        const { data: latestPapers } = await supabaseAdmin
          .from("papers")
          .select("company_id, updated_at")
          .order("updated_at", { ascending: false })
          .limit(500);

        if (latestPapers) {
          for (const row of latestPapers) {
            const slug = companyIdToSlug.get(row.company_id);
            if (!slug || !row.updated_at) continue;
            const ts = new Date(row.updated_at);
            if (!result[slug] || ts.getTime() > result[slug].getTime()) {
              result[slug] = ts;
            }
          }
        }

        return result;
      }
    } catch (err) {
      console.warn("Supabase error in getCompanyLastUpdatedMap:", err);
    }
  }

  for (const slug of Object.keys(SUPPORTED_COMPANIES)) {
    const blogTs = memoryDb.getLastRefreshed(`${slug}:blog`);
    const researchTs = memoryDb.getLastRefreshed(`${slug}:research`);
    const latest =
      blogTs && researchTs
        ? blogTs > researchTs
          ? blogTs
          : researchTs
        : blogTs || researchTs;
    if (latest) {
      result[slug] = latest;
    }
  }

  return result;
}

/**
 * Returns persisted Supabase paper IDs that have at least one cached project idea,
 * suitable for inclusion in sitemap.xml.
 */
export async function getIndexablePapersForSitemap(
  limit = 5000
): Promise<Array<{ id: string; updatedAt: Date }>> {
  if (!supabaseAdmin) return [];

  try {
    const { data: ideaRows, error } = await supabaseAdmin
      .from("project_ideas")
      .select("paper_id, updated_at, created_at")
      .order("updated_at", { ascending: false })
      .limit(limit * 3);

    if (error || !ideaRows) return [];

    const byPaper = new Map<string, Date>();
    for (const row of ideaRows) {
      if (!row.paper_id) continue;
      const ts = new Date(row.updated_at || row.created_at || Date.now());
      const existing = byPaper.get(row.paper_id);
      if (!existing || ts.getTime() > existing.getTime()) {
        byPaper.set(row.paper_id, ts);
      }
      if (byPaper.size >= limit) break;
    }

    return Array.from(byPaper.entries()).map(([id, updatedAt]) => ({
      id,
      updatedAt,
    }));
  } catch (err) {
    console.warn("Supabase error in getIndexablePapersForSitemap:", err);
    return [];
  }
}

export interface FeedPaperItem {
  id: string;
  title: string;
  description: string;
  sourceUrl: string;
  publishedAt: Date;
  updatedAt: Date;
  contentType: "blog" | "research";
  companySlug: string;
  companyName: string;
  persisted: boolean;
}

/**
 * Returns latest cached papers across all companies for RSS (/feed.xml) and /llms-full.txt.
 * Does not trigger live crawls so these endpoints stay fast and cacheable.
 */
export async function getLatestCachedPapers(limit = 40): Promise<FeedPaperItem[]> {
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("papers")
        .select("id, title, description, source_url, published_at, updated_at, content_type, companies(slug, name)")
        .order("published_at", { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) {
        return data
          .map((row) => {
            const comp = Array.isArray(row.companies)
              ? row.companies[0]
              : row.companies;
            const slug = comp?.slug || "";
            const name = comp?.name || SUPPORTED_COMPANIES[slug]?.name || slug;
            return {
              id: row.id,
              title: row.title,
              description: row.description || "",
              sourceUrl: row.source_url,
              publishedAt: new Date(row.published_at),
              updatedAt: new Date(row.updated_at || row.published_at),
              contentType: (row.content_type === "research" ? "research" : "blog") as
                | "blog"
                | "research",
              companySlug: slug,
              companyName: name,
              persisted: true,
            };
          })
          .filter((item) => Boolean(item.companySlug));
      }
    } catch (err) {
      console.warn("Supabase error in getLatestCachedPapers:", err);
    }
  }

  // Fallback to whatever is currently in memoryDb
  const memItems: FeedPaperItem[] = [];
  for (const comp of Object.values(SUPPORTED_COMPANIES)) {
    for (const mode of ["blog", "research"] as const) {
      const papers = memoryDb.getPapersByCompany(`${comp.slug}:${mode}`);
      for (const p of papers) {
        memItems.push({
          id: p.id,
          title: p.title,
          description: p.description || "",
          sourceUrl: p.sourceUrl,
          publishedAt: p.publishedAt,
          updatedAt: p.updatedAt,
          contentType: mode,
          companySlug: comp.slug,
          companyName: comp.name,
          persisted: false,
        });
      }
    }
  }

  return memItems
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, limit);
}
