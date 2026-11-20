"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CompanyConfig } from "@/lib/companies";
import { CompanyCard } from "@/components/CompanyCard";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/Reveal";
import { FaqSection, FaqItem } from "@/components/FaqSection";

interface HomeClientProps {
  companies: CompanyConfig[];
  faqs: FaqItem[];
  lastUpdatedIso?: string | null;
}

export function HomeClient({ companies, faqs }: HomeClientProps) {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  useEffect(() => {
    if (!showHowItWorks) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowHowItWorks(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showHowItWorks]);

  const featuredCompanyNames = companies
    .slice(0, 6)
    .map((c) => c.name)
    .join(", ");

  return (
    <>
      {/* Hero Section — rendered without opacity:0 Reveal so LCP & H1 paint immediately */}
      <section className="mb-16 sm:mb-20 max-w-3xl">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.02em] text-foreground leading-[1.1]">
          ReadEngg,
          <br />
          BuildEngg
        </h1>

        <h2 className="mt-4 text-lg sm:text-xl font-medium text-foreground/90 tracking-tight">
          Turn AI research papers and engineering blogs into portfolio projects
        </h2>

        {/* Answer-first summary (visually hidden, kept in DOM for assistive tech & search/answer engines) */}
        <p className="sr-only">
          What2Build is a free engineering portal for software developers, ML engineers, and CS
          students. It tracks official engineering blogs and academic research preprints across{" "}
          {companies.length} leading organizations—including {featuredCompanyNames}—and generates
          Beginner, Intermediate, and Advanced build specifications from real publications.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-4">
          <a
            href="#companies"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-4 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity focus:outline-hidden focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            <span>Explore companies</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={() => setShowHowItWorks(true)}
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus:outline-hidden focus:underline"
          >
            How it works
          </button>
        </div>
      </section>

      {/* Companies Grid Section */}
      <section id="companies" className="scroll-mt-20">
        <Reveal className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            Companies &amp; Engineering Blogs
          </h2>
          <Link
            href="/companies"
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            View directory &rarr;
          </Link>
        </Reveal>

        <StaggerContainer
          useInView
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {companies.map((comp) => (
            <StaggerItem key={comp.slug} className="h-full">
              <CompanyCard
                name={comp.name}
                slug={comp.slug}
                tagline={comp.tagline}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Direct AEO Overview Card */}
      <section className="mt-24 rounded-xl border border-border/80 bg-surface/50 p-6 sm:p-8 backdrop-blur-xs">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
          What is What2Build?
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed text-base">
          What2Build bridges frontier AI research and production engineering blogs with hands-on
          software development. By tracking official publications, arXiv preprints, and engineering
          posts across {companies.length} organizations ({companies.map((c) => c.name).join(", ")}),
          What2Build turns complex technical articles into concrete, AI-generated project
          specifications across three difficulty tiers.
        </p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border border-border/60 p-4 bg-background/60">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tier 1
            </span>
            <h3 className="mt-1 font-medium text-foreground">Beginner PoCs</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Prompt engineering, API integration, and focused proofs-of-concept.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4 bg-background/60">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tier 2
            </span>
            <h3 className="mt-1 font-medium text-foreground">Intermediate Systems</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Vector retrieval, microservice evaluation pipelines, and fine-tuning workflows.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4 bg-background/60">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tier 3
            </span>
            <h3 className="mt-1 font-medium text-foreground">Advanced Architectures</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Multi-agent systems, RLHF loops, custom kernels, and distributed infrastructure.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-20 pt-12 border-t border-border">
        <FaqSection
          title="Frequently Asked Questions (FAQ)"
          description="Everything you need to know about using What2Build to convert AI research and engineering blogs into portfolio projects."
          faqs={faqs}
        />
      </section>

      {/* How it works modal / popover */}
      <AnimatePresence>
        {showHowItWorks && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-xs"
              onClick={() => setShowHowItWorks(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl z-10"
              role="dialog"
              aria-modal="true"
              aria-labelledby="how-it-works-title"
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  id="how-it-works-title"
                  className="text-base font-semibold text-foreground"
                >
                  How it works
                </h3>
                <button
                  type="button"
                  onClick={() => setShowHowItWorks(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
                  aria-label="Close dialog"
                >
                  <span className="text-lg leading-none">&times;</span>
                </button>
              </div>

              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-xs font-semibold text-foreground">
                    1
                  </span>
                  <div>
                    <p className="font-medium text-foreground">Choose a company</p>
                    <p className="mt-0.5">
                      Pick from {companies.length} AI labs and engineering organizations.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-xs font-semibold text-foreground">
                    2
                  </span>
                  <div>
                    <p className="font-medium text-foreground">Browse papers &amp; posts</p>
                    <p className="mt-0.5">
                      Explore academic research preprints and official technical engineering blogs.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-xs font-semibold text-foreground">
                    3
                  </span>
                  <div>
                    <p className="font-medium text-foreground">Generate project ideas</p>
                    <p className="mt-0.5">
                      Get structured AI-generated project briefs categorized from beginner to
                      advanced with tech stacks and features.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
