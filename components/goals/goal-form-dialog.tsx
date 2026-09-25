"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Target } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { GoalRow } from "@/lib/types";

type GoalFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currency: string;
  /** When provided, the dialog edits this goal instead of creating one. */
  goal?: GoalRow | null;
};

export const GOAL_COLORS = [
  { name: "Emerald", value: "#10b981" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Orange", value: "#f97316" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Pink", value: "#ec4899" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Red", value: "#ef4444" },
];

/** Maps legacy/named colors and hex values to a usable hex color. */
export function resolveGoalColor(color: string | null | undefined): string {
  if (!color) return "#10b981";

  if (/^#[0-9a-fA-F]{6}$/.test(color)) return color;

  const named: Record<string, string> = {
    blue: "#3b82f6",
    green: "#10b981",
    orange: "#f97316",
    purple: "#8b5cf6",
    pink: "#ec4899",
    teal: "#14b8a6",
    amber: "#f59e0b",
    red: "#ef4444",
    emerald: "#10b981",
    yellow: "#f59e0b",
    indigo: "#6366f1",
  };

  return named[color.toLowerCase()] ?? "#10b981";
}

export function GoalFormDialog({
  open,
  onOpenChange,
  currency,
  goal = null,
}: GoalFormDialogProps) {
  const isEdit = Boolean(goal);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="size-5 text-primary" />
            {isEdit ? "Edit Goal" : "New Goal"}
          </DialogTitle>

          <DialogDescription>
            {isEdit
              ? "Update the details of this goal."
              : "Set a savings target and track your progress."}
          </DialogDescription>
        </DialogHeader>

        {open && (
          <GoalFormFields
            key={`${goal?.id ?? "new"}`}
            currency={currency}
            goal={goal}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function GoalFormFields({
  currency,
  goal,
  onDone,
}: {
  currency: string;
  goal: GoalRow | null;
  onDone: () => void;
}) {
  const router = useRouter();
  const isEdit = Boolean(goal);

  const [name, setName] = useState(goal?.name ?? "");
  const [targetAmount, setTargetAmount] = useState(
    goal ? String(goal.targetAmount) : ""
  );
  const [currentAmount, setCurrentAmount] = useState(
    goal ? String(goal.currentAmount) : "0"
  );
  const [deadline, setDeadline] = useState(goal?.deadline?.slice(0, 10) ?? "");
  const [color, setColor] = useState(resolveGoalColor(goal?.color));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const target = Number(targetAmount);
    const current = Number(currentAmount || 0);

    if (!targetAmount || Number.isNaN(target) || target <= 0) {
      setError("Enter a valid target amount greater than 0.");
      return;
    }

    if (Number.isNaN(current) || current < 0) {
      setError("Current amount cannot be negative.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: name.trim(),
        targetAmount: target,
        currentAmount: current,
        deadline: deadline || undefined,
        color,
      };

      const response = await fetch(isEdit ? `/api/goals/${goal?.id}` : "/api/goals", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.error || "Something went wrong. Please try again.");
        return;
      }

      toast.success(isEdit ? "Goal updated." : "Goal created.");

      onDone();
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="goal-name">Goal name</Label>

        <Input
          id="goal-name"
          type="text"
          maxLength={100}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. MacBook"
          required
          autoFocus
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="goal-target">Target amount</Label>

          <Input
            id="goal-target"
            type="number"
            min="0.01"
            step="0.01"
            inputMode="decimal"
            value={targetAmount}
            onChange={(event) => setTargetAmount(event.target.value)}
            placeholder={`Target in ${currency}`}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="goal-current">Current amount</Label>

          <Input
            id="goal-current"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={currentAmount}
            onChange={(event) => setCurrentAmount(event.target.value)}
            placeholder={`Saved in ${currency}`}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="goal-deadline">Deadline (optional)</Label>

        <Input
          id="goal-deadline"
          type="date"
          value={deadline}
          onChange={(event) => setDeadline(event.target.value)}
        />
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium">Color</legend>

        <div className="flex flex-wrap gap-2">
          {GOAL_COLORS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-label={option.name}
              aria-pressed={color === option.value}
              onClick={() => setColor(option.value)}
              className={cn(
                "size-8 rounded-full border-2 transition-transform",
                color === option.value
                  ? "scale-110 border-foreground"
                  : "border-transparent hover:scale-105"
              )}
              style={{ backgroundColor: option.value }}
            />
          ))}
        </div>
      </fieldset>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone} disabled={loading}>
          Cancel
        </Button>

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Goal"}
        </Button>
      </DialogFooter>
    </form>
  );
}
