"use client";

import { useI18n } from "@/components/i18n-provider";

type Props = {
  k: string;
};

export function I18nText({ k }: Props) {
  const { t } = useI18n();

  const value = k.split(".").reduce<unknown>((current, key) => {
    if (
      current !== null &&
      typeof current === "object" &&
      key in current
    ) {
      return (current as Record<string, unknown>)[key];
    }

    return undefined;
  }, t);

  return typeof value === "string" ? value : k;
}
