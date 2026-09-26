
import { auth, signOut } from "@/auth";
import { Bell, LogOut, Settings } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";

import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";

export async function Topbar() {
  const session = await auth();
  const user = session?.user;

  const userName =
    user?.name || user?.email?.split("@")[0] || null;

  async function handleSignOut() {
    "use server";

    await signOut({
      redirectTo: "/",
    });
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur md:px-8">
      <div className="md:hidden">
        <Logo href="/dashboard" />
      </div>

      <div className="hidden md:block" />

      <div className="flex items-center gap-2">
        <LanguageSwitcher />

        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </Button>

        <ThemeToggle />

        {userName && (
          <details className="group relative ml-2">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted [&::-webkit-details-marker]:hidden">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <span className="hidden text-sm font-medium sm:inline">
                {userName}
              </span>

              <span className="hidden text-xs text-muted-foreground transition-transform group-open:rotate-180 sm:inline">
                ▾
              </span>
            </summary>

            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border bg-popover p-2 text-popover-foreground shadow-lg">
              <div className="border-b px-3 py-2">
                <p className="truncate text-sm font-medium">
                  {userName}
                </p>

                {user?.email && (
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                )}
              </div>

              <div className="py-1">
                <Link
                  href="/settings"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>

                <form action={handleSignOut}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </form>
              </div>
            </div>
          </details>
        )}

        {!userName && (
          <Avatar className="ml-2 h-8 w-8">
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
        )}
      </div>
    </header>
  );
}
