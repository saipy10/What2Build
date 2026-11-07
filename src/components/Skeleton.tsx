"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-surface-elevated/60",
        "after:absolute after:inset-0 after:-translate-x-full after:bg-gradient-to-r after:from-transparent after:via-foreground/5 after:to-transparent after:animate-shimmer",
        className
      )}
      {...props}
    />
  );
}

export function PaperCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 space-y-3.5">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-24 rounded" />
        <Skeleton className="h-5 w-20 rounded" />
        <Skeleton className="h-5 w-16 rounded" />
      </div>
      <Skeleton className="h-5 w-3/4 rounded" />
      <div className="space-y-1.5 pt-1">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
      </div>
      <div className="pt-2 flex justify-end">
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>
    </div>
  );
}

export function ProjectIdeaCardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-border bg-surface p-5 space-y-4 min-h-[360px]">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-8 rounded" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-6 w-4/5 rounded" />
        <div className="space-y-1.5 pt-1">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>
        <div className="pt-2 space-y-2">
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      </div>
      <div className="space-y-2 pt-2 border-t border-border">
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-16 rounded" />
          <Skeleton className="h-5 w-14 rounded" />
          <Skeleton className="h-5 w-18 rounded" />
        </div>
      </div>
    </div>
  );
}

