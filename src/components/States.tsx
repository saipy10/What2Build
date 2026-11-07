import React from "react";
import { AlertCircle, Inbox, RefreshCw } from "lucide-react";
import { PaperCardSkeleton, ProjectIdeaCardSkeleton } from "./Skeleton";

export function LoadingState({
  message = "Loading...",
  type = "paper",
  count = 3,
}: {
  message?: string;
  type?: "paper" | "idea";
  count?: number;
}) {
  return (
    <div className="space-y-4">
      <div className="text-xs font-mono text-muted-foreground pb-1">
        {message}
      </div>
      <div className={type === "idea" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i}>
            {type === "idea" ? <ProjectIdeaCardSkeleton /> : <PaperCardSkeleton />}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ErrorState({
  title = "Failed to load records",
  message = "Could not fetch updates from this source.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-xl border border-danger/20 bg-danger/5">
      <AlertCircle className="h-8 w-8 text-danger mb-3" />
      <h3 className="text-base font-medium text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mt-1 mb-5 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2 text-xs font-medium text-foreground hover:bg-surface-elevated hover:border-border-strong transition-colors cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title = "No publications found",
  message = "No records were found for this query.",
  actionLabel,
  onAction,
}: {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-xl border border-border bg-surface">
      <Inbox className="h-8 w-8 text-muted-foreground mb-3" />
      <h3 className="text-base font-medium text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mt-1 mb-5 leading-relaxed">{message}</p>
      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-1.5 rounded-lg bg-surface-elevated hover:bg-surface-elevated/80 border border-border px-4 py-2 text-xs font-medium text-foreground transition-colors cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
