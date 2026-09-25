import {
  ArrowDownCircle,
  ArrowUpCircle,
  PiggyBank,
  Wallet,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { getExpenseByCategory, getMonthlySeries } from "@/lib/analytics";
import { formatMoneyCompact, formatDayMonth } from "@/lib/format";

import { StatCard } from "@/components/dashboard/stat-card";
import { DashboardActions } from "@/components/dashboard/dashboard-actions";
import { IncomeExpenseChart } from "@/components/charts/income-expense-chart";
import { ExpenseCategoriesChart } from "@/components/charts/expense-categories-chart";
import { PageHeader } from "@/components/layout/page-header";
import { CategoryIcon } from "@/components/categories/category-icon";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const sessionUser = await requireAuth();

  const user = await prisma.user.findUnique({
    where: {
      id: sessionUser.id,
    },
    select: {
      id: true,
      currency: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const [categories, transactions, totals, monthlySeries, expenseByCategory] =
    await Promise.all([
      prisma.category.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          icon: true,
        },
      }),
      prisma.transaction.findMany({
        where: {
          userId: user.id,
        },
        include: {
          category: true,
        },
        orderBy: [{ date: "desc" }, { createdAt: "desc" }],
        take: 5,
      }),
      prisma.transaction.groupBy({
        by: ["type"],
        where: {
          userId: user.id,
        },
        _sum: {
          amount: true,
        },
      }),
      getMonthlySeries(user.id, 6),
      getExpenseByCategory(user.id),
    ]);

  const income = Number(
    totals.find((item) => item.type === "INCOME")?._sum.amount ?? 0
  );

  const expenses = Number(
    totals.find((item) => item.type === "EXPENSE")?._sum.amount ?? 0
  );

  const balance = income - expenses;

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: user.currency,
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Your financial overview at a glance."
      />

      <DashboardActions
        categories={categories}
        currency={user.currency}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Balance"
          value={formatMoney(balance)}
          icon={Wallet}
        />

        <StatCard
          title="Total Income"
          value={formatMoney(income)}
          icon={ArrowUpCircle}
          tone="income"
        />

        <StatCard
          title="Total Expenses"
          value={formatMoney(expenses)}
          icon={ArrowDownCircle}
          tone="expense"
        />

        <StatCard
          title="Savings"
          value={formatMoney(balance)}
          icon={PiggyBank}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>

            <CardDescription>Your last 6 months at a glance.</CardDescription>
          </CardHeader>

          <CardContent>
            <IncomeExpenseChart
              data={monthlySeries}
              currency={user.currency}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>

          <CardContent>
            {transactions.length === 0 ? (
              <div className="flex h-52 items-center justify-center text-sm text-muted-foreground">
                No transactions yet.
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span
                        className={
                          transaction.type === "INCOME"
                            ? "flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-600"
                            : "flex size-8 shrink-0 items-center justify-center rounded-full bg-red-600/10 text-red-600"
                        }
                      >
                        <CategoryIcon icon={transaction.category?.icon} />
                      </span>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {transaction.description || "Transaction"}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {transaction.category?.name || "Other"} ·{" "}
                          {formatDayMonth(transaction.date)}
                        </p>
                      </div>
                    </div>

                    <span
                      className={
                        transaction.type === "INCOME"
                          ? "text-sm font-semibold text-emerald-600"
                          : "text-sm font-semibold text-red-600"
                      }
                    >
                      {transaction.type === "INCOME" ? "+" : "-"}
                      {formatMoney(Number(transaction.amount))}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Expense Categories</CardTitle>

          <CardDescription>Where your money goes.</CardDescription>
        </CardHeader>

        <CardContent>
          <ExpenseCategoriesChart
            data={expenseByCategory}
            currency={user.currency}
          />
        </CardContent>
      </Card>
    </>
  );
}
