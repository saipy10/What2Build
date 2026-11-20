import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SUPPORTED_COMPANIES } from "@/lib/companies";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The requested page or research publication could not be found on What2Build.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  const featured = Object.values(SUPPORTED_COMPANIES).slice(0, 6);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-10 py-20 sm:py-28">
      <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
        404 &middot; Not Found
      </p>
      <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-4 text-base text-muted-foreground leading-relaxed">
        The research publication, project idea, or company page you requested may have moved or no
        longer exists. Explore all supported engineering blogs and AI research labs below.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-foreground text-background px-4 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Back to Home
        </Link>
        <Link
          href="/companies"
          className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface-elevated transition-colors"
        >
          Browse All Companies
        </Link>
      </div>

      <section className="mt-14 pt-8 border-t border-border" aria-label="Popular organizations">
        <h2 className="text-sm font-semibold text-foreground">Popular Organizations</h2>
        <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {featured.map((company) => (
            <li key={company.slug}>
              <Link
                href={`/companies/${company.slug}`}
                className="block rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm font-medium text-foreground hover:border-border-strong hover:bg-surface-elevated transition-colors"
              >
                {company.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
