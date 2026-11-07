"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Newspaper,
  BookOpen,
} from "lucide-react";
import { PaperCard, PaperData } from "@/components/PaperCard";
import { LoadingState, ErrorState, EmptyState } from "@/components/States";
import { RefreshButton } from "@/components/RefreshButton";
import { CompanyLogo } from "@/components/CompanyLogos";
import { FaqSection, FaqItem } from "@/components/FaqSection";
import { toast } from "sonner";
import { CompanyConfig } from "@/lib/companies";

interface CompanyResearchClientProps {
  companySlug: string;
  initialCompany: CompanyConfig;
  faqs: FaqItem[];
}

export function CompanyResearchClient({
  companySlug,
  initialCompany,
  faqs,
}: CompanyResearchClientProps) {
  const [company, setCompany] = useState<CompanyConfig>(initialCompany);
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
    if (visibleCount < papers.length) {
      setVisibleCount((prev) => Math.min(prev + 5, papers.length));
    } else {
      const newLimit = papers.length + 5;
      await fetchPapers(false, undefined, newLimit);
      setVisibleCount(newLimit);
    }
  };

  useEffect(() => {
    fetchPapers(false, filterMode, 10);
    setVisibleCount(5);
  }, [fetchPapers, filterMode]);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Back button & Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-xs text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/#companies" className="hover:text-foreground transition-colors">
              Companies
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground font-medium" aria-current="page">
            {company.name}
          </li>
        </ol>
      </nav>

      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to all organizations</span>
        </Link>
      </div>

      {/* Header section */}
      <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b border-border">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-foreground shadow-xs">
            <CompanyLogo slug={company.slug} className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              {company.name}
            </h1>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {company.tagline}
            </p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {company.description}
            </p>
          </div>
        </div>

        {/* Links & Refresh */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {company.blogUrl && (
            <a
              href={company.blogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Newspaper className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Official Blog</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </a>
          )}
          <a
            href={company.researchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
          >
            <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Research Hub</span>
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </a>
          <RefreshButton
            onRefresh={() => fetchPapers(true)}
            isLoading={refreshing}
            label="Sync Feed"
          />
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="my-8 flex items-center justify-between gap-4">
        <div className="inline-flex rounded-lg border border-border bg-surface p-1">
          <button
            type="button"
            onClick={() => setFilterMode("blog")}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              filterMode === "blog"
                ? "bg-foreground text-background shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Newspaper className="h-3.5 w-3.5" />
            <span>Engineering Blogs</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("research")}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              filterMode === "research"
                ? "bg-foreground text-background shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Research Papers (arXiv)</span>
          </button>
        </div>
      </div>

      {/* Main content list */}
      <main>
        {loading && !refreshing && papers.length === 0 ? (
          <LoadingState message={`Fetching publications for ${company.name}...`} />
        ) : error && papers.length === 0 ? (
          <ErrorState message={error} onRetry={() => fetchPapers(false)} />
        ) : papers.length === 0 ? (
          <EmptyState
            message={`No ${filterMode === "research" ? "research papers" : "blog posts"} found for ${company.name}.`}
            actionLabel="Sync Latest Feed"
            onAction={() => fetchPapers(true)}
          />
        ) : (
          <div className="space-y-4">
            {papers.slice(0, visibleCount).map((paper) => (
              <PaperCard
                key={paper.id || paper.sourceUrl}
                paper={paper}
                companySlug={companySlug}
              />
            ))}

            {visibleCount < papers.length || papers.length === 10 ? (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={handleShowMore}
                  disabled={loadingMore}
                  className="rounded-lg border border-border bg-surface px-5 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {loadingMore ? "Loading more..." : "Load More Publications"}
                </button>
              </div>
            ) : null}
          </div>
        )}
      </main>

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
