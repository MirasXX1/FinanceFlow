"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingDown } from "lucide-react";

import type { MonthlyPoint } from "@/components/charts/income-expense-chart";
import { useI18n } from "@/components/i18n-provider";

type ExpenseTrendChartProps = {
  data: MonthlyPoint[];
  currency: string;
};

function formatCompact(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function ExpenseTrendChart({
  data,
  currency,
}: ExpenseTrendChartProps) {
  const { t } = useI18n();

  const total = data.reduce((sum, point) => sum + point.expenses, 0);

  if (total === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
        <TrendingDown
          className="size-8 text-muted-foreground/50"
          aria-hidden
        />

        <p className="text-sm font-medium">
          {t.charts.noExpenseTrend}
        </p>

        <p className="text-sm text-muted-foreground">
          {t.charts.noData}
        </p>
      </div>
    );
  }

  return (
    <div
      className="h-64 w-full"
      role="img"
      aria-label={t.charts.noExpenseTrend}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 8,
            right: 8,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient
              id="expenseTrendFill"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#ef4444"
                stopOpacity={0.25}
              />
              <stop
                offset="100%"
                stopColor="#ef4444"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            stroke="currentColor"
            className="text-border"
            opacity={0.6}
          />

          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickMargin={8}
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            width={56}
            tickFormatter={(value: number) =>
              formatCompact(value, currency)
            }
          />

          <Tooltip
            cursor={{ stroke: "var(--border)" }}
            labelFormatter={(_, payload) =>
              (payload?.[0]?.payload as MonthlyPoint | undefined)
                ?.monthYear ?? String(_)
            }
            formatter={(value) => [
              formatMoney(Number(value), currency),
              t.charts.expenses,
            ]}
            contentStyle={{
              borderRadius: "0.75rem",
              border: "1px solid var(--border)",
              backgroundColor: "var(--popover)",
              color: "var(--popover-foreground)",
              fontSize: "0.8125rem",
            }}
          />

          <Area
            type="monotone"
            dataKey="expenses"
            name={t.charts.expenses}
            stroke="#ef4444"
            strokeWidth={2}
            fill="url(#expenseTrendFill)"
            dot={{
              r: 3,
              fill: "#ef4444",
              strokeWidth: 0,
            }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}