"use client";

import { useRef, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { CategoryOption } from "@/lib/types";

type TransactionsToolbarProps = {
  categories: CategoryOption[];
};

const DEFAULT_SORT = "newest";

export function TransactionsToolbar({ categories }: TransactionsToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentQ = searchParams.get("q") ?? "";
  const currentType = searchParams.get("type") ?? "ALL";
  const currentCategory = searchParams.get("category") ?? "ALL";
  const currentFrom = searchParams.get("from") ?? "";
  const currentTo = searchParams.get("to") ?? "";
  const currentSort = searchParams.get("sort") ?? DEFAULT_SORT;

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function updateParams(patch: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(patch)) {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    // Any filter change resets pagination.
    params.delete("page");

    const queryString = params.toString();

    startTransition(() => {
      router.push(queryString ? `/transactions?${queryString}` : "/transactions", {
        scroll: false,
      });
    });
  }

  function handleSearchChange(value: string) {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      updateParams({ q: value.trim() || null });
    }, 400);
  }

  function resetFilters() {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }

    updateParams({ q: null, type: null, category: null, from: null, to: null, sort: null });
  }

  const hasActiveFilters =
    Boolean(currentQ) ||
    currentType !== "ALL" ||
    currentCategory !== "ALL" ||
    Boolean(currentFrom) ||
    Boolean(currentTo) ||
    currentSort !== DEFAULT_SORT;

  return (
    <div
      className={cn(
        "mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6",
        isPending && "opacity-60 transition-opacity"
      )}
    >
      <div className="relative sm:col-span-2 lg:col-span-2">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />

        <Input
          ref={searchInputRef}
          type="search"
          defaultValue={currentQ}
          onChange={(event) => handleSearchChange(event.target.value)}
          placeholder="Search description or category..."
          aria-label="Search transactions"
          className="pl-9"
        />
      </div>

      <Select
        value={currentType}
        onValueChange={(value) => updateParams({ type: value === "ALL" ? null : value })}
      >
        <SelectTrigger id="filter-type" className="w-full" aria-label="Filter by type">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">All types</SelectItem>
          <SelectItem value="INCOME">Income</SelectItem>
          <SelectItem value="EXPENSE">Expense</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={currentCategory}
        onValueChange={(value) => updateParams({ category: value === "ALL" ? null : value })}
      >
        <SelectTrigger id="filter-category" className="w-full" aria-label="Filter by category">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">All categories</SelectItem>

          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="grid grid-cols-2 gap-2 sm:col-span-2 lg:col-span-1">
        <Input
          type="date"
          defaultValue={currentFrom}
          max={currentTo || undefined}
          onChange={(event) => updateParams({ from: event.target.value || null })}
          aria-label="From date"
          title="From date"
        />

        <Input
          type="date"
          defaultValue={currentTo}
          min={currentFrom || undefined}
          onChange={(event) => updateParams({ to: event.target.value || null })}
          aria-label="To date"
          title="To date"
        />
      </div>

      <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
        <Select value={currentSort} onValueChange={(value) => updateParams({ sort: value })}>
          <SelectTrigger id="sort" className="w-full flex-1" aria-label="Sort transactions">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="highest">Highest amount</SelectItem>
            <SelectItem value="lowest">Lowest amount</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={resetFilters}
            aria-label="Reset all filters"
            title="Reset all filters"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
