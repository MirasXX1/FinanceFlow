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

export function ExpenseTrendChart({ data, currency }: ExpenseTrendChartProps) {
  const total = data.reduce((sum, point) => sum + point.expenses, 0);

  if (total === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
        <TrendingDown className="size-8 text-muted-foreground/50" aria-hidden />

        <p className="text-sm font-medium">No expense trend yet.</p>

        <p className="text-sm text-muted-foreground">
          Record expenses to see how your spending changes over time.
        </p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full" role="img" aria-label="Monthly expense trend chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="expenseTrendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
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
            tickFormatter={(value: number) => formatCompact(value, currency)}
          />

          <Tooltip
            cursor={{ stroke: "var(--border)" }}
            labelFormatter={(_, payload) =>
              (payload?.[0]?.payload as MonthlyPoint | undefined)?.monthYear ??
              String(_)
            }
            formatter={(value) => [formatMoney(Number(value), currency), "Expenses"]}
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
            name="Expenses"
            stroke="#ef4444"
            strokeWidth={2}
            fill="url(#expenseTrendFill)"
            dot={{ r: 3, fill: "#ef4444", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
