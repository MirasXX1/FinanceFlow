import { PageHeader } from "@/components/layout/page-header";
import { PagePending } from "@/components/layout/page-pending";

export const metadata = { title: "Goals" };

export default function GoalsPage() {
  return (
    <>
      <PageHeader title="Goals" description="Set financial goals and track your progress." />
      <PagePending phase={6} feature="Financial goals" />
    </>
  );
}
