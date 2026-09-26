"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

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
        <h1 className="text-lg font-semibold">
          {t.common.noData}
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          {t.common.loading}
        </p>
      </div>

      <Button onClick={reset} className="gap-2">
        <RotateCcw className="size-4" />
        {t.common.reset}
      </Button>
    </div>
  );
}