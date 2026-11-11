"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CompanyConfig } from "@/lib/companies";
import { CompanyCard } from "@/components/CompanyCard";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/Reveal";
import { FaqSection, FaqItem } from "@/components/FaqSection";

interface HomeClientProps {
  companies: CompanyConfig[];
  faqs: FaqItem[];
}

export function HomeClient({ companies, faqs }: HomeClientProps) {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  return (
    <>
      {/* Subtle hero dot grid */}
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
              className="inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-4 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <span>Explore companies</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <button
              type="button"
              onClick={() => setShowHowItWorks(true)}
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus:outline-hidden focus:underline"
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

        <StaggerContainer useInView className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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

      {/* Direct AEO Overview Card */}
      <section className="mt-24 rounded-xl border border-border/80 bg-surface/50 p-6 sm:p-8 backdrop-blur-xs">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
          What is What2Build?
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed text-base">
          What2Build is an open engineering platform that bridges frontier AI research with real-world software development. By continuously monitoring official publications, arXiv preprints, and technical blogs from top labs like OpenAI, Google DeepMind, Anthropic, and Meta, What2Build breaks complex research down into concrete project specifications with step-by-step guidance.
        </p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border border-border/60 p-4 bg-background/60">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tier 1</span>
            <h3 className="mt-1 font-medium text-foreground">Beginner PoCs</h3>
            <p className="mt-1 text-xs text-muted-foreground">Prompt engineering, API integration, and straightforward reproductions.</p>
          </div>
          <div className="rounded-lg border border-border/60 p-4 bg-background/60">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tier 2</span>
            <h3 className="mt-1 font-medium text-foreground">Intermediate Systems</h3>
            <p className="mt-1 text-xs text-muted-foreground">Vector retrieval, microservice evaluation pipelines, and fine-tuning.</p>
          </div>
          <div className="rounded-lg border border-border/60 p-4 bg-background/60">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tier 3</span>
            <h3 className="mt-1 font-medium text-foreground">Advanced Architectures</h3>
            <p className="mt-1 text-xs text-muted-foreground">Multi-agent systems, RLHF loops, custom kernels, and distributed training.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-20 pt-12 border-t border-border">
        <FaqSection
          title="Frequently Asked Questions (FAQ)"
          description="Everything you need to know about using What2Build to convert AI research into portfolio projects."
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
                <h3 id="how-it-works-title" className="text-base font-semibold text-foreground">
                  How it works
                </h3>
                <button
                  type="button"
                  onClick={() => setShowHowItWorks(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
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
                    <p className="mt-0.5">Pick from frontier AI labs and engineering organizations.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-xs font-semibold text-foreground">
                    2
                  </span>
                  <div>
                    <p className="font-medium text-foreground">Browse papers &amp; posts</p>
                    <p className="mt-0.5">Explore real research preprints and official technical engineering blogs.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-xs font-semibold text-foreground">
                    3
                  </span>
                  <div>
                    <p className="font-medium text-foreground">Generate project ideas</p>
                    <p className="mt-0.5">
                      Get structured project briefs categorized from beginner to advanced with tech stacks and features.
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

