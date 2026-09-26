"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useI18n } from "@/components/i18n-provider";
import type { GoalRow } from "@/lib/types";

type DeleteGoalDialogProps = {
  goal: GoalRow | null;
  onOpenChange: (open: boolean) => void;
};

export function DeleteGoalDialog({
  goal,
  onOpenChange,
}: DeleteGoalDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

  async function handleDelete() {
    if (!goal) return;

    try {
      setLoading(true);

      const response = await fetch(`/api/goals/${goal.id}`, {
        method: "DELETE",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        toast.error(data?.error || t.goals.deleteGoal);
        return;
      }

      toast.success(t.goals.deleteGoal);
      onOpenChange(false);
      router.refresh();
    } catch {
      toast.error(t.goals.deleteGoal);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog
      open={Boolean(goal)}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t.goals.deleteConfirm}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {goal && (
              <>
                &ldquo;{goal.name}&rdquo; {t.goals.deleteConfirm}
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            {t.common.cancel}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              handleDelete();
            }}
            disabled={loading}
          >
            {loading
              ? `${t.common.delete}...`
              : t.common.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}