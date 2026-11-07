import { memoryDb } from "./db";
import { supabaseAdmin } from "./supabase";
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

  const isResearchOnly = filterType === "research";
  const cacheKey = `${companySlug}:${filterType}`;

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
        const { data: cachedDbPapers } = await supabaseAdmin
          .from("papers")
          .select("*")
          .eq("company_id", companyId)
          .order("published_at", { ascending: false })
          .limit(15);

        const hasValidCache =
          !forceRefresh &&
          cachedDbPapers &&
          cachedDbPapers.length >= 3 &&
          companyData?.updated_at &&
          Date.now() - new Date(companyData.updated_at).getTime() < CACHE_TTL_MS;

        if (hasValidCache) {
          return cachedDbPapers.map((p) => ({
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
          }));
        }

        // Fetch fresh papers from source
        const discovered: DiscoveredPaper[] = isResearchOnly
          ? await fetchArxivPapers(companySlug, 10)
          : await fetchCompanyBlogs(companySlug, 10);

        if (discovered.length > 0) {
          const rowsToUpsert = discovered.map((p) => ({
            company_id: companyId,
            title: p.title,
            description: p.description,
            published_at: p.publishedAt.toISOString(),
            authors: p.authors,
            source_url: p.sourceUrl,
            external_id: p.externalId,
            category: p.category,
            content_type: p.contentType || (isResearchOnly ? "research" : "blog"),
          }));

          await supabaseAdmin.from("papers").upsert(rowsToUpsert, {
            onConflict: "source_url",
          });

          await supabaseAdmin
            .from("companies")
            .update({ updated_at: new Date().toISOString() })
            .eq("id", companyId);

          const { data: refreshedPapers } = await supabaseAdmin
            .from("papers")
            .select("*")
            .eq("company_id", companyId)
            .order("published_at", { ascending: false })
            .limit(10);

          if (refreshedPapers && refreshedPapers.length > 0) {
            return refreshedPapers.map((p) => ({
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
            }));
          }
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
    cachedPapers.length >= 3 &&
    lastRefreshed &&
    Date.now() - lastRefreshed.getTime() < CACHE_TTL_MS;

  if (isFresh) {
    return cachedPapers.slice(0, 10);
  }

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
          contentType: paper.content_type,
          createdAt: new Date(paper.created_at),
          updatedAt: new Date(paper.updated_at),
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
