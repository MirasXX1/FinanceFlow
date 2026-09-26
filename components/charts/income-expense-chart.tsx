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

import { useI18n } from "@/components/i18n-provider";

export interface MonthlyPoint {
  /** Short month label, e.g. "Apr" or "M04". */
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

function formatCompact(
  value: number,
  currency: string,
  locale: string
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatMoney(
  value: number,
  currency: string,
  locale: string
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function IncomeExpenseChart({
  data,
  currency,
}: IncomeExpenseChartProps) {
  const { t, locale } = useI18n();

  const isEmpty = data.every(
    (point) => point.income === 0 && point.expenses === 0
  );

  if (isEmpty) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
        <BarChart3
          className="size-8 text-muted-foreground/50"
          aria-hidden
        />

        <p className="text-sm font-medium">
          {t.charts.noData}
        </p>

        <p className="text-sm text-muted-foreground">
          {t.charts.noData}
        </p>
      </div>
    );
  }

  const localizedData = data.map((point) => ({
    ...point,
    month: localizeMonth(point.month, locale),
    monthYear: point.monthYear
      ? localizeMonthYear(point.monthYear, locale)
      : undefined,
  }));

  return (
    <div
      className="h-64 w-full"
      role="img"
      aria-label={`${t.charts.income} / ${t.charts.expenses}`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={localizedData}
          margin={{
            top: 8,
            right: 8,
            left: 0,
            bottom: 0,
          }}
        >
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
              formatCompact(
                value,
                currency,
                getIntlLocale(locale)
              )
            }
          />

          <Tooltip
            cursor={{
              fill: "currentColor",
              className: "text-muted-foreground",
              opacity: 0.08,
            }}
            labelFormatter={(label, payload) =>
              (payload?.[0]?.payload as MonthlyPoint | undefined)
                ?.monthYear ?? String(label)
            }
            formatter={(value, name) => [
              formatMoney(
                Number(value),
                currency,
                getIntlLocale(locale)
              ),
              name === "income"
                ? t.charts.income
                : t.charts.expenses,
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
            wrapperStyle={{
              fontSize: "0.8125rem",
              paddingTop: "8px",
            }}
            formatter={(value) =>
              value === "income"
                ? t.charts.income
                : t.charts.expenses
            }
          />

          <Bar
            dataKey="income"
            name="income"
            fill="#10b981"
            radius={[6, 6, 0, 0]}
            maxBarSize={36}
          />

          <Bar
            dataKey="expenses"
            name="expenses"
            fill="#ef4444"
            radius={[6, 6, 0, 0]}
            maxBarSize={36}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function getIntlLocale(locale: string) {
  if (locale === "ru") {
    return "ru-RU";
  }

  if (locale === "kk") {
    return "kk-KZ";
  }

  return "en-US";
}

function getMonthIndex(month: string): number | undefined {
  const normalized = month.trim().toLowerCase();

  const numericMatch = normalized.match(
    /^m(0?[1-9]|1[0-2])$/
  );

  if (numericMatch) {
    return Number(numericMatch[1]) - 1;
  }

  const months: Record<string, number> = {
    jan: 0,
    january: 0,

    feb: 1,
    february: 1,

    mar: 2,
    march: 2,

    apr: 3,
    april: 3,

    may: 4,

    jun: 5,
    june: 5,

    jul: 6,
    july: 6,

    aug: 7,
    august: 7,

    sep: 8,
    sept: 8,
    september: 8,

    oct: 9,
    october: 9,

    nov: 10,
    november: 10,

    dec: 11,
    december: 11,
  };

  return months[normalized];
}

function getMonthNames(locale: string): string[] {
  if (locale === "ru") {
    return [
      "Янв",
      "Фев",
      "Мар",
      "Апр",
      "Май",
      "Июн",
      "Июл",
      "Авг",
      "Сен",
      "Окт",
      "Ноя",
      "Дек",
    ];
  }

  if (locale === "kk") {
    return [
      "Қаң",
      "Ақп",
      "Нау",
      "Сәу",
      "Мам",
      "Маус",
      "Шіл",
      "Там",
      "Қыр",
      "Қаз",
      "Қар",
      "Жел",
    ];
  }

  return [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
}

function localizeMonth(
  month: string,
  locale: string
) {
  const monthIndex = getMonthIndex(month);

  if (monthIndex === undefined) {
    return month;
  }

  return getMonthNames(locale)[monthIndex];
}

function localizeMonthYear(
  value: string,
  locale: string
) {
  const date = new Date(value);

  if (!Number.isNaN(date.getTime())) {
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return `${getMonthNames(locale)[monthIndex]} ${year}`;
  }

  const match = value.match(
    /^([A-Za-z]+)\s+(\d{4})$/
  );

  if (!match) {
    return value;
  }

  const monthIndex = getMonthIndex(match[1]);

  if (monthIndex === undefined) {
    return value;
  }

  return `${getMonthNames(locale)[monthIndex]} ${match[2]}`;
}