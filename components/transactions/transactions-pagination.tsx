"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type TransactionsPaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export function TransactionsPagination({
  page,
  pageSize,
  total,
  totalPages,
}: TransactionsPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  if (total === 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  function goToPage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));

    startTransition(() => {
      router.push(`/transactions?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div
      className={cnPending(isPending) + " mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row"}
    >
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Showing <span className="font-medium text-foreground">{from}–{to}</span> of{" "}
        <span className="font-medium text-foreground">{total}</span> transactions
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1 || isPending}
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>

        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages || isPending}
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function cnPending(isPending: boolean) {
  return isPending ? "opacity-60 transition-opacity" : "";
}
