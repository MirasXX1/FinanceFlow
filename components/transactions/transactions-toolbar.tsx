
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
import { useI18n } from "@/components/i18n-provider";

import type { CategoryOption } from "@/lib/types";

type TransactionsToolbarProps = {
  categories: CategoryOption[];
};

const DEFAULT_SORT = "newest";

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

export function TransactionsToolbar({
  categories,
}: TransactionsToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { t } = useI18n();

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

    params.delete("page");

    const queryString = params.toString();

    startTransition(() => {
      router.push(
        queryString ? `/transactions?${queryString}` : "/transactions",
        { scroll: false }
      );
    });
  }

  function handleSearchChange(value: string) {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      updateParams({ q: value.trim() || null });
    }, 400);
  }

  function resetFilters() {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }

    updateParams({
      q: null,
      type: null,
      category: null,
      from: null,
      to: null,
      sort: null,
    });
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
          placeholder={t.transactions.searchPlaceholder}
          aria-label={t.transactions.searchPlaceholder}
          className="pl-9"
        />
      </div>

      <Select
        value={currentType}
        onValueChange={(value) =>
          updateParams({
            type: value === "ALL" ? null : value,
          })
        }
      >
        <SelectTrigger
          id="filter-type"
          className="w-full"
          aria-label={t.transactions.type}
        >
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">
            {t.transactions.allTypes}
          </SelectItem>

          <SelectItem value="INCOME">
            {t.transactions.income}
          </SelectItem>

          <SelectItem value="EXPENSE">
            {t.transactions.expense}
          </SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={currentCategory}
        onValueChange={(value) =>
          updateParams({
            category: value === "ALL" ? null : value,
          })
        }
      >
        <SelectTrigger
          id="filter-category"
          className="w-full"
          aria-label={t.transactions.category}
        >
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">
            {t.transactions.allCategories}
          </SelectItem>

          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {getCategoryTranslation(category.name, t.categories)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="grid grid-cols-2 gap-2 sm:col-span-2 lg:col-span-1">
        <Input
          type="date"
          defaultValue={currentFrom}
          max={currentTo || undefined}
          onChange={(event) =>
            updateParams({
              from: event.target.value || null,
            })
          }
          aria-label={t.transactions.fromDate}
          title={t.transactions.fromDate}
        />

        <Input
          type="date"
          defaultValue={currentTo}
          min={currentFrom || undefined}
          onChange={(event) =>
            updateParams({
              to: event.target.value || null,
            })
          }
          aria-label={t.transactions.toDate}
          title={t.transactions.toDate}
        />
      </div>

      <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
        <Select
          value={currentSort}
          onValueChange={(value) =>
            updateParams({
              sort: value,
            })
          }
        >
          <SelectTrigger
            id="sort"
            className="w-full flex-1"
            aria-label={t.transactions.type}
          >
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="newest">
              {t.transactions.newestFirst}
            </SelectItem>

            <SelectItem value="oldest">
              {t.transactions.oldestFirst}
            </SelectItem>

            <SelectItem value="highest">
              {t.transactions.highestAmount}
            </SelectItem>

            <SelectItem value="lowest">
              {t.transactions.lowestAmount}
            </SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={resetFilters}
            aria-label={t.transactions.resetFilters}
            title={t.transactions.resetFilters}
          >
            <X className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
