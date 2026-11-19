"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/States";
import { trackUserError } from "@/lib/analytics";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    trackUserError({
      errorType: "unhandled_app_error",
      message: error.message || "An unexpected application error occurred.",
      context: error.digest,
    });
  }, [error]);

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-16">
      <ErrorState
        message={error.message || "Something went wrong."}
        onRetry={reset}
      />
    </div>
  );
}
