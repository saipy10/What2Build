"use client";

import React, { useState, useId } from "react";
import Link from "next/link";
import {
  ExternalLink,
  ChevronDown,
  ArrowRight,
  BookOpen,
  Newspaper,
  Calendar,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CompanyLogo } from "@/components/CompanyLogos";

export interface PaperData {
  id: string;
  companyId: string;
  title: string;
  description: string;
  publishedAt: string | Date;
  authors: string[];
  sourceUrl: string;
  externalId?: string | null;
  category?: string;
  contentType?: "blog" | "research";
}

interface PaperCardProps {
  paper: PaperData;
  companySlug?: string;
}

export function PaperCard({ paper, companySlug }: PaperCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const abstractId = useId();

  // Resolve slug: prefer explicit companySlug, fallback to cleaned prefix if companyId is a composite key like 'openai:blog'
  const resolvedSlug =
    companySlug ||
    (paper.companyId.includes(":") ? paper.companyId.split(":")[0] : paper.companyId);

  const formattedDate = new Date(paper.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const isResearch = paper.contentType === "research";

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`rounded-xl border transition-colors bg-surface ${
        isExpanded ? "border-border-strong" : "border-border hover:border-border-strong hover:shadow-xs"
      }`}
    >
      <div className="p-5 sm:p-6">
        {/* Row 1: date + category + lab */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-2.5">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface-elevated border border-border text-foreground font-medium text-xs">
            <CompanyLogo slug={resolvedSlug} className="w-3.5 h-3.5" />
            <span className="capitalize">{resolvedSlug}</span>
          </span>

          <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs text-muted-foreground bg-surface-elevated border border-border">
            {isResearch ? <BookOpen className="h-3 w-3" /> : <Newspaper className="h-3 w-3" />}
            <span>{paper.category || (isResearch ? "Research" : "Blog")}</span>
          </span>

          <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{formattedDate}</span>
          </span>

          {paper.authors && paper.authors.length > 0 && isExpanded && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3 shrink-0" />
              <span>{paper.authors.join(", ")}</span>
            </span>
          )}
        </div>

        {/* Row 2: title with subtle external hover link */}
        <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight leading-snug">
          <a
            href={paper.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex items-center gap-1.5 hover:text-accent transition-colors"
          >
            <span>{paper.title}</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0" />
          </a>
        </h3>

        {/* Row 3: description clamped to 2 lines, expandable */}
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {isExpanded
            ? paper.description
            : paper.description.length > 160
            ? `${paper.description.slice(0, 160)}...`
            : paper.description}
        </p>

        <AnimatePresence>
          {isExpanded && paper.authors && paper.authors.length > 0 && (
            <motion.div
              id={abstractId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground"
            >
              <span className="font-medium text-foreground">Authors: </span>
              {paper.authors.join(", ")}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer / Right Action: Expand Toggle + "Get ideas →" */}
        <div className="mt-5 pt-3.5 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {paper.description.length > 160 ? (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              aria-controls={abstractId}
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer self-start"
            >
              <span>{isExpanded ? "Show less" : "Read more"}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          ) : (
            <div />
          )}

          <Link
            href={`/papers/${encodeURIComponent(paper.id)}/ideas`}
            className="group/btn inline-flex items-center justify-center gap-1.5 rounded-lg bg-surface-elevated hover:bg-surface-elevated/80 border border-border px-3.5 py-1.5 text-xs font-medium text-foreground hover:border-border-strong transition-all self-end"
          >
            <span>Get ideas</span>
            <ArrowRight className="h-3.5 w-3.5 transform transition-transform group-hover/btn:translate-x-0.5 text-muted-foreground group-hover/btn:text-foreground" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
