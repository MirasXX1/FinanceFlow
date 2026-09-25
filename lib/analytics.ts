import { prisma } from "@/lib/prisma";
import { formatMonth, formatMonthYear } from "@/lib/format";
import type { MonthlyPoint } from "@/components/charts/income-expense-chart";
import type { CategorySlice } from "@/components/charts/expense-categories-chart";

/**
 * Last `months` months (including the current one), oldest first.
 * Months without transactions contain zero values.
 */
export async function getMonthlySeries(userId: string, months = 6): Promise<MonthlyPoint[]> {
  const now = new Date();
  const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (months - 1), 1));

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: { gte: from },
    },
    select: {
      type: true,
      amount: true,
      date: true,
    },
  });

  const keys: string[] = [];
  const buckets = new Map<string, MonthlyPoint>();

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;

    keys.push(key);
    buckets.set(key, {
      month: formatMonth(date),
      monthYear: formatMonthYear(date),
      income: 0,
      expenses: 0,
    });
  }

  for (const transaction of transactions) {
    const date = new Date(transaction.date);
    const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
    const bucket = buckets.get(key);

    if (!bucket) continue;

    if (transaction.type === "INCOME") {
      bucket.income += Number(transaction.amount);
    } else {
      bucket.expenses += Number(transaction.amount);
    }
  }

  return keys.map((key) => buckets.get(key) as MonthlyPoint);
}

/**
 * All-time income/expense totals for a user.
 */
export async function getTotals(userId: string): Promise<{
  income: number;
  expenses: number;
}> {
  const grouped = await prisma.transaction.groupBy({
    by: ["type"],
    where: { userId },
    _sum: { amount: true },
  });

  return {
    income: Number(grouped.find((item) => item.type === "INCOME")?._sum.amount ?? 0),
    expenses: Number(grouped.find((item) => item.type === "EXPENSE")?._sum.amount ?? 0),
  };
}

/**
 * Expense totals grouped by category, highest first.
 */
export async function getExpenseByCategory(
  userId: string,
  options?: { from?: Date; to?: Date }
): Promise<CategorySlice[]> {
  const grouped = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: {
      userId,
      type: "EXPENSE",
      categoryId: { not: null },
      ...(options?.from || options?.to
        ? {
            date: {
              ...(options.from ? { gte: options.from } : {}),
              ...(options.to ? { lte: options.to } : {}),
            },
          }
        : {}),
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });

  const categoryIds = grouped
    .map((item) => item.categoryId)
    .filter((id): id is string => Boolean(id));

  if (categoryIds.length === 0) {
    return [];
  }

  const categories = await prisma.category.findMany({
    where: {
      id: { in: categoryIds },
    },
    select: {
      id: true,
      name: true,
      icon: true,
    },
  });

  const names = new Map(
    categories.map((category) => [category.id, { name: category.name, icon: category.icon }])
  );

  const slices: CategorySlice[] = [];

  for (const item of grouped) {
    if (!item.categoryId) continue;

    const info = names.get(item.categoryId);

    slices.push({
      name: info?.name || "Other",
      value: Number(item._sum.amount ?? 0),
      icon: info?.icon ?? null,
    });
  }

  return slices.filter((slice) => slice.value > 0);
}
