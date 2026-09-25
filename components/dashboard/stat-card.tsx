import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: ReactNode;
  value: string;
  icon: LucideIcon;
  tone?: "default" | "income" | "expense";
}

const toneStyles = {
  default: "bg-muted text-foreground",
  income:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  expense:
    "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
};

export function StatCard({
  title,
  value,
  icon: Icon,
  tone = "default",
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>

          <p className="mt-1 text-2xl font-bold tracking-tight">
            {value}
          </p>
        </div>

        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl",
            toneStyles[tone]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}