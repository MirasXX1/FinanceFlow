export type CurrencyCode = "KZT" | "USD" | "EUR";

export const CURRENCIES: { value: CurrencyCode; label: string; symbol: string }[] = [
  { value: "KZT", label: "Kazakhstani Tenge", symbol: "KZT" },
  { value: "USD", label: "US Dollar", symbol: "$" },
  { value: "EUR", label: "Euro", symbol: "€" },
];

/**
 * Formats a monetary amount with the given currency, e.g. "KZT 100,000".
 */
export function formatMoney(
  amount: number,
  currency: string,
  options?: { maximumFractionDigits?: number }
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
  }).format(amount);
}

/**
 * Compact money formatting without decimals — used for stat cards.
 */
export function formatMoneyCompact(amount: number, currency: string): string {
  return formatMoney(amount, currency, { maximumFractionDigits: 0 });
}

/**
 * "25 Sep 2026" — timezone-stable (UTC) short date.
 */
export function formatShortDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

/**
 * "25 Sep" — for dense lists.
 */
export function formatDayMonth(date: Date | string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(date));
}

/**
 * "1 June 2027" — for deadlines.
 */
export function formatLongDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

/**
 * "Sep 2026" — for chart month labels.
 */
export function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/**
 * "Sep" — short month label.
 */
export function formatMonth(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    timeZone: "UTC",
  }).format(date);
}

/**
 * Converts a `YYYY-MM-DD` string to a UTC-noon Date so the calendar day
 * stays stable regardless of the server/client timezone.
 */
export function dateToUtcNoon(dateString: string): Date {
  return new Date(`${dateString}T12:00:00.000Z`);
}

/**
 * Today as `YYYY-MM-DD` (local date of the viewer).
 */
export function todayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
