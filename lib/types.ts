import type { CurrencyCode } from "@/lib/format";

/**
 * Client-safe (serialized) types shared between server pages and client components.
 */

export type TransactionType = "INCOME" | "EXPENSE";

export interface CategoryOption {
  id: string;
  name: string;
  icon: string;
}

export interface TransactionRow {
  id: string;
  type: TransactionType;
  amount: number;
  description: string | null;
  /** ISO date string */
  date: string;
  categoryId: string | null;
  categoryName: string | null;
  categoryIcon: string | null;
}

export interface SessionUserInfo {
  id: string;
  name: string | null;
  email: string;
  currency: CurrencyCode;
}
