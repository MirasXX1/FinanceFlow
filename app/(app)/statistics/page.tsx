import { PageHeader } from "@/components/layout/page-header";
import { PagePending } from "@/components/layout/page-pending";

export const metadata = { title: "Statistics" };

export default function StatisticsPage() {
  return (
    <>
      <PageHeader title="Statistics" description="Understand where your money goes." />
      <PagePending phase={7} feature="Statistics and charts" />
    </>
  );
}
