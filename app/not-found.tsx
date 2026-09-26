"use client";

import Link from "next/link";
import { Compass } from "lucide-react";

import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Compass className="size-6 text-muted-foreground" aria-hidden />
      </span>

      <div>
        <h1 className="text-lg font-semibold">
          {t.common.noData}
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          {t.common.noData}
        </p>
      </div>

      <Button asChild>
        <Link href="/">{t.common.back}</Link>
      </Button>
    </div>
  );
}