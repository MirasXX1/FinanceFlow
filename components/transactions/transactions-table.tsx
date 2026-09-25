"use client";

import { ArrowDownCircle, ArrowUpCircle, Pencil, Trash2 } from "lucide-react";

import { CategoryIcon } from "@/components/categories/category-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDayMonth, formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { TransactionRow } from "@/lib/types";

type TransactionsTableProps = {
  transactions: TransactionRow[];
  currency: string;
  onEdit: (transaction: TransactionRow) => void;
  onDelete: (transaction: TransactionRow) => void;
};

export function TransactionsTable({
  transactions,
  currency,
  onEdit,
  onDelete,
}: TransactionsTableProps) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {transactions.map((transaction) => {
              const isIncome = transaction.type === "INCOME";

              return (
                <TableRow key={transaction.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {formatDayMonth(transaction.date)}
                  </TableCell>

                  <TableCell className="max-w-64">
                    <span className="block truncate font-medium">
                      {transaction.description || "Transaction"}
                    </span>
                  </TableCell>

                  <TableCell>
                    {transaction.categoryName ? (
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <CategoryIcon icon={transaction.categoryIcon} />
                        {transaction.categoryName}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/60">—</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "gap-1",
                        isIncome
                          ? "border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400"
                          : "border-red-600/30 bg-red-600/10 text-red-700 dark:text-red-400"
                      )}
                    >
                      {isIncome ? (
                        <ArrowUpCircle className="size-3" />
                      ) : (
                        <ArrowDownCircle className="size-3" />
                      )}
                      {isIncome ? "Income" : "Expense"}
                    </Badge>
                  </TableCell>

                  <TableCell
                    className={cn(
                      "text-right font-semibold whitespace-nowrap",
                      isIncome ? "text-emerald-600" : "text-red-600"
                    )}
                  >
                    {isIncome ? "+" : "-"}
                    {formatMoney(transaction.amount, currency)}
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(transaction)}
                        aria-label={`Edit transaction from ${formatDayMonth(transaction.date)}`}
                      >
                        <Pencil className="size-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(transaction)}
                        aria-label={`Delete transaction from ${formatDayMonth(transaction.date)}`}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="divide-y md:hidden">
        {transactions.map((transaction) => {
          const isIncome = transaction.type === "INCOME";

          return (
            <div key={transaction.id} className="flex items-center gap-3 py-3">
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full",
                  isIncome
                    ? "bg-emerald-600/10 text-emerald-600"
                    : "bg-red-600/10 text-red-600"
                )}
              >
                <CategoryIcon icon={transaction.categoryIcon} className="size-4" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {transaction.description || "Transaction"}
                </p>

                <p className="text-xs text-muted-foreground">
                  {formatDayMonth(transaction.date)}
                  {transaction.categoryName ? ` · ${transaction.categoryName}` : ""}
                  {` · ${isIncome ? "Income" : "Expense"}`}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span
                  className={cn(
                    "text-sm font-semibold whitespace-nowrap",
                    isIncome ? "text-emerald-600" : "text-red-600"
                  )}
                >
                  {isIncome ? "+" : "-"}
                  {formatMoney(transaction.amount, currency)}
                </span>

                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={() => onEdit(transaction)}
                    aria-label="Edit transaction"
                  >
                    <Pencil className="size-3.5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 text-destructive hover:text-destructive"
                    onClick={() => onDelete(transaction)}
                    aria-label="Delete transaction"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
