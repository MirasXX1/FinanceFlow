"use client";

import { useState } from "react";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TransactionFormDialog } from "@/components/transactions/transaction-form-dialog";
import type { CategoryOption, TransactionType } from "@/lib/types";

type DashboardActionsProps = {
  categories: CategoryOption[];
  currency: string;
};

export function DashboardActions({
  categories,
  currency,
}: DashboardActionsProps) {
  const [activeType, setActiveType] = useState<TransactionType | null>(null);

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-3">
        <Button
          onClick={() => setActiveType("INCOME")}
          className="gap-2"
        >
          <ArrowUpCircle className="h-4 w-4" />
          Add Income
        </Button>

        <Button
          variant="outline"
          onClick={() => setActiveType("EXPENSE")}
          className="gap-2"
        >
          <ArrowDownCircle className="h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <TransactionFormDialog
        open={activeType !== null}
        onOpenChange={(open) => !open && setActiveType(null)}
        type={activeType ?? "EXPENSE"}
        categories={categories}
        currency={currency}
      />
    </>
  );
}
