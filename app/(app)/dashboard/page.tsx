import {
  ArrowDownCircle,
  ArrowUpCircle,
  PiggyBank,
  Wallet,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

import { StatCard } from "@/components/dashboard/stat-card";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
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

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: user.id,
    },
    include: {
      category: true,
    },
    orderBy: {
      date: "desc",
    },
    take: 5,
  });

  const totals = await prisma.transaction.groupBy({
    by: ["type"],
    where: {
      userId: user.id,
    },
    _sum: {
      amount: true,
    },
  });

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
          </CardHeader>

          <CardContent className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            Chart will be added next.
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
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {transaction.description || "Transaction"}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {transaction.category?.icon}{" "}
                        {transaction.category?.name || "Other"}
                      </p>
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
    </>
  );
}
