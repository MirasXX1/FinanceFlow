import { CheckCircle2, Flag, PiggyBank, Target } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import type { CurrencyCode } from "@/lib/format";
import type { GoalRow } from "@/lib/types";

import { I18nText } from "@/components/i18n-text";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { GoalsView } from "@/components/goals/goals-view";

export const metadata = { title: "Goals" };

export default async function GoalsPage() {
  const sessionUser = await requireAuth();

  const [user, goals] = await Promise.all([
    prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { currency: true },
    }),
    prisma.financialGoal.findMany({
      where: { userId: sessionUser.id },
      orderBy: [{ createdAt: "asc" }],
    }),
  ]);

  if (!user) {
    throw new Error("User not found");
  }

  const currency = user.currency as CurrencyCode;
  const now = new Date();

  const rows: GoalRow[] = goals.map((goal) => ({
    id: goal.id,
    name: goal.name,
    targetAmount: Number(goal.targetAmount),
    currentAmount: Number(goal.currentAmount),
    deadline: goal.deadline ? goal.deadline.toISOString() : null,
    color: goal.color,
    isOverdue: Boolean(goal.deadline && goal.deadline < now),
  }));

  const totalGoals = rows.length;

  const completedGoals = rows.filter(
    (goal) =>
      goal.targetAmount > 0 &&
      goal.currentAmount >= goal.targetAmount
  ).length;

  const totalTarget = rows.reduce(
    (sum, goal) => sum + goal.targetAmount,
    0
  );

  const totalSaved = rows.reduce(
    (sum, goal) => sum + goal.currentAmount,
    0
  );

  return (
    <>
      <PageHeader
        title={<I18nText k="goals.title" />}
        description={<I18nText k="goals.subtitle" />}
      />

      {totalGoals > 0 && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title={<I18nText k="goals.totalGoals" />}
            value={String(totalGoals)}
            icon={Target}
          />

          <StatCard
            title={<I18nText k="goals.completed" />}
            value={String(completedGoals)}
            icon={CheckCircle2}
            tone="income"
          />

          <StatCard
            title={<I18nText k="goals.totalTarget" />}
            value={formatTarget(totalTarget, currency)}
            icon={Flag}
          />

          <StatCard
            title={<I18nText k="goals.totalSaved" />}
            value={formatTarget(totalSaved, currency)}
            icon={PiggyBank}
            tone="income"
          />
        </div>
      )}

      <GoalsView goals={rows} currency={currency} />
    </>
  );
}

function formatTarget(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}