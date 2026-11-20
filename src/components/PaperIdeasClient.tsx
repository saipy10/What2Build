"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  ChevronDown,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { ProjectIdeaCard, ProjectIdeaData } from "@/components/ProjectIdeaCard";
import { LoadingState, ErrorState, EmptyState } from "@/components/States";
import { CompanyLogo } from "@/components/CompanyLogos";
import { StaggerContainer, StaggerItem } from "@/components/Reveal";
import { toast } from "sonner";
import { trackUserError } from "@/lib/analytics";

export interface PaperDetails {
  id: string;
  title: string;
  description: string;
  sourceUrl: string;
  authors: string[];
  publishedAt: string;
  updatedAt?: string;
  company?: {
    name: string;
    slug: string;
  };
}

interface PaperIdeasClientProps {
  paperId: string;
  initialPaper?: PaperDetails | null;
  initialIdeas?: ProjectIdeaData[];
  lastUpdatedIso?: string | null;
}

export function PaperIdeasClient({
  paperId,
  initialPaper = null,
  initialIdeas = [],
  lastUpdatedIso = null,
}: PaperIdeasClientProps) {
  const [paper, setPaper] = useState<PaperDetails | null>(initialPaper);
  const [ideas, setIdeas] = useState<ProjectIdeaData[]>(initialIdeas);
  const [loading, setLoading] = useState(
    !initialPaper || initialIdeas.length === 0
  );
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullAbstract, setShowFullAbstract] = useState(false);
  const didInitRef = useRef(false);

  const fetchPaperAndIdeas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch paper details only if not already hydrated from SSR
      if (!initialPaper) {
        const paperRes = await fetch(`/api/papers/${encodeURIComponent(paperId)}`);
        const paperData = await paperRes.json();

        if (!paperRes.ok || !paperData.success) {
          throw new Error(paperData.error || "Failed to load paper details");
        }
        setPaper(paperData.paper);
      }

      // 2. Check cached ideas before triggering AI generation
      const cacheRes = await fetch(
        `/api/papers/${encodeURIComponent(paperId)}/ideas`
      );
      if (cacheRes.ok) {
        const cacheData = await cacheRes.json();
        if (
          cacheData.success &&
          Array.isArray(cacheData.ideas) &&
          cacheData.ideas.length > 0
        ) {
          setIdeas(cacheData.ideas);
          return;
        }
      }

      // 3. Synthesize ideas via AI only when cache is empty
      const ideasRes = await fetch(
        `/api/papers/${encodeURIComponent(paperId)}/ideas`,
        {
          method: "POST",
        }
      );
      const ideasData = await ideasRes.json();

      if (!ideasRes.ok || !ideasData.success) {
        throw new Error(ideasData.error || "Failed to generate project ideas");
      }

      setIdeas(ideasData.ideas || []);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to generate project ideas.";
      setError(message);
      trackUserError({
        errorType: "paper_ideas_fetch_error",
        message,
        context: paperId,
      });
    } finally {
      setLoading(false);
    }
  }, [paperId, initialPaper]);

  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      setError(null);

      const res = await fetch(
        `/api/papers/${encodeURIComponent(paperId)}/ideas/regenerate`,
        {
          method: "POST",
        }
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to regenerate ideas");
      }

      setIdeas(data.ideas || []);
      toast.success("Generated new project ideas");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Regeneration failed.";
      setError(message);
      trackUserError({
        errorType: "paper_ideas_regenerate_error",
        message,
        context: paperId,
      });
      toast.error("Could not regenerate ideas");
    } finally {
      setRegenerating(false);
    }
  };

  // Skip initial fetch completely when both paper & cached ideas were hydrated from SSR
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    if (!initialPaper || initialIdeas.length === 0) {
      fetchPaperAndIdeas();
    }
  }, [fetchPaperAndIdeas, initialPaper, initialIdeas.length]);

  const formattedPublished = paper?.publishedAt
    ? new Date(paper.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })
    : "";

  const formattedLastUpdated = lastUpdatedIso
    ? new Date(lastUpdatedIso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })
    : null;

  const findByDifficulty = (tier: string) =>
    ideas.find((i) => i.difficulty?.toLowerCase() === tier.toLowerCase());

  const beginnerIdea = findByDifficulty("beginner") ?? ideas[0];
  const intermediateIdea = findByDifficulty("intermediate") ?? ideas[1];
  const advancedIdea = findByDifficulty("advanced") ?? ideas[2];

  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-10 sm:py-16">
      {/* Breadcrumb Navigation: Home > Company > Paper title */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          {paper?.company && (
            <>
              <li>
                <Link
                  href={`/companies/${paper.company.slug}`}
                  className="hover:text-foreground transition-colors"
                >
                  {paper.company.name}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
            </>
          )}
          <li
            className="text-foreground font-medium truncate max-w-xs sm:max-w-md"
            aria-current="page"
          >
            {paper?.title || "Project Ideas"}
          </li>
        </ol>
      </nav>

      {/* Back button */}
      <div className="mb-8">
        <Link
          href={paper?.company ? `/companies/${paper.company.slug}` : "/companies"}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft
            className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          <span>Back to {paper?.company ? paper.company.name : "all companies"}</span>
        </Link>
      </div>

      {/* Paper Header / Details Card (server-rendered) */}
      {paper && (
        <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-2.5">
              {paper.company && (
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background">
                  <CompanyLogo slug={paper.company.slug} className="h-3.5 w-3.5" />
                </div>
              )}
              <span className="text-xs font-medium text-muted-foreground">
                {paper.company?.name || "Research"} Publication
              </span>
              {formattedPublished && (
                <>
                  <span className="text-muted-foreground/40">&bull;</span>
                  <time
                    dateTime={paper.publishedAt}
                    className="text-xs text-muted-foreground"
                  >
                    {formattedPublished}
                  </time>
                </>
              )}
              {formattedLastUpdated && lastUpdatedIso && (
                <>
                  <span className="text-muted-foreground/40">&bull;</span>
                  <span className="text-xs font-mono text-muted-foreground">
                    Last updated:{" "}
                    <time dateTime={lastUpdatedIso}>{formattedLastUpdated}</time>
                  </span>
                </>
              )}
            </div>

            <a
              href={paper.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <span>View Original Publication</span>
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>

          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground leading-snug">
            {paper.title}
          </h1>

          {/* Authors */}
          {paper.authors && paper.authors.length > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              By {paper.authors.join(", ")}
            </p>
          )}

          {/* Abstract / Description */}
          {paper.description && (
            <div className="mt-4 pt-4 border-t border-border">
              <p
                className={`text-sm text-muted-foreground leading-relaxed ${
                  !showFullAbstract ? "line-clamp-3" : ""
                }`}
              >
                {paper.description}
              </p>
              {paper.description.length > 250 && (
                <button
                  type="button"
                  onClick={() => setShowFullAbstract(!showFullAbstract)}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline cursor-pointer"
                >
                  <span>{showFullAbstract ? "Show less" : "Read full abstract"}</span>
                  <ChevronDown
                    className={`h-3 w-3 transition-transform ${
                      showFullAbstract ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
              )}
            </div>
          )}
        </section>
      )}

      {/* Answer-first AEO summary block */}
      {paper && (
        <section
          aria-label="Direct answer summary"
          className="mb-10 rounded-xl border border-border/80 bg-surface/60 p-4 sm:p-5"
        >
          <h2 className="text-sm font-semibold text-foreground">
            What can you build from &ldquo;{paper.title}&rdquo;?
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {ideas.length > 0 && beginnerIdea && intermediateIdea && advancedIdea ? (
              <>
                You can build three tiered engineering projects inspired by{" "}
                {paper.company ? `${paper.company.name}'s` : "this"} publication:{" "}
                <strong className="font-medium text-foreground">Beginner</strong> (
                {beginnerIdea.title}),{" "}
                <strong className="font-medium text-foreground">Intermediate</strong> (
                {intermediateIdea.title}), and{" "}
                <strong className="font-medium text-foreground">Advanced</strong> (
                {advancedIdea.title}).
              </>
            ) : (
              <>
                What2Build synthesizes three tiered engineering project specifications from this
                publication: a Beginner proof-of-concept, an Intermediate production service or
                evaluation pipeline, and an Advanced systems architecture.
              </>
            )}
          </p>
        </section>
      )}

      {/* Project Ideas Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            Project Implementations
          </h2>
          <p className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent shrink-0" aria-hidden="true" />
            <span>
              3 AI-generated project specifications categorized by complexity from the original
              publication
            </span>
          </p>
        </div>

        {ideas.length > 0 && !loading && (
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={regenerating}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-xs font-medium text-foreground hover:bg-surface-elevated transition-colors disabled:opacity-50 cursor-pointer shrink-0"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${regenerating ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            <span>{regenerating ? "Regenerating..." : "Regenerate Ideas"}</span>
          </button>
        )}
      </div>

      {/* Ideas Content */}
      {loading ? (
        <LoadingState
          type="idea"
          count={3}
          message="Analyzing publication and synthesizing engineering projects..."
        />
      ) : error && ideas.length === 0 ? (
        <ErrorState
          message={error}
          onRetry={paper ? handleRegenerate : fetchPaperAndIdeas}
        />
      ) : ideas.length === 0 ? (
        <EmptyState
          title="No project ideas generated yet"
          message="No implementation ideas were generated for this paper. Click below to synthesize ideas."
          actionLabel={regenerating ? "Synthesizing..." : "Generate Ideas"}
          onAction={handleRegenerate}
        />
      ) : (
        <div className="space-y-6">
          {error && (
            <div
              role="alert"
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-xs text-foreground"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-danger shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleRegenerate}
                  disabled={regenerating}
                  className="font-medium text-foreground underline hover:opacity-80 disabled:opacity-50 cursor-pointer"
                >
                  Retry
                </button>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea, index) => (
              <StaggerItem key={idea.id || `idea-${index}`}>
                <ProjectIdeaCard idea={idea} index={index} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      )}
    </div>
  );
}
