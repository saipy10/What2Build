"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { LatestRequestGuard } from "@/lib/latestRequest";
import Link from "next/link";
import {
  ExternalLink,
  Newspaper,
  BookOpen,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { PaperCard, PaperData } from "@/components/PaperCard";
import { LoadingState, ErrorState, EmptyState } from "@/components/States";
import { CompanyLogo } from "@/components/CompanyLogos";
import { trackUserError } from "@/lib/analytics";
import { FaqSection, FaqItem } from "@/components/FaqSection";
import { toast } from "sonner";
import { CompanyConfig } from "@/lib/companies";

interface CompanyResearchClientProps {
  companySlug: string;
  initialCompany: CompanyConfig;
  initialPapers?: PaperData[];
  initialFilterMode?: "blog" | "research";
  lastUpdatedIso?: string | null;
  faqs: FaqItem[];
}

export function CompanyResearchClient({
  companySlug,
  initialCompany,
  initialPapers = [],
  initialFilterMode = "blog",
  lastUpdatedIso = null,
  faqs,
}: CompanyResearchClientProps) {
  const [company, setCompany] = useState<CompanyConfig>(initialCompany);
  const [papers, setPapers] = useState<PaperData[]>(initialPapers);
  const [visibleCount, setVisibleCount] = useState(5);
  const [hasMore, setHasMore] = useState(initialPapers.length >= 10);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterMode] = useState<"blog" | "research">(initialFilterMode);

  const guardRef = useRef(new LatestRequestGuard());
  const didSkipInitialFetchRef = useRef(false);

  // Cancel any in-flight request on unmount.
  useEffect(() => {
    const guard = guardRef.current;
    return () => guard.cancel();
  }, []);

  const fetchPapers = useCallback(
    async (
      force = false,
      filterOverride?: "blog" | "research",
      requestedLimit = 10
    ): Promise<PaperData[] | null> => {
      const activeFilter = filterOverride || filterMode;
      const { signal, isCurrent } = guardRef.current.start();
      try {
        if (force) {
          setRefreshing(true);
        } else if (requestedLimit > 10) {
          setLoadingMore(true);
        } else {
          setLoading(true);
          setPapers([]);
          setHasMore(false);
        }
        setError(null);

        const endpoint = force
          ? `/api/companies/${companySlug}/refresh?filter=${activeFilter}&limit=${requestedLimit}`
          : `/api/companies/${companySlug}/papers?filter=${activeFilter}&limit=${requestedLimit}`;

        const method = force ? "POST" : "GET";
        const res = await fetch(endpoint, { method, signal });
        const data = await res.json();

        if (!isCurrent()) return null;
        if (data.filter && data.filter !== activeFilter) return null;

        if (!res.ok || !data.success) {
          throw new Error(
            data.error ||
              `Failed to load ${
                activeFilter === "research" ? "research papers" : "company blogs"
              }`
          );
        }

        const fetchedPapers: PaperData[] = [...(data.papers || [])].sort(
          (a: PaperData, b: PaperData) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        setPapers(fetchedPapers);
        setHasMore(fetchedPapers.length >= requestedLimit && requestedLimit < 50);
        if (data.company) {
          setCompany(data.company);
        }
        if (force) {
          setVisibleCount(5);
          toast.success("Feed refreshed with latest publications");
        }
        return fetchedPapers;
      } catch (err: unknown) {
        if (
          !isCurrent() ||
          (err instanceof DOMException && err.name === "AbortError")
        ) {
          return null;
        }
        const message =
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while fetching updates.";
        setError(message);
        trackUserError({
          errorType: force
            ? "company_papers_refresh_error"
            : "company_papers_fetch_error",
          message,
          context: `${companySlug}:${activeFilter}`,
        });
        toast.error(force ? "Failed to refresh feed" : message);
        return null;
      } finally {
        if (isCurrent()) {
          setLoading(false);
          setRefreshing(false);
          setLoadingMore(false);
        }
      }
    },
    [companySlug, filterMode]
  );

  // Skip initial fetch when server-side initialPapers were hydrated.
  // Only fetch on mount if SSR returned empty (e.g. cold cache fallback).
  useEffect(() => {
    if (didSkipInitialFetchRef.current) return;
    didSkipInitialFetchRef.current = true;
    if (initialPapers.length === 0) {
      fetchPapers(false, filterMode, 10);
    }
  }, [fetchPapers, filterMode, initialPapers.length]);

  const handleShowMore = async () => {
    if (visibleCount < papers.length) {
      setVisibleCount((prev) => Math.min(prev + 5, papers.length));
    } else {
      const newLimit = Math.min(papers.length + 5, 50);
      const fetched = await fetchPapers(false, undefined, newLimit);
      if (fetched) {
        setVisibleCount(Math.min(visibleCount + 5, fetched.length));
        if (fetched.length <= papers.length) {
          setHasMore(false);
        }
      }
    }
  };

  const latestThree = papers.slice(0, 3);
  const formattedLastUpdated = lastUpdatedIso
    ? new Date(lastUpdatedIso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })
    : null;

  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-10 sm:py-16">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/companies" className="hover:text-foreground transition-colors">
              Companies
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          {filterMode === "research" ? (
            <>
              <li>
                <Link
                  href={`/companies/${company.slug}`}
                  className="hover:text-foreground transition-colors"
                >
                  {company.name}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground font-medium" aria-current="page">
                Research Papers
              </li>
            </>
          ) : (
            <li className="text-foreground font-medium" aria-current="page">
              {company.name}
            </li>
          )}
        </ol>
      </nav>

      {/* Header section */}
      <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b border-border">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-foreground shadow-xs">
            <CompanyLogo slug={company.slug} className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              {filterMode === "research"
                ? `${company.name} Research Papers`
                : company.name}
            </h1>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {company.tagline}
            </p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {company.description}
            </p>
            {formattedLastUpdated && lastUpdatedIso && (
              <p className="mt-2 text-xs font-mono text-muted-foreground">
                Last updated:{" "}
                <time dateTime={lastUpdatedIso}>{formattedLastUpdated}</time>
              </p>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col items-stretch gap-2 shrink-0">
          {company.blogUrl && (
            <a
              href={company.blogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface-elevated transition-colors"
            >
              <span className="inline-flex items-center gap-1.5">
                <Newspaper className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                <span>Official Blog</span>
              </span>
              <ExternalLink className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
            </a>
          )}
          <a
            href={company.researchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface-elevated transition-colors"
          >
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              <span>Research Hub</span>
            </span>
            <ExternalLink className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
          </a>
        </div>
      </header>

      {/* Answer-first AEO summary block (visually hidden) */}
      <section
        aria-label={`Summary of ${company.name} publications`}
        className="sr-only"
      >
        <h2 className="text-sm font-semibold text-foreground">
          What does {company.name} publish and what can you build from it?
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {company.name} publishes technical work on {company.tagline.toLowerCase()}. On What2Build,
          every {filterMode === "research" ? "research paper" : "engineering post"} can be turned
          into Beginner, Intermediate, and Advanced software projects.
          {latestThree.length > 0 && (
            <>
              {" "}
              Recent {filterMode === "research" ? "papers" : "posts"} include{" "}
              {latestThree.map((p, idx) => {
                const dateLabel = new Date(p.publishedAt).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }
                );
                return (
                  <React.Fragment key={p.id || p.sourceUrl}>
                    {idx > 0 && (idx === latestThree.length - 1 ? ", and " : ", ")}
                    <span className="text-foreground font-medium">{p.title}</span> ({dateLabel})
                  </React.Fragment>
                );
              })}
              .
            </>
          )}
        </p>
      </section>

      {/* Filter Tabs — real crawlable links between Blog and Research routes */}
      <div className="my-8 flex items-center gap-2">
        <div className="inline-flex rounded-lg border border-border bg-surface p-1" role="tablist">
          <Link
            href={`/companies/${companySlug}`}
            role="tab"
            aria-selected={filterMode === "blog"}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              filterMode === "blog"
                ? "bg-foreground text-background shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Newspaper className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Engineering Blogs</span>
          </Link>
          <Link
            href={`/companies/${companySlug}/research`}
            role="tab"
            aria-selected={filterMode === "research"}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              filterMode === "research"
                ? "bg-foreground text-background shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Research Papers</span>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => fetchPapers(true)}
          disabled={refreshing}
          aria-label="Sync Feed"
          title="Sync Feed"
          className="inline-flex items-center justify-center p-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Main content list — <section> (never nested <main>) */}
      <section aria-label={`${company.name} ${filterMode === "research" ? "research papers" : "engineering blog posts"}`}>
        {(loading && papers.length === 0) || refreshing ? (
          <LoadingState
            type="paper"
            count={5}
            message={`Loading ${
              filterMode === "research" ? "research papers" : "engineering blogs"
            } for ${company.name}...`}
          />
        ) : error && papers.length === 0 ? (
          <ErrorState message={error} onRetry={() => fetchPapers(false)} />
        ) : papers.length === 0 ? (
          <EmptyState
            message={`No ${
              filterMode === "research" ? "research papers" : "blog posts"
            } found for ${company.name}.`}
            actionLabel="Sync Latest Feed"
            onAction={() => fetchPapers(true)}
          />
        ) : (
          <div className="space-y-4">
            {error && (
              <div
                role="alert"
                className="flex items-center justify-between gap-3 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-xs text-foreground"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-danger shrink-0" aria-hidden="true" />
                  <span>{error}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Render all fetched papers in the DOM for crawlability; progressively reveal via CSS */}
            {papers.map((paper, idx) => (
              <div
                key={paper.id || paper.sourceUrl}
                className={idx >= visibleCount ? "hidden" : undefined}
              >
                <PaperCard paper={paper} companySlug={companySlug} />
              </div>
            ))}

            {visibleCount < papers.length || hasMore ? (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={handleShowMore}
                  disabled={loadingMore}
                  className="rounded-lg border border-border bg-surface px-5 py-2 text-xs font-medium text-foreground hover:bg-surface-elevated transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {loadingMore ? "Loading more..." : "Load More"}
                </button>
              </div>
            ) : null}
          </div>
        )}
      </section>

      {/* Semantic FAQ Section for Company Page */}
      <section className="mt-20 pt-10 border-t border-border">
        <FaqSection
          title={`${company.name} Research FAQs`}
          description={`Common questions regarding ${company.name}'s research preprints, technical blog articles, and project development.`}
          faqs={faqs}
        />
      </section>
    </div>
  );
}
