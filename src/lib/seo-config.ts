import { SUPPORTED_COMPANIES } from "./companies";
import type { FaqItem } from "@/components/FaqSection";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://what2build.dev";
const siteUrl = rawSiteUrl.replace(/\/+$/, "");

const repoUrl =
  process.env.NEXT_PUBLIC_REPO_URL || "https://github.com/saipy10/What2Build";

const twitterUrl = process.env.NEXT_PUBLIC_TWITTER_URL || "";

export const SITE_CONFIG = {
  name: "What2Build",
  legalName: "What2Build",
  tagline: "Turn AI research into engineering projects",
  description:
    "Explore official engineering blogs and research publications from leading AI labs and tech companies, and turn them into actionable, step-by-step engineering projects from beginner to advanced.",
  url: siteUrl,
  locale: "en_US",
  author: {
    name: "What2Build Team",
    url: siteUrl,
  },
  social: {
    github: repoUrl,
    twitter: twitterUrl,
    sameAs: [repoUrl, twitterUrl].filter(Boolean),
  },
  keywords: [
    "AI research papers",
    "engineering project ideas",
    "machine learning projects",
    "OpenAI research engineering",
    "DeepMind publications",
    "Anthropic Claude research",
    "coding project generator",
    "LLM applications",
    "portfolio projects for developers",
    "frontier AI architectures",
  ],
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Supabase paper rows use UUID primary keys, whereas the in-memory fallback
 * generates ephemeral slug-prefixed IDs that are unstable across restarts.
 */
export function isPersistedPaperId(id: string): boolean {
  return UUID_REGEX.test(id);
}

export function getSupportedCompanyNames(): string[] {
  return Object.values(SUPPORTED_COMPANIES).map((c) => c.name);
}

export function formatCompanyNameList(): string {
  const names = getSupportedCompanyNames();
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

export function getHomeFaqs(): FaqItem[] {
  const companies = Object.values(SUPPORTED_COMPANIES);
  const companyCount = companies.length;
  const allCompanyNames = formatCompanyNameList();

  return [
    {
      question: "What is What2Build and who is it designed for?",
      answer: `What2Build is an open engineering portal for software developers, ML engineers, and computer science students. It tracks newly published research papers and official engineering blogs across ${companyCount} organizations (including OpenAI, Google DeepMind, Anthropic, Meta AI & Engineering, NVIDIA, Netflix, Uber, Stripe, and Cloudflare) and converts them into practical, step-by-step engineering projects.`,
    },
    {
      question: "How does What2Build generate project ideas from AI research papers?",
      answer:
        "Our system reads official arXiv preprints and engineering blog feeds, extracts core algorithmic innovations and system architectures, and uses large language models to produce 3 AI-generated project specifications categorized by difficulty: Beginner (proofs-of-concept), Intermediate (evaluations and microservices), and Advanced (distributed systems and custom architectures).",
    },
    {
      question: "Which AI labs and engineering organizations are currently supported?",
      answer: `What2Build currently supports ${companyCount} organizations: ${allCompanyNames}.`,
    },
    {
      question: "Are the suggested project ideas suitable for developer portfolios?",
      answer:
        "Yes. Each AI-generated project specification provides recommended tech stacks, core features, competencies, and explicit research connections designed to demonstrate practical software and ML engineering skills.",
    },
    {
      question: "Is What2Build free to use?",
      answer:
        "Yes, What2Build is freely accessible to explore engineering blogs, academic research preprints, and AI-generated project specifications for developers building portfolio projects.",
    },
    {
      question: "Can I filter between academic research papers and engineering blog posts?",
      answer:
        "Yes. On every company page, you can switch between 'Engineering Blogs' (official system architecture, scaling, and infrastructure posts) and 'Research Papers' (academic publications and arXiv preprints), each with its own dedicated URL.",
    },
  ];
}
