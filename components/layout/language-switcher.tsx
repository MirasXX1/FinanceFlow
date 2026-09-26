"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";
import {
  LOCALES,
  LOCALE_LABELS,
} from "@/lib/i18n/types";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div
      className="flex items-center gap-1 rounded-lg border bg-background p-1"
      aria-label="Language"
    >
      {LOCALES.map((item) => (
        <Button
          key={item}
          type="button"
          variant={
            locale === item
              ? "secondary"
              : "ghost"
          }
          size="sm"
          onClick={() => setLocale(item)}
          className="h-8 px-2 text-xs"
          aria-label={LOCALE_LABELS[item]}
          aria-pressed={locale === item}
        >
          {item.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}