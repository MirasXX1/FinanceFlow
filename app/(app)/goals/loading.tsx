import { Skeleton } from "@/components/ui/skeleton";

export default function GoalsLoading() {
  return (
    <>
      <div className="mb-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>

      <div className="mb-4 flex justify-end">
        <Skeleton className="h-9 w-32" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-56 w-full rounded-2xl" />
        ))}
      </div>
    </>
  );
}
