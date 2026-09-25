"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { useI18n } from "@/components/i18n-provider";

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-background md:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Logo href="/dashboard" />
      </div>
      <nav aria-label="Main navigation" className="flex-1 space-y-1 p-4">
        {NAV_ITEMS.map(({ href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          let label = "";

switch (href) {
  case "/dashboard":
    label = t.nav.dashboard;
    break;
  case "/transactions":
    label = t.nav.transactions;
    break;
  case "/goals":
    label = t.nav.goals;
    break;
  case "/statistics":
    label = t.nav.statistics;
    break;
  case "/settings":
    label = t.nav.settings;
    break;
}
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-emerald-600 text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
