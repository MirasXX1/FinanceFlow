import { PageHeader } from "@/components/layout/page-header";
import { PagePending } from "@/components/layout/page-pending";

export const metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Manage your profile and preferences." />
      <PagePending phase={8} feature="Settings" />
    </>
  );
}
