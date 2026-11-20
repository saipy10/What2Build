"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CompanyLogo } from "@/components/CompanyLogos";

interface CompanyCardProps {
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  researchUrl?: string;
  iconName?: string;
  papersCount?: number;
}

export function CompanyCard({ name, slug, tagline }: CompanyCardProps) {
  return (
    <div className="h-full transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]">
      <Link
        href={`/companies/${slug}`}
        className="group relative flex h-full items-center justify-between gap-4 rounded-xl border border-border bg-surface p-5 sm:p-6 shadow-xs transition-colors hover:border-border-strong hover:shadow-sm"
      >
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-elevated p-2 text-foreground shadow-xs">
            <CompanyLogo slug={slug} className="w-full h-full text-foreground" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-lg text-foreground tracking-tight truncate">
              {name}
            </h3>
            {tagline && (
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {tagline}
              </p>
            )}
          </div>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface-elevated text-foreground dark:text-white transition-all group-hover:translate-x-1 group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white">
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </div>
      </Link>
    </div>
  );
}
