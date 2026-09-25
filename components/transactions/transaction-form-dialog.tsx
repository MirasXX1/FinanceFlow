"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { todayDateString } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CategoryOption, TransactionRow, TransactionType } from "@/lib/types";

type TransactionFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Preset type for create mode; also the initial value in edit mode. */
  type: TransactionType;
  categories: CategoryOption[];
  currency: string;
  /** When provided, the dialog edits this transaction instead of creating one. */
  transaction?: TransactionRow | null;
};

export function TransactionFormDialog({
  open,
  onOpenChange,
  type,
  categories,
  currency,
  transaction = null,
}: TransactionFormDialogProps) {
  const isEdit = Boolean(transaction);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEdit ? (
              "Edit Transaction"
            ) : type === "INCOME" ? (
              <>
                <ArrowUpCircle className="size-5 text-emerald-600" />
                Add Income
              </>
            ) : (
              <>
                <ArrowDownCircle className="size-5 text-red-600" />
                Add Expense
              </>
            )}
          </DialogTitle>

          <DialogDescription>
            {isEdit
              ? "Update the details of this transaction."
              : "Record a new income or expense in your history."}
          </DialogDescription>
        </DialogHeader>

        {open && (
          <TransactionFormFields
            // Remounting on open/transaction change resets the form state.
            key={`${transaction?.id ?? "new"}-${type}`}
            type={type}
            categories={categories}
            currency={currency}
            transaction={transaction}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

type TransactionFormFieldsProps = {
  type: TransactionType;
  categories: CategoryOption[];
  currency: string;
  transaction: TransactionRow | null;
  onDone: () => void;
};

function TransactionFormFields({
  type,
  categories,
  currency,
  transaction,
  onDone,
}: TransactionFormFieldsProps) {
  const router = useRouter();
  const isEdit = Boolean(transaction);

  const [transactionType, setTransactionType] = useState<TransactionType>(
    transaction?.type ?? type
  );
  const [amount, setAmount] = useState(
    transaction ? String(transaction.amount) : ""
  );
  const [categoryId, setCategoryId] = useState(
    transaction?.categoryId || "none"
  );
  const [description, setDescription] = useState(
    transaction?.description || ""
  );
  const [date, setDate] = useState(
    transaction ? transaction.date.slice(0, 10) : todayDateString()
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isIncome = transactionType === "INCOME";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const numericAmount = Number(amount);

    if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      setError("Enter a valid amount greater than 0.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        type: transactionType,
        amount: numericAmount,
        categoryId: categoryId === "none" ? undefined : categoryId,
        description: description || undefined,
        date,
      };

      const response = await fetch(
        isEdit ? `/api/transactions/${transaction?.id}` : "/api/transactions",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.error || "Something went wrong. Please try again.");
        return;
      }

      toast.success(
        isEdit
          ? "Transaction updated."
          : transactionType === "INCOME"
            ? "Income added."
            : "Expense added."
      );

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
      {!isEdit && (
        <div className="grid grid-cols-2 gap-2" role="group" aria-label="Transaction type">
          <button
            type="button"
            aria-pressed={isIncome}
            onClick={() => setTransactionType("INCOME")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
              isIncome
                ? "border-emerald-600 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <ArrowUpCircle className="size-4" />
            Income
          </button>

          <button
            type="button"
            aria-pressed={!isIncome}
            onClick={() => setTransactionType("EXPENSE")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
              !isIncome
                ? "border-red-600 bg-red-600/10 text-red-700 dark:text-red-400"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <ArrowDownCircle className="size-4" />
            Expense
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="transaction-amount">Amount</Label>

          <Input
            id="transaction-amount"
            type="number"
            min="0.01"
            step="0.01"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder={`Amount in ${currency}`}
            required
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="transaction-category">Category</Label>

          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger id="transaction-category" className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="none">No category</SelectItem>

              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="transaction-description">Description</Label>

        <Input
          id="transaction-description"
          type="text"
          maxLength={500}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder={isIncome ? "e.g. Monthly salary" : "e.g. Lunch"}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="transaction-date">Date</Label>

        <Input
          id="transaction-date"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          required
        />
      </div>

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
          {loading
            ? "Saving..."
            : isEdit
              ? "Save Changes"
              : isIncome
                ? "Add Income"
                : "Add Expense"}
        </Button>
      </DialogFooter>
    </form>
  );
}
