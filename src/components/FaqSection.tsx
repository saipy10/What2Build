"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  title?: string;
  description?: string;
  faqs: FaqItem[];
  className?: string;
}

export function FaqSection({
  title = "Frequently Asked Questions",
  description,
  faqs,
  className = "",
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className={`w-full ${className}`} aria-labelledby="faq-heading">
      <div className="max-w-3xl mb-8">
        <h2 id="faq-heading" className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <div className="space-y-4 max-w-4xl" role="region" aria-label="FAQ Accordion">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const contentId = `faq-content-${idx}`;
          const headerId = `faq-header-${idx}`;

          return (
            <div
              key={idx}
              className="rounded-xl border border-border bg-card/60 transition-colors overflow-hidden"
            >
              <h3>
                <button
                  type="button"
                  id={headerId}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-base font-medium text-foreground hover:bg-muted/50 transition-colors cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-inset"
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-foreground" : ""
                    }`}
                  />
                </button>
              </h3>
              {/* Keep content in DOM for screen readers and search bots, toggle hidden attribute */}
              <div
                id={contentId}
                role="region"
                aria-labelledby={headerId}
                className={`px-5 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

