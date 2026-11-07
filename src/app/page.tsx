"use client";

import React, { useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SUPPORTED_COMPANIES } from "@/lib/companies";
import { CompanyCard } from "@/components/CompanyCard";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/Reveal";

export default function HomePage() {
  const companies = Object.values(SUPPORTED_COMPANIES);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  return (
    <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Subtle hero dot grid at <=4% opacity */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:24px_24px] text-foreground opacity-[0.035]"
        aria-hidden="true"
      />

      {/* Hero Section */}
      <section className="mb-20 sm:mb-24 max-w-3xl">
        <Reveal>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.02em] text-foreground leading-[1.1]">
            Turn engineering breakthroughs into projects you can build.
          </h1>
        </Reveal>

        <Reveal delay={0.06}>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Pick a company, explore its engineering blogs and research, and generate project ideas from beginner to advanced.
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#companies"
              className="inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-4 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <span>Explore companies</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <button
              type="button"
              onClick={() => setShowHowItWorks(true)}
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              How it works
            </button>
          </div>
        </Reveal>
      </section>

      {/* Companies Grid Section */}
      <section id="companies" className="scroll-mt-20">
        <Reveal className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            Companies &amp; Engineering Blogs
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {companies.length} prominent engineering organizations and research labs
          </p>
        </Reveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {companies.map((comp) => (
            <StaggerItem key={comp.slug} className="h-full">
              <CompanyCard
                name={comp.name}
                slug={comp.slug}
                tagline={comp.tagline}
                description={comp.description}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
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
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h3 id="how-it-works-title" className="text-base font-semibold text-foreground">
                  How it works
                </h3>
                <button
                  type="button"
                  aria-label="Close dialog"
                  onClick={() => setShowHowItWorks(false)}
                  className="rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-surface-elevated border border-border text-xs font-mono font-medium text-foreground">
                    1
                  </span>
                  <p className="text-muted-foreground pt-0.5">
                    <strong className="text-foreground font-medium">Select a company:</strong> Choose an engineering organization like Netflix, Discord, Vercel, Hugging Face, OpenAI, or Meta.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-surface-elevated border border-border text-xs font-mono font-medium text-foreground">
                    2
                  </span>
                  <p className="text-muted-foreground pt-0.5">
                    <strong className="text-foreground font-medium">Browse publications:</strong> Read engineering blogs and technical research papers.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-surface-elevated border border-border text-xs font-mono font-medium text-foreground">
                    3
                  </span>
                  <p className="text-muted-foreground pt-0.5">
                    <strong className="text-foreground font-medium">Generate project ideas:</strong> Get three practical blueprints with deliverables, difficulty levels, and tech stacks.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
