"use client";

import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { useI18n } from "@/components/i18n-provider";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-sm text-muted-foreground sm:flex-row">
        <p>
          © {new Date().getFullYear()} {APP_NAME}.{" "}
          {t.landing.title}
        </p>

        <p>{APP_TAGLINE}</p>
      </div>
    </footer>
  );
}