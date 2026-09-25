import { en } from "./en";
import { ru } from "./ru";
import { kk } from "./kk";
import type { Locale } from "./types";

export const translations = {
  en,
  ru,
  kk,
} as const;

export function getTranslations(locale: Locale) {
  return translations[locale];
}