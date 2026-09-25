"use client";

import { useI18n } from "@/components/i18n-provider";
import { PageHeader } from "@/components/layout/page-header";

export function DashboardHeader() {
  const { t } = useI18n();

  return (
    <PageHeader
      title={t.dashboard.title}
      description={t.dashboard.subtitle}
    />
  );
}