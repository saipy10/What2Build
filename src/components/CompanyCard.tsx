"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { CompanyLogo } from "@/components/CompanyLogos";

interface CompanyCardProps {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  researchUrl?: string;
  iconName?: string;
  papersCount?: number;
}

export function CompanyCard({
  name,
  slug,
  tagline,
}: CompanyCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="h-full"
    >
      <Link
        href={`/companies/${slug}`}
        className="group relative flex h-full flex-col justify-between rounded-xl border border-border bg-surface p-6 shadow-xs transition-colors hover:border-border-strong hover:shadow-sm"
      >
        <div>
          <div className="flex items-center gap-3.5 mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface-elevated p-2 text-foreground shadow-xs">
              <CompanyLogo slug={slug} className="w-full h-full text-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground tracking-tight">
                {name}
              </h3>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-1 leading-relaxed">
            {tagline}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between text-xs font-medium text-muted-foreground pt-4 border-t border-border group-hover:text-foreground transition-colors">
          <span>Explore publications</span>
          <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1 text-muted-foreground group-hover:text-accent" />
        </div>
      </Link>
    </motion.div>
  );
}
