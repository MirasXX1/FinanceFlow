import { auth } from "@/auth";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Logo } from "./logo";
import { LanguageSwitcher } from "./language-switcher";

export async function Topbar() {
  const session = await auth();
  const user = session?.user;
  const userName = user?.name || user?.email?.split("@")[0] || "User";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur md:px-8">
      <div className="md:hidden">
        <Logo href="/dashboard" />
      </div>

      <div className="hidden md:block" />

      <div className="flex items-center gap-2">
        <LanguageSwitcher />

        {/* Wired to real notifications in Phase 8 */}
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>

        <ThemeToggle />

        <div className="ml-2 flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <span className="hidden text-sm font-medium sm:inline">
            {userName}
          </span>
        </div>
      </div>
    </header>
  );
}