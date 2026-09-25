import {
  ArrowDownCircle,
  ArrowUpCircle,
  PiggyBank,
  Wallet,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { getExpenseByCategory, getMonthlySeries } from "@/lib/analytics";
import { formatDayMonth } from "@/lib/format";

import { StatCard } from "@/components/dashboard/stat-card";
import { DashboardActions } from "@/components/dashboard/dashboard-actions";
import { IncomeExpenseChart } from "@/components/charts/income-expense-chart";
import { ExpenseCategoriesChart } from "@/components/charts/expense-categories-chart";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { CategoryIcon } from "@/components/categories/category-icon";
import { I18nText } from "@/components/i18n-text";

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
      <DashboardHeader />

      <DashboardActions
        categories={categories}
        currency={user.currency}
      />

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={<I18nText k="dashboard.balance" />}
          value={formatMoney(balance)}
          icon={Wallet}
        />

        <StatCard
          title={<I18nText k="dashboard.income" />}
          value={formatMoney(income)}
          icon={ArrowUpCircle}
          tone="income"
        />

        <StatCard
          title={<I18nText k="dashboard.expenses" />}
          value={formatMoney(expenses)}
          icon={ArrowDownCircle}
          tone="expense"
        />

        <StatCard
          title={<I18nText k="dashboard.savings" />}
          value={formatMoney(balance)}
          icon={PiggyBank}
        />
      </div>

      {/* Charts + Recent Transactions */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              <I18nText k="dashboard.incomeVsExpenses" />
            </CardTitle>

            <CardDescription>
              <I18nText k="dashboard.incomeVsExpensesDescription" />
            </CardDescription>
          </CardHeader>

          <CardContent>
            <IncomeExpenseChart
              data={monthlySeries}
              currency={user.currency}
            />
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>
              <I18nText k="dashboard.recentTransactions" />
            </CardTitle>
          </CardHeader>

          <CardContent>
            {transactions.length === 0 ? (
              <div className="flex h-52 items-center justify-center text-sm text-muted-foreground">
                <I18nText k="dashboard.noTransactions" />
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
                          {transaction.description || (
                            <I18nText k="dashboard.transaction" />
                          )}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {transaction.category?.name || (
                            <I18nText k="categories.other" />
                          )}{" "}
                          · {formatDayMonth(transaction.date)}
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

      {/* Expense Categories */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>
            <I18nText k="dashboard.expenseCategories" />
          </CardTitle>

          <CardDescription>
            <I18nText k="dashboard.expenseCategoriesDescription" />
          </CardDescription>
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