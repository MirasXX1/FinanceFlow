import { KeyRound, Bell, Palette, UserRound } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import type { CurrencyCode } from "@/lib/format";

import { PageHeader } from "@/components/layout/page-header";
import {
  PasswordForm,
  PreferencesForm,
  ProfileForm,
} from "@/components/settings/settings-forms";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const sessionUser = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      name: true,
      email: true,
      currency: true,
      theme: true,
      notificationsEnabled: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your profile and preferences."
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserRound className="size-4 text-muted-foreground" />
              Profile
            </CardTitle>

            <CardDescription>Your public display name and email.</CardDescription>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            <ProfileForm name={user.name ?? ""} email={user.email} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="size-4 text-muted-foreground" />
              Preferences
            </CardTitle>

            <CardDescription>Currency, theme and notifications.</CardDescription>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            <PreferencesForm
              currency={user.currency as CurrencyCode}
              theme={user.theme}
              notificationsEnabled={user.notificationsEnabled}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <KeyRound className="size-4 text-muted-foreground" />
              Security
            </CardTitle>

            <CardDescription>
              Change your password. You will need it on your next sign-in.
            </CardDescription>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            <PasswordForm />
          </CardContent>
        </Card>

        {/* Reserved for Phase 8 notifications wiring */}
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Bell className="size-3.5" />
          More notification settings will arrive with goal reminders.
        </p>
      </div>
    </>
  );
}
