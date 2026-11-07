import React from "react";
import { RefreshCw } from "lucide-react";

interface RefreshButtonProps {
  onRefresh: () => void;
  isLoading: boolean;
  label?: string;
}

export function RefreshButton({
  onRefresh,
  isLoading,
  label = "Refresh",
}: RefreshButtonProps) {
  return (
    <button
      onClick={onRefresh}
      disabled={isLoading}
      aria-label={label}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-elevated hover:border-border-strong disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      <RefreshCw
        className={`h-3.5 w-3.5 text-muted-foreground ${isLoading ? "animate-spin" : ""}`}
      />
      <span>{isLoading ? "Refreshing..." : label}</span>
    </button>
  );
}
