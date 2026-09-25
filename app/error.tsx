"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Server-side logging only; the message is never shown to users.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="size-6 text-destructive" aria-hidden />
      </span>

      <div>
        <h1 className="text-lg font-semibold">Something went wrong.</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>
      </div>

      <Button onClick={reset} className="gap-2">
        <RotateCcw className="size-4" />
        Try again
      </Button>
    </div>
  );
}
