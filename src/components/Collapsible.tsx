"use client";

import React, { useState, useId } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface CollapsibleProps {
  title: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
}

export function Collapsible({
  title,
  defaultOpen = false,
  children,
  className = "",
  headerClassName = "",
  badge,
  icon,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface transition-colors overflow-hidden",
        isOpen ? "border-border-strong bg-surface" : "hover:border-border-strong",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className={cn(
          "w-full flex items-center justify-between gap-3 p-4 text-left transition-colors cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          headerClassName
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {icon && <div className="shrink-0 text-muted-foreground">{icon}</div>}
          <div className="font-medium text-sm sm:text-base text-foreground truncate">{title}</div>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={contentId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-border text-muted-foreground text-sm sm:text-base leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
