"use client";

import { useEffect, useState } from "react";
import type { Locale } from "./types";

const STORAGE_KEY = "financeflow-locale";

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const savedLocale = localStorage.getItem(STORAGE_KEY);

    if (
      savedLocale === "en" ||
      savedLocale === "ru" ||
      savedLocale === "kk"
    ) {
      setLocaleState(savedLocale);
    }
  }, []);

  function setLocale(newLocale: Locale) {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
  }

  return {
    locale,
    setLocale,
  };
}