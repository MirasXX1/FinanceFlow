"use client";

import { useState } from "react";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TransactionForm } from "@/components/dashboard/transaction-form";

type Category = {
  id: string;
  name: string;
  icon: string;
};

type DashboardActionsProps = {
  categories: Category[];
  currency: string;
};

export function DashboardActions({
  categories,
  currency,
}: DashboardActionsProps) {
  const [activeType, setActiveType] = useState<
    "INCOME" | "EXPENSE" | null
  >(null);

  function refreshPage() {
    window.location.reload();
  }

  if (activeType) {
    return (
      <TransactionForm
        type={activeType}
        categories={categories}
        currency={currency}
        onSuccess={refreshPage}
        onCancel={() => setActiveType(null)}
      />
    );
  }

  return (
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
  );
}
