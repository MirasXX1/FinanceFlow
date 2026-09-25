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
import { formatMoney } from "@/lib/format";
import type { TransactionRow } from "@/lib/types";

type DeleteTransactionDialogProps = {
  transaction: TransactionRow | null;
  currency: string;
  onOpenChange: (open: boolean) => void;
};

export function DeleteTransactionDialog({
  transaction,
  currency,
  onOpenChange,
}: DeleteTransactionDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!transaction) return;

    try {
      setLoading(true);

      const response = await fetch(`/api/transactions/${transaction.id}`, {
        method: "DELETE",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        toast.error(data?.error || "Failed to delete transaction.");
        return;
      }

      toast.success("Transaction deleted.");
      onOpenChange(false);
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog open={Boolean(transaction)} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this transaction?</AlertDialogTitle>

          <AlertDialogDescription>
            {transaction && (
              <>
                &ldquo;{transaction.description || transaction.categoryName || "Transaction"}&rdquo; (
                {transaction.type === "INCOME" ? "+" : "-"}
                {formatMoney(transaction.amount, currency)}) will be permanently removed. This
                action cannot be undone.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              handleDelete();
            }}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
