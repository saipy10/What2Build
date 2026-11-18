"use client";

import React, { useState, useId } from "react";
import Link from "next/link";
import {
  ExternalLink,
  ChevronDown,
  Lightbulb,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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

export function PaperCard({ paper }: PaperCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const abstractId = useId();

  const formattedDate = new Date(paper.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`rounded-xl border transition-colors bg-surface ${
        isExpanded ? "border-border-strong" : "border-border hover:border-border-strong hover:shadow-xs"
      }`}
    >
      <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        {/* Left: Date -> Heading -> Description */}
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground mb-2">
            <Calendar className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>

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

          <p className="mt-3 pt-3 border-t border-border text-sm text-muted-foreground leading-relaxed">
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

          {paper.description.length > 160 && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              aria-controls={abstractId}
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <span>{isExpanded ? "Show less" : "Read more"}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>

        {/* Right: Ideas button */}
        <div className="shrink-0 flex items-center sm:justify-end">
          <Link
            href={`/papers/${encodeURIComponent(paper.id)}/ideas`}
            className="group/btn inline-flex items-center justify-center gap-1.5 rounded-lg bg-surface-elevated border border-border px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:border-blue-600 hover:bg-blue-600 hover:text-white"
          >
            <Lightbulb className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover/btn:text-white" />
            <span>Ideas</span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
