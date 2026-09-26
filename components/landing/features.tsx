"use client";

import {
  ArrowLeftRight,
  BarChart3,
  ShieldCheck,
  Tags,
  Target,
  Wallet,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/components/i18n-provider";

export function Features() {
  const { t } = useI18n();

  const features = [
    {
      icon: Wallet,
      title: t.landing.featureBalanceTitle,
      text: t.landing.featureBalanceText,
    },
    {
      icon: ArrowLeftRight,
      title: t.landing.featureTransactionsTitle,
      text: t.landing.featureTransactionsText,
    },
    {
      icon: Tags,
      title: t.landing.featureCategoriesTitle,
      text: t.landing.featureCategoriesText,
    },
    {
      icon: Target,
      title: t.landing.featureGoalsTitle,
      text: t.landing.featureGoalsText,
    },
    {
      icon: BarChart3,
      title: t.landing.featureStatisticsTitle,
      text: t.landing.featureStatisticsText,
    },
    {
      icon: ShieldCheck,
      title: t.landing.featureSecurityTitle,
      text: t.landing.featureSecurityText,
    },
  ];

  return (
    <section
      id="features"
      className="border-y bg-muted/30 py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          {t.landing.features}
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          {t.landing.subtitle}
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <Card
              key={title}
              className="transition-shadow hover:shadow-md"
            >
              <CardContent className="p-6 pt-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="font-semibold">{title}</h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}