"use client";

import React, { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ProjectIdeaCard, ProjectIdeaData } from "@/components/ProjectIdeaCard";
import { LoadingState, ErrorState } from "@/components/States";
import { CompanyLogo } from "@/components/CompanyLogos";
import { StaggerContainer, StaggerItem } from "@/components/Reveal";
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

export default function PaperIdeasPage({
  params,
}: {
  params: Promise<{ paperId: string }>;
}) {
  const resolvedParams = use(params);
  const paperId = resolvedParams.paperId;

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
    let ignore = false;
    async function load() {
      if (!ignore) {
        await fetchPaperAndIdeas();
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [fetchPaperAndIdeas]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Back link */}
      <div className="mb-6">
        <Link
          href={paper?.company?.slug ? `/companies/${paper.company.slug}` : "/"}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to {paper?.company?.name || "publications"}</span>
        </Link>
      </div>

      {/* Header */}
      {paper && (
        <header className="rounded-2xl border border-border bg-surface p-6 sm:p-8 mb-10 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                {paper.company?.slug && (
                  <span className="flex items-center gap-1.5 rounded-md bg-surface-elevated px-2 py-0.5 text-foreground font-medium border border-border">
                    <CompanyLogo slug={paper.company.slug} className="w-3.5 h-3.5" />
                    <span>{paper.company.name}</span>
                  </span>
                )}
                <span>•</span>
                <span className="font-mono">
                  {new Date(paper.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-[-0.02em] text-foreground leading-snug">
                {paper.title}
              </h1>

              {paper.authors && paper.authors.length > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Authors: </span>
                  {paper.authors.join(", ")}
                </p>
              )}

              {/* Clamped Abstract */}
              <div className="mt-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {showFullAbstract
                    ? paper.description
                    : paper.description.length > 220
                    ? `${paper.description.slice(0, 220)}...`
                    : paper.description}
                </p>

                {paper.description.length > 220 && (
                  <button
                    type="button"
                    onClick={() => setShowFullAbstract(!showFullAbstract)}
                    aria-expanded={showFullAbstract}
                    className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground mt-2 cursor-pointer"
                  >
                    <span>{showFullAbstract ? "Show less" : "Show more"}</span>
                    <ChevronDown
                      className={`h-3 w-3 transition-transform duration-200 ${
                        showFullAbstract ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="shrink-0 flex items-center gap-2 self-start">
              <a
                href={paper.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View original publication"
                title="View original publication"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-elevated text-muted-foreground hover:text-foreground hover:border-border-strong transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              {!loading && (
                <button
                  type="button"
                  onClick={handleRegenerate}
                  disabled={regenerating}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-elevated px-3 py-1.5 text-xs font-medium text-foreground hover:border-border-strong disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 text-muted-foreground ${regenerating ? "animate-spin text-accent" : ""}`}
                  />
                  <span>{regenerating ? "Regenerating..." : "Regenerate"}</span>
                </button>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Ideas Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            Project ideas
          </h2>
        </div>

        {/* Dynamic States */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <LoadingState message="Generating blueprints..." type="idea" count={3} />
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
                title="Failed to generate ideas"
                message={error}
                onRetry={fetchPaperAndIdeas}
              />
            </motion.div>
          ) : (
            <motion.div
              key={ideas.map((i) => i.id || i.title).join(",")}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {ideas.map((idea, index) => (
                  <StaggerItem key={idea.id || index} className="h-full">
                    <ProjectIdeaCard idea={idea} index={index} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
