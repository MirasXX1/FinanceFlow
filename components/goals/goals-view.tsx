"use client";

import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Pencil,
  Target,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  GoalFormDialog,
  resolveGoalColor,
} from "@/components/goals/goal-form-dialog";
import { DeleteGoalDialog } from "@/components/goals/delete-goal-dialog";
import { formatLongDate, formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n-provider";
import type { GoalRow } from "@/lib/types";

type GoalsViewProps = {
  goals: GoalRow[];
  currency: string;
};

export function GoalsView({ goals, currency }: GoalsViewProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<GoalRow | null>(null);
  const [deleting, setDeleting] = useState<GoalRow | null>(null);
  const { t } = useI18n();

  return (
    <>
      <div className="mb-4 flex items-center justify-end">
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Target className="size-4" />
          {t.goals.addGoal}
        </Button>
      </div>

      {goals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Target className="size-6 text-muted-foreground" />
            </span>

            <div>
              <p className="font-medium">{t.goals.noGoals}</p>

              <p className="mt-1 text-sm text-muted-foreground">
                {t.goals.subtitle}
              </p>
            </div>

            <Button onClick={() => setCreateOpen(true)} className="gap-2">
              <Target className="size-4" />
              {t.goals.addGoal}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {goals.map((goal) => {
            const color = resolveGoalColor(goal.color);
            const progress =
              goal.targetAmount > 0
                ? Math.min(
                    100,
                    Math.round(
                      (goal.currentAmount / goal.targetAmount) * 100
                    )
                  )
                : 0;
            const isCompleted = goal.currentAmount >= goal.targetAmount;

            return (
              <Card key={goal.id} className="overflow-hidden">
                <span
                  aria-hidden
                  className="block h-1.5 w-full"
                  style={{ backgroundColor: color }}
                />

                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      {isCompleted && (
                        <CheckCircle2
                          aria-label={t.goals.completed}
                          className="size-4 shrink-0 text-emerald-600"
                        />
                      )}

                      <span
                        className={cn(
                          isCompleted && "line-through opacity-70"
                        )}
                      >
                        {goal.name}
                      </span>
                    </CardTitle>

                    <div className="flex shrink-0 gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => setEditing(goal)}
                        aria-label={`${t.goals.editGoal}: ${goal.name}`}
                      >
                        <Pencil className="size-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleting(goal)}
                        aria-label={`${t.goals.deleteGoal}: ${goal.name}`}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-lg font-semibold tracking-tight">
                    {formatMoney(goal.currentAmount, currency)}
                    <span className="text-sm font-normal text-muted-foreground">
                      {" "}
                      / {formatMoney(goal.targetAmount, currency)}
                    </span>
                  </p>

                  <div className="mt-3">
                    <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{t.goals.progress}</span>
                      <span className="font-medium text-foreground">
                        {progress}%
                      </span>
                    </div>

                    <Progress
                      value={progress}
                      aria-label={`${goal.name}: ${progress}%`}
                      indicatorClassName={
                        isCompleted ? "bg-emerald-600" : undefined
                      }
                      indicatorColor={
                        isCompleted ? undefined : color
                      }
                    />
                  </div>
                </CardContent>

                <CardFooter className="text-xs text-muted-foreground">
                  {goal.deadline ? (
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="size-3.5" />

                      {goal.isOverdue && !isCompleted ? (
                        <span className="font-medium text-destructive">
                          {t.goals.deleteConfirm} ·{" "}
                          {formatLongDate(goal.deadline)}
                        </span>
                      ) : (
                        <>
                          {t.goals.deadline}:{" "}
                          {formatLongDate(goal.deadline)}
                        </>
                      )}
                    </span>
                  ) : (
                    <span>{t.goals.noDeadline}</span>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      <GoalFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        currency={currency}
      />

      <GoalFormDialog
        open={Boolean(editing)}
        onOpenChange={(open) => !open && setEditing(null)}
        currency={currency}
        goal={editing}
      />

      <DeleteGoalDialog
        goal={deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      />
    </>
  );
}