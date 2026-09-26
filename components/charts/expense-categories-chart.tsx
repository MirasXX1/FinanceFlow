"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { PieChartIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n-provider";

export interface CategorySlice {
  name: string;
  value: number;
  icon?: string | null;
}

export const CATEGORY_CHART_COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#14b8a6",
  "#f97316",
  "#6366f1",
  "#84cc16",
];

type ExpenseCategoriesChartProps = {
  data: CategorySlice[];
  currency: string;
  className?: string;
};

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function getCategoryTranslation(
  name: string,
  categories: {
    food: string;
    transport: string;
    entertainment: string;
    education: string;
    shopping: string;
    health: string;
    bills: string;
    travel: string;
    other: string;
  }
) {
  const normalized = name.trim().toLowerCase();

  switch (normalized) {
    case "food":
      return categories.food;

    case "transport":
      return categories.transport;

    case "entertainment":
      return categories.entertainment;

    case "education":
      return categories.education;

    case "shopping":
      return categories.shopping;

    case "health":
      return categories.health;

    case "bills":
      return categories.bills;

    case "travel":
      return categories.travel;

    case "other":
      return categories.other;

    default:
      return name;
  }
}

export function ExpenseCategoriesChart({
  data,
  currency,
  className,
}: ExpenseCategoriesChartProps) {
  const { t } = useI18n();

  const total = data.reduce((sum, slice) => sum + slice.value, 0);

  const translatedData = data.map((slice) => ({
    ...slice,
    name: getCategoryTranslation(slice.name, t.categories),
  }));

  if (data.length === 0 || total === 0) {
    return (
      <div
        className={cn(
          "flex h-64 flex-col items-center justify-center gap-2 text-center",
          className
        )}
      >
        <PieChartIcon
          className="size-8 text-muted-foreground/50"
          aria-hidden
        />

        <p className="text-sm font-medium">
          {t.charts.noExpenses}
        </p>

        <p className="text-sm text-muted-foreground">
          {t.charts.noData}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-6 sm:flex-row",
        className
      )}
    >
      <div
        className="relative h-52 w-52 shrink-0"
        role="img"
        aria-label={t.charts.noExpenses}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={translatedData}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="92%"
              paddingAngle={2}
              strokeWidth={0}
            >
              {translatedData.map((slice, index) => (
                <Cell
                  key={`${slice.name}-${index}`}
                  fill={
                    CATEGORY_CHART_COLORS[
                      index % CATEGORY_CHART_COLORS.length
                    ]
                  }
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, name) => [
                `${formatMoney(
                  Number(value),
                  currency
                )} (${Math.round((Number(value) / total) * 100)}%)`,
                String(name),
              ]}
              contentStyle={{
                borderRadius: "0.75rem",
                border: "1px solid var(--border)",
                backgroundColor: "var(--popover)",
                color: "var(--popover-foreground)",
                fontSize: "0.8125rem",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-muted-foreground">
            {t.charts.totalSpent}
          </span>

          <span className="text-sm font-semibold">
            {formatMoney(total, currency)}
          </span>
        </div>
      </div>

      <ul className="grid w-full flex-1 grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
        {translatedData.map((slice, index) => (
          <li
            key={`${slice.name}-${index}`}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                aria-hidden
                className="size-2.5 shrink-0 rounded-full"
                style={{
                  backgroundColor:
                    CATEGORY_CHART_COLORS[
                      index % CATEGORY_CHART_COLORS.length
                    ],
                }}
              />

              <span className="truncate text-muted-foreground">
                {slice.name}
              </span>
            </span>

            <span className="whitespace-nowrap font-medium">
              {formatMoney(slice.value, currency)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}