"use client";

import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useI18n } from "@/components/i18n-provider";
import { buttonVariants } from "@/components/ui/button";

export function LandingNavbar() {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />

        <nav
          aria-label={t.landing.features}
          className="hidden items-center gap-6 text-sm text-muted-foreground md:flex"
        >
          <a
            href="#features"
            className="hover:text-foreground"
          >
            {t.landing.features}
          </a>

          <a
            href="#how-it-works"
            className="hover:text-foreground"
          >
            {t.landing.howItWorks}
          </a>

          <a
            href="#statistics"
            className="hover:text-foreground"
          >
            {t.landing.statistics}
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />

          <Link
            href="/login"
            className={buttonVariants({
              variant: "ghost",
            })}
          >
            {t.landing.login}
          </Link>

          <Link
            href="/register"
            className={buttonVariants({})}
          >
            {t.landing.getStarted}
          </Link>
        </div>
      </div>
    </header>
  );
}