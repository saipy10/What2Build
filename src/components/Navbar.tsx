"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SUPPORTED_COMPANIES } from "@/lib/companies";
import { CompanyLogo, GitHubLogo } from "@/components/CompanyLogos";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const companiesList = Object.values(SUPPORTED_COMPANIES);

  const filteredCompanies = companiesList.filter((comp) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      comp.name.toLowerCase().includes(q) ||
      comp.slug.toLowerCase().includes(q) ||
      comp.tagline.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCompany = (slug: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/companies/${slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Enter" && filteredCompanies.length > 0) {
      handleSelectCompany(filteredCompanies[0].slug);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-md shadow-xs"
          : "border-b border-transparent bg-background"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-3">
        {/* Brand & Search Bar */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-lg">
          <Link
            href="/"
            className="flex items-center gap-2 text-foreground hover:opacity-85 transition-opacity shrink-0"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden border border-border shadow-xs bg-surface shrink-0">
              <Image
                src="/images/logo.png"
                alt="What2Build Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <span className="font-semibold tracking-tight text-foreground text-sm sm:text-base inline">
              What2Build
            </span>
          </Link>

          {/* Search Bar with Dropdown besides logo */}
          <div ref={dropdownRef} className="relative flex-1 max-w-xs sm:max-w-sm">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (!isOpen) setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder="Search companies..."
                className="w-full h-8 rounded-lg border border-border bg-surface pl-8 pr-12 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent transition-all shadow-2xs"
              />
              <div className="absolute right-2 flex items-center gap-1">
                {query ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      inputRef.current?.focus();
                    }}
                    className="p-0.5 rounded text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-0.5 rounded text-muted-foreground hover:text-foreground"
                  >
                    <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                )}
              </div>
            </div>

            {/* Dropdown list */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 mt-1.5 max-h-72 overflow-y-auto rounded-xl border border-border bg-surface shadow-lg z-50 py-1.5 text-xs no-scrollbar"
                >
                  <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/50">
                    Engineering Blogs ({filteredCompanies.length})
                  </div>
                  {filteredCompanies.length > 0 ? (
                    filteredCompanies.map((comp) => (
                      <button
                        key={comp.slug}
                        type="button"
                        onClick={() => handleSelectCompany(comp.slug)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-surface-elevated text-foreground transition-colors cursor-pointer group"
                      >
                        <div className="w-5 h-5 flex items-center justify-center shrink-0 rounded bg-surface border border-border/60 p-0.5 text-foreground">
                          <CompanyLogo slug={comp.slug} className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground truncate group-hover:text-accent transition-colors">
                            {comp.name}
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate">
                            {comp.tagline}
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-center text-muted-foreground text-xs">
                      No matching company found.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right side navigation & Theme Toggle */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <a
            href={process.env.NEXT_PUBLIC_REPO_URL || "https://github.com/saipy10/What2Build"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors"
          >
            <GitHubLogo className="h-4 w-4" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
