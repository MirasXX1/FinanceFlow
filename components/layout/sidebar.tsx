"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useI18n } from "@/components/i18n-provider";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { Logo } from "./logo";

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();

  function getLabel(href: string) {
    switch (href) {
      case "/dashboard":
        return t.nav.dashboard;

      case "/transactions":
        return t.nav.transactions;

      case "/goals":
        return t.nav.goals;

      case "/statistics":
        return t.nav.statistics;

      case "/settings":
        return t.nav.settings;

      default:
        return "";
    }
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-background md:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Logo href="/dashboard" />
      </div>

      <nav
        aria-label={t.nav.dashboard}
        className="flex-1 space-y-1 p-4"
      >
        {NAV_ITEMS.map(({ href, icon: Icon }) => {
          const isActive =
            pathname === href ||
            pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              aria-current={
                isActive ? "page" : undefined
              }
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-emerald-600 text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {getLabel(href)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}