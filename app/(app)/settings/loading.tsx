import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <>
      <div className="mb-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>

      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="mb-6 h-64 w-full rounded-2xl" />
      ))}
    </>
  );
}
