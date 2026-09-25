"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, SearchX, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TransactionFormDialog } from "@/components/transactions/transaction-form-dialog";
import { TransactionsToolbar } from "@/components/transactions/transactions-toolbar";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { TransactionsPagination } from "@/components/transactions/transactions-pagination";
import { DeleteTransactionDialog } from "@/components/transactions/delete-transaction-dialog";
import type { CategoryOption, TransactionRow } from "@/lib/types";

type TransactionsViewProps = {
  transactions: TransactionRow[];
  categories: CategoryOption[];
  currency: string;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  /** Whether the user has any transactions at all (ignores filters). */
  hasTransactions: boolean;
};

export function TransactionsView({
  transactions,
  categories,
  currency,
  page,
  pageSize,
  total,
  totalPages,
  hasTransactions,
}: TransactionsViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<TransactionRow | null>(null);
  const [deleting, setDeleting] = useState<TransactionRow | null>(null);

  function resetFilters() {
    startTransition(() => {
      router.push("/transactions", { scroll: false });
    });
  }

  return (
    <div className={isPending ? "opacity-60 transition-opacity" : undefined}>
      <div className="mb-4 flex items-center justify-end">
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="size-4" />
          Add Transaction
        </Button>
      </div>

      {hasTransactions ? (
        <>
          <TransactionsToolbar categories={categories} />

          {transactions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <SearchX className="size-6 text-muted-foreground" />
                </span>

                <div>
                  <p className="font-medium">No transactions match your filters.</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Try changing the search or clearing the filters.
                  </p>
                </div>

                <Button variant="outline" onClick={resetFilters} disabled={isPending}>
                  Reset filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="py-2 md:py-0">
                <CardContent className="px-0 md:px-6">
                  <TransactionsTable
                    transactions={transactions}
                    currency={currency}
                    onEdit={setEditing}
                    onDelete={setDeleting}
                  />
                </CardContent>
              </Card>

              <TransactionsPagination
                page={page}
                pageSize={pageSize}
                total={total}
                totalPages={totalPages}
              />
            </>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Wallet className="size-6 text-muted-foreground" />
            </span>

            <div>
              <p className="font-medium">No transactions yet.</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Add your first income or expense to start tracking your money.
              </p>
            </div>

            <Button onClick={() => setCreateOpen(true)} className="gap-2">
              <Plus className="size-4" />
              Add Transaction
            </Button>
          </CardContent>
        </Card>
      )}

      <TransactionFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        type="EXPENSE"
        categories={categories}
        currency={currency}
      />

      <TransactionFormDialog
        open={Boolean(editing)}
        onOpenChange={(open) => !open && setEditing(null)}
        type={editing?.type ?? "EXPENSE"}
        categories={categories}
        currency={currency}
        transaction={editing}
      />

      <DeleteTransactionDialog
        transaction={deleting}
        currency={currency}
        onOpenChange={(open) => !open && setDeleting(null)}
      />
    </div>
  );
}
