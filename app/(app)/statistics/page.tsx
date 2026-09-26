import {
  ArrowDownRight,
  ArrowUpRight,
  Equal,
  Info,
  PiggyBank,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import {
  getExpenseByCategory,
  getMonthlySeries,
  getTotals,
} from "@/lib/analytics";
import { formatMoneyCompact } from "@/lib/format";
import type { CurrencyCode } from "@/lib/format";
import type { ReactNode } from "react";

import { I18nText } from "@/components/i18n-text";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { IncomeExpenseChart } from "@/components/charts/income-expense-chart";
import { ExpenseCategoriesChart } from "@/components/charts/expense-categories-chart";
import { ExpenseTrendChart } from "@/components/charts/expense-trend-chart";
import { CategoryIcon } from "@/components/categories/category-icon";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const metadata = { title: "Statistics" };

function utcMonthRange(offset: number): { from: Date; to: Date } {
  const now = new Date();

  const from = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth() - offset,
      1
    )
  );

  const to = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth() - offset + 1,
      1
    )
  );

  return { from, to };
}

export default async function StatisticsPage() {
  const sessionUser = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { currency: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const currency = user.currency as CurrencyCode;

  const [
    monthlySeries,
    totals,
    expenseByCategory,
    thisMonthCategories,
  ] = await Promise.all([
    getMonthlySeries(sessionUser.id, 12),
    getTotals(sessionUser.id),
    getExpenseByCategory(sessionUser.id),
    getExpenseByCategory(
      sessionUser.id,
      utcMonthRange(0)
    ),
  ]);

  const netBalance = totals.income - totals.expenses;

  const last12Expenses = monthlySeries.reduce(
    (sum, point) => sum + point.expenses,
    0
  );

  const avgMonthlyExpenses =
    last12Expenses / monthlySeries.length;

  const thisMonth =
    monthlySeries[monthlySeries.length - 1];

  const lastMonth =
    monthlySeries[monthlySeries.length - 2];

  const topCategories = expenseByCategory.slice(0, 5);
  const largestCategoryThisMonth = thisMonthCategories[0];

  const monthOverMonthChange =
    lastMonth && lastMonth.expenses > 0
      ? Math.round(
          ((thisMonth.expenses - lastMonth.expenses) /
            lastMonth.expenses) *
            100
        )
      : null;

  const savingsRate =
    totals.income > 0
      ? Math.round((netBalance / totals.income) * 100)
      : null;

  const hasAnyData =
    totals.income > 0 || totals.expenses > 0;

  return (
    <>
      <PageHeader
        title={<I18nText k="statistics.title" />}
        description={
          <I18nText k="statistics.subtitle" />
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={<I18nText k="statistics.income" />}
          value={formatMoneyCompact(
            totals.income,
            currency
          )}
          icon={ArrowUpRight}
          tone="income"
        />

        <StatCard
          title={<I18nText k="statistics.expenses" />}
          value={formatMoneyCompact(
            totals.expenses,
            currency
          )}
          icon={ArrowDownRight}
          tone="expense"
        />

        <StatCard
          title={<I18nText k="statistics.netBalance" />}
          value={formatMoneyCompact(
            netBalance,
            currency
          )}
          icon={Equal}
        />

        <StatCard
          title={
            <I18nText k="statistics.avgMonthlyExpenses" />
          }
          value={formatMoneyCompact(
            avgMonthlyExpenses,
            currency
          )}
          icon={PiggyBank}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              <I18nText k="statistics.monthlyAnalysis" />
            </CardTitle>

            <CardDescription>
              <I18nText k="statistics.monthlyAnalysisDescription" />
            </CardDescription>
          </CardHeader>

          <CardContent>
            <IncomeExpenseChart
              data={monthlySeries}
              currency={currency}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <I18nText k="statistics.topCategories" />
            </CardTitle>

            <CardDescription>
              <I18nText k="statistics.topCategoriesDescription" />
            </CardDescription>
          </CardHeader>

          <CardContent>
            {topCategories.length === 0 ? (
              <p className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                <I18nText k="statistics.noExpenseData" />
              </p>
            ) : (
              <ul className="space-y-4">
                {topCategories.map((slice, index) => {
                  const share = Math.round(
                    (slice.value / totals.expenses) * 100
                  );

                  const categoryKey = slice.name
                    ? `categories.${slice.name
                        .trim()
                        .toLowerCase()}`
                    : "categories.other";

                  return (
                    <li key={slice.name}>
                      <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                            {index + 1}
                          </span>

                          <CategoryIcon
                            icon={slice.icon ?? null}
                            className="size-4 shrink-0 text-muted-foreground"
                          />

                          <span className="truncate font-medium">
                            <I18nText k={categoryKey} />
                          </span>
                        </span>

                        <span className="whitespace-nowrap font-semibold">
                          {formatMoneyCompact(
                            slice.value,
                            currency
                          )}

                          <span className="ml-1 text-xs font-normal text-muted-foreground">
                            {share}%
                          </span>
                        </span>
                      </div>

                      <Progress
                        value={share}
                        aria-label={`${slice.name}: ${share}%`}
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              <I18nText k="statistics.expenseCategories" />
            </CardTitle>

            <CardDescription>
              <I18nText k="statistics.expenseCategoriesDescription" />
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ExpenseCategoriesChart
              data={expenseByCategory}
              currency={currency}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <I18nText k="statistics.spendingTrend" />
            </CardTitle>

            <CardDescription>
              <I18nText k="statistics.spendingTrendDescription" />
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ExpenseTrendChart
              data={monthlySeries}
              currency={currency}
            />
          </CardContent>
        </Card>
      </div>

      {hasAnyData && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="size-4 text-primary" />

              <I18nText k="statistics.insights" />
            </CardTitle>

            <CardDescription>
              <I18nText k="statistics.insightsDescription" />
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ul className="space-y-3">
              {largestCategoryThisMonth && (
                <Insight>
                  <I18nText k="statistics.largestCategory" />{" "}
                  <strong>
                    <I18nText
                      k={`categories.${largestCategoryThisMonth.name
                        .trim()
                        .toLowerCase()}`}
                    />
                  </strong>{" "}
                  —{" "}
                  <I18nText k="statistics.youSpent" />{" "}
                  <strong>
                    {formatMoneyCompact(
                      largestCategoryThisMonth.value,
                      currency
                    )}
                  </strong>
                  .
                </Insight>
              )}

              <Insight>
                <I18nText k="statistics.incomeThisMonth" />{" "}
                <strong>
                  {formatMoneyCompact(
                    thisMonth.income,
                    currency
                  )}
                </strong>
                ,{" "}
                <I18nText k="statistics.expensesThisMonth" />{" "}
                <strong>
                  {formatMoneyCompact(
                    thisMonth.expenses,
                    currency
                  )}
                </strong>
                .
              </Insight>

              {thisMonth.income -
                thisMonth.expenses !==
                0 && (
                <Insight>
                  <I18nText
                    k={
                      thisMonth.income -
                        thisMonth.expenses >
                      0
                        ? "statistics.youKept"
                        : "statistics.youOverspentBy"
                    }
                  />{" "}
                  <strong>
                    {formatMoneyCompact(
                      Math.abs(
                        thisMonth.income -
                          thisMonth.expenses
                      ),
                      currency
                    )}
                  </strong>{" "}
                  <I18nText k="statistics.thisMonth" />.
                </Insight>
              )}

              {monthOverMonthChange !== null &&
                monthOverMonthChange !== 0 && (
                  <Insight>
                    <I18nText k="statistics.youSpent" />{" "}
                    <strong>
                      {Math.abs(
                        monthOverMonthChange
                      )}%{" "}
                      <I18nText
                        k={
                          monthOverMonthChange > 0
                            ? "statistics.more"
                            : "statistics.less"
                        }
                      />
                    </strong>{" "}
                    <I18nText
                      k="statistics.thanLastMonth"
                    />
                    .
                  </Insight>
                )}

              {savingsRate !== null && (
                <Insight>
                  <I18nText k="statistics.savingsRate" />{" "}
                  <strong>{savingsRate}%</strong>{" "}
                  <I18nText k="statistics.ofTotalIncome" />.
                </Insight>
              )}
            </ul>
          </CardContent>
        </Card>
      )}
    </>
  );
}

function Insight({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
      <span
        aria-hidden
        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
      />
      <span>{children}</span>
    </li>
  );
}