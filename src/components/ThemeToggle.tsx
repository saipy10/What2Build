"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Monitor, Moon } from "lucide-react";
import { motion } from "motion/react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center">
        <div className="h-8 w-[92px] rounded-lg border border-border bg-surface-elevated/40" />
      </div>
    );
  }

  const options = [
    { value: "light", icon: Sun, label: "Light theme" },
    { value: "system", icon: Monitor, label: "System theme" },
    { value: "dark", icon: Moon, label: "Dark theme" },
  ] as const;

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className="flex items-center p-0.5 rounded-lg border border-border bg-surface-elevated/70 backdrop-blur"
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = theme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={opt.label}
            onClick={() => setTheme(opt.value)}
            className="relative flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {isActive && (
              <motion.div
                layoutId="theme-pill"
                className="absolute inset-0 rounded-md bg-surface shadow-xs border border-border/80"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <Icon className="relative z-10 h-3.5 w-3.5" />
          </button>
        );
      })}
    </div>
  );
}
