"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/components/i18n-provider";

export function PagePending({
  phase,
  feature,
}: {
  phase: number;
  feature: string;
}) {
  const { t } = useI18n();

  return (
    <Card>
      <CardContent className="py-16 text-center text-sm text-muted-foreground">
        {feature} — {t.common.loading} (Phase {phase})
      </CardContent>
    </Card>
  );
}