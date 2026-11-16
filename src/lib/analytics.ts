import { track } from "@vercel/analytics";

export type TrackedErrorType =
  | "company_papers_fetch_error"
  | "company_papers_refresh_error"
  | "paper_ideas_fetch_error"
  | "paper_ideas_regenerate_error"
  | "unhandled_app_error";

interface TrackErrorOptions {
  errorType: TrackedErrorType;
  message: string;
  context?: string;
}

/**
 * Tracks a user-facing error in Vercel Analytics.
 * Vercel Analytics aggregates total occurrence counts per event/property,
 * while `lastOccurredAt` records the ISO timestamp of each occurrence.
 */
export function trackUserError({ errorType, message, context }: TrackErrorOptions): void {
  try {
    track("user_error", {
      errorType,
      message: message.slice(0, 255),
      ...(context ? { context: context.slice(0, 255) } : {}),
      lastOccurredAt: new Date().toISOString(),
    });
  } catch {
    // Never let analytics tracking failures break the UI
  }
}
