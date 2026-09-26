"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/components/i18n-provider";

const categories = [
  {
    name: "food",
    width: "75%",
    color: "bg-emerald-500",
  },
  {
    name: "transport",
    width: "45%",
    color: "bg-sky-500",
  },
  {
    name: "shopping",
    width: "60%",
    color: "bg-violet-500",
  },
  {
    name: "bills",
    width: "85%",
    color: "bg-amber-500",
  },
] as const;

export function StatsPreview() {
  const { t } = useI18n();

  return (
    <section
      id="statistics"
      className="border-y bg-muted/30 py-16 md:py-24"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {t.landing.seeWhereMoneyGoes}
          </h2>

          <p className="mt-4 text-muted-foreground">
            {t.landing.spendingByCategory}
          </p>
        </div>

        <Card aria-hidden="true">
          <CardContent className="space-y-4 p-6 pt-6">
            <p className="text-sm font-medium">
              {t.landing.spendingByCategory}
            </p>

            {categories.map((category) => (
              <div key={category.name}>
                <p className="mb-1 text-xs text-muted-foreground">
                  {t.categories[category.name]}
                </p>

                <div className="h-3 rounded-full bg-muted">
                  <div
                    className={`h-3 rounded-full ${category.color}`}
                    style={{ width: category.width }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}