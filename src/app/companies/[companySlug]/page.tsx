"use client";

import React, { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Newspaper,
  BookOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PaperCard, PaperData } from "@/components/PaperCard";
import { LoadingState, ErrorState, EmptyState } from "@/components/States";
import { RefreshButton } from "@/components/RefreshButton";
import { CompanyLogo } from "@/components/CompanyLogos";
import { Collapsible } from "@/components/Collapsible";
import { toast } from "sonner";

interface CompanyMeta {
  name: string;
  slug: string;
  description: string;
  tagline: string;
  researchUrl: string;
  blogUrl?: string;
  color: string;
}

export default function CompanyResearchPage({
  params,
}: {
  params: Promise<{ companySlug: string }>;
}) {
  const resolvedParams = use(params);
  const companySlug = resolvedParams.companySlug;

  const [company, setCompany] = useState<CompanyMeta | null>(null);
  const [papers, setPapers] = useState<PaperData[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<"blog" | "research">("blog");

  const fetchPapers = useCallback(
    async (force = false, filterOverride?: "blog" | "research", requestedLimit = 10) => {
      const activeFilter = filterOverride || filterMode;
      try {
        if (force) {
          setRefreshing(true);
        } else if (requestedLimit > 10) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const endpoint = force
          ? `/api/companies/${companySlug}/refresh?filter=${activeFilter}&limit=${requestedLimit}`
          : `/api/companies/${companySlug}/papers?filter=${activeFilter}&limit=${requestedLimit}`;

        const method = force ? "POST" : "GET";
        const res = await fetch(endpoint, { method });
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(
            data.error || `Failed to load ${activeFilter === "research" ? "research papers" : "company blogs"}`
          );
        }

        const fetchedPapers: PaperData[] = data.papers || [];
        setPapers(fetchedPapers);
        if (data.company) {
          setCompany(data.company);
        }
        if (force) {
          setVisibleCount(5);
          toast.success("Feed refreshed with latest publications");
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while fetching updates.";
        setError(message);
        if (force) {
          toast.error("Failed to refresh feed");
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [companySlug, filterMode]
  );

  const handleShowMore = async () => {
    // If we have more already fetched in state than currently shown
    if (visibleCount < papers.length) {
      setVisibleCount((prev) => Math.min(prev + 5, papers.length));
    } else {
      // Need to fetch 10 more from backend
      const nextTotalLimit = papers.length + 10;
      await fetchPapers(false, filterMode, nextTotalLimit);
      setVisibleCount((prev) => prev + 5);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!ignore) {
        setVisibleCount(5);
        await fetchPapers(false, filterMode, 10);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [fetchPapers, filterMode]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>All companies</span>
        </Link>
      </div>

      {/* Header */}
      {company && (
        <header className="rounded-2xl border border-border bg-surface p-6 sm:p-8 mb-10 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-elevated p-3 shadow-xs">
                <CompanyLogo slug={companySlug} className="w-full h-full text-foreground" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-foreground">
                  {company.name}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground max-w-xl">
                  {company.tagline}
                </p>
              </div>
            </div>

            {/* External Links */}
            <div className="flex items-center gap-2">
              {company.blogUrl && (
                <a
                  href={company.blogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${company.name} Blog`}
                  title="Official Blog"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-elevated px-3 py-1.5 text-xs font-medium text-foreground hover:border-border-strong transition-colors"
                >
                  <Newspaper className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Blog</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </a>
              )}
              {company.researchUrl && (
                <a
                  href={company.researchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${company.name} Publications`}
                  title="Official Publications"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-elevated px-3 py-1.5 text-xs font-medium text-foreground hover:border-border-strong transition-colors"
                >
                  <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Publications</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </a>
              )}
            </div>
          </div>

          {/* About this company collapsible */}
          <div className="mt-6 pt-5 border-t border-border">
            <Collapsible title="About this organization" defaultOpen={false}>
              <p className="text-sm text-muted-foreground leading-relaxed pt-2">
                {company.description}
              </p>
            </Collapsible>
          </div>
        </header>
      )}

      {/* Filter row & Refresh */}
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 pb-2">
          {/* Tab-style filter */}
          <div className="inline-flex items-center p-1 rounded-xl border border-border bg-surface-elevated/70">
            <button
              type="button"
              onClick={() => setFilterMode("blog")}
              className="relative px-3.5 py-1.5 text-xs font-medium rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {filterMode === "blog" && (
                <motion.div
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-lg bg-surface border border-border shadow-xs"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span className={`relative z-10 ${filterMode === "blog" ? "text-foreground font-semibold" : ""}`}>
                Blog
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilterMode("research")}
              className="relative px-3.5 py-1.5 text-xs font-medium rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {filterMode === "research" && (
                <motion.div
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-lg bg-surface border border-border shadow-xs"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span className={`relative z-10 ${filterMode === "research" ? "text-foreground font-semibold" : ""}`}>
                Research
              </span>
            </button>
          </div>

          <RefreshButton
            onRefresh={() => fetchPapers(true)}
            isLoading={refreshing}
            label="Refresh"
          />
        </div>

        {/* Papers List */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <LoadingState message="Fetching publications..." type="paper" count={3} />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <ErrorState
                title="Failed to load publications"
                message={error}
                onRetry={() => fetchPapers(false)}
              />
            </motion.div>
          ) : papers.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <EmptyState
                title="No publications found"
                message="No records found in this category. Try refreshing."
                actionLabel="Refresh feed"
                onAction={() => fetchPapers(true)}
              />
            </motion.div>
          ) : (
            <motion.div
              key={filterMode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="space-y-4"
            >
              {papers.slice(0, visibleCount).map((paper) => (
                <PaperCard
                  key={paper.id || paper.sourceUrl}
                  paper={paper}
                  companySlug={companySlug}
                />
              ))}

              {/* Show more / Load more button */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground border-t border-border/60">
                <span>
                  Showing {Math.min(visibleCount, papers.length)} of {papers.length} loaded publications
                </span>
                <button
                  type="button"
                  onClick={handleShowMore}
                  disabled={loadingMore}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-elevated text-foreground font-medium transition-colors shadow-2xs hover:border-border-strong cursor-pointer disabled:opacity-60"
                >
                  {loadingMore ? (
                    <>
                      <div className="h-3.5 w-3.5 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
                      <span>Fetching more...</span>
                    </>
                  ) : (
                    <span>
                      {visibleCount < papers.length ? "Show more" : "Fetch more"}
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
