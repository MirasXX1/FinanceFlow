"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3 } from "lucide-react";

export interface MonthlyPoint {
  /** Short month label, e.g. "Apr". */
  month: string;
  /** Full label for tooltips, e.g. "Apr 2026". */
  monthYear?: string;
  income: number;
  expenses: number;
}

type IncomeExpenseChartProps = {
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

export function IncomeExpenseChart({ data, currency }: IncomeExpenseChartProps) {
  const isEmpty = data.every((point) => point.income === 0 && point.expenses === 0);

  if (isEmpty) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
        <BarChart3 className="size-8 text-muted-foreground/50" aria-hidden />

        <p className="text-sm font-medium">No data to chart yet.</p>

        <p className="text-sm text-muted-foreground">
          Add your first transactions to see your monthly overview.
        </p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full" role="img" aria-label="Monthly income versus expenses chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="currentColor" className="text-border" opacity={0.6} />

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
            cursor={{ fill: "currentColor", className: "text-muted-foreground", opacity: 0.08 }}
            labelFormatter={(_, payload) =>
              (payload?.[0]?.payload as MonthlyPoint | undefined)?.monthYear ??
              String(_)
            }
            formatter={(value, name) => [
              formatMoney(Number(value), currency),
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

          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "0.8125rem", paddingTop: "8px" }}
          />

          <Bar dataKey="income" name="Income" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={36} />

          <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
