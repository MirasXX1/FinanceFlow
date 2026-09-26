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
import { useI18n } from "@/components/i18n-provider";

import type {
  CategoryOption,
  TransactionRow,
  TransactionType,
} from "@/lib/types";

type TransactionFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: TransactionType;
  categories: CategoryOption[];
  currency: string;
  transaction?: TransactionRow | null;
};

function getCategoryTranslation(
  name: string,
  categories: {
    food: string;
    transport: string;
    entertainment: string;
    education: string;
    shopping: string;
    health: string;
    bills: string;
    travel: string;
    other: string;
  }
) {
  const normalized = name.trim().toLowerCase();

  switch (normalized) {
    case "food":
      return categories.food;
    case "transport":
      return categories.transport;
    case "entertainment":
      return categories.entertainment;
    case "education":
      return categories.education;
    case "shopping":
      return categories.shopping;
    case "health":
      return categories.health;
    case "bills":
      return categories.bills;
    case "travel":
      return categories.travel;
    case "other":
      return categories.other;
    default:
      return name;
  }
}

export function TransactionFormDialog({
  open,
  onOpenChange,
  type,
  categories,
  currency,
  transaction = null,
}: TransactionFormDialogProps) {
  const isEdit = Boolean(transaction);
  const { t } = useI18n();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEdit ? (
              t.transactions.editTransaction
            ) : type === "INCOME" ? (
              <>
                <ArrowUpCircle className="size-5 text-emerald-600" />
                {t.transactions.income}
              </>
            ) : (
              <>
                <ArrowDownCircle className="size-5 text-red-600" />
                {t.transactions.expense}
              </>
            )}
          </DialogTitle>

          <DialogDescription>
            {isEdit
              ? t.transactions.editTransaction
              : t.transactions.addTransaction}
          </DialogDescription>
        </DialogHeader>

        {open && (
          <TransactionFormFields
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
  const { t } = useI18n();

  const isEdit = Boolean(transaction);

  const [transactionType, setTransactionType] =
    useState<TransactionType>(transaction?.type ?? type);

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
    transaction
      ? transaction.date.slice(0, 10)
      : todayDateString()
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isIncome = transactionType === "INCOME";

  const selectedCategory = categories.find(
    (category) => category.id === categoryId
  );

  const selectedCategoryLabel = selectedCategory
    ? getCategoryTranslation(
        selectedCategory.name,
        t.categories
      )
    : t.transactions.category;

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    const numericAmount = Number(amount);

    if (
      !amount ||
      Number.isNaN(numericAmount) ||
      numericAmount <= 0
    ) {
      setError(`${t.transactions.amount}: > 0`);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        type: transactionType,
        amount: numericAmount,
        categoryId:
          categoryId === "none" ? undefined : categoryId,
        description: description || undefined,
        date,
      };

      const response = await fetch(
        isEdit
          ? `/api/transactions/${transaction?.id}`
          : "/api/transactions",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(
          data?.error || t.transactions.editTransaction
        );
        return;
      }

      toast.success(
        isEdit
          ? t.transactions.editTransaction
          : transactionType === "INCOME"
            ? t.transactions.income
            : t.transactions.expense
      );

      onDone();
      router.refresh();
    } catch {
      setError(t.transactions.type);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {!isEdit && (
        <div
          className="grid grid-cols-2 gap-2"
          role="group"
          aria-label={t.transactions.type}
        >
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
            {t.transactions.income}
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
            {t.transactions.expense}
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="transaction-amount">
            {t.transactions.amount}
          </Label>

          <Input
            id="transaction-amount"
            type="number"
            min="0.01"
            step="0.01"
            inputMode="decimal"
            value={amount}
            onChange={(event) =>
              setAmount(event.target.value)
            }
            placeholder={`${t.transactions.amount} (${currency})`}
            required
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="transaction-category">
            {t.transactions.category}
          </Label>

          <Select
            value={categoryId}
            onValueChange={setCategoryId}
          >
            <SelectTrigger
              id="transaction-category"
              className="w-full"
            >
              <SelectValue
                placeholder={t.transactions.category}
              >
                {selectedCategoryLabel}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="none">
                {t.transactions.category}
              </SelectItem>

              {categories.map((category) => {
                const translatedName =
                  getCategoryTranslation(
                    category.name,
                    t.categories
                  );

                return (
                  <SelectItem
                    key={category.id}
                    value={category.id}
                  >
                    {translatedName}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="transaction-description">
          {t.transactions.description}
        </Label>

        <Input
          id="transaction-description"
          type="text"
          maxLength={500}
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          placeholder={t.transactions.description}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="transaction-date">
          {t.transactions.date}
        </Label>

        <Input
          id="transaction-date"
          type="date"
          value={date}
          onChange={(event) =>
            setDate(event.target.value)
          }
          required
        />
      </div>

      {error && (
        <p
          role="alert"
          className="text-sm text-destructive"
        >
          {error}
        </p>
      )}

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onDone}
          disabled={loading}
        >
          {t.common.cancel}
        </Button>

        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? `${
                isEdit
                  ? t.transactions.editTransaction
                  : isIncome
                    ? t.transactions.income
                    : t.transactions.expense
              }...`
            : isEdit
              ? t.transactions.editTransaction
              : isIncome
                ? t.transactions.income
                : t.transactions.expense}
        </Button>
      </DialogFooter>
    </form>
  );
}