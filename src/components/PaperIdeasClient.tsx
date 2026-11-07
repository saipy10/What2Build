"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { ProjectIdeaCard, ProjectIdeaData } from "@/components/ProjectIdeaCard";
import { LoadingState, ErrorState } from "@/components/States";
import { CompanyLogo } from "@/components/CompanyLogos";
import { StaggerContainer, StaggerItem } from "@/components/Reveal";
import { AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface PaperDetails {
  id: string;
  title: string;
  description: string;
  sourceUrl: string;
  authors: string[];
  publishedAt: string;
  company?: {
    name: string;
    slug: string;
  };
}

export function PaperIdeasClient({ paperId }: { paperId: string }) {
  const [paper, setPaper] = useState<PaperDetails | null>(null);
  const [ideas, setIdeas] = useState<ProjectIdeaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullAbstract, setShowFullAbstract] = useState(false);

  const fetchPaperAndIdeas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch paper details
      const paperRes = await fetch(`/api/papers/${paperId}`);
      const paperData = await paperRes.json();

      if (!paperRes.ok || !paperData.success) {
        throw new Error(paperData.error || "Failed to load paper details");
      }
      setPaper(paperData.paper);

      // 2. Fetch or generate ideas
      const ideasRes = await fetch(`/api/papers/${paperId}/ideas`, {
        method: "POST",
      });
      const ideasData = await ideasRes.json();

      if (!ideasRes.ok || !ideasData.success) {
        throw new Error(ideasData.error || "Failed to generate project ideas");
      }

      setIdeas(ideasData.ideas || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to generate project ideas.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [paperId]);

  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      setError(null);

      const res = await fetch(`/api/papers/${paperId}/ideas/regenerate`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to regenerate ideas");
      }

      setIdeas(data.ideas || []);
      toast.success("Generated new project ideas");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Regeneration failed.";
      setError(message);
      toast.error("Could not regenerate ideas");
    } finally {
      setRegenerating(false);
    }
  };

  useEffect(() => {
    fetchPaperAndIdeas();
  }, [fetchPaperAndIdeas]);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-xs text-muted-foreground">
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
          <li className="text-foreground font-medium truncate max-w-xs" aria-current="page">
            Project Ideas
          </li>
        </ol>
      </nav>

      {/* Back button */}
      <div className="mb-8">
        <Link
          href={paper?.company ? `/companies/${paper.company.slug}` : "/"}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to {paper?.company ? paper.company.name : "all companies"}</span>
        </Link>
      </div>

      {/* Paper Header / Details Card */}
      {paper && (
        <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-2.5">
              {paper.company && (
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background">
                  <CompanyLogo slug={paper.company.slug} className="h-3.5 w-3.5" />
                </div>
              )}
              <span className="text-xs font-medium text-muted-foreground">
                {paper.company?.name} Research
              </span>
              <span className="text-muted-foreground/40">&bull;</span>
              <span className="text-xs text-muted-foreground">
                {paper.publishedAt ? new Date(paper.publishedAt).toLocaleDateString() : ""}
              </span>
            </div>

            <a
              href={paper.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <span>View Original Publication</span>
              <ExternalLink className="h-3 w-3" />
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
                  />
                </button>
              )}
            </div>
          )}
        </section>
      )}

      {/* Project Ideas Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            Project Implementations
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            3 actionable project specifications categorized by complexity
          </p>
        </div>

        {ideas.length > 0 && !loading && (
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={regenerating}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50 cursor-pointer shrink-0"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${regenerating ? "animate-spin" : ""}`} />
            <span>{regenerating ? "Regenerating..." : "Regenerate Ideas"}</span>
          </button>
        )}
      </div>

      {/* Ideas Content */}
      {loading ? (
        <LoadingState message="Analyzing publication and synthesizing engineering projects..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchPaperAndIdeas} />
      ) : (
        <StaggerContainer className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {ideas.map((idea, index) => (
              <StaggerItem key={idea.id || index}>
                <ProjectIdeaCard idea={idea} index={index} />
              </StaggerItem>
            ))}
          </AnimatePresence>
        </StaggerContainer>
      )}
    </div>
  );
}
