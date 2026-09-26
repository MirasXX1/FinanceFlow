"use client";

import Link from "next/link";

import { useI18n } from "@/components/i18n-provider";
import { buttonVariants } from "@/components/ui/button";

export function Cta() {
  const { t } = useI18n();

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <div className="rounded-3xl bg-emerald-600 px-6 py-14 text-center text-white">
        <h2 className="text-3xl font-bold tracking-tight">
          {t.landing.readyToTakeControl}
        </h2>

        <p className="mx-auto mt-3 max-w-md text-emerald-50">
          {t.landing.subtitle}
        </p>

        <Link
          href="/register"
          className={buttonVariants({
            size: "lg",
            variant: "secondary",
            className: "mt-8",
          })}
        >
          {t.landing.getStarted}
        </Link>
      </div>
    </section>
  );
}