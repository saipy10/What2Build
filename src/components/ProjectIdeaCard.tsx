"use client";

import React, { useState, useId } from "react";
import {
  Check,
  ChevronDown,
  Copy,
  Link as LinkIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

export interface ProjectIdeaData {
  id: string;
  title: string;
  description: string;
  features: string[];
  skills: string[];
  technologies: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced" | string;
  researchConnection: string;
}

interface ProjectIdeaCardProps {
  idea: ProjectIdeaData;
  index: number;
}

export function ProjectIdeaCard({ idea, index }: ProjectIdeaCardProps) {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showResearch, setShowResearch] = useState(false);
  const [copied, setCopied] = useState(false);
  const detailsId = useId();
  const descId = useId();

  const handleCopyDetails = async () => {
    try {
      const sections: string[] = [
        `# ${idea.title}`,
        `Difficulty: ${idea.difficulty || "Intermediate"}`,
        `\n## Overview\n${idea.description}`,
      ];

      if (idea.features && idea.features.length > 0) {
        sections.push(
          `\n## Key Features\n${idea.features.map((f) => `- ${f}`).join("\n")}`
        );
      }

      if (idea.technologies && idea.technologies.length > 0) {
        sections.push(`\n## Tech Stack\n${idea.technologies.join(", ")}`);
      }

      if (idea.skills && idea.skills.length > 0) {
        sections.push(`\n## Competencies & Skills\n${idea.skills.join(", ")}`);
      }

      if (idea.researchConnection) {
        sections.push(`\n## Research Connection\n${idea.researchConnection}`);
      }

      sections.push(
        `\n---\n### Prompt for AI / LLM Discussion:
Please brainstorm this project idea with me and think through it in depth. 
The idea above represents the initial seed and core concept. Based on it, please:
1. Brainstorm and critically analyze the idea, identifying key technical challenges, edge cases, and architectural considerations.
2. Develop an actionable proof of concept (PoC) plan to validate the core value proposition quickly.
3. Generate a comprehensive development roadmap (from PoC to MVP to production-ready implementation).
4. Propose ideas to extend or refine the concept for maximum real-world impact.`
      );

      const contentToCopy = sections.join("\n").trim();

      await navigator.clipboard.writeText(contentToCopy);
      setCopied(true);
      toast.success("Copied full project details to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy project details");
    }
  };

  const getDifficultyStyles = (diff: string) => {
    switch (diff?.toLowerCase()) {
      case "beginner":
        return "bg-success/10 text-success border-success/30";
      case "advanced":
        return "bg-danger/10 text-danger border-danger/30";
      case "intermediate":
      default:
        return "bg-warning/10 text-warning border-warning/30";
    }
  };

  const isLongDesc = (idea.description || "").length > 120;

  return (
    <div
      className="flex flex-col justify-between h-full rounded-xl border border-border bg-surface p-6 shadow-xs hover:border-border-strong hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className="flex-1 flex flex-col">
        {/* Header: Difficulty Chip & Subtle Index */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-mono font-medium border ${getDifficultyStyles(
              idea.difficulty
            )}`}
          >
            {idea.difficulty || "Intermediate"}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Copy full project details"
              onClick={handleCopyDetails}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
            <span className="text-xs font-mono text-muted-foreground">0{index + 1}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-2.5 leading-snug tracking-tight">
          {idea.title}
        </h3>

        {/* Expandable Description */}
        <div className="mb-5">
          <AnimatePresence initial={false} mode="wait">
            {showFullDesc ? (
              <motion.div
                key="full"
                id={descId}
                initial={{ opacity: 0, height: "auto" }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm text-foreground/90 leading-relaxed rounded-lg bg-surface-elevated/40 p-3 border border-border/70"
              >
                {idea.description}
              </motion.div>
            ) : (
              <motion.p
                key="truncated"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="text-sm text-muted-foreground leading-relaxed line-clamp-2"
              >
                {idea.description}
              </motion.p>
            )}
          </AnimatePresence>

          {isLongDesc && (
            <button
              type="button"
              onClick={() => setShowFullDesc(!showFullDesc)}
              aria-expanded={showFullDesc}
              aria-controls={descId}
              className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline mt-1.5 cursor-pointer"
            >
              <span>{showFullDesc ? "Show less" : "Read full description"}</span>
              <ChevronDown
                className={`h-3 w-3 transition-transform duration-200 ${
                  showFullDesc ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>

        {/* Key Features */}
        <div className="mb-5 rounded-lg border border-border bg-surface-elevated/40 p-4">
          <ul className="space-y-2.5">
            {idea.features?.map((feat, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground">
                <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span className="leading-relaxed">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Stack chips */}
        <div className="mb-5 mt-auto">
          <div className="flex flex-wrap gap-1.5">
            {idea.technologies?.map((tech, i) => (
              <span
                key={i}
                className="rounded-md bg-surface-elevated px-2 py-0.5 text-xs font-mono text-foreground border border-border"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Collapsible Skills & Research link */}
      <div className="pt-4 border-t border-border">
        <button
          type="button"
          onClick={() => setShowResearch(!showResearch)}
          aria-expanded={showResearch}
          aria-controls={detailsId}
          className="w-full flex items-center justify-between text-left text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <span>Skills &amp; research link</span>
          <ChevronDown
            className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
              showResearch ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {showResearch && (
            <motion.div
              id={detailsId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-3 pt-2 text-xs">
                {idea.skills && idea.skills.length > 0 && (
                  <div>
                    <span className="font-medium text-foreground block mb-1">Competencies:</span>
                    <div className="flex flex-wrap gap-1">
                      {idea.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="rounded bg-surface-elevated px-2 py-0.5 text-[11px] text-muted-foreground border border-border"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {idea.researchConnection && (
                  <div className="rounded-md border border-border bg-surface-elevated/60 p-2.5">
                    <div className="flex items-start gap-2">
                      <LinkIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground leading-relaxed italic">
                        &quot;{idea.researchConnection}&quot;
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
