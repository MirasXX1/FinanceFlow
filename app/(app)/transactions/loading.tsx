import { Skeleton } from "@/components/ui/skeleton";

export default function TransactionsLoading() {
  return (
    <>
      <div className="mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>

      <div className="mb-4 flex justify-end">
        <Skeleton className="h-9 w-40" />
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <Skeleton className="h-9 sm:col-span-2" />
        <Skeleton className="h-9" />
        <Skeleton className="h-9" />
        <Skeleton className="h-9 sm:col-span-2 lg:col-span-1" />
        <Skeleton className="h-9" />
      </div>

      <div className="rounded-2xl border bg-card">
        <div className="space-y-4 p-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </>
  );
}
