import React from "react";
import type { Metadata } from "next";
import { SUPPORTED_COMPANIES } from "@/lib/companies";
import { SITE_CONFIG } from "@/lib/seo-config";
import { HomeClient } from "@/components/HomeClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqItem } from "@/components/FaqSection";

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.description,
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    locale: SITE_CONFIG.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
  },
};

const HOME_FAQS: FaqItem[] = [
  {
    question: "What is What2Build and who is it designed for?",
    answer:
      "What2Build is an open engineering portal for software developers, ML engineers, and computer science students. It continuously tracks newly published research papers and technical blogs from frontier AI organizations (like OpenAI, Google DeepMind, Anthropic, and Meta) and converts them into practical, step-by-step engineering projects.",
  },
  {
    question: "How does What2Build generate project ideas from AI research papers?",
    answer:
      "Our system reads official preprints from arXiv and engineering blog feeds, extracts core algorithmic innovations and architectures, and utilizes state-of-the-art language models to produce 3 structured project specifications categorized by difficulty: Beginner (proofs-of-concept), Intermediate (evaluations and microservices), and Advanced (distributed systems and custom architectures).",
  },
  {
    question: "Which frontier AI labs and companies are currently supported?",
    answer:
      "We currently monitor top tier AI labs including OpenAI, Google DeepMind, Anthropic, Meta AI, Mistral AI, Cohere, Microsoft Research, Apple Machine Learning, and NVIDIA Research.",
  },
  {
    question: "Are the suggested project ideas suitable for developer portfolios?",
    answer:
      "Yes. Each project idea provides recommended tech stacks, core architectural challenges, concrete deliverables, and extension opportunities designed to demonstrate production engineering skills to hiring managers and technical recruiters.",
  },
  {
    question: "Is What2Build free to use?",
    answer:
      "Yes, What2Build is freely accessible to explore research feeds and view AI-generated project plans for developers building portfolio projects.",
  },
  {
    question: "Can I filter between academic research papers and engineering blog posts?",
    answer:
      "Yes. On every company hub page, you can toggle between 'Engineering Blogs' (real-world system architecture, scaling posts) and 'Research Papers' (peer-reviewed papers and arXiv preprints).",
  },
];

export default function HomePage() {
  const companies = Object.values(SUPPORTED_COMPANIES);

  // Structured Data Schema for Organization, WebSite, and FAQPage
  const jsonLdItems = [
    {
      "@type": "Organization",
      "@id": `${SITE_CONFIG.url}/#organization`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      description: SITE_CONFIG.description,
      logo: `${SITE_CONFIG.url}/favicon.svg`,
      sameAs: [SITE_CONFIG.social.github, SITE_CONFIG.social.twitter],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_CONFIG.url}/#website`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      publisher: {
        "@id": `${SITE_CONFIG.url}/#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_CONFIG.url}/companies/{search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_CONFIG.url}/#faq`,
      mainEntity: HOME_FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ];

  return (
    <>
      <JsonLd items={jsonLdItems} />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <HomeClient companies={companies} faqs={HOME_FAQS} />
      </div>
    </>
  );
}
