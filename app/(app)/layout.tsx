import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar />
      <div className="md:pl-64">
        <Topbar />
        <main className="mx-auto w-full max-w-6xl p-4 pb-24 md:p-8 md:pb-8">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
