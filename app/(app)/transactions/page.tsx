import { PageHeader } from "@/components/layout/page-header";
import { PagePending } from "@/components/layout/page-pending";

export const metadata = { title: "Transactions" };

export default function TransactionsPage() {
  return (
    <>
      <PageHeader title="Transactions" description="Search, filter, and manage your transactions." />
      <PagePending phase={5} feature="Transaction management" />
    </>
  );
}
